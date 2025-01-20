# Unoffical Tesmart KVM Switch API Wrapper

### installation
```console
npm i tesmart-api
```

### usage
```js
const tesmartClient = new TesmartClient('192.168.1.10', 5000)

const input = await tesmartClient.getInput()

await tesmartClient.setInput(1)
await tesmartClient.setBuzzer(true)
await tesmartClient.setAutoDetect(true)
await tesmartClient.setLedTimeout(30)
```

you find the hexcode docu [here](https://cdn.shopify.com/s/files/1/0591/7291/3346/files/HSW801-E23_HSW1601-E23_Benutzerhandbuch.pdf?v=1707290906)

this project is based of the [PHP based tesmart-api](https://github.com/KarimGeiger/tesmart-api/tree/main)

this project is licensed under the MIT License