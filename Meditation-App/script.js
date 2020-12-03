const app = () => {
  const song = document.querySelector(".song");
  const play = document.querySelector(".play");
  const outline = document.querySelector(".moving-outline circle");
  const video = document.querySelector(".vid-container video");

  // Sounds
  const sounds = document.querySelectorAll(".sound-picker button");
  // Time Display
  const timeDisplay = document.querySelector(".time-display");
  const timeSelect = document.querySelectorAll(".time-select button");
  //   Get the Length of the outline
  const outlineLength = outline.getTotalLength();
  // Duration
  let fakeDuration = 3600;

  outline.style.strokeDasharray = outlineLength;
  outline.style.strokeDashoffset = outlineLength;

  // pick different sounds
  sounds.forEach((sound) => {
    sound.addEventListener("click", function () {
      song.src = this.getAttribute("data-sound");
      video.src = this.getAttribute("data-video");
      checkPlaying(song);
    });
  });

  // play sound
  play.addEventListener("click", () => {
    checkPlaying(song);
  });

  // select sound
  timeSelect.forEach((option) => {
    option.addEventListener("click", function () {
      fakeDuration = this.getAttribute("data-time");
      timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(
        fakeDuration % 60
      )}0`;
      outline.style.strokeDasharray = outlineLength;
      outline.style.strokeDashoffset = outlineLength;
      song.currentTime = 0;
    });
  });

  // sound control
  const checkPlaying = (song) => {
    if (song.paused) {
      song.play();
      video.play();
      play.src = "./svg/pause.svg";
    } else {
      song.pause();
      video.pause();
      play.src = "./svg/play.svg";
    }
  };

  // animate the circle
  song.ontimeupdate = () => {
    // songの残り時間を求める
    let currentTime = song.currentTime;
    let elapsed = fakeDuration - currentTime;
    let seconds = Math.floor(elapsed % 60);
    let minutes = Math.floor(elapsed / 60);

    let formattedSeconds = ( '0' + seconds ).slice( -2 );

    // 現在は指定時間の何割かを先に求めて、全体の長さを掛けることで、今の長さが求まる
    let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
    outline.style.strokeDashoffset = progress;

    // 時間テキストのアニメーション
    timeDisplay.textContent = `${minutes}:${formattedSeconds}`;

    if (currentTime >= fakeDuration) {
      song.pause();
      video.pause();
      play.src = "./svg/play.svg";
      song.currentTime = 0;
    }
  };
};

app();
