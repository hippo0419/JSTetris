const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = [
  "none",
  "cyan",
  "blue",
  "orange",
  "yellow",
  "green",
  "purple",
  "red"
];

const SHAPES = [
  [],
  [[0, 0, 0, 0],
   [1, 1, 1, 1],
   [0, 0, 0, 0],
   [0, 0, 0, 0]],
  [[2, 0, 0],
   [2, 2, 2],
   [0, 0, 0]],
  [[0, 0, 3], // 0,0 -> 2,0 ; 0,1 -> 1,0 ; 0,2 -> 0,0
   [3, 3, 3], // 1,0 -> 2,1 ; 1,1 -> 1,1 ; 1,2 -> 0,1 
   [0, 0, 0]],// 2,0 -> 2,2 ; 2,1 -> 1,2 ; 2,2 -> 0,2
  [[4, 4],
   [4, 4]],
  [[0, 5, 5],
   [5, 5, 0],
   [0, 0, 0]],
  [[0, 6, 0],
   [6, 6, 6],
   [0, 0, 0]],
  [[7, 7, 0],
   [0, 7, 7],
   [0, 0, 0]]
];

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  UP: 38
};
Object.freeze(KEY);

const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
};
Object.freeze(POINTS);

const DROPCASE = {
  CONTINUE: 0,
  GAMEOVER: 1,
  FREEZE:   2
};

const LINES_PER_LEVEL = 10;
const LEVEL = {
  0: 800,
  1: 720,
  2: 630,
  3: 550
};
Object.freeze(LEVEL);