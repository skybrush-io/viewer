import { promises as fs } from 'node:fs';
import process from 'node:process';

import { loadCompiledShow } from '@skybrush/show-format';
import { program } from 'commander';

program
  .storeOptionsAsProperties(false)
  .requiredOption('-i, --input <filename>', 'name of the input file')
  .requiredOption('-o, --output <filename>', 'name of the output file')
  .parse(process.argv);

/**
 * @param {{input: string, output: string}} options
 */
async function main(options) {
  const data = await fs.readFile(options.input);
  const show = await loadCompiledShow(data);
  const output = JSON.stringify(show, null, 2);
  await fs.writeFile(options.output, output);
}

await main(program.opts());
