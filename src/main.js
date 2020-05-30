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
            },
            {
                label: "保存",
            },
            {
                label: "名前を付けて保存"
            }
        ]
    };
    let m2 = {
        label: "編集",
        submenu: [
            {
                label: "やり直し",
            },
            {
                label: "切り取り",
            },
            {
                label: "コピー"
            },
            {
                label: "貼り付け"
            }
        ]
    };
    let m3 = {
        label: "表示",
        submenu: [
            {
                label: "全画面表示",
            },
            {
                label: "拡大",
            },
            {
                label: "縮小"
            },
            {
                label: "リセット"
            }
        ]
    };
    return [m1, m2, m3];
}
