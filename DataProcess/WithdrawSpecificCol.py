import pandas as pd

df1 = pd.read_csv('synced_118_07182017_DataLogger_01.csv',error_bad_lines=False, index_col=False, dtype='unicode')

pd.DataFrame(df1, columns= ['time [s]', 'long accel [g]', 'lat accel [g]', 'vector accel [g]', 'vert accel [g]', 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]'])

print pd.DataFrame(df1, columns= ['time [s]', 'long accel [g]', 'lat accel [g]','vector accel [g]', 'vert accel [g]', 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]'])

df1_to_save = pd.DataFrame(df1,columns= ['time [s]', 'long accel [g]', 'lat accel [g]','vector accel [g]', 'vert accel [g]', 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]'])
df1_to_save.to_csv('output01.csv',index=False)

df2 = pd.read_csv('synced_2017_07_18-14_10_38_Summary.csv',error_bad_lines=False, index_col=False, dtype='unicode')

pd.DataFrame(df2, columns= ['Time', 'HR', 'BR','Posture', 'Activity', 'PeakAccel', 'HRV'])

print pd.DataFrame(df2, columns= ['Time', 'HR', 'BR','Posture', 'Activity', 'PeakAccel', 'HRV'])

df2_to_save = pd.DataFrame(df2,columns= ['Time', 'HR', 'BR','Posture', 'Activity', 'PeakAccel', 'HRV'])
df2_to_save.to_csv('output02.csv',index=False)

df3 = pd.read_csv('Synchronized_data_Yuanma_Trip6.csv',error_bad_lines=False, index_col=False, dtype='unicode')

pd.DataFrame(df3, columns= ['ecg', 'gsr', 'scl','scr', 'driver_workload', 'expert_workload', 'traffic_load','event','GPS heading [degs]'])

print pd.DataFrame(df3, columns= ['ecg', 'gsr', 'scl','scr', 'driver_workload', 'expert_workload', 'traffic_load','event','GPS heading [degs]'])

df3_to_save = pd.DataFrame(df3, columns= ['ecg', 'gsr', 'scl','scr', 'driver_workload', 'expert_workload', 'traffic_load','event','GPS heading [degs]'])
df3_to_save.to_csv('output03.csv',index=False)


df4 = pd.merge(df1,df2, how = 'outer', on='GPS lat [degs]')
df4_to_save = pd.DataFrame(df4, columns= ['time [s]', 'long accel [g]', 'lat accel [g]','vector accel [g]', 'vert accel [g]', 'speed [mph]', 'GPS long [degs]', 'GPS lat [degs]', 'Time', 'HR', 'BR','Posture', 'Activity', 'PeakAccel', 'HRV'])
df4_to_save.to_csv('trip6.csv',index=False)
