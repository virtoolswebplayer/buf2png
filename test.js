const fs = require('fs')
const {png2file, file2png, file2png64} = require('./libs')

// png2file('test', 8)
// file2png(fs.readFileSync('./991k.zip'), {width: 600, height: 600})
// file2png(new Buffer(1024*1024))

//let files = fs.readFileSync('./991k.zip').toString('base64')
//console.log(files.substr(files.length-10))
//
//fs.writeFileSync('./hhh.txt', files)

//file2png64(fs.readFileSync('./991k.zip'), {width: 1280, height: 1024})

console.log(fs.readFileSync('./991k.zip').toString('base64'))

