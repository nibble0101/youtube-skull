const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "public", "index.html"));

  //   Open DevTools for debugging
  //   mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.exit();
  }
});

// Creating menu

const menuTemplate = [
  { label: "About" },
  { label: "License" },
  { label: "Credits" },
  {
    label: "Theme",
    submenu: [
      { label: "System", accelerator: "Alt +  S" },
      { label: "Light", accelerator: "Alt + L" },
      { label: "Dark", accelerator: "Alt  + D" },
      { label: "Black", accelerator: "Alt + B" },
    ],
  },
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
