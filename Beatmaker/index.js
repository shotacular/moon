window.addEventListener("load", () => {
  const sounds = document.querySelectorAll(".sound");
  const pads = document.querySelectorAll(".pads div");
  const visual = document.querySelector(".visual");
  const colors = [
    "#80f7b5",
    "#d36060",
    "#efa8fd",
    "#faf877",
    "#6860d3",
    "#7cf0f1",
  ];

  // サウンド設定
  pads.forEach((pad, index) => {
    pad.addEventListener("click", function () {
      // 連打できるように設定
      sounds[index].currentTime = 0;
      sounds[index].play();

      createBubbles(index);
    });
  });

  // バブルを生成
  const createBubbles = (index) => {
    const bubble = document.createElement("div");
    visual.appendChild(bubble);
    bubble.style.backgroundColor = colors[index];
    bubble.style.animation = "jump 1s ease";
    bubble.addEventListener("animationend", function () {
      visual.removeChild(this);
    });
  };
});
