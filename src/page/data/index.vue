<template>
    <div id="data">
        <chart 
        v-for="item in charts" 
        :title="item.title" 
        :type="item.type" 
        :options="item.options">
        </chart>
    </div>
</template>

<script>
import chart from '../../components/chart'
export default {
    components: {chart},
    data() {
        return {
            charts: []
        }
    },
    created() {
        this.$api.get_data().then(res => {
            this.charts = res.data.result
        })
    }
}
</script>