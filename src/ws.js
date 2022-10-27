import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

// chrome---> more tools---> protocal monitor

wss.on('connection', function connection (ws) {
    ws.on('message', function message (data) {
        console.log('received', data.toString())
        
    })

    ws.send(JSON.stringify({
        method: "Network.requestWillBeSent",
        params: {
            requestId: `111`,
            frameId: '123.2',
            loaderId: '123.67',
            request: {
                url: 'www.guangguangguang.com',
                method: 'post',
                headers: {
                    "Content-Type": "text/html"
                },
                initialPriority: 'High',
                mixedContentType: 'none',
                postData: {
                    "guang": 1
                }
            },
            timestamp: Date.now(),
            wallTime: Date.now() - 10000,
            initiator: {
                type: 'other'
            },
            type: "Document"
        }
    }));
})