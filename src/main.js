import sum from './sum'
import minus from './minus'
// 分隔线
import 'babel-polyfill' // Babel 只转换语法(如箭头函数)， 你可以使用 babel-polyfill 支持新的全局变量
import Modal from './components/modal/modal'
import './assets/style/common.less'
import _ from 'lodash'
import axios from 'axios'

console.log('sum:' + sum(1, 2))
console.log('minus:' + minus(2, 1))

const App = function () {
  const div = document.createElement('div')
  div.setAttribute('id', 'app')
  document.body.appendChild(div)
  const dom = document.getElementById('app')
  const modal = new Modal()
  dom.innerHTML = modal.template({
    title: '标题',
    content: '内容',
    footer: '底部'
  })
  const button = document.createElement('button')
  button.innerText = '点击'
  button.onclick = () => {
    const help = () => import('./helper')
    help()
  }
  document.body.appendChild(button)
}

const app = new App()
console.log(_.camelCase('Foo Bar'))
axios.get('aaa')
