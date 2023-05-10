let cols; //columns in the grid
let rows; //rows in the grid


let grid = new Array(cols); //array of all the grid points

let openSet = []; //array containing unevaluated grid points
let closedSet = []; //array containing completely evaluated grid points

let startInput; //starting grid point
let endInput; // ending grid point (goal)
let pathF = [];
let path = [];


//heuristic we will be using - Manhattan distance
//for other heuristics visit - https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function heuristic(position0, position1) {
  let d1 = Math.abs(position1.x - position0.x);
  let d2 = Math.abs(position1.y - position0.y);

  return d1 + d2;
}

//constructor function to create all the grid points as objects containind the data for the points
function GridPoint(x, y) {
  this.x = x; //x location of the grid point
  this.y = y; //y location of the grid point
  this.f = 0; //total cost function
  this.g = 0; //cost function from start to the current grid point
  this.h = 0; //heuristic estimated cost function from current grid point to the goal
  this.neighbors = []; // neighbors of the current grid point
  this.parent = undefined; // immediate source of the current grid point

  // update neighbors array for a given grid point
  this.updateNeighbors = function (grid) {
    let i = this.x;
    let j = this.y;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
  };
}

//initializing the grid
function init() {

  //making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  let table = document.createElement("table");
  for (let i = 0; i < cols; i++) {
    let row = table.insertRow();
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new GridPoint(i, j);
      let cell = row.insertCell();
      if (i == startInput[0] && j == startInput[1]) {
        cell.classList = "start";
        cell.innerHTML = "S";
      } else if (i == endInput[0] && j == endInput[1]) {
        cell.classList = "end";
        cell.innerHTML = "E";
      } else {
        cell.classList = "point";
        cell.innerHTML = "P";
      }
    }
  }
  document.getElementById("container").appendChild(table);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].updateNeighbors(grid);
    }
  }

  start = grid[startInput[0]][startInput[1]];
  end = grid[endInput[0]][endInput[1]];
  openSet.push(start);

  console.log(grid);
}
// init();
//A star search implementation

function search() {
  init();
  while (openSet.length > 0) {
    //assumption lowest index is the first one to begin with
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    let current = openSet[lowestIndex];

    if (current === end) {
      let temp = current;
      path.push(temp);
      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
      }

      for (let i = 0; i < path.length - 1; i++) {
        let temp = [];
        temp.push(path[i].x);
        temp.push(path[i].y);
        pathF.push(temp);
      }
      pathF.reverse();

      console.log("Ovo je pathF!");
      console.log(pathF);

      let table = document.createElement("table");
      for (let i = 0; i < cols; i++) {
        var row = table.insertRow();
        for (let j = 0; j < rows; j++) {
          var cell = row.insertCell();
          if (i == startInput[0] && j == startInput[1]) {
            cell.classList = "start";
            cell.innerHTML = "S";
          } else if (i == endInput[0] && j == endInput[1]) {
            cell.classList = "end";
            cell.innerHTML = "E";
          } else {
            // cell.classList = "point";
            // cell.innerHTML = "P";
            for (let x = 0; x < pathF.length - 1; x++) {
                if (i == pathF[x][0] && j == pathF[x][1]) {
                  cell.classList = "path";
                  cell.innerHTML = "F";
                  break;
                } else {
                  cell.classList = "point";
                  cell.innerHTML = "P";
                }
            }
          }
        }
      }
      document.getElementById("result").appendChild(table);
    
    // } else if () {
    //   cell.classList = "path";
    //   cell.innerHTML = "F";

      console.log("DONE!");
      // return the traced path
      return path.reverse();
    }

    //remove current from openSet
    openSet.splice(lowestIndex, 1);
    //add current to closedSet
    closedSet.push(current);

    let neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        let possibleG = current.g + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (possibleG >= neighbor.g) {
          continue;
        }

        neighbor.g = possibleG;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  //no solution by default
  return [];
}

document.getElementById("submit").addEventListener("click", () => {
  pathF = [];
  path = [];

  sx = document.getElementById('startX').value;
  sy = document.getElementById('startY').value;

  ex = document.getElementById('endX').value;
  ey = document.getElementById('endY').value;

  cols = document.getElementById('cols').value;
  rows = document.getElementById('rows').value;


  startInput = Array(sx, sy);
  endInput = Array(ex, ey);
  document.getElementById("container").innerHTML = '';
  document.getElementById("result").innerHTML = '';
  console.log(search());
});