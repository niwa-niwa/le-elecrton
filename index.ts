const electron = require("electron");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;

let mainWindow;
let settingsWindow;
let backgroundColor = "skyblue";

let menuTemplate = [
  {
    label: "MyApp",
    submenu: [
      {
        label: "About",
        accelerator: "CmdOrCtrl+Shift+A",
        click: function () {
          showAboutDialog();
        },
      },
      { type: "separator" },
      {
        label: "Settings",
        accelerator: "CmdOrCtrl+,",
        click: function () {
          showSettingsWindow();
        },
      },
      { label: "My menu" },
      { type: "separator" },
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+Q",
        click: function () {
          app.quit();
        },
      },
    ],
  },
];

let menu = Menu.buildFromTemplate(menuTemplate);

ipcMain.on("settings_changed", function (event, color) {
  mainWindow.webContents.send("set_bgcolor", color);
});

ipcMain.on("bgcolor_changed", function (event, color) {
  backgroundColor = color;
});

ipcMain.on("get_bgcolor", function (event) {
  event.returnValue = backgroundColor;
});

function showAboutDialog() {
  dialog.showMessageBox({
    type: "info",
    buttons: ["OK"],
    message: "About This App",
    detail: "This app was created by @niwa-niwa",
  });
}

function showSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  settingsWindow.loadURL("file://" + __dirname + "/settings.html");
  settingsWindow.show();
  settingsWindow.on("closed", function () {
    settingsWindow = null;
  });
}

function createMainWindow() {
  Menu.setApplicationMenu(menu);
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadURL("file://" + __dirname + "/index.html");
  // mainWindow.webContents.openDevTools();
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", function () {
  createMainWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createMainWindow();
  }
});
