%--------------------------------------------------------------------------
%This program is used to call the ADASRP ford-Plugin software
%@input:
%   pointsVector    : [origin latitude, origin longitude; dest latitude,
%                       dest longitude; via points latitude, 
%                       via points longitude]

%Author: Xipeng Wang
%Contact: xipengw1990@gmail.com
%Date: 8/20/2014
%--------------------------------------------------------------------------
function [flag] = callADASRPbyViaPoints(viaPointsVector)

    Origin = [num2str(viaPointsVector(1,1),'% .7f') ' ' ...
                num2str(viaPointsVector(1,2),'% .7f')];
    Dest = [num2str(viaPointsVector(2,1),'% .7f') ' ' ...
                num2str(viaPointsVector(2,2),'% .7f')];
    vias = ' ';

    if(size(viaPointsVector, 1) > 2)
        for i = 3 : size(viaPointsVector, 1)
            vias = [vias num2str(viaPointsVector(i, 1),'% .7f') ' ' ...
                        num2str(viaPointsVector(i, 2),'% .7f') ' '];
        end
    end

    try
        foo = system(['Route.exe 127.0.0.1 6543 ' Origin ' ' Dest vias ' >> "route.dat" ']);
    catch ME
        flag = 0;
        return;
    end
    flag = 1;
end