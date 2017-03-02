%#########################################################################
%This program is used to move unmatched data

%Author: Xipeng Wang
%Contact: xipengw1990@gmail.com
%Date: 8/20/2014
%#########################################################################
clear;clc;
index=input('not matched index:');
folderPath='D:\GenerateRoute_v7_manually\tempData';
destFolderPath='C:\Users\Xipeng1990\Desktop\GenerateRoute_v6\NotmatchedData';
saveFolderPath = 'D:\GenerateRoute_v7_manually\saveData';
DirF = dir(folderPath);
len=length(DirF);
for i=1:length(index)
    movefile([folderPath '\' DirF(index(i)).name],[destFolderPath '\' DirF(index(i)).name]);
    movefile([saveFolderPath '\' DirF(index(i)).name(1:end-12) '.mat'],[destFolderPath '\' DirF(index(i)).name(1:end-12) '.mat']);
    movefile([saveFolderPath '\' DirF(index(i)).name(1:end-12) '.fig'],[destFolderPath '\' DirF(index(i)).name(1:end-12) '.fig']);
end
