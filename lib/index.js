const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const marked = require('marked');

/**
 * CSS ソースコードからコメントを抽出し、ドキュメントとなる HTML を出力する
 *
 * @param {string} source - (コンパイル前) ソースコード
 * @param {string} styles - ドキュメントに実際に適用する CSS
 * @return {string} HTML
 */
module.exports = (source, styles) => {
  const guideHtml = fs.readFileSync(path.join(__dirname, 'guide.html'));
  const guideCss = fs.readFileSync(path.join(__dirname, 'guide.css'));
  const guideJs = fs.readFileSync(path.join(__dirname, 'guide.js'));

  // ドキュメントの埋め込み および 一覧の作成
  let docItems = '';
  const root = postcss.parse(source);
  root.walkComments((comment) => {
    const doc = marked(comment.text);
    const codeBlock = comment.next();
    if (!codeBlock || codeBlock.type !== 'rule') {
      return;
    }
    const selector = codeBlock.selector;
    const summary = comment.text.split('\n')[0];
    const code = codeBlock.toString();

    docItems += `<li class="doc-item"
      data-doc="${encodeURIComponent(doc)}"
      data-code="${encodeURIComponent(code)}"
    >
      <div class="doc-item-selector">${selector}</div>
      <div class="doc-item-summary">${summary}</div>
    </li>`;
  });

  return guideHtml.toString()
    .replace(/{{ *css *}}/g, guideCss)
    .replace(/{{ *js *}}/g, guideJs)
    .replace(/{{ *encoded-css *}}/g, encodeURIComponent(styles))
    .replace(/{{ *doc-items *}}/g, docItems)
    ;
};
