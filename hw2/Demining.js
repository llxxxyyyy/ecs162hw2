document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById('minefield');
  const gridSize = 10;
  const mineCount = 20;
  let board = [];
  let gameover = false;
  let firstClick = true; // 新增变量来标记是否为第一次点击

  function expandEmptyCells(index) {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx;
            const ny = y + dy;
            const nIdx = ny * gridSize + nx;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !grid.children[nIdx].classList.contains('revealed')) {
                const cellDiv = grid.children[nIdx];
                if (board[nIdx] === 0) {
                    cellDiv.textContent = '';
                    cellDiv.classList.add('revealed');
                    expandEmptyCells(nIdx);  // 递归展开
                } else if (board[nIdx] > 0) {
                    cellDiv.textContent = board[nIdx];
                    cellDiv.style.color = getNumberColor(board[nIdx]);
                    cellDiv.classList.add('revealed');
                }
            }
        }
    }
}

  function placeMines(excludeIndex) {
      // 在放置地雷时排除第一次点击的索引
      for (let i = 0; i < mineCount; ) {
          let pos = Math.floor(Math.random() * gridSize * gridSize);
          if (pos !== excludeIndex && board[pos] !== 'M') {
              board[pos] = 'M';
              i++;
          }
      }
      // 更新地雷周围的数字
      for (let i = 0; i < board.length; i++) {
          if (board[i] === 'M') continue;
          let count = 0;
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          
          for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                  if (dx === 0 && dy === 0) continue;
                  let nx = x + dx, ny = y + dy;
                  if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && board[ny * gridSize + nx] === 'M') {
                      count++;
                  }
              }
          }
          board[i] = count;
      }
  }

  function initBoard() {
      grid.innerHTML = '';
      board = Array(gridSize * gridSize).fill(0);
      firstClick = true; // 重置为第一次点击
      renderBoard();
  }

  function renderBoard() {
      board.forEach((cell, i) => {
          const cellDiv = document.createElement('div');
          cellDiv.addEventListener('click', () => revealCell(i), { once: true });
          grid.appendChild(cellDiv);
      });
  }

  function revealCell(index) {
    if (gameover || grid.children[index].classList.contains('revealed')) return;
    const cellDiv = grid.children[index];
    cellDiv.classList.add('revealed');  // 添加已揭示标记
      if (firstClick) {
          placeMines(index); // 第一次点击时，排除此格子放置地雷
          firstClick = false;
      }
      cellDiv.classList.add('revealed');
      if (board[index] === 'M') {
          cellDiv.textContent = '💣';
          cellDiv.style.color = 'red';
          gameOver();
      } else if (board[index] > 0) {
          cellDiv.textContent = board[index];
          cellDiv.style.color = getNumberColor(board[index]);
      } else {
          expandEmptyCells(index); // 展开周围没有雷的区域
      }
  }
  function renderBoard() {
    board.forEach((cell, i) => {
        const cellDiv = document.createElement('div');
        cellDiv.addEventListener('click', () => revealCell(i));
        cellDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();  // 阻止默认的右键菜单
            toggleFlag(i);
        });
        grid.appendChild(cellDiv);
    });
}

  function toggleFlag(index) {
      const cellDiv = grid.children[index];
      if (!gameover && !cellDiv.classList.contains('revealed')) {
          if (!cellDiv.classList.contains('flagged')) {
              cellDiv.classList.add('flagged');
              cellDiv.textContent = '🚩';
              checkWin();  // 每次放置旗子后检查是否胜利
          } else {
              cellDiv.classList.remove('flagged');
              cellDiv.textContent = '';  // 移除旗子
          }
      }
  }

  function getNumberColor(number) {
      const colors = ['blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'gray'];
      return colors[number - 1] || '';
  }

  function checkWin() {
    const isWin = board.every((cell, i) => {
        const cellDiv = grid.children[i];
        return (cell === 'M' && cellDiv.classList.contains('flagged')) ||
               (cell !== 'M' && !cellDiv.classList.contains('flagged'));
    });
    if (isWin) {
        alert('Congratulations! You win!');
        gameover = true;  // 结束游戏
    }
}

  function restartGame() {
      gameover = false;
      initBoard(); // 重新初始化游戏板
  }

  function gameOver() {
      alert('Failed');
      gameover = true;
      board.forEach((cell, i) => {
        const cellDiv = grid.children[i];
        if (cell === 'M') {
            cellDiv.textContent = '💣';
            cellDiv.style.color = 'red';
        }
    });
  }

  document.getElementById('restartButton').addEventListener('click', restartGame);

  initBoard();
});
