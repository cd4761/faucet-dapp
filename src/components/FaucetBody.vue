<template>
  <div id="faucet-body">
    <b-field>
      <b-select v-model="selected">
        <option>PETH</option>
        <option>PDAI</option>
      </b-select>
      <b-input class="input-account" placeholder="Enter your testnet account address"
        v-on:click="requestFaucet"
        v-model="account"
      ></b-input>
      <p class="control">
        <button class="button is-success"
          v-on:click="requestFaucet">Request</button>
      </p>
    </b-field>
    <div class="qrcode-container">
      <b-button
        v-on:click="scanQrcode"
      >
        <img class="qrcode-img" src="../../public/qrcode.png" alt="">
      </b-button>
      <p class="input-qrcode-label">Get account from QR code</p>
      <div>
        <video id="preview"></video>
      </div>
    </div>
  </div>
</template>

<script>
import ethereum_address from 'ethereum-address';
import Instascan from 'instascan';

export default {
  data() {
    return {
      account: null,
      selected: 'PETH',
    }
  },
  methods: {
    requestFaucet: function () {
      if (this.selected === 'PETH') {
        this.$emit('faucet:peth', this.account);
      } else {
        this.$emit('faucet:token', this.account);
      }
      this.account = '';
    },
    scanQrcode: function () {
      this.$emit('clear:data');
      const self = this;
      const preview = document.getElementById('preview');
      const scanner = new Instascan.Scanner({ video: preview });
      scanner.addListener('scan', function (content) {
        scanner.stop();

        if (!ethereum_address.isAddress(content)) {
          this.$emit('send:error', 'read QR code but not account information');
        } else {
          self.account = content;
          preview.style.display = 'none';
        }
      });
      Instascan.Camera.getCameras().then(cameras => {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
          preview.style.display = 'inline-block';
        }
      }).catch(function (e) {
        throw e;
      });
    },
  },
}
</script>

<style>
#faucet-body {
  margin-left: 20%;
  margin-right: 20%;
}

#preview {
  margin-top: 15px;
  display: none;
}

.input-account {
  width: 100%;
}

.qrcode-img {
  width: 24px;
  height: 24px;
}

.qrcode-container {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}

.faucet-button{
  margin-top: 10px;
  margin-right: 5px;
  margin-bottom: 8px;
}

.input-qrcode-label {
  margin-top: 10px;
}
</style>
