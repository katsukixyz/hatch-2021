
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn import preprocessing
import numpy as np
import re

df = pd.read_csv("../data/normalized_one_hot.csv")
# df = df.iloc[2213:, :]
# orig = pd.read_csv("../data/normalized_one_hot.csv")
# orig_label = orig['history_class']
# orig_test = orig.loc[:, orig.columns != 'history_class']

X = df.loc[:, df.columns != 'history_class']
y = df['history_class']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.3)

clf = RandomForestClassifier(n_estimators=100, max_depth = 100)
clf = clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
# y_pred = clf.predict(orig_test)
# orig['prediction'] = y_pred
# orig.to_csv('prediction.csv', index = False)

print("Accuracy: ", metrics.accuracy_score(y_test, y_pred))
# print("Accuracy: ", metrics.accuracy_score(orig_label, y_pred))
