const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow} = electron;

let mainWindow;

// listen for app to be ready
app.on('ready', function(){
  // create new main window
  mainWindow = new BrowserWindow({});
  // load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'viewGrid.html'),
    protocol: 'file',
    slashes: true
  }));

  mainWindow.openDevTools();
});
