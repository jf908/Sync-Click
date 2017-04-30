const package = require('./package.json');
const platform = process.platform;

let version = package.devDependencies['electron'];
version = version.startsWith('^') ? version.substr(1) : version;

let ignore = ['icon.icns'];
if(platform!='win32') ignore.push('icon.ico');
if(platform!='darwin') ignore.push('tray_mac.png');
if(platform!='linux') {
    ignore.push('icon.png');
    ignore.push('tray_linux.png');
}

const packager = require('electron-packager');
const options = {
    name: 'SyncClick',
    asar: true,
    platform: platform,
    arch: 'x64',
    dir: 'src',
    electronVersion: version,
    appVersion: package.version,
    out: './releases',
    overwrite: true,
    tmpdir: platform == 'darwin',
    icon: platform == 'win32' ? 'src/icon.ico' : (platform == 'darwin' ? 'src/icon.icns' : null ),
    ignore: ignore
};

packager(options, (err) => {
    console.log(err || 'Build successful!');
});