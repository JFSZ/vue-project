<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="本地存储" name="localStorage">
        <Localstorage/>
      </el-tab-pane>
      <el-tab-pane label="云存储" name="cloudStorage">
        <CloudStorage/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Localstorage from './localStorage'
import CloudStorage from './cloudStorage'
export default {
  name: 'oss',
  data () {
    return {
      activeName: 'localStorage'
    }
  },
  components: {
    Localstorage,
    CloudStorage
  },
  activated () {},
  methods: {
    handleClick: function () {

    }
  }
}
</script>
