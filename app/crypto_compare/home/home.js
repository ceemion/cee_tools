const { ipcRenderer, remote } = require('electron')
const BrowserWindow = remote.BrowserWindow
const path = require('path')
const axios = require('axios')

const imgPath = path.join(__dirname, '../../../assets/images')

const cryptoMainDiv = document.getElementById('crypto-main')
const notifyBtn = document.getElementById('notify-btn')
// const priceBtc = document.getElementById('price-btc')
// const priceEth = document.getElementById('price-eth')
// const priceBtcUsd = document.getElementById('price-btc-usd')
// const priceEthUsd = document.getElementById('price-eth-usd')
const targetPrice = document.getElementById('target-price')

const priceNotification = {
  title: 'BTC Alert',
  body: 'BTC just beat your target price!',
  icon: `${imgPath}/bitcoin-shadow.png`
}

let targetPriceVal;

function buildCryptoCard(data={}) {
  return `
    <div class="crypto-card">
      <div class="header">
        <div class="title">
          ${data.type.toUpperCase()} <span class="${data.type}">${data.fullname}</span>
        </div>
        <div class="icon">
          <img src="${data.iconPath}" alt="" />
        </div>
      </div>

      <div class="prices">
        <div class="main">NGN ${data.ngn ? data.ngn : 'loading...'}</div>
        <div class="sub">USD ${data.usd ? data.usd : 'loading...'}</div>
        <div class="sub">EUR ${data.eur ? data.eur : 'loading...'}</div>
      </div>

      <div class="updated-time">
        <p>Updated ${new Date()}</p>
      </div>

      <div class="price-target innit">
        <button>Set Price Target</button>
        <p>Get notified when Bitcoin hits the set price</p>
      </div>
    </div>
  `
}

function formatPrice(price) {
  return price.toLocaleString('en')
}

function getCryptos() {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC,BCH&tsyms=NGN,USD,EUR')
    .then(res => {
      let output = ''

      const btcNgn = res.data.BTC.NGN
      const btcUsd = res.data.BTC.USD
      const ethNgn = res.data.ETH.NGN
      const ethUsd = res.data.ETH.USD

      const formatRes = [
        {
          type: 'btc',
          fullname: 'bitcoin',
          iconPath: `${imgPath}/bitcoin.png`,
          ngn: formatPrice(res.data.BTC.NGN),
          usd: formatPrice(res.data.BTC.USD),
          eur: formatPrice(res.data.BTC.EUR)
        },
        {
          type: 'bch',
          fullname: 'bitcoin cash',
          iconPath: `${imgPath}/bitcoin-cash.png`,
          ngn: formatPrice(res.data.BCH.NGN),
          usd: formatPrice(res.data.BCH.USD),
          eur: formatPrice(res.data.BCH.EUR)
        },
        {
          type: 'eth',
          fullname: 'ethereum',
          iconPath: `${imgPath}/ethereum.png`,
          ngn: formatPrice(res.data.ETH.NGN),
          usd: formatPrice(res.data.ETH.USD),
          eur: formatPrice(res.data.ETH.EUR)
        }
      ]

      formatRes.forEach(item => {
        output = output + buildCryptoCard(item)
      })

      console.log('output: ', output)

      cryptoMainDiv.innerHTML = output

      // priceBtc.innerHTML = `NGN ${btcNgn.toLocaleString('en')}`
      // priceEth.innerHTML = `NGN ${ethNgn.toLocaleString('en')}`
      // priceBtcUsd.innerHTML = `$ ${btcUsd.toLocaleString('en')}`
      // priceEthUsd.innerHTML = `$ ${ethUsd.toLocaleString('en')}`

      if (!!targetPrice.innerHTML && targetPriceVal === btcNgn) {
        new window.Notification(priceNotification.title, priceNotification)
      }
    })
}

getCryptos();
setInterval ( getCryptos, 20000 ); // refresh prices every 20 seconds

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

ipcRenderer.on('targetPriceVal', function (event, arg) {
  targetPriceVal = Number(arg)
  targetPrice.innerHTML = `NGN ${targetPriceVal.toLocaleString('en')}`
})
