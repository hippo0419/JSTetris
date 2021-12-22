class Board {
  grid;

  //새 게임이 시작되면 보드를 초기화한다.
  reset() {
    this.grid = this.getEmptyBoard();
  }

  //0으로 채워진 행렬을 얻는다.
  getEmptyBoard() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
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