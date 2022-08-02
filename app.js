const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// =========== Paperboy Configuration ============ //

const wallet = {
  cash: 1000,  // set wallet balance
  tokens: 0   // token balance
};
const rate = {
  buy: 1,    // percent of cash to spend on action
  sell: 1    // percent of tokens to sell on action
};

const accountValue = "-";
const lastPrice = 0;
var pageReport = {
  Cash: wallet.cash,
  Tokens: wallet.tokens,
  AccoutValue: accountValue
}

// ============== Server Functions =============== //

app.use(express.json()); // allow app to receive JSON Data

app.get("/test", function(req, res){

  res.send(pageReport);
});

app.post('/alert', (req, res) => {
  console.log("");
  console.log("Recived new" + req.body.action + "alert from Trading View!");
  console.log(req.body);  // log Raw alert
  // { ticker: 'MATICUSDT', action: 'Sell', price: '0.9634' }

  const alert = { // Compile Alert Object
    ticker: req.body.ticker, // 'MATICUSDT'
    action: req.body.action, // 'Sell' or 'Buy'
    price: req.body.price    // '0.9235'
  }

  paperBoy(alert, wallet, rate); // Alert PaperBoy
  return res.status(200).json({ ok: true });   // Return OK to server
});

// ============= PaperBoy functions ============== //

function paperBoy(alert, wallet, rate){
  console.log("");
  console.log("~= PaperBoy =~");

  if (alert.action === "Buy"){
    //create new BUY order
      // determine amount to buy & prepare order
      const orderAmount = (wallet.cash * rate.buy);
      const tokenAmount = (orderAmount / alert.price);
      //update wallet
      wallet.cash -= orderAmount;
      wallet.tokens += tokenAmount;

  } else if (alert.action === "Sell"){
    //create new SELL order
      // determine amount to buy & prepare order
      const orderAmount = (wallet.tokens * rate.sell);
      const cashAmount = (orderAmount * alert.price);
      //update wallet
      wallet.cash += cashAmount;
      wallet.tokens -= orderAmount;
  }
  console.log("Order Complete!");
  const lastPrice = alert.price;
  report(wallet, alert.price);
  console.log("~= PaperBoy =~");
  console.log("");
};

function report(wallet, lastPrice){
  console.log("~= Wallet Report =~")
  console.log("")
  console.log("Cash (USD): $" + wallet.cash);
  console.log("Tokens: " + wallet.tokens);
  console.log("");
  console.log("Account Value:")
  console.log("$"+ (wallet.cash + (wallet.tokens * lastPrice)));
  accoutnValue = console.log("$"+ (wallet.cash + (wallet.tokens * lastPrice)));
  return accountValue

};

// ============================================ //
// Server startup logs
app.listen(port, () => {console.log('🚀 Server running on port '+ port);

});
