function [OBD_start_Date, OBD_start_Time] = getOBDstartDateTime(fid)
    dateformat = '[0-9]+/[0-9]+/[0-9]+';
    OBD_start_Date = [];
    timeformat = '[0-9]+:[0-9]+:[0-9]+ (PM|AM)';
    OBD_start_Time = [];
    lineText = fgetl(fid);
    
    while ~isequal(lineText, -1)
        reg_date = regexp(lineText, dateformat, 'match');
        reg_time = regexp(lineText, timeformat, 'match');
        if ~isempty(reg_date) && ~isempty(reg_time)
            OBD_start_Date = cell2mat(reg_date);
            OBD_start_Time = datestr(cell2mat(reg_time), 'HH:MM:SS.FFF');
            break;
        end
        lineText = fgetl(fid);
    end
end