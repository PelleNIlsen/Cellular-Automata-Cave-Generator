const CANVAS_HEIGHT = 1000;
const CANVAS_WIDTH = 1000;
const WHITE_LEVEL = 0.5;
const BLACK = 0;
const WHITE = 1;
const COLORS = {
    [BLACK]: 'black',
    [WHITE]: 'white'
};
const PIXEL_RATIO = 5;
const MATRIX_DIMENSIONS = {
    height: CANVAS_HEIGHT / PIXEL_RATIO,
    width: CANVAS_WIDTH / PIXEL_RATIO
};
const canvas = document.querySelector('canvas');
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

function generateWhiteNoise(size, whiteLevel = .6) {
    return new Array(size).fill(0)
        .map(() => Math.random() >= whiteLevel ? BLACK : WHITE);
}

function draw(terrain_matrix) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
    ctx.beginPath();
    terrain_matrix.forEach((pixelsRow, rowIndex) => {
        const y = rowIndex * PIXEL_RATIO;
        pixelsRow.forEach((pixel, pixelIndex) => {
            const x = pixelIndex * PIXEL_RATIO;
            ctx.fillStyle = COLORS[pixel];
            ctx.fillRect(x, y, PIXEL_RATIO, PIXEL_RATIO);
        });
    });
    ctx.closePath();
}

function calculatePixelValueByNeighbours(rowIndex, pixelIndex, matrix) {
    let sum = 0;
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            if (!matrix[rowIndex + y] || !matrix[rowIndex + y][pixelIndex + x]) {
                sum -= 1;
            } else {
                sum += 1;
            }
        }
    }
    return sum > 0 ? WHITE : BLACK;
}

function copyMatrix(matrix) {
    return JSON.parse(JSON.stringify(matrix));
}

function cellularAutomaton(matrix) {
    const tmpMatrix = copyMatrix(matrix);
    tmpMatrix.forEach((row, rowIndex) => {
        row.forEach((pixel, pixelIndex) => {
            tmpMatrix[rowIndex][pixelIndex] = calculatePixelValueByNeighbours(rowIndex, pixelIndex, matrix);
        });
    });
    return tmpMatrix;
}

function forwardFactory(noiseMatrix) {
    const originalMatrix = copyMatrix(noiseMatrix);
    const history = [originalMatrix];
    return (forward = true) => {
        if (forward) {
            noiseMatrix = cellularAutomaton(noiseMatrix);
        } else {
            if (history.length > 1) {
                history.pop();
                noiseMatrix = history.pop();
            }
        }
        draw(noiseMatrix);
        history.push(copyMatrix(noiseMatrix));
    };
}

function init() {
    const noise_matrix = new Array(MATRIX_DIMENSIONS.height).fill(0).map(() => {
        return generateWhiteNoise(MATRIX_DIMENSIONS.width, WHITE_LEVEL);
    });
    draw(noise_matrix);

    forward = forwardFactory(noise_matrix);
}

let forward, resetToOriginal;

init();