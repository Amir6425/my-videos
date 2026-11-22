// The two audio tracks (made by build/make_audio.py) for index.html.
export default function audio(shots) {
  const total = Math.round(shots.reduce((a, s) => a + s.dur, 0) * 100) / 100;
  return `      <audio id="music" class="clip" src="assets/audio/music.mp3" data-start="0" data-duration="${total}" data-track-index="3" data-volume="0.55"></audio>
      <audio id="sfx" class="clip" src="assets/audio/sfx.mp3" data-start="0" data-duration="${total}" data-track-index="2" data-volume="1"></audio>`;
}
