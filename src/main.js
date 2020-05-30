const {app, Menu, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow(){
    // ウィンドウ作成
    mainWindow  = new BrowserWindow(
        {
            width: 1024,
            height: 768,
            webPreferences: {
                preload: `${__dirname}/preload.js`,    // preloadを追加
                enableRemoteModule: true
            }
            // ウィンドウアイコン
            // "icon": __dirname + "/shimarin.ico"
        });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // メニュー表示
    const menu = Menu.buildFromTemplate(createMenu());
    Menu.setApplicationMenu(menu);

    // it enable developing tool
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 初期化完了
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(mainWindow === null) {
        createWindow();
    }
});

// メニューを配列でreturnする
function createMenu(){
    let m1 = {
        label: "ファイル",
        submenu: [
            {
                label: "開く",
                accelerator: "CmdOrCtrl+O",
                click: function(item, focusedWindow) {
                    if(focusedWindow){
                        focusedWindow.webContents.send("main_file_message", "open");
                    }
                }
            },
            {
                label: "保存",
                accelerator: "CmdOrCtrl+S",
                click: function(item, focusedWindow) {
                    if(focusedWindow){
                        focusedWindow.webContents.send("main_file_message", "save");
                    }
                }
            },
            {
                label: "名前を付けて保存",
                accelerator: "CmdOrCtrl+Shift+S",
                click: function(item, focusedWindow) {
                    if(focusedWindow){
                        focusedWindow.webContents.send("main_file_message", "save_new_file");
                    }
                }
            }
        ]
    };
    let m2 = {
        label: "編集",
        submenu: [
            {
                label: "やり直し",
                accelerator: "CmdOrCtrl+Z",
                role: "undo"
            },
            {
                label: "切り取り",
                accelerator: "CmdOrCtrl+X",
                role: "cut"
            },
            {
                label: "コピー",
                accelerator: "CmdOrCtrl+C",
                role: "copy"
            },
            {
                label: "貼り付け",
                accelerator: "CmdOrCtrl+V",
                role: "paste"
            }
        ]
    };
    let m3 = {
        label: "表示",
        submenu: [
            {
                label: "全画面表示",
                accelerator: (function(){
                    if(process.platform === "darwin"){
                        return "Ctrl+Command+F";
                    } else {
                        return "F11";
                    }
                })(),
                click: function(item, focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            },
            {
                label: "拡大",
                accelerator: "CmdOrCtrl+Shift+=",
                role: "zoomin"
            },
            {
                label: "縮小",
                accelerator: "CmdOrCtrl+Shift+-",
                role: "zoomout"
            },
            {
                label: "リセット",
                accelerator: "CmdOrCtrl+0",
                role: "resetzoom"
            }
        ]
    };
    return [m1, m2, m3];
}
