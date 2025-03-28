import os
import re

def has_first_level_heading(content):
    pattern = r'^#\s+.+$'
    return bool(re.search(pattern, content, re.MULTILINE))

def extract_title_from_frontmatter(content):
    frontmatter_pattern = r'^---\s*(.*?)\s*---'
    frontmatter_match = re.search(frontmatter_pattern, content, re.DOTALL)
    if frontmatter_match:
        frontmatter = frontmatter_match.group(1)
        title_pattern = r'title:\s*(.*)'
        title_match = re.search(title_pattern, frontmatter, re.MULTILINE)
        if title_match:
            return title_match.group(1).strip()
    return None

def process_md_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    if not has_first_level_heading(content):
        title = extract_title_from_frontmatter(content)
        if title:
            frontmatter_pattern = r'^---\s*(.*?)\s*---'
            frontmatter_match = re.search(frontmatter_pattern, content, re.DOTALL)
            if frontmatter_match:
                end_index = frontmatter_match.end()
                new_content = content[:end_index] + f'\n# {title}\n\n' + content[end_index:]
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f'已为 {file_path} 添加一级标题: {title}')

def traverse_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                process_md_file(file_path)

if __name__ == "__main__":
    target_directory = '.'  
    traverse_directory(target_directory)