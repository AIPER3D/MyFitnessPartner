const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
    const win = new BrowserWindow({
        width:1600,
        height:900
    });

    // 파일 경로
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    // 윈도우 실행
    win.loadURL(startUrl);

}

app.on('ready', createWindow);