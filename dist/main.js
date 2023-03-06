/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/css/main.scss":
/*!***************************!*\
  !*** ./src/css/main.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/main.scss */ "./src/css/main.scss");


function creatEl(name) {
    return document.createElement(name ? name : 'div')
}

let sArr = []
let sTime = 0
let sMoves = 0
let sActive = false
let sSize = 4
let isMoveing = false
let sPaused = false
let sFinished = false
let isMenuOpened = false
let wasActive = false
let soundOn = localStorage.getItem('soundOn')
soundOn = soundOn ? soundOn == 'true' : true

let resultArr = getResultsArray()

let nMoves, nTime, nMenu, nGame, nullGap

let body = document.body

function createAllElements() {
    let elContainer = creatEl()
    elContainer.classList.add('container')
    const elMenu = createElMenu()
    const elState = creatElState()
    nGame = creatElGame()
    const elСhoice = creatElChoice()

    elContainer.appendChild(elMenu)
    elContainer.appendChild(elState)
    elContainer.appendChild(nGame)
    elContainer.appendChild(elСhoice)
    body.appendChild(elContainer)
    refreshDrags()
}

function createElMenu() {
    const elMenu = creatEl()
    elMenu.classList.add('menu-block')
    const elMenuBtn = creatEl('button')
    elMenuBtn.classList.add('menu-button')
    elMenuBtn.textContent = 'menu'
    elMenuBtn.onclick = () => showMenu()
    elMenuBtn.onmouseover = playHover
    elMenu.appendChild(elMenuBtn)
    nMenu = elMenuBtn
    return elMenu
}
function creatElState() {
    const elState = creatEl()
    elState.classList.add('state')
    const elMoves = creatEl('p')
    elMoves.classList.add('state__moves')
    elMoves.textContent = 'Moves: 0'
    const elTime = creatEl('p')
    elTime.classList.add('state__time')
    elTime.textContent = 'Time: 00:00'

    elState.appendChild(elMoves)
    elState.appendChild(elTime)
    nMoves = elMoves
    nTime = elTime
    return elState
}
function creatElChoice() {
    const elСhoice = creatEl('')
    elСhoice.classList.add('choice')

    const elChoiseBlock = creatEl('ul')
    elChoiseBlock.classList.add('choice__list')

    new Array(3, 4, 5, 6, 7, 8).forEach(s => {
        const elLi = creatEl('li')
        elLi.classList.add('choice__size-'+s)
        elLi.textContent = s + 'x' + s
        elLi.onmouseover = playHover
        elLi.onclick = () => {
            playClick()
            sPaused = false;
            changeSize(s)
        }
        elChoiseBlock.appendChild(elLi)
    });
    
    elСhoice.appendChild(elChoiseBlock)
    return elСhoice
}

function creatElGame() {
    const elGame = creatEl()
    elGame.classList.add('game-wrapper')
    const elGrid = creatEl()
    elGrid.classList.add('game-grid')
    elGrid.classList.add('game-grid_'+sSize)

    const elChoiseTitle = creatEl('h3')
    elChoiseTitle.classList.add('choice__title')
    elChoiseTitle.textContent = 
        'Frame size: ' + sSize + 'x' + sSize

    for(let i = 0; i < sArr.length; i++) {
        for(let j = 0; j < sArr[i].length; j++){
            const elGap = creatEl()
            elGap.classList.add('game-grid__sell')
            elGap.classList.add('game-grid__sell_'+(i * sSize + j + 1))
            const elTile = creatEl()
            if(sArr[i][j] != 0) {
                elTile.classList.add('game-grid__tile')
                elTile.classList.add('game-grid__tile_'+sArr[i][j])
                elTile.textContent = sArr[i][j]
                elTile.addEventListener('click', moveClick)
                elGap.appendChild(elTile)
            } else {
                nullGap = elGap
            }
            elGrid.appendChild(elGap)
        }
    }

    elGame.appendChild(elChoiseTitle)
    elGame.appendChild(elGrid)
    return elGame
}

function createStartArray() {
    sArr = []
    for (let i = 0; i < sSize; i++) {
        sArr.push(new Array(sSize))
        for (let j = 0; j < sSize; j++) {
            sArr[i][j] = i * sSize + j + 1
        }
    }
    sArr[sSize - 1][sSize - 1] = 0
}

function changeSize(s) {
    playNewGame()
    sFinished = false
    sActive = false
    sSize = s
    sTime = 0
    sMoves = 0
    body.innerHTML = ''
    isMoveing = false
    runGame()
}

//ACTIONS

function moveClick(e) {
    if(isMoveing || !sActive) return
    isMoveing = true
    let num = Number(this.classList[1].split('_')[3])
    let [cI, cJ, nullI, nullJ] = findNumAndZero(num)
    //1 - if this tile next to gap
    if (Math.abs(nullI - cI) + Math.abs(nullJ - cJ) != 1) {
        isMoveing = false
        return
    }
    playMove()
    nMoves.textContent = 'Moves: ' + ++sMoves
    sArr[nullI][nullJ] = num
    sArr[cI][cJ] = 0
    let newGap = this.parentNode
    let classMove = ''
    if(nullI == cI && nullJ < cJ) classMove = 'move-left'
    if(nullI == cI && nullJ > cJ) classMove = 'move-right'
    if(nullI < cI && nullJ == cJ) classMove = 'move-up'
    if(nullI > cI && nullJ == cJ) classMove = 'move-down'
    this.classList.add(classMove)
    checkMoveForEnd()
    setTimeout(() => {
        this.classList.remove(classMove)
        nullGap.appendChild(this)
        nullGap = newGap
        isMoveing = false
        refreshDrags()
    }, 200);
}
function findNumAndZero(num = -1) {
    let cI = -1
    let cJ = -1
    let nullI = -1
    let nullJ = -1
    for(let i = 0; i < sArr.length; i++) {
        for(let j = 0; j < sArr[i].length; j++) {
            if(num != -1 && sArr[i][j] == num) { cI = i; cJ = j; }
            if(sArr[i][j] == 0) { nullI = i; nullJ = j }
        }
    }
    return Array(cI, cJ, nullI, nullJ)
}

function startGame(isLoaded = false) {
    if(!isLoaded) shufleArray()
    sActive = true
}

//TIMER
setTimeout(() => {
    timerSec()
}, 1000);
function timerSec() {
    setTimeout(() => {
        timerSec()
    }, 1000);
    if(!sActive) return
    sTime++
    nTime.textContent = 'Time: '+getTimeStr(sTime)
}
function getTimeStr(t) {
    let m = Math.trunc(t / 60)
    let s = t % 60
    return (m < 10 ? "0" + m : m) + ':' + (s < 10 ? "0" + s : s)
}

function shufleArray() {
    let rndMoves = Math.trunc(Math.random() * sSize**3 + sSize ** 5)
    // let rndMoves = 3
    
    for(let k = 0; k < rndMoves; k++) {
        let moveNum = -1
        while(moveNum < 1 || moveNum > 4) {
            moveNum = Math.trunc( Math.random() * 4 + 1 )
        }
        const [cI, cJ, nullI, nullJ] = findNumAndZero()
        if(moveNum == 1) { nullI < sSize - 1 ? move(1, 0, nullI, nullJ) : move(-1, 0, nullI, nullJ)}
        if(moveNum == 2) { nullI > 0 ? move(-1, 0, nullI, nullJ) : move(1, 0, nullI, nullJ)}
        if(moveNum == 3) { nullJ < sSize - 1 ? move(0, 1, nullI, nullJ) : move(0, -1, nullI, nullJ)}
        if(moveNum == 4) { nullJ > 0 ? move(0, -1, nullI, nullJ) : move(0, 1, nullI, nullJ)}
    }

    function move(i = 0, j = 0, nullI, nullJ) {
        sArr[nullI][nullJ] = sArr[nullI + i][nullJ + j]
        sArr[nullI + i][nullJ + j] = 0
    }
}

function checkMoveForEnd() {
    let isEnd = sArr.flat().reduce((w, c, i) => w && ((c == i + 1) || (c == 0)), true)
    if(isEnd) {
        showMessage("Hooray! You solved the puzzle in "+getTimeStr(sTime)+" and "+sMoves+" moves!", 3000, true)
        saveResult()
        sFinished = true
        sActive = false
        sMoves = 0;
        sTime = 0;
    }
}

function showMessage(msg, timeout = 3000, isVictory = false) {
    isVictory ? playVictory() : playMessage()
    const popup = creatEl()
    popup.classList.add('popup')
    const popupBack = creatEl()
    popupBack.classList.add('popup__back')
    const popupMessage = creatEl()
    popupMessage.classList.add('popup__message')
    popupMessage.textContent = msg

    popup.appendChild(popupBack)
    popup.appendChild(popupMessage)
    body.appendChild(popup)

    setTimeout(() => {
        body.removeChild(popup)
    }, timeout);
}

//MENU
function showMenu() {
    if(isMenuOpened) {
        isMenuOpened = false
        hideMenu()
        return
    }
    isMenuOpened = true
    playClick()
    wasActive = sActive
    sActive = false
    if(!sFinished) hideGame()
    const elMenu = creatEl()
    elMenu.classList.add('menu')
    const elMenuWrapper = creatEl()
    elMenuWrapper.classList.add('menu__wrapper')

    const elBtnStart = creatEl('button')
    elBtnStart.classList.add('menu__button')
    elBtnStart.classList.add('menu__btn-start')
    elBtnStart.textContent = sPaused ? 'resume' : 'new game'
    elBtnStart.onclick = () => resumeGame()

    const elBtnPause = creatEl('button')
    elBtnPause.classList.add('menu__button')
    elBtnPause.classList.add('menu__btn-pause')
    elBtnPause.textContent = 'pause'
    elBtnPause.onclick = () => pauseGame()

    const elBtnSave = creatEl('button')
    elBtnSave.classList.add('menu__button')
    elBtnSave.classList.add('menu__btn-save')
    elBtnSave.textContent = 'save'
    elBtnSave.onclick = () => saveGame(wasActive)

    const elBtnLoad = creatEl('button')
    elBtnLoad.classList.add('menu__button')
    elBtnLoad.classList.add('menu__btn-load')
    elBtnLoad.textContent = 'load'
    elBtnLoad.onclick = () => loadGame()

    const elBtnResults = creatEl('button')
    elBtnResults.classList.add('menu__button')
    elBtnResults.classList.add('menu__btn-results')
    elBtnResults.textContent = 'results'
    elBtnResults.onclick = () => {
        showResults(sSize, wasActive)
        setTimeout(() => {
            sActive = false
            if(!sFinished) hideGame()
        }, 4);
    }

    const elBtnSound = creatEl('button')
    elBtnSound.classList.add('menu__button')
    elBtnSound.classList.add('menu__btn-sound')
    if(soundOn) elBtnSound.classList.add('menu__btn-sound_on')
    elBtnSound.textContent = 'sound (' + (soundOn ? 'on)' : 'off)')
    elBtnSound.onclick = switchSound

    elMenuWrapper.appendChild(elBtnStart)
    elMenuWrapper.appendChild(elBtnPause)
    elMenuWrapper.appendChild(elBtnSave)
    elMenuWrapper.appendChild(elBtnLoad)
    elMenuWrapper.appendChild(elBtnResults)
    elMenuWrapper.appendChild(elBtnSound)
    elBtnStart.onmouseover = playHover
    elBtnPause.onmouseover = playHover
    elBtnSave.onmouseover = playHover
    elBtnLoad.onmouseover = playHover
    elBtnResults.onmouseover = playHover
    elBtnSound.onmouseover = playHover

    elMenu.appendChild(elMenuWrapper)
    nMenu.after(elMenu)
    setTimeout (() => {
        body.onclick = () => hideMenu(elMenu)
    }, 2)
    function hideMenu() {
        if(document.querySelector('.menu-block').children.length >= 2) {
            isMenuOpened = false
            document.querySelector('.menu-block').removeChild(document.querySelector('.menu-block').children[1])
            if(!sPaused) showGame()
            sActive = wasActive
        }
        body.onclick = null
    }
}

function resumeGame() {
    playClick()
    setTimeout(() => {
        showGame()
        if(sPaused && !sFinished) {
            showMessage("Resume game", 1500)
            setTimeout(() => {
                sActive = true
                sPaused = false
            }, 1500);
        } else {
            changeSize(sSize)
            sActive = false
            playNewGame()
            showMessage("New game started", 1500)
            setTimeout(() => {
                sActive = true
            }, 1500);
        }
    }, 2)
}
function pauseGame() {
    playClick()
    if(sFinished) return
    setTimeout(() => {
        hideGame()
        sActive = false
        sPaused = true
    }, 2)
}
function saveGame(wActive) {
    playClick()
    setTimeout(() => {
        localStorage.setItem('array', JSON.stringify(sArr))
        localStorage.setItem('time', sTime)
        localStorage.setItem('moves', sMoves)
        localStorage.setItem('size', sSize)
        localStorage.setItem('active', wActive)
        localStorage.setItem('paused', sPaused)
        localStorage.setItem('finished', sFinished)

        let wasActive = sActive
        sActive = false
        showMessage("Game has been saved!", 2000)
        setTimeout(() => {
            sActive = wasActive
        }, 2000);
    }, 2)
}
function loadGame() {
    playClick()
    setTimeout(() => {
        let gArr = localStorage.getItem('array')
        let gTime = localStorage.getItem('time')
        let gMoves = localStorage.getItem('moves')
        let gSize = localStorage.getItem('size')
        let gActive = localStorage.getItem('active')
        let gPaused = localStorage.getItem('paused')
        let gFinished = localStorage.getItem('finished')
        if(!gArr || !gTime || !gMoves || !gSize || !gActive || !gPaused || !gFinished) {
            let wasActive = sActive
            sActive = false
            showMessage("Nothing to load! :(", 2000)
            setTimeout(() => {
                sActive = wasActive
            }, 2000);
            return
        }
        // changeSize(Number(gSize))
        sSize = Number(gSize)
        sArr = JSON.parse(gArr)
        sTime = Number(gTime)
        sMoves = Number(gMoves)
        sActive = gActive == 'true'
        sPaused = gPaused == 'true'
        sFinished = gFinished == 'true'
        body.innerHTML = ''
        createAllElements()
        if(sPaused) hideGame()
        nMoves.textContent = nMoves.textContent = 'Moves: ' + sMoves
        nTime.textContent = 'Time: '+getTimeStr(sTime)
        
        let wasActive = sActive
        sActive = false
        showMessage("Saved game was loaded!", 2000)
        setTimeout(() => {
            sActive = wasActive
        }, 2000);
        return
    }, 2)
}

//HIDE/SHOW
function hideGame() {
    document.querySelectorAll('.game-grid__tile').forEach(el => el.classList.add('hide-tile'))
}
function showGame() {
    document.querySelectorAll('.game-grid__tile').forEach(el => el.classList.remove('hide-tile'))
}

//SOUND
function switchSound(e) {
    soundOn = !soundOn
    localStorage.setItem('soundOn', soundOn)
}

const mp3hover = new Audio('./src/audio/hover.mp3')
const mp3click = new Audio('./src/audio/click.mp3')
const mp3message = new Audio('./src/audio/message.mp3')
const mp3move = new Audio('./src/audio/move.mp3')
const mp3newGame = new Audio('./src/audio/newgame.mp3')
const mp3victory = new Audio('./src/audio/win.mp3')

function playHover() {
    if(!soundOn) return
    mp3hover.currentTime = 0
    mp3hover.play()
}
function playMove() {
    if(!soundOn) return
    mp3move.currentTime = 0
    mp3move.play()
}
function playClick() {
    if(!soundOn) return
    mp3click.currentTime = 0
    mp3click.play()
}
function playMessage() {
    if(!soundOn) return
    mp3message.currentTime = 0
    mp3message.play()
}
function playVictory() {
    if(!soundOn) return
    mp3victory.currentTime = 0
    mp3victory.play()
}
function playNewGame() {
    if(!soundOn) return
    mp3newGame.currentTime = 0
    mp3newGame.play()
}

//RESULTS
function saveResult() {
    resultArr = getResultsArray()
    resultArr.push({
        date: getFormatDate(new Date()),
        moves: sMoves,
        time: sTime,
        size: sSize
    })
    localStorage.setItem('resultArr', JSON.stringify(resultArr))
}
function getFormatDate(date) {
    let str = date.toLocaleDateString('de-DE', { year: '2-digit', month: 'numeric', day: 'numeric' }) + ' '
    str += date.toLocaleTimeString('ru-RU', { hour: 'numeric', minute: 'numeric' })
    return str
}
function showResults(resSize, wasActive) {
    playClick()
    hideResults()

    const elResult = creatEl()
    elResult.classList.add('popup')
    const popupBack = creatEl()
    popupBack.classList.add('popup__back')
    const popupWrapper = creatEl()
    popupWrapper.classList.add('popup__wrapper')
    popupWrapper.onclick = e => {
        if(e.target == popupWrapper) closeResults(e, wasActive)
    }
    const popupContainer = creatEl()
    popupContainer.classList.add('container')

    const elTitle = creatEl()
    elTitle.classList.add('popup__title')
    elTitle.textContent = 'Results ' + resSize + 'x' + resSize
    const elGrid = creatEl()
    elGrid.classList.add('popup__grid')

    const elButtons = creatEl()
    elButtons.classList.add('popup__buttons')
    for(let i = 3; i <= 8; i++) {
        const elBtn = creatEl('button')
        elBtn.classList.add('popup__btn')
        elBtn.textContent = i + 'x' + i
        if(resSize != i) {
            elBtn.onclick = () => showResults(i, wasActive)
            elBtn.onmouseover = playHover
        } else {
            elBtn.classList.add('popup__btn_active')
        }
        elButtons.appendChild(elBtn)
    }

    let filterdArr = resultArr
        .filter(it => it.size == resSize)
        .sort((a, b) => {
            return a.time - b.time != 0 
                ? a.time - b.time 
                : a.moves - b.moves
        }).slice(0, 10)
    if (filterdArr.length > 0) {
        createGrid(elGrid, filterdArr)
    } else {
        const elMessage = creatEl()
        elMessage.classList.add('popup__empty-msg')
        elMessage.innerHTML = 'There\'s nothing to show!<br>You haven\'t completed these puzzles yet!<br>Try to view the results of a different game size.'
        elGrid.appendChild(elMessage)
    }

    popupContainer.appendChild(elTitle)
    popupContainer.appendChild(elButtons)
    popupContainer.appendChild(elGrid)
    elResult.appendChild(popupBack)
    popupWrapper.appendChild(popupContainer)
    elResult.appendChild(popupWrapper)

    const elClose = creatEl()
    elClose.classList.add('popup__close')
    elClose.textContent = 'X'
    elClose.onclick = e => closeResults(e, wasActive)
    elClose.onmouseover = playHover
    popupContainer.appendChild(elClose)

    body.appendChild(elResult)
}
function closeResults(e, wasActive) {
    hideResults()
    if(!sPaused) showGame()
    sActive = wasActive
}
function hideResults() {
    let oldRes = document.querySelector('.popup')
    if(oldRes) body.removeChild(oldRes)
}
function getResultsArray() {
    let res = localStorage.getItem('resultArr')
    return res ? JSON.parse(res) : []
}
function createGrid(elGrid, filterdArr) {
    const elNum = creatEl()
    elNum.classList.add('popup__header')
    elNum.textContent = '#'
    const elDate = creatEl()
    elDate.classList.add('popup__header')
    elDate.textContent = 'date'
    const elMoves = creatEl()
    elMoves.classList.add('popup__header')
    elMoves.textContent = 'moves'
    const elTime = creatEl()
    elTime.classList.add('popup__header')
    elTime.textContent = 'time'
    elGrid.appendChild(elNum)
    elGrid.appendChild(elDate)
    elGrid.appendChild(elMoves)
    elGrid.appendChild(elTime)
    filterdArr.forEach((it, i) => {
        const elNum = creatEl()
        elNum.classList.add('popup__num')
        elNum.textContent = i + 1
        const elDate = creatEl()
        elDate.classList.add('popup__item')
        elDate.textContent = it.date
        const elMoves = creatEl()
        elMoves.classList.add('popup__item')
        elMoves.textContent = it.moves
        const elTime = creatEl()
        elTime.classList.add('popup__item')
        elTime.textContent = getTimeStr(it.time)
        elGrid.appendChild(elNum)
        elGrid.appendChild(elDate)
        elGrid.appendChild(elMoves)
        elGrid.appendChild(elTime)
    })
}

//DRAGs
let dragingEl = null
function refreshDrags() {
    let [cI, cJ, nullI, nullJ] = findNumAndZero(0)
    document.querySelectorAll('.game-grid__tile').forEach(el => {
        el.setAttribute('draggable', false)
    })
    let elBot = document
        .querySelector('.game-grid__sell_' + ((nullI+1)*sSize + nullJ+1))
    let elTop = document
        .querySelector('.game-grid__sell_' + ((nullI-1)*sSize + nullJ+1))
    let elRht = document
        .querySelector('.game-grid__sell_' + (nullI*sSize + nullJ+2))
    let elLft = document
        .querySelector('.game-grid__sell_' + (nullI*sSize + nullJ))
    if(elTop) {
        elTop = elTop.firstChild
        elTop.setAttribute('draggable', true)
        elTop.ondragstart = startDrag
        elTop.ondragend = endDrag
    }
    if(elBot) {
        elBot = elBot.firstChild
        elBot.setAttribute('draggable', true)
        elBot.ondragstart = startDrag
        elBot.ondragend = endDrag
    }
    if(elLft) {
        elLft = elLft.firstChild
        elLft.setAttribute('draggable', true)
        elLft.ondragstart = startDrag
        elLft.ondragend = endDrag
    }
    if(elRht) {
        elRht = elRht.firstChild
        elRht.setAttribute('draggable', true)
        elRht.ondragstart = startDrag
        elRht.ondragend = endDrag
    }
    let elGap = document
        .querySelector('.game-grid__sell_' + (nullI * sSize + nullJ + 1))
    elGap.addEventListener('dragover', (e) => {e.preventDefault()})
    elGap.ondrop = dropElem
}
function dropElem(e) {
    e.preventDefault();
    if(!sActive || this != nullGap) return
    let num = Number(dragingEl.classList[1].split('_')[3])
    let newGap = dragingEl.parentNode
    nullGap = newGap
    this.appendChild(dragingEl)
    moveInArr(num)
    refreshDrags()
}
function moveInArr(num) {
    let [cI, cJ, nullI, nullJ] = findNumAndZero(num)
    playMove()
    nMoves.textContent = 'Moves: ' + ++sMoves
    sArr[nullI][nullJ] = num
    sArr[cI][cJ] = 0
    checkMoveForEnd()
}
function startDrag(e) {
    dragingEl = this
    setTimeout(() => {
        this.classList.add('hide')
    }, 0);
}
function endDrag(e) {
    this.classList.remove('hide')
}

//Keys control
document.addEventListener('keydown', (e) => {
    let [_i, _j, nullI, nullJ] = findNumAndZero()

    if(e.key == "ArrowDown" || e.key == "s") {
        let elemNum = (nullI - 1)*sSize + nullJ + 1
        let elemClick = document.querySelector('.game-grid__sell_' + elemNum)
        if(elemClick) elemClick.firstChild.click()
    }
    if(e.key == "ArrowUp" || e.key == "w") {
        let elemNum = (nullI + 1)*sSize + nullJ + 1
        let elemClick = document.querySelector('.game-grid__sell_' + elemNum)
        if(elemClick) elemClick.firstChild.click()
    }
    if(e.key == "ArrowRight" || e.key == "d") {
        let elemNum = nullI*sSize + nullJ
        let elemClick = document.querySelector('.game-grid__sell_' + elemNum)
        if(elemClick) elemClick.firstChild.click()
    }
    if(e.key == "ArrowLeft" || e.key == "a") {
        let elemNum = nullI*sSize + nullJ + 2
        let elemClick = document.querySelector('.game-grid__sell_' + elemNum)
        if(elemClick) elemClick.firstChild.click()
    }
})

// RUN >>>>
runGame()
function runGame() {
    createStartArray()
    startGame()
    createAllElements()
}
})();

/******/ })()
;
//# sourceMappingURL=main.js.map