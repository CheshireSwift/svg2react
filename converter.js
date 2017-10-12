const changeCase = require('change-case')
const cheerio = require('cheerio')
const _ = require('lodash')

module.exports = function(input, forceTitle) {
  const $ = cheerio.load(input)
  $.root()
    .find('*')
    .contents()
    .filter(function() { return this.type === 'comment' })
    .remove()

  const title = forceTitle || changeCase.pascalCase($('title').remove().html())
  console.log(title)
  const rawCss = $('style').remove().html()
  const css = rawCss ? rawCss
    .replace(/\./g, `.${title}-`)
    .replace(/\(#/g, `(#${title}-`)
    .trim() : ''
  const svgElem = $('svg')
  _.forEach(svgElem[0].attribs, (value, name) => {
    if (name.toUpperCase() !== 'viewbox'.toUpperCase()) {
      svgElem.removeAttr(name)
    }
  })
  const rawSvg = $.html(svgElem)
  const svg = rawSvg
    .replace(/class="([^"]*)"/g, `className="${title}-$1"`)
    .replace(/id="([^"]*)"/g, `id="${title}-$1"`)

  const js = `
/* eslint-disable */
import React from 'react';
${css ? `import './${title}.css';
` : ''}
export default () => (
${_(svg).split('\n').map(x => `\t${x}`).join('\n')}
);
`.trim()

  return { css, js, title }
}
