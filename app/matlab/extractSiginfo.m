function signal = extractSiginfo(sigName, recordDataPath)
    sigFile = cell2mat(strcat(recordDataPath, '/', sigName, '.csv'));
    sigString =  cell2mat(sigName);
    switch sigString
        case 'OBD'
            signal = extractOBDinfo(sigFile);
        otherwise
            % open the signal file
            fid = fopen(sigFile);
            % read the first line of file containing the parameters of this
            % signal
            headerString = fgetl(fid);
            signal.params = getSigParamsHeader(headerString);
            % read the lines start and 2nd to the end which contains all
            % the data points
            signal.data = extractSigCSVdata(fid, signal.params);
            fclose(fid);
            [signal.startTime, signal.endTime] = getSigStartEndTime( ...
                                            signal.params, signal.data);
    end
    
    % for previous recorded data, GSRraw signal is 4 hours later than the
    % others because of the time format issue. (the following lines should
    % only be used for the previous recorded data. For more details, please
    % look into the data.
    if strcmp(sigString, 'GSRraw')
        signal.startTime = datenum(signal.startTime, 'HH:MM:SS.FFF');
        signal.startTime = addtodate(signal.startTime, 4, 'hour');
        signal.startTime = datestr(signal.startTime, 'HH:MM:SS.FFF');
        
        signal.endTime = datenum(signal.endTime, 'HH:MM:SS.FFF');
        signal.endTime = addtodate(signal.endTime, 4, 'hour');
        signal.endTime = datestr(signal.endTime, 'HH:MM:SS.FFF');
    end
end