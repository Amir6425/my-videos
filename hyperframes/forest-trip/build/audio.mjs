// The ambient bed (made by build/make_audio.py).
export default function audio(shots) {
  const total = Math.round(shots.reduce((a, s) => a + s.dur, 0) * 100) / 100;
  return `      <audio id="bed" class="clip" src="assets/audio/bed.mp3" data-start="0" data-duration="${total}" data-track-index="3" data-volume="0.6"></audio>`;
}
