from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from predict import startup, predict_class
from add import add_data
import json
import requests
import datetime
import re
import numpy as np
import asyncio
import pandas as pd

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

model, lecancer, lerelationships, history_class_codes, ethnicity_codes, df = startup()

@app.route('/predict', methods = ['POST'])
@cross_origin()
def predict():
    data = request.get_json()
    data = json.dumps(data)
    pred, pred_proba = predict_class(model, lecancer, lerelationships, history_class_codes, ethnicity_codes, data, df)

    print(pred, pred_proba[0].tolist())
    return_obj = {
        'pred': pred,
        'predProba': pred_proba[0].tolist()
    }
    return json.dumps(return_obj)

@app.route('/data', methods = ['GET'])
@cross_origin()
def data_get():
    frontend_df = pd.read_csv('../data/frontendaccess.csv')  
    frontend_df = frontend_df.drop(columns=['Gene', 'cancer_dx', 'full_history', 'rel_relation', 'rel_age', 'rel_cancer', 'relationships', 'cancer_dx_type', 'cancer_dx_age', 'other_cancer'])
    frontend_df['Pathogenic?'] = frontend_df['Pathogenic?'].map({True: 'true', False: 'false'})
    return_obj = {
        'cols': list(frontend_df.columns),
        'data': frontend_df.to_json(orient = "records")
    }
    return json.dumps(return_obj)


@app.route('/add', methods = ['POST'])
@cross_origin()
def data_add():
    data = request.get_json()
    add_data(data)
    return ""

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)