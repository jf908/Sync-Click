const {ipcRenderer, remote} = require('electron');

// OVERLAY
let overlay = 'none';
function setOverlay(view) {
    if(view != 'none') {
        //On settings menu open
        document.getElementById(view).classList.remove('hidden');
        document.getElementById('overlay').classList.remove('hidden');
    } else if(overlay != 'none') {
        //On settings menu close
        document.getElementById(overlay).classList.add('hidden');
        document.getElementById('overlay').classList.add('hidden');

        if(portChanged) {
            portChanged = false;
            ipcRenderer.send('save', ['port', portEl.value]);
        }

        if(shortcutChanged) {
            shortcutChanged = false;
            ipcRenderer.send('save', ['shortcut', shortcutEl.textContent]);
        }
    }
    overlay = view;
}

// NETWORKING

ipcRenderer.on('mode', (s, m) => {
    setOverlay(m);
});
ipcRenderer.on('config', (s, config) => {
    portEl.value = config.port;
    shortcutEl.textContent = config.shortcut;
});

let connecting = false;
function client() {
    setOverlay('connecting');
    connecting = true;
    ipcRenderer.send('connect', getIP());
    ipcRenderer.on('connected', () => {
        if(connecting) {
            setOverlay('client');
            remote.getCurrentWindow().close();
        }
    });
}
function server() {
    setOverlay('server');
    ipcRenderer.send('server');
    remote.getCurrentWindow().close();
}

function stopClient() {
    setOverlay('none');
    ipcRenderer.send('stopClient');
}
function stopServer() {
    setOverlay('none');
    ipcRenderer.send('stopServer');
}
function stopConnecting() {
    setOverlay('none');
    connecting = false;
    ipcRenderer.send('stopClient');
}

function getIP() {
    let ip = document.getElementById('ip').value;
    if(ip === '') ip = 'localhost';
    if(!ip.includes(':')) ip += ':7777';
    return ip;
}

//Debug method
ipcRenderer.on('print', (e, m) => {
    console.log(m);
});