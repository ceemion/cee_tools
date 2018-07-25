const path = require('path');
const axios = require('axios');

const imgPath = path.join(__dirname, '../../../assets/images');
const cryptoMainDiv = document.getElementById('crypto-main');

const coinsFullName = {
  btc: 'bitcoin',
  eth: 'ethereum',
  bch: 'bitcoin cash'
};

const priceNotification = {
  title: 'BTC Alert',
  body: 'BTC just beat your target price!',
  icon: `${imgPath}/bitcoin-shadow.png`
};

// Define needed global variables
let targetPriceVal;

// Build needed dynamic HTML snippets
const snippets = {
  priceTargetInnit: function(data={}) {
    return `
      <div id="${data.type}-price-target" class="price-target innit">
        <button onclick="initSetPrice('${data.type}')" class="btn btn-primary">Set Price Target</button>
        <p>Get notified when ${coinsFullName[data.type]} hits the set price</p>
      </div>
    `
  },
  priceTargetInput: function(type) {
    return `
      <div id="btc-price-target" class="price-target data">
        <div>
          <input id="notify-val" placeholder="Target price in NGN">
        </div>
        <div>
          <button onclick="setPrice('${type}')" class="btn btn-primary">Set</button>
          <button onclick="cancelSetPrice('${type}')" class="btn">Cancel</button>
        </div>
      </div>
    `
  },
  priceTargetSet: function(data={}) {
    return `
      <div id="${data.type}-price-target" class="price-target data">
        <div>
          <p class="helper-title">Target price</p>
          <p class="price-set">NGN ${data.targetNgn}</p>
        </div>
        <div>
          <button onclick="initSetPrice('${data.type}')" class="btn btn-primary">Update Price Target</button>
        </div>
      </div>
    `
  }
};

function buildCryptoCard(data={}) {
  return `
    <div class="crypto-card">
      <div class="header">
        <div class="title">
          ${data.type.toUpperCase()} <span class="${data.type}">${coinsFullName[data.type]}</span>
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

      ${ !!data.targetNgn ? snippets.priceTargetSet(data) : snippets.priceTargetInnit(data) }
    </div>
  `
};

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
          iconPath: `${imgPath}/bitcoin.png`,
          targetNgn: targetPriceVal && formatPrice(targetPriceVal),
          ngn: formatPrice(btcNgn),
          usd: formatPrice(btcUsd),
          eur: formatPrice(btcEur)
        },
        {
          type: 'eth',
          iconPath: `${imgPath}/ethereum.png`,
          ngn: formatPrice(res.data.ETH.NGN),
          usd: formatPrice(res.data.ETH.USD),
          eur: formatPrice(res.data.ETH.EUR)
        },
        {
          type: 'bch',
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
};

function initSetPrice(type) {
  if (type) {
    const btcPriceTarget = document.getElementById(`${type}-price-target`);
    btcPriceTarget.outerHTML = snippets.priceTargetInput(type);
  }
};

function setPrice(type) {
  const btcPriceTarget = document.getElementById('btc-price-target');

  targetPriceVal = Number(document.getElementById('notify-val').value);
  btcPriceTarget.outerHTML = snippets.priceTargetSet({type: type, targetNgn: targetPriceVal});
};

function cancelSetPrice(type) {
  const btcPriceTarget = document.getElementById(`${type}-price-target`);

  if (!!targetPriceVal) {
    btcPriceTarget.outerHTML = snippets.priceTargetSet({type: type, targetNgn: targetPriceVal});
    return;
  }

  btcPriceTarget.outerHTML= snippets.priceTargetInnit({type: type})
}

setInterval ( getCryptos, 20000 ); // refresh prices every 20 seconds

(function init() {
  cryptoMainDiv.innerHTML = `<div class="status-text"><em>preparing your cryptos...</em></div>`
  getCryptos();
})()
