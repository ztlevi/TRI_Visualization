function num_folder = getFolderNumber(Data_Path)
    fd_list = dir(Data_Path);
    num_folder = 0;

    for i = 1:size(fd_list,1)
        stuct = fd_list(i,1);
        if (stuct.isdir == 1)
            num_folder = num_folder + 1;
        end
    end

    num_folder = num_folder - 2;    % ignore './' and '../'
end