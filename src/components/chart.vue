<template>
    <div class="container" :style="{width: ['line'].includes(type) ? '80%' : '30%', height: ['line'].includes(type) ? '500px' : '100%'}">
        <h3>{{title}}</h3>
        <canvas width="300" height="300"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js'
import {creatChart} from '../utils/chart'
export default {
    props: {
        title: String,
        type: String,
        options: Object
    },
    mounted() {
        var ctx = this.$el.querySelector('canvas')
        var myChart = new Chart(ctx, creatChart(this.type, this.options))
    }
}
</script>

<style scoped>
h3 {
    text-align: center;
}
.container {
    width: 30%;
    margin: 0 10% 20px 10%;
    float: left;
}
</style>