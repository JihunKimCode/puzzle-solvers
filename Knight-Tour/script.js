let knight; // Declare knight globally
let animationInterval; // Declare animationInterval globally to control the animation
let currentOrder = 0; // Keep track of the current position in the tour

class Knight {
    constructor(r, c) {
        if (r <= 0 || c <= 0) {
            console.log("Invalid board size. Setting default size: 8x8");
            this.rows = 8;
            this.cols = 8;
        } else {
            this.rows = r;
            this.cols = c;
        }

        this.tour = new Array(this.rows * this.cols).fill(-1); // Initialize the tour array with -1 for each square
        this.move = [
            [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]
        ];
    }

    // Updated find method using Warnsdorff's rule
    find(row, col, order) {
        if (row >= this.rows || row < 0 || col >= this.cols || col < 0) return false;
        if (this.tour[row * this.cols + col] !== -1) return false;

        this.tour[row * this.cols + col] = order;
        if (order === this.rows * this.cols - 1) return true;

        // Create an array to store available moves and their accessibility
        const availableMoves = this.move.map(([dx, dy]) => ({
            dx,
            dy,
            accessibility: this.getAccessibility(row + dx, col + dy)
        }));

        // Sort available moves based on their accessibility (ascending order)
        availableMoves.sort((a, b) => a.accessibility - b.accessibility);

        for (const { dx, dy } of availableMoves) {
            if (this.find(row + dx, col + dy, order + 1)) return true;
        }

        this.tour[row * this.cols + col] = -1;
        return false;
    }

    // Helper method to calculate the accessibility of a square
    getAccessibility(row, col) {
        let count = 0;
        for (let i = 0; i < this.move.length; i++) {
            const nextRow = row + this.move[i][0];
            const nextCol = col + this.move[i][1];
            if (nextRow >= 0 && nextRow < this.rows && nextCol >= 0 && nextCol < this.cols && this.tour[nextRow * this.cols + nextCol] === -1) {
                count++;
            }
        }
        return count;
    }

    getBoardHTML() {
        let boardHTML = '';
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const squareNum = this.tour[i * this.cols + j];
                const squareText = squareNum >= 0 ? squareNum.toString() : '';
                boardHTML += `<div class="square">${squareText}</div>`;
            }
        }
        return boardHTML;
    }

    print() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = this.getBoardHTML();
    }

    startTour(rp, cp) {
        if (rp === -1) rp = Math.floor(Math.random() * this.rows);
        if (cp === -1) cp = Math.floor(Math.random() * this.cols);
        this.find(rp, cp, 0);
        this.print();
    }

    // Function to show the knight animation
    showAnimation() {
        const boardElement = document.getElementById('board');
        const squares = boardElement.querySelectorAll('.square');
        const animationButton = document.getElementById('animationButton');

        let order = currentOrder; // Start from the current position
        let stopAnimation = false; // New flag to stop the animation

        animationInterval = setInterval(() => {
            if (stopAnimation || order >= this.rows * this.cols) { // Check if the stopAnimation flag is set or the tour is completed
                clearInterval(animationInterval);
                animationButton.textContent = 'Start Animation';
                currentOrder = 0; // Reset the current position to 0
                return;
            }

            const knightIndex = this.tour.indexOf(order);
            if (knightIndex !== -1) {
                squares.forEach((square, index) => {
                    if (index === knightIndex) {
                        square.innerHTML = '<h1>&#9816</h1>';
                        square.classList.add('highlight');
                    } else if (this.tour[index] !== -1) {
                        square.textContent = this.tour[index];
                        square.classList.remove('highlight');
                    }
                });
            }
            order++;
            currentOrder = order; // Update the current position
        }, 500);
    }

    // Function to toggle animation on button click
    toggleAnimation() {
        const animationButton = document.getElementById('animationButton');
        if (animationButton.textContent === 'Start Animation') {
            animationButton.textContent = 'Stop Animation';
            this.showAnimation(); // Use 'this' to access the knight instance
        } else {
            animationButton.textContent = 'Start Animation';
            clearInterval(animationInterval); // Pause the animation by clearing the interval
        }
    }
}

Knight.prototype.getBoardHTML = function () {
    let boardHTML = '';
    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            const squareNum = this.tour[i * this.cols + j];
            const squareText = squareNum >= 0 ? squareNum.toString() : '';
            boardHTML += `<div class="square">${squareText}</div>`;
        }
    }
    return boardHTML;
};

Knight.prototype.print = function () {
    const boardElement = document.getElementById('board');
    boardElement.style.setProperty('--cols', this.cols); // Set the --cols custom property
    boardElement.innerHTML = this.getBoardHTML();
};

Knight.prototype.startTour = function (rp, cp) {
    if (rp === -1) rp = Math.floor(Math.random() * this.rows);
    if (cp === -1) cp = Math.floor(Math.random() * this.cols);
    this.find(rp, cp, 0);
    this.print();
};

// Additional function to handle animation toggle
function toggleAnimation() {
    knight.toggleAnimation();
}

// Global "startTour" function
function startTour() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);

    if (rows <= 0 || cols <= 0) {
        alert('Invalid board size. Please enter positive integers for rows and columns.');
        return;
    }

    knight = new Knight(rows, cols); // Assign the knight instance to the global variable
    currentOrder = 0; // Reset the current position to 0
    if (animationButton.textContent !== 'Start Animation') {
        animationButton.textContent = 'Start Animation';
        clearInterval(animationInterval); // Pause the animation by clearing the interval
    }

    let rp = parseInt(prompt('Which "ROW" do you want to start (-1 to Random)?', '0'));
    let cp = parseInt(prompt('Which "COLUMN" do you want to start (-1 to Random)?', '0'));

    knight.startTour(rp, cp);
}
