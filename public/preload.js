const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	spawn: require('child_process').spawn,
	fs: require('fs'),
	ping: (callback) => {
		ipcRenderer.invoke('ping', 'arg_ping').then((result) => {
			callback(result);
		});
	},
});
