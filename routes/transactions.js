var express = require('express');
var router = express.Router();

var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var config = require('../src/config.json');

let web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://carl-node1.onther-dev.com:8545"));
}

var privateKey = new Buffer(config.privateKey, 'hex');
var operator = config.operator;
var pdai = config.pdai;

var RequestableDaiJSON = require('../contracts/RequestableDai.json');
var RequestableDaiContract = web3.eth.contract(RequestableDaiJSON);
var RequestableDai = RequestableDaiContract.at(pdai);

router.post('/peth', function(req, res) {
  var to = req.body.to;
  var nonce = web3.eth.getTransactionCount(operator);
  var rawTx = {
    nonce: nonce,
    gasPrice: '0x1',
    gasLimit: '0x5208',
    to: to,
    value: 1000000000000000000
  }
  
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    return res.status(200).json({
      code: 0,
      hash: hash
    });
  });
});

router.post('/pdai', function(req, res) {
  var to = req.body.to;
  var nonce = web3.eth.getTransactionCount(operator);
  var data = RequestableDai.mint.getData(to, 1e19);
  var gasLimit = web3.eth.estimateGas({
    from: operator,
    to: pdai,
    data: data
  });

  var rawTx = {
    nonce: nonce,
    gasPrice: '0x1',
    gasLimit: gasLimit,
    to: pdai,
    data: data
  }
  
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    return res.status(200).json({
      code: 0,
      hash: hash
    });
  });
});

module.exports = router;
