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
      
      // Remove the exact style string injected by mistake
      const searchStr = ` style={{ width: '100%', height: 'auto', objectFit: 'cover' }}`;
      if (content.includes(searchStr)) {
        content = content.split(searchStr).join('');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed inline style in:', fullPath);
      }
    }
  }
}

processDirectory('./app');
