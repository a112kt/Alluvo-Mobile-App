const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      if (fs.statSync(dirFile).isDirectory()) {
        if (!dirFile.includes('node_modules') && !dirFile.includes('.git')) {
          filelist = walkSync(dirFile, filelist);
        }
      } else if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx') || dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    } catch (err) { }
  });
  return filelist;
};

const srcDir = path.join(__dirname, 'src');
const files = walkSync(srcDir);

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Replace style properties to use start/end instead of left/right for RTL support
  content = content.replace(/marginLeft/g, 'marginStart');
  content = content.replace(/marginRight/g, 'marginEnd');
  content = content.replace(/paddingLeft/g, 'paddingStart');
  content = content.replace(/paddingRight/g, 'paddingEnd');
  content = content.replace(/borderTopLeftRadius/g, 'borderTopStartRadius');
  content = content.replace(/borderTopRightRadius/g, 'borderTopEndRadius');
  content = content.replace(/borderBottomLeftRadius/g, 'borderBottomStartRadius');
  content = content.replace(/borderBottomRightRadius/g, 'borderBottomEndRadius');
  
  // Replace left: and right: only if they appear as style keys (heuristic: followed by a colon or in a style object)
  // We'll skip this to avoid false positives like `left: 0` becoming `start: 0` which might break some absolute positioning where left strictly means Left edge. Often absolute positioning needs to strictly stay on the left.
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;

  }
});


