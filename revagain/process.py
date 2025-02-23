import os
import re

def replace_newlines_in_markdown(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 使用正则表达式匹配以下两种情况：
    # 1. 前后都是汉字或全角符号的一个换行符
    # 2. 全角标点符号（句号、感叹号、问号等） + 换行符
    pattern = re.compile(
        r'('
        r'[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]\n[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]|'  # 前后都是汉字或全角符号
        r'[。！？]\n'  # 全角句号、感叹号、问号 + 换行符
        r')'
    )
    # 替换为一个换行符变为两个换行符
    new_content = pattern.sub(lambda m: m.group().replace('\n', '\n\n'), content)

    # 将修改后的内容写回文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(new_content)

def process_markdown_files():
    # 获取当前工作目录
    current_directory = os.getcwd()

    # 遍历当前目录及其子目录下的所有文件
    for root, _, files in os.walk(current_directory):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                replace_newlines_in_markdown(file_path)
                print(f'Processed: {file_path}')

# 处理当前工作目录及其子目录下的 Markdown 文件
process_markdown_files()