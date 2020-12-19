// inside electron excel folder 
// create a main.js
// npm init -y => package.json file is created
// npm i electron
// in package.json file under scripts add "start":"electron ."

// electron logic

// object destructuring
const { app, BrowserWindow } = require('electron')


// const electron = require("electron");
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;


function createWindow () {
const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true // node enable
    }
  });

  win.loadFile('index.html').then(function(){
      win.maximize();
      win.webContents.openDevTools();
  })
}

app.whenReady().then(createWindow)
