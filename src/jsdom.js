import { JSDOM } from 'jsdom'
// js中生成dom方法

const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
console.log(dom)

const dom1 = new JSDOM(``, {
    url: "https://example.org/",
    referrer: "https://example.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000
});

console.log(dom1)
  