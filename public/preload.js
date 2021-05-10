const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	fs: require('fs'),
	ping: (callback) => {
		ipcRenderer.invoke('ping', 'arg_ping').then((result) => {
			callback(result);
		});
	},
	ipcRenderer: ipcRenderer,
	require: require,
});
