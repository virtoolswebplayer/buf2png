/**
 * Created by gaoletian on 16/9/28.
 */
const fs =require('fs')

// let file = fs.readFileSync('./439k.zip')
let file = new Buffer(1024)

console.log(file.length)
console.log(file.toString('base64').length)
console.log(file.toString('hex').length)