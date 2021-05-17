
# Importing all necessary libraries
import cv2
import os
import argparse

parser = argparse.ArgumentParser(description='Process some integers.')

parser.add_argument('-ax', '--axis', type=int, default=1, help="1 is Invert Left and Right, 2 is Up and down")
parser.add_argument('-dir', '--directorys', nargs='+', type=str,
                    help='source directorys', required=True)

args = parser.parse_args()

print(args)

for d in args.directorys:

    new_dir = d + '_flipped'

    try:
        # creating a folder named data
        if not os.path.exists(new_dir):
            os.makedirs(new_dir)
    # if not created then raise error
    except OSError:
        print ('Error: Creating directory of data')

    # read all list in d(directory)
    for file in os.listdir(d):
        [filename, extension] = os.path.splitext(file)

        image = cv2.imread(os.path.join(d,file))
        # image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        flipped_image = cv2.flip(image, args.axis)

        cv2.imwrite(f'{new_dir}/{file}', image)
        cv2.imwrite(f'{new_dir}/{filename}_flipped{extension}', flipped_image)
  