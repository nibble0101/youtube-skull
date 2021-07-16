// const test = "https://www.youtube.com/watch?v=FUiu-cdu6mA";

const fs = require("fs");
const ytdl = require("ytdl-core");
const os = require("os");
const path = require("path");
const { ipcRenderer } = require("electron");

const progressElement = document.getElementById("download-progress");
const rootElement = document.getElementById("root");
const progressPercent = document.getElementById("progress-percent");

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

async function getVideoInfo(url) {
  try {
    const options = await ytdl.getInfo(url);
    return options;
  } catch (err) {
    console.log("An error has occurred");
  }
}

function getDownloadProgress(progressArr) {
  return `${Math.floor((progressArr[1] / progressArr[2]) * 100)}`;
}

async function downloadVideo(url, userSelection) {
  const videoInfo = await getVideoInfo(url);
  const dirPath = getDirPath();
  const dirCreated = await createDir(dirPath);
  const fileName = getFileName(videoInfo.videoDetails.title);

  if (!dirCreated) {
    throw new Error("Failed to create directory");
  }

  let filePath, audioOptions;
  if (userSelection === "video") {
    filePath = path.join(dirPath, `${fileName}.mp4`);
  } else {
    audioOptions = {
      quality: "highestaudio",
      filter: "audioonly",
    };
    const options = ytdl.chooseFormat(videoInfo.formats, audioOptions);
    console.log(options);
    filePath = path.join(dirPath, `${fileName}.${options.container}`);
  }
  console.log(filePath);
  const writeStream = fs.createWriteStream(filePath);
  const readStream = (readStream = ytdl.downloadFromInfo(
    videoInfo,
    audioOptions
  ));

  readStream.on("data", (chunk) => {
    writeStream.write(chunk);
  });
  readStream.on("progress", (...args) => {
    const downloadProgress = getDownloadProgress(args);
    progressElement.setAttribute("value", `${downloadProgress}`);
    progressPercent.innerText = `${downloadProgress}%`;
  });
  readStream.on("end", () => {
    rootElement.innerHTML = "<p> Download successfull </p>";
  });
}

ipcRenderer.on("download-url", (event, url, userSelection) => {
  downloadVideo(url, userSelection);
});
