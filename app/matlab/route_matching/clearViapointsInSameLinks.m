function [ O_viaPointsLocation ] = clearViapointsInSameLinks(viaPointsLocation,tripTrace,desktopPath)
%#########################################################################
%This function is find the viaPoints within same link, just keep one of
%them.
%Input:
%
%Output:
%

%Author: Xipeng Wang
%Contact: xipengw1990@gmail.com
%Date: 08/20/2014
%#########################################################################
cmpLinkID = 0;
deleteIdx = [];
for i=1:length(viaPointsLocation)
    pointsVector=[tripTrace(viaPointsLocation(i),1),tripTrace(viaPointsLocation(i),2);tripTrace(viaPointsLocation(i),1),tripTrace(viaPointsLocation(i),2)];
    tempFlag=callADASRP(pointsVector);
    try
        [coRoute, TMCnames, linkList] = routeXMLparser([desktopPath 'route.xml']);
        tempLinkID = coRoute(1,9);
        if(cmpLinkID~=tempLinkID)
            cmpLinkID = tempLinkID;
        else
            deleteIdx = [deleteIdx;i];
        end
    catch me
        O_viaPointsLocation = viaPointsLocation;
        return;
    end
end
viaPointsLocation(deleteIdx) = [];
O_viaPointsLocation = viaPointsLocation;
end

