const fs = require('fs');
const path = require('path');

const targetDir = __dirname;
const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.html'));

const oldAddressRegex = /Near XYZ Hospital,\s*Jalgaon/g;
const newAddress = '10, Vardhaman Nagar, Near Hotel Royal Palace, Jalgaon, Maharashtra, 425002';

const oldMapsRegex = /q=Aditya\+Medical\+and\+General\+Store,\+Jalgaon/g;
const newMapsLink = 'q=Aditya+Medical+and+General+Store,+10+Vardhaman+Nagar,+Jalgaon,+Maharashtra,+425002';

let totalReplaced = 0;

files.forEach(file => {
  const filePath = path.join(targetDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (oldAddressRegex.test(content)) {
    content = content.replace(oldAddressRegex, newAddress);
    changed = true;
  }
  
  if (oldMapsRegex.test(content)) {
    content = content.replace(oldMapsRegex, newMapsLink);
    changed = true;
  }

  // Handle Quick Order form specific placeholder
  if (content.includes('placeholder="e.g. Jalgaon"')) {
    content = content.replace('placeholder="e.g. Jalgaon"', 'placeholder="e.g. 10, Vardhaman Nagar, Jalgaon"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalReplaced++;
    console.log(`Updated address in ${file}`);
  }
});

console.log(`Done! Updated address in ${totalReplaced} files.`);
