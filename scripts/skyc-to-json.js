const fs = require('fs').promises;
const process = require('process');

const { program } = require('commander');
const { loadCompiledShow } = require('@skybrush/show-format');

program
  .storeOptionsAsProperties(false)
  .requiredOption('-i, --input <filename>', 'name of the input file')
  .requiredOption('-o, --output <filename>', 'name of the output file')
  .parse(process.argv);

async function main(options) {
  const data = await fs.readFile(options.input);
  const show = await loadCompiledShow(data);
  const output = JSON.stringify(show, null, 2);
  await fs.writeFile(options.output, output);
}

main(program.opts());
