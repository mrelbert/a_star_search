function regular_a_star_search(){

  if (openSet.length > 0) {
  // if(heap.size() > 0)
		var winner = 0;
		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[winner].f) {
				winner = i;
			}
		}

		var current = openSet[winner];
    //var current = heap.pop();
		removeFromArray(openSet, current);
		current.closed = true;
    closedCounter += 1;

		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (neighbor.closed == false && !neighbor.wall) {
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
				if (neighbor.closed == -1) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newPath = true;
					}
				} else {
					neighbor.g = tempG;
					newPath = true;
          // heap.push(neighbor);
				}
        //
				// console.log(neighbor.g)
				if (newPath) {
					neighbor.h = euclidean(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
          // no heuristic is uniform cost SEARCH
					neighbor.previous = current;
          openSet.push(neighbor);
				}
			}
		}

	} else {
		// console.log("no solution")


    // NAVIGATE WITH THE ARROWS TO CHECK F, G, H


		// noLoop();
		// return;
	}

  // if(heap.size() != 0)
  if(openSet.length != 0){
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
  }

	if (current === end) {
    t1 = performance.now();
    console.log("PATH LENGTH IS:", path.length);
    console.log("# OF NODES EXPANDED:", closedCounter);
    console.log("RA* took " + (t1 - t0) + " milliseconds.");

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
		// make_a_txt_file();


	  openSet.length = 0;
		console.log("COMPLETE");
	}
}

function weighted_a_star_search(weight){
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
					neighbor.h = euclidean(neighbor, end) * weight;
					neighbor.f = neighbor.g + neighbor.h;
          // no heuristic is uniform cost SEARCH
					neighbor.previous = current;
				}
			}
		}

	} else {
		// console.log("no solution")


    // NAVIGATE WITH THE ARROWS TO CHECK F, G, H


		// noLoop();
		// return;
	}

  if(openSet.length != 0){
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
  }

	if (current === end) {
    t1 = performance.now();
    console.log("WA* took " + (t1 - t0) + " milliseconds.");
    console.log("PATH LENGTH IS:", path.length);
    console.log("# OF NODES EXPANDED:", closedSet.length);
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
		// make_a_txt_file();


	  openSet.length = 0;
		console.log("COMPLETE");
	}
}

function uniform_cost_search(){
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
					neighbor.h = 0;
					neighbor.f = neighbor.g + neighbor.h;
          // no heuristic is uniform cost SEARCH
					neighbor.previous = current;
				}
			}
		}

	} else {
		// console.log("no solution")


    // NAVIGATE WITH THE ARROWS TO CHECK F, G, H


		// noLoop();
		// return;
	}

  if(openSet.length != 0){
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
  }

	if (current === end) {
    t1 = performance.now();
    console.log("UCS took " + (t1 - t0) + " milliseconds.");
    console.log("PATH LENGTH IS:", path.length);
    console.log("# OF NODES EXPANDED:", closedSet.length);
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
		// make_a_txt_file();


	  openSet.length = 0;
		console.log("COMPLETE");
	}
}

function regular_a_star_search_with_squared_euclidean(){

  if (openSet2.length > 0) {
  // if(heap.size() > 0)
		var winner = 0;
		for (var i = 0; i < openSet2.length; i++) {
			if (openSet2[i].f < openSet2[winner].f) {
				winner = i;
			}
		}

		var current = openSet2[winner];
    //var current = heap.pop();
		removeFromArray(openSet2, current);
		closedSet2.push(current);

		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (closedSet2.indexOf(neighbor) == -1 && !neighbor.wall) {
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

				var newpath2 = false;
				if (openSet2.indexOf(neighbor) == 1) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newpath2 = true;
					}
				} else {
					neighbor.g = tempG;
					newpath2 = true;
					openSet2.push(neighbor);
          // heap.push(neighbor);
				}

				console.log(neighbor.g)
				if (newpath2) {
					neighbor.h = squaredEuclidean(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
          // no heuristic is uniform cost SEARCH
					neighbor.previous = current;
				}
			}
		}

	} else {
		// console.log("no solution")


    // NAVIGATE WITH THE ARROWS TO CHECK F, G, H


		// noLoop();
		// return;
	}

  // if(heap.size() != 0)
  if(openSet2.length != 0){
    path2 = [];
  	var temp = current;
  	path2.push(temp);
  	while (temp.previous){
  		path2.push(temp.previous);
  		temp = temp.previous;
  	}

  	noFill();
  	stroke(55, 50, 150);
  	strokeWeight(2);
  	beginShape();
  	for(var i = 0; i < path2.length; i++){
  		vertex(path2[i].i * w + w/2, path2[i].j * h + h/2);
  	}
  	endShape();
  }

	if (current === end) {
    t1 = performance.now();
    console.log("path2 LENGTH IS:", path2.length);
    console.log("# OF NODES EXPANDED:", closedSet2.length);
    console.log("RA* took " + (t1 - t0) + " milliseconds.");

		//find the path2

		noFill();
		stroke(0, 0, 255);
		strokeWeight(4);
		beginShape();
		for(var i = 0; i < path2.length; i++){
			vertex(path2[i].i * w + w/2, path2[i].j * h + h/2);
		}
		endShape();

		// create a text file
		// var list = [];
		// var startCoord = startX + " " + startY + ",";
		// var endCoord = endX + " " + endY + ",";
		// var coords = startCoord.concat(endCoord);

		// 120 x 160 grid
		// make_a_txt_file();


	  openSet2.length = 0;
		console.log("COMPLETE");
	}
}


function regular_a_star_search_with_manhattan(){

  if (openSet1.length > 0) {
  // if(heap.size() > 0)
		var winner = 0;
		for (var i = 0; i < openSet1.length; i++) {
			if (openSet1[i].f < openSet1[winner].f) {
				winner = i;
			}
		}

		var current = openSet1[winner];
    //var current = heap.pop();
		removeFromArray(openSet1, current);
		closedSet1.push(current);

		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (closedSet1.indexOf(neighbor) == -1 && !neighbor.wall) {
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

				var newpath1 = false;
				if (openSet1.indexOf(neighbor) == 1) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newpath1 = true;
					}
				} else {
					neighbor.g = tempG;
					newpath1 = true;
					openSet1.push(neighbor);
          // heap.push(neighbor);
				}

				console.log(neighbor.g)
				if (newpath1) {
					neighbor.h = manhattan(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
          // no heuristic is uniform cost SEARCH
					neighbor.previous = current;
				}
			}
		}

	} else {
		// console.log("no solution")


    // NAVIGATE WITH THE ARROWS TO CHECK F, G, H


		// noLoop();
		// return;
	}

  // if(heap.size() != 0)
  if(openSet1.length != 0){
    path1 = [];
  	var temp = current;
  	path1.push(temp);
  	while (temp.previous){
  		path1.push(temp.previous);
  		temp = temp.previous;
  	}

  	noFill();
  	stroke(55, 200, 100);
  	strokeWeight(2);
  	beginShape();
  	for(var i = 0; i < path1.length; i++){
  		vertex(path1[i].i * w + w/2, path1[i].j * h + h/2);
  	}
  	endShape();
  }

	if (current === end) {
    t1 = performance.now();
    console.log("path1 LENGTH IS:", path1.length);
    console.log("# OF NODES EXPANDED:", closedSet1.length);
    console.log("RA* took " + (t1 - t0) + " milliseconds.");

		//find the path1

		noFill();
		stroke(0, 0, 255);
		strokeWeight(4);
		beginShape();
		for(var i = 0; i < path1.length; i++){
			vertex(path1[i].i * w + w/2, path1[i].j * h + h/2);
		}
		endShape();

		// create a text file
		// var list = [];
		// var startCoord = startX + " " + startY + ",";
		// var endCoord = endX + " " + endY + ",";
		// var coords = startCoord.concat(endCoord);

		// 120 x 160 grid
		// make_a_txt_file();


	  openSet1.length = 0;
		console.log("COMPLETE");
	}
}

function regular_a_star_search_with_chebyshev(){

  if (openSet3.length > 0) {
  // if(heap.size() > 0)
		var winner = 0;
		for (var i = 0; i < openSet3.length; i++) {
			if (openSet3[i].f < openSet3[winner].f) {
				winner = i;
			}
		}

		var current = openSet3[winner];
    //var current = heap.pop();
		removeFromArray(openSet3, current);
		closedSet3.push(current);

		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (closedSet3.indexOf(neighbor) == -1 && !neighbor.wall) {
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

				var newpath3 = false;
				if (openSet3.indexOf(neighbor) == 1) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newpath3 = true;
					}
				} else {
					neighbor.g = tempG;
					newpath3 = true;
					openSet3.push(neighbor);
          // heap.push(neighbor);
				}

				console.log(neighbor.g)
				if (newpath3) {
					neighbor.h = chebyshev(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
          // no heuristic is uniform cost SEARCH
					neighbor.previous = current;
				}
			}
		}

	} else {
		// console.log("no solution")


    // NAVIGATE WITH THE ARROWS TO CHECK F, G, H


		// noLoop();
		// return;
	}

  // if(heap.size() != 0)
  if(openSet3.length != 0){
    path3 = [];
  	var temp = current;
  	path3.push(temp);
  	while (temp.previous){
  		path3.push(temp.previous);
  		temp = temp.previous;
  	}

  	noFill();
  	stroke(55, 20, 250);
  	strokeWeight(2);
  	beginShape();
  	for(var i = 0; i < path3.length; i++){
  		vertex(path3[i].i * w + w/2, path3[i].j * h + h/2);
  	}
  	endShape();
  }

	if (current === end) {
    t1 = performance.now();
    console.log("path3 LENGTH IS:", path3.length);
    console.log("# OF NODES EXPANDED:", closedSet3.length);
    console.log("RA* took " + (t1 - t0) + " milliseconds.");

		//find the path3

		noFill();
		stroke(0, 0, 255);
		strokeWeight(4);
		beginShape();
		for(var i = 0; i < path3.length; i++){
			vertex(path3[i].i * w + w/2, path3[i].j * h + h/2);
		}
		endShape();

		// create a text file
		// var list = [];
		// var startCoord = startX + " " + startY + ",";
		// var endCoord = endX + " " + endY + ",";
		// var coords = startCoord.concat(endCoord);

		// 120 x 160 grid
		// make_a_txt_file();


	  openSet3.length = 0;
		console.log("COMPLETE");
	}
}

function regular_a_star_search_with_octile(){

  if (openSet4.length > 0) {
  // if(heap.size() > 0)
		var winner = 0;
		for (var i = 0; i < openSet4.length; i++) {
			if (openSet4[i].f < openSet4[winner].f) {
				winner = i;
			}
		}

		var current = openSet4[winner];
    //var current = heap.pop();
		removeFromArray(openSet4, current);
		closedSet4.push(current);

		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (closedSet4.indexOf(neighbor) == -1 && !neighbor.wall) {
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

				var newpath4 = false;
				if (openSet4.indexOf(neighbor) == 1) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newpath4 = true;
					}
				} else {
					neighbor.g = tempG;
					newpath4 = true;
					openSet4.push(neighbor);
          // heap.push(neighbor);
				}

				console.log(neighbor.g)
				if (newpath4) {
					neighbor.h = squaredEuclidean(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
          // no heuristic is uniform cost SEARCH
					neighbor.previous = current;
				}
			}
		}

	} else {
		// console.log("no solution")


    // NAVIGATE WITH THE ARROWS TO CHECK F, G, H


		// noLoop();
		// return;
	}

  // if(heap.size() != 0)
  if(openSet4.length != 0){
    path4 = [];
  	var temp = current;
  	path4.push(temp);
  	while (temp.previous){
  		path4.push(temp.previous);
  		temp = temp.previous;
  	}

  	noFill();
  	stroke(0, 250, 10);
  	strokeWeight(2);
  	beginShape();
  	for(var i = 0; i < path4.length; i++){
  		vertex(path4[i].i * w + w/2, path4[i].j * h + h/2);
  	}
  	endShape();
  }

	if (current === end) {
    t1 = performance.now();
    console.log("path4 LENGTH IS:", path4.length);
    console.log("# OF NODES EXPANDED:", closedSet4.length);
    console.log("RA* took " + (t1 - t0) + " milliseconds.");

		//find the path4

		noFill();
		stroke(0, 0, 255);
		strokeWeight(4);
		beginShape();
		for(var i = 0; i < path4.length; i++){
			vertex(path4[i].i * w + w/2, path4[i].j * h + h/2);
		}
		endShape();

		// create a text file
		// var list = [];
		// var startCoord = startX + " " + startY + ",";
		// var endCoord = endX + " " + endY + ",";
		// var coords = startCoord.concat(endCoord);

		// 120 x 160 grid
		// make_a_txt_file();


	  openSet4.length = 0;
		console.log("COMPLETE");
	}
}




function sequential_a_star_search(){
  var winner1 = 0;
  for (var i = 0; i < openSet1.length; i++) {
    if (openSet1[i].f < openSet1[winner1].f) {
      winner1 = i;
    }
  }

  var winner2 = 0;
  for (var i = 0; i < openSet2.length; i++) {
    if (openSet2[i].f < openSet2[winner2].f) {
      winner2 = i;
    }
  }

  var winner3 = 0;
  for (var i = 0; i < openSet3.length; i++) {
    if (openSet3[i].f < openSet3[winner3].f) {
      winner3 = i;
    }
  }

  var winner = 0;
  for (var i = 0; i < openSet.length; i++) {
    if (openSet[i].f < openSet[winner].f) {
      winner = i;
    }
  }

  // if (openSet1[winner1].f < 1.7 * openSet[winner].f){
  //   regular_a_star_search_with_manhattan();
  // } else {
  //   regular_a_star_search();
  // }

  if (openSet2[winner2].f < 1.7 * openSet[winner].f){
    regular_a_star_search_with_squared_euclidean();
  } else {
    regular_a_star_search();
  }
  //
  if (openSet3[winner3].f < 1.7 * openSet[winner].f){
    regular_a_star_search_with_chebyshev();
  } else {
    regular_a_star_search();
  }


}
