/* eslint-env browser */
document.addEventListener('DOMContentLoaded', () => {
  // ドキュメントサンプルの表示領域となる iframe を取得
  const iframe = document.querySelector('iframe.doc-sample');
  // ドキュメントサンプルに埋め込む CSS を抽出
  const docSampleCss = decodeURIComponent(document.querySelector('#doc-sample-style').text);

  // モジュール一覧の一つをクリックしたときの動作
  document.querySelectorAll('.doc-list > li').forEach((elem) => {
    elem.addEventListener('click', () => {
      const doc = decodeURIComponent(elem.dataset.doc);
      const code = decodeURIComponent(elem.dataset.code);

      const content = `
        <meta charset="utf-8">
        <style>${docSampleCss.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</style>
        ${doc}
        <pre><code>${code}</code></pre>
      `;

      iframe.contentDocument.documentElement.innerHTML = content;

      document.querySelectorAll('.doc-list > li.active').forEach(active => active.classList.remove('active'));
      elem.classList.add('active');
    });
  });

  // デバイス一覧の一つをクリックしたときの動作
  const devices = [
    { name: 'phone', width: '320px', height: '568px' },
    { name: 'tablet', width: '768px', height: '1024px' },
    { name: 'desktop', width: '1440px', height: '1920px' },
    { name: 'fullscreen', width: '100%', height: '100%' },
  ];
  const activateDevice = (device) => {
    // ボタンの active 状態切替
    document.querySelectorAll('.device.active').forEach(a => a.classList.remove('active'));
    document.querySelector(`.js-device-${device.name}`).classList.add('active');
    // iframe サイズ調整
    iframe.style.width = device.width;
    iframe.style.height = device.height;
  };
  devices.forEach((device) => {
    const elem = document.querySelector(`.js-device-${device.name}`);
    elem.addEventListener('click', () => activateDevice(device));
  });
  // 初期状態の設定
  activateDevice(devices[devices.length - 1]);
});
