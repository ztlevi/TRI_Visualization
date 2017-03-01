function initLocation = getOBDinitLocation(fid)
    locationformat = '[0-9]+.[0-9]+';
    lineText = fgetl(fid);
    initLocation.Latitude = cell2mat(regexp(lineText, locationformat, 'match'));
    lineText = fgetl(fid);
    initLocation.Longitude = cell2mat(regexp(lineText, locationformat, 'match'));
end