# Data Process ReadMe

- There are three programs listing below:

1. DownSample.py
2. WithdrawSpecificRow.py
3. CombineRows.py

The frequency in the Datalogger is 100 hz. By using DownSample.py, it can downsample the frequency from 100hz to 10hz.

By using WithdrawSpecificRow.py, It can withdraw specific columns from three seperate csv files by name of columns and generate three new csv files contains specific columns

By using CombineCol.py, the program can combine the three new csv files that generated in step 2 to the new summary file


- Procedures:

The files in the folder is a template file, you may modify depends on conditions

Put all the csv(Datalogger, Bioharness, Shimmer) that needed to process in the same folder ( Or you can set path in the pandas read_csv API )

Put the name of file that need to process in the pd.read_csv

Put all the needed columns name in the pd.DataFrame()

If need more help, look through the python pandas homepage for more details

- Notes: This program is responsible by Weicheng Jiang
