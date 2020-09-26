# きのこ・たけのこにょきにょき対決!

## 内容

1. `kinotake_remote`フォルダ
	- サーバーの`arduinode-johnny-five.js`が入ってます。
2. `kinotakeproject`フォルダ
	- `enchant.js`とゲーム部分の`main2.js`があり、ゲームに使う画像や音が入ってます。

## 準備

1. Google Chromeをインストール
2. ArduinoIDEをインストール
	- firmataが入っていなかったら最新のものをインストール
3. node.jsをインストール
4. `npm install`コマンドで必要なライブラリをインストール
5. enchant.jsを公式サイトからダウンロードして、`enchant.js`ファイルを`kinotakeproject`フォルダに入れる
6. Arduinoの回路を組み、firmataライブラリーの`StandardFirmata`をArduinoに入れる

## 実行方法

1. ターミナルを立ち上げて、`kinotake_remote`フォルダの中の`arduinode-johnny-five.js`を`node`で実行
2. Google Chromeで [http://localhost:2929/](http://localhost:2929/) を開く

## 必要なソフトウェアとバージョン

|   ソフトウェア  |  バージョン  |
|:--------------|:-----------|
| Google Chrome | v60.0.3112 |
| ArduinoIDE    | v1.6.7     |
| node.js       | v8.0.0     |
| enchant.js    | v0.8.3     |
