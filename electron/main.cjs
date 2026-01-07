const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 開発モードかどうか
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    title: 'アイドル育成デッキ構築ゲーム',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    // ゲームらしい見た目に
    frame: true,
    backgroundColor: '#1e293b',
    show: false, // 準備完了まで非表示
  });

  // 開発時はVite dev server、本番時はビルド済みファイル
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 準備完了で表示（チラつき防止）
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// アプリ起動時
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 全ウィンドウ閉じたら終了（macOS以外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC通信（将来のファイルアクセス等に使用）
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});
