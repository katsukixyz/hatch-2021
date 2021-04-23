from sklearn.linear_model import LogisticRegression
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn import preprocessing
from sklearn import tree
import numpy as np
import matplotlib.pyplot as plt
import re

df = pd.read_csv("../data/reaugmented_2.csv")
X = df.loc[:, df.columns != 'history_class']
# X = df_onehot
y = df['history_class']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 1)

lr = LogisticRegression(solver = "saga", max_iter = 100)
lr = lr.fit(X_train, y_train)

y_pred = lr.predict(X_test)

print("Accuracy: ", metrics.accuracy_score(y_test, y_pred))

# fig, axes = plt.subplots(nrows = 1,ncols = 1,figsize = (4,4), dpi=300)
# tree.plot_tree(clf, feature_names=df.loc[:, df.columns != 'history_class'], class_names = ['strong_personal', 'strong_family', 'not_strong', 'none'], filled = True)
# fig.savefig('tree.png')
