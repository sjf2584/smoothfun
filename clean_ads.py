import os
import glob
import re

html_files = glob.glob('*.html')
for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove left ad sidebar
    content = re.sub(r'<!--\s*AdSense 좌측\s*-->\s*<div class="ad-sidebar ad-left">.*?</div>', '', content, flags=re.DOTALL)
    # Also without comment just in case
    content = re.sub(r'<div class="ad-sidebar ad-left">.*?</div>', '', content, flags=re.DOTALL)

    # 2. Remove right ad sidebar
    content = re.sub(r'<!--\s*AdSense 우측\s*-->\s*<div class="ad-sidebar ad-right">.*?</div>', '', content, flags=re.DOTALL)
    # Also without comment just in case
    content = re.sub(r'<div class="ad-sidebar ad-right">.*?</div>', '', content, flags=re.DOTALL)

    # 3. Remove CSS
    content = re.sub(r'/\*\s*AdSense 사이드바\s*\*/\s*\.ad-sidebar\s*\{.*?\}\s*\.ad-left\s*\{.*?\}\s*\.ad-right\s*\{.*?\}\s*@media[^{]*\{.*?\}', '', content, flags=re.DOTALL)
    
    # 4. Remove standalone ad ins just in case
    content = re.sub(r'<ins[^>]*data-ad-slot="XXXXXXXXXX"[^>]*>.*?</ins>', '', content, flags=re.DOTALL)

    # Clean up empty lines that might have been left
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Cleaned {len(html_files)} files.")
