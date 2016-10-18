/**
 * Created by 高乐天 on 16/10/8.
 */
let keys = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/'
let colors = [
  [0, 0, 0], // 黑
  [0, 0, 1], // 红
  [0, 1, 0], // 绿
  [1, 0, 0], // 蓝
  [1, 1, 0], // 黄
  [1, 0, 1], // 紫
  [0, 1, 1], // 青
  [1, 1, 1], // 白
]

let base64Encode = {}
colors.forEach((item, index) => {
  colors.forEach((item1, index2) => {
    let i = index * 8 + index2
    let key = keys[i]
    let val = colors[index].join('') + colors[index2].join('')
    base64Encode[key] = val
    //base64Encode[val] = key
  })
})

module.exports = base64Encode

console.log(base64Encode)
