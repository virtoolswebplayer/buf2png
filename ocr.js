const fs = require('fs')
const PNG = require('pngjs').PNG

let pngName = './sample.png'

let ocrDataBase = []

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

    //let skip = 0
    //
    //
    //for (var y = 27; y <= 1072; y++) {
    //
    //    if (skip > 0 && (skip % 12 == 0)) {
    //        y += 10
    //    }
    //
    //    if (y > 1072) {
    //        break
    //    }
    //
    //    //for (var x = 12; x <= 1901; x++) {
    //    for (var x = 12; x <= 12 + 229; x++) {
    //        var idx = (this.width * y + x) << 2;
    //        _res.push(getColor(this.data[idx], this.data[idx + 1], this.data[idx + 2]))
    //    }
    //
    //    skip++
    //}
    //
    ////let mm = splitArray(_res, 1890)
    //let mm = splitArray(_res, 230)
    //mm.forEach(item => {
    //    let lineStr = item.join('')
    //    console.log(lineStr)
    //})

    let _data = this.data

    let ocrInfo = {
      fontHeight: 12,
      fontWidth: 10,
      offsetTop: 27,
      offsetLeft: 12,
    }
    let scanInfo = {
      width: 1890,
    }

    let _study = []

    let ocrdb = {
    }

    /**
     * 自动学习
     */
    for (var y = ocrInfo.offsetTop; y < ocrInfo.offsetTop + ocrInfo.fontHeight; y++) {
      for (var x = ocrInfo.offsetLeft; x < ocrInfo.offsetLeft + scanInfo.width; x++) {
        let idx = (this.width * y + x) << 2;
        let char = getColor(_data[idx], _data[idx + 1], _data[idx + 2])

        let key = Math.floor((x - ocrInfo.offsetLeft) / 10).toString()

        if(!ocrdb.hasOwnProperty(key)){
          ocrdb[key] = []
        }
        ocrdb[key].push(char)
        //_study.push(getColor(_data[idx], _data[idx + 1], _data[idx + 2]))

      }
    }


    //let arr = Object.keys(ocrdb).map((k) => ocrdb[k])

    console.log(`'5':'${ocrdb[0].join('')}',`)
    console.log(`'2':'${ocrdb[1].join('')}',`)
    console.log(`'6':'${ocrdb[2].join('')}',`)
    console.log(`'1':'${ocrdb[3].join('')}',`)
    console.log(`'7':'${ocrdb[4].join('')}',`)
    console.log(`'A':'${ocrdb[9].join('')}',`)
    console.log(`'0':'${ocrdb[10].join('')}',`)

    //let mm = splitArray(_study, scanInfo.width)
    //
    //mm.forEach(item => {
    //  let lineStr = item.join('')
    //  console.log(lineStr)
    //})
//`
//1000000111
//1001111111
//1001111111
//1001111111
//1001111111
//1000001111
//1111100011
//1111110011
//1111110011
//1111110011
//1111100111
//1000001111
//`

  })


function getColor(r, g, b) {
  return (r * 0.3 + g * 0.59 + b * 0.11 >= 140) ? 1 : 0
}

// 将一维数组分割为二维数组
function splitArray(src, length) {
  let dest = []
  for (let i = 0, len = src.length; i < len; i += length) {
    dest.push(src.slice(i, i + length))
  }
  return dest
}

