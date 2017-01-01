export const chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
    PaleTurquoise1: '#BBFFFF',
    PaleTurquoise3: '#96CDCD',
    Aquamarine1: '#7FFFD4',
    SeaGreen4: '#2E8B57',
    Green2: '#00EE00'
}

// pie & doughnut
const data1 = {
    labels: [
        "Red",
        "Blue",
        "Yellow"
    ],
    datasets: [
    {
        data: [300, 50, 100],
        backgroundColor: [],
        hoverBackgroundColor: [],
        hoverBorderColor: [],
        hoverBorderWidth: []
    }]
};

// line
const data2 = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
            
        }
    ],
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    stepSize: 1
                }
            }]
        },
        maintainAspectRatio: false,
        responsive: true
    }
};

export const getRandomColor = function(){
    return `rgba(${(Math.floor(Math.random() * 256))}, ${(Math.floor(Math.random() * 256))}, ${(Math.floor(Math.random() * 256))}, 0.7)`;
 }

export const creatChart = (type, options) => {
    let data = {}

    // common
    if (['pie', 'doughnut'].includes(type)) {
        data = JSON.parse(JSON.stringify(data1))
        if (options.labels) {
            data.labels = options.labels
        }
        
        if (options.data) {
            let datasets = data.datasets[0]
            datasets.data = options.data
            datasets.data.forEach((x, index) => {
                let keys = Object.keys(chartColors)
                let color = getRandomColor() // chartColors[keys[index]] || '#FF6384'
                datasets.backgroundColor.push(color)
                datasets.hoverBackgroundColor.push(color)
                datasets.hoverBorderColor.push('#ABC')
                datasets.hoverBorderWidth.push(3)
            })
        }
    } else if (['line'].includes(type)) {
        data = JSON.parse(JSON.stringify(data2))
        let datasets = data.datasets[0]

        if (options.labels) {
            data.labels = options.labels
        }

        if (options.label) {
            datasets.label = options.label
        }

        if (options.data) {
            datasets.data = options.data
        }
    }

    let config = {
        type,
        data,
        options: data.options,
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
    return config
}