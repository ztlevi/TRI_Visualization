function OBDdata = getOBDdata(targetParams, OBDparams, fid)
    [~, targetIndex]  = ismember(targetParams, OBDparams);
    OBDallData = extractSigCSVdata(fid, OBDparams);
    OBDdata = OBDallData(:, targetIndex);
end
