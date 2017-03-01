function generateJsonData(OBD_data)
OBD_json = '[';

for i = 1 : 100: size(OBD_data, 1)
OBD_json = [OBD_json '{"time": ' OBD_data{i, 1} ', "speed": ' ...
  OBD_data{i, 2} ', "frame_index": ' OBD_data{i, 3} ...
  ', "lati": ' OBD_data{i, 5} ', "longi": ' ...
  OBD_data{i, 4}, '},'];
end

% add the last row
OBD_json = [OBD_json '{"time": ' OBD_data{i, 1} ', "speed": ' ...
  OBD_data{i, 2} ', "frame_index": ' OBD_data{i, 3} ...
  ', "lati": ' OBD_data{i, 5} ', "longi": ' ...
  OBD_data{i, 4}, '}]'];

handle = fopen('./output/OBD.json', 'w');
fprintf(handle, OBD_json);
fclose(handle);
%
end