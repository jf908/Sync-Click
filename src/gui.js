// ICONS
const Snap = require('snapsvg');

const s = Snap('#logo');
const path = s.path('M10,10 L30,30 L20,30 L24,38 L20,40 L16,32 L10,40 L10,10 L30,30').attr({stroke:'none', strokeWidth: 1.5, fill:'white'});
const matrix = new Snap.Matrix();
matrix.scale(2);
matrix.translate(21,12);
path.transform(matrix);

const arrow = s.polygon([0,0,5,0,0,5,0,0]).attr({fill: 'white'}).transform('r135');
const marker = arrow.marker(0,0,10,10,2.5,2.5).attr({markerHeight: 15});
const g = s.group(
s.path('M25,75 A50,50 0 0,1 115,45').attr({markerEnd: marker, fill:'none', stroke: 'white', strokeWidth: 5}),
s.path('M125,75 A50,50 0 0,1 35,105').attr({markerEnd: marker, fill:'none', stroke: 'white', strokeWidth: 5}));

g.animate({transform: 'r180 75 75'}, 5000, mina.elastic);
setInterval(() => {
    g.transform('r0 75 75');
    g.animate({transform: 'r180 75 75'}, 5000, mina.elastic);
}, 5000);

function Icon(s, paths, func) {
    let path = s.path(paths[0]).attr({strokeWidth:1.5, fill:'none', strokeLinecap:'square'});
    s.mouseover(() => {path.animate({d:paths[1]}, 150, mina.easein);});
    s.mouseout(() => {path.animate({d:paths[0]}, 150, mina.easein);});
    s.click(func);
}
Icon(Snap('#settings-open'), ['M10,8 L10,26 M16,8 L16,26 M22,8 L22,26 M8,12 L12,12 M14,16 L18,16 M20,20 L24,20',
'M10,8 L10,26 M16,8 L16,26 M22,8 L22,26 M8,20 L12,20 M14,10 L18,10 M20,16 L24,16'], () => {
    setOverlay('settings');
});
Icon(Snap('#settings-close'), ['M8,8 L24,24 M24,8 L8,24', 'M10,10 L22,22 M22,10 L10,22'], () => {
    setOverlay('none');
});

// SAVE IP ADDRESS
document.getElementById('ip').value = localStorage.getItem('ip');
document.getElementById('ip').addEventListener('change', e => {
    localStorage.setItem('ip', e.target.value);
});

//Port number element + listeners
let portChanged = false;
const portEl = document.getElementById('port');
portEl.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^\d]/,'');
    portChanged = true;
});

//Shortcut modifier
let shortcutChanged = false;
const shortcutEl = document.getElementById('shortcut');
shortcutEl.addEventListener('keydown', e => {
    let shortcut = '';

    //Letters + Numbers
    if((e.keyCode >= 65 && e.keyCode <= 90) ||
       (e.keyCode >= 48 && e.keyCode <= 57)) {
        shortcut = String.fromCharCode(e.keyCode);
    //F keys
    } else if((e.keyCode >= 112 && e.keyCode <= 135)) {
        shortcut = e.key;
    } else {
        const keys = {
            9: 'Tab',
            16: 'Shift',
            17: 'Ctrl',
            18: 'Alt',
            27: 'Esc',
            32: 'Space',
            37: 'Left',
            38: 'Up',
            39: 'Right',
            40: 'Down'
        };
        if(keys[e.keyCode]) {
            shortcut = keys[e.keyCode];
        }
    }

    if(shortcut == '') return;

    if(e.altKey && e.keyCode != 18) {
        shortcut = 'Alt+' + shortcut;
    }
    if(e.shiftKey && e.keyCode != 16) {
        shortcut = 'Shift+' + shortcut;
    }
    if(e.ctrlKey && e.keyCode != 17) {
        shortcut = 'Ctrl+' + shortcut;
    }
    if(e.metaKey && e.keyCode != 1) {
        shortcut = 'Super+' + shortcut;
    }
    e.target.textContent = shortcut;
    shortcutChanged = true;
});

//Default button
document.getElementById('default').addEventListener('click', () => {
    portChanged = true;
    shortcutChanged = true;
    portEl.value = '7777';
    shortcutEl.textContent = 'Ctrl+I';
})