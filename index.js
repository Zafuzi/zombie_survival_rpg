const path = require("path");
const fs = require("fs");
const {
    app,
    BrowserWindow,
    screen,
    ipcMain,
} = require('electron');

var dev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

if (dev) {
    try {
        require('electron-reloader')(module);
    } catch (e) {
        console.log(e);
    }
}

let win;

function createWindow() {
    let displays = screen.getAllDisplays();
    let width = 1600;
    let height = 900;
    let x = (displays[0].bounds.width / 2) - width / 2;
    let y = (displays[0].bounds.height / 2) - height / 2;
    win = new BrowserWindow({
        width: width,
        height: height,
        x: x,
        y: y,
        resizable: false,
        title: "Game",
        autoHideMenuBar: true,
        backgroundColor: "#fff",
        fullscreenable: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
			allowRunningInsecureContent: false,
        },

    })

    win.loadFile('index.html')

    if (dev) {
        win.webContents.openDevTools()
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("ping", (evt, args) => {
    win.webContents.send("ping", "Electron says hello");
})
