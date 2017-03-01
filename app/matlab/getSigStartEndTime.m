function [sigStartTime, sigEndTime] = getSigStartEndTime(sigParamsVector, ...
                                                            sigData)
    [~, timeIndex] = ismember({'Timestamp'; 'DateTime'}, sigParamsVector);
    timeColumn = timeIndex(0 ~= timeIndex);
    sigStartTimeString = sigData{1, timeColumn};
    sigEndTimeString = sigData{end, timeColumn};
    
    timeformat          = '[0-9]+:[0-9]+:[0-9]+.[0-9]+';
    sigStartTime = cell2mat(regexp(sigStartTimeString, timeformat, 'match'));
    sigEndTime = cell2mat(regexp(sigEndTimeString, timeformat, 'match'));
end