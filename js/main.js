const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;
const NODE_SIZE = 20;

let canvas = document.getElementById('main_canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let ctx = canvas.getContext('2d');
let node_list = [];
let path_list = [];
let selected_node;

ctx.font = '12px serif';

canvas.addEventListener('mousedown', (event) => {
    let temp_node = findNodeAtPos(event.clientX, event.clientY);

    if (event.button == 0) {
        // Left Click adds node
        if (temp_node === -1) {
            // No node found where the user clicked, so add a new node
            let new_node = {
                i: node_list.length,
                x: event.clientX - NODE_SIZE / 2,
                y: event.clientY - NODE_SIZE / 2,
                c: []
            };

            if (selected_node) {
                new_node.c.push(selected_node.i);
                selected_node.c.push(new_node.i);
            }

            node_list.push(new_node);
            selected_node = new_node;
        } else {
            // Node was found where the user clicked, so we assume the user wanted
            // to link the selected node to the one they clicked on

            // Make sure we don't already have the relationship between the nodes
            if (selected_node.c.indexOf(temp_node.i) == -1) {
                selected_node.c.push(temp_node.i);
            }
            selected_node = temp_node;
        }
    } else if (event.button == 2) {
        // Right Click selects node
        if (temp_node !== -1) {
            selected_node = temp_node;
        }
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

function findPathOfNode(start, destination, nodes) {
    let stack = [];
    let visited = [];
    let parent_map = [];
    stack.push(start);

    while (stack.length !== 0) {
        const i = stack.pop();
        let node = findNodeAtIndex(i, nodes);

        if (node.i == destination) {
            let current_node = destination;
            let path = [];
            while (current_node !== start) {
                path.push(current_node);
                current_node = parent_map[current_node];
            }
            path.push(start);
            return path.reverse();
        }

        if (visited.indexOf(node.i) === -1) {
            visited.push(node.i);
            if (node.c) {
                for (const child of node.c) {
                    stack.push(child);
                    if (!(child in parent_map)) {
                        parent_map[child] = node.i;
                    }
                }
            }
        }
    }
}

function drawNode(node, selected, color) {
    color = color === undefined ? 'rgb(200, 0, 0)' : color;
    color = path_list.indexOf(node.i) == -1 ? color : 'rgb(0, 0, 200)';
    ctx.fillStyle = selected ? 'rgb(0, 200, 0)' : color;
    ctx.fillRect(node.x - NODE_SIZE/2, node.y-NODE_SIZE/2, NODE_SIZE, NODE_SIZE);
    ctx.fillText(node.i, node.x+NODE_SIZE, node.y+NODE_SIZE/2);
}

function drawNodes(nodes, color) {
    for (const [i, node] of nodes.entries()) {
        drawNode(node, i === selected_node.i, color);
    }
}

function drawNodeLink(first_node, second_node) {
    ctx.beginPath();
    ctx.moveTo(first_node.x, first_node.y);
    ctx.lineTo(second_node.x, second_node.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawNodeLinks(nodes) {
    for (const node of nodes) {
        for (const child of node.c) {
            const tmp = findNodeAtIndex(child, nodes);

            if (tmp !== false) {
                drawNodeLink(tmp, node);
            }
        }
    }
}

function updateDisplay() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawNodes(node_list);
    drawNodeLinks(node_list);
    requestAnimationFrame(updateDisplay);
}

function doPathCalc() {
    const start_node = +document.getElementById('start_node').value;
    const end_node = +document.getElementById('end_node').value;
    path_list = findPathOfNode(start_node, end_node, node_list);
}

function save() {
    localStorage.setItem('graph', JSON.stringify(node_list));
}

function load() {
    let tmp = localStorage.getItem('graph');

    if (tmp) {
        node_list = JSON.parse(tmp);
        selected_node = node_list[0];
    }
}

function clearNodes() {
    node_list = [];
    path_list = [];
    selected_node = null;
}

updateDisplay();
