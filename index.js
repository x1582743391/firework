const drawing = document.querySelector('#drawing')
const ColorBox = [[223, 12, 23,1], [132, 223, 12,1], [163, 49, 4,1], [200, 8, 238,1], [26, 160, 238,1], [255,255,255,1]] //红 黄绿色  砖红色 紫色 蓝色 白色
resizeDra()
let context


// 一个烟花点，用来描述烟花店的属性和行为
class FirePoint {
	constructor(originx, originy, angle) {
		this.angle = angle //偏移角
		this.originx = originx //其实x坐标
		this.originy = originy //起始y坐标
		this.g = 0.1 //重力加速度
		this.v = 0 //火星移动速度
		this.size = 0 //火星半径
		this.timeIndex = 0 //时间标识
		this.color = [],//['red','green','blue','opacity']
		this.type = 'FirePoint'
		this.keepTime=40//颜色多少时间后会开始变淡
		this.delFlag=false
		this.randomInit()
	}
	// 使用随机值初始化部分参数
	randomInit() {
		let v_x = 4,
			v_y = 4,
			v_r;
		v_r = Math.random() * v_x
		this.v = v_r + v_y
		this.size = Math.random() * 3 + 3
		this.randomColor(v_r, v_x) //计算爆炸后一个烟花点的颜色
	}
	getColor(){
		if(this.timeIndex>this.keepTime){
			this.color[3]-=0.02//以每次0.2的速度不断变淡
			if(this.color[3]<0) {
				this.color[3]=0
				this.delFlag=true
			}
		}
		return ['rgb(',this.color.join(','),')'].join('')
	}
	// 得到下秒的烟花点的状态
	getNextStatus() {
		// 使用三角函数计算出点击出周围点的圆心坐标
		let nextX = this.originx + Math.cos(this.angle) * this.v * this.timeIndex //x方向没有重力分量
		let nextY = this.originy + Math.sin(this.angle) * this.v * this.timeIndex + this.g * (this.timeIndex ** 2) / 2
		this.timeIndex++
		return [nextX, nextY, this.size, this.getColor()]
	}
	randomColor(v_r, v_x) {
		let index = parseInt(v_r * (ColorBox.length - 1) / v_x) //展示速度最快的颜色位于颜料盘最后面
		this.color = [...ColorBox[index]]
	}
}
// 未爆炸前的鞭炮
class ShootPoint extends FirePoint {
	constructor(...agr) {
		super(...agr)
		this.v = 5
		this.g = .03
		this.angle = -Math.PI * 0.5
		this.color = ColorBox[5]
		this.type = 'ShootPoint'
		this.keepTime=1000000
	}
}
// 烟花控制器，负责生成和绘制烟花
class FireCtr {
	constructor(n, x, y, context) {
		this.x = x
		this.y = y
		this.context = context
		// 如果传入的n非法，则生成随机数目的烟花点
		if (!n || n < 0) n = parseInt(Math.random() * 10 + 10)
		this.t = n
		this.allFire = [new ShootPoint(x, y)] //存储一次烟花绽放作业中的带处理作业

	}
	createFire(x, y) {
		let n = this.t
		while (n--) {
			let angle = n / this.t * 2 * Math.PI
			this.allFire.push(new FirePoint(x, y, angle))
		}
	}
	drawing(nextX, nextY, size, color) {
		this.context.beginPath()
		this.context.arc(nextX, nextY, size, 0, 2 * Math.PI, false)
		this.context.closePath()
		this.context.fillStyle = color
		this.context.fill()
	}
	drawAll() {
		for (let i = 0; i < this.allFire.length; i++) {
			const item = this.allFire[i]
			const statusInfo = item.getNextStatus(this)
			this.drawing.apply(this, statusInfo)
			if(item.delFlag){
				this.allFire.splice(i--,1)
			}
			if (item.type === 'ShootPoint' && item.timeIndex > 50 * 4) {
				// debugger
				this.allFire.splice(i, 1)
				i--
				this.createFire(...statusInfo) //鞭炮飞翔一定距离开始爆炸
			} 

		}
	}
}
window.addEventListener('resize', resizeDra, false)
if (drawing.getContext) {
	context = drawing.getContext('2d')
}
document.addEventListener('mousedown', fire)

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
	let fireCtr = new FireCtr(50, x, y, context) //生成一个烟花，能爆出5十个小点
	let tick = () => {
		// 生成拖尾的关键代码
		context.fillStyle = 'rgb(0,0,0,.15)' //使用一个模糊遮罩不断模糊前一秒绘制的东西
		context.rect(0, 0, window.innerWidth, window.innerHeight)
		context.fill()
		fireCtr.drawAll()
		if (index++ < 500) {
			rafId = requestAnimationFrame(tick)
		} else {
			cancelAnimationFrame(rafId)
		}
	}
	tick()
}