const path = require('path');
const axios = require('axios');

const imgPath = path.join(__dirname, '../../../assets/images');
const cryptoMainDiv = document.getElementById('crypto-main');

const coinsFullName = {
  btc: 'bitcoin',
  eth: 'ethereum',
  bch: 'bitcoin cash'
};

const priceNotifications = {
  btc: {
    title: 'BTC Alert',
    body: 'Bitcoin just beat your target price!',
    icon: `${imgPath}/bitcoin-shadow.png`
  },
  eth: {
    title: 'ETH Alert',
    body: 'Ethereum just beat your target price!',
    icon: `${imgPath}/ethereum.png`
  },
  bch: {
    title: 'BCH Alert',
    body: 'Bitcoin cash just beat your target price!',
    icon: `${imgPath}/bitcoin-cash.png`
  }
};

// Define needed global variables
let targetPriceVal = {};

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
  priceTargetInput: function(data) {
    return `
      <div id="${data.type}-price-target" class="price-target data">
        <div>
          <input id="notify-val" placeholder="Target price in NGN" value="${data.targetNgn ? data.targetNgn : ''}">
        </div>
        <div>
          <button onclick="setPrice('${data.type}')" class="btn btn-primary">Set</button>
          <button onclick="cancelSetPrice('${data.type}')" class="btn">Cancel</button>
        </div>
      </div>
    `
  },
  priceTargetSet: function(data={}) {
    return `
      <div id="${data.type}-price-target" class="price-target data">
        <div>
          <p class="helper-title">Target price</p>
          <p class="price-set">NGN ${formatPrice(data.targetNgn)}</p>
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
      const ethNgn = res.data.ETH.NGN
      const bchNgn = res.data.BCH.NGN

      const formatRes = [
        {
          type: 'btc',
          iconPath: `${imgPath}/bitcoin.png`,
          targetNgn: targetPriceVal['btc'] && formatPrice(targetPriceVal['btc']),
          ngn: formatPrice(btcNgn),
          usd: formatPrice(res.data.BTC.USD),
          eur: formatPrice(res.data.BTC.EUR)
        },
        {
          type: 'eth',
          iconPath: `${imgPath}/ethereum.png`,
          targetNgn: targetPriceVal['eth'] && formatPrice(targetPriceVal['eth']),
          ngn: formatPrice(ethNgn),
          usd: formatPrice(res.data.ETH.USD),
          eur: formatPrice(res.data.ETH.EUR)
        },
        {
          type: 'bch',
          iconPath: `${imgPath}/bitcoin-cash.png`,
          targetNgn: targetPriceVal['bch'] && formatPrice(targetPriceVal['bch']),
          ngn: formatPrice(bchNgn),
          usd: formatPrice(res.data.BCH.USD),
          eur: formatPrice(res.data.BCH.EUR)
        }
      ]

      formatRes.forEach(item => {
        output = output + buildCryptoCard(item)
      })

      cryptoMainDiv.innerHTML = output

      if (targetPriceVal['btc'] >= btcNgn) {
        new window.Notification(priceNotifications.btc.title, priceNotifications.btc)
      }

      if (targetPriceVal['eth'] >= ethNgn) {
        new window.Notification(priceNotifications.eth.title, priceNotifications.eth)
      }

      if (targetPriceVal['bch'] >= bchNgn) {
        new window.Notification(priceNotifications.bch.title, priceNotifications.bch)
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
    const priceTarget = document.getElementById(`${type}-price-target`);
    priceTarget.outerHTML = snippets.priceTargetInput({type: type, targetNgn: targetPriceVal[type]});
  }
};

function setPrice(type) {
  const priceTarget = document.getElementById(`${type}-price-target`);

  targetPriceVal[type] = parseFloat(document.getElementById('notify-val').value);
  priceTarget.outerHTML = snippets.priceTargetSet({type: type, targetNgn: targetPriceVal[type]});
};

function cancelSetPrice(type) {
  const priceTarget = document.getElementById(`${type}-price-target`);

  if (!!targetPriceVal[type]) {
    priceTarget.outerHTML = snippets.priceTargetSet({type: type, targetNgn: targetPriceVal[type]});
    return;
  }

  priceTarget.outerHTML= snippets.priceTargetInnit({type})
}

setInterval ( getCryptos, 20000 ); // refresh prices every 20 seconds

(function init() {
  cryptoMainDiv.innerHTML = `<div class="status-text"><em>preparing your cryptos...</em></div>`
  getCryptos();
})()
