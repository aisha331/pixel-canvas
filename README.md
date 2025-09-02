# Collaborative Pixel Canvas

A real-time collaborative pixel art canvas built with **Yjs** (CRDT) and **WebRTC**. Multiple users can paint together in real-time!

- 32x32 pixel grid
- 8 color palette
- Real-time collaboration (no server needed)
- Custom brush cursor
- Clear canvas (affects all users)

##  How to Run

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pixel-canvas
   ```

2. **Start a local server** (required for ES modules)
   ```bash
   # Option 1: Using Node.js
   npx serve .
   
   # Option 2: Using Python
   python3 -m http.server 8000
   
   ```

3. **Open in browser**
   - Go to `http://localhost:3000` (or `http://localhost:8000` if using Python/PHP)

4. **Test collaboration**
   - Open multiple tabs with the same URL
   - Paint in one tab and watch it appear in others instantly! 🎨


## 📝 How It Works

1. **Y.Doc** - Creates a shared document that syncs between users
2. **Y.Array** - Stores pixel colors in a collaborative array
3. **WebRTC Provider** - Connects users in the same "room"
4. **Observer** - Listens for changes and updates the UI

## 🎨 Usage

- **Select color** - Click on color swatches
- **Paint pixels** - Click or drag on the canvas
- **Clear canvas** - Click "Clear" button (clears for everyone!)
- **Collaborate** - Open multiple tabs to see real-time sync

## 🔧 No Installation Required

This project uses CDN imports, so no `npm install` needed! Just serve the files and open in browser.

---