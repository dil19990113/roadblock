const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const savePathBtn = document.getElementById('savePathBtn');
const deletePathBtn = document.getElementById('deletePathBtn');
const addPathBtn = document.getElementById('addPathBtn');

// Map Image
const mapImage = new Image();
mapImage.src = "https://cdn.glitch.global/3b71e39a-5c7a-4c89-bb44-975f84b0f4da/Screenshot%20(53).jpg?v=1718716107046"; // Use an actual image path or URL

// Car Image
const carImage = new Image();
carImage.src = "https://cdn.glitch.global/3b71e39a-5c7a-4c89-bb44-975f84b0f4da/download_-_2024-06-18T182432.188-removebg-preview.png?v=1718715306439"; // Use an actual image path or URL

// Car initial position
let carX = 0;
let carY = 0;

// Car movement speed
const speed = 2;

// Car movement paths
let paths = [];
let currentPath = [];
let currentPathIndex = 0;
let originalPaths = [];

// To track if the path drawing is active
let isDrawing = false;

// Load images and add event listeners
mapImage.onload = () => {
    carImage.onload = () => {
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', drawPath);
        canvas.addEventListener('mouseup', stopDrawing);
        savePathBtn.addEventListener('click', savePath);
        deletePathBtn.addEventListener('click', deletePath);
        addPathBtn.addEventListener('click', addNewPath);
        requestAnimationFrame(animate);
    };
};

function startDrawing(event) {
    isDrawing = true;
    const { offsetX, offsetY } = event;
    currentPath = [{ x: offsetX, y: offsetY }];
}

function drawPath(event) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event;
    currentPath.push({ x: offsetX, y: offsetY });
    redraw();
}

function stopDrawing() {
    isDrawing = false;
    if (currentPath.length > 0) {
        paths.push(currentPath);
        originalPaths.push([...currentPath]);
        if (paths.length === 1) {
            carX = currentPath[0].x;
            carY = currentPath[0].y;
        }
    }
    currentPath = [];
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    paths.forEach(path => {
        if (path.length > 1) {
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (let point of path) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
            ctx.lineWidth = 5;
            ctx.stroke();
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    redraw();

    if (paths.length > 0) {
        ctx.drawImage(carImage, carX - 25, carY - 25, 50, 50);
        moveCar();
    }

    requestAnimationFrame(animate);
}

function moveCar() {
    if (paths.length > 0) {
        const path = paths[currentPathIndex];
        if (path.length > 1) {
            const target = path[1];
            const dx = target.x - carX;
            const dy = target.y - carY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < speed) {
                carX = target.x;
                carY = target.y;
                path.shift();
            } else {
                carX += (dx / distance) * speed;
                carY += (dy / distance) * speed;
            }
        } else if (path.length === 1) {
            paths[currentPathIndex] = [...originalPaths[currentPathIndex]];
            currentPathIndex = (currentPathIndex + 1) % paths.length;
            carX = paths[currentPathIndex][0].x;
            carY = paths[currentPathIndex][0].y;
        }
    }
}

function savePath() {
    if (currentPath.length > 0) {
        originalPaths.push([...currentPath]);
        paths.push([...currentPath]);
        alert('Path saved!');
    }
}

function deletePath() {
    if (paths.length > 0) {
        paths.pop();
        originalPaths.pop();
        alert('Last saved path deleted!');
    }
}

function addNewPath() {
    currentPath = [];
    carX = 0;
    carY = 0;
    redraw();
}
