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

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Replace textAlign: "left" or 'left' with a dynamic value
  // We first check if I18nManager is imported. If not, and we make a change, we should ideally import it, 
  // but for simplicity in this script, we will just use standard RTL-friendly properties or a string that works if defined.
  // Actually, standard textAlign: "left" in RN is ALWAYS left. 
  // Most of the time, removing textAlign: "left" is enough as it's the default and handles RTL naturally in some components, 
  // but in others it needs to be explicit or 'right' in RTL.
  
  content = content.replace(/textAlign:\s*["']left["']/g, 'textAlign: I18nManager.isRTL ? "right" : "left"');
  content = content.replace(/textAlign:\s*["']right["']/g, 'textAlign: I18nManager.isRTL ? "left" : "right"');

  if (content !== original) {
    // Check if I18nManager is imported
    if (!content.includes('I18nManager') && !file.includes('i18n')) {
        // Try to add it to react-native import
        if (content.includes('from "react-native"')) {
            content = content.replace(/import\s*{([^}]*)}\s*from\s*["']react-native["']/, (match, p1) => {
                if (!p1.includes('I18nManager')) {
                    return `import { ${p1.trim()}, I18nManager } from "react-native"`;
                }
                return match;
            });
        }
    }
    fs.writeFileSync(file, content, 'utf8');

  }
});
