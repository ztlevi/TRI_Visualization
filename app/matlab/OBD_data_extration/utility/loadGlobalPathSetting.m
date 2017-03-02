function [Home_Path, Data_Path, Output_Path] = loadGlobalPathSetting(configFile)

    ini = IniConfig();
    ini.ReadFile(configFile);

    Home_Path = ini.GetValues('Global Path Setting', 'HOME_PATH');
    Data_Path = strcat(ini.GetValues('Global Path Setting', 'DATA_PATH'), ...
    '/', ini.GetValues('Driver Dataset Path', 'DATA_PATH'));

    Output_Path = strcat(ini.GetValues('Global Path Setting', 'OUTPUT_PATH'), ...
    '/', ini.GetValues('Driver Dataset Path', 'DATA_PATH'));

end