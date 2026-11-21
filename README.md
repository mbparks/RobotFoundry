# Paperbot Foundry v1.1.0

A Green Shoe Garage workshop for building cut-paper robots. Chip Boardman Gearhart III is the editable starter model. Choose **New build → Empty mat** for a blank project.

## Use the package

| Goal | What to do |
| --- | --- |
| GitHub repository | Extract the ZIP and commit its contents at the repository root. Keep the `public/` folder alongside this README. |
| Web server | Copy the contents of `public/` into the directory for the robot workshop. For example, put them in `paperbots/` to serve the editor at `/paperbots/`. |
| Local or offline use | Open `public/index.html` in a browser. |
| GitHub Pages | Publish the root of the branch containing these files. The root `index.html` opens the editor in `./public/`. |

The app uses static HTML, CSS, JavaScript, SVG, and a bundled font. The files in `public/` are the editable source and the deployable website. Keep `assets/` beside `index.html` when copying the site. Visitors' projects live in their browsers and in the JSON files they export.

## Build a robot

Browse 168 designs in ten categories, or search across the whole drawer by name. Choose a design to swap that piece or add it to an empty slot. Arms, hands, and legs have independent left and right slots. Select any part on the mat to drag it. The **Part adjustment** menu also reaches pieces hidden behind others. Rotate, scale, mirror horizontally or vertically, duplicate, remove, or change stacking order. Arrow keys move the selected piece when the mat has focus. Hold Shift for ten-unit steps. Undo and redo are available during the editing session.

Select a **Robot palette** for the shared paper stocks. To style one piece, select it and choose **Colors & pattern**. Change any paper swatch to give that piece its own colors. Choose plain paper or one of seven prints and set its ink. The preview updates as you work. **Apply to piece** saves the changes. **Use robot colors** reconnects a piece to the shared palette while preserving its print. Duplicates carry independent copies of the originals’ finishes. Workshop settings include night and high-contrast appearances.

## Export and reopen

**Export robot** downloads the square artwork as SVG, PNG, or JPG. The SVG embeds its paths, gradients, and paper textures. PNG and JPG support 600, 1200, or 2400 pixels per side. SVG and PNG can have a transparent background. JPG uses warm paper or white. The grid, selection outlines, and interface are excluded. Pieces extending past the mat edge are cropped.

Choose **JSON** to download an editable project. Use **Open JSON** to restore the robot name, paper colors, part designs, positions, rotations, scales, both mirror axes, per-piece stocks, patterns, inks, and stacking order. Version 1.0 projects open with their existing palette and plain paper. Version 1.1 saves schema version 2 JSON. The current build also autosaves in this browser when local storage is available. For a portable backup, keep the JSON file.

## Included font

Open Sans Condensed Bold is supplied under the Apache License 2.0. See `public/assets/FONT-LICENSE.txt` and `public/assets/Apache-2.0.txt`.
