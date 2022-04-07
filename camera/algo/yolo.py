import cv2
import numpy as np
import time
import requests
import json
from matplotlib import pyplot as plt

# load Yolo model
yolo_weight = "yolov3.weights"
yolo_config = "yolov3.cfg"
coco_labels = "coco.names"
net = cv2.dnn.readNet(yolo_weight, yolo_config)
 
# get class names
classes = []
with open(coco_labels, "r") as labels:
    classes = [line.strip() for line in labels.readlines()]

while True:
    # retrieve image from cloud
    DATA_API_ENDPOINT = "http://cpen391server-env.eba-pefitrhy.us-west-1.elasticbeanstalk.com/image"


    r = requests.get(url = DATA_API_ENDPOINT)
    res = r.text
    res_json = json.loads(res)
    np_array = np.asarray(res_json['data'])
    np_array_rgb = np.zeros((3, np_array.shape[0], np_array.shape[1]))

    np_array_rgb[0] = (np_array / 256 / 256 / 256)
    np_array_rgb[2] = (np_array / 256 / 256 % 256)
    np_array_rgb[1] = (np_array / 256 % 256)
    np_array_rgb_resized = np_array_rgb.transpose(1,2,0).astype(np.uint8)


    # save image for debugging
    filename = "image.jpg"  
    plt.imsave(filename, np_array_rgb_resized)
    img = cv2.imread(filename)

    height, width, channels = img.shape

    # Convert image to Blob and send to the yolo model
    blob = cv2.dnn.blobFromImage(img, 1/255, (320, 320), (0, 0, 0), True, crop=False)
    net.setInput(blob)

    # layer names
    layer_names = net.getLayerNames()
    output_layers = ['yolo_82', 'yolo_94', 'yolo_106']

    # Send blob data to forward pass
    outs = net.forward(output_layers)


    # Extract information on the screen
    confidences = []
    boxes = []
    for out in outs:
        for detection in out:
            # Extract score value
            scores = detection[5:]
            # Object id, check if is person
            class_id = np.argmax(scores)
            # Confidence score for each object ID
            confidence = scores[class_id]
            if confidence > 0.5 and classes[class_id] == 'person':
                # Extract values to draw bounding box
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                # Rectangle coordinates
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)
                boxes.append([x, y, w, h])
                confidences.append(float(confidence))

    # eliminate duplicated boxes for single person == detected in each layer
    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

    # count number of people by counting the number of boxes
    count = 0
    for i in range(len(boxes)):
        if i in indexes:
            count = count + 1
            # for testing
            # x, y, w, h = boxes[i]
            # color = (255,255,255)
            # cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)
 
    # cv2.imwrite(filename, img)    # for testing

    # send number of people in the room to the cloud
    DATA_API_ENDPOINT_1 = "http://cpen391server-env.eba-pefitrhy.us-west-1.elasticbeanstalk.com/data/device1/people"
    testData_people = {
        'people': count
    }
    r = requests.post(url = DATA_API_ENDPOINT_1, json = testData_people)


    print('number of people in the room: ', count)  # for testing

    # do people detection every 10 seconds
    time.sleep(10)





# source used: https://thinkinfi.com/yolo-object-detection-using-python-opencv/