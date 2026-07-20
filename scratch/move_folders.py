import os
import shutil

src_root = r"e:\Ecard\src\app"
dest_admin = os.path.join(src_root, "(admin)")

os.makedirs(dest_admin, exist_ok=True)

def move_folder(name):
    src_path = os.path.join(src_root, name)
    dest_path = os.path.join(dest_admin, name)
    if os.path.exists(src_path):
        print(f"Moving {src_path} -> {dest_path}")
        if os.path.exists(dest_path):
            shutil.rmtree(dest_path)
        shutil.move(src_path, dest_path)
    else:
        print(f"Folder {src_path} does not exist!")

move_folder("dashboard")
move_folder("profile")

print("Folders moved successfully!")
