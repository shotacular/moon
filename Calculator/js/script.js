const $input = document.querySelector("input");
const decimal = document.querySelector(".decimal__key");

let displayVal = "0";
let pendingVal;
let buffer = [];
let canAdd = false;

let updateDisplayVal = (clickObj) => {
  let btnText = clickObj.target.innerText;

  if (displayVal == "0" || !canAdd) {
    displayVal = "";
  }

  displayVal += btnText;
  $input.value = displayVal;
  canAdd = true;
};

let performOperation = (clickObj) => {
  let operator = clickObj.target.innerText;

  switch (operator) {
    case "+":
      pendingVal = displayVal;
      displayVal = "0";
      $input.value = displayVal;
      buffer.push(pendingVal);
      buffer.push("+");
      canAdd = false;
      break;
    case "-":
      pendingVal = displayVal;
      displayVal = "0";
      $input.value = displayVal;
      buffer.push(pendingVal);
      buffer.push("-");
      canAdd = false;
      break;
    case "×":
      pendingVal = displayVal;
      displayVal = "0";
      $input.value = displayVal;
      buffer.push(pendingVal);
      buffer.push("*");
      canAdd = false;
      break;
    case "÷":
      pendingVal = displayVal;
      displayVal = "0";
      $input.value = displayVal;
      buffer.push(pendingVal);
      buffer.push("/");
      canAdd = false;
      break;
    case "%":
      displayVal *= 0.01;
      $input.value = displayVal;
      canAdd = false;
      break;
    case "+/-":
      displayVal = -displayVal;
      $input.value = displayVal;
      canAdd = false;
      break;
    case "=":
      buffer.push(displayVal);
      let evaluation = eval(buffer.join(" "));
      displayVal = evaluation + "";
      $input.value = displayVal;
      buffer = [];
      pendingVal = null;
      canAdd = false;
      break;
    default:
      break;
  }
};

// ナンバーボタンにイベント追加
Array.from(document.querySelectorAll(".num__key")).forEach((el) => {
  el.addEventListener("click", updateDisplayVal);
});

// 演算ボタンにイベント追加
Array.from(document.querySelectorAll(".op__key")).forEach((el) => {
  el.addEventListener("click", performOperation);
});

decimal.onclick = () => {
  if (!displayVal.includes(".")) {
    displayVal += ".";
  }
  $input.value = displayVal;
};

// クリア押下
document.querySelector(`.op__key[op=clear]`).onclick = () => {
  displayVal = "0";
  pendingVal = undefined;
  buffer = [];
  $input.value = displayVal;
};
