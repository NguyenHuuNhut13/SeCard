const fs = require('fs');
const path = require('path');

const tailadminCssPath = path.resolve('free-nextjs-admin-dashboard-main/free-nextjs-admin-dashboard-main/src/app/globals.css');
const originalCssPath = path.resolve('src/app/globals.css');

if (!fs.existsSync(tailadminCssPath)) {
    console.error('TailAdmin CSS file not found at:', tailadminCssPath);
    process.exit(1);
}

if (!fs.existsSync(originalCssPath)) {
    console.error('Original CSS file not found at:', originalCssPath);
    process.exit(1);
}

const tailadminCss = fs.readFileSync(tailadminCssPath, 'utf8');
const originalCss = fs.readFileSync(originalCssPath, 'utf8');

const customSeparator = "/* ================= CUSTOM ECARD OVERRIDES ================= */";
let customPart = originalCss;
if (originalCss.includes(customSeparator)) {
    customPart = originalCss.split(customSeparator)[1].trim();
}

const fontImports = "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');\n\n";

const combinedCss = fontImports + tailadminCss + "\n\n" + customSeparator + "\n\n" + customPart;

fs.writeFileSync(originalCssPath, combinedCss, 'utf8');
console.log("CSS Merged Successfully!");
