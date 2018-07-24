const { ipcRenderer, remote } = require('electron')
const BrowserWindow = remote.BrowserWindow
const path = require('path')
const axios = require('axios')

const notifyBtn = document.getElementById('notify-btn')
const priceBtc = document.getElementById('price-btc')
const priceEth = document.getElementById('price-eth')
const priceBtcUsd = document.getElementById('price-btc-usd')
const priceEthUsd = document.getElementById('price-eth-usd')
const targetPrice = document.getElementById('target-price')

let targetPriceVal;

if (notifyBtn) {
  notifyBtn.addEventListener('click', function (event) {
    let win = new BrowserWindow({
      width: 400,
      height: 200,
      frame: false,
      resizable: false,
      transparent: true,
      alwaysOnTop: true
    })

    win.on('close', function () { win = null })
    win.loadURL(`file://${path.join(__dirname, '../add/add.html')}`)
    win.show()
  })
}

function getBTC() {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=NGN,USD')
    .then(res => {
      const btcNgn = res.data.BTC.NGN
      const btcUsd = res.data.BTC.USD
      const ethNgn = res.data.ETH.NGN
      const ethUsd = res.data.ETH.USD

      priceBtc.innerHTML = `NGN ${btcNgn.toLocaleString('en')}`
      priceEth.innerHTML = `NGN ${ethNgn.toLocaleString('en')}`
      priceBtcUsd.innerHTML = `$ ${btcUsd.toLocaleString('en')}`
      priceEthUsd.innerHTML = `$ ${ethUsd.toLocaleString('en')}`
    })
}

getBTC();
setInterval ( getBTC, 20000 );

ipcRenderer.on('targetPriceVal', function (event, arg) {
  targetPriceVal = Number(arg)
  targetPrice.innerHTML = `NGN ${targetPriceVal.toLocaleString('en')}`
})
