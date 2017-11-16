import csv
import pandas as pd

df = pd.read_csv('output01.csv')

print df.head()
print '----------------'
print df[['time [s]', 'long accel [g]', 'lat accel [g]','vector accel [g]', 'vert accel [g]', 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]']]
print '------------------------------------------------------------------'
print

dd = pd.read_csv('output02.csv')

print dd.head()
print '----------------'
print dd[['Time', 'HR', 'BR','Posture', 'Activity', 'PeakAccel', 'HRV']]
print '------------------------------------------------------------------'
print

data = pd.merge(df, dd, how='outer')
data = data[['time [s]', 'long accel [g]', 'lat accel [g]','vector accel [g]', 'vert accel [g]', 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]', 'Time', 'HR', 'BR','Posture', 'Activity', 'PeakAccel', 'HRV']]
print data
print '------------------------------------------------------------------'
print


data.to_csv(r'trip6.csv', encoding='gbk')


df = pd.read_csv('trip6.csv')

print df.head()
print '----------------'
print df[['time [s]', 'long accel [g]', 'lat accel [g]','vector accel [g]', 'vert accel [g]', 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]', 'Time', 'HR', 'BR','Posture', 'Activity', 'PeakAccel', 'HRV']]
print '------------------------------------------------------------------'
print

dd = pd.read_csv('output03.csv')

print dd.head()
print '----------------'
print dd[['ecg', 'gsr', 'scl','scr', 'driver_workload', 'expert_workload', 'traffic_load','event','GPS heading [degs]']]
print '------------------------------------------------------------------'
print

data = pd.merge(df, dd)
data = data[['time [s]', 'long accel [g]', 'lat accel [g]','vector accel [g]', 'vert accel [g]', 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]', 'Time', 'HR', 'BR','Posture', 'Activity', 'PeakAccel', 'HRV','ecg', 'gsr', 'scl','scr', 'driver_workload', 'expert_workload', 'traffic_load','event','GPS heading [degs']]
print data
print '------------------------------------------------------------------'
print


data.to_csv(r'trip7.csv', encoding='gbk')