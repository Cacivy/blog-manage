<template>
    <div class="container" :style="styleObj">
        <h3>{{title}}</h3>
        <canvas width="400" height="400"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js'
import WordCloud from 'wordcloud'
import {creatChart, getRandomColor} from '../utils/chart'
export default {
    props: {
        title: String,
        type: String,
        options: Object
    },
    mounted() {
        var ctx = this.$el.querySelector('canvas')
        if (this.type === 'word') {
            let options = {
                list: this.options.list,
                color: getRandomColor,
                backgroundColor: '#fff'
            }
            WordCloud(ctx, options)
        } else {
            var myChart = new Chart(ctx, creatChart(this.type, this.options))
        }
    },
    computed: {
        styleObj() {
            return {
                width: ['line'].includes(this.type) ? '80%' : '30%', 
                height: ['line'].includes(this.type) ? '300px' : '100%'
            }
        }
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