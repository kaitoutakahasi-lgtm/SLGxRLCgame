# Windows版ダウンロード

## ファイルの結合方法

### Windows (PowerShell)
```powershell
Get-Content idol-training-game-win.zip.part.* -AsByteStream -ReadCount 0 | Set-Content -Path idol-training-game-win.zip -AsByteStream
```

### Windows (コマンドプロンプト)
```cmd
copy /b idol-training-game-win.zip.part.aa+idol-training-game-win.zip.part.ab+idol-training-game-win.zip.part.ac idol-training-game-win.zip
```

### Linux/Mac
```bash
cat idol-training-game-win.zip.part.* > idol-training-game-win.zip
```

## 実行方法
1. ZIPを解凍
2. `win-unpacked/アイドル育成デッキ構築ゲーム.exe` を実行
