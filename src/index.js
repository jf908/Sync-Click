const WebSocket = require('ws');
const robot = require('robotjs');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'SyncClick>'
});

let mode = 'none';
let ws;

const commands = {
    host: (args) => {
        if(mode != 'none') {
            console.log('Connection is already setup');
            return;
        }
        mode = 'server';

        ws = new WebSocket.Server({port: args[1] || '7777'});
        ws.broadcast = data => {
            ws.clients.forEach(client => {
                client.send(data);
            });
		};
    },
    click: () => {
        if(mode != 'server') {
            console.log('You are not the host');
            return;
        }

        console.log('Clicking in 3 seconds...');
        setTimeout(() => {
            //Failsafe
            if(mode == 'server') {
                ws.broadcast('ply');
                robot.mouseClick();
            }
        }, 3000);
    },
    connect: (args) => {
        if(mode != 'none') {
            console.log('Connection is already setup');
            return;
        }
        mode = 'connecting';

        let ip = args[1];
        if(ip === undefined || ip === '') ip = 'localhost';
        if(!ip.includes(':')) ip += ':7777';

        ws = new WebSocket('http://'+ip);
        console.log('Attempting to connect...');

        ws.on('open', () => {
            console.log('Connection successful');
            mode = 'client';
        });

        ws.on('error', () => {
            console.log('Connection error');
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
    },
    exit: () => {
        if(mode != 'none') {
            ws.close();
        }
        rl.close();
    },
    help: () => {
        console.log('Type exit to stop sync click');
    }
};

rl.on('line', line => {
    const args = line.split(' ');
    if(commands[args[0]]) {
        commands[args[0]](args);
    } else {
        console.log('Unknown command');
    }
});

rl.on('SIGINT', () => {
    if(mode != 'none') {
        ws.close();
    }
});