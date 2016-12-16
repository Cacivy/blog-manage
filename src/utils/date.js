const convertTen = (num) => {
   return num < 10 ? ('0' + num) : num
}

export const conertToDate = (val) => {
    let date = new Date(val)
    if (date.toString() === 'Invalid Date') {
        return '0000-00-00'
    }
    let year = date.getFullYear()
    let month = convertTen(date.getMonth() + 1)
    let day = convertTen(date.getDate())

    return `${year}-${month}-${day}`
}

export const pickerOptions = {
    shortcuts: [{
    text: '最近一周',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
    }
    }, {
    text: '最近一个月',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
    }
    }, {
    text: '最近三个月',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
    }
    }]
}