"use strict";

const fs = remote.require('fs');
const { 
    BrowserWindow,
    dialog 
} = remote;

let inputArea = null;
let inputTxt = null;
let footerArea = null;

let currentPath = "";
let editor = null;

window.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    inputArea = document.getElementById('input_area');
    inputTxt = document.getElementById('input_txt');
    footerArea = document.getElementById('footer_fixed');

    editor = ace.edit('input_txt');
    editor.setTheme("ace/theme/dracula");
    editor.focus();
    editor.gotoLine(1);
    editor.renderer.setShowPrintMargin(false);

    setEditorTheme();

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    document.addEventListener("drop", (e) => {
        e.preventDefault();
    });

    inputArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    inputArea.addEventListener("dragleave", (e) => {
        e.preventDefault();
    });
    inputArea.addEventListener("dragend", (e) => {
        e.preventDefault();
    });
    inputArea.addEventListener("drop", (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        readFile(file.path);
    });

    document.querySelector("#btnLoad").addEventListener("click", () => {
        openLoadFile();
    });
    document.querySelector("#btnSave").addEventListener("click", () => {
        saveFile();
    });
    // メニュー制御
    menuOperation();
};

// メニューから制御
function menuOperation(){
    ipcRenderer.on("main_file_message", (event, arg) => {
        console.log(arg);
        if(arg){
            switch(arg){
                case "open":
                    openLoadFile();
                    break;
                case "save":
                    saveFile();
                    break;
                case "save_new_file":
                    saveNewFile();
                    break;
            }
        }
    })
}


function openLoadFile() {
    const win = BrowserWindow.getFocusedWindow();
    dialog.showOpenDialog(
        win,
        {
            properties: ["openFile"],
            filters: [
                {
                    name: "Documents",
                    extensions: ["*"]
                }
            ]
        }).then(result => {
            if(!result.canceled){
                readFile(result.filePaths[0]);
            }
        }).catch(err => {
            console.log(err)
        });
}

function readFile(path) {
    currentPath = path;
    fs.readFile(path, (error, text) =>{
        if(error != null){
            alert("error: " + error);
            return;
        }
        footerArea, innerHTML = path;
        editor.setValue(text.toString(), -1);
        setEditorTheme(path);
    });
}

function saveFile() {
    if(currentPath === ""){
        saveNewFile();
        return;
    }
    const win = BrowserWindow.getFocusedWindow();

    //FIXME このダイアログは微妙
    dialog.showMessageBox(win, {
        title: "ファイルの上書き保存を行います",
        type: "info",
        buttons: ["OK", "Cancel"],
        detail: "保存実行しますか？"
    }).then(result => {
        if(result.response === 0){
            const data = editor.getValue();
            writeFile(currentPath, data);
        }
    }).catch(err => {
        console.log(err);
    });
}

function writeFile(path, data){
    fs.writeFile(path, data, (err) => {
        if(err != null){
            alert("error: " + err);
        }else{
            setEditorTheme(path);
        }
    });
}

function saveNewFile() {
    const win = BrowserWindow.getFocusedWindow;
    dialog.showSaveDialog(
        win,
        {
            properties: ["openFile"],
            filters: [{
                name: "Documents",
                extensions: ["*"]
            }]
        }).then(result => {
            if(!result.canceled){
                const data = editor.getValue();
                currentPath = result.filePath;
                writeFile(currentPath, data);
            }
        }).catch(err => {
            console.log(err);
        });
}


function setEditorTheme(fileName = ""){
    const type = fileName.split(".");
    const ext = type[type.length - 1].toLowerCase();
    switch(ext) {
        case 'txt':
            editor.getSession().setMode('ace/mode/plain_text');
            break;
        case 'py':
            editor.getSession().setMode('ace/mode/python');
            break;
        case 'rb':
            editor.getSession().setMode('ace/mode/ruby');
            break;
        case 'c':
        case 'cpp':
        case 'h':
            editor.getSession().setMode('ace/mode/c_cpp');
            break
        case 'html':
            editor.getSession().setMode('ace/mode/html');
            break;
        case 'js':
            editor.getSession().setMode('ace/mode/javascript');
            break;
        case 'md':
            editor.getSession().setMode('ace/mode/markdown');
            break;
        default:
            editor.getSession().setMode('ace/mode/plain_text');
            break;
    }
}
