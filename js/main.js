const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;
const NODE_SIZE = 20;

let canvas = document.getElementById('main_canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let ctx = canvas.getContext('2d');
let node_list = [];
let selected_node;


ctx.font = '12px serif';

node_list = JSON.parse('[{"i":0,"p":-1,"x":712,"y":206,"c":[1,6,7]},{"i":1,"p":0,"x":609,"y":310,"c":[2,5]},{"i":2,"p":1,"x":507,"y":400,"c":[3,4]},{"i":3,"p":2,"x":430,"y":483,"c":[]},{"i":4,"p":2,"x":548,"y":482,"c":[]},{"i":5,"p":1,"x":607,"y":385,"c":[]},{"i":6,"p":0,"x":703,"y":286,"c":[]},{"i":7,"p":0,"x":765,"y":267,"c":[8,9]},{"i":8,"p":7,"x":812,"y":311,"c":[]},{"i":9,"p":7,"x":759,"y":321,"c":[10,11]},{"i":10,"p":9,"x":755,"y":386,"c":[]},{"i":11,"p":9,"x":800,"y":366,"c":[]}]');
selected_node = node_list[0];

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

function findPathOfNode(start, destination, graph, path) {
    path.push(start);
    console.log(start, path);

    if (start.i === destination.i) {
        return true;
    }

    for (child of start.c) {
        let childNode = findNodeAtIndex(child, graph);
        if (findPathOfNode(childNode, destination, graph, path) === true) {
            return true;
        } else {
            path.pop();
        }
    }

    return false;
}

function drawNode(node, selected, color) {
    color = color === undefined ? 'rgb(200, 0, 0)' : color;
    ctx.fillStyle = selected ? 'rgb(0, 200, 0)' : color;
    ctx.fillRect(node.x, node.y, NODE_SIZE, NODE_SIZE);
    ctx.fillText(node.i, node.x+NODE_SIZE, node.y+NODE_SIZE/2);
}

function drawNodes(nodes, color) {
    for (const [i, node] of nodes.entries()) {
        drawNode(node, i === selected_node.i, color);
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
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawNodes(node_list);
    drawNodeLinks(node_list);
    // requestAnimationFrame(updateDisplay);
}

function doPathCalc() {
    const startNode = findNodeAtIndex(4, node_list);
    const endNode = findNodeAtIndex(11, node_list);
    let path = [];
    findPathOfNode(startNode, endNode, node_list, path);
    drawNodes(path, 'rgb(0, 0, 200)');
}

updateDisplay();
