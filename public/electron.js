const { BrowserView, BrowserWindow, app, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 1200,
		height: 800,
		backgroundColor: 'white',
		center: true,
		// fullscreen: true,
		webPreferences: {
			nodeIntegration: false,
			nodeIntegrationInWorker: false,
			enableRemoteModule: false,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
			devTools: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	if (isDev) {
		// 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드
		win.loadURL('http://localhost:3000');
		win.webContents.openDevTools();
	} else {
		// 프로덕션 환경에서는 패키지 내부 리소스에 접근
		win.loadFile(path.join(__dirname, '../build/index.html'));
	}
}

/*
require('electron-reload')(__dirname, {
	electron: require(
		path.join(__dirname, '../node_modules', '.bin', 'electron')
	),
	// hardResetMethod: 'exit',
});
*/

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	app.quit();
});

ipcMain.handle('ping', (event, arg) => {
	const result = arg + ' -> arg_pong';
	return result;
});
