<template>
  <div id="app">
    <v-header></v-header>
    <v-tab></v-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <v-player></v-player>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from 'components/header/header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    components: {
      'v-header': Header,
      'v-tab': Tab,
      'v-player': Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
