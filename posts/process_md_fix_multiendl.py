import os
import re

def process_markdown_file(file_path):
    try:
        # 以二进制模式读取文件，避免 Windows 换行符转换问题
        with open(file_path, 'rb') as file:
            content = file.read()

        # 将 Windows 换行符 \r\n 替换为 Unix 换行符 \n
        content = content.replace(b'\r\n', b'\n')

        # 将字节内容转换为字符串
        content = content.decode('utf-8')

        # 将多个连续的换行符替换为两个换行符
        content = re.sub(r'\n{3,}', '\n\n', content)

        # 以二进制模式写入文件，确保使用 Unix 换行符
        with open(file_path, 'wb') as file:
            file.write(content.encode('utf-8'))

        print(f"处理完成: {file_path}")
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")


def traverse_directory(directory):
    # 遍历指定目录下的所有文件和子目录
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                # 构建文件的完整路径
                file_path = os.path.join(root, file)
                # 调用处理函数处理文件
                process_markdown_file(file_path)


if __name__ == "__main__":
    # 指定要遍历的目录，这里默认是当前目录
    target_directory = '.'
    traverse_directory(target_directory)