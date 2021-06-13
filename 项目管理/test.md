## e2e
```javascript
import puppeteer from 'puppeteer'
let puppteerOptions = {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
}
const browser = puppeteet.launch(puppteerOptions)

const page = browser.newPage()

page.on('console', (e) => {
    if (e.type === 'error') {
        console.error(e)
    }
})
// 关闭页面 窗口
page.close()
browser.close()

await page.click(selector, options)

async function isVisible (selector: string) {
    const display = await page.$eval(selector, (node) => {
        return window.getComputedStyle(node).display
    })
    return display !== 'none'
}

async function isFocused (selector) {
    return page.$eval(node, node => node === document.activeElement)
}

function nextFrame () {
    return page.evaluate(() => {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve)
            })
        })
    })
}
```
## jest
```javascript
beforeEach
beforeAll
...
describe('describe string', () => {
    it('test alias', async () => {
        const one = {
            created: jest.fn()
        }
        ...
        expect(one.created).toHaveBeenCalledTimes(1)
    })
    test('test string', async () => {
        await page.evaluate(() => {
            ...
            await nextFrame()
            ...
            document.querySelector = jest.fn().mockReturnValue(container)
        })
    })
})
```