<template>
  <div id="faucet-body">
    <slot name="faucet"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: null
    }
  }
}
</script>

<style>
#faucet-body {
  margin-left: 6em;
  margin-right: 6em;
  margin-bottom: 5em;
}
</style>
