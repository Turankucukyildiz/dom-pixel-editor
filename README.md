DOM Pixel Editor
A lightweight pixel art editor built using HTML, CSS, and JavaScript, without relying on the <canvas> element. Instead, it uses absolutely positioned <div> elements to represent pixels, showcasing an alternative approach to pixel art creation. Perfect for learning DOM manipulation and event handling.

Features
Draw and Erase: Left-click to draw, right-click to erase pixels.
Color Selection: Use a color picker or choose from 10 preset colors.
Resizable Grid: Adjust canvas size (1x1 to 64x64 pixels).
Zoom: Scroll to zoom in/out (8px to 64px per pixel).
PNG Export: Save your artwork as a PNG image.
No Dependencies: Single-file HTML, CSS, and JS structure for easy use.

Getting Started
Clone or download this repository.
Open index.html in a modern web browser.
Start drawing by clicking on the canvas, selecting colors, and adjusting the grid size.

Usage
Drawing: Left-click to place pixels with the selected color.
Erasing: Right-click to remove pixels.
Color Picker: Choose a custom color or click a preset color.
Resize: Enter width/height (1–64) and click "Resize" to adjust the grid.
Zoom: Use the mouse wheel to zoom in/out.
Save: Click "Save as PNG" to download your artwork.

Limitations
Performance: Large grids (e.g., 64x64) may be slow due to DOM-based rendering.
No Grid Lines: The canvas lacks visible grid lines when empty.
Low-Resolution Export: PNG output matches grid size (e.g., 16x16 grid = 16x16px image).
No Undo/Redo: Actions cannot be undone.
Desktop Only: No touch support for mobile devices.

Why This Project?
This editor was created to explore pixel art creation without <canvas>, relying solely on DOM elements. It’s an educational tool for understanding event handling, DOM manipulation, and image generation in JavaScript.

License
This project is licensed under the MIT License.

Acknowledgments
Built as an experimental project to demonstrate DOM-based rendering for pixel art. Feedback and contributions are appreciated!
