<template>
  <div id="app">
    <faucet-header></faucet-header>
    <faucet-body>
      <div slot="faucet">
        <b-input placeholder="Enter your testnet account address"
          size="is-medium"
          v-model="accountToFaucetPeth"
        ></b-input>
        <b-button class="faucet-button"
          v-on:click="faucetPeth"
        > Request PETH </b-button>
      </div>
    </faucet-body>
    <faucet-body>
      <div slot="faucet">
        <b-input placeholder="Enter your testnet account address"
          size="is-medium"
          v-model="accountToFaucetToken"
        ></b-input>
        <b-button class="faucet-button"
          v-on:click="faucetToken"
        > Request Token </b-button>
      </div>
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
      accountToFaucetPeth: null,
      accountToFaucetToken: null,
      transactionHash: '',
      errorMessage: '',
    }
  },
  components: {
    'faucet-header': FaucetHeader,
    'faucet-body': FaucetBody,
    'faucet-footer': FaucetFooter
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
    faucetPeth: async function () {
      if (!this.web3.utils.isAddress(this.accountToFaucetPeth)) {
        this.errorMessage = 'invalid address';
        this.transactionHash = '';
        this.accountToFaucetPeth = '';
        return;
      }
      this.web3.eth.sendTransaction({from: this.operator, to: this.accountToFaucetPeth, value: 1000000000000000000, gasPrice: 1}, (err, hash) => {
        if (err) {
          this.errorMessage = err;
          this.transactionHash = '';
          this.accountToFaucetPeth = '';
          return;
        }
        this.errorMessage = '';
        this.transactionHash= hash;
        this.accountToFaucetPeth = '';
      })
    },
    faucetToken: async function () {
      if (!this.web3.utils.isAddress(this.accountToFaucetToken)) {
        this.errorMessage = 'invalid address';
        this.transactionHash = '';
        this.accountToFaucetToken = '';
        return;
      }
      const data = `0x40c10f19000000000000000000000000${this.accountToFaucetToken.substring(2)}0000000000000000000000000000000000000000000000000de0b6b3a7640000`
      this.web3.eth.sendTransaction({from: this.operator, to: '0xb25655a694886557fe3c52177c70b058b120e2b1', data: data, gasPrice: 1}, (err, hash) => {
        if (err) {
          this.errorMessage = err;
          this.transactionHash = '';
          this.accountToFaucetToken = '';
          return;
        }
        this.errorMessage = '';
        this.transactionHash= hash;
        this.accountToFaucetToken = '';
      })
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

.faucet-button{
  margin-top: 10px;
}
</style>
