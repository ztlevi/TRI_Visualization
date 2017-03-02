function killTask(obj, event, desktopPath)
disp(['The ' num2str(obj.TasksExecuted) ...
            ' try to detect if the ADASRP has generate the output.'])

if(exist([desktopPath '/route.xml']))
    disp('ADASP gave the output');
    try
        dos('taskkill /f /im Route.exe');
    catch  ME
        % do nothing
        disp('timer error');
    end
    stop(obj);
    delete(obj);
else
    disp('ADASRP is still running...');
end
end