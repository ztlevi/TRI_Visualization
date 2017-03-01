function Headers = getSigParamsHeader(headerString)
    Headers = strsplit(headerString, ',');
    emptyPosition = cellfun(@isempty,Headers);
    Headers = Headers(~emptyPosition);
end
