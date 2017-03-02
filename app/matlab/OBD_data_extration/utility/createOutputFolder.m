function outputFolder = createOutputFolder(Output_Path, folderName)
    outputFolder = strcat(Output_Path, '/', folderName);
    mkdir_if_not_exist(outputFolder);
end