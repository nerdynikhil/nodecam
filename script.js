let video = document.querySelector("video");
let vidBtn = document.querySelector("button#record");
let body = document.querySelector("body");
let capBtn = document.querySelector("button#capture");
let filters = document.querySelectorAll(".filter");
let zoomin = document.querySelector(".zoom-in");
let zoomout = document.querySelector(".zoom-out");
let constraints = { video: true, audio: false };
let mediaRecorder;
let isRecording = false;
let chunks = [];

let minzoom = 1;
let maxzoom = 3;
let currzoom = 1;
let filter = "";

for (let i = 0; i < filters.length; i++) {
  filters[i].addEventListener("click", function (e) {
    filter = e.currentTarget.style.backgroundColor;
    removefilter();
    applyfilter(filter);
  });
}
zoomin.addEventListener("click", function () {
  let videocurrscale = video.style.transform.split("(")[1].split(")")[0];
  if (videocurrscale > maxzoom) {
    return;
  } else {
    currzoom = Number(videocurrscale) + 0.1;
    video.style.transform = `scale(${currzoom})`;
  }
});
zoomout.addEventListener("click", function () {
  if (currzoom > minzoom) {
    currzoom -= 0.1;
    video.style.transform = `scale(${currzoom})`;
  }
});
vidBtn.addEventListener("click", function () {
  let innerDiv = vidBtn.querySelector("div");

  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    innerDiv.classList.remove("record-animation");
  } else {
    mediaRecorder.start();
    filter = "";
    removefilter();
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

  ctx.translate(c.width / 2, c.height / 2);
  ctx.scale(currzoom, currzoom);
  ctx.translate(-c.width / 2, -c.height / 2);

  ctx.drawImage(video, 0, 0);
  if (filter != "") {
    ctx.fillStyle = filter;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  let a = document.createElement("a");
  a.download = "image.jpg";
  a.href = c.toDataURL();
  a.click();
  a.remove();
}
function applyfilter(filterColor) {
  let filterdiv = document.createElement("div");
  filterdiv.classList.add("filter-div");
  filterdiv.style.backgroundColor = filterColor;
  body.appendChild(filterdiv);
}
function removefilter() {
  let filterdiv = document.querySelector(".filter-div");
  if (filterdiv) filterdiv.remove();
}
