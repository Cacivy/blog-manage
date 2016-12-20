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
import API from '../../api'
export default {
    components: {chart},
    data() {
        return {
            charts: []
        }
    },
    created() {
        API.get_data().then(res => {
            this.charts = res.data.result
        })
    }
}
</script>