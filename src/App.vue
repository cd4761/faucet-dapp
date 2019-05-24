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
      v-bind:explorerTxPrefix="explorerTxPrefix"
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
      requestableDaiContract: null,
      explorerTxPrefix: '',
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
    this.web3 = new Web3(process.env.PROVIDER_URL || 'http://carl-node1.onther-dev.com:8545');
    this.operator = process.env.OPERATOR || "0x55FDa7601Ffa55F61B819642816460aA24883F7f";
    this.explorerTxPrefix = process.env.EXPLORER_TX_PREFIX || "http://explorer.carl-node3.onther-dev.com/tx/";
    this.requestableDaiContract = process.env.REQUESTABLE_DAI_CONTRACT || "0x7def87af38d6db4e6aafb83093c7d1c0622e60fd";
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
      const data = `0x40c10f19000000000000000000000000${account.substring(2)}0000000000000000000000000000000000000000000000008AC7230489E80000`
      this.web3.eth.sendTransaction({from: this.operator, to: this.requestableDaiContract, data: data, gasPrice: 1}, (err, hash) => {
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
