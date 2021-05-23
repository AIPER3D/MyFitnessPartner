import os
import time

import argparse

import numpy as np
from PIL import Image

def create_image(width = 224, height = 224, num_of_images = 1000):

    current = time.strftime("%Y%m%d%H%M%S")
    os.mkdir(current)
 
    for n in range(num_of_images):
        filename = '{0}/{0}_{1:03d}.jpg'.format(current, n)
        rgb_array = np.random.rand(height,width,3) * 255
        image = Image.fromarray(rgb_array.astype('uint8')).convert('RGB')
        image.save(filename)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='generator random background image')

    parser.add_argument('-n', '--num', type=int, default=1000, help="number of images")
    parser.add_argument('--width', type=int, default=224, help="image width")
    parser.add_argument('--height', type=int, default=224, help="image height")

    args = parser.parse_args()

    create_image(args.width, args.height, num_of_images=args.num)