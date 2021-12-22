const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = new Board();
function play() {
  board.reset();
  let piece = new Piece(ctx);
  piece.draw();

  board.piece = piece; 
}

moves = {
  [KEY.LEFT]:  p => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]:  p => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: p => (board.rotate(p))
};

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
      board.piece = Object.assign(board.piece, p);
      //그리기 전에 이전 좌표를 지운다.
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      board.piece.draw();
    }

  }
})