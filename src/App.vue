<template>
  <div id="app">
    <faucet-header></faucet-header>
    <faucet-body
      v-on:faucet:peth="faucetPeth"
      v-on:faucet:token="faucetToken"
      v-on:clear:data="clearData"
      v-on:send:error="renewErrorMessage">
    >
    </faucet-body>
    <faucet-footer
      v-bind:transactionHash="transactionHash"
      v-bind:errorMessage="errorMessage"
    ></faucet-footer>
  </div>
</template>

<script>
import FaucetHeader from './components/FaucetHeader.vue';
import FaucetBody from './components/FaucetBody.vue';
import FaucetFooter from './components/FaucetFooter.vue';

import Web3 from 'web3';

export default {
  name: 'app',
  data() {
    return {
      web3: null,
      operator: null,
      transactionHash: '',
      errorMessage: '',
    }
  },
  components: {
    'faucet-header': FaucetHeader,
    'faucet-body': FaucetBody,
    'faucet-footer': FaucetFooter,
  },
  created () {
    const that = this;
    this.web3 = new Web3('http://localhost:8545');
    this.web3.eth.getAccounts((err, accounts) => {
      if (!err) {
        that.operator = accounts[0]
      }
    });
  },
  methods: {
    faucetPeth: async function (account) {
      if (!this.web3.utils.isAddress(account)) {
        this.errorMessage = 'invalid address';
        this.transactionHash = '';
        return;
      }
      this.web3.eth.sendTransaction({from: this.operator, to: account, value: 1000000000000000000, gasPrice: 1}, (err, hash) => {
        if (err) {
          this.errorMessage = err;
          this.transactionHash = '';
          return;
        }
        this.errorMessage = '';
        this.transactionHash= hash;
      })
    },
    faucetToken: async function (account) {
      if (!this.web3.utils.isAddress(account)) {
        this.errorMessage = 'invalid address';
        this.transactionHash = '';
        return;
      }
      const data = `0x40c10f19000000000000000000000000${account.substring(2)}0000000000000000000000000000000000000000000000000de0b6b3a7640000`
      this.web3.eth.sendTransaction({from: this.operator, to: '0xb25655a694886557fe3c52177c70b058b120e2b1', data: data, gasPrice: 1}, (err, hash) => {
        if (err) {
          this.errorMessage = err;
          this.transactionHash = '';
          return;
        }
        this.errorMessage = '';
        this.transactionHash= hash;
      })
    },
    clearData: function () {
      this.errorMessage = '';
      this.transactionHash= '';
    },
    renewErrorMessage: function (errorMessage) {
      this.errorMessage = errorMessage;
      this.transactionHash = '';
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
