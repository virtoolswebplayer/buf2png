const fs = require('fs')
const PNG = require('pngjs').PNG;


module.exports = function (buf, opt) {
  let res = buf
  let base64 = res.toString('base64').replace('=', '')

  let option = opt || {width: 1024, height: 1024}

  let hexArray = base64.split('')
  const imgWidth = option.width
  const imgHeight = option.height

  /**
   * 1个字符 = 2 像素
   */

  let mutilArray = splitArray(hexArray, (imgWidth * imgHeight * 0.5))

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
    bitmapWithoutAlpha[ofs++] = 0xcc; //r
    bitmapWithoutAlpha[ofs++] = 0xcc; //g
    bitmapWithoutAlpha[ofs++] = 0xcc; //b
  }
  return bitmapWithoutAlpha
}

/**
 * 用hex字符填充图片数组
 * @param srcArray
 * @param dest
 */
function fillBuf(srcArray, dest) {
  const Base64Encode = require('./base64Encode')
  let ofs = 0;
  srcArray.forEach((char) => {
    let pixels = Base64Encode[`${char.toString()}`]

    for(let i=0; i< pixels.length; i++){
      dest[ofs++] = 0xff * pixels[i];
    }
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

