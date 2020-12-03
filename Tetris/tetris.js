const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

//* アリーナの作成
function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0)); // 全ての要素を0で初期化
  }
  return matrix;
}

//* ブロックで埋まった行をクリア
function arenaSweep() {
  let rowCount = 1;

  // 行の全てが0以外なら一行クリア
  outer: for (let y = arena.length - 1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer; // 2次元目に1つでも0があったら、スキップして1次元目へ
      }
    }
    // 該当配列を1つ切り取って0で埋める
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row); // 先頭に新たな配列差し込み
    y++; // 差し込み分調整
    // 複数行をクリアする場合はスコアもアップ
    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

//* ブロックパターンの作成
function createPiece(type) {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

//* キャンバスに描画
function draw() {
  // テトリスのフィールド生成
  context.fillStyle = "#f3f2f2";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // アリーナのブロックを生成
  drawMatrix(arena, { x: 0, y: 0 });
  // プレイヤーのブロックを生成
  drawMatrix(player.matrix, player.pos);
}

//* 衝突の検知
function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      // プレイヤーのmatrixが0じゃない且つ、
      // アリーナのy+プレイヤーのyが存在し、
      // アリーナのmatrixも0じゃない場合は衝突
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

//* キャンバスにブロックを描画
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value]; // カラーを設定
        context.fillRect(x + offset.x, y + offset.y, 1, 1); // キャンバスに描画
      }
    });
  });
}

//* プレイヤーのマトリックスをアリーナに記録
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

//* 下に移動
function playerDrop() {
  player.pos.y++;

  // 下の移動先が衝突したらアリーナを更新してプレイヤーはリセット
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset(); // プレイヤーだけリセット
    //! debugger; デバッグ
    arenaSweep();
    updateScore();
  }

  dropCounter = 0; // 一回下に動かしたら描画までの間隔をリセット
}

//* 左右に移動
function playerMove(dir) {
  player.pos.x += dir;
  // 左右の移動先が衝突したら戻す
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

//* プレイヤーの初期化
function playerReset() {
  // プレイヤーのマトリックスをランダムで生成
  const pieces = "ILJOTSZ";
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.pos.y = 0;
  // アリーナ全体からプレイヤーのマトリックスを引いてセンターを設定
  player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

  // プレイヤーのyを0にしても、衝突するならゲームオーバー
  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

//* プレイヤーのブロックを回転
function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  // 回転した時の左右の衝突を回避
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));

    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

//* マトリックスの回転
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      // 列のデータを行へ移行
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  // ひっくり返す対象が違うことに注意
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

//* ゲームプレイ中繰り返し更新
function update(time = 0) {
  const deltaTime = time - lastTime; // 現在のフレーム開始時間と前回のフレーム開始時間の差異でデルタタイムを求める
  lastTime = time;

  // デルタタイムをカウントして、描画間隔を必ず1000ミリ秒で統一
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

//* スコアを更新
function updateScore() {
  document.getElementById("score").innerText = player.score;
}

//* カラー
const colors = [
  null,
  "#a8f3d6", // T
  "#b3ff66", // O
  "#fdc086", // L
  "#bcaefd", // J
  "#86ccfc", // I
  "#fdb8e8", // S
  "#ffff66", // Z
];

// * アリーナ
const arena = createMatrix(12, 20);
// console.table(arena);
// * プレイヤー
const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 37) {
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 81) {
    // Q
    playerRotate(-1);
  } else if (event.keyCode === 87) {
    // W
    playerRotate(1);
  }
});

playerReset();
updateScore();
update();
