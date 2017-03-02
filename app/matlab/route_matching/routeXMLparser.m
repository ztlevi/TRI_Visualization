function [coRoute, TMCnames, linkList] = routeXMLparser(fileName)

% fileName = './AB1/route.xml';     % default file name
fid = fopen(fileName, 'r');
fileText = fread(fid, 'uint8=>char')';
ST = fclose(fid);

rst = regexp(fileText, '<item>\s\s\s\s\s<PermanentId>');
linkCnt = size(rst, 2);
linkList = cell(linkCnt, 9);
%LinkList: 1:linkID  2:linkID(Hex) 3:RoadName 4:FC(0~4)(function class,4 is local;0 is major intercity highways;) 
%5:ExpectedSpeed(kmh) 6:lane number 7:Height 8:Length 9:Traffic light
spIdx = 0;
coRoute = [];
%CoRoute: 1:Longitude 2:Latitude 3:Numerical link ID 4:road type 5:?
%6:ExpectedSpeed(mph) 7:lane number 8:Traffic light(0:NO 1:Yes) 9:Permenant link ID 10:FC
TMCnames = {};
for k=1:linkCnt
    if k<linkCnt
        linkDataStr = fileText(rst(k):rst(k+1)-1);
    else
        linkDataStr = fileText(rst(k):end);
    end
    ptn = 'PermanentId';
    pst1 = strfind(linkDataStr, ['<' ptn '>']);
    pst2 = strfind(linkDataStr, ['</' ptn '>']);
    linkList(k,1) = {str2double(linkDataStr(pst1+length(ptn)+2:pst2-1))};
    linkList(k,2) = {dec2hex(linkList{k,1})};
    ptn = 'RoadName';
    pst1 = strfind(linkDataStr, ['<' ptn '>']);
    pst2 = strfind(linkDataStr, ['</' ptn '>']);
    linkList(k,3) = {linkDataStr(pst1+length(ptn)+2:pst2-1)};
    ptn = 'FC';
    pst1 = strfind(linkDataStr, ['<' ptn '>']);
    pst2 = strfind(linkDataStr, ['</' ptn '>']);
    linkList(k,4) = {str2double(linkDataStr(pst1+length(ptn)+2:pst2-1))};
    ptn = 'ExpectedSpeedKMH';
    pst1 = strfind(linkDataStr, ['<' ptn '>']);
    pst2 = strfind(linkDataStr, ['</' ptn '>']);
    linkList(k,5) = {str2double(linkDataStr(pst1+length(ptn)+2:pst2-1))};
    ptn = 'LanesFrom0';
    pst1 = strfind(linkDataStr, ['<' ptn '>']);
    pst2 = strfind(linkDataStr, ['</' ptn '>']);
    linkList(k,6) = {str2double(linkDataStr(pst1+length(ptn)+2:pst2-1))};
    ptn = 'AverageHeight';
    pst1 = strfind(linkDataStr, ['<' ptn '>']);
    pst2 = strfind(linkDataStr, ['</' ptn '>']);
    linkList(k,7) = {str2double(linkDataStr(pst1+length(ptn)+2:pst2-1))};
    ptn = 'LengthCM';
    pst1 = strfind(linkDataStr, ['<' ptn '>']);
    pst2 = strfind(linkDataStr, ['</' ptn '>']);
    linkList(k,8) = {str2double(linkDataStr(pst1+length(ptn)+2:pst2-1))};
    
    try
        ptn = 'TrafficLight';
        pst1 = strfind(linkDataStr, ['<' ptn '>']);
        pst2 = strfind(linkDataStr, ['</' ptn '>']);
        if ~isempty(pst1)
            linkList(k,9) = {1};
        end
    end
    
    try
        ptn = 'CountryCode';
        pst1 = strfind(linkDataStr, ['<' ptn '>']);
        pst2 = strfind(linkDataStr, ['</' ptn '>']);
        TMCcode = linkDataStr(pst1+length(ptn)+2:pst2-1);
        ptn = 'LocationTable';
        pst1 = strfind(linkDataStr, ['<' ptn '>']);
        pst2 = strfind(linkDataStr, ['</' ptn '>']);
        TMCcode = [TMCcode '0' linkDataStr(pst1+length(ptn)+2:pst2-1)];
        ptn = 'PathDirection';
        pst1 = strfind(linkDataStr, ['<' ptn '>']);
        pst2 = strfind(linkDataStr, ['</' ptn '>']);
        PathDirection = linkDataStr(pst1+length(ptn)+2:pst2-1);
        if strcmp(PathDirection, 'P')
            PathDirection = '+';
        elseif strcmp(PathDirection, 'N')
            PathDirection = '-';
        end
        TMCcode = [TMCcode PathDirection];
        ptn = 'LocationCode';
        pst1 = strfind(linkDataStr, ['<' ptn '>']);
        pst2 = strfind(linkDataStr, ['</' ptn '>']);
        LocationCode = linkDataStr(pst1+length(ptn)+2:pst2-1);
        if length(LocationCode)<5
            for lc = 1:5-length(LocationCode)
                LocationCode = ['0' LocationCode];
            end
        end
        TMCcode = [TMCcode LocationCode];
        if strcmp(TMCcode, '000000')
            TMCcode = 'NaN';
        end
        TMCnames{k,1} = TMCcode;
    catch
        TMCnames{k,1} = 'NaN';
    end
    linkDataStr = linkDataStr(10:end-10);
    spst = regexp(linkDataStr, '<item>.*?</item>');
    spCnt = size(spst,2);
    for j=1:spCnt
        spIdx = spIdx+1;
        if j<spCnt
            spStr = linkDataStr(spst(j):spst(j+1)-1);
        elseif k==linkCnt
            spStr = linkDataStr(spst(j):end);
        else
            spIdx = spIdx-1;
            continue;
        end
        pst1 = strfind(spStr, '<Longitude>');
        pst2 = strfind(spStr, '</Longitude>');
        coRoute(spIdx, 1) = str2double(spStr(pst1+11:pst2-1));
        pst1 = strfind(spStr, '<Latitude>');
        pst2 = strfind(spStr, '</Latitude>');
        coRoute(spIdx, 2) = str2double(spStr(pst1+10:pst2-1));
        coRoute(spIdx, 3) = k-1;
        coRoute(spIdx, 6) = linkList{k,5}/1.6;
        coRoute(spIdx, 7) = linkList{k,6};
        coRoute(spIdx, 9) = linkList{k,1}; % permanent ID
        coRoute(spIdx, 10) = linkList{k,4}; % functional class
    end
    if linkList{k,9}
        coRoute(spIdx, 8) = 1;
    end
end


%% get road type
coRoute(:,4) = 1; % mark all as local
pst = find(coRoute(:,10)<=1); % functional class <= 1
coRoute(pst,4) = 3; % freeway

try
    lkID = coRoute(pst(1)-1,3);
    pst2 = find(coRoute(:,3)==lkID);
    while coRoute(pst2(1)-1,6)==coRoute(pst2(1),6) && coRoute(pst2(1),6)<40
        pst2 = [find(coRoute(:,3)==coRoute(pst2(1)-1,3)); pst2];
    end
    coRoute(pst2,4) = 2; % enter-freeway ramp
end

for i=2:size(pst,1)
    if pst(i)-pst(i-1)>2
        coRoute(pst(i-1)+1:pst(i)-1,4) = 4; % iner-freeway ramp
    end
end

try
    lkID = coRoute(pst(end)+1,3);
    pst2 = find(coRoute(:,3)==lkID);
    coRoute(pst2,4) = 5; % exit-freeway ramp
end
