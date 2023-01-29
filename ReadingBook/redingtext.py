import os
from flask import Flask,render_template,request, flash,redirect,url_for
from werkzeug.utils import secure_filename 
import PIL
import numpy
import cv2
import pytesseract
import json
import re
import os
from flask import jsonify
from waitress import serve
from flask_cors import CORS, cross_origin
from gtts import gTTS


pytesseract.pytesseract.tesseract_cmd = "Tesseract-OCR//tesseract.exe"
tessdata_dir_config = '--tessdata-dir "Tesseract-OCR/tessdata"'

app = Flask(__name__)
CORS(app)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_coord(img,contours):

    all_coord = dict()
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        
        # Drawing a rectangle on image
        rect = cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        img = cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

        cropped = img[y:y + h, x:x + w]
        
        text = pytesseract.image_to_string(cropped)
        all_coord[(y,x)] = text
     
    
    return text

def img_process(img):
    img = cv2.resize(img, (0, 0), fx = 1, fy = 1)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ret, thresh1 = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
    rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (18, 18)) #18,18
    
    dilation = cv2.dilate(thresh1, rect_kernel, iterations = 1)
    
    contours, hierarchy = cv2.findContours(dilation, cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)

    text = get_coord(img,contours)
    
    return text
    
    
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

            if(text!=''):
                language = 'en' #english
                speech = gTTS(text = text, lang = language, slow = False)
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


#if __name__  == "__main__":
#    app.run(host=os.getenv('IP', '0.0.0.0'), 
#    port=int(os.getenv('PORT', 8889)), debug=True) #any code changes automatic refresh due to debug being True
    
if __name__ == "__main__":
    serve(app, host='0.0.0.0',port=8889,threads=2)

    
