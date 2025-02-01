declare function CSS(strings: TemplateStringsArray, ...values: any[]): string;

(() => {
    if ((window as any).drawingApp) {
      (window as any).drawingApp.toggleDrawing();
      return;
    }

    const style = document.createElement('style');
    style.innerHTML = CSS`
        #drawingCanvas,
        .rainbow-overlay {
        position: absolute;
        top: 0;
        left: 0;
        }

        .rainbow-overlay {
        top: 6px;
        left: 6px;
        }

        #drawingControls {
        position: fixed;
        top: 10px;
        left: 10px;
        }

        #drawingCanvas {
        z-index: 9999;
        }

        #drawingControls {
        z-index: 10000;
        display: flex;
        flex-direction: row;
        padding: 10px;
        border-radius: 8px;
        }

        #drawingControls input,
        .color-circle {
        margin: 5px;
        }

        .color-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid black;
        }

        .rainbow-gradient {
        background: linear-gradient(to right,
            #ff0000,
            #ffff00,
            #00ff00,
            #00ffff,
            #0000ff,
            #ff00ff,
            #ff0000
        );
        }

        .color-picker-wrapper {
        position: relative;
        display: inline-block;
        }

        .rainbow-overlay {
        width: 48px;
        height: 25px;
        right: 0;
        bottom: 0;
        pointer-events: none;
        border-radius: 2px;
        display: none;
        }
    `;
    document.head.appendChild(style);

    const canvas = document.createElement('canvas');
    canvas.id = 'drawingCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let drawing = false;
    let color = isPageDark() ? '#ffffff' : '#000000';
    let brushSize = 5;
    let enabled = true;
    let mouseMoved = false;
    let isRainbowMode = false;
    const actions: ImageData[] = [];

    canvas.width = document.body.scrollWidth;
    canvas.height = document.body.scrollHeight;

    const controls = document.createElement('div');;
    controls.id = 'drawingControls';
    controls.style.backgroundColor = isPageDark() ? 'rgb(175, 175, 175)' : 'rgb(75, 75, 75)';
    document.body.appendChild(controls);

    // Create wrapper for color picker and overlay
    const colorPickerWrapper = document.createElement('div');;
    colorPickerWrapper.className = 'color-picker-wrapper';

    // Add color input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = color;
    
    // Create rainbow overlay
    const rainbowOverlay = document.createElement('div');;
    rainbowOverlay.className = 'rainbow-overlay rainbow-gradient';

    const enableRainbowMode = () => {
        isRainbowMode = true;
        rainbowOverlay.style.display = 'block';
    }

    const disableRainbowMode = () => {
        isRainbowMode = false;
        rainbowOverlay.style.display = 'none';
    }
    
    // Add event listeners for color input
    colorInput.addEventListener('input', (e) => {
        if (!isRainbowMode) {
            color = (e.target as HTMLInputElement).value;
        }
    });

    colorInput.addEventListener('click', (e) => {
        if (isRainbowMode) {
            // Prevent the color picker from opening in rainbow mode
            e.preventDefault();
            disableRainbowMode();
        }
    });

    // Assemble color picker components
    colorPickerWrapper.appendChild(colorInput);
    colorPickerWrapper.appendChild(rainbowOverlay);
    controls.appendChild(colorPickerWrapper);
    makeDraggable(controls);

    const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
    colors.forEach((colorValue) => {
        const colorCircle = document.createElement('div');;
        colorCircle.className = 'color-circle';
        colorCircle.style.backgroundColor = colorValue;
        colorCircle.addEventListener('click', () => {
            color = colorValue;
            colorInput.value = colorValue;
            disableRainbowMode();
        });
        controls.appendChild(colorCircle);
    });

    // Add rainbow color selector
    const rainbowCircle = document.createElement('div');;
    rainbowCircle.className = 'color-circle rainbow-circle rainbow-gradient';
    rainbowCircle.addEventListener('click', enableRainbowMode);
    controls.appendChild(rainbowCircle);

    // Add brush size input
    const brushSizeInput = document.createElement('input');
    brushSizeInput.type = 'range';
    brushSizeInput.min = '1';
    brushSizeInput.max = '50';
    brushSizeInput.value = brushSize.toString();
    brushSizeInput.addEventListener('input', e => brushSize = parseInt((e.target as HTMLInputElement).value, 10));
    brushSizeInput.addEventListener('mousedown', (e) => e.stopPropagation());
    controls.appendChild(brushSizeInput);

    const undo = () => {
        if (actions.length > 0) {
            actions.pop();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (actions.length > 0) {
                ctx.putImageData(actions[actions.length - 1], 0, 0);
            }
        }
    };

    const pos = (e: MouseEvent) => ({
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY
    });

    // Add event listeners for drawing
    canvas.addEventListener('mousedown', (e) => {
        if (!enabled) return;
        drawing = true;
        mouseMoved = false;
        ctx.beginPath();
    });

    canvas.addEventListener('mouseup', (e) => {
        if (!enabled) return;
        drawing = false;
        if (!mouseMoved) {
            const { x, y } = pos(e);
            draw(ctx, x, y, isRainbowMode ? `hsl(${hue(x, y)}, 100%, 50%)` : color, brushSize * 1.25);
        }
        actions.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!drawing || !enabled) return;
        const { x, y } = pos(e);
        draw(ctx, x, y, isRainbowMode ? `hsl(${hue(x, y)}, 100%, 50%)` : color, brushSize);
        mouseMoved = true;
    });

    document.addEventListener('keydown', (e) => {
        if (enabled) {
            if (e.key === 'Escape') {
                (window as any).drawingApp.toggleDrawing();
            } else if (e.key === 'z' && e.ctrlKey) {
                undo();
            }
        }
    });

    // Add toggleDrawing function to window.drawingApp
    (window as any).drawingApp = {
        toggleDrawing: () => {
            enabled = !enabled;
            canvas.style.display = enabled ? 'block' : 'none';
            controls.style.display = enabled ? 'flex' : 'none';
        }
    };
})();

const hue = (x: number, y: number) => (x + y) % 360;

function draw(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, brushSize: number) {
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function isPageDark() {
    const backgroundRGB = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
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