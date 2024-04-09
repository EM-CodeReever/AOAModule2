
// open = [start]
// while open is not empty
// next = node in open with lowest fScore
// open.remove(next)
// if next == goal
// // done!
// return
// for each neighbour of next
// new_gscore = next.gscore + distance (next, neighbour)
// if new_gscore < neighbour.gscore
// neighbour.gscore = new_gscore
// neighbour.fscore = new_gscore + estimated_distance (neighbour, goal)
// if neighbour not in open:
// open.add(neighbour)

//https://blog.bitsrc.io/advanced-data-structures-implementing-the-a-algorithm-in-javascript-5ae1e8a4ab2f

// Define the A* search function
  function aStar(startNodeId, targetNodeId, cy, distanceFn) {


    const startNode = cy.$("[id='"+ startNodeId +"']")
    const targetNode = cy.$("[id='"+ targetNodeId +"']")


    // Create an empty data structure to store the explored paths
    let explored = [];
  
    // Create a data structure to store the paths that are being explored
    let open = [{
      state: startNode,
      cost: 0,
      estimate: distanceFn(startNode, targetNode)
    }];
  
    // While there are paths being explored
    while (open.length > 0) {
      // Sort the paths in the open by cost, with the lowest-cost paths first
      open.sort(function(a, b) {
        return a.estimate- b.estimate;
      });
  
      // Choose the lowest-cost path from the open
      let node = open.shift();
  
      // Add this nodeto the explored paths
      explored.push(node);
      // If this nodereaches the goal, return thenode 
      if (node.state.id() == targetNode.id()) {
        // return explored //instead, just render the path

        renderPath(explored, startNode, targetNode);
        // renderPath2(explored, targetNode);
        
        return;
      }
  
  
      // Generate the possible next steps from this node's state
      let next = generateNextSteps(node.state, distanceFn);
  
      // For each possible next step
      for (let i = 0; i < next.length; i++) {
        // Calculate the cost of the next step by adding the step's cost to the node's cost
        let step = next[i];
        let cost = step.cost + node.cost;
  
        // Check if this step has already been explored
        let isExplored = (explored.find( e => {
            return e.state.id() == step.state.id()
        }))

        //avoid repeated nodes during the calculation of neighbors
        let isopen = (open.find( e => {
            return e.state.id() == step.state.id()    
        }))


        // If this step has not been explored
        if (!isExplored && !isopen) {
          // Add the step to the open, using the cost and the heuristic function to estimate the total cost to reach the goal
          open.push({
            state: step.state,
            cost: cost,
            estimate: cost + distanceFn(step.state, targetNode)
          });
        }
      }
    }
  
    alert("No path found");
    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    return null;
  }


  function generateNextSteps(currentNode, distanceFn) {
    // Define an array to store the next steps
    let next = [];

    // Check if the current state has any valid neighbors

    if (currentNode.connectedEdges().length > 0) {

      // Get the paths coonected of the current node
      const adjacentEdges = currentNode.connectedEdges();

      adjacentEdges.forEach(edge => {
        let node = edge.target()

        // if(visited.includes(node.id())) return;

        
       next.push({
          state: node,
          cost: distanceFn(currentNode, node) // could just be 1
       });
        
        
      });

    }

    return next;

  }


  function renderPath(explored, startNode, targetNode) {
    let path = [];

    
    let startCoordinates = startNode.position();
    let targetCoordinates = targetNode.position();


    let x1 = startCoordinates.x, y1 = startCoordinates.y, x2 = targetCoordinates.x, y2 = targetCoordinates.y;


    let isSteep = Math.abs(y2 - y1) > Math.abs(x2 - x1);

    if (isSteep) {
      [x1, y1] = [y1, x1];
      [x2, y2] = [y2, x2];
    }

    let isReversed = false;

    if (x1 > x2) {
      [x1, x2] = [x2, x1];
      [y1, y2] = [y2, y1];
      isReversed = true;
    }
    let deltax = x2 - x1, deltay = Math.abs(y2 - y1);
    let error = Math.floor(deltax / 2);
    let y = y1;
    let ystep = null;
    if (y1 < y2) {
      ystep = 1;
    } else {
      ystep = -1;
    }
    for (let x = x1; x <= x2; x++) {
      if (isSteep) {
        path.push([y, x]);
      } else {
        path.push([x, y]);
      }
      error -= deltay;
      if (error < 0) {
        y += ystep;
        error += deltax;
      }
    }
  
    // If the line is reversed, reverse the order of the points in the path
    if (isReversed) {
      path = path.reverse();
    }
  
    console.log(path);
    return path;
  


  
   
  
    // path.forEach(node => {
    //   node.state.select();

    // });
  }


function renderPath2(explored, targetNode) {

  let localExplored = [...explored];
  let path = [];

  localExplored.sort((a, b) => {
    return a.estimate - b.estimate;
  });

  localExplored.forEach(node => {
    
    path.push(node.state);
    if(node.state.id() == targetNode.id()) return;
  });

  path.forEach(node => {
    node.select();
  });


  return path;
}
