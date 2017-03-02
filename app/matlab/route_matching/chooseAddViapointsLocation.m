function [addLocation] = chooseAddViapointsLocation(pointsIdx)
%#########################################################################
%This program is used to choose the adding via points location from parts
%of trip not matched to the route

%Author: Xipeng Wang
%Contact: xipengw1990@gmail.com
%Date: 8/20/2014
%#########################################################################
addLocation= [];
tempSequence=[find((pointsIdx(2:end) - pointsIdx(1:end-1))~=1)]';
tempSequence = [1,tempSequence,length(pointsIdx)];
for i=2:length(tempSequence)
   if((tempSequence(i) - tempSequence(i-1))>=10 && (tempSequence(i) - tempSequence(i-1))<30)
       addLocation = [addLocation;floor((pointsIdx(tempSequence(i)-1) - pointsIdx(tempSequence(i-1)+1))/2)+pointsIdx(tempSequence(i-1)+1)];
   elseif((tempSequence(i) - tempSequence(i-1))>=30)
       %addLocation = [addLocation;floor((pointsIdx(tempSequence(i)-1) - pointsIdx(tempSequence(i-1)+1))/2)+pointsIdx(tempSequence(i)-1)];
       addLocation = [addLocation;...
           floor((pointsIdx(tempSequence(i)-1) - pointsIdx(tempSequence(i-1)+1))*1/4)+pointsIdx(tempSequence(i-1)+1);...
           floor((pointsIdx(tempSequence(i)-1) - pointsIdx(tempSequence(i-1)+1))*3/4)+pointsIdx(tempSequence(i-1)+1)];
   end
end
end

