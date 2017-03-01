function OBD = extractOBDinfo(OBD_filepath)

    [~, file_name, ~] = fileparts(OBD_filepath);
    fid = fopen(OBD_filepath);
    OBD.dataRate = 100;
    [OBD.startDate, OBD.startTime] = getOBDstartDateTime(fid);
    OBD.initLocation = getOBDinitLocation(fid);
    headerString = fgetl(fid);
    OBD.params = getSigParamsHeader(headerString);
    OBD.targetParams = {'time [s]', 'speed [mph]', 'Video frame [-]', ...
      'GPS long [degs]', 'GPS lat [degs]'};
    OBD.data = getOBDdata(OBD.targetParams, OBD.params, fid);
    fclose(fid);
   
%   numSeconds = floor(str2num(OBD.data{end, 1}));
    numSeconds = floor(size(OBD.data, 1) / 100);
    numMilliseconds = round(mod(str2num(OBD.data{end, 1}) * 100, 100));
    
    
    OBD.endTime = addtodate(datenum([OBD.startDate, ' ', OBD.startTime], ...
        'mm/dd/yyyy HH:MM:SS.FFF'), numSeconds, 'second');
    OBD.endTime = addtodate(OBD.endTime, numMilliseconds, 'millisecond');
    OBD.endTime = datestr(OBD.endTime, 'HH:MM:SS.FFF');
    
    save(['./output/' file_name '.mat'], 'OBD');
    
    % generateJsonData(OBD.data);
end