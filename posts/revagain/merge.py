import os

import re





def extract_authors(frontmatter):

    authors = []

    lines = frontmatter.split('\n')

    for line in lines:

        if line.strip().startswith('- 作者：'):

            author = line.strip().replace('- 作者：', '')

            authors.append(author)

    if authors:

        return ', '.join(authors)

    return None





def process_markdown_file(file_path, current_footnote_num):

    with open(file_path, 'r', encoding='utf-8') as file:

        content = file.read()


    frontmatter_match = re.match(r'---\s*(.*?)\s*---', content, re.DOTALL)

    if frontmatter_match:

        frontmatter = frontmatter_match.group(1)

        content = content[frontmatter_match.end():].strip()

        authors = extract_authors(frontmatter)

    else:

        authors = None




    new_content = []

    first_title_found = False

    for line in content.split('\n'):

        if line.startswith('#'):

            level = len(line) - len(line.lstrip('#'))

            title = line.lstrip('#').strip()

            if level == 1 and not first_title_found and authors:

                title = f"{title} —— {authors}"

                first_title_found = True

            new_level = level

            new_title = f"{'#' * new_level} {title}"

            new_content.append(new_title)

        else:

            new_content.append(line)

    content = '\n'.join(new_content)




    footnote_pattern = re.compile(r'\[\^(\d+)\]')

    footnote_mapping = {}

    new_content_lines = []

    new_footnotes = []




    for line in content.split('\n'):

        if line.strip().startswith('[^'):

            old_num = int(re.search(r'\[\^(\d+)\]', line).group(1))

            new_num = current_footnote_num

            footnote_mapping[old_num] = new_num

            current_footnote_num += 1

            new_line = line.replace(f"[^{old_num}]", f"[^{new_num}]")

            new_footnotes.append(new_line)

        else:

            new_content_lines.append(line)




    new_content_text = '\n'.join(new_content_lines)



    def replace_footnote(match):

        old_num = int(match.group(1))

        new_num = footnote_mapping.get(old_num)

        return f"[^{new_num}]" if new_num is not None else match.group(0)



    new_content_text = footnote_pattern.sub(replace_footnote, new_content_text)



    if new_footnotes:

        new_content_text += '\n\n' + '\n'.join(new_footnotes)



    return new_content_text, current_footnote_num



def sorted_os_walk(root_dir):
    for root, dirs, files in os.walk(root_dir):
        dirs.sort()
        files.sort()
        yield root, dirs, files

def merge_markdown_files(output_file):

    root_dir = os.getcwd()

    markdown_files = []

    for root, dirs, files in sorted_os_walk(root_dir):

        for file in files:

            if file.endswith('.md') and file.lower() != 'index.md':

                markdown_files.append(os.path.join(root, file))



    merged_content = []

    current_footnote_num = 1

    for file_path in markdown_files:

        content, current_footnote_num = process_markdown_file(file_path, current_footnote_num)

        merged_content.append(content)



    with open(output_file, 'w', encoding='utf-8') as out_file:

        out_file.write('\n\n'.join(merged_content))





if __name__ == "__main__":

    output_markdown_file = 'merged.md'

    merge_markdown_files(output_markdown_file)

    print(f"Markdown files merged into {output_markdown_file}")