const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const targetStr = `    .prem-hero-btn.btn-glass {
      background: #FFFFFF;
      color: #0F172A;
      border: 1px solid #E2E8F0;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .prem-hero-btn.btn-glass:hover {
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

const replaceStr = `    .prem-hero-btn.btn-glass {
      background: linear-gradient(135deg, #0D9488, #14B8A6);
      color: #FFFFFF;
      border: 1px solid transparent;
      box-shadow: 0 10px 24px rgba(20, 184, 166, 0.25);
    }
    .prem-hero-btn.btn-glass:hover {
      transform: translateY(-2px);
      background: linear-gradient(135deg, #0f766e, #0d9488);
      box-shadow: 0 15px 32px rgba(20, 184, 166, 0.35);
    }
    .prem-hero-btn.btn-quick {
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: #FFFFFF;
      border: 1px solid transparent;
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.25);
      transition: all 0.3s ease;
    }
    .prem-hero-btn.btn-quick:hover {
      transform: translateY(-3px);
      background: linear-gradient(135deg, #1d4ed8, #4338ca);
      box-shadow: 0 15px 35px rgba(37, 99, 235, 0.35);
    }`;

content = content.replace(targetStr, replaceStr);
content = content.replace(targetStr.replace(/\r\n/g, '\n'), replaceStr.replace(/\r\n/g, '\n'));
content = content.replace(targetStr.replace(/\n/g, '\r\n'), replaceStr.replace(/\n/g, '\r\n'));

fs.writeFileSync('index.html', content, 'utf8');
console.log("Colors patched successfully!");
