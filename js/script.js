const startBtn = document.querySelector('#start-btn')
const nextBtn = document.querySelector('#next-btn')
const field = document.querySelector('.field')
const container = document.querySelector('.container')
const levelStr = document.querySelector('#levelStr')
const livesStr = document.querySelector('#livesStr')
const pointsStr = document.querySelector('#pointsStr')
const bestPointsStr = document.querySelector('#bestPointsStr')
const difficult = document.querySelector('#difficult')

const level1 = [
    [0, 0, 2, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 3, 0, 0],
]

const level2 = [
    [0, 0, 1, 1, 2],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [3, 1, 1, 0, 0],
]

let levels = {
    0: level1,
    1: level2
}

let current = 0
let lives = 3
let points = 0
let levelPoints = 0
let bestPoints = 0


let gameIsPaused = true
let hoverStart = false

const levelWin = (e) => {
    levelPoints = 0
    if (!gameIsPaused && hoverStart) {
        e.stopPropagation()
        gameIsPaused = true
        hoverStart = false
        current++
        field.textContent = `Уровень ${current} пройден`
        nextBtn.hidden = false
        startBtn.disabled = true
    }
}


let gameOver = () => {
    if (!gameIsPaused) {
        --lives
        points -= levelPoints
        pointsStr.textContent = `Баллы ${points}`
        levelPoints = 0
        if (lives <= 0) {
            alert('Вы проиграли!')
            if(bestPoints < points){
                bestPoints = points
                bestPointsStr.textContent = `Лучший результат: ${bestPoints}`
            }
            points = 0
            current = 0
            lives = 3
            difficult.disabled = false
        }
        fill()
        gameIsPaused = true
    }
}


const setRed = (square) => {
    startBtn.disabled = false
    square.classList.add('red')
    square.addEventListener('mouseover', gameOver)
}

const setGreen = (square) => {
    square.classList.add('green')
    square.addEventListener('mouseover', (e) => {
        e.stopPropagation()
        square.classList.add('green')
    })
}

const setStart = (square) => {
    square.classList.add('blue')
    square.textContent = 'S'
    square.addEventListener('mouseover', (e) => {
        e.stopPropagation()
        hoverStart = true
        container.addEventListener('mouseover', gameOver, {once: true})
        document.querySelector('.finish').addEventListener('mouseover', levelWin)
    })
}

const setFinish = (square) => {
    square.classList.add('blue', 'finish')
    square.textContent = 'F'
}

const fill = () => {
    field.innerHTML = ''
    livesStr.textContent = `Жизни: ${lives}`
    if (!levels[current]) {
        alert('поздравляем! Игра пройдена!')
        difficult.disabled = false
        current = 0
        lives = 3
        if(bestPoints < points){
            bestPoints = points
            bestPointsStr.textContent = `Лучший результат: ${bestPoints}`
        }
        points = 0
    }
    levelStr.textContent = `Текущий уровень ${current + 1}`
    levels[current].forEach(row => {
        row.forEach(item => {
            const square = document.createElement('div')
            const size = `${100 / levels[current].length}%`
            square.style.width = size
            square.style.height = size

            if (difficult.value === '1' || difficult.value === '3') {
                square.classList.add('square')
            }

            if (item === 0) {
                setRed(square)
            } else if (item === 1) {
                setGreen(square)
            } else if (item === 2) {
                setStart(square)
            } else if (item === 3) {
                setFinish(square)
            }
            field.append(square)
        })
    })
}

fill()


startBtn.addEventListener('click', () => {
    gameIsPaused = false
    startBtn.disabled = true
    difficult.disabled = true
    Array.from(field.children).forEach(square => {
        if(square.className.includes('green')){
            square.addEventListener('mouseover', () => {
                if(!gameIsPaused){
                    points += +difficult.value
                    levelPoints += +difficult.value
                    pointsStr.textContent = `Баллы ${points}`
                }
            }, {once:true})
        }
        square.classList.remove('red')
        square.classList.remove('green')
    })
})

nextBtn.addEventListener('click', () => {
    fill()
    nextBtn.hidden = true
    startBtn.disabled = false
})


difficult.addEventListener('change', () => {
    Array.from(field.children).forEach(square => {
        if (difficult.value === '1') {
            square.classList.add('square')
            field.style.cursor = 'default'
        } else if (difficult.value === '2') {
            square.classList.remove('square')
            field.style.cursor = 'default'
        } else if (difficult.value === '3') {
            square.classList.add('square')
            field.style.cursor = 'none'
        } else if (difficult.value === '4') {
            square.classList.remove('square')
            field.style.cursor = 'none'
        }
    })
})