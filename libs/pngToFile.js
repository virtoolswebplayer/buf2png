const fs = require('fs')
const PNG = require('pngjs').PNG
const HexEnCode = require('./hexEncode')

module.exports = function getFile(baseName, count) {
    let finalFile = ''
    let start = 0

    function _mergePng() {
        pngDecode(baseName+start+'.png').then((res) => {
            finalFile += res.join('')
            start++
            if(start < count) {
                _mergePng()
            } else {
                let hexToBuf = Buffer.from(finalFile,'hex')
                fs.writeFileSync(`${baseName}copy.zip`,hexToBuf )
            }
        })
    }

    _mergePng()
}


function pngDecode(pngName) {
    let final = []
    return new Promise(function(resolve, reject) {
        fs.createReadStream(pngName)
            .pipe(new PNG({
                colorType: 2 // 2 = rgb  6 = rgba
            }))
            .on('parsed', function () {
                let _res = []
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var idx = (this.width * y + x) << 2;
                        _res.push(pixToArray(this.data[idx], this.data[idx + 1], this.data[idx + 2]))
                    }
                }

                let mm = splitArray(_res, 4)
                mm.forEach(item => {
                    let key = item.join('')
                    if (key !== 'ZZZZ') {
                        final.push(HexEnCode[key])
                    }

                })
                resolve(final)
            })
    })
}


function pixToArray(r, g, b) {
    if (r > 100 && g > 100 && b > 100) {
        return '1'
    }
    if (r < 200 && g < 200 && b < 200) {
        return '0'
    }
    if (r < 200 && g < 200 && b > 100) {
        return 'Z'
    }
}

// 将一维数组分割为二维数组
function splitArray(src, length) {
    let dest = []
    for (let i = 0, len = src.length; i < len; i += length) {
        dest.push(src.slice(i, i + length))
    }
    return dest
}