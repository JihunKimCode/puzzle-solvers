function apply(n, row, col, board) {
    // Check Col
    for (let j = 0; j < n; j++) {
        if (j === row) continue;
        if (board[j * n + col] === "Q") return false;
    }
    // Check Right Diagonal
    for (let i = row * n + col; i > 0; i -= (n - 1)) {
        if (board[i] === "Q") return false;
        if (i % n === n - 1) break;
    }
    // Check Left Diagonal
    for (let j = row * n + col; j >= 0; j -= (n + 1)) {
        if (board[j] === "Q") return false;
        if (j % n === 0) break;
    }
    return true;
}

function solveNQueens() {
    const size = parseInt(document.getElementById("size").value);
    const board = Array(size * size).fill(" ");
    const isValid = find(size, 0, Math.floor(Math.random() * size), board);

    if (isValid) {
        displayBoard(size, board);
    } else {
        alert("No solution found!");
    }
}

function find(n, row, col, board) {
    if (row === n) {
        return board.filter((cell) => cell === "Q").length === n;
    }

    if (col === n) {
        return board.filter((cell) => cell === "Q").length === n;
    }

    if (apply(n, row, col, board)) {
        board[row * n + col] = "Q";
    } else {
        if (find(n, row, col + 1, board)) {
            return board.filter((cell) => cell === "Q").length === n;
        } else {
            return false;
        }
    }

    if (find(n, row + 1, 0, board)) {
        return board.filter((cell) => cell === "Q").length === n;
    } else {
        board[row * n + col] = " ";
        if (find(n, row, col + 1, board)) {
            // Do Nothing
        } else {
            return false;
        }
    }

    return true;
}

function displayBoard(size, board) {
    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";
    boardContainer.style.setProperty("--size", size);

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.textContent = board[row * size + col];
            cell.setAttribute("role", "gridcell");
            cell.setAttribute("aria-checked", board[row * size + col] === "Q");
            cell.setAttribute("data-row", row);
            cell.setAttribute("data-col", col);

            // Add event listener for accessibility and hover effect on "Q" cells
            if (board[row * size + col] === "Q") {
                cell.addEventListener("click", function () {
                    toggleQueen(row, col);
                });

                cell.addEventListener("mouseover", function () {
                    highlightPossibleMoves(row, col, size);
                });

                cell.addEventListener("mouseout", function () {
                    clearHighlightedMoves();
                });
            }
            boardContainer.appendChild(cell);
        }
    }
}

function highlightPossibleMoves(row, col, size) {
    const board = document.querySelectorAll(`[role="gridcell"]`);
    for (let i = 0; i < board.length; i++) {
        const cellRow = parseInt(board[i].getAttribute("data-row"));
        const cellCol = parseInt(board[i].getAttribute("data-col"));
        if (cellRow === row || cellCol === col || Math.abs(cellRow - row) === Math.abs(cellCol - col)) {
            board[i].style.backgroundColor = "yellow";
        }
    }
}

function clearHighlightedMoves() {
    const board = document.querySelectorAll(`[role="gridcell"]`);
    for (let i = 0; i < board.length; i++) {
        board[i].style.backgroundColor = "";
    }
}
