import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn import preprocessing
from sklearn import tree
import numpy as np
import matplotlib.pyplot as plt
import re

df = pd.read_csv("../data/reaugmented_3.csv")
df = df.iloc[2213:, :]
orig = pd.read_csv("../data/normalized_one_hot.csv")
orig_label = orig['history_class']
orig_test = orig.loc[:, orig.columns != 'history_class']


X = df.loc[:, df.columns != 'history_class']
# X = df_onehot
y = df['history_class']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2)

clf = DecisionTreeClassifier()
clf = clf.fit(X_train, y_train)

# y_pred = clf.predict(X_test)
y_pred = clf.predict(orig_test)

# print("Accuracy: ", metrics.accuracy_score(y_test, y_pred))
print("Accuracy: ", metrics.accuracy_score(orig_label, y_pred))

# fig, axes = plt.subplots(nrows = 1,ncols = 1,figsize = (4,4), dpi=300)
# tree.plot_tree(clf, feature_names=df.loc[:, df.columns != 'history_class'], class_names = ['strong_personal', 'strong_family', 'not_strong', 'none'], filled = True)
# fig.savefig('tree.png')
