# Auto Design System - Figma Plugin

A Figma plugin that automatically scans your current page and generates a comprehensive design system with all unique colors, text styles, and components.

## ✨ Features

- **Color Extraction**: Automatically finds and displays all unique colors used in your design with usage counts
- **Typography Analysis**: Identifies all unique text styles (font family, weight, size) with sample text
- **Component Library**: Collects all unique components in one organized view
- **Smart Filtering**: Automatically skips locked and hidden layers
- **Easy Copy**: Select and copy any part of the generated design system to paste elsewhere
- **Beautiful Layout**: Clean, organized design system page with proper spacing and grouping

## 📦 Installation

1. **Open Figma Desktop App** (plugins don't work in browser for development)

2. **Create a new plugin**:
   - Go to `Plugins` → `Development` → `New Plugin...`
   - Choose "Import plugin from manifest"
   - Select the `manifest.json` file from this folder

3. **All set!** Your plugin is now ready to use

## 🚀 Usage

1. **Open a Figma file** with the page you want to scan

2. **Run the plugin**:
   - Go to `Plugins` → `Development` → `Auto Design System`

3. **Click "Generate Design System"**:
   - The plugin will scan your current page
   - A new page called "Auto Design System" will be created
   - All unique colors, text styles, and components will be organized there

4. **Copy what you need**:
   - Click "Select for Copy" to select the entire design system
   - Or manually select individual sections/items
   - Press `Cmd/Ctrl+C` to copy
   - Paste anywhere in your Figma file

## 📋 What Gets Scanned

### Colors
- All solid fill colors from shapes, frames, and text
- Shows hex code and usage count
- Sorted by frequency of use
- Displays color swatches with labels

### Text Styles
- Font family, weight, and size combinations
- Line height and letter spacing info
- Sample text from your design
- Usage count for each style
- Sorted by font size (largest to smallest)

### Components
- All master components on the page
- Creates instances for preview
- Component names included
- Easy to identify and copy

## 🎯 Best Practices

1. **Clean up your page first**: Hide or lock any experimental layers you don't want included

2. **Use meaningful names**: Component names will be preserved in the design system

3. **Regenerate as needed**: You can run the plugin multiple times as your design evolves

4. **Copy selectively**: Use the "Select for Copy" button or manually select specific sections

## 🔧 Technical Details

- Built with Figma Plugin API
- No external dependencies
- Uses Inter font for labels (fallback included)
- Supports all Figma color and text properties
- Auto-layout for flexible sizing

## 💡 Tips

- **Large files**: The plugin may take a few seconds for complex pages with many elements
- **Font loading**: If a custom font fails to load, it will be skipped automatically
- **Duplicates**: The plugin automatically removes duplicate colors, text styles, and components
- **Updates**: Re-run the plugin to update the design system after making changes

## 📝 File Structure

```
auto-design-system/
├── manifest.json    # Plugin configuration
├── code.js          # Main plugin logic
└── ui.html          # Plugin UI
```

## 🐛 Troubleshooting

**Plugin doesn't show up?**
- Make sure you're using Figma Desktop App
- Check that manifest.json is properly formatted
- Try restarting Figma

**Some fonts don't appear?**
- The plugin uses fonts that are loaded in Figma
- If a font isn't installed, it will be skipped
- Inter font is used as fallback

**Design system looks empty?**
- Make sure you have visible, unlocked elements on your page
- Check that elements have fills and text content
- Verify you're on the correct page before running

## 🎨 Example Output

The generated design system includes:

1. **Colors Section**: Grid of color swatches with hex codes and usage counts
2. **Typography Section**: List of text styles with samples and specifications  
3. **Components Section**: Gallery of all components with instances

All sections are properly spaced with headers and organized in auto-layout frames for easy manipulation.

## 📄 License

Free to use and modify for your projects!

---

Built for designers who want to quickly document their design systems 🚀
