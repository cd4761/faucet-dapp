<template>
  <div id="faucet-footer">
    <b-message type="is-success"
      v-if="this.transactionHash !== ''"
    >
     <a v-bind:href="`http://faucet.faraday.com/${this.transactionHash}`" target="_blank">{{ transactionHash }}</a>
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
  props: ['transactionHash', 'errorMessage']
}
</script>

<style>
#faucet-footer {
  margin-left: 6em;
  margin-right: 6em;
}
</style>
