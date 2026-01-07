const { contextBridge, ipcRenderer } = require('electron');

// レンダラープロセスに公開するAPI
contextBridge.exposeInMainWorld('electronAPI', {
  // アプリのデータ保存パスを取得
  getAppPath: () => ipcRenderer.invoke('get-app-path'),

  // プラットフォーム情報
  platform: process.platform,

  // 将来の拡張用
  // saveFile: (data) => ipcRenderer.invoke('save-file', data),
  // loadFile: () => ipcRenderer.invoke('load-file'),
});
