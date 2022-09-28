const { app, BrowserWindow } = require('electron')
const electronReload = require('electron-reload')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 768,
		webPreferences: {
			nodeIntegration: true, // to allow require
			contextIsolation: false, // allow use with Electron 12+
		}
	})

	win.loadFile('index.html')
	win.webContents.openDevTools()
}

app.whenReady().then(() => {
	createWindow()

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') app.quit()
	})
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

