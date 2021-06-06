import os
import argparse
from tqdm import tqdm

parser = argparse.ArgumentParser()

parser.add_argument('--dir', type=str, required=True, help='directory')
parser.add_argument('--output_name', type=str, default='')

args = parser.parse_args()

root_path = args.dir

length = len(str(len(os.listdir(root_path))))

i = 0

for file in tqdm(sorted(os.listdir(root_path))):
    [filename, extention] = os.path.splitext(file)
    os.rename(os.path.join(root_path,file), os.path.join(root_path, f'{args.output_name}{i}{extention}'))
    i += 1