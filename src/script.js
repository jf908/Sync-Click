const {ipcRenderer, remote} = require('electron');

// NETWORKING

ipcRenderer.on('mode', (s, m) => {
    setOverlay(m);
});
ipcRenderer.on('config', (s, port) => {
    portEl.value = port;
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

//Port number element + listeners
const portEl = document.getElementById('port');
portEl.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^\d]/,'');
});
portEl.addEventListener('change', e => {
    ipcRenderer.send('save', ['port', e.target.value]);
});