const diff = require('diff')

let oldStr = `
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
`

let newStr = `
    var MarkdownIt = require('changes-markdown-it'),
    md = new MarkdownIt();

    const markdownItAnchor = require('markdown-it-anchor')

    md.use(markdownItAnchor, { changes-
    level: 1,
    slugify: string => string,
    permalink: false,
    // renderPermalink: (slug, opts, state, permalink) => {},
    permalinkClass: 'header-anchor',
    permalinkSymbol: '¶',
    permalinkBefore: false
})
`

console.log(diff.diffLines(oldStr, newStr) )