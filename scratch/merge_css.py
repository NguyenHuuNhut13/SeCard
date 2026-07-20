import os

TAILADMIN_CSS_PATH = r"e:\Ecard\free-nextjs-admin-dashboard-main\free-nextjs-admin-dashboard-main\src\app\globals.css"
ORIGINAL_CSS_PATH = r"e:\Ecard\src\app\globals.css"

with open(TAILADMIN_CSS_PATH, "r", encoding="utf-8") as f:
    tailadmin_css = f.read()

with open(ORIGINAL_CSS_PATH, "r", encoding="utf-8") as f:
    original_css = f.read()

# We want to extract our font imports, :root variables, and light theme variables, and append them.
# The original font imports:
font_imports = "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');\n\n"

# The rest of our custom classes / overrides.
# Let's append original CSS variables and customizations.
# Note that Tailwind v4 has its own colors, but we want to make sure ours are defined so old styles still work.
combined_css = font_imports + tailadmin_css + "\n\n/* ================= CUSTOM ECARD OVERRIDES ================= */\n" + original_css

with open(ORIGINAL_CSS_PATH, "w", encoding="utf-8") as f:
    f.write(combined_css)

print("CSS Merged Successfully!")
