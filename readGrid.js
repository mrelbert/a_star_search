var Heap = require('heap');
var heap = new Heap(function(a, b) {
  if (a.f < b.f) {
    return -1;
  }
  if (b.f < a.f) {
    return 1;
  }
  return 0;
});

var txt;
var cols = 160;
var rows = 120;
var grid = new Array(cols);
var index = 2; // 8 if you put the 8 random coords
var x = 0;
var startX, startY, endX, endY, start, end;
var pressX = 0;
var pressY = 0;
var fps = 1000;
var ready = false;
var WAready = false;
var string;
var weight;
var sizeof = require('sizeof');

function preload(){
  txt = loadStrings("./grids/10/grid5.txt");
  // ./grids/1/grid3.txt
}

function myInputEvent(){
  string = this.value();
  if(string == "R" || string == "U" || string == "S"){
    ready = true;
    t0 = performance.now();
  }
}

function mySecondInputEvent(){
  weight = this.value();
  if(weight >= 1.25 && string == "W"){
    WAready = true;
    ready = true;
    t0 = performance.now();
  }
}

function setup(){
  frameRate(fps);
	createCanvas(765, 765);

  var text = createInput();
  text.input(myInputEvent);
  text.position(780, 75)

  var text2 = createInput();
  text2.input(mySecondInputEvent);
  text2.position(780, 125);

  button = createButton('auto submit');
  button.position(text.x + text.width, 75);

  button2 = createButton('auto submit');
  button2.position(text2.x + text2.width, 125);

  greeting = createElement('h3', 'Choices: W, R, U');
  greeting.position(785, 30);

  greeting2 = createElement('h3', 'Enter weight for W');
  greeting2.position(785, 80);

  // 765, 765
  w = width / cols;
	h = height / rows;

  for (var i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j] = new Spot(i, j);
		}
	}

  // give each spot its right label
  // but i don't think you have to..

  // var firstRandomPair = txt[0];
  // var secondRandomPair = txt[1];
  // var thirdRandomPair = txt[2];
  // var fourthRandomPair = txt[3];
  // var fifthRandomPair = txt[4];
  // var sixthRandomPair = txt[5];
  // var seventhRandomPair = txt[6];
  // var eighthRandomPair = txt[7];

  do {
    var line;
    var y = 0;
    line = txt[index]
    for(var i = 0; i < line.length; i++){
      if(line[i] == 1){
          y++;
          continue;
      } else if(line[i] == 0){
          grid[x][y].wall = true;
      } else if(line[i] == 'a'){
          grid[x][y].river = true;
      } else if(line[i] == 'b'){
          grid[x][y].hard = true;
          grid[x][y].river = true;
      } else if(line[i] == 2){
          grid[x][y].hard = true;
      }
      y++;
    }
    x++;
    index++;
  } while(index < txt.length);

  start_list = txt[0].split(" ");
  console.log(start_list);
  end_list = txt[1].split(" ");
  console.log(end_list);
  startX = start_list[0];
  console.log(startX);
  startY = start_list[1];
  console.log(startY);
  endX = end_list[0];
  console.log(endX);
  endY = end_list[1];
  console.log(endY);
  //
  // start_end_list = start_and_end();
	// startX = start_end_list[0];
	// startY = start_end_list[1]
	// endX = start_end_list[2];
	// endY = start_end_list[3];

	// start and end cell
	start = grid[startX][startY];
	end = grid[endX][endY];

	grid[startX][startY].startPoint = true;
	grid[endX][endY].endPoint = true;
	grid[startX][startY].wall = false;
	grid[endX][endY].wall = false;

  for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j].addNeighbors(grid);
      // grid[i][j].addFriends(grid);
		}
	}

  // heap.push(start);
  console.log("heap at line 153", heap);
  openSet.push(start);

  openSet1.push(start);
  openSet2.push(start);
  openSet3.push(start);
  openSet4.push(start);

  background(0);

	// grid with color
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j].show(color(255));
		}
	}

  sp = new Spot(0, 0);

  // make_a_txt_file();
  console.log("DONE");
}

// function mousePressed(){
//   for (var i = 0; i < cols; i++) {
// 		for (var j = 0; j < rows; j++) {
// 			grid[i][j].clicked();
// 		}
// 	}
// }

function keyPressed() {

  if(keyCode === ENTER){
    grid[pressX][pressY].sp = true;
    grid[pressX][pressY].show(color(255));
  }

  if(keyCode === RIGHT_ARROW){
    pressX++;
    grid[pressX][pressY].sp = true;
    grid[pressX][pressY].show(color(255));
    console.log("f is ", grid[pressX][pressY].f);
    console.log("g is ", grid[pressX][pressY].g);
    console.log("h is ", grid[pressX][pressY].h);
  }

  if(keyCode === LEFT_ARROW){
    pressX--;
    grid[pressX][pressY].sp = true;
    grid[pressX][pressY].show(color(255));
    console.log("f is ", grid[pressX][pressY].f);
    console.log("g is ", grid[pressX][pressY].g);
    console.log("h is ", grid[pressX][pressY].h);
  }

  if(keyCode === DOWN_ARROW){
    pressY++;
    grid[pressX][pressY].sp = true;
    grid[pressX][pressY].show(color(255));
    console.log("f is ", grid[pressX][pressY].f);
    console.log("g is ", grid[pressX][pressY].g);
    console.log("h is ", grid[pressX][pressY].h);
  }

  if(keyCode === UP_ARROW){
    pressY--;
    grid[pressX][pressY].sp = true;
    grid[pressX][pressY].show(color(255));
    console.log("f is ", grid[pressX][pressY].f);
    console.log("g is ", grid[pressX][pressY].g);
    console.log("h is ", grid[pressX][pressY].h);
  }
}


function draw() {

  if(string == "W" && ready && WAready){
    weighted_a_star_search(weight);
  } else if(string == "R" && ready){
    // heap.heapify();
    regular_a_star_search();
  } else if(string == "U" && ready){
    uniform_cost_search();
  } else if(string == "S" && ready){
    sequential_a_star_search();
  }
}
