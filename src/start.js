const { app, BrowserWindow, ipcMain, Tray, nativeImage } = require("electron");

const path = require("path");
const url = require("url");
const base64Icon = require("./icons/base64-icon");

let tray;
let window;

app.on("ready", () => {
  // Setup the menubar with an icon
  let icon = nativeImage.createFromDataURL(base64Icon);
  tray = new Tray(icon);

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on("click", function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: "detach" });
    }
  });

  window = new BrowserWindow({
    width: 300,
    height: 350,
    show: false,
    frame: false,
    resizable: false
  });

  window.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, "/../build/index.html"),
        protocol: "file:",
        slashes: true
      })
  );

  // Only close the window on blur if dev tools isn't opened
  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  // window.on("closed", () => {
  //   window = null;
  // });
});

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = window.getBounds();
  let x,
    y = 0;
  if (process.platform == "darwin") {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  window.setPosition(x, y, false);
  window.show();
  window.focus();
};

ipcMain.on("show-window", () => {
  showWindow();
});

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});
