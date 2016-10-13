/**
 * Created by 高乐天 on 16/10/8.
 */
let keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
let values = 'WW BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
let colors = [
    [0, 0, 0], // 黑
    [1, 0, 0], // 红
    [0, 1, 0], // 绿
    [0, 0, 1], // 蓝
    [1, 1, 0], // 黄
    [1, 0, 1], // 紫
    [0, 1, 1], // 青
    [1, 1, 1], // 白
]

let base64Encode = {}
let offset = 0;
let _array = keys.split('')

_array.forEach(key => {
    base64Encode[key] = ''

    offset++;
})


console.log(base64Encode)
//module.exports = {
//    'a'
//}
