function [O_coRoute,O_TMCnames,O_linkList] = findRoute_Coroute(coRoute,desktopPath)
[~,UcoIndex] = unique(coRoute(:,3));
rdFC = coRoute(UcoIndex,10);
trace = [coRoute(UcoIndex,2),coRoute(UcoIndex,1)];
coPairs(1,1:2) = trace(1,1:2);
coPairs(2,1:2) = trace(end,1:2);
ss_coor= [];
for j=1:size(coPairs,1)
    ss_coor = horzcat(ss_coor,num2str(coPairs(j,1),'% .7f'),'  ');
    ss_coor = horzcat(ss_coor,num2str(coPairs(j,2),'% .7f'),'  ');
end

via_coor = '';
LocalInd=find(rdFC>=3);
HwyInd = find(rdFC<3);
m = sort([LocalInd(1:6:length(LocalInd));HwyInd(1:25:length(HwyInd))]);
for i=1:length(m)
    via_coor = horzcat(via_coor,num2str(trace(m(i),1),'% .7f'),'  ');
    via_coor = horzcat(via_coor,num2str(trace(m(i),2),'% .7f'),'  ');
end
system(horzcat('Route.exe 127.0.0.1 6543 -o ',ss_coor,'   ',via_coor)); % run ADASRP to get link info
%system(horzcat('Route.exe 127.0.0.1 6543 -o ',ss_coor));
[O_coRoute, O_TMCnames, O_linkList] = routeXMLparser([desktopPath 'route.xml']);
end



