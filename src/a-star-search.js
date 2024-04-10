
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
      estimate: distanceFn(startNode, targetNode),
      path: [startNode] // Store the path that led to this node
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
      // If this nodereaches the goal, return the path that led to this node
      if (node.state.id() == targetNode.id()) {
      
        //render path instead of returning it
        node.path.forEach(node => {
          node.select();
        });


        let totalDistance = 0;

        for (let i = 0; i < node.path.length - 1; i++) {
          totalDistance += distanceFn(node.path[i], node.path[i + 1])
        }

        alert("Total distance: " + totalDistance);

       
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
            estimate: cost + distanceFn(step.state, targetNode),
            path: [...node.path, step.state] // Store the path that led to this node

          });
        }
      }
    }
  
    alert("No path found");
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
