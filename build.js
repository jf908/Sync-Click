const package = require('./package.json');

let version = package.devDependencies['electron'];
version = version.startsWith('^') ? version.substr(1) : version;

let ignore = ['icon.icns'];
if(process.platform!='win32') ignore.push('icon.ico');
if(process.platform!='darwin') ignore.push('tray_mac.png');
if(process.platform!='linux') {
    ignore.push('icon.png');
    ignore.push('tray_linux.png');
}

const packager = require('electron-packager');
const options = {
    name: 'SyncClick',
    asar: true,
    platform: process.platform,
    arch: 'x64',
    dir: 'src',
    electronVersion: version,
    appVersion: package.version,
    out: './releases',
    overwrite: true,
    tmpdir: false,
    icon: process.platform == 'win32' ? 'src/icon.ico' : (process.platform == 'darwin' ? 'src/icon.icns' : null ),
    ignore: ignore
};

packager(options, (err) => {
    console.log(err || 'Build successful!');
});