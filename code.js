figma.showUI(__html__, { width: 400, height: 350 });

let designSystemPageId = null;

// Helper functions defined at the top
const rgbToHex = (color) => {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
};

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-design-system') {
    try {
      const currentPage = figma.currentPage;
      
      // Data structures to store unique items
      const colors = new Map();
      const textStyles = new Map();
      const components = new Map();
      
      // Recursive function to scan nodes
      const scanNode = (node) => {
        // Skip locked or hidden layers
        if (node.locked || !node.visible) return;
        
        // Scan for colors
        if ('fills' in node && Array.isArray(node.fills)) {
          node.fills.forEach((fill) => {
            if (fill.type === 'SOLID' && fill.visible !== false) {
              const hex = rgbToHex(fill.color);
              if (!colors.has(hex)) {
                colors.set(hex, { hex, count: 0, nodes: [] });
              }
              const colorData = colors.get(hex);
              colorData.count++;
              colorData.nodes.push(node);
            }
          });
        }
        
        // Scan for text styles
        if (node.type === 'TEXT') {
          const textNode = node;
          const key = `${textNode.fontName !== figma.mixed ? textNode.fontName.family : 'Mixed'}-${textNode.fontSize !== figma.mixed ? textNode.fontSize : 'mixed'}-${textNode.fontName !== figma.mixed ? textNode.fontName.style : 'mixed'}`;
          
          if (!textStyles.has(key)) {
            textStyles.set(key, {
              family: textNode.fontName !== figma.mixed ? textNode.fontName.family : 'Mixed',
              size: textNode.fontSize !== figma.mixed ? textNode.fontSize : 0,
              weight: textNode.fontName !== figma.mixed ? textNode.fontName.style : 'Mixed',
              lineHeight: textNode.lineHeight,
              letterSpacing: textNode.letterSpacing,
              count: 0,
              sample: textNode.characters.slice(0, 50) || 'Sample text'
            });
          }
          textStyles.get(key).count++;
        }
        
        // Scan for components
        if (node.type === 'COMPONENT') {
          if (!components.has(node.id)) {
            components.set(node.id, node);
          }
        }
        
        // Recurse into children
        if ('children' in node) {
          node.children.forEach(child => scanNode(child));
        }
      };
      
      // Scan all nodes in the current page
      currentPage.children.forEach(node => scanNode(node));
      
      // Create new page for design system
      const designSystemPage = figma.createPage();
      designSystemPage.name = 'Auto Design System';
      
      // Create main container
      const containerFrame = figma.createFrame();
      containerFrame.name = 'Design System';
      containerFrame.resize(1400, 100);
      containerFrame.x = 40;
      containerFrame.y = 40;
      containerFrame.fills = [];
      containerFrame.layoutMode = 'VERTICAL';
      containerFrame.primaryAxisSizingMode = 'AUTO';
      containerFrame.counterAxisSizingMode = 'AUTO';
      containerFrame.itemSpacing = 80;
      containerFrame.paddingTop = 40;
      containerFrame.paddingBottom = 40;
      containerFrame.paddingLeft = 40;
      containerFrame.paddingRight = 40;
      
      designSystemPage.appendChild(containerFrame);
      
      // Load Inter font for labels and titles
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      
      // Generate Colors Section
      if (colors.size > 0) {
        const colorSection = figma.createFrame();
        colorSection.name = 'Colors Section';
        colorSection.resize(1320, 100);
        colorSection.fills = [];
        colorSection.layoutMode = 'VERTICAL';
        colorSection.primaryAxisSizingMode = 'AUTO';
        colorSection.counterAxisSizingMode = 'FIXED';
        colorSection.itemSpacing = 32;
        
        const colorTitle = figma.createText();
        colorTitle.fontName = { family: "Inter", style: "Bold" };
        colorTitle.fontSize = 32;
        colorTitle.characters = 'Colors';
        colorSection.appendChild(colorTitle);
        
        const colorGrid = figma.createFrame();
        colorGrid.name = 'Color Grid';
        colorGrid.resize(1320, 100);
        colorGrid.fills = [];
        colorGrid.layoutMode = 'HORIZONTAL';
        colorGrid.primaryAxisSizingMode = 'AUTO';
        colorGrid.counterAxisSizingMode = 'AUTO';
        colorGrid.itemSpacing = 20;
        colorGrid.layoutWrap = 'WRAP';
        
        // Sort colors by usage
        const sortedColors = Array.from(colors.values()).sort((a, b) => b.count - a.count);
        
        sortedColors.forEach((colorData) => {
          const colorItem = figma.createFrame();
          colorItem.name = colorData.hex;
          colorItem.resize(120, 180);
          colorItem.fills = [];
          colorItem.layoutMode = 'VERTICAL';
          colorItem.primaryAxisSizingMode = 'AUTO';
          colorItem.counterAxisSizingMode = 'FIXED';
          colorItem.itemSpacing = 10;
          
          const colorBox = figma.createRectangle();
          colorBox.resize(120, 120);
          colorBox.fills = [{ type: 'SOLID', color: hexToRgb(colorData.hex) }];
          colorBox.cornerRadius = 8;
          colorItem.appendChild(colorBox);
          
          const colorLabel = figma.createText();
          colorLabel.fontName = { family: "Inter", style: "Regular" };
          colorLabel.fontSize = 14;
          colorLabel.characters = `${colorData.hex}\n${colorData.count} uses`;
          colorLabel.textAlignHorizontal = 'CENTER';
          colorLabel.resize(120, 40);
          colorItem.appendChild(colorLabel);
          
          colorGrid.appendChild(colorItem);
        });
        
        colorSection.appendChild(colorGrid);
        containerFrame.appendChild(colorSection);
      }
      
      // Generate Typography Section
      if (textStyles.size > 0) {
        const typoSection = figma.createFrame();
        typoSection.name = 'Typography Section';
        typoSection.resize(1320, 100);
        typoSection.fills = [];
        typoSection.layoutMode = 'VERTICAL';
        typoSection.primaryAxisSizingMode = 'AUTO';
        typoSection.counterAxisSizingMode = 'FIXED';
        typoSection.itemSpacing = 32;
        
        const typoTitle = figma.createText();
        typoTitle.fontName = { family: "Inter", style: "Bold" };
        typoTitle.fontSize = 32;
        typoTitle.characters = 'Typography';
        typoSection.appendChild(typoTitle);
        
        // Sort text styles by size (largest first)
        const sortedTextStyles = Array.from(textStyles.values()).sort((a, b) => b.size - a.size);
        
        for (const style of sortedTextStyles) {
          try {
            // Load the font before using it
            await figma.loadFontAsync({ family: style.family, style: style.weight });
            
            const typoItem = figma.createFrame();
            typoItem.name = `${style.family} ${style.weight} ${style.size}px`;
            typoItem.resize(1320, 100);
            typoItem.fills = [];
            typoItem.layoutMode = 'VERTICAL';
            typoItem.primaryAxisSizingMode = 'AUTO';
            typoItem.counterAxisSizingMode = 'FIXED';
            typoItem.itemSpacing = 8;
            
            const sample = figma.createText();
            sample.fontName = { family: style.family, style: style.weight };
            sample.fontSize = style.size;
            sample.characters = style.sample || 'The quick brown fox';
            typoItem.appendChild(sample);
            
            const details = figma.createText();
            details.fontName = { family: "Inter", style: "Regular" };
            details.fontSize = 12;
            details.characters = `${style.family} ${style.weight} • ${style.size}px • ${style.count} uses`;
            details.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
            typoItem.appendChild(details);
            
            typoSection.appendChild(typoItem);
          } catch (e) {
            console.log(`Could not load font: ${style.family} ${style.weight}`);
          }
        }
        
        containerFrame.appendChild(typoSection);
      }
      
      // Generate Components Section
      if (components.size > 0) {
        const compSection = figma.createFrame();
        compSection.name = 'Components Section';
        compSection.resize(1320, 100);
        compSection.fills = [];
        compSection.layoutMode = 'VERTICAL';
        compSection.primaryAxisSizingMode = 'AUTO';
        compSection.counterAxisSizingMode = 'FIXED';
        compSection.itemSpacing = 32;
        
        const compTitle = figma.createText();
        compTitle.fontName = { family: "Inter", style: "Bold" };
        compTitle.fontSize = 32;
        compTitle.characters = 'Components';
        compSection.appendChild(compTitle);
        
        const compGrid = figma.createFrame();
        compGrid.name = 'Component Grid';
        compGrid.resize(1320, 100);
        compGrid.fills = [];
        compGrid.layoutMode = 'HORIZONTAL';
        compGrid.primaryAxisSizingMode = 'AUTO';
        compGrid.counterAxisSizingMode = 'AUTO';
        compGrid.itemSpacing = 32;
        compGrid.layoutWrap = 'WRAP';
        
        for (const [id, component] of components.entries()) {
          const compItem = figma.createFrame();
          compItem.name = component.name;
          compItem.resize(Math.max(component.width, 100), 100);
          compItem.fills = [];
          compItem.layoutMode = 'VERTICAL';
          compItem.primaryAxisSizingMode = 'AUTO';
          compItem.counterAxisSizingMode = 'AUTO';
          compItem.itemSpacing = 12;
          
          const instance = component.createInstance();
          compItem.appendChild(instance);
          
          const compLabel = figma.createText();
          compLabel.fontName = { family: "Inter", style: "Regular" };
          compLabel.fontSize = 12;
          compLabel.characters = component.name;
          compItem.appendChild(compLabel);
          
          compGrid.appendChild(compItem);
        }
        
        compSection.appendChild(compGrid);
        containerFrame.appendChild(compSection);
      }
      
      // Save page ID and switch to it
      designSystemPageId = designSystemPage.id;
      figma.currentPage = designSystemPage;
      figma.viewport.scrollAndZoomIntoView([containerFrame]);
      
      // Notify UI
      figma.ui.postMessage({
        type: 'generation-complete',
        stats: {
          colors: colors.size,
          textStyles: textStyles.size,
          components: components.size
        }
      });
      
      figma.notify('✅ Design system generated successfully!');
      
    } catch (error) {
      figma.notify(`❌ Error: ${error.message}`);
      console.error(error);
    }
  }
  
  if (msg.type === 'copy-design-system') {
    try {
      if (!designSystemPageId) {
        figma.notify('⚠️ Please generate the design system first');
        return;
      }
      
      const designSystemPage = figma.getNodeById(designSystemPageId);
      if (!designSystemPage) {
        figma.notify('❌ Design system page not found');
        return;
      }
      
      figma.currentPage = designSystemPage;
      
      const containerFrame = designSystemPage.findOne(node => node.name === 'Design System');
      if (containerFrame) {
        figma.currentPage.selection = [containerFrame];
        figma.notify('✅ Design system selected! Press Cmd/Ctrl+C to copy');
        figma.viewport.scrollAndZoomIntoView([containerFrame]);
      } else {
        figma.notify('❌ Could not find design system container');
      }
    } catch (error) {
      figma.notify(`❌ Error: ${error.message}`);
      console.error(error);
    }
  }
};
