const { ipcRenderer, remote } = require('electron')
const BrowserWindow = remote.BrowserWindow
const path = require('path')
const axios = require('axios')

const imgPath = path.join(__dirname, '../../../assets/images')
const cryptoMainDiv = document.getElementById('crypto-main')

let targetPriceVal;

cryptoMainDiv.innerHTML = `
  <div class="status-text"><em>preparing your cryptos...</em></div>`

const priceNotification = {
  title: 'BTC Alert',
  body: 'BTC just beat your target price!',
  icon: `${imgPath}/bitcoin-shadow.png`
}

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

      ${
        !!data.targetNgn ?
        `<div id="${data.type}-price-target" class="price-target data">
          <div>
            <p class="helper-title">Target price</p>
            <p class="price-set">NGN ${data.targetNgn}</p>
          </div>
          <div>
            <button onclick="openNotifyModal()" class="btn btn-primary">Update Price Target</button>
          </div>
        </div>`
        :
        `<div id="${data.type}-price-target" class="price-target innit">
          <button onclick="openNotifyModal()" class="btn btn-primary">Set Price Target</button>
          <p>Get notified when ${data.fullname} hits the set price</p>
        </div>`
      }
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
      const btcEur = res.data.BTC.EUR

      const ethNgn = res.data.ETH.NGN
      const ethUsd = res.data.ETH.USD

      const formatRes = [
        {
          type: 'btc',
          fullname: 'bitcoin',
          iconPath: `${imgPath}/bitcoin.png`,
          targetNgn: targetPriceVal && formatPrice(targetPriceVal),
          ngn: formatPrice(btcNgn),
          usd: formatPrice(btcUsd),
          eur: formatPrice(btcEur)
        },
        {
          type: 'eth',
          fullname: 'ethereum',
          iconPath: `${imgPath}/ethereum.png`,
          ngn: formatPrice(res.data.ETH.NGN),
          usd: formatPrice(res.data.ETH.USD),
          eur: formatPrice(res.data.ETH.EUR)
        },
        {
          type: 'bch',
          fullname: 'bitcoin cash',
          iconPath: `${imgPath}/bitcoin-cash.png`,
          ngn: formatPrice(res.data.BCH.NGN),
          usd: formatPrice(res.data.BCH.USD),
          eur: formatPrice(res.data.BCH.EUR)
        }
      ]

      formatRes.forEach(item => {
        output = output + buildCryptoCard(item)
      })

      cryptoMainDiv.innerHTML = output

      if (targetPriceVal >= btcNgn) {
        new window.Notification(priceNotification.title, priceNotification)
      }
    })
    .catch(error => {
      cryptoMainDiv.innerHTML = `
        <div class="status-text">${error}. Ensure you're connected to a network and reload!</div>
      `
    })
}

getCryptos();
setInterval ( getCryptos, 20000 ); // refresh prices every 20 seconds

function openNotifyModal() {
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
}

ipcRenderer.on('targetPriceVal', function (event, arg) {
  const btcPriceTarget = document.getElementById('btc-price-target')

  targetPriceVal = Number(arg)
  btcPriceTarget.outerHTML = `
  <div id="btc-price-target" class="price-target data">
    <div>
      <p class="helper-title">Target price</p>
      <p class="price-set">NGN ${formatPrice(targetPriceVal)}</p>
    </div>
    <div>
      <button onclick="openNotifyModal()" class="btn btn-primary">Update Price Target</button>
    </div>
  </div>`
})
