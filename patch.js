const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
  '    .wcu-cta-row {\r\n      display: flex;\r\n      align-items: center;\r\n      justify-content: center;',
  '    .wcu-cta-row {\r\n      display: flex;\r\n      align-items: stretch;\r\n      justify-content: center;'
);

content = content.replace(
  '    .wcu-cta-row {\n      display: flex;\n      align-items: center;\n      justify-content: center;',
  '    .wcu-cta-row {\n      display: flex;\n      align-items: stretch;\n      justify-content: center;'
);

content = content.replace(
  '    .wcu-cta-btn {\r\n      display: inline-flex;\r\n      align-items: center;\r\n      gap: 0.55rem;',
  '    .wcu-cta-btn {\r\n      display: inline-flex;\r\n      align-items: center;\r\n      justify-content: center;\r\n      gap: 0.55rem;'
);

content = content.replace(
  '    .wcu-cta-btn {\n      display: inline-flex;\n      align-items: center;\n      gap: 0.55rem;',
  '    .wcu-cta-btn {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      gap: 0.55rem;'
);

content = content.replace(
  '    .wcu-cta-outline:hover {\r\n      background: rgba(15, 76, 129, 0.05);\r\n      border-color: #0F4C81;\r\n      transform: translateY(-3px);\r\n    }',
  '    .wcu-cta-outline:hover {\r\n      background: rgba(15, 76, 129, 0.05);\r\n      border-color: #0F4C81;\r\n      transform: translateY(-3px);\r\n    }\r\n    .wcu-cta-quick-order {\r\n      background: linear-gradient(135deg, #2563eb, #4f46e5);\r\n      color: white;\r\n      border-radius: 18px;\r\n      padding: 18px 34px;\r\n      font-weight: 700;\r\n      box-shadow: 0 12px 30px rgba(37,99,235,0.25);\r\n      transition: all 0.3s ease;\r\n      border: none;\r\n    }\r\n    .wcu-cta-quick-order:hover {\r\n      transform: translateY(-3px);\r\n      box-shadow: 0 16px 40px rgba(37,99,235,0.4);\r\n      filter: brightness(1.1);\r\n    }'
);

content = content.replace(
  '    .wcu-cta-outline:hover {\n      background: rgba(15, 76, 129, 0.05);\n      border-color: #0F4C81;\n      transform: translateY(-3px);\n    }',
  '    .wcu-cta-outline:hover {\n      background: rgba(15, 76, 129, 0.05);\n      border-color: #0F4C81;\n      transform: translateY(-3px);\n    }\n    .wcu-cta-quick-order {\n      background: linear-gradient(135deg, #2563eb, #4f46e5);\n      color: white;\n      border-radius: 18px;\n      padding: 18px 34px;\n      font-weight: 700;\n      box-shadow: 0 12px 30px rgba(37,99,235,0.25);\n      transition: all 0.3s ease;\n      border: none;\n    }\n    .wcu-cta-quick-order:hover {\n      transform: translateY(-3px);\n      box-shadow: 0 16px 40px rgba(37,99,235,0.4);\n      filter: brightness(1.1);\n    }'
);

fs.writeFileSync('index.html', content, 'utf8');
console.log("Patched successfully!");
