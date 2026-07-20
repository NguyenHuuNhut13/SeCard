import os
import shutil

TAILADMIN_SRC = r"e:\Ecard\free-nextjs-admin-dashboard-main\free-nextjs-admin-dashboard-main\src"
TARGET_SRC = r"e:\Ecard\src"

def copy_folder(name):
    src_path = os.path.join(TAILADMIN_SRC, name)
    dest_path = os.path.join(TARGET_SRC, name)
    if os.path.exists(src_path):
        print(f"Copying {src_path} -> {dest_path}")
        if os.path.exists(dest_path):
            # merge or copy contents
            for root, dirs, files in os.walk(src_path):
                rel_path = os.path.relpath(root, src_path)
                target_dir = dest_path if rel_path == "." else os.path.join(dest_path, rel_path)
                os.makedirs(target_dir, exist_ok=True)
                for file in files:
                    s_file = os.path.join(root, file)
                    d_file = os.path.join(target_dir, file)
                    shutil.copy2(s_file, d_file)
        else:
            shutil.copytree(src_path, dest_path)

# Copy directories
folders = ["components", "context", "hooks", "icons", "layout"]
for f in folders:
    copy_folder(f)

# Copy files in src root if any
for item in os.listdir(TAILADMIN_SRC):
    src_item = os.path.join(TAILADMIN_SRC, item)
    if os.path.isfile(src_item):
        dest_item = os.path.join(TARGET_SRC, item)
        print(f"Copying file {src_item} -> {dest_item}")
        shutil.copy2(src_item, dest_item)

# Also copy public folder contents
TAILADMIN_PUBLIC = r"e:\Ecard\free-nextjs-admin-dashboard-main\free-nextjs-admin-dashboard-main\public"
TARGET_PUBLIC = r"e:\Ecard\public"
if os.path.exists(TAILADMIN_PUBLIC):
    print("Copying public assets...")
    for root, dirs, files in os.walk(TAILADMIN_PUBLIC):
        rel_path = os.path.relpath(root, TAILADMIN_PUBLIC)
        target_dir = TARGET_PUBLIC if rel_path == "." else os.path.join(TARGET_PUBLIC, rel_path)
        os.makedirs(target_dir, exist_ok=True)
        for file in files:
            s_file = os.path.join(root, file)
            d_file = os.path.join(target_dir, file)
            shutil.copy2(s_file, d_file)

print("Copy completed successfully!")
