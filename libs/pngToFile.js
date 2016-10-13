const fs = require('fs')
const PNG = require('pngjs').PNG
const HexEnCode = require('./hexEncode')

/**
 * 解码序列png图片，还原原始文件
 * @param baseName
 * @param count
 */
module.exports = function getFile(baseName, count) {
    let finalFile = ''
    let start = 0

    /**
     * 递归解码 png 合并为一个长的 hex 字符串
     * hex字符串 转 Buffer 得到文件。
     * @private
     */
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

/**
 * png解码算法
 * 每4个像素 白色为1 黑色为0 蓝色为 z 表示结束符， 如 4个像素最终 为 0001 , 对应 hexEncode 里的 3
 * @param pngName
 * @returns {Promise}
 */
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
                // 四个像素一组，对应一个hex字符
                let mm = splitArray(_res, 4)
                mm.forEach(item => {
                    let key = item.join('')
                    // 非结束符合并到 hex 字符串
                    if (key !== 'ZZZZ') {
                        final.push(HexEnCode[key])
                    }

                })
                resolve(final)
            })
    })
}

/**
 * 判断当前像素 白色为1 黑色为0 蓝色为 z 表示结束符
 * @param r
 * @param g
 * @param b
 * @returns {0|1|Z}
 */
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