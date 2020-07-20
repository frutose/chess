// Images source: https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Chess_Pieces_Sprite.svg/2000px-Chess_Pieces_Sprite.svg.png

const size = 400;
const scl = size / 8;
const board = {
  off: 50,
  generateCells: () => {
    // like a matrix, i is to the rows and j is to the cols
    let cells = [];
    for(let i = 0; i < 8; i++){
      cells[i] = [];
      for(let j = 0; j < 8; j++) {
        let x = board.off + j * scl;
        let y = board.off + i * scl;
        let position = createVector(x, y);
        if((i + j) % 2 == 0) {
          cells[i][j] = {
                          color: "white",
                          pos: position,
                          occupied: ""
                        };
        } else {
          cells[i][j] = {
                          color: "gray",
                          pos: position,
                          occupied: ""
                        };
        }
      }
    }
    return cells;
  },
  
  show: (cells) => {
    let off = board.off;
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        let x = cells[i][j].pos.x;
        let y = cells[i][j].pos.y;
        push();
        fill(cells[i][j].color);
        rect(x, y, scl, scl);
        pop();
      }
    }
  },
  
  showCoordinates: () => {
    let i = 8;
    let letters = "ABCDEFGH"
    for(let y = 80; y < size + 50; y += 50) {
      text(str(i), 35, y);
      i--;
    }
    for(let x = 70; x < size + 50; x += 50) {
      text(letters[i], x, 470);
      i++;
    }
  },
  
};
var cells;
var current, pSelected;
var whites = [];
var blacks = [];
var chess_pieces;
var selectedPoss = [];

function preload() {
  chess_pieces = loadImage("chess_pieces.png");
}

function setup() {
  createCanvas(500, 500);
  strokeWeight(2);
  textSize(16);
  cells = board.generateCells();
  generatePlayers();
  current = whites;
  for(let p of whites) {
    p.occupy();
  }
  for(let p of blacks) {
    p.occupy();
  }
}

function draw() {
  background(220);
  board.show(cells);
  board.showCoordinates();
  showPossibilites();
  for(let p of whites) {
    p.show();
  }
  for(let p of blacks) {
    p.show();
  }
}

function mousePressed() {
  if(mouseX > board.off && mouseX < size + board.off && mouseY > board.off && mouseY < size + board.off) {
    if(pSelected) {
      let newPos = findCell(mouseX, mouseY);
      pSelected.move(newPos.i, newPos.j);
      pSelected = undefined;
      selectedPoss = [];
      return;
    }
    for(let p of current) {
      p.clicked(mouseX, mouseY);
    }
    if(pSelected) {
      selectedPoss = pSelected.chkPossibilities();
    }
  }
}

class Piece {
  constructor(i, j, type, color) {
    this.i = i;
    this.j = j;
    this.type = type;
    this.color = color;
  }
  
  show() {
    let x = cells[this.i][this.j].pos.x;
    let y = cells[this.i][this.j].pos.y;
    if(this.color == "black") {
      if(this.type == "pawn") {
        image(chess_pieces, x, y, scl, scl, 1667, 334, 333, 333);
      }
      if(this.type == "rook") {
        image(chess_pieces, x, y, scl, scl, 1334, 334, 333, 333);
      }
      if(this.type == "knight") {
        image(chess_pieces, x, y, scl, scl, 1000, 334, 333, 333);
      }
      if(this.type == "bishop") {
        image(chess_pieces, x, y, scl, scl, 667, 334, 333, 333);
      }
      if(this.type == "king") {
        image(chess_pieces, x, y, scl, scl, 0, 334, 333, 333);
      }
      if(this.type == "queen") {
        image(chess_pieces, x, y, scl, scl, 334, 334, 333, 333);
      }
    } else if(this.color == "white") {
      if(this.type == "pawn") {
        image(chess_pieces, x, y, scl, scl, 1667, 0, 333, 333);
      }
      if(this.type == "rook") {
        image(chess_pieces, x, y, scl, scl, 1334, 0, 333, 333);
      }
      if(this.type == "knight") {
        image(chess_pieces, x, y, scl, scl, 1000, 0, 333, 333);
      }
      if(this.type == "bishop") {
        image(chess_pieces, x, y, scl, scl, 667, 0, 333, 333);
      }
      if(this.type == "king") {
        image(chess_pieces, x, y, scl, scl, 0, 0, 333, 333);
      }
      if(this.type == "queen") {
        image(chess_pieces, x, y, scl, scl, 334, 0, 333, 333);
      }
    }
    if(pSelected == this) {
      cells[this.i][this.j].color = "blue";
    }
  }
  
  clicked(mx, my) {
    let cell = findCell(mx, my);
    if(cell.i == this.i && cell.j == this.j) {
      pSelected = this;
      console.log(cell);
    }
  }
  
  occupy() {
    cells[this.i][this.j].occupied = this.color;
  }
  
  chkPossibilities() {
    let candidates = [];
    let i = this.i;
    let j = this.j;
    if(this.type == "king") {
      // upper cells
      if(cells[i - 1]) {
        if(cells[i - 1][j]) {
          if(cells[i - 1][j].occupied == this.color) {
             
          } else {
            candidates.push(cells[i - 1][j]);
          }
        }
        if(cells[i - 1][j + 1]) {
          if(cells[i - 1][j + 1].occupied == this.color) {
             
          } else {
            candidates.push(cells[i - 1][j + 1]);
          }
        }
        if(cells[i - 1][j - 1]) {
          if(cells[i - 1][j - 1].occupied == this.color) {
             
          } else {
            candidates.push(cells[i - 1][j - 1]);
          }
        }
      }
      // bottom cells
      if(cells[i + 1]) {
        if(cells[i + 1][j]) {
          if(cells[i + 1][j].occupied == this.color) {
             
          } else {
            candidates.push(cells[i + 1][j]);
          }
        }
        if(cells[i + 1][j + 1]) {
          if(cells[i + 1][j + 1].occupied == this.color) {
             
          } else {
            candidates.push(cells[i + 1][j + 1]);
          }
        }
        if(cells[i + 1][j - 1]) {
          if(cells[i + 1][j - 1].occupied == this.color) {
             
          } else {
            candidates.push(cells[i + 1][j - 1]);
          }
        }
      }
      // left cell
      if(cells[i][j - 1]) {
        if(cells[i][j - 1].occupied == this.color) {
             
          } else {
            candidates.push(cells[i][j - 1]);
          }
      }
      // right cell
      if(cells[i][j + 1]) {
        if(cells[i][j + 1].occupied == this.color) {
             
          } else {
            candidates.push(cells[i][j + 1]);
          }
      }
      filterKing(candidates);
    } else if(this.type == "queen") {
      // bishop's movement + rook's movement
      // bishop's movement:
      // upper left
      let i_ = i - 1;
      let j_ = j - 1;
      while(cells[i_]) {
        if(!cells[i_][j_] || cells[i_][j_].occupied == this.color) {
          break;
        }
        candidates.push(cells[i_][j_]);
        if(cells[i_][j_].occupied == next()[0].color) {
          break;
        }
        i_--;
        j_--;
      }
      // upper right
      i_ = i - 1;
      j_ = j + 1;
      while(cells[i_]) {
        if(!cells[i_][j_] || cells[i_][j_].occupied == this.color) {
          break;
        }
        candidates.push(cells[i_][j_]);
        if(cells[i_][j_].occupied == next()[0].color) {
          break;
        }
        i_--;
        j_++;
      }
      // bottom left
      i_ = i + 1;
      j_ = j - 1;
      while(cells[i_]) {
        if(!cells[i_][j_] || cells[i_][j_].occupied == this.color) {
          break;
        }
        candidates.push(cells[i_][j_]);
        if(cells[i_][j_].occupied == next()[0].color) {
          break;
        }
        i_++;
        j_--;
      }
      // bottom right
      i_ = i + 1;
      j_ = j + 1;
      while(cells[i_]) {
        if(!cells[i_][j_] || cells[i_][j_].occupied == this.color) {
          break;
        }
        candidates.push(cells[i_][j_]);
        if(cells[i_][j_].occupied == next()[0].color) {
          break;
        }
        i_++;
        j_++;
      }
      // rook's movement:
      // bottom cells:
      for(let k = i + 1; k < 8; k++) {
        if(cells[k][j].occupied == this.color) {
          break;
        } else if(cells[k][j].occupied == next()[0].color) {
          candidates.push(cells[k][j]);
          break;
        } else {
          candidates.push(cells[k][j]);
        }
      }
      // upper cells:
      for(let k = i - 1; k >= 0; k--) {
        if(cells[k][j].occupied == this.color) {
          break;
        } else if(cells[k][j].occupied == next()[0].color) {
          candidates.push(cells[k][j]);
          break;
        } else {
          candidates.push(cells[k][j]);
        }
      }
      // right cells:
      for(let k = j + 1; k < 8; k++) {
        if(cells[i][k].occupied == this.color) {
          break;
        } else if(cells[i][k].occupied == next()[0].color) {
          candidates.push(cells[i][k]);
          break;
        } else {
          candidates.push(cells[i][k]);
        }
      }
      // left cells:
      for(let k = j - 1; k >= 0; k--) {
        if(cells[i][k].occupied == this.color) {
          break;
        } else if(cells[i][k].occupied == next()[0].color) {
          candidates.push(cells[i][k]);
          break;
        } else {
          candidates.push(cells[i][k]);
        }
      }
    } else if(this.type == "pawn") {
      if(this.color == "white") {
        if(this.i == 6) {
          if(cells[i - 1][j]) {
            if(cells[i - 1][j].occupied) {
              return candidates;
            } else {
              candidates.push(cells[i - 1][j]);
            }
            // checking if has black pieces diagonally adjacent
            if(cells[i - 1][j + 1]) {
              if(cells[i - 1][j + 1].occupied == "black") {
                candidates.push(cells[i - 1][j + 1]);
              }
            }
            if(cells[i - 1][j - 1]) {
              if(cells[i - 1][j - 1].occupied == "black") {
                candidates.push(cells[i - 1][j - 1]);
              }
            }
          }
          if(cells[i - 2][j]) {
            if(cells[i - 2][j].occupied == "white") {

            } else {
              candidates.push(cells[i - 2][j]);
            }
          }
        } else {
          if(cells[i - 1][j]) {
            if(cells[i - 1][j].occupied) {
              return candidates;
            } else {
              candidates.push(cells[i - 1][j]);
            }
            // checking if has black pieces diagonally adjacent
            if(cells[i - 1][j + 1]) {
              if(cells[i - 1][j + 1].occupied == "black") {
                candidates.push(cells[i - 1][j + 1]);
              }
            }
            if(cells[i - 1][j - 1]) {
              if(cells[i - 1][j - 1].occupied == "black") {
                candidates.push(cells[i - 1][j - 1]);
              }
            }
          }
        }
      } else {
        if(this.i == 1) {
          if(cells[i + 1][j]) {
            if(cells[i + 1][j].occupied == "black") {
              return candidates;
            } else {
              candidates.push(cells[i + 1][j]);
            }
            // checking if has white pieces diagonally adjacent
            if(cells[i + 1][j + 1]) {
              if(cells[i + 1][j + 1].occupied == "white") {
                candidates.push(cells[i + 1][j + 1]);
              }
            }
            if(cells[i + 1][j - 1]) {
              if(cells[i + 1][j - 1].occupied == "white") {
                candidates.push(cells[i + 1][j - 1]);
              }
            }
          }
          if(cells[i + 2][j]) {
            if(cells[i + 2][j].occupied == "black") {
              
            } else {
              candidates.push(cells[i + 2][j]);
            }
          }
        } else {
          if(cells[i + 1][j]) {
            if(cells[i + 1][j].occupied == "black") {
              return candidates;
            } else {
              candidates.push(cells[i + 1][j]);
            }
            // checking if has white pieces diagonally adjacent
            if(cells[i + 1][j + 1]) {
              if(cells[i + 1][j + 1].occupied == "white") {
                candidates.push(cells[i + 1][j + 1]);
              }
            }
            if(cells[i + 1][j - 1]) {
              if(cells[i + 1][j - 1].occupied == "white") {
                candidates.push(cells[i + 1][j - 1]);
              }
            }
          }
        }
      }
    } else if(this.type == "knight") {
      // checking upper cells in "L" shape
      if(cells[i - 2]) {
        // right
        if(cells[i - 2][j + 1]) {
          if(cells[i - 2][j + 1].occupied == this.color) {

          } else {
            candidates.push(cells[i - 2][j + 1]);
          }
        }
        // left
        if(cells[i - 2][j - 1]) {
          if(cells[i - 2][j - 1].occupied == this.color) {

          } else {
            candidates.push(cells[i - 2][j - 1]);
          }
        }
      }
      // checking bottom cells in "L" shape
      if(cells[i + 2]) {
        // right
        if(cells[i + 2][j + 1]) {
          if(cells[i + 2][j + 1].occupied == this.color) {

          } else {
            candidates.push(cells[i + 2][j + 1]);
          }
        }
        // left
        if(cells[i + 2][j - 1]) {
          if(cells[i + 2][j - 1].occupied == this.color) {

          } else {
            candidates.push(cells[i + 2][j - 1]);
          }
        }
      }
      // checking upper middle cells
      if(cells[i - 1]) {
        // right
        if(cells[i - 1][j + 2]) {
          if(cells[i - 1][j + 2].occupied == this.color) {

          } else {
            candidates.push(cells[i - 1][j + 2]);
          }
        }
        // left
        if(cells[i - 1][j - 2]) {
          if(cells[i - 1][j - 2].occupied == this.color) {

          } else {
            candidates.push(cells[i - 1][j - 2]);
          }
        }
      }
      // checking bottom middle cells
      if(cells[i + 1]) {
        // right
        if(cells[i + 1][j + 2]) {
          if(cells[i + 1][j + 2].occupied == this.color) {

          } else {
            candidates.push(cells[i + 1][j + 2]);
          }
        }
        // left
        if(cells[i + 1][j - 2]) {
          if(cells[i + 1][j - 2].occupied == this.color) {

          } else {
            candidates.push(cells[i + 1][j - 2]);
          }
        }
      }
    } else if(this.type == "rook") {
      // bottom cells:
      for(let k = i + 1; k < 8; k++) {
        if(cells[k][j].occupied == this.color) {
          break;
        } else if(cells[k][j].occupied == next()[0].color) {
          candidates.push(cells[k][j]);
          break;
        } else {
          candidates.push(cells[k][j]);
        }
      }
      // upper cells:
      for(let k = i - 1; k >= 0; k--) {
        if(cells[k][j].occupied == this.color) {
          break;
        } else if(cells[k][j].occupied == next()[0].color) {
          candidates.push(cells[k][j]);
          break;
        } else {
          candidates.push(cells[k][j]);
        }
      }
      // right cells:
      for(let k = j + 1; k < 8; k++) {
        if(cells[i][k].occupied == this.color) {
          break;
        } else if(cells[i][k].occupied == next()[0].color) {
          candidates.push(cells[i][k]);
          break;
        } else {
          candidates.push(cells[i][k]);
        }
      }
      // left cells:
      for(let k = j - 1; k >= 0; k--) {
        if(cells[i][k].occupied == this.color) {
          break;
        } else if(cells[i][k].occupied == next()[0].color) {
          candidates.push(cells[i][k]);
          break;
        } else {
          candidates.push(cells[i][k]);
        }
      }
    } else if(this.type == "bishop") {
      // upper left
      let i_ = i - 1;
      let j_ = j - 1;
      while(cells[i_]) {
        if(!cells[i_][j_] || cells[i_][j_].occupied == this.color) {
          break;
        }
        candidates.push(cells[i_][j_]);
        if(cells[i_][j_].occupied == next()[0].color) {
          break;
        }
        i_--;
        j_--;
      }
      // upper right
      i_ = i - 1;
      j_ = j + 1;
      while(cells[i_]) {
        if(!cells[i_][j_] || cells[i_][j_].occupied == this.color) {
          break;
        }
        candidates.push(cells[i_][j_]);
        if(cells[i_][j_].occupied == next()[0].color) {
          break;
        }
        i_--;
        j_++;
      }
      // bottom left
      i_ = i + 1;
      j_ = j - 1;
      while(cells[i_]) {
        if(!cells[i_][j_] || cells[i_][j_].occupied == this.color) {
          break;
        }
        candidates.push(cells[i_][j_]);
        if(cells[i_][j_].occupied == next()[0].color) {
          break;
        }
        i_++;
        j_--;
      }
      // bottom right
      i_ = i + 1;
      j_ = j + 1;
      while(cells[i_]) {
        if(!cells[i_][j_] || cells[i_][j_].occupied == this.color) {
          break;
        }
        candidates.push(cells[i_][j_]);
        if(cells[i_][j_].occupied == next()[0].color) {
          break;
        }
        i_++;
        j_++;
      }
    }
    return candidates;
  }
  
  move(i, j) {
    let poss = this.chkPossibilities();
    if(poss.includes(cells[i][j]) == false) {
      pSelected = undefined;
      return;
    }
    if(cells[i][j].occupied) {
      let deleted = { indexI: i, indexJ: j };
      for(let k = 0; k < next().length; k++) {
        if(next()[k].i == deleted.indexI && next()[k].j == deleted.indexJ) {
          next().splice(k, 1);
          console.log("deleting")
          break;
        }
      }
    }
    cells[this.i][this.j].occupied = "";
    this.i = i;
    this.j = j;
    cells[this.i][this.j].occupied = this.color;
    current = next();
  }
  
}

function findPiece(i, j) {
  for(let p of whites) {
    if(p.i == i && p.j == j) {
      return p;
    }
  }
  for(let p of blacks) {
    if(p.i == i && p.j == j) {
      return p;
    }
  }
}

function findCell(x, y) {
  for(let i = 0; i < cells.length; i++) {
    for(let j = 0; j < cells[i].length; j++) {
      let cx = cells[i][j].pos.x;
      let cy = cells[i][j].pos.y;
      if(x >= cx && x <= cx + scl && y >= cy && y <= cy + scl) {
        return { i: i, j: j };
      }
    }
  }
}

function showPossibilites() {
  for(let i = 0; i < cells.length; i++) {
    for(let j = 0; j < cells[i].length; j++) {
      if((i + j) % 2 == 0) {
        cells[i][j].color = "white";
      } else {
        cells[i][j].color = "gray";
      }
    }
  }
  for(let cell of selectedPoss) {
    cell.color = "green";
  }
}

function next() {
  if(current == whites) {
    return blacks;
  } else {
    return whites;
  }
}

function chkPromotion() {
  let pawns = [];
  for(let p of whites) {
    if(p.type == "pawn") {
      if(p.i == 0 || p.i == 8) {
        return promote(p);
      }
    }
  }
  for(let p of blacks) {
    if(p.type == "pawn") {
      if(p.i == 0 || p.i == 8) {
      return promote(p);
      }
    }
  }
}

function promote(pawn) {
  // do later
}

function filterKing(kingPoss) {
  let opponent = [];
  for(let i = 0; i < next().length; i++) {
    if(next()[i].type == "king") {
  
    } else {
      opponent.push(next()[i]);
    }
  }
  for(let i = 0; i < opponent.length; i++) {
    let poss = opponent[i].chkPossibilities();
    for(let j = 0; j < kingPoss.length; j++) {
      if(poss.includes(kingPoss[j])) {
        kingPoss.splice(j, 1);
      }
    }
  }
}

function isInCheck() {
  let king;
  let count;
  let response = [];
  for(let p of current) {
    if(p.type == "king") {
      king = p;
      break;
    }
  }
  for(let p of next()) {
    let poss = p.chkPossibilities();
    for(let c of poss) {
      if(c.i == king.i && c.j == king.j) {
        response.push(p);
      }
    }
  }
  return response;
}

function generatePlayers() {
  // whites
  for(let j = 0; j < cells[6].length; j++) {
    whites.push( new Piece(6, j, "pawn", "white") );
  }
  whites.push( new Piece(7, 0, "rook", "white") );
  whites.push( new Piece(7, 7, "rook", "white") );
  whites.push( new Piece(7, 1, "knight", "white") );
  whites.push( new Piece(7, 6, "knight", "white") );
  whites.push( new Piece(7, 2, "bishop", "white") );
  whites.push( new Piece(7, 5, "bishop", "white") );
  whites.push( new Piece(7, 4, "king", "white") );
  whites.push( new Piece(7, 3, "queen", "white") );
  
  // blacks
  for(let j = 0; j < cells[1].length; j++) {
    blacks.push( new Piece(1, j, "pawn", "black") );
  }
  blacks.push( new Piece(0, 0, "rook", "black") );
  blacks.push( new Piece(0, 7, "rook", "black") );
  blacks.push( new Piece(0, 1, "knight", "black") );
  blacks.push( new Piece(0, 6, "knight", "black") );
  blacks.push( new Piece(0, 2, "bishop", "black") );
  blacks.push( new Piece(0, 5, "bishop", "black") );
  blacks.push( new Piece(0, 4, "king", "black") );
  blacks.push( new Piece(0, 3, "queen", "black") );
}