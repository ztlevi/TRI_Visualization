import csv
import pandas as pd

df4 = pd.read_csv('output01.csv', error_bad_lines=False, index_col=False, dtype='unicode')
df4 = df4[df4.index % 10 == 0]  # Selects every 10th raw starting from 1

pd.DataFrame(df4, columns=['time [s]', 'long accel [g]', 'lat accel [g]', 'vector accel [g]', 'vert accel [g]',
                           'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]'])

print pd.DataFrame(df4, columns=['time [s]', 'long accel [g]', 'lat accel [g]', 'vector accel [g]', 'vert accel [g]',
                                 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]'])

df4_to_save = pd.DataFrame(df4,
                           columns=['time [s]', 'long accel [g]', 'lat accel [g]', 'vector accel [g]', 'vert accel [g]',
                                    'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]'])
df4_to_save.to_csv('outputnew02.csv', index=False)
