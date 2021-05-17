
# Importing all necessary libraries
import cv2
import os
import argparse

parser = argparse.ArgumentParser(description='Process some integers.')

parser.add_argument('-l', '--label', type=str,
                    help='save directory of converted images', required=True)
parser.add_argument('-f', '--files', nargs='+', type=str,
                    help='file of list to convert', required=True)

parser.add_argument('-fr', '--frame_rate', type=int, default=10)


args = parser.parse_args()

print(args)

for file in args.files:
    # Read the video from specified path
    cam = cv2.VideoCapture(file)
    
    try:
        
        # creating a folder named data
        if not os.path.exists(args.label):
            os.makedirs(args.label)

    # if not created then raise error
    except OSError:
        print ('Error: Creating directory of data')
    
    # frame
    currentframe = 0
    i = 0

    while(True):
        
        # reading from frame
        ret,frame = cam.read()
    
        if ret:
            if currentframe % args.frame_rate == 0:
                # if video is still left continue creating images
                name = f'./{args.label}/{file}-frame-{str(i)}.jpg'
                # print ('Creating...' + name)
        
                # writing the extracted images
                cv2.imwrite(name, frame)
                i += 1
        
                # increasing counter so that it will
                # show how many frames are created
            currentframe += 1
        else:
            break
    
    print(f"{file}'s images : f{currentframe}")
    
    # Release all space and windows once done
    cam.release()
    cv2.destroyAllWindows()