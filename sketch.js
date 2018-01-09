function setup() {
	createCanvas(600, 600);
	console.log('A*');

	var start_end_list = [];

	w = width / cols;
	h = height / rows;

	// making a grid
	for (var i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j] = new Spot(i, j);
		}
	}

	// random 8 cells
	for(var i = 0; i < 8; i++){
		var x = getRandomInt(0, cols);
		var y = getRandomInt(0, rows)
		grid[x][y].hard = true;
		random_coords.push(grid[x][y]);
	}

	// find the region of hard cells
	for(var i = 0; i < random_coords.length; i++){
		var random_coord = random_coords[i];
		var pointX = random_coord.i;
		var pointY = random_coord.j;
		region_of_coords(radius, pointX, pointY);
	}

	// for each cell in region, with prob .50, make it hard
	for(var i = 0; i < region.length; i++){
		var temp = region[i];
		if(random(1) < 0.5){
			temp.hard = true;
		}
	}

	// make the rivers (or highways)
	make_rivers(4);

	for(var i = 0; i < cols; i++){
		for (var j = 0; j < rows; j++){
			if (random(1) <= 0.2 && grid[i][j].river == false){
				grid[i][j].wall = true;
			}
		}
	}

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j].addNeighbors(grid);
		}
	}

	start_end_list = start_and_end();
	startX = start_end_list[0];
	startY = start_end_list[1]
	endX = start_end_list[2];
	endY = start_end_list[3];

	// start and end cell
	start = grid[startX][startY];
	end = grid[endX][endY];

	grid[startX][startY].startPoint = true;
	grid[endX][endY].endPoint = true;
	grid[startX][startY].wall = false;
	grid[endX][endY].wall = false;

	openSet.push(start);

	background(0);

	// grid with color
	for (var i = 0; i < cols; i++){
		for (var j = 0; j < rows; j++) {
			grid[i][j].show(color(255));
		}
	}
}

// function mousePressed(){
//   for (var i = 0; i < cols; i++) {
// 		for (var j = 0; j < rows; j++) {
// 			grid[i][j].clicked();
// 		}
// 	}
// }

function draw() {

	if (openSet.length > 0) {

		var winner = 0;
		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[winner].f) {
				winner = i;
			}
		}

		var current = openSet[winner];

		removeFromArray(openSet, current);
		closedSet.push(current);

		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];

			if (closedSet.indexOf(neighbor) == -1 && !neighbor.wall) {

				if(neighbor.diagonal == true){
					var tempG = current.g + Math.sqrt(2);
				} else {
				  var tempG = current.g + 1;
				}

				// hard to hard (horizontal + vertical)
				if(current.hard && neighbor.hard && !neighbor.diagonal){
					var tempG = current.g + 2;
				}

				// hard to hard (diagonal)
				if(current.hard && neighbor.hard && neighbor.diagonal){
					var tempG = current.g + Math.sqrt(8);
				}

				// regular to hard (horizontal + vertical)
				if(!current.hard && neighbor.hard && !neighbor.diagonal){
					var tempG = current.g + 1.5;
				}

				// regular to hard (diagonal)
				if(!current.hard && neighbor.hard && neighbor.diagonal){
					var tempG = current.g + ((Math.sqrt(2) + Math.sqrt(8))/2);
				}

				// river:: normal to normal
				if(current.river && neighbor.river && !current.hard && !neighbor.hard){
					var tempG = current.g + 0.25;
				}

				// river:: hard to hard..
				if(current.river && neighbor.river && current.hard && neighbor.hard){
					var tempG = current.g + 0.50;
				}

				// river:: normal to hard..
				if(current.river && neighbor.river && !current.hard && neighbor.hard){
					var tempG = current.g + 0.375;
				}

				var newPath = false;
				if (openSet.indexOf(neighbor) == 1) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newPath = true;
					}
				} else {
					neighbor.g = tempG;
					newPath = true;
					openSet.push(neighbor);
				}

				console.log(neighbor.g)
				if (newPath) {
					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
				}
			}
		}

	} else {
		console.log("no solution")
		noLoop();
		return;
	}

	path = [];
	var temp = current;
	path.push(temp);
	while (temp.previous){
		path.push(temp.previous);
		temp = temp.previous;
	}

	noFill();
	stroke(255, 0, 0);
	strokeWeight(2);
	beginShape();
	for(var i = 0; i < path.length; i++){
		vertex(path[i].i * w + w/2, path[i].j * h + h/2);
	}
	endShape();

	if (current === end) {
		//find the path

		noFill();
		stroke(0, 0, 255);
		strokeWeight(4);
		beginShape();
		for(var i = 0; i < path.length; i++){
			vertex(path[i].i * w + w/2, path[i].j * h + h/2);
		}
		endShape();

		// create a text file
		// var list = [];
		// var startCoord = startX + " " + startY + ",";
		// var endCoord = endX + " " + endY + ",";
		// var coords = startCoord.concat(endCoord);

		// 120 x 160 grid
		make_a_txt_file();

		noLoop();
		console.log("COMPLETE");
	}
}
