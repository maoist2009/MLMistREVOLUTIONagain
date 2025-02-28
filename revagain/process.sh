rm merged.md
python merge.py
pandoc --standalone merged.md -o output.tex
python process_tex.py
xelatex output.tex
xelatex output.tex