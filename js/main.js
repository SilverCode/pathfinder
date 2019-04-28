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

node_list = JSON.parse('[{"i":0,"x":378,"y":118,"c":[1,10,21]},{"i":1,"x":352,"y":222,"c":[0,2,5]},{"i":2,"x":283,"y":311,"c":[1,3,4]},{"i":3,"x":249,"y":400,"c":[2]},{"i":4,"x":326,"y":405,"c":[2,8,9]},{"i":5,"x":423,"y":341,"c":[1,6,7]},{"i":6,"x":380,"y":371,"c":[5]},{"i":7,"x":449,"y":382,"c":[5]},{"i":8,"x":297,"y":471,"c":[4]},{"i":9,"x":370,"y":471,"c":[4]},{"i":10,"x":464,"y":217,"c":[0,11,13,16]},{"i":11,"x":441,"y":267,"c":[10,12]},{"i":12,"x":438,"y":308,"c":[11]},{"i":13,"x":508,"y":258,"c":[10,14,15]},{"i":14,"x":515,"y":299,"c":[13]},{"i":15,"x":580,"y":273,"c":[13]},{"i":16,"x":574,"y":209,"c":[10,17,18]},{"i":17,"x":592,"y":152,"c":[16,19,20]},{"i":18,"x":661,"y":264,"c":[16]},{"i":19,"x":660,"y":202,"c":[17]},{"i":20,"x":638,"y":107,"c":[17]},{"i":21,"x":280,"y":180,"c":[0,22,23]},{"i":22,"x":192,"y":154,"c":[21]},{"i":23,"x":280,"y":232,"c":[21,24]},{"i":24,"x":214,"y":268,"c":[23,25]},{"i":25,"x":152,"y":280,"c":[24,26]},{"i":26,"x":74,"y":353,"c":[25]}]');
selected_node = node_list[0];

canvas.addEventListener('click', (event) => {
    let temp_node = findNodeAtPos(event.clientX, event.clientY);

    if (temp_node === -1) {
        let new_node = {
            i: node_list.length,
            x: event.clientX - NODE_SIZE/2,
            y: event.clientY - NODE_SIZE/2,
            c: []
        };

        if (selected_node) {
            new_node.c.push(selected_node.i);
            selected_node.c.push(new_node.i);
        }

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
    path_list = findPathOfNode(4, 13, node_list);
}

updateDisplay();
