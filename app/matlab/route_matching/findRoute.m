function [coRoute,linkList,TMCnames,indicator,viaPoints]=findRoute(trip,desktopPath)
%##########################################################################
%Description: This function is find the coRoute and linkList from a 
%             recorded trips
%
%Input:
%       tirp: Ford recorded trip, .mat file
%       desktopPath: The desktop path of the user, who open the ADASRP
%       software.

%Output:
%       coRoute:
%       -------------------------------------------------------------------
%       1:Longitude | 2:Latitude | 3:Numerical link ID | 4:road type | 5:?
%       6:ExpectedSpeed(mph) | 7:lane number | 8:Traffic light(0:NO 1:Yes)
%       9:Permenant link ID | 10:FC
%       -------------------------------------------------------------------
%
%       linkList:
%       -------------------------------------------------------------------
%       1:linkID | 2:linkID(Hex) | 3:RoadName
%       4:FC(0~4)(function class,4 is local;0 is major intercity highways;)
%       5:ExpectedSpeed(kmh) | 6:lane number | 7:Height | 8:Length
%       9:Traffic light
%       -------------------------------------------------------------------
%       
%       TMCnames: TMC code of each link in the linkList.
%       
%       indicator:
%       -------------------------------------------------------------------
%       0:Trip is too short or ..., can not be used
%       1:find the co-route successfully.
%       2: calling ADASRP fordPluin has problem
%       3: Cannot find match route


%Author: Xipeng Wang
%Contact: xipengw1990@gmail.com
%Date: 08/20/2014
%#########################################################################

%% Initialize globle variables
pointOutlierThreshold=40;   % threshold of outlier points
loopCnt = 1;
maxLoopCnt = 0;             % maximum loop times
viaPoints = [];             % list of via points
viaPointsLocation = [];     % list of locations of via points

%% Check trip data
% check and filter out the trip data whose data point is less than 500
if(length(trip.Location.Time)<500)
    indicator = 0;                      % a kind of FLAG
    coRoute=[];linkList=[];TMCnames=[];
    return;
end
% check and filter out the point whose recorded time less than 10 minutes
if((trip.Location.Time(end))<10*60)
    indicator = 0;
    coRoute=[];linkList=[];TMCnames=[];
    return;
end

%% Pre-process trip, filter our low speed point
speedThrehold = 3;
tempIdx = (trip.Movement.GPSSpeed > speedThrehold);
% tripTrace is the list contains all points that will be used in this trip
% data
tripTrace = [trip.Location.Latitude(tempIdx), ...
             trip.Location.Longitude(tempIdx)];

%%
% [tempIdx,tempValue] = min(find(trip.Accuracy.Accuracy(tempIdx) == 0));
% tripTrace = [tripTrace(1,:);tripTrace(tempIdx:end,:)];

% debug code
%tripTrace(1:30,:) = [];
%

desktopPath = 'C:/Users/ruiruil/Desktop';

%% Generate the coRoute
Origin = [tripTrace(1,1),tripTrace(1,2)];      % Geoposition of Origin
Dest = [tripTrace(end,1),tripTrace(end,2)];    % Geoposition of Destination         

% Initialize the list of via point. Every 150 point, chose a via point
for i = 50:150:length(tripTrace);      
    viaPoints = [viaPoints;tripTrace(i,1),tripTrace(i,2)];
    viaPointsLocation = [viaPointsLocation;i];  % take down the point index
end

pointsVector = [Origin; Dest; viaPoints];     % input to the ADASRP .bat

desktopPath = [desktopPath, '/'];
%----------------------------------------------------------------------

% The reason why we use timer is because when we use ADASRP to generate
% a prediction result using .exef file 'Route.exe', after the output
% given, the process of 'Route.exe' isn't terminated. We have to
% terminated by our program otherwise we can not generate the next
% result.

% Solution: examine if the output file already created in the desktop
% every 10 seconds.
t = timer;
% 'TimerFcn': the function callback by timer every execution.
t.TimerFcn = {@killTask, desktopPath};
% 'Peroid': the number of seconds timer waits between executions of
% 'TimerFcn'
t.Period = 30;
t.StartDelay = 10;

% 'TaskToExecute': run the TimerFcn totally 20 times
% Here is a bug for 'TasksToexecute':
% we can not define the magic number of 'TaskToExecute', user may need
% to change the value according to the performance of his own machine.
t.TasksToExecute = 10;
t.ObjectVisibility = 'on';
% 'ExecutionMode': define how the timer object schedules timer events.
% 'fixedRate': Starts immediately after the timer callback function
%   is added to the MATLAB execution queue
t.ExecutionMode = 'fixedRate';

% for more details, please visit the following website:
%   http://www.mathworks.com/help/matlab/ref/timer-class.html

start(t);

tStart = cputime;
tempFlag = callADASRPbyViaPoints(pointsVector); % call ADASRP and get return
predictedRouteInfo.computational_time = num2str(cputime - tStart); 
disp(['Computational time: ', num2str(cputime - tStart)]);

try
    stop(t);
    delete(t);
catch ME
end

isSuccessful = 0;

while(~isSuccessful)
    [isSuccessful, ~] = movefile([desktopPath 'route.xml'], ...
                    [desktopPath 'PredictionResults/route.xml']);
end

if(tempFlag == 0)
    % Must have something wrong. Change FLAG indicator to 2
    indicator = 2;
    coRoute = []; linkList = []; TMCnames = [];
    return;
else
    % A .xml file is created in the desktop by ADASRP, that the reason why
    % desktop path is important.
    % routeXML parser used to parser the xml file to extract the data into
    % a specific format that will be used in the following analysis
    [coRoute, TMCnames, linkList] = routeXMLparser([desktopPath 'PredictionResults/route.xml']);
    indicator = 1;
    return

end

end





