const fs = require('fs')
const PNG = require('pngjs').PNG;

let res = fs.readFileSync('./991k.zip')

let hex = res.toString('hex').toUpperCase()

// save to file
// let hexToBuf = Buffer.from(hex,'hex')
// fs.writeFileSync('./111copy.zip',hexToBuf)

let hexArray = hex.split('')


// 将一维数组分割为二维数组
function splitArray(src, length) {
    let dest = []
    for (let i = 0, len = src.length; i < len; i += length) {
        dest.push(src.slice(i, i + length))
    }
    return dest
}

/**
 * 初始化一个无透明图片buf
 * @param width
 * @param height
 * @returns {Buffer}
 */
function initBuf(width = 1024, height = 800) {
    var bitmapWithoutAlpha = new Buffer(width * height * 3);
    let ofs = 0;
    for (var i = 0; i < bitmapWithoutAlpha.length; i += 3) {
        bitmapWithoutAlpha[ofs++] = 0x00;
        bitmapWithoutAlpha[ofs++] = 0x00;
        bitmapWithoutAlpha[ofs++] = 0xff;
    }
    return bitmapWithoutAlpha
}

/**
 * 用hex字符填充图片数组
 * @param srcArray
 * @param dest
 */
function fillBuf(srcArray, dest) {
    const HexEnCode = require('./hexEncode')
    let ofs = 0;
    srcArray.forEach((c, i) => {
        let pixels = HexEnCode[`key${c.toString()}`]
        pixels.forEach(val => {
            dest[ofs++] = 0xff * val;
            dest[ofs++] = 0xff * val;
            dest[ofs++] = 0xff * val;
        })
    })
}

const imgWidth = 1024
const imgHeight = 800

/**
 * 1个字符 = 4 像素
 * 204800 个字符 = 1024*800 像素
 * 160000 个字符 = 800*800 像素
 */

let mutilArray = splitArray(hexArray, 204800)

mutilArray.forEach((item, index) => {
    let buf = initBuf()
    fillBuf(item, buf)

    savePng(buf, `test${index}`)
})

/**
 * 保存png
 * @param buf
 * @param filename
 * @param width
 * @param height
 */
function savePng(buf, filename, width = 1024, height = 800) {
    var png = new PNG({
        width: width,
        height: height,
        bitDepth: 8,
        colorType: 2,
        inputHasAlpha: false,
        bgColor: {red: 255, green: 0, blue: 0}
    });

    png.data = buf;
    png.pack().pipe(fs.createWriteStream(filename + '.png'));

}

