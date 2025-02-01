// A bookmarklet that allows you to draw on any webpage.
(() => {
    if ((window as any).drawingApp) {
      (window as any).drawingApp.toggleDrawing();
      return;
    }

    const style = document.createElement('style');
    style.innerHTML = `
      #drawingCanvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
      }
      #drawingControls {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 10000;
        display: flex;
        flex-direction: row;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 10px;
        border-radius: 8px;
      }
      #drawingControls input {
        margin: 5px;
      }
      .color-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin: 5px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    const canvas = document.createElement('canvas');
    canvas.id = 'drawingCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let drawing = false;
    let color = '#000000';
    let brushSize = 5;
    let isDrawingEnabled = true;

    if (isPageDark()) {
        color = '#ffffff';
    }

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    const controls = document.createElement('div');
    controls.id = 'drawingControls';
    document.body.appendChild(controls);

    // Add color input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = color;
    colorInput.addEventListener('input', (e) => {
        color = (e.target as HTMLInputElement).value;
    });
    makeDraggable(controls);
    controls.appendChild(colorInput);

    // Add specific color selectors
    const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
    colors.forEach((colorValue) => {
        const colorCircle = document.createElement('div');
        colorCircle.className = 'color-circle';
        colorCircle.style.backgroundColor = colorValue;
        colorCircle.addEventListener('click', () => {
            color = colorValue;
            colorInput.value = colorValue;
        });
        controls.appendChild(colorCircle);
    });

    // Add brush size input
    const brushSizeInput = document.createElement('input');
    brushSizeInput.type = 'range';
    brushSizeInput.min = '1';
    brushSizeInput.max = '50';
    brushSizeInput.value = brushSize.toString();
    brushSizeInput.addEventListener('input', (e) => {
        brushSize = parseInt((e.target as HTMLInputElement).value, 10);
    });
    controls.appendChild(brushSizeInput);

    // Add event listeners for drawing
    canvas.addEventListener('mousedown', () => {
        if (!isDrawingEnabled) return;
        drawing = true;
        ctx.beginPath();
    });

    canvas.addEventListener('mouseup', () => {
        if (!isDrawingEnabled) return;
        drawing = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!drawing || !isDrawingEnabled) return;
        const x = e.clientX + window.scrollX;
        const y = e.clientY + window.scrollY;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    });

    // Add toggleDrawing function to window.drawingApp
    (window as any).drawingApp = {
        toggleDrawing: () => {
            isDrawingEnabled = !isDrawingEnabled;
            canvas.style.display = isDrawingEnabled ? 'block' : 'none';
            controls.style.display = isDrawingEnabled ? 'flex' : 'none';
        }
    };
})();

function isPageDark() {
    const body = document.body;
    const backgroundRGB = getComputedStyle(body).backgroundColor.match(/\d+/g);
    const [R, G, B] = backgroundRGB?.map((color) => parseInt(color)) || [255, 255, 255];
    const brightness = (R * 299 + G * 587 + B * 114) / 1000;
    return brightness < 128;
}

function makeDraggable(element: HTMLElement) {
    let isDragging = false;
    let [startX, startY, initialLeft, initialTop] = [0, 0, 0, 0];

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = element.offsetLeft;
        initialTop = element.offsetTop;
        document.body.style.userSelect = 'none'; // Prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = ''; // Re-enable text selection
    });
}