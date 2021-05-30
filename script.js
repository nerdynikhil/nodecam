let video = document.querySelector("video");
let VidBtn = document.querySelector("button");
let constraints = { video: true, audio: true };
let mediaRecorder;
let isRecording = false;
let chunks = [];

VidBtn.addEventListener("click", function () {
  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    VidBtn.innerText = "Record";
  } else {
    mediaRecorder.start();
    isRecording = true;
    VidBtn.innerText = "Recording...";
  }
});

navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
  video.srcObject = mediaStream;
  let options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(mediaStream, options);

  mediaRecorder.addEventListener("dataavailable", function (e) {
    chunks.push(e.data);
  });

  mediaRecorder.addEventListener("stop", function () {
    let blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "video.mp4";
    a.click();
    a.remove();
  });
});
