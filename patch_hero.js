const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const cssTarget = `    .prem-hero-btn.btn-glass:hover {
      transform: translateY(-2px);
      background: #F8FAFC;
      border-color: #CBD5E1;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }`;

const cssReplacement = `    .prem-hero-btn.btn-glass:hover {
      transform: translateY(-2px);
      background: #F8FAFC;
      border-color: #CBD5E1;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .prem-hero-btn.btn-quick {
      background: rgba(255, 255, 255, 0.92);
      color: #0F172A;
      border: 1px solid rgba(37, 99, 235, 0.15);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      transition: all 0.3s ease;
    }
    .prem-hero-btn.btn-quick:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(37, 99, 235, 0.2);
      background: rgba(255, 255, 255, 1);
    }`;

content = content.replace(cssTarget, cssReplacement);
// Handle both CRLF and LF
content = content.replace(cssTarget.replace(/\r\n/g, '\n'), cssReplacement.replace(/\r\n/g, '\n'));
content = content.replace(cssTarget.replace(/\n/g, '\r\n'), cssReplacement.replace(/\n/g, '\r\n'));

const htmlTarget = `          Order Medicines
        </a>
        <a href="prescription-upload.html" class="prem-hero-btn btn-glass">`;

const htmlReplacement = `          Order Medicines
        </a>
        <a href="order.html" class="prem-hero-btn btn-quick">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Quick Order
        </a>
        <a href="prescription-upload.html" class="prem-hero-btn btn-glass">`;

content = content.replace(htmlTarget, htmlReplacement);
content = content.replace(htmlTarget.replace(/\r\n/g, '\n'), htmlReplacement.replace(/\r\n/g, '\n'));
content = content.replace(htmlTarget.replace(/\n/g, '\r\n'), htmlReplacement.replace(/\n/g, '\r\n'));


fs.writeFileSync('index.html', content, 'utf8');
console.log("Hero patched successfully!");
