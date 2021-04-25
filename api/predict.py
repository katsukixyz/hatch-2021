#Imports 
import pandas as pd
from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn import metrics, preprocessing
import numpy as np
import json
import pandas as pd
import re
import operator

#Helper Functions
def find_probable_cancer(test):
    test = test.lower()
    if test == "?" or test == "unknown":
        pass
    else:
        test = re.split(",|/|;", test)
        test = [re.sub("([\(\[]).*?([\)\]])", "", x) for x in test]
        final_output = []
        for i in range(len(test)):
            scores = {}
            for rel in rel_cancer_search_list:
                scores[rel] = 1 - levenshteinDistance(test[i], rel)
            guess_cancer = max(scores.items(), key=operator.itemgetter(1))[0]
            final_output.append(guess_cancer)
        return final_output
    
def find_probable_age(test):
    test = re.findall("[0-9]+", test)
    return test

def levenshteinDistance(s1, s2):
    if len(s1) > len(s2):
        s1, s2 = s2, s1

    distances = range(len(s1) + 1)
    for i2, c2 in enumerate(s2):
        distances_ = [i2+1]
        for i1, c1 in enumerate(s1):
            if c1 == c2:
                distances_.append(distances[i1])
            else:
                distances_.append(1 + min((distances[i1], distances[i1 + 1], distances_[-1])))
        distances = distances_
    return distances[-1]

#helper variables
rel_cancer_search_list = ['vulvar','lymphoma','ovarian','brain','breast','prostate','blood','bone','abdominal','leukemia','lung','ampulla','skin','anal','colon','thyroid','appendix','lympnodes','basal','bile duct','bladder','intestines','liver','bowel','sinus','spinal','uterine','cervical','pancreas','cheek','ciliary','voice box','endometrial','rectum','tonsil','tongue','esophageal','thrombocytopenia','testicles','stomach','squamous','throat','retina','renal','myeloma', 'melanoma', 'oral','muscle','polyps','kidney','gall bladder','jaw','heart','glaucoma','glioblastoma','duodenum']

#startup

def startup():
    df = pd.read_csv('../data/cleaned_kul.csv')
    df = df.drop(columns=['Gene', 'cancer_dx', 'full_history', 'rel_relation', 'rel_age', 'rel_cancer', 'relationships', 'cancer_dx_type', 'cancer_dx_age', 'other_cancer'])

    pattern = r'rel_[0-9]_cancer'
    pattern2 = r'rel_[0-9][0-9]_cancer'
    pattern3 = r'cancer_dx_type_'

    lis = [i for i, x in enumerate(df.columns) if re.search(pattern, x)]
    lis2 = [i for i, x in enumerate(df.columns) if re.search(pattern2, x)]
    lis3 = [i for i, x in enumerate(df.columns) if re.search(pattern3, x)]
    cancerallcolumns = []
    cancerallcolumns.extend(lis)
    cancerallcolumns.extend(lis2)
    cancerallcolumns.extend(lis3)

    pattern = r'rel_[0-9]_relationship'
    pattern2 = r'rel_[0-9][0-9]_relationship'
    lis = [i for i, x in enumerate(df.columns) if re.search(pattern, x)]
    lis2 = [i for i, x in enumerate(df.columns) if re.search(pattern2, x)]
    relationshipsallcolumns = []
    relationshipsallcolumns.extend(lis)
    relationshipsallcolumns.extend(lis2)

    uniquecancer = list(pd.unique(df.iloc[:, cancerallcolumns].values.ravel('K')))

    uniquerelationships = list(pd.unique(df.iloc[:, relationshipsallcolumns].values.ravel('K')))

    uniquecancer.extend(' ')
    uniquerelationships.extend(' ')


    lecancer = preprocessing.LabelEncoder()
    lerelationships = preprocessing.LabelEncoder()

    lerelationships.fit(uniquerelationships)

    lecancer.fit(uniquecancer)

    lecancer.classes_

    df.iloc[:, cancerallcolumns]=df.iloc[:, cancerallcolumns].fillna(' ').apply(lecancer.transform)

    df.iloc[:, relationshipsallcolumns]=df.iloc[:, relationshipsallcolumns].fillna(' ').apply(lerelationships.transform)

    df['history_class']=df['history_class'].astype('category')
    history_class_codes = dict(enumerate(df['history_class'].cat.categories))
    df['history_class'] = df['history_class'].cat.codes

    df['Pathogenic?']=df['Pathogenic?'].astype('category').cat.codes

    df['ethnicity']=df['ethnicity'].astype('category')
    ethnicity_codes = dict(enumerate(df['ethnicity'].cat.categories))
    ethnicity_codes = {y:x for x,y in ethnicity_codes.items()}
    df['ethnicity']=df['ethnicity'].cat.codes

    df = df.fillna(-1)

    X=df.loc[:, df.columns != 'history_class']  # Features
    y=df['history_class']  # Labels
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

    model = CatBoostClassifier()
    model.fit(X_train, y_train, verbose = False)

    y_pred = model.predict(X_test)
    print(metrics.accuracy_score(y_test, y_pred))

    return model, lecancer, lerelationships, history_class_codes, ethnicity_codes, df

#predict 

def json_to_df(jsonstr, df, ethnicity_codes):
    jsonobj = json.loads(jsonstr)
    pandas_dict = {}
    pandas_dict['Pathogenic?'] = jsonobj['pathogenic']
    for i in range(len(jsonobj['personalHistory'])):
        pandas_dict[f"cancer_dx_type_{str(i+1)}"] = find_probable_cancer(jsonobj['personalHistory'][i]['type'])[0]
        pandas_dict[f"cancer_dx_age_{str(i+1)}"] = jsonobj['personalHistory'][i]['age']
    for i in range(len(jsonobj['relHistory'])):
        pandas_dict[f"rel_{str(i+1)}_relationship"] = jsonobj['relHistory'][i]['relationship']
        splitage = find_probable_age(jsonobj['relHistory'][i]['age'])
        splittype = find_probable_cancer(jsonobj['relHistory'][i]['type'])
        for j in range(len(splittype)):
            pandas_dict[f"rel_{str(i+1)}_cancer_{str(j+1)}"] = splittype[j].strip()
            pandas_dict[f"rel_{str(i+1)}_age_{str(j+1)}"] = int(splitage[j].strip())
    pandas_dict['ethnicity'] = ethnicity_codes[jsonobj['race']]
    pandas_dict['known_brca'] = -1
    datatobeadded = pd.DataFrame([pandas_dict])
    return df.append(datatobeadded).tail(1)


def predict_class(model, lecancer, lerelationships, history_class_codes, ethnicity_codes, jsonstr, df):
    predict_df = json_to_df(jsonstr, df, ethnicity_codes)
    predict_df = predict_df.drop('history_class', axis=1)

    pattern = r'rel_[0-9]_cancer'
    pattern2 = r'rel_[0-9][0-9]_cancer'
    pattern3 = r'cancer_dx_type_'

    lis = [i for i, x in enumerate(predict_df.columns) if re.search(pattern, x)]
    lis2 = [i for i, x in enumerate(predict_df.columns) if re.search(pattern2, x)]
    lis3 = [i for i, x in enumerate(predict_df.columns) if re.search(pattern3, x)]
    cancerallcolumns = []
    cancerallcolumns.extend(lis)
    cancerallcolumns.extend(lis2)
    cancerallcolumns.extend(lis3)

    pattern = r'rel_[0-9]_relationship'
    pattern2 = r'rel_[0-9][0-9]_relationship'
    lis = [i for i, x in enumerate(predict_df.columns) if re.search(pattern, x)]
    lis2 = [i for i, x in enumerate(predict_df.columns) if re.search(pattern2, x)]
    relationshipsallcolumns = []
    relationshipsallcolumns.extend(lis)
    relationshipsallcolumns.extend(lis2)

    predict_df.iloc[:, cancerallcolumns]=predict_df.iloc[:, cancerallcolumns].fillna(' ').apply(lecancer.transform)

    predict_df.iloc[:, relationshipsallcolumns]=predict_df.iloc[:, relationshipsallcolumns].fillna(' ').apply(lerelationships.transform)

    predict_df = predict_df.fillna(-1)

    prediction = model.predict(predict_df)[0][0]

    #final outputs
    final_prediction = history_class_codes[prediction]

    final_prediction_proba = model.predict_proba(predict_df)

    return final_prediction, final_prediction_proba 