'use strict';

{
  //0521todo
  //関数名を適切な文字に直すこと
  //検索結果を残す
  //複数ある場合での表示
 
  //テキストボックスで入力された値をfetchのデータで探すのを定義
  //users.resultsにループ処理を追加
  const searchAddress = async (zipcode) => {
    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);
      const users = await response.json();

      if (users.results !== null) {
        document.querySelector('#resultP-container').innerHTML = '';
        users.results.forEach((result) => {
          const newP = document.createElement('p');
          newP.textContent = `検索結果 : 〒${result.zipcode}  ${result.address1}${result.address2}${result.address3}(${result.kana1}${result.kana2}${result.kana3}) `;
          document.querySelector('#resultP-container').appendChild(newP);

          const newli = document.createElement('li');
          newli.textContent = `-- 〒${result.zipcode} : ${result.address1}${result.address2}${result.address3}(${result.kana1}${result.kana2}${result.kana3}) --`;
          document.querySelector('#address-list').appendChild(newli);
          // console.log(results);
        });
      } else {
        alert('郵便番号が存在しませんでした。再度お試しください。');
      }
    } catch (err) {
      alert('時間を空けてからもう一度お試しください。');
    }
  }

  //buttonを押した時のイベント(テキストボックスの値を整えてzipcodeに代入)
  //その後showUserを呼び起こす
  document.querySelector('#search').addEventListener('click', () => {
    const iElement = document.querySelector('#input');
    const zipcode = iElement.value.toLowerCase().trim().replaceAll('-', '').replaceAll('ー', '').replaceAll('―', '').replaceAll('－', '');

    if (zipcode.length === 7) {
      searchAddress(zipcode);
    } else {
      alert('郵便番号を入力してください');
    }
  });

  //buttonを使いｐ要素とテキストボックスの中の文字も消す
  document.querySelector('#clearAddressList').addEventListener('click', () => {
    document.querySelector('ul').textContent = '';
  });


  //リセットボタンで結果を消す
  document.querySelector('#resets').addEventListener('click', () => {
    document.querySelector('#resultP-container').textContent = '';
  });

}