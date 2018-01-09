function make_a_txt_file(){
	var coords = "";

	var startCoord = startX + " " + startY + ",";
	var endCoord = endX + " " + endY + ",";
	var coords = startCoord.concat(endCoord);

	// var random;
	// var randomX;
	// var randomY;
	// var randomXY;
	// // random coordinates
	// for(var i = 0; i < random_coords.length; i++){
	// 	random = random_coords[i];
	// 	randomX = random.i;
	// 	randomY = random.j;
	// 	randomXY = random.i + " " + random.j + ",";
	// 	coords = coords.concat(randomXY);
	// }

	var list;

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			// if hard to travel cell with a highway then write b
			if(grid[i][j].river && grid[i][j].hard){
				coords = coords.concat("b");
				continue;
			}
			// if hard to travel cell then write 2
			if(grid[i][j].hard){
				coords = coords.concat("2");
				continue;
			}
			// if wall cell then write 0
			if(grid[i][j].wall){
				coords = coords.concat("0");
				continue;
			}
			// if normal unblocked cell then write 1
			if(!grid[i][j].wall && !grid[i][j].hard && !grid[i][j].river){
				coords = coords.concat("1");
				continue;
			}
			// if normal unblocked cell with a highway then write a
			if(grid[i][j].river && !grid[i][j].hard){
				coords = coords.concat("a");
				continue;
			}
		}
		coords = coords.concat(",");
	}

	list = split(coords, ",");
	saveStrings(list, "grid.txt");
}

function removeFromArray(arr, elt) {
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == elt) {
			arr.splice(i, 1);
		}
	}
}

function euclidean(a, b) {
	// euclidean distance
	var d = dist(a.i, a.j, b.i, b.j);
	return d;
}

function manhattan(a, b) {
	// manhattan distance
	var d = abs(a.i-b.i) + abs(a.j-b.j);
	return d;
}

function octile(a, b) {
	// octile distance
	var dx = abs(a.i-b.i);
	var dy = abs(a.j-b.j);
	var F = Math.SQRT2 - 1;
	return (dx < dy) ? F * dx + dy : F * dy + dx;
}

function chebyshev(a, b) {
	// chebyshev distance
	var dx = abs(a.i-b.i);
	var dy = abs(a.j-b.j);
  return Math.max(dx, dy);
}

function squaredEuclidean(a, b){
	var d = dist(a.i, a.j, b.i, b.j);
	return d*2;
}

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min)) + min;
}

function region_of_coords(radius, pointX, pointY){
	for(var x = -radius + pointX; x < radius + pointX; x++){
		for(var y = -radius + pointY; y < radius + pointY; y++){
			if(x >= 0 && y >= 0 && x < cols && y < rows){
				if(region.indexOf(grid[x][y]) == -1){
					region.push(grid[x][y]);
				}
			}
		}
	}
}
// x = getRandomInt(0, cols-1)
// y = getRandomInt(0, 20)
// x = getRandomInt(cols-1, get)
function start_and_end(){
	var distance = 0;
	var startX = 50;
	var startY = 50;
	var endX = 50;
	var endY = 50;

	while(distance < 100){
		distance = 0;
		if(140 > startX && startX > 20 && 20 < startY && startY < 100 || distance < 100){
			startX = getRandomInt(0, cols-1);
			startY = getRandomInt(0, rows-1);
		}
		if(140 > endX && endX > 20 && 20 < endY && endY < 100 || distance < 100){
			endX = getRandomInt(0, cols-1);
			endY = getRandomInt(0, rows-1);
		}
		distance = dist(startX, startY, endX, endY);
		console.log(distance);
	}

	return [startX, startY, endX, endY];
}

function make_a_pair(){
	list = [
		// [getRandomInt(0, cols - 1), 0], // top
		[0, getRandomInt(0, rows - 1)], // left
		// [getRandomInt(0, cols - 1), rows - 1], // bot
		[cols - 1, getRandomInt(0, rows - 1)] // right
	];

	pair = list[getRandomInt(0, 2)];
	return pair;
}

function make_rivers(num){
	var list;
	var pair;
	var x, y;

	for(var i = 0; i < num; i++){

		pair = make_a_pair();
		x = pair[0];
		y = pair[1];

		border_points.push(grid[x][y]);
		// grid[x][y].river = true;

		// find the streams for each river
		find_streams(x, y, stream_size);
		console.log("find stream");
	}
}

function find_streams(x, y, stream_size){
	var list = [];
	var clash = false;
	var counter = 0;
	var clash_counter = 0;
	var x_value = x;
	var y_value = y;
	var counter_is_less_than_a_hundred = false;
	var one = 0;
	var two = 0;

	if(x == 0){
		one += 1;
		console.log("1::::::::::::::::::::::1::::::::::::::::::::::1");
		console.log("counter", counter);
		for(var i = 0; i < stream_size; i++){

			list.push(grid[x][y]);
			x++;
			counter++;
		}

		while(counter < 100){
			console.log("entered");
			if(counter < 100){
				counter_is_less_than_a_hundred = true;
			}
			do {

				if(counter_is_less_than_a_hundred){
					x = 0;
					y = y_value;
					list = [];
					counter = 0;
					counter_is_less_than_a_hundred = false;
				}

				clash = false;
				for(var i = 0; i < stream_size; i++){

					console.log("0:: x and y are", x, y);
					if(x == cols || y == rows || y < 0 || x < 0){
						break;
					}
					console.log("0 pushed:: x and y are", x, y);
					list.push(grid[x][y]);

					if(grid[x][y].river == true){
						clash = true;
					}
					x++;
					counter++;
					console.log("x is", x);
				}

				if(random(1) <= 0.2){
					if(random(1) <= 0.5){
						for(var i = 0; i < stream_size; i++){

							console.log("1:: x and y are", x, y)
							if(y == rows || x == cols || y < 0){
								break;
							}
							console.log("1 pushed:: x and y are", x, y)
							list.push(grid[x][y]);

							if(grid[x][y].river == true){
								clash = true;
							}

							y++;
							counter++;
						}
					} else {
						for(var i = 0; i < stream_size+1; i++){

							console.log("2:: x and y are", x, y)
							if(y < 0 || x == cols || y == rows){
								break;
							}
							console.log("2 pushed:: x and y are", x, y)
							list.push(grid[x][y]);

							if(grid[x][y].river == true){
								clash = true;
							}

							y--;
							counter++;
						}
					}
				}


				if(clash){
					clash_counter += 1;
					console.log("alert:: # OF CRASH", clash_counter);
					console.log("SOLVING THE CRASH...");
					x = 0;
					y = getRandomInt(0, rows - 1);
					list = [];
					counter = 0
				}
			} while(x != cols && y != rows && y > 0 && x > 0 || clash);
		}
	} else if(x == cols-1) {
		two += 1;
		console.log("2::::::::::::::::::::::2::::::::::::::::::::::2");
		console.log("counter", counter);
		for(var i = 0; i < stream_size; i++){

			list.push(grid[x][y]);
			x--;
			counter++;
		}

		while(counter < 100){
			console.log("entered");
			if(counter < 100){
				counter_is_less_than_a_hundred = true;
			}
			do {

				if(counter_is_less_than_a_hundred){
					x = x_value;
					y = y_value;
					list = [];
					counter = 0;
					counter_is_less_than_a_hundred = false;
				}

				clash = false;
				for(var i = 0; i < stream_size; i++){

					console.log("0:: x and y are", x, y);
					if(x == cols || y == rows || y < 0 || x < 0){
						break;
					}
					console.log("0 pushed:: x and y are", x, y);
					list.push(grid[x][y]);

					if(grid[x][y].river == true){
						clash = true;
					}
					x--;
					counter++;
					console.log("x is", x);
				}

				if(random(1) <= 0.2){
					if(random(1) <= 0.5){
						for(var i = 0; i < stream_size; i++){

							console.log("1:: x and y are", x, y)
							if(y == rows || x == cols || y < 0 || x < 0){
								break;
							}
							console.log("1 pushed:: x and y are", x, y)
							list.push(grid[x][y]);

							if(grid[x][y].river == true){
								clash = true;
							}

							y++;
							counter++;
						}
					} else {
						for(var i = 0; i < stream_size; i++){

							console.log("2:: x and y are", x, y)
							if(y < 0 || x == cols || y == rows || x < 0){
								break;
							}
							console.log("2 pushed:: x and y are", x, y)
							list.push(grid[x][y]);

							if(grid[x][y].river == true){
								clash = true;
							}

							y--;
							counter++;
						}
					}
				}


				if(clash){
					clash_counter += 1;
					console.log("alert:: # OF CRASH", clash_counter);
					console.log("SOLVING THE CRASH...");
					x = x_value;
					y = getRandomInt(0, rows - 1);
					list = [];
					counter = 0
				}
			} while(x != cols && y != rows && y > 0 && x > 0 || clash);
		}
	} else if(y == 0){
		console.log("3rd");
		// for(var i = 0; i < stream_size; i++){
    //
		// 	list.push(grid[x][y]);
		// 	y++;
		// 	counter++;
		// }
    //
		// while(counter < 100){
		// 	console.log("entered");
		// 	if(counter < 100){
		// 		counter_is_less_than_a_hundred = true;
		// 	}
		// 	do {
    //
		// 		if(counter_is_less_than_a_hundred){
		// 			x = x_value;
		// 			y = y_value;
		// 			list = [];
		// 			counter = 0;
		// 			counter_is_less_than_a_hundred = false;
		// 		}
    //
		// 		clash = false;
		// 		for(var i = 0; i < stream_size; i++){
    //
		// 			console.log("0:: x and y are", x, y);
		// 			if(x == cols || y == rows || y < 0 || x < 0){
		// 				break;
		// 			}
		// 			console.log("0 pushed:: x and y are", x, y);
		// 			list.push(grid[x][y]);
    //
		// 			if(grid[x][y].river == true){
		// 				clash = true;
		// 			}
		// 			y++;
		// 			counter++;
		// 			console.log("x is", x);
		// 		}
    //
		// 		if(random(1) <= 0.2){
		// 			if(random(1) <= 0.5){
		// 				for(var i = 0; i < stream_size; i++){
    //
		// 					console.log("1:: x and y are", x, y)
		// 					if(y == rows || x == cols || y < 0 || x < 0){
		// 						break;
		// 					}
		// 					console.log("1 pushed:: x and y are", x, y)
		// 					list.push(grid[x][y]);
    //
		// 					if(grid[x][y].river == true){
		// 						clash = true;
		// 					}
    //
		// 					x--;
		// 					counter++;
		// 				}
		// 			} else {
		// 				for(var i = 0; i < stream_size; i++){
    //
		// 					console.log("2:: x and y are", x, y)
		// 					if(y < 0 || x == cols || y == rows || x < 0){
		// 						break;
		// 					}
		// 					console.log("2 pushed:: x and y are", x, y)
		// 					list.push(grid[x][y]);
    //
		// 					if(grid[x][y].river == true){
		// 						clash = true;
		// 					}
    //
		// 					x++;
		// 					counter++;
		// 				}
		// 			}
		// 		}
    //
    //
		// 		if(clash){
		// 			clash_counter += 1;
		// 			console.log("alert:: # OF CRASH", clash_counter);
		// 			console.log("SOLVING THE CRASH...");
		// 			x = getRandomInt(0, cols - 1);
		// 			y = y_value;
		// 			list = [];
		// 			counter = 0;
		// 			if(clash_counter > 1){
		// 				make_rivers(4);
		// 			}
		// 		}
		// 	} while(x != cols && y != rows && y > 0 && x > 0 || clash);
		// }
	} else {
		console.log("4th");
		// for(var i = 0; i < stream_size; i++){
    //
		// 	list.push(grid[x][y]);
		// 	y--;
		// 	counter++;
		// }
    //
		// while(counter < 100){
		// 	console.log("entered");
		// 	if(counter < 100){
		// 		counter_is_less_than_a_hundred = true;
		// 	}
		// 	do {
    //
		// 		if(counter_is_less_than_a_hundred){
		// 			x = x_value;
		// 			y = y_value;
		// 			list = [];
		// 			counter = 0;
		// 			counter_is_less_than_a_hundred = false;
		// 		}
    //
		// 		clash = false;
		// 		for(var i = 0; i < stream_size; i++){
    //
		// 			console.log("0:: x and y are", x, y);
		// 			if(x == cols || y == rows || y < 0 || x < 0){
		// 				break;
		// 			}
		// 			console.log("0 pushed:: x and y are", x, y);
		// 			list.push(grid[x][y]);
    //
		// 			if(grid[x][y].river == true){
		// 				clash = true;
		// 			}
		// 			y--;
		// 			counter++;
		// 			console.log("x is", x);
		// 		}
    //
		// 		if(random(1) <= 0.2){
		// 			if(random(1) <= 0.5){
		// 				for(var i = 0; i < stream_size; i++){
    //
		// 					console.log("1:: x and y are", x, y)
		// 					if(y == rows || x == cols || y < 0 || x < 0){
		// 						break;
		// 					}
		// 					console.log("1 pushed:: x and y are", x, y)
		// 					list.push(grid[x][y]);
    //
		// 					if(grid[x][y].river == true){
		// 						clash = true;
		// 					}
    //
		// 					x--;
		// 					counter++;
		// 				}
		// 			} else {
		// 				for(var i = 0; i < stream_size; i++){
    //
		// 					console.log("2:: x and y are", x, y)
		// 					if(y < 0 || x == cols || y == rows || x < 0){
		// 						break;
		// 					}
		// 					console.log("2 pushed:: x and y are", x, y)
		// 					list.push(grid[x][y]);
    //
		// 					if(grid[x][y].river == true){
		// 						clash = true;
		// 					}
    //
		// 					x++;
		// 					counter++;
		// 				}
		// 			}
		// 		}
    //
		// 		if(clash){
		// 			clash_counter += 1;
		// 			console.log("alert:: # OF CRASH", clash_counter);
		// 			console.log("SOLVING THE CRASH...");
		// 			x = getRandomInt(0, cols - 1);
		// 			y = y_value;
		// 			list = [];
		// 			counter = 0;
		// 			if(clash_counter > 1){
		// 				make_rivers(4);
		// 			}
		// 		}
		// 	} while(x != cols && y != rows && y > 0 && x > 0 || clash);
		// }
	}



	for(var i = 0; i < list.length; i++){
		list[i].river = true;
	}
	console.log("CLASH COUNTER:: ", clash_counter);
	console.log("COUNTER:: ", counter);
	console.log("ONE: ", one);
	console.log("TWO: ", two);
}

var cols = 160;
var rows = 120;
var grid = new Array(cols);

var openSet = [];
var openSet1 = [];
var openSet2 = [];
var openSet3 = [];
var openSet4 = [];

var closedSet = [];
var closedCounter = 0;

var closedSet1 = [];
var closedSet2 = [];
var closedSet3 = [];
var closedSet4 = [];

var start;
var end;
var w, h;

var path = [];
var path1 = [];
var path2 = [];
var path3 = [];
var path4 = [];

var random_coords = [];
var radius = 31;
var region = [];
var border_points = [];
var stream_size = 20;
var sp;
var t0, t1;

function Spot(i, j) {
	// this.neighborHeap = new Heap(function(a, b) {
	//     return a.f - b.f;
	// });

	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbors = [];
	// this.friends = new Heap(function(a, b){
	// 	return a.f - b.f;
	// })
	this.previous = undefined;
	this.wall = false;
	this.diagonal = false;
	this.random = false;
	this.hard = false;
	// this.sp = false;
	this.river = false;
	this.startPoint = false;
	this.endPoint = false;
	this.closed = false;
	this.visited = false;

	// this.clicked = function() {
	// 	// var d = dist(mouseX, mouseY, this.i*w, this.j*h);
	// 	// if(d < 1){
	// 	// 	console.log("f", this.f);
	// 	// }
  //
	// 	if( this.i < mouseX && mouseX < this.i*w + w-1 && this.j < mouseY && mouseY < this.j*h + h-1){
	// 		console.log(this.i, this.j);
	// 	}
	// }

	this.show = function(col) {
		fill(col);
		if (this.wall){
			fill(0);
		}

		if(this.hard){
			fill(200, 0, 220);
		}

		if(this.random){
			fill(255, 0, 255);
		}

		if(this.river){
			fill(50, 255, 70);
		}

		if(this.startPoint || this.endPoint){
			fill(255, 0, 0);
		}

		if(this.sp){
			fill(255, 255, 0);
		}

		stroke(0);
		rect(this.i * w, this.j * h, w - 1, h - 1);
	}

	// this.addFriends = function(grid){
	// 	var i = this.i;
	// 	var j = this.j;
  //
	// 	if (i < cols - 1) {
	// 		// this.neighbors.push(grid[i + 1][j]);
	// 		this.friends.push(grid[i+1][j]);
	// 	}
	// 	if (i > 0) {
	// 		// this.neighbors.push(grid[i - 1][j]);
	// 		this.friends.push(grid[i-1][j]);
	// 	}
  //
	// 	if (j < rows - 1) {
	// 		// this.neighbors.push(grid[i][j + 1]);
	// 		this.friends.push(grid[i][j+1]);
	// 	}
	// 	if (j > 0) {
	// 		// this.neighbors.push(grid[i][j - 1]);
	// 		this.friends.push(grid[i][j-1]);
	// 	}
  //
	// 	//diagonals
	// 	if(i > 0 && j > 0){
	// 		this.friends.push(grid[i-1][j-1]);
	// 		// this.neighbors.push(grid[i - 1][j - 1]);
	// 		grid[i-1][j-1].diagonal = true;
	// 		//this.diagonal = true;
	// 	}
	// 	if(i < cols - 1 && j > 0){
	// 		this.friends.push(grid[i+1][j-1]);
	// 		// this.neighbors.push(grid[i + 1][j - 1]);
	// 		grid[i+1][j-1].diagonal = true;
	// 		//this.diagonal = true;
	// 	}
	// 	if(i > 0 && j < rows - 1){
	// 		this.friends.push(grid[i-1][j+1]);
	// 		// this.neighbors.push(grid[i - 1][j + 1]);
	// 		grid[i-1][j+1].diagonal = true;
	// 		//this.diagonal = true;
	// 	}
	// 	if(i < cols - 1 && j < rows - 1){
	// 		this.friends.push(grid[i+1][j+1]);
	// 		// this.neighbors.push(grid[i + 1][j + 1]);
	// 		grid[i+1][j+1].diagonal = true;
	// 		//this.diagonal = true;
	// 	}
	// }

	this.addNeighbors = function(grid) {
		var i = this.i;
		var j = this.j;

		if (i < cols - 1) {
			this.neighbors.push(grid[i + 1][j]);
			// this.neighborHeap.push(grid[i+1][j]);
		}
		if (i > 0) {
			this.neighbors.push(grid[i - 1][j]);
			// this.neighborHeap.push(grid[i-1][j]);
		}

		if (j < rows - 1) {
			this.neighbors.push(grid[i][j + 1]);
			// neighborHeap.push(grid[i][j+1]);
		}
		if (j > 0) {
			this.neighbors.push(grid[i][j - 1]);
			// neighborHeap.push(grid[i][j-1]);
		}

		//diagonals
		if(i > 0 && j > 0){
			// neighborHeap.push(grid[i-1][j-1]);
			this.neighbors.push(grid[i - 1][j - 1]);
			grid[i-1][j-1].diagonal = true;
			//this.diagonal = true;
		}
		if(i < cols - 1 && j > 0){
			// neighborHeap.push(grid[i+1][j-1]);
			this.neighbors.push(grid[i + 1][j - 1]);
			grid[i+1][j-1].diagonal = true;
			//this.diagonal = true;
		}
		if(i > 0 && j < rows - 1){
			// neighborHeap.push(grid[i-1][j+1]);
			this.neighbors.push(grid[i - 1][j + 1]);
			grid[i-1][j+1].diagonal = true;
			//this.diagonal = true;
		}
		if(i < cols - 1 && j < rows - 1){
			// neighborHeap.push(grid[i+1][j+1]);
			this.neighbors.push(grid[i + 1][j + 1]);
			grid[i+1][j+1].diagonal = true;
			//this.diagonal = true;
		}


	}
}
