function sigData = extractSigCSVdata(fid, paramsVector)
    dataFormat = repmat('%s', 1, size(paramsVector, 2));
    testLine = fgetl(fid);
    testData = textscan(testLine, dataFormat, 'delimiter', ',');
    
    error = 0;
    for e = 1:size(paramsVector, 2) 
        if size(testData{1, e}, 1) > 1
            error = error + 1;
        end
    end
  
    dataFormat = [dataFormat, repmat('%s', 1, error)];
    temp = textscan(fid, dataFormat, 'delimiter', ',');
    sigData = cell(size(temp{1, 1}, 1), size(temp, 2));
    for i=1:size(paramsVector, 2)
        sigData(:, i) = temp{1, i};
    end
end