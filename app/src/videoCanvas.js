FastClick.attach(document.body)

// function frameConverter(video,canvas) {

//     // Set up our frame converter
//     this.video = video;
//     this.viewport = canvas.getContext("2d");
//     this.width = canvas.width;
//     this.height = canvas.height;
//     // Create the frame-buffer canvas
//     this.framebuffer = document.createElement("canvas");
//     this.framebuffer.width = this.width;
//     this.framebuffer.height = this.height;
//     this.ctx = this.framebuffer.getContext("2d");
//     // Default video effect is blur
//     this.effect = JSManipulate.blur;
//     // This variable used to pass ourself to event call-backs
//     var self = this;
//     // Start rendering when the video is playing
//     this.video.addEventListener("play", function() {
//         self.render();
//       }, false);
      
//     // Change the image effect to be applied  
//     this.setEffect = function(effect){
//       if(effect in JSManipulate){
//           this.effect = JSManipulate[effect];
//       }
//     }

//     // Rendering call-back
//     this.render = function() {
//         if (this.video.paused || this.video.ended) {
//           return;
//         }
//         this.renderFrame();
//         var self = this;
//         // Render every 10 ms
//         setTimeout(function () {
//             self.render();
//           }, 10);
//     };

//     // Compute and display the next frame 
//     this.renderFrame = function() {
//         // Acquire a video frame from the video element
//         this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth,
//                     this.video.videoHeight,0,0,this.width, this.height);
//         var data = this.ctx.getImageData(0, 0, this.width, this.height);
//         // Apply image effect
//         this.effect.filter(data,this.effect.defaultValues);
//         // Render to viewport
//         this.viewport.putImageData(data, 0, 0);
//     return;
//     };
// };

// // Initialization code
// video = document.getElementById("video-player");
// canvas = document.getElementById("canvas");
// fc = new frameConverter(video,canvas);

// // Change the image effect applied to the video
// fc.setEffect('edge detection');
