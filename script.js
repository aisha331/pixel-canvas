/*
  Collaborative Pixel Canvas - 32x32 grid with Yjs
  - Color palette: 8 swatches
  - Click to paint a pixel
  - Real-time collaboration with WebRTC
  - Clear button resets canvas
*/

import * as Y from 'https://esm.sh/yjs'
import { WebrtcProvider } from 'https://esm.sh/y-webrtc'

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

  const ydoc = new Y.Doc()
  const pixels = ydoc.getArray('pixels') 
  const provider = new WebrtcProvider('pixel-canvas-room', ydoc)

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

  if (pixels.length === 0) {
    console.log('Initializing pixel array...')
    for (let i = 0; i < totalPixels; i++) {
      pixels.insert(i, [DEFAULT_COLOR])
    }
  }

  for (let i = 0; i < totalPixels; i++) {
    const div = document.createElement('div');
    div.className = 'pixel';
    div.setAttribute('role', 'gridcell');
    div.dataset.index = String(i);
    const color = pixels.get(i) || DEFAULT_COLOR;
    div.style.backgroundColor = color;
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

  // Listen for changes 
  pixels.observe((event) => {
    console.log('Pixels changed! Updating DOM...');
    for (let i = 0; i < totalPixels; i++) {
      const color = pixels.get(i);
      if (color && pixelElements[i]) {
        pixelElements[i].style.backgroundColor = color;
      }
    }
  });

  function paintIndex(idx, color) {
    if (idx < 0 || idx >= totalPixels) return;
    
    pixels.delete(idx, 1);        
    pixels.insert(idx, [color]); 
    
    // Also update DOM immediately for responsiveness
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

  clearBtn.addEventListener('click', () => {
    console.log('Clearing canvas for everyone...');
    // Clear the entire Yjs array and refill with default colors
    pixels.delete(0, pixels.length);
    for (let i = 0; i < totalPixels; i++) {
      pixels.insert(i, [DEFAULT_COLOR]);
    }
    console.log('Canvas cleared');
  });

  console.log('Simple pixel canvas ready!');
})();