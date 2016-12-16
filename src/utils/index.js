export const toQueryString = (obj) => {
    if (typeof obj !== 'object') {
        return ''
    }
    let query = ['?']
    for (let key of Object.keys(obj)) {
        query.push(`${key}=${obj[key]}&`)
    }
    return substrLast(query.join(''), 1)
}

export const substrLast = (str, num) => {
    return str.substr(0, str.length - num)
}