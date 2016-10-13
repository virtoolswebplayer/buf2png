const fs = require('fs')
const PNG = require('pngjs').PNG
const _ = require('lodash')

let pngName = './sample.png'

let ocrDataBase = {
  '110000111110011001110011110011001111001100111000110011011011001011101100011110110011110011001111001110011001111100001111': '0',
  '111000111110000011110110001111111100111111110011111111001111111100111111110011111111001111111100111111110011111000000011': '1',
  '110000111110111001111111110011111111001111111100111111100011111110011111110011111110011111110011111110011111110000000001': '2',
  '100000111111111001111111110111111111011111111001111100001111111110011111111100111111110011111111001111111001111000001111': '3',
  '111100011111110001111110000111110010011111001001111001100111001110011100111001110000000001111110011111111001111111100111': '4',
  '100000011110011111111001111111100111111110011111111000001111111110001111111100111111110011111111001111111001111000001111': '5',
  '111000011111001111111001111111101111111100111111110000000111000111001100111100110011111011101111001110011100111100001111': '6',
  '000000000111111100111111110011111110011111111001111111101111111100111111110111111110011111111001111111001111111100111111': '7',
  '110000011110011100110011110011001111001110011100111000100111111000111110011000110011110011001111001100011100111000000111': '8',
  '110000111110011001110011110011001111001100111100110011110011100000001111111100111111110011111110011111110011111000011111': '9',
  '111000111111100011111100000111110010011111011001111001110111100111001110111100110000000011001111100100111110010111111101': 'A',
  '000000111100111001110011110011001111001100111001110000000111001111001100111100110011110011001111001100111101110000001111': 'B',
  '111000011110001111111001111111001111111100111111110011111111001111111100111111110011111111100111111110011110111100000111': 'C',
  '000000111100111001110011110011001111001100111100010011111001001111100100111110010011110011001111001100111001110000001111': 'D',
  '100000001110011111111001111111100111111110011111111000000011100111111110011111111001111111100111111110011111111000000011': 'E',
  '100000001110011111111001111111100111111110011111111001111111100000001110011111111001111111100111111110011111111001111111': 'F',
}

const hexStr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

fs.createReadStream(pngName)
  .pipe(new PNG({
    colorType: 2 // 2 = rgb  6 = rgba
  }))
  .on('parsed', function () {
    //let _res = []

    /**
     * 识别区域
     * 宽： 1890 每行 189 个字符
     * 高： 1046 共   48行文字
     *
     * 起始 坐标  x = 12 y = 27   结束  x = 1901, y = 1072
     *
     * 字符 高 12px 宽 10px
     */

    let _data = this.data

    let ocrInfo = {
      fontHeight: 12,
      fontWidth: 10,
      offsetTop: 27 + 22 * 47,
      offsetLeft: 12,
    }
    let scanInfo = {
      width: 1890,
    }

    let _study = []

    let ocrdb = {}

    /**
     * 自动学习
     */
    for (var y = ocrInfo.offsetTop; y < ocrInfo.offsetTop + ocrInfo.fontHeight; y++) {
      for (var x = ocrInfo.offsetLeft; x < ocrInfo.offsetLeft + scanInfo.width; x++) {
        let idx = (this.width * y + x) << 2;
        let char = getColor(_data[idx], _data[idx + 1], _data[idx + 2])

        let key = Math.floor((x - ocrInfo.offsetLeft) / 10).toString()

        if (!ocrdb.hasOwnProperty(key)) {
          ocrdb[key] = []
        }
        ocrdb[key].push(char)
        _study.push(getColor(_data[idx], _data[idx + 1], _data[idx + 2]))

      }
    }
    let lineArray = Object.keys(ocrdb).map((k) => ocrdb[k].join(''))


    // let _arr = Array.from(new Set(lineArray))
    //
    // let ex = {0: 9, 1: 3, 2: 1, 3: 13, 4: 21, 5: 0, 6: 2, 7: 4, 8: 29, 9: 12, A: 8, B: 24, C: 10, D: 15, E: 32, F: 11,}
    // Object.keys(ex).forEach(item => {
    //   let index = ex[item]
    //   console.log(`${item}:'${_arr[index]}',`)
    //
    // })

    // _arr.forEach((item, index) => {
    //   let ss = item.split('')
    //
    //   let aa = splitArray(ss, 10)
    //   console.log(index)
    //   console.log('\n')
    //   aa.forEach((item) => {
    //     console.log(item.join(''))
    //   })
    //   console.log('\n')
    //
    // })


    /** OCR*/
    let ocrResult = []
    lineArray.forEach(item => {

      if (!!ocrDataBase[item]) {
        ocrResult.push(ocrDataBase[item])
        return
      }
      let temp = Object.keys(ocrDataBase).map((item1) => {
        return item.split('').filter((val,index) => val === item1[index]).length
      })

      console.log(temp)
      let hexIndex = temp.indexOf(_.max(temp))

      ocrResult.push(hexStr[hexIndex])
    })

    console.log(ocrResult.join(''))
    console.log('abcd'[2])
    console.log(ocrResult.length)


    // splitArray(_study,1890).forEach(item => {
    //   console.log(item.join(''))
    // })

  })


function getColor (r, g, b) {
  // return (r * 0.3 + g * 0.59 + b * 0.11 >= 100) ? 1 : 0
  return (g >= 200) ? 1 : 0
}

// 将一维数组分割为二维数组
function splitArray (src, length) {
  let dest = []
  for (let i = 0, len = src.length; i < len; i += length) {
    dest.push(src.slice(i, i + length))
  }
  return dest
}


