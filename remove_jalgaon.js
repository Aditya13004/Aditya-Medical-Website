const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.js'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Split by <footer to only apply changes outside the footer
    let parts = content.split(/<footer/i);
    let head = parts[0];
    
    // Apply specific replacements
    head = head.replace(/&middot;\s*Jalgaon/gi, '')
               .replace(/in\s+Jalgaon\./gi, '.')
               .replace(/\s+in\s+Jalgaon/gi, '')
               .replace(/of\s+Jalgaon\./gi, '.')
               .replace(/Jalgaon's\s+Most/gi, 'Most')
               .replace(/Trusted\s+by\s+Jalgaon\s+Since/gi, 'Trusted Since')
               .replace(/Jalgaon's\s+most/gi, 'The most')
               .replace(/Jalgaon's\s+best/gi, 'the best')
               .replace(/across\s+Jalgaon\?/gi, 'everywhere?')
               .replace(/Serving\s+Jalgaon\s+with/gi, 'Serving with')
               .replace(/store\s+in\s+Jalgaon\s+stands/gi, 'store stands')
               .replace(/Near\s+XYZ\s+Hospital,\s+Jalgaon/gi, 'Near XYZ Hospital');
               
    // Combine back
    if (parts.length > 1) {
        content = head + '<footer' + parts.slice(1).join('<footer');
    } else {
        content = head;
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log("Processed " + file);
});
