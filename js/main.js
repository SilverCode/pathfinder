const NODE_SIZE = 20;

let canvas = document.getElementById('main_canvas');
let ctx = canvas.getContext('2d');
let node_list = [];
let selected_node;

ctx.font = '12px serif';

canvas.addEventListener('click', (event) => {
  let temp_node = findNodeAtPos(event.clientX, event.clientY);

  if (temp_node === -1) {
    let new_node = {
      i: node_list.length,
      p: selected_node !== undefined ? selected_node.i : -1,
      x: event.clientX - NODE_SIZE/2,
      y: event.clientY - NODE_SIZE/2,
      c: []
    };

    if (selected_node)
      selected_node.c.push(new_node.i);

    node_list.push(new_node);
    selected_node = new_node;
  } else {
    selected_node = temp_node;
  }

  if (node_list.length == 10) {
    findPathOfNode(0, 5, node_list);
  }

  window.requestAnimationFrame(() => {
    updateDisplay();
  })
});

function findNodeAtPos(x, y) {
  for (const node of node_list) {
    if (x >= node.x && x <= node.x+NODE_SIZE && y >= node.y && y < node.y+NODE_SIZE) {
      return node;
    }
  }

  return -1;
}

function findNodeAtIndex(index, nodes) {
  for (const node of nodes) {
    if (node.i === index) {
      return node;
    }
  }

  return false;
}

function findPathOfNode(start, destination, graph) {
  let stack = [];
  let visited = [];
  let path = [];
  stack.push(findNodeAtIndex(start, graph));

  while (stack.length) {
    let current_node = stack.pop();

    if (current_node.i === destination) {
      break;
    }

    if (visited.indexOf(current_node.i) === -1) {
      visited.push(current_node.i);
      current_node.c.forEach(function(node) {
        if (visited.indexOf(node) === -1) {
          stack.push(findNodeAtIndex(node, graph));
        }
      })
    } else {
      path.pop();
    }
  }

  console.log(stack);

  // let path = [];
  // let visited = [];
  // let stack = [];
  // stack.push(findNodeAtIndex(start, graph));
  //
  // while (true) {
  //   let cur_node = stack[stack.length-1];
  //   path.push(cur_node.i);
  //   visited.push(cur_node.i);
  //
  //   if (cur_node.i === destination) {
  //     break;
  //   }
  //
  //   let unvisited = 0;
  //   cur_node.c.forEach(function(id) {
  //     let node = findNodeAtIndex(id, graph);
  //     if (visited.indexOf(node.i) === -1) {
  //       stack.push(node);
  //       unvisited += 1;
  //     }
  //   });
  //
  //   if (unvisited === 0) {
  //     stack.pop();
  //   }
  // }
  //
  // console.log('stack',stack);
}

function drawNode(node, selected) {
  ctx.fillStyle = selected ? 'rgb(0, 200, 0)' : 'rgb(200, 0, 0)';
  ctx.fillRect(node.x, node.y, NODE_SIZE, NODE_SIZE);
  ctx.fillText(node.i, node.x+NODE_SIZE, node.y+NODE_SIZE/2);
}

function drawNodes(nodes) {
  for (const [i, node] of nodes.entries()) {
    drawNode(node, i === selected_node.i);
  }
}

function drawNodeLink(first_node, second_node) {
  ctx.beginPath();
  ctx.moveTo(first_node.x + NODE_SIZE/2, first_node.y + NODE_SIZE/2);
  ctx.lineTo(second_node.x + NODE_SIZE/2, second_node.y + NODE_SIZE/2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function drawNodeLinks(nodes) {
  for (const node of nodes) {
    const parent_node = findNodeAtIndex(node.p, nodes);

    if (parent_node !== false) {
      drawNodeLink(parent_node, node);
    }
  }
}

function updateDisplay() {
  drawNodes(node_list);
  drawNodeLinks(node_list);
}
