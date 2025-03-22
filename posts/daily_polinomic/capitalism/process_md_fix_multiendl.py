import os
import re

def process_markdown_file(file_path):
    try:

        with open(file_path, 'rb') as file:
            content = file.read()


        content = content.replace(b'\r\n', b'\n')


        content = content.decode('utf-8')


        content = re.sub(r'\n{3,}', '\n\n', content)


        with open(file_path, 'wb') as file:
            file.write(content.encode('utf-8'))

        print(f"处理完成: {file_path}")
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")


def traverse_directory(directory):

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):

                file_path = os.path.join(root, file)

                process_markdown_file(file_path)


if __name__ == "__main__":

    target_directory = '.'
    traverse_directory(target_directory)