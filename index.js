const drawing = document.querySelector('#drawing')
const ColorBox = [
	[223, 12, 23, 1],
	[132, 223, 12, 1],
	[163, 49, 4, 1],
	[200, 8, 238, 1],
	[26, 160, 238, 1],
	[255, 255, 255, 1]
] //红 黄绿色  砖红色 紫色 蓝色 白色
resizeDra()
let context


function addMusic(type) {
	let url = ''
	let id = ''
	// 发射
	if (type == 1) {
		url = './发射.mp3'
		if (Math.random() > 0.5) {
			url = './发射2.mp3'
		}
	} else {
		// 爆炸
		url = './爆炸.mp3'
	}
	id = Math.random() + ''
	let ele = document.createElement('audio')
	ele.id = id
	ele.src = url
	ele.autoplay = "autoplay"
	ele.loop = false
	ele.volume=0.3
	ele.addEventListener('ended', () => {
		document.body.removeChild(ele)
	})
	document.body.appendChild(ele)
}
class TextContent {
	constructor({
		originx,
		originy,
		context,
		text
	}) {
		this.originx = originx
		this.originy = originy
		this.context = context
		this.text = text
		this.keepTime = 20
		this.delFlag = false
		this.timeIndex = 0
	}
	drawing() {
		this.context.font = 'bold 16px FiraCode'
		this.context.textAlign = 'center'
		this.context.fillText(this.text, this.originx, this.originy)
	}
	getNextStatus() {
		this.drawing()
		this.timeIndex++
		if (this.timeIndex > this.keepTime) {
			this.delFlag = true
		}

	}

}

// 一个烟花点，用来描述烟花店的属性和行为
class FirePoint {
	constructor({
		originx,
		originy,
		angle = 0,
		v = 0,
		color = [],
		context = null,
		ctr = null,
		flag
	}) {
		this.angle = angle //偏移角
		this.originx = originx //起始x坐标
		this.originy = originy //起始y坐标
		this.ctr = ctr //渲染队列
		this.g = 0.04 //重力加速度
		this.v = 0 //火星移动速度
		this.size = 0 //火星半径
		this.timeIndex = 0 //时间标识
		this.color = [] //['red','green','blue','opacity']
		this.type = 'FirePoint'
		this.keepTime = 35 //颜色多少时间后会开始变淡
		this.delFlag = false
		this.context = context
		this.colorReduce = .07
		this.flag=flag
		this.randomInit()
		if (v) this.v = v
		if (color) this.color = color
	}

	// 使用随机值初始化部分参数
	randomInit() {
		let v_x = 1.5,
			v_y = 2.5,
			v_r;
		v_r = Math.random() * v_x
		this.v = v_r + v_y
		this.size = Math.random() * 1 + 2
		this.randomColor(v_r, v_x) //计算爆炸后一个烟花点的颜色
	}
	drawing() {
		this.context.beginPath()
		this.context.arc(this._curx, this._cury, this.size, 0, 2 * Math.PI, false)
		this.context.closePath()
		this.context.fillStyle = this.getColor()
		this.context.fill()
	}
	getColor() {
		if (this.timeIndex > this.keepTime) {
			this.color[3] -= this.colorReduce //以每次0.2的速度不断变淡
			if (this.color[3] < 0) {
				this.color[3] = 0
				this.delFlag = true
			}
		}
		return ['rgb(', this.color.join(','), ')'].join('')
	}
	// 计算对应time内当前原点所在位置
	move() {
		// 使用三角函数计算出点击出周围点的圆心坐标
		this._curx = this.originx + Math.cos(this.angle) * this.v * this.timeIndex //x方向没有重力分量
		this._cury = this.originy + Math.sin(this.angle) * this.v * this.timeIndex + this.g * (this.timeIndex ** 2) / 2
		this.timeIndex++
	}
	createParticleTrace() {
		this.ctr.allFire.push(new ParticleTrace({
			originx: this._curx + Math.random() * 10 - 5.5,
			originy: this._cury,
			ctr: this.ctr,
			color: [...this.color],
			angle: this.angle,
			context: this.context
		}))

	}
	// 得到下秒的烟花点的状态
	getNextStatus() {
		this.move()
		this.timeIndex % 5 == 0&&this.flag && this.type == 'FirePoint' && this.createParticleTrace()
		this.drawing()
	}
	randomColor(v_r, v_x) {
		let index = parseInt(v_r * (ColorBox.length - 1) / v_x) //展示速度最快的颜色位于颜料盘最后面
		this.color = [...ColorBox[index]]
	}
}
// 椭圆形爆炸
class Ellipse extends FirePoint {
	constructor(...agr) {
		super(...agr)
		this.a = 30 //长轴
		this.b = 10 //短轴
		this.v = Math.random()*.5+2 //轴长变化速度
		this.type == 'ellipse'		
	}
	getNextStatus() {
		this._a = this.a + this.timeIndex * this.v
		this._b = this.b + this.timeIndex * this.v
		this._curx = this.originx + (this._a * Math.cos(this.angle)) * Math.cos(Math.PI / 6)
		this._cury = this.originy + (this._b * Math.sin(this.angle)) * Math.sin(Math.PI / 6)
		this.timeIndex++
		this.timeIndex % 10 == 0 &&this.flag&&this.createParticleTrace()
		this.drawing()
	}
}
// 粒子拖尾
class ParticleTrace extends FirePoint {
	constructor(...agr) {
		super(...agr)
		this.v = 0.2
		this.keepTime = 3
		this.colorReduce = 0.04
		this.g = .02
		this.size = 0.32
		this.type = 'ParticleTrace'
		if(agr[0].size){
			this.size=agr[0].size
		}
	}

}
// 未爆炸前的鞭炮
class ShootPoint extends FirePoint {
	constructor(...agr) {
		super(...agr)
		this.v = Math.random() * 1 + 5
		this.g = 0.01
		this.angle = -Math.PI * (Math.random() * .1 + .45)
		this.color = [...ColorBox[5]]
		this.type = 'ShootPoint'
		this.keepTime = 1000000
		this.t = parseInt(Math.random() * 10 + 70)
	}
	createFire() {
		let n = this.t
		let obj = FirePoint
		if (Math.random() > .6) {
			obj = Ellipse
		}
		let keyWords = ['2021', '力扣', 'Vue', '新的一年', '学习', '加油！', '小程序', 'webGL', 'Typescript']
		let randomIndex = ~~(Math.random() * (keyWords.length))
		this.ctr.allFire.push(new TextContent({
			originx: this._curx,
			originy: this._cury,
			context: this.context,
			text: keyWords[randomIndex]
		}))
		let color
		addMusic(0)
		while (n--) {
			color= [Math.random() * 255, Math.random() * 255, Math.random() * 255 + 100, 1].map(item => parseInt(item))
			let angle = n / this.t * 2 * Math.PI
			this.ctr.allFire.push(new obj({
				originx: this._curx,
				originy: this._cury,
				angle,
				color,
				flag:(n%3)==0,
				ctr: this.ctr,
				context: this.context
			}))
		}
	}
	// 重写获取下一状态的方法，为了生成爆炸特效
	getNextStatus() {
		this.move()
		let tiem = window.innerHeight / this.v * 0.8
		if (this.timeIndex > tiem) {
			this.delFlag = true
			this.createFire()
		}
		this.drawing()
		this.timeIndex % 2 == 0 && this.ctr.allFire.push(new ParticleTrace({
			originx: this._curx + Math.random() * 10 - 5.5,
			originy: this._cury,
			ctr: this.ctr,
			color: [...this.color],
			angle: this.angle,
			context: this.context
		}))


	}
}
// 烟花控制器，负责生成和绘制烟花
class FireCtr {
	constructor(x, y, context) {
		this.x = x
		this.y = y
		this.context = context
		this.timeIndex = 0
		this.allFire = [] //存储一次烟花绽放作业中的带处理作业
	}
	drawAll() {
		this.timeIndex++
		if (this.timeIndex % 50 == 0) {
			addMusic(1)
			this.allFire.push(new ShootPoint({
				originx: window.innerWidth / 2,
				originy: window.innerHeight,
				ctr: this,
				context: this.context
			}))
		}
		let i = this.allFire.length
		while (i--) {
			const item = this.allFire[i]
			item.getNextStatus()
			if (item.delFlag) {
				this.allFire.splice(i, 1)
			}
		}
	}
}
window.addEventListener('resize', resizeDra, false)
if (drawing.getContext) {
	context = drawing.getContext('2d')
}
window.addEventListener('load', fire)

function resizeDra() {
	drawing.width = window.innerWidth
	drawing.height = window.innerHeight
}

function clearDraw(x, y, x1, y1) {
	if (arguments.length == 4) {
		context.clearRect(x, y, x1, y1)
	} else {
		context.clearRect(0, 0, window.innerWidth, window.innerHeight)
	}
}

function getMouseXY(e) {
	e = e || window.event
	return [e.clientX, e.clientY]
}

let rafId

function fire(e) {
	clearDraw()
	cancelAnimationFrame(rafId)
	let index = 0
	let [x, y] = getMouseXY(e)
	let fireCtr = new FireCtr(x, y, context) //生成一个烟花，能爆出5十个小点
	let tick = () => {
		// 生成拖尾的关键代码
		// context.globalCompositeOperation='atop'
		context.fillStyle = 'rgb(0,0,0,.12)' //使用一个模糊遮罩不断模糊前一秒绘制的东西
		context.fillRect(0, 0, window.innerWidth, window.innerHeight)
		// context.globalCompositeOperation='screen'

		fireCtr.drawAll()
		rafId = requestAnimationFrame(tick)
	}
	tick()
}