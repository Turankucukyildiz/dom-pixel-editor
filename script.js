const canvas = document.getElementById("canvas");
const colorPicker = document.getElementById("colorPicker");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const resizeBtn = document.getElementById("resizeBtn");
const saveAsPNGBtn = document.getElementById("saveAsPNG");
const presetContainer = document.getElementById("presetColorsContainer");

let drawing = false;
let erasing = false;

let width = widthInput.valueAsNumber;
let height = heightInput.valueAsNumber;
let zoom = 16;
let color = colorPicker.value;
let pixelArray = new Array(width * height).fill(null);

function setCanvasWidth() {
    canvas.style.width = width * zoom + "px";
}

function setCanvasHeight() {
    canvas.style.height = height * zoom + "px";
}

function updatePixelsOnZoom() {
    const pixels = canvas.querySelectorAll(".pixel");
    pixels.forEach(pixel => {
        const x = parseInt(pixel.dataset.x, 10);
        const y = parseInt(pixel.dataset.y, 10);
        pixel.style.width = zoom + "px";
        pixel.style.height = zoom + "px";
        pixel.style.left = x * zoom + "px";
        pixel.style.top = y * zoom + "px";
    });
}

function resize() {
    if (!widthInput.checkValidity()) {
        widthInput.reportValidity();
        return;
    }
    if (!heightInput.checkValidity()) {
        heightInput.reportValidity();
        return;
    }

    const newWidth = widthInput.valueAsNumber;
    const newHeight = heightInput.valueAsNumber;

    if (width === newWidth && height === newHeight) return;

    width = newWidth;
    height = newHeight;
    pixelArray = new Array(width * height).fill(null);
    canvas.innerHTML = "";

    setCanvasWidth();
    setCanvasHeight();
}

function findColumnRow(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const column = Math.floor(x / zoom);
    const row = Math.floor(y / zoom);
    return [column, row];
}

function draw(event) {
    const rect = canvas.getBoundingClientRect();
    if (event.clientX <= rect.left || event.clientY <= rect.top) return;

    const [column, row] = findColumnRow(event);
    const index = column + row * width;

    if (column < 0 || row < 0 || column >= width || row >= height) return;

    if (event.target.classList.contains("pixel")) {
        const px = parseInt(event.target.dataset.x, 10);
        const py = parseInt(event.target.dataset.y, 10);

        if (px === column && py === row) {
            event.target.style.backgroundColor = color;
            pixelArray[index] = color;
        }
    } else if (pixelArray[index] === null) {
        pixelArray[index] = color;

        const pixel = document.createElement("div");
        pixel.className = "pixel";
        pixel.dataset.x = column;
        pixel.dataset.y = row;
        pixel.style.backgroundColor = color;
        pixel.style.width = zoom + "px";
        pixel.style.height = zoom + "px";
        pixel.style.position = "absolute";
        pixel.style.left = column * zoom + "px";
        pixel.style.top = row * zoom + "px";

        canvas.appendChild(pixel);
    }
}

function erase(event) {
    const rect = canvas.getBoundingClientRect();
    if (event.clientX <= rect.left || event.clientY <= rect.top) return;

    const [column, row] = findColumnRow(event);
    const index = column + row * width;

    if (column < 0 || row < 0 || column >= width || row >= height) return;

    if (event.target.classList.contains("pixel")) {
        const px = parseInt(event.target.dataset.x, 10);
        const py = parseInt(event.target.dataset.y, 10);

        if (px === column && py === row) {
            event.target.remove();
            pixelArray[index] = null;
        }
    }
}

colorPicker.addEventListener("input", () => {
    color = colorPicker.value;
});

resizeBtn.addEventListener("click", resize);

canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const zoomStep = 0.5;
    const direction = Math.sign(event.deltaY);

    if (direction > 0) {
        zoom = Math.max(8, zoom - zoomStep);
    } else if (direction < 0) {
        zoom = Math.min(64, zoom + zoomStep);
    }

    setCanvasWidth();
    setCanvasHeight();
    updatePixelsOnZoom();
}, { passive: false });

canvas.addEventListener("mousedown", (event) => {
    document.body.style.userSelect = "none";
    if (event.button === 0) {
        drawing = true;
        erasing = false;
        draw(event);
    } else if (event.button === 2) {
        drawing = false;
        erasing = true;
        erase(event);
    }
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    erasing = false;
    document.body.style.userSelect = "auto";
});

canvas.addEventListener("mousemove", (event) => {
    if (drawing && !erasing) {
        draw(event);
    } else if (erasing && !drawing) {
        erase(event);
    }
});

canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

saveAsPNGBtn.addEventListener("click", () => {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    offscreenCanvas.style.imageRendering = "pixelated";
    const ctx = offscreenCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = x + y * width;
            const color = pixelArray[index];

            const offset = index * 4;
            if (color) {
                const rgb = hexToRgb(color);
                data[offset] = rgb.r;
                data[offset + 1] = rgb.g;
                data[offset + 2] = rgb.b;
                data[offset + 3] = 255;
            } else {
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 0;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = offscreenCanvas.toDataURL("image/png");
    link.click();
});

function hexToRgb(hex) {
    const sanitized = hex.replace(/^#/, "");
    const bigint = parseInt(sanitized, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const presetColors = presetContainer.querySelectorAll(".preset-color");
    presetColors.forEach(div => {
        const color = div.dataset.color;
        div.style.backgroundColor = color;
    });

    presetContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("preset-color")) {
            const colorValue = target.dataset.color;
            color = colorValue;
            colorPicker.value = colorValue;
        }
    });
});

setCanvasWidth();
setCanvasHeight();
