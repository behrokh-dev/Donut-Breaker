
const game =document.querySelector('.game')
const bricksContainer = document.querySelector(".bricks")
const ball = document.querySelector(".ball")
const paddle = document.querySelector(".paddle")
const winPopup = document.querySelector(".win-popup")
const losePopup = document.querySelector(".lose-popup")
const playAgainBtns = document.querySelectorAll(".try")
const startScreen = document.querySelector(".start-screen")
const playBtn = document.querySelector(".play-btn")

let ballX = 400
let ballY = 350

let ballSpeedX = 3
let ballSpeedY = 3

let paddleX = 300

const paddleWidth = 200
const paddleHeight = 20

const ballSize = 160

const gameWidth = 800
const gameHeight = 500

const brickWidth = 80
const brickHeight = 60

const brickRows = 3
const brickCols = 8



const paddleBottom = 10
const paddleTop = gameHeight - paddleHeight - paddleBottom

const bricks = []


function createBricks(){
    for(let row=0; row< brickRows ; row++){
        for(let col=0; col<brickCols ; col++){
            const brick = document.createElement("img")
            brick.src = "assets/img/pinky.png"
            brick.classList.add("brick")


            const x = col * 90 + 20
            const y = row * 70 + 50 
            brick.style.left = x + "px"
            brick.style.top = y + "px"
            bricksContainer.appendChild(brick)
            bricks.push({
                x,
                y,
                alive: true,
                element: brick
            })
        }
    }
}


function updateObjects(){
    ball.style.left = (ballX - ballSize / 2) + "px"
    ball.style.top = (ballY - ballSize / 2) + "px"
    paddle.style.left = paddleX + "px"
}

createBricks()
updateObjects()


function animate() {

    ballX += ballSpeedX
    ballY += ballSpeedY

    if (ballX + ballSize / 2 >= gameWidth) {
        ballX = gameWidth - ballSize / 2
        ballSpeedX *= -1
    }

    if (ballX - ballSize / 2 <= 0) {
        ballX = ballSize / 2
        ballSpeedX *= -1
    }

    if (ballY - ballSize / 2 <= 0) {
        ballY = ballSize / 2
        ballSpeedY *= -1
    }

    if (
    ballY + ballSize / 2 >= paddleTop &&
    ballY + ballSize / 2 <= paddleTop + paddleHeight &&
    ballX >= paddleX &&
    ballX <= paddleX + paddleWidth
    ) {

        ballY = paddleTop - ballSize / 2
        ballSpeedY *= -1 
    }

    for (let item of bricks) {
        if (!item.alive) {
         continue
     }
     if (
    ballX + ballSize / 2 > item.x &&
    ballX - ballSize / 2 < item.x + brickWidth &&
    ballY + ballSize / 2 > item.y &&
    ballY - ballSize / 2 < item.y + brickHeight
     ) {
        item.alive = false
        item.element.remove()
        ballSpeedY *= -1

        if (checkWin()) {
        winPopup.classList.remove("hidden")
        return
}
     }  
    }

    if (ballY + ballSize / 2 >= gameHeight) {
    losePopup.classList.remove("hidden")
    return
    }

    updateObjects()

    requestAnimationFrame(animate)

}
playBtn.addEventListener("click", function(){

    startScreen.classList.add("hidden")

    animate()

})

game.addEventListener("mousemove", function(event){
    const rect = game.getBoundingClientRect()
    let mouseX = (event.clientX - rect.left) / scale
    paddleX = mouseX - paddleWidth / 2


    if (paddleX < 0) {
        paddleX = 0
    }

    if (paddleX > gameWidth - paddleWidth) {
        paddleX = gameWidth - paddleWidth
    }
})

game.addEventListener("touchmove", function(event){
    event.preventDefault()
    const rect = game.getBoundingClientRect()
    const touch = event.touches[0]
    let touchX = (touch.clientX - rect.left) / scale
    paddleX = touchX - paddleWidth / 2

    if (paddleX < 0) {
        paddleX = 0
    }

    if (paddleX > gameWidth - paddleWidth) {
        paddleX = gameWidth - paddleWidth
    }
}, { passive: false })

function checkWin() {
    return bricks.every(item => item.alive === false)
}

playAgainBtns.forEach(function(btn){

    btn.addEventListener("click", function(){

        location.reload()

    })

})


let scale = 1

function updateScale(){
    const wrapperWidth = game.parentElement.getBoundingClientRect().width
    scale = wrapperWidth / gameWidth
    game.style.transform = `scale(${scale})`
}

updateScale()
window.addEventListener("resize", updateScale)