import seedir as sd
import os

path = 'D:\Projects\local\covid-statistic-analizer'

# Список папок, которые нужно исключить
exclude_folders = ['.git', '.venv', 'node_modules', '__pycache__', '.idea']

# Обновляем вызов seedir, чтобы исключить нежелательные папки
sd.seedir(path=path, style='lines', exclude_folders=exclude_folders)

# Обновляем стандартный обход директорий
start_path = path
for root, dirs, files in os.walk(start_path):
    # Удаляем из списка папок те, которые нужно исключить
    dirs[:] = [d for d in dirs if d not in exclude_folders]

    level = root.replace(start_path, '').count(os.sep)
    indent = ' ' * 4 * level
    print('{}{}/'.format(indent, os.path.basename(root)))
