const { loadCompiledShow } = require('@skybrush/show-format');
const fs = require('fs').promises;

const options = require('yargs')
  .usage('$0 [options] <target>')
  .option('i', {
    alias: 'input',
    describe: 'name of the input file',
    type: 'string',
  })
  .option('o', {
    alias: 'output',
    describe: 'name of the output file',
    type: 'string',
  })
  .demandOption(
    ['i', 'o'],
    'Please provide an input and an output filename with -i and -o'
  )
  .help('h')
  .alias('h', 'help')
  .version(false).argv;

async function main() {
  const data = await fs.readFile(options.input);
  const show = await loadCompiledShow(data);
  const output = JSON.stringify(show, null, 2);
  await fs.writeFile(options.output, output);
}

main();
