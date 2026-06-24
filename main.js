const gameCanvas = document.getElementById('gameCanvas');
const playerEl = document.getElementById('player');


//Game Info
const gameInfo= document.getElementById('game-info')
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const livesEl = document.getElementById('lives');

//Controls
const controlEl = document.querySelector(".controls")
const backGround = document.querySelector('body')
const resumeBtn= document.getElementById('resumeBtn');
const restartBtn=  document.getElementById('restartBtn');



//Satatus:
const gameState = {
    score: 0,
    time: 0.0,
    lives: 3,
    paused:false,
}

const Player = {
    x:0,
    y: 0,
    width: 90,
    height:0,
    speed: 5,
}

const bullets = [];
const bulletSpeed = 8;

let maxX = 0;
function updateMovementLimits() {
    const canvasRect = gameCanvas.getBoundingClientRect();
    const playerRect = playerEl.getBoundingClientRect();
    Player.width = playerRect.width;
    Player.height = playerRect.height;
    Player.y = playerRect.y;

    maxX = (canvasRect.width - playerRect.width) / 2;
}

function movePlayer() {

    if (keys.ArrowLeft) {
        Player.x -= Player.speed;
    }

    if (keys.ArrowRight) {
        Player.x += Player.speed;
    }

    Player.x = Math.max(-maxX, Math.min(Player.x, maxX))
    
    playerEl.style.transform = `translateX(calc(-50% + ${Player.x}px))`;

}

const shootBullet = throttle(() => {
    const canvasRect = gameCanvas.getBoundingClientRect();
    const playerRect = playerEl.getBoundingClientRect();

    const bullet = document.createElement('img');
            
    
    bullet.src = 'source/bullet_up.svg';
    bullet.alt = '';
    bullet.className = 'bullet';
        
    const bulletWidth = 8;
    const bulletHeight = 20;
    const x = playerRect.left - canvasRect.left + (playerRect.width / 2) - (bulletWidth);
    const y = playerRect.top - canvasRect.top - bulletHeight;
            
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;
        
    gameCanvas.appendChild(bullet);
    bullets.push({ element: bullet, y });
}, 300);

function fireBullet() {
    let count = 0;
    if (keys.Space) {
        //TO-DO: throttle bullet firing
        shootBullet();
    }
    moveBullets();
}

function moveBullets() {
    const canvasRect = gameCanvas.getBoundingClientRect();
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        bullet.y -= bulletSpeed;
        bullet.element.style.top = `${bullet.y}px`;        

        if (bullet.y < 0) {
            bullet.element.remove();
            bullets.splice(i, 1);
        }
    }
}

let lastTime = 0;
function gameLoop(timestamp) {
    
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    
    if (!gameState.paused) {
        gameState.time += dt / 1000;

        fireBullet();
        movePlayer();
        const minutes = 
            Math.floor(gameState.time / 60)
        const seconds = 
            Math.floor(gameState.time % 60)
    
        timeEl.textContent =
            `${String(minutes)}.${String(seconds).padStart(2,"0")}`;
    }

    
    requestAnimationFrame(gameLoop)
}
requestAnimationFrame(gameLoop)





//resize fix:
window.addEventListener('resize', updateMovementLimits);
updateMovementLimits();



//manipulate input
const keys = {};
window.addEventListener(
    'keydown',
    e => {
        keys[e.code] = true;
        //Pause the game
        if (e.key.toLocaleLowerCase() === 'p') {
            gameState.paused = !gameState.paused;
            toggleControl();
            //check status
            console.log(gameState.paused?"Paused":"Resumed");
        }
        //Restart
        if (e.key.toLocaleLowerCase() === 'r') {
            // gameState.paused = false;
            // gameState.time = 0;
            // gameState.lives = 3;
            // gameState.score = 0;
            window.location.reload();
        }
    }
);

window.addEventListener(
    'keyup',
    e => keys[e.code] = false
);



//add pause btn && restart btn
// continueBtn.addEventListener(
//     'click',
//     () => paused = !paused
// );

// restartBtn.addEventListener(
//     'click',
//     () => {
//         window.location.reload();
//     }
// );


function throttle(fn,wait) {
    let shouldWait = false
    
    return function () {
        if (!shouldWait) {
            fn()
            shouldWait = true
            setTimeout(() => {
                shouldWait=false
            },wait)
        }
    }
}

// show the controls and blur the canvas
function toggleControl() {
    controlEl.classList.toggle('hidden');
    gameCanvas.classList.toggle('blurred');
    gameInfo.classList.toggle('blurred');
}


//Check for collision
function isColliding(bullet,target) {
    
    return (
        bullet.x < target.x + target.width &&
        bullet.x + bullet.width > target.x &&
        bullet.y < target.y + target.height &&
        bullet.y + bullet.height > target.y
    );
}