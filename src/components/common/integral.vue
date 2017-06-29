<template>
    <Tabs>
        <Tab-pane label="积分管理">
            <Alert show-icon closable>
                <template slot="desc">
                    不好意思，当前版本暂不提供在线积分兑换哦，我们会尽快添加积分商城功能。
                </template>
            </Alert>
            <Alert type="success">
                <template slot="desc">
                    我的积分：<b class="integral">{{ integral }}</b>
                </template>
            </Alert>
        </Tab-pane>
    </Tabs>
</template>


<script>
    import { sIntegral, bIntegral } from '@/utils/http'

    export default {
        data(){
            return {
                integral: 0
            }
        },
        created () {
            let ajaxUrl = this.$route.params.identity === 'buyer' ? bIntegral : sIntegral;
            this.$http.get(ajaxUrl).then(res => {
                if(res.data.status === 0){
                    this.integral = res.data.data
                }else{
                    this.$Message.error(res.data.errorMsg);
                }
            })
        }
    }
</script>


<style scoped>
    .tite{
        font-size: 14px;
        color: #39f;
    }
    .integral{
        color: green;
        font-size: 20px;
        line-height: 20px;
        margin-top: 5px;
    }
</style>

