from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn import preprocessing
from sklearn import tree
import numpy as np
import matplotlib.pyplot as plt
import re
import pandas as pd

df = pd.read_csv("../data/reaugmented.csv")
df = df.iloc[2213:, :]
orig = pd.read_csv("../data/normalized_one_hot.csv")
orig_label = orig['history_class']
orig_test = orig.loc[:, orig.columns != 'history_class']

X = df.loc[:, df.columns != 'history_class']
y = df['history_class']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 1)

best_Kvalue = 0
best_score = 0

for i in range(1, 5):
    knn = KNeighborsClassifier(n_neighbors=i)
    knn.fit(X_train, y_train)
    if knn.score(X_test, y_test) > best_score:
        best_score = knn.score(X_train, y_train)
        best_Kvalue = i

print("Best KNN Value: {}".format(best_Kvalue))
print("Test Accuracy: {}%".format(round(best_score*100,2)))

# y_pred = knn.predict(X_test)
y_pred = knn.predict(orig_test)
print("Accuracy: ", metrics.accuracy_score(orig_label, y_pred))