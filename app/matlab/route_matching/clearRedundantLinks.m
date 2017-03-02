function [O_coRoute, O_TMCnames, O_linkList] = clearRedundantLinks(coRoute,TMCnames,linkList,desktopPath )
%#########################################################################
%This program is used to clear circled route part

%Author: Xipeng Wang
%Contact: xipengw1990@gmail.com
%Date: 8/20/2014
%#########################################################################
%% Post process links
        O_coRoute = coRoute;
        O_TMCnames = TMCnames;
        O_linkList = linkList;
for epoch =1:1
    mark = zeros(length(linkList),1);
    k=1;
    ind = cell(1,1);
    for i=1:length(linkList)
        if(mark(i)==1)
            continue;
        end
        tempind = [];
        linkstring = linkList{i,1};
        for j=i+1:length(linkList)
            if(linkstring==linkList{j,1})
                mark(i)=1;
                mark(j)=1;
                tempind = [tempind,i,j];
            end
        end
        if(~isempty(tempind))
            ind{k}=tempind;
            k=k+1;
        end
    end
    if(isempty(ind{1,1}))
        break;
    end
    %
    Index = [];
    for i=1:length(ind)
        Index=[Index,min(ind{i}):max(ind{i})];
    end
    Index = unique(Index);
    %
    for i=1:length(Index)
        coRoute(find(coRoute(:,9) == linkList{Index(i),1}),:)=[];
    end
    %
    [O_coRoute, O_TMCnames, O_linkList] = findRoute_Coroute(coRoute,desktopPath);
end


end

