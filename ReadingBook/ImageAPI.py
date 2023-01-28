#importing necessary libraries
import os
from flask import Flask,render_template,request, flash,redirect,url_for
from werkzeug.utils import secure_filename 
import PIL
import numpy
import cv2
import json
import re
import os
from flask import jsonify
from waitress import serve
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#reading test image
def img_process(img):
    # img = cv2.imread("p2.jpg") #image name

    #reading label name from obj.names file
    with open(os.path.join("project_files",'obj.names'), 'r') as f:
        classes = f.read().splitlines()

    #importing model weights and config file
    net = cv2.dnn.readNet('project_files/yolov4_tiny.weights', 'project_files/yolov4_tiny.cfg')
    model = cv2.dnn_DetectionModel(net)
    model.setInputParams(scale=1 / 255, size=(416, 416), swapRB=True)
    classIds, scores, boxes = model.detect(img, confThreshold=0.6, nmsThreshold=0.4)

    #detection 
    for (classId, score, box) in zip(classIds, scores, boxes):
        # print("Pothole Detected")
        return "Pothole Detected"
        # cv2.rectangle(img, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]),
        #               color=(0, 255, 0), thickness=2)
 
# cv2.imshow("pothole",img)
# cv2.imwrite("result1"+".jpg",img) #result name
# cv2.waitKey(0)
# cv2.destroyAllWindows()
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']

        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            img = numpy.asarray(PIL.Image.open(file.stream))
            # img = cv2.imread(file.stream)
            text = img_process(img)
            print(text)

            # if(text!=''):
            #     language = 'en' #english
            #     speech = gTTS(text = text, lang = language, slow = False)
                # speech.save("current_time"+'.mp3')
                # os.system("current_time"+'.mp3')
            if len(text)!=0:
                return text
            else:
                return "server returning null"
    else:
        return "server running/ no files uploaded"

@app.route('/')
def home():
    return "Hello"

if __name__ == "__main__":
    serve(app, host='0.0.0.0',port=8889,threads=2)