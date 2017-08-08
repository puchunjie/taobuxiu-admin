<template>
    <Tabs>
        <Tab-pane label="关注范围设置">
            <div class="content">
                <div class="header clearfix">
                    <div class="type" style="line-height: 40px;">内容</div>
                    <div class="select-all" style="line-height: 40px;">全选</div>
                    <div class="range">范围</div>
                </div>
                <div class="sub-type clearfix" v-for="(item,index) in all" :key="index">
                    <div class="type">{{ item.name }}</div>
                    <div class="select-all">
                        <a class="btn" 
                        :class="{'active': all[index].list.length === all[index].value.length}"
                        @click="selectAll(index)"></a>
                    </div>
                    <div class="range">
                        <Checkbox-group v-model="item.value">
                            <Checkbox :label="el" v-for="(el,i) in item.list" :key="i"></Checkbox>
                        </Checkbox-group>
                    </div>
                </div>
            </div>
            <Button type="primary" class="save" :loading="isLoading" long
            @click="save">{{ isLoading ? '保存中..' : '保存' }}</Button>
        </Tab-pane>
    </Tabs>
</template>

<script>
    import { sironTypes, ssurfaces, smaterials, sproPlaces } from './data.js'
    import { followList, saveFollow } from '@/utils/http'
    export default {
        data () {
            return {
                isLoading: false,
                all:[{
                    name: '种类',
                    list: sironTypes,
                    value:[]
                },
                {
                    name: '材质',
                    list: smaterials,
                    value:[]
                },
                {
                    name: '表面',
                    list: ssurfaces,
                    value:[]
                },
                {
                    name: '产地',
                    list: sproPlaces,
                    value:[]
                }]
            }
        },
        methods: {
            // 获取关注数据
            getData(){
                this.$http.get(followList).then(res => {
                    let data = res.data.data;
                    if(res.data.status === 0){
                        this.all[0].value = data.types || [];
                        this.all[1].value = data.materials || [];
                        this.all[2].value = data.surfaces || [];
                        this.all[3].value = data.proPlaces || [];
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            },
            // 同步全选
            selectAll(index){
                let data = this.all[index];
                if(data.list.length === data.value.length){
                    data.value = []
                }else{
                    data.value = data.list;
                }
            },
            // 保存
            save(){
                this.isLoading = true;
                this.$http.post(saveFollow,{
                    types: JSON.stringify(this.all[0].value),
                    materials: JSON.stringify(this.all[1].value),
                    surfaces: JSON.stringify(this.all[2].value),
                    proPlaces: JSON.stringify(this.all[3].value)
                }).then(res => {
                    this.isLoading = false;
                    if(res.data.status === 0){
                        this.$Message.success('保存完毕！');
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            }
        },
        created () {
            this.getData()
        }
    }
</script>

<style scoped>
    .content{
        width: 100%;
        border: 1px solid #ddd;
        border-bottom: 0;
        font-size: 14px;
    }
    .header{
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #eee;
    }

    .header>div,.sub-type>div{
        float: left;
    }
    .type,.select-all{
        width: 10%;
        text-align: center;
        height: 100%;
        line-height: 100px;
        border-right: 1px solid #ddd;
    }
    .range{
        width: 80%;
    }
    .sub-type{
        width: 100%;
        height: 100px;
        border-bottom: 1px solid #ddd;
    }

    .select-all .btn{
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        color: #fff;
        border: 1px solid #a9a7a7;
    }
    .select-all .btn.active{
        border-color: #007de4;
        background: #007de4;
    }

    .btn.active::after{
        position: absolute;
        content: '√';
        line-height: 15px;
        color: #fff;
        left: 5px;
        font-weight: bold;
        top: 0;
        transform:rotate(18deg);
    }    

    .ivu-checkbox-wrapper{
        margin: 6px;
    }

    .save{
        margin: 10px 0 0 0;
    }
    /* .item{
        position: relative;
        display: inline-block;
        padding: 5px 10px;
        text-align: center;
        border: 1px solid #ddd;
        margin: 5px;
    }
    .active{
        border-color: #007de4;
        color: #007de4;
    }
    .active::before{
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        right: 0;
        bottom: 0;
        border-bottom: 20px solid #007de4;
        border-left: 20px solid transparent;
    }
    .active::after{
        position: absolute;
        content: "√";
        color: #fff;
        right: 3px;
        bottom: 0;
        font-weight: bold;
        transform:rotate(18deg);
    } */
</style>
