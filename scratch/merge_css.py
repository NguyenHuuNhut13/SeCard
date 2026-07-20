import os

TAILADMIN_CSS_PATH = r"d:\SeCard\free-nextjs-admin-dashboard-main\free-nextjs-admin-dashboard-main\src\app\globals.css"
ORIGINAL_CSS_PATH = r"d:\SeCard\src\app\globals.css"

with open(TAILADMIN_CSS_PATH, "r", encoding="utf-8") as f:
    tailadmin_css = f.read()

with open(ORIGINAL_CSS_PATH, "r", encoding="utf-8") as f:
    original_css = f.read()

# If the custom overrides block already exists in original_css, let's extract just that part
custom_separator = "/* ================= CUSTOM ECARD OVERRIDES ================= */"
if custom_separator in original_css:
    custom_part = original_css.split(custom_separator)[1].strip()
else:
    custom_part = original_css

# The original font imports:
font_imports = "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');\n\n"

combined_css = font_imports + tailadmin_css + "\n\n/* ================= CUSTOM ECARD OVERRIDES ================= */\n\n" + custom_part

with open(ORIGINAL_CSS_PATH, "w", encoding="utf-8") as f:
    f.write(combined_css)

print("CSS Merged Successfully!")
