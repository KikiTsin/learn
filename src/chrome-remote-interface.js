import CDP from 'chrome-remote-interface'

// 1. 执行以下命令，会使chrome内启的backend端口为9222
// /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

// 2. node src/chrome-remote-interface.js的时候，会访问chrome内的9222 backend端口

// 3.
async function test () {
    let client
    try {
        client = await CDP();
        const { Page, DOM, Debugger } = client;

        await Page.enable();

        await Page.navigate({ url: 'https://baidu.com' })

        await DOM.enable()

        const { root } = await DOM.getDocument({
            depth: -1
        })

        console.log(root)
    } catch (err) {
        console.log(err)
    }
}

test()