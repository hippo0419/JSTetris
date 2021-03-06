const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

let keyCodeBuf

let accountValues = {
  score: 0,
  level: 0,
  lines: 0
}

const moves = {
  [KEY.LEFT]:  p => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]:  p => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: p => board.rotate(p)
}

function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

function initNext() {
  // Calculate size of canvas from constants.
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset();
  time = { start: 0, elapsed: 0, level: LEVEL[account.level]};
}

function play() {
  resetGame();
  board.piece.draw();
  animate();
}

function animate(now = 0) {
  time.elapsed = now - time.start;
  if(time.elapsed > time.level) {
    time.start = now;
    if(!board.drop()) {
      gameOver();
      return;
    }
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  board.draw();
  requestId = requestAnimationFrame(animate);
}

function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = "black";
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = "1px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", 1.8, 4);
}

let board = new Board(ctx, ctxNext);
initNext();

document.addEventListener("keydown", event => {
  if (moves[event.keyCode]) {
    //이벤트 버블링을 막는다.
    event.preventDefault();

    //조각의 새 상태를 얻는다.
    let p = moves[event.keyCode](board.piece);

    if(event.keyCode === KEY.SPACE) {
      //하드 드롭한다.
      while(board.valid(p)) {
        board.piece.move(p);
        p = moves[KEY.DOWN](board.piece);
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      board.piece.draw();
    }

    if(board.valid(p)) {
      //이동이 가능한 상태라면 조각을 이동한다.
      board.piece.move(p);
      //그리기 전에 이전 좌표를 지운다.
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      board.piece.draw();
    }
    keyCodeBuf = event.keyCode;
  }
});
