function [O_coRoute, O_TMCnames, O_linkList] = FinalClean(coRoute,TMCnames,linkList)
%#########################################################################
%This program is used to final clean

%Author: Xipeng Wang
%Contact: xipengw1990@gmail.com
%Date: 8/20/2014
%#########################################################################
%% Post process links
        
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
        O_coRoute = coRoute;
        O_TMCnames = TMCnames;
        O_linkList = linkList;
        return;
    end
    %
    Index = [];
    for i=1:length(ind)
        Index=[Index,min(ind{i}):max(ind{i})];
    end
    Index = unique(Index);
    % if first 2 links are same, keep the second one
    if(~isempty(find(Index==1)) && ~isempty(find(Index==2)))
        Index(Index==1) =[];
        Index(Index==2) = [];
        
    end
    
    %
    for i=1:length(Index)
        coRoute(find(coRoute(:,9) == linkList{Index(i),1}),:)=[];
    end
    %
    linkList(Index,:) = [];
    O_linkList = linkList;
    TMCnames(Index,:) = [];
    O_TMCnames =TMCnames;
    linkList(1,:) = [];
    TMCnames(1,:) = [];
    coRoute(find(coRoute(:,3) == 0),:)=[];
    O_coRoute = coRoute;
end


end

