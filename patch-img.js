const fs = require('fs');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = dir + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') && !fullPath.includes('node_modules')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We want to add width, height, loading to <img ... />
      // Match <img ... />
      const newContent = content.replace(/<img\s([^>]+)>/g, (match, p1) => {
        // if it already has width, skip
        if (p1.includes('width=')) return match;
        
        // ensure trailing slash is handled safely
        let inner = p1.trim();
        let hasTrailing = false;
        if (inner.endsWith('/')) {
            inner = inner.slice(0, -1).trim();
            hasTrailing = true;
        }

        // Add attributes
        inner += ` loading="lazy" width={800} height={500}`;
        
        // Add style to prevent stretching (except if it has a specific style or class that we don't want to override, but usually it's fine or we just add the attributes and let CSS handle aspect ratio)
        // Since we are adding fixed width/height, the CSS MUST have width: 100%; height: auto to be responsive
        // We'll add it if style is not present
        if (!inner.includes('style=')) {
           inner += ` style={{ width: '100%', height: 'auto', objectFit: 'cover' }}`;
        }
        
        return `<img ${inner} ${hasTrailing ? '/' : ''}>`;
      });
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated images in:', fullPath);
      }
    }
  }
}

processDirectory('./app');
