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
    
    % save data every 1s
    OBD.endTime = addtodate(datenum([OBD.startDate, ' ', OBD.startTime], ...
        'mm/dd/yyyy HH:MM:SS.FFF'), numSeconds, 'second');
    OBD.endTime = addtodate(OBD.endTime, numMilliseconds, 'millisecond');
    OBD.endTime = datestr(OBD.endTime, 'HH:MM:SS.FFF');
    
    temp = zeros(floor(size(OBD.data, 1) / OBD.dataRate), size(OBD.data, 2));
    for i = 1 : size(temp, 1)
        for j = 1 : size(temp, 2)
            temp(i,j) = str2num(cell2mat( ...
                OBD.data((i - 1) * OBD.dataRate + 1, j)));
        end 
    end
    
    OBD.data = temp;
    
    save(['./output/' file_name '.mat'], 'OBD');
end