var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();

const markdownItAnchor = require('markdown-it-anchor')

md.use(markdownItAnchor, {
  level: 1,
  slugify: string => string,
  permalink: false,
  // renderPermalink: (slug, opts, state, permalink) => {},
  permalinkClass: 'header-anchor',
  permalinkSymbol: '¶',
  permalinkBefore: false
})

const src = `# First header

Lorem ipsum.

## Next section!

This is totaly awesome.`


console.log(md.render(src))
// var MarkdownIt = require('markdown-it'),
//     md = new MarkdownIt();
// var result = md.render('# markdown-it rulezz!');
// console.log(result)