// 获取贪吃蛇能够活动的最大范围
// 能够活动的最大宽度
const Snake_Max_Width = document.querySelector('.app').clientWidth - 30
// 能够活动的最大高度
const Snake_Max_Top = document.querySelector('.app').clientHeight - 30

var ul = document.querySelector('ul')
var items = Array.from(ul.children)
// 贪吃蛇每一步移动的长度，默认为 30px
const moveStep = 30

// 贪吃蛇实际上是一条长的小球构成的，为了方便描述蛇的运动的，为此需要构建一个小球
// 一个个小球的运动组成贪吃蛇的运动
/**
 * @class SnakeItem
 * @description 构成贪吃蛇的单元类，也就是小球的类
 * @param {HTMLElement} element 
 * @param {String} direction 小球当前运动的方向，默认值为右
 * @param {Number} moveStep 小球当前运动的速度，默认值为30px
 */
function SnakeItem(element, direction, moveStep){
    if(!(this instanceof SnakeItem)){
        return new SnakeItem(moveStep, direction)
    }
    this.element = element
    this.direction = direction || 'ArrowRight'
    this.moveStep = moveStep || 30
    // 初始化小球的转向集合
    this.DirectionCollections = []
}

/**
 * @function init
 * @description 将小球的位置初始化
 */
SnakeItem.prototype.init = function(left, top){
    this.element.style.left = left + 'px'
    this.element.style.top = top + 'px'
}

/**
 * @function moveLeft
 * @description 小球向左移动
 */
SnakeItem.prototype.moveLeft = function(){
    this.element.style.left = parseInt(this.element.style.left) - this.moveStep + 'px'
    this.direction = 'ArrowLeft'
}

/**
 * @function moveRight
 * @description 小球向右移动
 */
SnakeItem.prototype.moveRight = function(){
    this.element.style.left = parseInt(this.element.style.left) + this.moveStep + 'px'
    this.direction = 'ArrowRight'
}

/**
 * @function moveUp
 * @description 小球向上移动
 */
SnakeItem.prototype.moveUp = function(){
    this.element.style.top = parseInt(this.element.style.top) - this.moveStep + 'px'
    this.direction = 'ArrowUp'
}

/**
 * @function moveDown
 * @description 小球向下移动
 */
SnakeItem.prototype.moveDown = function(){
    this.element.style.top = parseInt(this.element.style.top) + this.moveStep + 'px'
    this.direction = 'ArrowDown'
}

/**
 * @function move
 * @description 小球根据当前的运动方向，然后进行相应的移动
 */
SnakeItem.prototype.move = function(direction){
    switch(direction || this.direction){
        case 'ArrowLeft':
            this.moveLeft()
            return
        case 'ArrowRight':
            this.moveRight()
            return
        case 'ArrowUp':
            this.moveUp()
            return
        case 'ArrowDown':
            this.moveDown()
            return
        default:
            this.moveRight()
            return
    }
}

/**
 * @function addColl
 * @description 向小球转向集合添加转向单元
 * @param {object} coll 转向单元
 */
SnakeItem.prototype.addColl = function(coll){
    this.DirectionCollections.push(coll)
}

/**
 * @function removeColl
 * @description 删除小球转向集合的首单元【删除第一个元素】
 */
SnakeItem.prototype.removeColl = function(){
    this.DirectionCollections.shift()
}

/**
 * @function clearColl
 * @description 清空小球的转向集合【删除所有元素】
 */
SnakeItem.prototype.clearColl = function(){
    this.DirectionCollections = []
}

/**
 * @function CanTurn
 * @description 判断是否可以转向
 * @returns {Boolean}
 */
SnakeItem.prototype.CanTurn = function(){
    // 如果转向集合为空，说明没有转向
    if(!this.DirectionCollections.length){
        return false
    }
    // 获取转向集合的首单元
    var param = this.DirectionCollections[0]
    // 获取位置信息 left 和 top
    var param_position = param.position
    // 获取运动方向信息
    var param_direction = param.direction
    var itemLeft = parseInt(this.element.style.left)
    var itemTop = parseInt(this.element.style.top)
    if(itemLeft === param_position.left && itemTop === param_position.top){
        this.direction = param_direction // 改变当前运动方向
        return true
    }else{
        return false
    }
}

/**
 * @function turn
 * @description 将小球转向
 */
SnakeItem.prototype.turn = function(){
    // 判断是否可以转角
    if(this.CanTurn()){
        this.removeColl() // 如果可以转向，那么将首项移除【因为首项的信息已经使用过了，可以删除了】
    }
    this.move() // 移动
}

/**
 * @class Snake
 * @description 贪吃蛇的类
 * @param {HTMLElement} items 
 * @param {String} direction 
 */
function Snake(items, direction){
    if(!(this instanceof Snake)){
        return new Snake(items, direction)
    }
    // 因为贪吃蛇实际上是由一个个小球组成，所以这里的 SnakeList 实际上就是小球的集合
    this.SnakeList = items.map(el=>{
        var snakeitem  = new SnakeItem(el, direction)
        return snakeitem
    })
    // 贪吃蛇的长度
    this.SnakeLength = items.length
    // 贪吃蛇的最原始长度
    // 这里需要记录最原始的长度，因为到时候重新开始游戏的时候需要重制贪吃蛇的长度
    this.OriginLength = items.length
    // 将贪吃蛇初始化
    this.init()
}

/**
 * @function init
 * @description 将贪吃蛇初始化
 */
Snake.prototype.init = function(){
    this.SnakeList.forEach((item, index)=>{
        var left = index*30
        item.init(left, 0)
    })
}

/**
 * @function isDead
 * @description 判断贪吃蛇是不是撞向边界，一旦撞向边界那么贪吃蛇就会死亡
 */
Snake.prototype.isDead = function(){
    var item = this.SnakeList[this.SnakeLength-1]
    var itemTop = parseInt(item.element.style.top)
    var itemLeft = parseInt(item.element.style.left)
    if(itemTop < 0 || itemTop > Snake_Max_Top){
        return true
    }
    if(itemLeft < 0 || itemLeft > Snake_Max_Width){
        return true
    }
    return false
}

/**
 * @function GameOver
 * @description 游戏结束，显示游戏结束界面
 */
Snake.prototype.GameOver = function(){
    const Model = document.querySelector('.model')
    Model.style.display = 'flex'
    const ModelText = document.querySelector('.model-text')
    const ModelButton = document.querySelector('.start-button')
    ModelText.innerHTML = 'Game Over'
    ModelButton.innerHTML = '重新开始'
}

/**
 * @function GameStart
 * @description 游戏开始，显示游戏开始界面
 */
Snake.prototype.GameStart = function(){
    const Model = document.querySelector('.model')
    Model.style.display = 'flex'
    const ModelText = document.querySelector('.model-text')
    const ModelButton = document.querySelector('.start-button')
    ModelText.innerHTML = 'Welcome To Game!'
    ModelButton.innerHTML = '开始游戏'
}

/**
 * @function Game
 * @description 游戏正在进行，这个时候游戏结束和游戏开始的界面的都要消失掉
 */
Snake.prototype.Game = function(){
    const Model = document.querySelector('.model')
    Model.style.display = 'none'
}

/**
 * @function getLastPosition
 * @description 获取贪吃蛇内 最后一个小球的位置信息 和 运动方向信息
 */
Snake.prototype.getLastPosition = function(){
    var lastItem = this.SnakeList[this.SnakeLength-1]
    var lastItem_left = parseInt(lastItem.element.style.left)
    var lastItem_top = parseInt(lastItem.element.style.top)
    return { left: lastItem_left, top: lastItem_top }
}

/**
 * @function getLastDirection
 * @description 获取贪吃蛇内 最后一个小球的 运动方向信息，这是为了初始化‘食物小球’的运动方向
 */
Snake.prototype.getLastDirection = function(){
    var lastItem = this.SnakeList[this.SnakeLength-1]
    return lastItem.direction
}

/**
 * @function addTurnPoint
 * @description 向贪吃蛇内的所有小球添加转向单元【转向单元包含 位置信息 和 运动方向】
 */
Snake.prototype.addTurnPoint = function(direction){
    var obj = this.getLastPosition()
    var coll = { position: obj, direction }
    this.SnakeList.forEach(el=>{
        el.addColl(coll)
    })
}

/**
 * @function clearTurnPoint
 * @description 清空贪吃蛇内所有小球的转向集合
 */
Snake.prototype.clearTurnPoint = function(){
    this.SnakeList.forEach(el=>{
        el.direction = 'ArrowRight'
        el.clearColl()
    })
}

/**
 * @function turn
 * @description 贪吃蛇进行转向
 */
Snake.prototype.turn = function(direction){
    // 先关掉定时器
    clearInterval(this.timer)
    // 然后添加转向单元
    this.addTurnPoint(direction)
    this.move()
}

/**
 * @function CanEatBall
 * @description 判断贪吃蛇是否可以吃掉 ‘食物小球’
 */
Snake.prototype.CanEatBall = function(ball){
    var lastItem = this.SnakeList[this.SnakeLength-1]
    var lastItem_left = parseInt(lastItem.element.style.left)
    var lastItem_top = parseInt(lastItem.element.style.top)
    switch(lastItem.direction){
        case 'ArrowUp':
            if(lastItem_top - 30 === ball.ballTop && lastItem_left === ball.ballLeft){
                return true
            }
            return false
        case 'ArrowDown':
            if(lastItem_top + 30 === ball.ballTop && lastItem_left === ball.ballLeft){
                return true
            }
            return false
        case 'ArrowLeft':
            if(lastItem_left - 30 === ball.ballLeft && lastItem_top === ball.ballTop){
                return true
            }
            return false
        case 'ArrowRight':
            if(lastItem_left + 30 === ball.ballLeft && lastItem_top === ball.ballTop){
                return true
            }
            return false
    }
}

/**
 * @function add
 * @description 贪吃蛇吃掉 ‘食物小球’
 */
Snake.prototype.add = function(node){
    var element = document.createElement('li')
    element.className = 'snake-item'
    element.style.backgroundColor = 'greenyellow'
    element.style.left = node.ballLeft + 'px'
    element.style.top = node.ballTop + 'px'
    ul.appendChild(element)
    var direction = this.getLastDirection()
    var snakeitem = new SnakeItem(element, direction)
    this.SnakeList.push(snakeitem)
    this.SnakeLength++
}

Snake.prototype.remove = function(){
    ul.removeChild(ul.children[this.SnakeLength-1])
    this.SnakeList.pop()
    this.SnakeLength--
}

/**
 * @function remake
 * @description 将贪吃蛇进行重制，当游戏重新开始的时候，要重制贪吃蛇
 */
Snake.prototype.remake = function(){
    // 判断贪吃蛇的长度是不是已经恢复到最原始的长度
    while(this.SnakeLength !== this.OriginLength){
        this.remove()
    }
}

/**
 * @function move
 * @description 贪吃蛇移动
 */
Snake.prototype.move = function(){
    this.timer = setInterval(()=>{
        // 判断贪吃蛇可不可以吃 ‘食物小球’
        if(this.CanEatBall(ball)){
            // 说明可以吃掉 ‘食物小球’
            // 先关掉定时器
            clearInterval(this.timer)
            // 吃 ‘食物小球’
            this.add(ball)
            // 将 ‘食物小球’ 的位置进行刷新
            ball.refresh()
            // 贪吃蛇吃完之后 继续移动
            this.move()
        }
        this.SnakeList.forEach(el=>{
            el.turn()
            // 判断贪吃蛇是不是撞墙死了
            if(this.isDead()){
                // 说明贪吃蛇已经撞墙了，执行死亡程序
                // 先关掉定时器
                clearInterval(this.timer)
                // 清空所有的转向集合
                this.clearTurnPoint()
                // 显示游戏结束界面
                this.GameOver()
            }
        })
    }, 300)
}

/**
 * @class Ball
 * @description ‘食物小球’的类
 */
function Ball(){
    if(!(this instanceof Ball)){
        return new Ball()
    }
    this.ball = document.querySelector('.ball')
    this.Max_Top_Count = Math.floor(Snake_Max_Top/30)
    this.Max_Left_Count = Math.floor(Snake_Max_Width/30)
    // 将 ‘食物小球’ 初始化
    this.init()
}

/**
 * @function init
 * @description 将 ‘食物小球’ 初始化
 */
Ball.prototype.init = function(){
    this.ballLeft = parseInt(getComputedStyle(this.ball).left)
    this.ballTop = parseInt(getComputedStyle(this.ball).top)
}

/**
 * @function refresh
 * @description 随机变换 ‘食物小球’ 的位置
 */
Ball.prototype.refresh = function(){
    this.ballLeft = Math.ceil(Math.random()*this.Max_Left_Count)*30
    this.ballTop = Math.ceil(Math.random()*this.Max_Top_Count)*30
    this.ball.style.left = this.ballLeft + 'px'
    this.ball.style.top = this.ballTop + 'px'
}

// 获取开始按钮
const StartButton = document.querySelector('.start-button')
// 创建 ‘食物小球’
const ball = new Ball()
// 创建一条 贪吃蛇
let snake = new Snake(items)
// 显示游戏开始界面
snake.GameStart()

// 
StartButton.onclick = function(){
    // 将贪吃蛇重制
    snake.remake()
    // 将贪吃蛇的位置初始化
    snake.init()
    // 开始进行游戏，关掉开始游戏或者重新开始的界面
    snake.Game()
    // 贪吃蛇开始移动
    snake.move()
}

// 监听键盘的按键，从而触发 贪吃蛇的转向
// ArrowUp ArrowDown ArrowLeft ArrowRight
document.body.onkeydown = function(evt){
    switch(evt.key){
        case 'ArrowUp':
            snake.turn('ArrowUp')
            return
        case 'ArrowDown':
            snake.turn('ArrowDown')
            return
        case 'ArrowLeft':
            snake.turn('ArrowLeft')
            return
        case 'ArrowRight':
            snake.turn('ArrowRight')
            return
    }
}