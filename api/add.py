import json
import pandas as pd
import re
import operator
rel_cancer_search_list = ['vulvar','lymphoma','ovarian','brain','breast','prostate','blood','bone','abdominal','leukemia','lung','ampulla','skin','anal','colon','thyroid','appendix','lympnodes','basal','bile duct','bladder','intestines','liver','bowel','sinus','spinal','uterine','cervical','pancreas','cheek','ciliary','voice box','endometrial','rectum','tonsil','tongue','esophageal','thrombocytopenia','testicles','stomach','squamous','throat','retina','renal','myeloma', 'melanoma', 'oral','muscle','polyps','kidney','gall bladder','jaw','heart','glaucoma','glioblastoma','duodenum']
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

def add_data(jsonobj):
    print(jsonobj)
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
    pandas_dict['ethnicity'] = jsonobj['race']
    pandas_dict['history_class'] = jsonobj['label']
    pandas_dict['known_brca'] = int(-1)
    df = pd.read_csv('../data/frontendaccess.csv')
    datatobeadded = pd.DataFrame([pandas_dict])

    df = df.append(datatobeadded)
    df.to_csv("../data/frontendaccess.csv", index = False)
