<template>
  <div id="faucet-footer">
    <b-message type="is-success"
      v-if="this.transactionHash !== ''"
    >
      <a v-bind:href="`${explorerTxPrefix}${transactionHash}`" target="_blank">{{ transactionHash }}</a>
    </b-message>
    <b-message type="is-danger"
      v-else-if="this.errorMessage"
    >
      {{ errorMessage }}
    </b-message>
  </div>
</template>

<script>
export default {
  props: ['transactionHash', 'errorMessage', 'explorerTxPrefix']
}
</script>

<style>
#faucet-footer {
  margin-top: 6em;
  margin-left: 20%;
  margin-right: 20%;
}
</style>
