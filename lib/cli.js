const pkg = require('../package.json');
const commander = require('commander');
const fs = require('fs');
const app = require('./index');

// コマンドオプション
commander
  .version(pkg.version)
  .usage('[options] <style_file> [<source_file>]')
  .option('-o, --output <out_file>', 'Styleguide file path')
  .parse(process.argv);

const stylePath = commander.args[0];
const sourcePath = commander.args.length > 1 ? commander.args[1] : commander.args[0];
const outPath = commander.output || 'styleguide.html';

const style = fs.readFileSync(stylePath);
const source = fs.readFileSync(sourcePath);
const styleguide = app(source, style);
fs.writeFileSync(outPath, styleguide);
