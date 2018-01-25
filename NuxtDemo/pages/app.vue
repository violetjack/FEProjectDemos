<template>
  <div>
    <mt-navbar v-model="selected">
        <mt-tab-item id="1">选项一</mt-tab-item>
        <mt-tab-item id="2">选项二</mt-tab-item>
        <mt-tab-item id="3">选项三</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
            <mt-cell v-for="n in 10" :key="n" :title="'内容 ' + n" />
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
            <mt-cell v-for="n in 4" :key="n" :title="'测试 ' + n" />
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
            <mt-cell v-for="n in 6" :key="n" :title="'选项 ' + n" />
        </mt-tab-container-item>
    </mt-tab-container>
    <mt-button class="button" type="danger" @click="hello">
        <i class="fa fa-address-book" aria-hidden="true"></i>
        commit
    </mt-button>
    <avatar/>
    <img src="~/static/logo.png" />
  </div>
</template>

<script>
// 也就是说，在js中导入的目录还是一样滴。别名这玩意是给HTML用的。
import { Toast } from 'mint-ui'
import avatar from '~/components/Avatar'
// import '~/assets/font-awesome/css/font-awesome.min.css'

export default {
    data() {
        return {
            selected: '1'
        }
    },
    methods: {
        hello() {
            Toast('hello world')
        }
    },
    components: {
        avatar
    },
    layout: 'page'
};
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
}

.button {
    margin: 30px;
    width: 90%;
}
</style>
