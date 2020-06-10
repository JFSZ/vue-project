/**
 * 字体图标, 统一使用SVG Sprite矢量图标(http://www.iconfont.cn/）
 *
 * 使用:
 *  1. 在阿里矢量图标站创建一个项目, 并添加图标(这一步非必须, 创建方便项目图标管理)
 *  2-1. 添加icon, 选中新增的icon图标, 复制代码 -> 下载 -> SVG下载 -> 粘贴代码(重命名)
 *  2-2. 添加icons, 下载图标库对应[iconfont.js]文件, 替换项目[./iconfont.js]文件
 *  3. 组件模版中使用 [<icon-svg name="canyin"></icon-svg>]
 *
 * 注意:
 *  1. 通过2-2 添加icons, getNameList方法无法返回对应数据
 */
import Vue from 'vue'
import IconSvg from '../components/icon-svg'
import './iconfont.js'

Vue.component('IconSvg', IconSvg)

// require.context 获取一个特定的上下文,主要用来实现自动化导入模块
//  require.context(directory, useSubdirectories = false, regExp = /^.//);
// 参数: 1、directory 读取文件的路径 2、useSubdirectories 是否遍历文件的子目录 3、regExp 匹配文件的正则
const svgFiles = require.context('./svg', true, /\.svg$/)
const iconList = svgFiles.keys().map(item => svgFiles(item))

export default {
  // 获取图标icon-(*).svg名称列表, 例如[shouye, xitong, zhedie, ...]
  getNameList () {
    return iconList.map(item => item.default.id.replace('icon-', ''))
  }
}
