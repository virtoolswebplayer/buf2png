const fs = require('fs')
const PNG = require('pngjs').PNG;


module.exports = function (buf, opt) {
    let res = buf
    let hex = res.toString('hex').toUpperCase()

    let option = opt || {width: 1024, height: 1024}

    let hexArray = hex.split('')
    const imgWidth = opt.width
    const imgHeight = opt.height

    /**
     * 1个字符 = 4 像素
     * 262144 个字符 = 1024*1024 像素
     * 204800 个字符 = 1024*800 像素
     * 160000 个字符 = 800*800 像素
     */

    let mutilArray = splitArray(hexArray, (imgWidth * imgHeight * 0.25))

    mutilArray.forEach((item, index) => {
        let buf = initBuf(imgWidth, imgHeight)
        fillBuf(item, buf)

        savePng(buf, `test${index}`, imgWidth, imgHeight)
    })

}


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
        let pixels = HexEnCode[`${c.toString()}`]
        pixels.forEach(val => {
            dest[ofs++] = 0xff * val;
            dest[ofs++] = 0xff * val;
            dest[ofs++] = 0xff * val;
            // dest[ofs++] = 0xff * val;
        })
    })
}


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

