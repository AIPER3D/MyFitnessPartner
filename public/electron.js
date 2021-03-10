const { BrowserView, BrowserWindow, app } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		backgroundColor: 'white',
		center: true,
		fullscreen: true,
		webPreferences: {
			nodeIntegration: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
			devTools: true,
			nodeIntegrationInWorker: true,
		},
	});


	win.loadURL(
		isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
	);

	if (isDev) {
		win.webContents.openDevTools({ mode: 'detach' });
	}
}

require('electron-reload')(__dirname, {
	electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
	// hardResetMethod: 'exit',
});

app.whenReady().then(createWindow);
