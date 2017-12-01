<template>
  <div id="app">
    <v-header></v-header>
    <v-tab></v-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from 'components/header/header'
  import Tab from 'components/tab/tab'

  export default {
    components: {
      'v-header': Header,
      'v-tab': Tab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
