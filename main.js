const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let win

function createWindow() {
    win = new BrowserWindow({
        width: 1366,
        height: 768,
        minWidth: 1030,
        minHeight: 825,
        resizable: true,
        icon: path.join(__dirname, 'build/icon.icns')
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}
app.on('ready', createWindow)

function setMainMenu() {
    let template = [
        {
            label: 'View',
            submenu: [
                {
                    role: 'reload'
                },
                {
                    role: 'toggledevtools'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'resetzoom'
                },
                {
                    type: 'separator'
                }
            ]
        },
        {
            role: 'window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        const name = config.windowtitle;
        template.unshift({
            label: name,
            submenu: [{
                label: 'About ${name}',
                role: 'about'
            }, {
                type: 'separator'
            }, {
                type: 'separator'
            }, {
                label: 'Hide ${name}',
                accelerator: 'Command+H',
                role: 'hide'
            }, {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            }, {
                label: 'Show All',
                role: 'unhide'
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function () {
                    app.quit()
                }
            }]
        })

        addUpdateMenuItems(template[0].submenu, 1)
    }
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}