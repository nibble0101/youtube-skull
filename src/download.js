// const test = "https://www.youtube.com/watch?v=FUiu-cdu6mA";

const fs = require("fs");
const ytdl = require("ytdl-core");
const os = require("os");
const path = require("path");
const { ipcRenderer } = require("electron");

const downloadProgress = document.getElementById("download-progress");
const body = document.querySelector(".body");
const successMessage = "<p> Download successfull </p>";
const test = document.getElementById("test");

function getDirPath() {
  const dirPath = path.join(os.homedir(), "Downloads", "youtubeSkull");
  return dirPath;
}

function getFileName(name) {
  const nonWordChar = /[\W]/gim;
  return name.toLowerCase().replace(nonWordChar, "_");
}

async function createDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    return true;
  } catch (err) {
    return false;
  }
}

function validateURL(url) {
  const isValidUrl = ytdl.validateURL(url);
  return isValidUrl;
}

async function getVideoInfo(url) {
  const options = await ytdl.getInfo(url);
  return options;
}

function getDownloadProgress(progressArr) {
  return `${Math.floor((progressArr[1] / progressArr[2]) * 100)}`;
}

async function downloadVideo(url) {
  const videoInfo = await getVideoInfo(url);
  const dirPath = getDirPath();
  const dirCreated = await createDir(dirPath);
  const fileName = getFileName(videoInfo.videoDetails.title);
  const filePath = path.join(dirPath, `${fileName}.mp4`);
  if (!dirCreated) {
    throw new Error("An error has occurred");
  }

  const writeStream = fs.createWriteStream(filePath);
  const readStream = ytdl.downloadFromInfo(videoInfo);
  readStream.on("data", (chunk) => {
    writeStream.write(chunk);
  });
  readStream.on("progress", (...args) => {
    downloadProgress.setAttribute("value", `${getDownloadProgress(args)}`);
  });
  readStream.on("end", () => {
    body.innerHTML = successMessage;
  });
}


ipcRenderer.on("download-url", (event, url) => {
  downloadVideo(url);
});
