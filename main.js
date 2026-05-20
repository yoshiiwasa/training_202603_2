'use strict';

{

  //選別した住所をページに表示


  //テキストボックスで入力された値をfetchのデータで探すのを定義
  const showUser = async (zipcode) => {
    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);
      const users = await response.json();
      if (users.results !== null) {
        const aa = users.results[0];
        document.querySelector('p').textContent = 
        `-- 〒${aa.zipcode} : ${aa.address1}${aa.address2}${aa.address3}(${aa.kana1}${aa.kana2}${aa.kana3}) --`;
        console.log(users);
      }else{
        alert('郵便番号が存在しませんでした。再度お試しください。');
      }
    } catch (err) {
      alert('時間を空けてからもう一度お試しください。');
    }
  }

  //buttonを押した時のイベント(テキストボックスの値を整えてzipcodeに代入)
  //その後showUserを呼び起こす
  document.querySelector('button').addEventListener('click', () => {

    const iElement = document.querySelector('input[type="text"]');
    const zipcode = iElement.value.toLowerCase().trim().replaceAll('-', '');

    if (zipcode.length === 7) {
      showUser(zipcode);
    } else {
      alert('郵便番号を入力してください');
    }
  });

  //buttonを使いｐ要素とテキストボックスの中の文字も消す
  document.querySelector('#preset').addEventListener('click', () => {
  document.querySelector('p').textContent = '';
  document.querySelector('input[type="text"]').value = '';
});

}