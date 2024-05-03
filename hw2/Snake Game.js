
var snake = [];
var food = null;
var size = 40;
var direction;
var score;
var intervalId;

var canvas = document.getElementById('gameCanvas'); 
var ctx = canvas.getContext('2d');


//I set use arrow to control the direction 
window.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down')
                direction = 'up';
                break;
        case 'ArrowDown':
            if (direction !== 'up')
                direction = 'down';
                break;
        case 'ArrowLeft':
            if (direction !== 'right')
                direction = 'left';
                break;
        case 'ArrowRight':
            if (direction !== 'left')
                direction = 'right';
                break;
    }
});

function renew() {
    //create  new head
    var head = Object.assign({}, snake[0]); 
    switch(direction) {
        case 'left':
            head.x -= size;
            break;
        case 'up':
            head.y -= size;
            break;
        case 'right':
            head.x += size;
            break;
        case 'down':
            head.y += size;
            break;
    }

    snake.unshift(head); 

    //if player do not control
    //for a special case 
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        gameOver();
        return; 
    }

    if (food && food.x === head.x && food.y === head.y) { 
        score++;
        food = null;
    }
    else { 
        snake.pop(); 
    }

    if (!food) {
        food = {
            x: Math.floor(Math.random() * canvas.width / size) * size,
            y: Math.floor(Math.random() * canvas.height / size) * size,
        };
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //snake image create, made by some green box
    snake.forEach(function(cell) {
        ctx.fillStyle = 'lightgreen';
        ctx.fillRect(cell.x, cell.y, size, size);
    });

    //food image, I use a picture from https://www.shutterstock.com
    //it is free to download and use
    if (food) {
        var img = new Image();
        img.src = 'apple.png'; 
        ctx.drawImage(img, food.x, food.y, size, size);
    }
}

function startGame() {
    direction = null;
    score = 0;
    snake = [];
    food = null;
    direction = 'right';
    score = 0;
    snake.push({x: canvas.width / 2, y: canvas.height / 2});
    intervalId = setInterval(gameloop, 200);
    startBtn.style.display = "none"; 
}

function gameOver() {
    var head = snake[0];
    return head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
    snake.slice(1).some(function(cell) {return cell.x === head.x && cell.y === head.y;});
}

function gameloop() {
    renew();
    draw();

    if (gameOver()) {
        clearInterval(intervalId);
        alert("Game Over! Score: " + score);
        startBtn.style.display = "block"; 
    }
}