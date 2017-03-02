function [flag] = callADASRP(pointsVector)
%#########################################################################
%This program is used to call the ADASRP ford-Plugin software
%input:
%pointsVector: [origin latitude,origin longitude; dest latitude,dest longitude; via points latitude,via points longitude]

%Author: Xipeng Wang
%Contact: xipengw1990@gmail.com
%Date: 8/20/2014
%####################cc#####################################################

Origin = [num2str(pointsVector(1,1),'% .7f') ' ' num2str(pointsVector(1,2),'% .7f')];
Dest = [num2str(pointsVector(2,1),'% .7f') ' ' num2str(pointsVector(2,2),'% .7f')];
vias = ' ';
if(length(pointsVector(:,1))>2)
    for i=3:length(pointsVector(:,1))
        vias = [vias num2str(pointsVector(i,1),'% .7f') ' ' num2str(pointsVector(i,2),'% .7f') ' '];
    end
end  
try
    foo = system(['Route.exe 127.0.0.1 6543 ' Origin ' ' Dest vias ' >> "route.dat" ']);
catch me
    flag = 0;
    return;
end 
flag = 1;
end

