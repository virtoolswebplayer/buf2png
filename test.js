const fs = require('fs')
const {png2file, file2png} = require('./libs')

// png2file('test', 8)
// file2png(fs.readFileSync('./991k.zip'), {width: 600, height: 600})
// file2png(new Buffer(1024*1024))

let files = fs.readFileSync('./991k.zip').toString('base64')

fs.writeFileSync('./hhh.txt', files)

