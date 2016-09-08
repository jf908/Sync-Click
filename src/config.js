const fs = require('fs');
const { app } = require('electron');
const EventEmitter = require('events');

class Config extends EventEmitter {
    constructor() {
        super();
        this.default = {
            port: 7777
        };
        this.path = `${app.getPath('userData')}/config.json`;
        this.loaded = false;

        this.loadFile();
    }

    loadFile() {
        fs.exists(this.path, exists => {
            if(exists) {
                fs.readFile(`${app.getPath('userData')}/config.json`, (err, data) => {
                    if(!err) {
                        this.config = this.parseJSON(data);
                        this.loaded = true;
                        this.emit('load');
                    } else {
                        this.config = {};
                        this.loaded = true;
                        this.emit('load');
                    }
                });
            } else {
                this.config = {};
                this.loaded = true;
                this.emit('load');
            }
        });
    }

    get(prop) {
        return this.config[prop] ? this.config[prop] : this.default[prop];
    }

    set(prop, value) {
        this.config[prop] = value;
        this.writeFile();
    }

    writeFile() {
        fs.writeFile(this.path, JSON.stringify(this.config));
    }

    parseJSON(str) {
        try {
            const json = JSON.parse(str);
            return json;
        } catch(e) {
            return {};
        }
    }
}

module.exports = new Config();