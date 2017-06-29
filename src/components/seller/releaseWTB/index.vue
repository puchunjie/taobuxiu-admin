<template>
    <Tabs>
        <Tab-pane label="不锈钢产品">
            <div class="from-content">
                <product-from></product-from>
            </div>
        </Tab-pane>
        <Tab-pane label="加工服务">
            <div class="from-content">
                <machining-from></machining-from>
            </div>
        </Tab-pane>
    </Tabs>
</template>


<script>
    import productFrom from './productFrom.vue'
    import machiningFrom from './machiningFrom.vue'
    export default {
        components: {
            productFrom,
            machiningFrom
        }    
    }
</script>


<style scoped>
    .from-content{
        width:550px;
        position: relative;
    }
</style>
