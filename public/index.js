const  { ipcRenderer } = require("electron");
const { validateURL } = require("ytdl-core");

const form = document.getElementById("form");
const videoBtn = document.getElementById("video-btn");
const audioBtn = document.getElementById("audio-btn");

let downloadVideo = true;

function clearUrlInput() {
  const url = document.getElementById("url");
  url.value = "";
}

videoBtn.addEventListener("click", () => {
  if (!videoBtn.classList.contains("active--btn")) {
    videoBtn.classList.add("active--btn");
    downloadVideo = true;
  }
  if (audioBtn.classList.contains("active--btn")) {
    audioBtn.classList.remove("active--btn");
  }
});

audioBtn.addEventListener("click", () => {
  if (!audioBtn.classList.contains("active--btn")) {
    audioBtn.classList.add("active--btn");
    downloadVideo = false;
  }
  if (videoBtn.classList.contains("active--btn")) {
    videoBtn.classList.remove("active--btn");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { value } = document.getElementById("url");

  if (!value.trim() || !validateURL(value.trim())) {
    alert("Please enter valid Youtube URL");
    return;
  }
  const userSelection = downloadVideo ? "video" : "audio"
  ipcRenderer.send("start-download", value.trim(), userSelection);
});
