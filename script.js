let video = document.querySelector("video");
let vidBtn = document.querySelector("button#record");
let capBtn = document.querySelector("button#capture");
let body = document.querySelector("body");
let filters = document.querySelectorAll(".filters");
let constraints = { video: true, audio: true };
let mediaRecorder;
let isRecording = false;
let chunks = [];

let filter = "";

for (let i = 0;i<filters.length;i++){
    filters[i].addEventListener("click", function(e){
        filter = e.currentTarget.style.backgroundColor;
        removeFilter();
        applyFilter(filter);
    });
}

vidBtn.addEventListener("click", function () {
  let innerDiv = vidBtn.querySelector("div");

  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    innerDiv.classList.remove("record-animation");
  } else {
    mediaRecorder.start();
    filter = "";
    removeFilter();
    isRecording = true;
    innerDiv.classList.add("record-animation");
  }
});

capBtn.addEventListener("click", function () {
  let innerDiv = capBtn.querySelector("div");
  innerDiv.classList.add("capture-animation");
  setTimeout(function () {
    innerDiv.classList.remove("capture-animation");
  }, 500);
  capture();
});

navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
  video.srcObject = mediaStream;

  mediaRecorder = new MediaRecorder(mediaStream);

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

function capture() {
  let c = document.createElement("canvas");
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  let ctx = c.getContext("2d");
  ctx.drawImage(video, 0, 0);
  if (filter != ""){
    ctx.fillStyle= filter;
    ctx.fillRect(0,0,c.width,c.height);
  }
  let a = document.createElement("a");
  a.download = "image.jpg";
  a.href = c.toDataURL();
  a.click();
  a.remove();
}

function applyFilter(filterColor){
    let filterDiv= document.createElement("div");
    filterDiv.classList.add("filter-div");
    filterDiv.style.backgroundColor = filterColor;
    body.appendChild(filterDiv);

}

function removeFilter(){
    let filterDiv = document.querySelector(".filter-div");
    if (filterDiv)
    filterDiv.remove();
}