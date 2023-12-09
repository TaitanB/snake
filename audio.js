const audioPlayer = document.getElementById("audioPlayer");
const audioToggle = document.getElementById("audioToggle");

audioToggle.addEventListener("change", () => {
  if (audioToggle.checked) {
    playNextTrack();
  } else {
    audioPlayer.pause();
  }
});

const playlist = [
  "audio/captain-reggae-156203.mp3",
  "audio/colt-fingaz-snakes-of-sahara-176750.mp3",
  "audio/do-not-wake-the-snake-164474.mp3",
  "audio/flying-cobra-120600.mp3",
  "audio/snake-moon-134886.mp3",
  "audio/tropical-forest-house-160667.mp3",
];

let currentTrack = 0;

function playNextTrack() {
  audioPlayer.src = playlist[currentTrack];
  audioPlayer.volume = 0.3;
  audioPlayer.play();
  currentTrack = (currentTrack + 1) % playlist.length;
}

audioPlayer.addEventListener("ended", playNextTrack);
