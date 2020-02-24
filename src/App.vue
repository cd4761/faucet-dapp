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
import config from '../config.json';

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
    this.web3 = new Web3(config.providerURL);
    this.operator = config.operator;
    this.explorerTxPrefix = config.explorerTxPrefix;

    console.log('TON contract address:', config.TON);
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
      axios.post('/api/peth', {
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
      axios.post('/api/TON', {
        to: account
      })
      .then(function (response) {
        if (response.data.errorMessage !== '') {
          self.errorMessage = response.data.errorMessage;
          self.transactionHash= '';
        } else {
          self.errorMessage = '';
          self.transactionHash= response.data.hash;
        }
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
