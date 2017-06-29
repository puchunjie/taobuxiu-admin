<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { profile } from '@/utils/http'
  export default {
    name: 'app',
    watch: {
      '$route': function(a,b) {
          // 获取个人信息
            this.$http.get(profile).then(res => {
                if(res.data.status === 2){
                    // this.$router.push('/nadmin/login');
                    location.href = '/html/view/common/login.html';
                }
            });      
      }
    }
  }
</script>

<style>
.layout .ivu-menu-item-group-title{
    color: #000!important;
    font-weight: bold!important;
}
</style>



