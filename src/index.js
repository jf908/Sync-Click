const {app, BrowserWindow, Menu, Tray, ipcMain, globalShortcut} = require('electron');
const config = require('./config');

let win;
let tray = null;
let mode = 'none';
const icon = process.platform == 'linux' ? `${__dirname}/icon.png` : undefined;
const height = process.platform == 'win32' ? 500 : process.platform == 'darwin' ? 480 : 460;

function createWindow() {
	win = new BrowserWindow({
		width: 320,
		height: height,
		icon: icon,
		resizable: false
	});
	win.setMenu(null);
	win.loadURL(`file://${__dirname}/index.html`);
	win.webContents.on('did-finish-load', () => {
		win.webContents.send('mode', mode);
		win.webContents.send('config', config.get('port'));
	});
	//win.webContents.openDevTools();

	win.on('closed', function() {
		win = null;
	});
}

//If this listener isn't here then app quits after closing the window
app.on('window-all-closed', () => {});

app.on('ready', function() {
	if(config.loaded) {
		createWindow();
	} else {
		config.once('load', createWindow);
	}

	//Initilize tray
	const image = process.platform == 'win32' ? 'icon.ico' : (process.platform == 'darwin' ? 'tray_mac.png' : 'tray_linux.png' );
	tray = new Tray(`${__dirname}/${image}`);
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Show', click() {
			if(win) {
				win.show();
			} else {
				createWindow();
			}
		}},
		{label: 'Quit', click() {
			app.quit();
		}}
	]);
	tray.on('click', () => {
		if(win) {
			win.show();
		} else {
			createWindow();
		}
	});
	tray.setToolTip('Sync Click');
	tray.setContextMenu(contextMenu);
});

const robot = require('robotjs');
const WebSocket = require('ws');

let wss;
ipcMain.on('server', () => {
    if(mode != 'none') return;
	mode = 'server';

	wss = new WebSocket.Server({port: config.get('port')});

	wss.broadcast = (data) => {
		wss.clients.forEach((client) => {
			client.send(data);
		});
	};

	globalShortcut.register('CommandOrControl+I', () => {
		wss.broadcast('ply');
		robot.mouseClick();
	});
});
ipcMain.on('stopServer', () => {
	if(mode != 'server') return;
	wss.close();
	globalShortcut.unregisterAll();

	mode = 'none';
});

let ws;
ipcMain.on('connect', (sender, ip) => {
	if(mode != 'none') return;
	mode = 'connecting';

	ws = new WebSocket('http://'+ip);

	ws.on('open', () => {
		mode = 'client';
		if(win) {
			win.webContents.send('connected');
		}
	});

	ws.on('error', () => {
		ws.close();
		mode = 'none';
	});

	ws.on('message', (data) => {
		if(data=='ply') {
			robot.mouseClick();
		}
	});

	ws.on('close', () => {
		mode = 'none';
	});
});

ipcMain.on('stopClient', () => {
	if(mode=='client' || mode=='connecting') {
		ws.close();
		mode = 'none';
	}
});

ipcMain.on('save', (sender, data) => {
	config.set(data[0], data[1]);
});