function playAudio (src, vol) {
  if (vol > 0) {
    const audio = new Audio();
    audio.src = src;
    audio.volume = vol;
    audio.play();
  }
}

module.exports = {
  playAudio,
};
