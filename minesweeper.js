var board = [];
var rows = 8;
var columns = 8;

var minesCount = 5;
var minesLocation = []; // "2-2", "3-4", "5-1" => "zeile-spalte"

var tilesClicked = 0; // ziel: alle tiles außer die mit minen drücken
var flagEnabled = false;

var gameOver = false;

window.onload = function () {
    startGame();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag)
    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked") || this.innerText == "🚩" && !flagEnabled) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c)
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // die oberen drei
    minesFound += checkTile(r-1, c-1); // oben links
    minesFound += checkTile(r-1, c); // oben mitte
    minesFound += checkTile(r-1, c+1); // oben rechts

    // links u rechts
    minesFound += checkTile(r, c-1); // links
    minesFound += checkTile(r, c+1); // rechts

    // die unteren drei
    minesFound += checkTile(r+1, c-1); // unten links
    minesFound += checkTile(r+1, c); // unten mitte
    minesFound += checkTile(r+1, c+1); // unten rechts

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        // oben
        checkMine(r-1, c-1) // oben links
        checkMine(r-1, c) // oben mitte
        checkMine(r-1, c+1) // oben rechts

        // links rechts
        checkMine(r, c-1) // links
        checkMine(r, c+1) // rechts

        // unten
        checkMine(r+1, c-1); // unten links
        checkMine(r+1, c); // unten mitte
        checkMine(r+1, c+1); // unten rechts
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Minenfeld geräumt."
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }

    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }

    return 0;
}