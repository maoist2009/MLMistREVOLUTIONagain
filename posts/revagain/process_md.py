import os

import re



def replace_newlines_in_markdown(file_path):


    with open(file_path, 'r', encoding='utf-8') as file:

        content = file.read()






    pattern = re.compile(

        r'('

        r'[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]\n[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]|'
        r'[。！？]\n'
        r')'

    )


    new_content = pattern.sub(lambda m: m.group().replace('\n', '\n\n'), content)




    with open(file_path, 'w', encoding='utf-8') as file:

        file.write(new_content)



def process_markdown_files():


    current_directory = os.getcwd()




    for root, _, files in os.walk(current_directory):

        for file in files:

            if file.endswith('.md'):

                file_path = os.path.join(root, file)

                replace_newlines_in_markdown(file_path)

                print(f'Processed: {file_path}')




process_markdown_files()