import os
import re

target_dir = os.path.dirname(os.path.abspath(__file__))
files = [f for f in os.listdir(target_dir) if f.endswith('.html')]

old_address_pattern = re.compile(r'Near XYZ Hospital,\s*Jalgaon', re.IGNORECASE)
new_address = '10, Vardhaman Nagar, Near Hotel Royal Palace, Jalgaon, Maharashtra, 425002'

old_maps_pattern = re.compile(r'q=Aditya\+Medical\+and\+General\+Store,\+Jalgaon', re.IGNORECASE)
new_maps_link = 'q=Aditya+Medical+and+General+Store,+10+Vardhaman+Nagar,+Jalgaon,+Maharashtra,+425002'

total_replaced = 0

for file in files:
    file_path = os.path.join(target_dir, file)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    if old_address_pattern.search(content):
        content = old_address_pattern.sub(new_address, content)
        changed = True

    if old_maps_pattern.search(content):
        content = old_maps_pattern.sub(new_maps_link, content)
        changed = True

    if 'placeholder="e.g. Jalgaon"' in content:
        content = content.replace('placeholder="e.g. Jalgaon"', 'placeholder="e.g. 10, Vardhaman Nagar, Jalgaon"')
        changed = True

    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        total_replaced += 1
        print(f"Updated address in {file}")

print(f"Done! Updated address in {total_replaced} files.")
