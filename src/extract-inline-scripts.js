const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../src/index.html');
const outputDir = path.join(__dirname, '../dist/my-angular-project');
const scriptOutputPath = path.join(outputDir, 'inline-scripts.js');

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  // Extract inline script content
  const inlineScripts = data.match(/<script[^>]*>(.*?)<\/script>/gs);
  if (!inlineScripts) {
    console.log('No inline scripts found.');
    return;
  }

  let combinedScripts = '';
  inlineScripts.forEach(script => {
    combinedScripts += script.replace(/<script[^>]*>|<\/script>/g, '') + '\n';
  });

  // Write the combined scripts to a file
  fs.writeFile(scriptOutputPath, combinedScripts, (err) => {
    if (err) {
      console.error('Error writing to inline-scripts.js:', err);
      return;
    }
    console.log('Inline scripts extracted to', scriptOutputPath);
  });

  // Optionally, remove inline scripts from index.html
  let modifiedHtml = data.replace(/<script[^>]*>.*?<\/script>/gs, '');
  fs.writeFile(indexPath, modifiedHtml, 'utf8', (err) => {
    if (err) {
      console.error('Error removing inline scripts from index.html:', err);
      return;
    }
    console.log('Inline scripts removed from index.html');
  });
});
