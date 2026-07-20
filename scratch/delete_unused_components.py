import shutil
import os

target_dir = r"e:\Ecard\src\components"

calendar_dir = os.path.join(target_dir, "calendar")
charts_dir = os.path.join(target_dir, "charts")

if os.path.exists(calendar_dir):
    print(f"Removing {calendar_dir}")
    shutil.rmtree(calendar_dir)

if os.path.exists(charts_dir):
    print(f"Removing {charts_dir}")
    shutil.rmtree(charts_dir)

print("Unused components deleted successfully!")
