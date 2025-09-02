/*
  Simple Pixel Canvas - Local 32x32 grid
  - Color palette: 8 swatches
  - Click to paint a pixel
  - Local storage only (no real-time sync)
  - Clear button resets canvas
*/

(function () {
  const GRID_SIZE = 32;
  const DEFAULT_COLOR = '#111827';
  const COLORS = [
    '#ef4444', // red
    '#3b82f6', // blue
    '#22c55e', // green
    '#eab308', // yellow
    '#a855f7', // purple
    '#f97316', // orange
    '#06b6d4', // cyan
    '#ffffff'  // white
  ];

  const paletteEl = document.getElementById('palette');
  const clearBtn = document.getElementById('clearBtn');
  const canvasEl = document.getElementById('canvas');

  //  brush 
  const brushCursor = document.createElement('div');
  brushCursor.className = 'brush-cursor';
  brushCursor.style.backgroundColor = COLORS[0];
  brushCursor.style.display = 'none'; 
  brushCursor.style.left = '0px';
  brushCursor.style.top = '0px';
  document.body.appendChild(brushCursor);
  console.log('Brush cursor created:', brushCursor);

  // Build pixel grid
  const totalPixels = GRID_SIZE * GRID_SIZE;
  const pixelElements = new Array(totalPixels);
  const pixelData = new Array(totalPixels).fill(DEFAULT_COLOR);

  for (let i = 0; i < totalPixels; i++) {
    const div = document.createElement('div');
    div.className = 'pixel';
    div.setAttribute('role', 'gridcell');
    div.dataset.index = String(i);
    div.style.backgroundColor = DEFAULT_COLOR;
    canvasEl.appendChild(div);
    pixelElements[i] = div;
  }

  // Build palette
  let selectedColor = COLORS[0];
  const swatchButtons = COLORS.map((color, idx) => {
    const btn = document.createElement('button');
    btn.className = 'swatch';
    btn.type = 'button';
    btn.style.background = color;
    btn.setAttribute('aria-label', `Color ${idx + 1}`);
    btn.setAttribute('aria-pressed', color === selectedColor ? 'true' : 'false');
    btn.addEventListener('click', () => selectColor(color));
    paletteEl.appendChild(btn);
    return btn;
  });

  function selectColor(color) {
    selectedColor = color;
    swatchButtons.forEach((b) => b.setAttribute('aria-pressed', b.style.background === color ? 'true' : 'false'));
    // Update brush cursor color
    brushCursor.style.backgroundColor = color;
  }

  // Brush cursor tracking
  function updateCursorPosition(e) {
    brushCursor.style.left = e.clientX + 'px';
    brushCursor.style.top = e.clientY + 'px';
  }

  canvasEl.addEventListener('mouseenter', (e) => {
    brushCursor.style.display = 'block';
    updateCursorPosition(e);
    console.log('Cursor should be visible now');
  });
  canvasEl.addEventListener('mouseleave', () => {
    brushCursor.style.display = 'none';
    console.log('Cursor hidden');
  });

  canvasEl.addEventListener('mousemove', updateCursorPosition);

  function getIndexFromEvent(e) {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return -1;
    const idx = Number(target.dataset.index);
    return Number.isFinite(idx) ? idx : -1;
  }

  function paintIndex(idx, color) {
    if (idx < 0 || idx >= totalPixels) return;
    // Update local data and DOM
    pixelData[idx] = color;
    pixelElements[idx].style.backgroundColor = color;
  }

  let isPointerDown = false;
  canvasEl.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    brushCursor.classList.add('painting');
    updateCursorPosition(e);
    const idx = getIndexFromEvent(e);
    if (idx !== -1) paintIndex(idx, selectedColor);
  });
  canvasEl.addEventListener('pointermove', (e) => {
    updateCursorPosition(e);
    if (!isPointerDown) return;
    const idx = getIndexFromEvent(e);
    if (idx !== -1) paintIndex(idx, selectedColor);
  });
  window.addEventListener('pointerup', () => { 
    isPointerDown = false; 
    brushCursor.classList.remove('painting');
  });
  window.addEventListener('pointercancel', () => { 
    isPointerDown = false; 
    brushCursor.classList.remove('painting');
  });

  // Clear 
  clearBtn.addEventListener('click', () => {
    for (let i = 0; i < totalPixels; i++) {
      pixelData[i] = DEFAULT_COLOR;
      pixelElements[i].style.backgroundColor = DEFAULT_COLOR;
    }
    console.log('Canvas cleared');
  });

  console.log('Simple pixel canvas ready!');
})();