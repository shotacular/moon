//? ------------ Portfolio 作成 ------------
const portfolio = [
  {
    category: "utility",
    title: "Meditation-App",
    img: "./images/portfolio/Meditation-App.png",
    url: "./Meditation-App",
  },
  {
    category: "game",
    title: "〇✕ゲーム",
    img: "./images/portfolio/Tic-Tac-Toe.png",
    url: "./Tic-Tac-Toe",
  },
  {
    category: "utility",
    title: "Weather-App",
    img: "./images/portfolio/Weather.png",
    url: "./Weather-App",
  },
  {
    category: "game",
    title: "Trick-or-Match",
    img: "./images/portfolio/Trick-or-Match.png",
    url: "./Trick-or-Match",
  },
  {
    category: "game",
    title: "テトリス",
    img: "./images/portfolio/Tetris.png",
    url: "./Tetris",
  },
  {
    category: "game",
    title: "Beatmaker",
    img: "./images/portfolio/Beatmaker.png",
    url: "./Beatmaker",
  },
  {
    category: "utility",
    title: "to-doリスト",
    img: "./images/portfolio/Todo-List.png",
    url: "./Todo-list",
  },
  {
    category: "website",
    title: "Restaurant",
    img: "./images/portfolio/Adare-Restaurant.png",
    url: "./Restaurant",
  },
  {
    category: "website",
    title: "Travel",
    img: "./images/portfolio/Travelville.png",
    url: "./Travelville",
  },
  {
    category: "utility",
    title: "電卓",
    img: "./images/portfolio/Calculator.png",
    url: "./Calculator",
  },
  {
    category: "game",
    title: "RPSゲーム",
    img: "./images/portfolio/Rock-Paper-Scissors-Game.png",
    url: "./Rock-Paper-Scissors-Game",
  },
];

const portfolioGallery = document.querySelector(".portfolio-gallery");
const container = document.querySelector("#filter-btns");

window.addEventListener("DOMContentLoaded", function () {
  displayPortfolioGallery(portfolio);
  displayMenuButtons();
  switchMenuButtons();
});

//* ポートフォリオの表示
function displayPortfolioGallery(portfolio) {
  let displayPortfolio = portfolio.map(function (item) {
    return `<div class="item" data-id=${item.category}>
    <div class="inner">
      <img src=${item.img} alt=${item.title}>
      <div class="overlay">
        <a href=${item.url}>
          <span class="fa fa-search"></span>
        </a>
        <h4>${item.title}</h4>
      </div>
    </div>
  </div>`;
  });
  displayPortfolio = displayPortfolio.join("");
  portfolioGallery.innerHTML = displayPortfolio;
}

//* カテゴリボタンの表示
function displayMenuButtons() {
  // カテゴリの取得
  const categories = portfolio.reduce(
    function (values, item) {
      if (!values.includes(item.category)) {
        values.push(item.category);
      }
      return values;
    },
    ["all"]
  );

  // カテゴリボタンを作成
  const categoryBtns = categories
    .map(function (category) {
      return `<li data-target=${category}>${category}</li>`;
    })
    .join("");
  container.innerHTML = categoryBtns;
}

// *カテゴリボタンで表示の切り替え
function switchMenuButtons() {
  const items = document.querySelector(".portfolio-gallery").children;
  const filterBtns = document.querySelector("#filter-btns").children;

  filterBtns[0].classList.add("active");

  for (let i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener("click", function () {
      for (let j = 0; j < filterBtns.length; j++) {
        filterBtns[j].classList.remove("active");
      }
      this.classList.add("active");
      const target = this.getAttribute("data-target");

      for (let j = 0; j < items.length; j++) {
        items[j].style.display = "none";
        if (target == items[j].getAttribute("data-id")) {
          items[j].style.display = "block";
        }
        if (target == "all") {
          items[j].style.display = "block";
        }
      }
    });
  }
}

//? ------------ Testimonial 作成 ------------
const sliderContainer = document.querySelector(".testi-slider");
const slides = sliderContainer.children;
const containerWidth = sliderContainer.offsetWidth;
const margin = 30;
let itemPerSlide = 0;
let slideDots;

// responsive
const responsive = [
  { breakPoint: { width: 0, item: 1 } },
  { breakPoint: { width: 991, item: 2 } },
];

function load() {
  for (let i = 0; i < responsive.length; i++) {
    if (window.innerWidth > responsive[i].breakPoint.width) {
      itemPerSlide = responsive[i].breakPoint.item;
    }
  }
  start();
}

function start() {
  // スライドのサイズ調整
  totalWidth = 0;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.width = containerWidth / itemPerSlide - margin + "px";
    slides[i].style.margin = margin / 2 + "px";
    totalWidth += containerWidth / itemPerSlide;
  }
  sliderContainer.style.width = totalWidth + "px";

  // スライドのコントロール生成
  slideDots = Math.ceil(slides.length / itemPerSlide);

  for (let i = 0; i < slideDots; i++) {
    const div = document.createElement("div");
    div.id = i;
    div.setAttribute("onclick", "controlSlide(this)");
    if (i == 0) {
      div.classList.add("active");
    }
    document.querySelector(".slide-controls").appendChild(div);
  }
}

let currentSlide = 0;
let autoSlide = 0;

// スライドのコントロール部のクリックイベント処理
function controlSlide(element) {
  clearInterval(timer);
  timer = setInterval(autoPlay, 5000);
  autoSlide = element.id;
  currentSlide = element.id;
  changeSlide(currentSlide);
}

// スライドさせる
function changeSlide(currentSlide) {
  controlButtons = document.querySelector(".slide-controls").children;
  for (let i = 0; i < controlButtons.length; i++) {
    controlButtons[i].classList.remove("active");
  }
  controlButtons[currentSlide].classList.add("active");

  // 表示幅分をマイナスしてスライドさせる
  sliderContainer.style.marginLeft = -(containerWidth * currentSlide) + "px";
}

// 自動でスライドさせる
function autoPlay() {
  if (autoSlide == slideDots - 1) {
    autoSlide = 0;
  } else {
    autoSlide++;
  }
  changeSlide(autoSlide);
}

let timer = setInterval(autoPlay, 5000);

window.onload = load();

//? ------------ Header 固定 ------------
window.onscroll = function () {
  const docScrollTop = document.documentElement.scrollTop;
  const header = document.querySelector("header");

  if (window.innerWidth > 991) {
    if (docScrollTop > 100) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }
  }
};

// navbarのリンクの設定
const navbar = document.querySelector(".navbar");
const a = navbar.querySelectorAll("a");

a.forEach(function (element) {
  element.addEventListener("click", function () {
    for (let i = 0; i < a.length; i++) {
      a[i].classList.remove("active");
    }
    this.classList.add("active");
    document.querySelector(".navbar").classList.toggle("show");
  });
});

//? ------------ ハンバーガーメニュー ------------

const hamburger = document.querySelector(".ham-burger");

hamburger.addEventListener("click", function () {
  document.querySelector(".navbar").classList.toggle("show");
});
