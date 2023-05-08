var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
var TILE_SIZE = 4;
var BLOCK_SIZE = 100;
var SPACE_BEETWEEN_BLOCK = 5;
canvas.width = TILE_SIZE * BLOCK_SIZE + SPACE_BEETWEEN_BLOCK * TILE_SIZE - 1;
canvas.height = TILE_SIZE * BLOCK_SIZE + SPACE_BEETWEEN_BLOCK * TILE_SIZE - 1;
const COLOR = [];
const POSITION_AVAILABLE = [];
const CLICK = {
    positionX: undefined,
    positionY: undefined,
};
var PREVIOUS = {
    selectedColor: undefined,
    clickedIndex: undefined,
};
new Array(Math.pow(TILE_SIZE, 2) / 2).fill(null).forEach((_, i) => {
    POSITION_AVAILABLE.push(i, i);
    const [red, green, blue] = [
        getIntegerRandomNumberBetween(0, 255),
        getIntegerRandomNumberBetween(0, 255),
        getIntegerRandomNumberBetween(0, 255),
    ];
    const color = `rgb(${red}, ${green}, ${blue})`;
    COLOR.push(color);
});
randomize(POSITION_AVAILABLE);
window.onclick = function (event) {
    // PREVIOUS.selectedColor = null;
    // PREVIOUS.clickedIndex = null;
    CLICK.positionX = event.clientX;
    CLICK.positionY = event.clientY;
};
var start = window.requestAnimationFrame(() => draw(context));
function draw(context) {
    clearCanvas(context);
    if (checkWin(POSITION_AVAILABLE)) {
        insertText(context, "You Win!");
        return window.cancelAnimationFrame(start);
    }
    POSITION_AVAILABLE.forEach((position, index) => {
        const [x, y] = [
            (index % TILE_SIZE) * (BLOCK_SIZE + SPACE_BEETWEEN_BLOCK),
            Math.floor(index / TILE_SIZE) * (BLOCK_SIZE + SPACE_BEETWEEN_BLOCK),
        ];
        const [OFFSET_X, OFFSET_Y] = [
            window.innerWidth / 2 - canvas.width / 2,
            window.innerHeight / 2 - canvas.height / 2,
        ];
        const isClickedInsideXPosition = (typeof CLICK.positionX === "undefined" || !CLICK.positionX)
            ? false
            : (CLICK.positionX >= x + OFFSET_X &&
                CLICK.positionX <= x + BLOCK_SIZE + OFFSET_X);
        const isClickedInsideYPosition = (typeof CLICK.positionY === "undefined" || !CLICK.positionY)
            ? false
            : (CLICK.positionY >= y + OFFSET_Y &&
                CLICK.positionY <= y + BLOCK_SIZE + OFFSET_Y);
        const isClicked = isClickedInsideXPosition &&
            isClickedInsideYPosition;
        if (isClicked) {
            if (PREVIOUS.clickedIndex && (PREVIOUS.selectedColor === position)) {
                POSITION_AVAILABLE[PREVIOUS.clickedIndex] = null;
                POSITION_AVAILABLE[index] = null;
            }
            PREVIOUS.selectedColor = position;
            PREVIOUS.clickedIndex = index;
            CLICK.positionX = null;
            CLICK.positionY = null;
        }
        context.fillStyle = (typeof position === "number")
            ? COLOR[position]
            : "#00000000";
        context.globalAlpha = PREVIOUS.clickedIndex === index ? 0.7 : 1;
        context.lineWidth = PREVIOUS.clickedIndex === index ? 10 : 1;
        context.beginPath();
        context.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        context.fill();
        context.stroke();
        context.closePath();
    });
    start = window.requestAnimationFrame(() => draw(context));
}
function insertText(context, text) {
    context.font = "50px Arial";
    context.fillStyle = "white";
    let measureText = context.measureText(text);
    context.fillText(text, canvas.width / 2 - measureText.width / 2, canvas.height / 2 + measureText.actualBoundingBoxAscent / 2);
}
function randomize(position) {
    for (let index = 0; index < position.length - 1; index++) {
        let victim = getIntegerRandomNumberBetween(index, position.length - 1);
        let victimPosition = position[victim];
        let prevPosition = position[index];
        position.splice(victim, 1, prevPosition);
        position.splice(index, 1, victimPosition);
    }
}
function getIntegerRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function clearCanvas(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function checkWin(blocks) {
    return blocks.every((block) => !block);
}
