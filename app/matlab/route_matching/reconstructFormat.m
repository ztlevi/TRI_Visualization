%#########################################################################
%Description: This program is used to generate route information from a
%             recorded trip in csv format.
%Author: Ruirui Liu
%Contact: ruiruil@umich.edu
%Copyright: University of Michigan Dearborn
%Date: 2/01/2017
%#########################################################################

%% Initial parameters
clear;clc;clear all;close all;clc
filename='synchronized_data_YuanMa_trip1';
tripData=readtable([filename '.csv']);
log = table2array(tripData(:,19));                  % get a list of points' lognitude
lat = table2array(tripData(:,20));                   % get a list of points' latitude
if(length(log)~=length(lat))                    % ignore the trip data where the size of lognitude is not equal to that of latitude
    return;
else
    trip.Location.Longitude=table2array(tripData(:,19));
    trip.Location.Latitude=table2array(tripData(:,20));
    trip.Location.Time=table2array(tripData(:,1));
    trip.Movement.GPSSpeed=round(table2array(tripData(:,18)));
    %%
    [coRoute,linkList,TMCnames,indicator,viaPoints] = findRoute(trip,'C:\Users\ruiruil\Desktop\');
    %%
    log = trip.Location.Longitude;
    lat = trip.Location.Latitude;
    kmlGen('route', coRoute);
    rdType = ones(size(log));
    speed = zeros(size(log));
    rdType = ones(size(log));
    %speed = double(trip.Movement.GPSSpeed);
    %rdType(speed>45) = 3;
    %rdType(speed<=45) =1;
    tripRoute = [log,lat,speed,rdType];
    kmlGen('trip',tripRoute);
    %%
    h=figure(1);
    %%
    hold on;
    plot(coRoute(:,1),coRoute(:,2),'*r');
    
    plot(tripRoute(:,1),tripRoute(:,2));
    plot(tripRoute(1,1),tripRoute(1,2),'ok');
    plot(viaPoints(:,2),viaPoints(:,1),'*g');
    legend('CoRoute','Recorded Trip');
    xlabel('longitude');
    ylabel('latitude');
    plot_google_map;
    %%
    save(['./saveData/' filename '.mat'],'coRoute','linkList','TMCnames','trip');
    saveas(h,['./saveData/' filename '.fig']);
end
%%
