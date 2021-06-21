const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let mainWindow;

/**
 * Create main window
 */

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    icon: path.join(__dirname, "public", "video-icon.png"),
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "public", "index.html"));

  //   Open DevTools for debugging
  // mainWindow.webContents.openDevTools()
}

/**
 * Create Modal
 * @param {number} width 
 * @param {number} height 
 * @param {BrowserWindow} parent 
 * @param {string} title 
 * @param {string} winPath 
 */

function addWindow(width, height, parent, title, winPath) {
  let newWindow = new BrowserWindow({
    width: width,
    height: height,
    parent: parent,
    title: title,
    modal: true,
    autoHideMenuBar: true,
  });
  newWindow.loadFile(winPath);
  newWindow.focus();
  newWindow.on("closed", () => {
    newWindow = null;
  });
}

/**
 * Create main window when app is ready
 */

app.whenReady().then(() => {
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * Exit app when all windows are closed except in macOS
 */

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.exit();
  }
});

// Create main menu

const menuTemplate = [
  {
    label: "About",
    click() {
      addWindow(
        400,
        200,
        mainWindow,
        "About Youtube skull",
        path.join(__dirname, "windows", "about.html")
      );
    },
  },
  { label: "License" ,
  click() {
    addWindow(
      400,
      200,
      mainWindow,
      "Software License",
      path.join(__dirname, "windows", "license.html")
    );
  },
    
  },
  { label: "Credits",
  click() {
    addWindow(
      400,
      200,
      mainWindow,
      "Credits",
      path.join(__dirname, "windows", "credits.html")
    );
  },
},
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
