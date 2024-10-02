let coins = 100;
let spinCount = 0;

const symbols = ['\uD83C\uDF47', '\uD83C\uDF4A', '\uD83C\uDF49', '\uD83C\uDF48', '\uD83C\uDF52', '\uD83C\uDF53'];

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function countAdjacentSymbols(cells, symbol) {
    let visited = Array(9).fill(false);
    let count = 0;

    function dfs(index) {
        if (index < 0 || index >= 9 || visited[index] || cells[index] !== symbol) return;
        visited[index] = true;
        count++;

        const directions = [-3, 3, -1, 1];
        for (const dir of directions) {
            dfs(index + dir);
        }
    }

    for (let i = 0; i < 9; i++) {
        if (cells[i] === symbol && !visited[i]) {
            count = 0;
            dfs(i);
            return count;
        }
    }

    return count;
}

function updateBalance() {
    const balanceDisplay = document.getElementById('balance');
    balanceDisplay.textContent = `Coins: ${coins}`;
}

document.getElementById('spin-button').addEventListener('click', function () {
    const betAmount = parseInt(document.getElementById('bet-amount').value);

    if (coins < betAmount) {
        alert("Not enough coins to spin!");
        return;
    }

    coins -= betAmount;
    updateBalance();

    spinCount++;

    const button = document.getElementById('spin-button');
    const resultMessage = document.getElementById('result-message');
    button.disabled = true;
    resultMessage.textContent = '';

    const slotCells = document.querySelectorAll('.slot-cell');
    let finalSymbols = new Array(9);

    const spinInterval = setInterval(() => {
        slotCells.forEach(cell => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            cell.textContent = randomSymbol;
        });
    }, 100);

    setTimeout(() => {
        clearInterval(spinInterval);

        if (spinCount % 25 === 0) {
            const guaranteedSymbol = symbols[Math.floor(Math.random() * symbols.length)];

            slotCells.forEach((cell, index) => {
                cell.textContent = guaranteedSymbol;
                finalSymbols[index] = guaranteedSymbol;
            });

            const maxWin = betAmount * 50; 
            coins += maxWin;
            updateBalance();

            resultMessage.textContent = `You Win! You won ${maxWin} coins with a guaranteed win!`;
            resultMessage.style.color = 'green';

            slotCells.forEach(cell => {
                cell.classList.add('flash');
            });

            setTimeout(() => {
                slotCells.forEach(cell => {
                    cell.classList.remove('flash');
                });
            }, 2000);
        } else {
            slotCells.forEach((cell, index) => {
                const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                cell.textContent = finalSymbol;
                finalSymbols[index] = finalSymbol;
            });

            let totalMultiplier = 0;
            const countedSymbols = new Set();

            let winChanceFactor = 1; 
            if (betAmount < 10) {
                winChanceFactor = 2.5; 
            } else if (betAmount >= 10 && betAmount < 25) {
                winChanceFactor = 1.5; 
            } else if (betAmount >= 25) {
                winChanceFactor = 0.5; 
            }

            finalSymbols.forEach(symbol => {
                if (!countedSymbols.has(symbol)) {
                    const count = countAdjacentSymbols(finalSymbols, symbol);
                    if (count >= 3) {
                        let multiplier = 0;
                        
                        if (count === 3) multiplier = 3;
                        else if (count === 4) multiplier = 5;
                        else if (count === 5) multiplier = 7;
                        else if (count === 6) multiplier = 10;
                        else if (count === 7) multiplier = 15;
                        else if (count === 8) multiplier = 20;
                        else if (count === 9) multiplier = 50;

                        if (Math.random() < winChanceFactor) {
                            totalMultiplier += multiplier; 
                        }
                        countedSymbols.add(symbol);
                    }
                }
            });

            if (totalMultiplier > 0) {
                const winnings = betAmount * totalMultiplier;
                coins += winnings;
                updateBalance();

                resultMessage.textContent = `You Win! You won ${winnings} coins!`;
                resultMessage.style.color = 'green';

                slotCells.forEach(cell => {
                    cell.classList.add('flash');
                });

                setTimeout(() => {
                    slotCells.forEach(cell => {
                        cell.classList.remove('flash');
                    });
                }, 2000);
            } else {
                resultMessage.textContent = 'Try Again!';
                resultMessage.style.color = 'red';
            }
        }

        button.disabled = false;
    }, 2000);
});

updateBalance();
