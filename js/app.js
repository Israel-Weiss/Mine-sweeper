
var MINE_IMG = '<img src="img/mine.png" />';
var FLAG_IMG = '<img src="img/flag.png" />';

var gBoard
var gSize
var countStep
var countMines
var minesNum

var elsmiley1 = document.querySelector('.smiley-1')
var elsmiley2 = document.querySelector('.smiley-2')
var elsmiley3 = document.querySelector('.smiley-3')


function levelSelection(level) {

	firstStep = 0
	if (level === 1) gSize = 4
	else if (level === 2) gSize = 8
	else gSize = 12
	initGame()
	return gSize
}

function initGame() {
	countStep = 0
	gBoard = buildBoard();
	renderBoard(gBoard);
	document.querySelector('.gameover').style.display = 'none'
	document.querySelector('.win').style.display = 'none'

	elsmiley1.style.display = 'block'
	elsmiley2.style.display = 'none'
	elsmiley3.style.display = 'none'

}

function buildBoard() {
	var board = createMat(gSize)

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board.length; j++) {
			var cell = { isShown: false, flag: false };
			board[i][j] = cell;
		}
	}

	minesNum = board.length ** 2 / 8
	countMines = minesNum
	renderCount()
	return board
}

function renderCount() {
	elCont = document.querySelector('.count')
	elCont.innerHTML = 'Remaining mines: ' + countMines
}

function placeMines(board, i, j) {
	for (var index = 0; index < board.length ** 2 / 8; index++) {
		var row = getRandomInt(0, board.length)
		var col = getRandomInt(0, board.length)
		if (board[row][col].mine) index--
		if (row === i && col === j) {
			index--
			continue
		}
		board[row][col] = { isShown: false, flag: false, mine: true }
	}
	firstStep = 1

	renderBoard(board);

	countMines = minesNum
	renderCount()
}

function renderBoard(board) {
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>';
		for (var j = 0; j < board.length; j++) {
			var cellClass = getClassName({ i, j })

			if (board[i][j].mine) {
				strHTML += '\t<td class=" cell ' + cellClass
					+ '" onclick="cellClicked(' + i + ',' + j +
					')" oncontextmenu="rightClick(' + i + ',' + j + ',event'+')"> <span class="'
					+ cellClass + '">' + MINE_IMG + '</span> <span class="F'
					+ cellClass + '">' + FLAG_IMG + '</span>\n';
			} else {
				strHTML += '\t<td class=" cell ' + cellClass
					+ '" onclick="cellClicked(' + i + ',' + j +
					')" oncontextmenu="rightClick(' + i + ',' + j + ',event'+')"> <span class="'
					+ cellClass + '">' + setMinesNegsCount(i, j, board) + '</span> <span class="F'
					+ cellClass + '">' + FLAG_IMG + '</span>\n';
			}

			strHTML += '</td>';
		}
		strHTML += '</tr>';
	}

	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

function setMinesNegsCount(cellI, cellJ, mat) {
	var mainesCount = 0;
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue;
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (i === cellI && j === cellJ) continue;
			if (j < 0 || j >= mat.length) continue;

			if (mat[i][j].mine) mainesCount++;
		}
	}
	mainesCount = (mainesCount > 0)? mainesCount : ''
	return mainesCount;
}

function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function cellClicked(i, j) {
	if (countStep === 0) placeMines(gBoard, i, j)
	countStep++
	var elFlag = document.querySelector('span.Fcell-' + i + '-' + j)
	elFlag.style.display = 'none'
	var el = document.querySelector('span.cell-' + i + '-' + j)
	el.style.display = 'block'
	if (gBoard[i][j].mine) gameOver()
	if (countStep === gSize ** 2 - gSize ** 2 / 8) win()
}

function rightClick(i, j, ev) {
	ev.preventDefault()

	var el = document.querySelector('span.Fcell-' + i + '-' + j)
	if (!gBoard[i][j].flag) {
		el.style.display = 'block'
		gBoard[i][j].flag = true
		countMines--
	} else {
		el.style.display = 'none'
		gBoard[i][j].flag = false
		countMines++
	}
	renderCount()
}

function gameOver() {
	elsmiley1.style.display = 'none'
	elsmiley2.style.display = 'block'
	document.querySelector('.gameover').style.display = 'block'
	
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard.length; j++) {
			var el = document.querySelector('span.cell-' + i + '-' + j)
			el.style.display = 'block'
		}
	}
}

function win() {
	elsmiley1.style.display = 'none'
	elsmiley3.style.display = 'block'
	document.querySelector('.win').style.display = 'block'
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard.length; j++) {
			var el = document.querySelector('span.cell-' + i + '-' + j)
			el.style.display = 'block'
		}
	}

}
