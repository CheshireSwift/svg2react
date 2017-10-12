#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const converter = require('./converter')

program
  .version('0.0.0')
  .usage('[options] <file...>')
  .option('-p, --prefix <p>', 'Write to [p].css and [p].js rather than STDOUT')
  .option('-o, --outdir <o>', 'Directory to write files to')
  .option('-t, --title <t>', 'Title to use instead of <title /> tag')
  .parse(process.argv)

function handleFile(filePath) {
  const input = fs.readFileSync(filePath)
  const { css, js, title } = converter(input, program.title)
  if (program.prefix || program.outdir) {
    const prefix = program.prefix || title
    function writeFile(data, extension) {
      const writePath = path.join(program.outdir, prefix + '.' + extension)
      fs.writeFileSync(writePath, data + '\n')
    }
    writeFile(css, 'css')
    writeFile(js, 'js')
  } else {
    console.log(
`/* ${title}.css */
${css}
/* ${title}.js */
${js}`
    )
  }
}

program.args.forEach(handleFile)
