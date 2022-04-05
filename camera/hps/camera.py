from requests.exceptions import ConnectionError
import datetime
import time
import requests
import numpy
import sys
from matplotlib import pyplot as plt

# import _find_contours
# import _polygon
# This server posts in 3 different zmq sockets:
# the gray or rgb image is posted in port 34000
# the binary image is posted in socket 33000
# triangles vertices (position of UGVs) are posted in socket32000
# When calling with no arguments gray image is sent by default.
# Use the custom resolution call adding RGB at the end to send the
# RGB image instead of the GRAY

IMG_WIDTH_DEFAULT = 640
IMG_HEIGHT_DEFAULT = 480
LINES_SKIP_DEFAULT = 12 #lines not sent via internet
IMAGE_SEND_DEFAULT = "RGB"

FPS_SAMPLER = 100

# host = "http://192.168.100.117:8000/image"
host = "http://cpen391server-env.eba-pefitrhy.us-west-1.elasticbeanstalk.com/image"

def main():
    #Check the number of arguments passed to set resolution
    if len(sys.argv)==1:
        IMG_WIDTH = IMG_WIDTH_DEFAULT
        IMG_HEIGHT = IMG_HEIGHT_DEFAULT
        LINES_SKIP = LINES_SKIP_DEFAULT
        IMAGE_SEND = IMAGE_SEND_DEFAULT
    elif len(sys.argv)==5:
        IMG_WIDTH = int(sys.argv[1])
        IMG_HEIGHT = int(sys.argv[2])
        LINES_SKIP = int(sys.argv[3])
        if (sys.argv[4]) == "RGB":
            IMAGE_SEND = "RGB"
        else:
            IMAGE_SEND = IMAGE_SEND_DEFAULT
    else:
        print 'For custom resolution call:'
        print '  python triangle_detector_server.py width height lines_skip image_type'
        print 'Example getting 1280x960 image from hardware and sending binary and gray skipping 24 lines:'
        print '  python triangle_detector_server.py 1280 960 24 GRAY'
        print 'Example getting 1280x960 image from hardware and sending binary and rgb skipping 24 lines:'
        print '  python triangle_detector_server.py 1280 960 24 RGB'
        print 'Call without arguments for default Uvispace: 640x480 skip last 12 lines sending gray image'
        return

    #set the resolution in the driver
    f_width  =  open("/sys/uvispace_camera/attributes/image_width", "w")
    file.write(f_width, str(IMG_WIDTH))
    file.close(f_width)
    f_height  =  open("/sys/uvispace_camera/attributes/image_height", "w")
    file.write(f_height, str(IMG_HEIGHT))
    file.close(f_height)
    
    if IMAGE_SEND == "GRAY":
        f_rgbgray =  open("/dev/uvispace_camera_gray", "rb")
    else:
        f_rgbgray =  open("/dev/uvispace_camera_rgbg", "rb")

    # Start loop
    IMG_HEIGHT_SEND = IMG_HEIGHT-LINES_SKIP
    list_fps = [None]*FPS_SAMPLER
    mean_fps = 0
    counter = 0
    t1 = datetime.datetime.now()
    # filenum = 0
    while True:
        rgbgray_frame = numpy.fromfile(f_rgbgray, numpy.uint32, IMG_HEIGHT_SEND * IMG_WIDTH).reshape((IMG_HEIGHT_SEND, IMG_WIDTH))

        #update frame rate and print
        t2 = datetime.datetime.now()
        loop_time = (t2 - t1).microseconds
        t1 = t2
        last_fps = 1000000 / loop_time
        list_fps[counter] = last_fps
        counter += 1
        if counter == FPS_SAMPLER:
            counter = 0
            mean_fps = numpy.mean(list_fps)
            print(mean_fps)

            # filename = 'images/test' + str(filenum) + '.png'
            # filenum = filenum + 1
            # plt.imsave(filename,rgbgray_frame)
            image = {'data': rgbgray_frame.tolist()}
            try:
                requests.post(url = host, json = image)
            except ConnectionError as err:
                print(err)

            time.sleep(1)


if __name__ == '__main__':
    main()
