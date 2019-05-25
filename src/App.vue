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
import axios from 'axios';

export default {
  name: 'app',
  data() {
    return {
      web3: null,
      operator: null,
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
  },
  methods: {
    faucetPeth: async function (account) {
      if (!this.web3.isAddress(account)) {
        this.errorMessage = 'invalid address';
        this.transactionHash = '';
        return;
      }

      const self = this;
      // A browser sends an OPTIONS request before a POST request, essentially to check with the server that it's allowed to send the POST request.
      axios.post('http://localhost:3000/transactions/peth', {
        to: account
      })
      .then(function (response) {
        self.errorMessage = '';
        self.transactionHash= response.data.hash;
      })
      .catch(function (error) {
        self.errorMessage = error ;
        self.transactionHash = '';
      });
    },
    faucetToken: async function (account) {
      if (!this.web3.isAddress(account)) {
        this.errorMessage = 'invalid address';
        this.transactionHash = '';
        return;
      }
      
      const self = this;
      // A browser sends an OPTIONS request before a POST request, essentially to check with the server that it's allowed to send the POST request.
      axios.post('http://localhost:3000/transactions/pdai', {
        to: account
      })
      .then(function (response) {
        self.errorMessage = '';
        self.transactionHash= response.data.hash;
      })
      .catch(function (error) {
        self.errorMessage = error ;
        self.transactionHash = '';
      });
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
