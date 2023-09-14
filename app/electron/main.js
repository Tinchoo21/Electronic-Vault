const server = require('../src/server/server')

const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");


const createWin = () => {
    let window = new BrowserWindow({
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },


        icon: 'app/src/server/images/bamcardlogo.png'
    });

    window.maximize();
    // window.removeMenu();
    window.loadURL('http://localhost:3000');



    ipcMain.on('message-from-client', (event, arg) => {
        console.log(arg);
    });

}


app.whenReady().then(() => {

    createWin();
});