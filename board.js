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

  //보드 초기화와 관련된 함수들-----------------------
  reset() {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  //0으로 채워진 행렬을 얻는다.
  getEmptyGrid() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }
  //--------------------------------------------------

  //다음 피스 ctxNext에 표시하기
  getNewPiece() {
    const {width, height} = this.ctxNext.canvas;
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }

  //보드 위 요소들을 그리는 함수들--------------------
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
  //-------------------------------------------------

  //valid 함수와 이를 돕는 보조 함수들---------------
  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (this.isEmty(value) || (this.insideWalls(x) && this.aboveFloor(x, y)));
      });
    });
  }

  isEmty(value) {
    return value === 0;
  }

  insideWalls(x) {
    return x >= 0 && x < 10;
  }

  aboveFloor(x, y) {
    return y < 20 && (this.grid[y][x] === 0);
  }
  //-------------------------------------------------

  //piece 동작과 관련된 함수들-----------------------
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
    return clone;
  }

  //단위 시간마다 piece를 떨어뜨리기 위한 함수. drop 후 piece가 조작 가능하면 true를 리턴
  drop() {
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      if(this.piece.y === 0) {
        return false;
      }
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
      account.score += (keyCodeBuf === KEY.SPACE ? POINTS.HARD_DROP : POINTS.SOFT_DROP);;
    }
    return true;
  }
  
  clearLines() {
    let clearedLines = 0;

    this.grid.forEach((row, y) => {
      if(row.every(value => value > 0)) {
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
        clearedLines++;
      }
    });

    account.score += (account.level + 1) * this.getLineClearPoints(clearedLines);
    account.lines += clearedLines;
    if(account.lines >= LINES_PER_LEVEL) {
      account.level++;
      account.lines -= LINES_PER_LEVEL;
      time.level = LEVEL[account.level];
    }
  }
  
  getLineClearPoints(lines) {
    return lines === 1 ? POINTS.SINGLE :
           lines === 2 ? POINTS.DOUBLE :
           lines === 3 ? POINTS.TRIPLE :
           lines === 4 ? POINTS.TETRIS :
           0;
  }

  //piece를 grid에 포함시킴으로서 멈추는 함수
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }
  //-------------------------------------------------
}