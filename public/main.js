const {BrowserView, BrowserWindow, app} = require('electron');
const { exit } = require('node:process');
const path = require('path');

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		backgroundColor: 'white',
		webPreferences: {
			nodeIntegration: false,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
		},
	});

	win.webContents.openDevTools();
	win.loadFile('index.html');
}

// require('electron-reload')(__dirname, {
// 	electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
// 	// hardResetMethod: 'exit',
// });

app.whenReady().then(createWindow);
