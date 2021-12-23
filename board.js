class Board {
  //게임 보드와 다음 블록 컨텍스트 받아오기
  ctx;
  ctxNext;
  piece;
  next;
  grid;
  
  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.init();
    }
  
  init() {
    //contants.js를 참고한 보드 크기 설정
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    //ctx.scale()을 이용한 단위 크기 조정
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  //0으로 채워진 행렬을 얻는다.
  getEmptyGrid() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }

  //다음 피스 받아오기
  getNewPiece() {
    const {width, height} = this.ctxNext.canvas;
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      })
    })
  }

  reset() {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  isEmty(value) {
    return value === 0;
  }

  insideWalls(x) {
    return x >= 0 && x < 10;
  }

  aboveFloor(y) {
    return y < 20;
  }

  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (this.isEmty(value) || (this.insideWalls(x) && this.aboveFloor(y)));
      });
    });
  }

  rotate(p){
    // 불변성을 위해 JSON으로 복사
    let clone = JSON.parse(JSON.stringify(p));
    // 알고리즘 처리
    for (let y = 0; y < clone.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]];
      }
    }
    clone.shape.forEach((row) => row.reverse());

    if(this.valid(clone)) {
      return clone
    }
    return p;
  }
}