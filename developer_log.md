# Problem description

We want to develop a demo project for the ISL TRI project, which can play
the video and the trip data on the Google Maps synchronizedlly.

## Third-party libraries to use
* Electron
* Google-Maps node.js library
* some player library
* PostGIS

### requirement
1. The player library should be able to extact the frame index of the video
   (player API)
2. The Map should be updated every $t$ second, where $t < 1s$ (Google Map
   JavaScript API)
3. The link section should be highlighted when the driver is driving on it.
   (Google Map Javascript API)

### files
1. demo.js (main thread, data processing)
input signals:
   |__ ready: initlize player and map instance, display google map for the lab location. Initilzie a video payer intance and map client.
thread functions:
   |__ loadData(): load video data, load trip data, load link data
                    : send('video-opened', ...)
                    : send('gps-updated', ...)
                    : send('link-updated', ...)
  |__ playVideo(player): start the video player, start a timer, get the current frame recurrently? 
  |__ pausevideo(player): stop the video player, stop the timer
timer functions:
  |__ getCurrentFrame(player): caluate current gps point, calcuate current
  |__ calCurrentGPS():
  |__ calCurrentLink():

variables:
  - currentLink:
  - currentFrame:
  - currentGPS:
  - playerStatus:


2. renderer.js (Menus, video control buttons ...)
output events:
   |__ #open-video, on('click'): call demo.js to load video
   |__ #start-video, on('click'): call demo.js to play video
   |__ #pause-video, on('click'): call demo.js to stop playing video 
input signals:
   |__ ipcRenderer('video-opened'): enable play button
   |__ ipcRenderer('video-played'): enable stop button, disable play button
   |__ ipcRenderer('video-stoped'): enable play button, disable stop button
   |__ ipcRenderer('gps-updated'): draw the gps on the map
   |__ ipcRenderer('link-updated'): draw the link on the map
function:
   |__ displayGPS(Maps):
   |__ displayLink(Maps):
           
3. player.js

4. map.js
