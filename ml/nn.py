
import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras import layers, models, datasets
import os
import datetime
import pandas as pd
from sklearn.model_selection import train_test_split
from tensorflow import feature_column
from sklearn import preprocessing
import re

config = tf.compat.v1.ConfigProto()
config.gpu_options.allow_growth = True
session = tf.compat.v1.Session(config = config)

df = pd.read_csv("../data/reaugmented_2.csv")

df = df.astype(int)
df = df.rename(columns = {'Pathogenic?': 'Pathogenic'})

#splits into train, test, and val (validation is used to tweak model, test is the actual metric)
train, test = train_test_split(df, test_size = 0.2)
train, val = train_test_split(train, test_size = 0.2)

def df_to_dataset(dataframe, shuffle = True, batch_size = 32):
    dataframe = dataframe.copy()
    labels = dataframe.pop('history_class')
    ds = tf.data.Dataset.from_tensor_slices((dict(dataframe), labels))
    if shuffle:
        ds = ds.shuffle(buffer_size = len(dataframe))
    ds = ds.batch(batch_size)
    return ds

feature_columns = []

def get_unique_categories_and_append(key):
    col = df[key]
    arr = col.to_numpy()
    unique_arr = np.unique(arr)
    feat_col = feature_column.categorical_column_with_vocabulary_list(key, unique_arr)
    one_hot = feature_column.indicator_column(feat_col)
    feature_columns.append(one_hot)

batch_size = 32
train_ds = df_to_dataset(train, batch_size = batch_size)
val_ds = df_to_dataset(val, shuffle = False, batch_size = batch_size)
test_ds = df_to_dataset(test, shuffle = False, batch_size = batch_size)

for feature_batch, label_batch in train_ds.take(1):
    # print('All features: ', list(feature_batch.keys()))
    # print('A batch of targets: ', label_batch)

for key in list(feature_batch.keys()):
    get_unique_categories_and_append(key)

feature_layer = tf.keras.layers.DenseFeatures(feature_columns)
# print(feature_columns)

model = tf.keras.models.Sequential([
    feature_layer,
    layers.Dense(128, activation = 'relu'),
    layers.Dense(128, activation = 'relu'),
    layers.Dense(3)
])

model.compile(optimizer = tf.keras.optimizers.Adam(), loss = tf.keras.losses.BinaryCrossentropy(from_logits = True), metrics = ['accuracy'])

model.fit(train_ds, validation_data = val_ds, epochs = 3)

#model.save_weights('./checkpoints/mushroom/checkpoint')

loss, accuracy = model.evaluate(test_ds)
print(accuracy)

# def custom_test(dataframe):
#     dataframe = dataframe.copy()
#     labels = dataframe.pop('class')
#     ds = tf.data.Dataset.from_tensor_slices((dict(dataframe), labels))
#     ds = ds.batch(1)
#     return ds

# num = 6084
# custom_test_df = df.iloc[[num]]
# print(custom_test_df)
# custom_test_ds = custom_test(custom_test_df)
# predictions = model.predict(custom_test_ds, verbose = 1)
# print('Prediction: ' + str(predictions))
# print('Actual: ' + str(df.iloc[num]['class']))