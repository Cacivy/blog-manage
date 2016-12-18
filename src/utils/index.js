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

export const wordCount = (data) => {
  var pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
  var m = data.match(pattern);
  var count = 0;
  if( m === null ) return count;
  for (var i = 0; i < m.length; i++) {
    if (m[i].charCodeAt(0) >= 0x4E00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
}