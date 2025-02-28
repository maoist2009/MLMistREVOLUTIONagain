def add_ctex_and_tableofcontents(input_file, output_file):
    try:
        with open(input_file, 'r', encoding='utf-8') as file:
            lines = file.readlines()

        doc_class_index = None
        for i, line in enumerate(lines):
            if line.strip().startswith(r'\documentclass'):
                doc_class_index = i
                break
        if doc_class_index is None:
            print("未找到 \\documentclass，无法处理文件。")
            return

        doc_start_index = None
        for i, line in enumerate(lines):
            if line.strip().startswith(r'\begin{document}'):
                doc_start_index = i
                break
        if doc_start_index is None:
            print("未找到 \\begin{document}，无法处理文件。")
            return

        class_line = lines[doc_class_index]
        start_bracket = class_line.find('[')
        insert_index = doc_class_index + 1
        if start_bracket != -1:
            end_bracket = class_line.find(']', start_bracket)
            if end_bracket == -1:
                for i in range(doc_class_index + 1, doc_start_index):
                    end_bracket = lines[i].find(']')
                    if end_bracket != -1:
                        insert_index = i + 1
                        break
            else:
                if end_bracket == len(class_line.strip()) - 1:
                    insert_index = doc_class_index + 1
                else:
                    new_line = class_line[:end_bracket + 1] + '\n\\usepackage{ctex}\n' + class_line[end_bracket + 1:]
                    lines[doc_class_index] = new_line
                    insert_index = -1

        if insert_index != -1:
            ctex_added = False
            for i in range(insert_index, doc_start_index):
                if lines[i].strip().startswith(r'\usepackage{ctex}'):
                    ctex_added = True
                    break
            if not ctex_added:
                lines.insert(insert_index, r'\usepackage{ctex}' + '\n')
                
        doc_start_index = None
        for i, line in enumerate(lines):
            if line.strip().startswith(r'\begin{document}'):
                doc_start_index = i
                break
        if doc_start_index is None:
            print("未找到 \\begin{document}，无法处理文件。")
            return

        lines.insert(doc_start_index + 1, r'\tableofcontents' + '\n')
        lines.insert(doc_start_index + 2, r'\newpage' + '\n')

        with open(output_file, 'w', encoding='utf-8') as file:
            file.writelines(lines)

        print(f"处理完成，结果已保存到 {output_file}。")
    except FileNotFoundError:
        print(f"未找到文件 {input_file}。")
    except Exception as e:
        print(f"处理文件时出现错误: {e}。")


input_file = 'output.tex'
output_file = 'output.tex'
add_ctex_and_tableofcontents(input_file, output_file)