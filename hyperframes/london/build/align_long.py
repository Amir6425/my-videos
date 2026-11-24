"""Aligns one long narration file to the text of many shots. Speech segments come from silencedetect; the words
are spread over them by dynamic programming so that pauses fall on punctuation where possible and the speaking
rate stays even. Writes build/words_long.json: per shot, its words (times in the file) and its span.
Run: python3 build/align_long.py"""
import json, os, re, subprocess
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
cfg = json.load(open(os.path.join(HERE, "long.json")))
AUD = os.path.join(ROOT, cfg["audio"])
log = subprocess.run(["ffmpeg", "-nostdin", "-i", AUD, "-af", "silencedetect=noise=-35dB:d=0.22", "-f", "null", "-"], capture_output=True, text=True).stderr
ss = [float(v) for v in re.findall(r"silence_start: ([\d.]+)", log)]; se = [float(v) for v in re.findall(r"silence_end: ([\d.]+)", log)]
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", AUD], capture_output=True, text=True).stdout)
edges = sorted([(v, "s") for v in ss] + [(v, "e") for v in se]); segs, cur = [], 0.0
for v, k in edges:
    if k == "s" and v - cur > 0.05: segs.append((cur, v))
    if k == "e": cur = v
if dur - cur > 0.05: segs.append((cur, dur))
# words with shot ids
W, SH = [], []
for i, s in enumerate(cfg["shots"]):
    for w in s["text"].split(): W.append(w); SH.append(i)
sp = cfg.get("spoken", {})
L = np.array([max(1, len(re.sub(r"[^\w]", "", sp.get(w, w)))) + 1.5 for w in W])  # +1.5: each word has a small fixed cost
def brk(i):  # cost of putting a pause after word i (lower at punctuation and shot ends)
    w = W[i]
    if i == len(W) - 1 or SH[i] != SH[i + 1]: return 0.0
    if re.search(r"[.!?؟…]$", w): return 0.1
    if re.search(r"[،,؛:;]$", w): return 0.4
    return 1.6
S, N = len(segs), len(W)
D = np.array([b - a for a, b in segs]); rate = D.sum() / L.sum()
C = np.concatenate([[0], np.cumsum(L)])
INF = 1e18; best = np.full((S + 1, N + 1), INF); prev = np.zeros((S + 1, N + 1), dtype=int); best[0, 0] = 0
for s in range(1, S + 1):
    for j in range(s, N - (S - s) + 1):
        lo = max(s - 1, j - 60)
        ii = np.arange(lo, j); cand = best[s - 1, ii]
        ok = cand < INF
        if not ok.any(): continue
        exp = (C[j] - C[ii]) * rate
        cost = cand + ((D[s - 1] - exp) / max(0.3, D[s - 1])) ** 2 * 4 + brk(j - 1)
        k = np.argmin(cost); best[s, j] = cost[k]; prev[s, j] = ii[k]
# backtrack
bounds = [N]; j = N
for s in range(S, 0, -1): j = prev[s, j]; bounds.append(j)
bounds = bounds[::-1]
times = [None] * N
for s in range(S):
    a, b = segs[s]; i0, i1 = bounds[s], bounds[s + 1]; tot = L[i0:i1].sum(); t = a
    for i in range(i0, i1):
        e = t + (b - a) * L[i] / tot; times[i] = (round(t, 3), round(e, 3)); t = e
out = {"duration": dur, "lead": cfg["lead"], "tail": cfg["tail"], "shots": []}
for si, s in enumerate(cfg["shots"]):
    idx = [i for i in range(N) if SH[i] == si]
    out["shots"].append({"shot": s["shot"], "words": [{"w": W[i], "start": times[i][0], "end": times[i][1]} for i in idx]})
json.dump(out, open(os.path.join(HERE, "words_long.json"), "w"), ensure_ascii=False, indent=1)
for s in out["shots"]:
    ws = s["words"]; print(f'{s["shot"]:4} {ws[0]["start"]:7.2f}-{ws[-1]["end"]:7.2f}  {ws[0]["w"]} … {ws[-1]["w"]}')
