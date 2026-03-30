'use strict';

{
  const searchBtn = document.getElementById('search-btn');// 検索ボタン
  const resultBody = document.getElementById('result-body');// 結果を表示する表の本体
  const zipDisplayTop = document.getElementById('zip-display');// 上の「郵便番号：」
  const zipDisplayBottom = document.getElementById('zip-display-bottom'); // 下の「郵便番号：」
  const zipInput = document.getElementById('zipcode');// 入力欄そのもの

  const searchCache = {}; // 空のオブジェクト。検索結果をここに溜めていきます。
  //表示を更新するための専用の関数（命令）
  const updateStatus = (text) => {
    // (text = '') は「もし中身を指定しなかったら空っぽにする」という初期設定。
    // これにより、リセット時に何も入れずに呼び出すと文字が消えるようになります。

    zipDisplayTop.textContent = text;
    // 上の表示エリア（zipDisplayTop）の文字を、受け取った text に書き換える
    zipDisplayBottom.textContent = text;
    // 下の表示エリア（zipDisplayBottom）の文字も、同じ text に書き換える
  }; // ラベルの文字を書き換える

  const renderTable = (results) => {
    resultBody.innerHTML = results.map(item => `
      <tr>
        <td>${item.zipcode}</td><td>${item.address1}</td><td>${item.address2}</td>
        <td>${item.address3}</td><td>${item.kana1}</td><td>${item.kana2}</td>
        <td>${item.kana3}</td><td>${item.prefcode}</td>
      </tr>
    `).join('');
  };// 届いた住所データを1行ずつ表（tr/td）にする

  searchBtn.addEventListener('click', async () => {
    // 1. 入力値から全角数字を半角にし、数字以外（ハイフン等）をすべて無視して「数字だけ」を取り出す
    const rawVal = zipInput.value;
    const zip = rawVal
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))// 全角数字を半角に。
      .replace(/[^0-9]/g, '');// ハイフンなどを消して「数字だけ」にする。

    // 2. 取り出した数字が「合計7桁」かチェック// 【2. 桁数チェック】
    if (zip.length !== 7) {
      alert(`郵便番号は数字7桁必要です。（現在は${zip.length}桁検知）\nハイフンはあってもなくても構いません。`);// 7文字じゃなければ警告して止める。
      zipInput.focus();
      zipInput.select();// 入力欄を青く選択して、すぐ打ち直せるようにする。
      
      return;
    }
    zipInput.value = zip;
    // キャッシュ確認  // 【3. 通信しないため】
    if (searchCache[zip]) { // もし「ノート（キャッシュ）」にデータがあれば
      updateStatus(`郵便番号：${zip}`); // 「郵便番号」と表示して
      renderTable(searchCache[zip]); // 通信せずにすぐ表示する
      return;
    }

    // 【4. インターネットで検索（通信）】
    updateStatus('郵便番号...');// 読み込み中の合図
    resultBody.innerHTML = '<tr><td colspan="8">読み込み中...</td></tr>';

    try {
      // 3. fetchで検索（通信には数字のみのzipを使用）
      const url = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + zip; // 住所を教えてくれるエンドポイント
      const response = await fetch(url);// インターネットに問いかける
      const data = await response.json(); // 返ってきたデータをJavaScriptで読める形にする。
      // if (data.results) {    // 【5. 成功：結果を表示】

      if (data.results) {
        searchCache[zip] = data.results;// メモ（キャッシュ）に保存
        updateStatus(`郵便番号：${zip}`);// ラベルを更新
        renderTable(data.results); // 関数を使って表を表示！
      } else { // 【6. 失敗：見つからない】
        alert('その郵便番号に対応する住所は見つかりませんでした。');
        zipInput.focus();
        zipInput.select();// 消さずに選択状態にして、修正を促す
        updateStatus('');
        resultBody.innerHTML = '';
      }
    } catch (error) {
      // 【7. エラー：通信トラブル】
      alert('通信に失敗しました。');// ネットが切れている時などの処理
      updateStatus('');
    }
  });
//リセットボタンをクリックしたときの処理
  document.getElementById('reset-btn').addEventListener('click', () => {
    resultBody.innerHTML = '';// 1. 表（テーブル）の中身を空っぽにして消す
    zipInput.value = '';// 2. 郵便番号の入力欄に入っている文字を消す
    updateStatus('');// ラベルを戻す
  });
}


