const gameCanvas = document.getElementById('gameCanvas');
const player = document.getElementById('player');


//Game Info
const score = document.getElementById('score');
const level = document.getElementById('level');
const lives = document.getElementById('lives');
// const highScore = document.getElementById('high-score');

//btn
// const continueBtn= document.getElementById('continue');
// const restartBtn=  document.getElementById('restart');

//Satatus:

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
    const playerRect = player.getBoundingClientRect();
    Player.width = playerRect.width;
    Player.height = playerRect.height;

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
    
    player.style.transform = `translateX(calc(-50% + ${Player.x}px))`;
// console.log(Player);

}

function fireBullet() {
    const canvasRect = gameCanvas.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    
    if (keys.Space) {
        //TO-DO: throttle bullet firing
        
        const bullet = document.createElement('img');
    
        bullet.src = 'source/bullet_up.svg';
        bullet.alt = '';
        bullet.className = 'bullet';
    
        const bulletWidth = 8;
        const bulletHeight = 20;
        const x = playerRect.left - canvasRect.left + (playerRect.width / 2) - (bulletWidth / 2);
        const y = playerRect.top - canvasRect.top - bulletHeight + 10;
    
        bullet.style.left = `${x}px`;
        bullet.style.top = `${y}px`;
    
        gameCanvas.appendChild(bullet);
        bullets.push({ element: bullet, y });
    }
    moveBullets();
}

function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        bullet.y -= bulletSpeed;
        bullet.element.style.top = `${bullet.y}px`;

        if (bullet.y < -40) {
            bullet.element.remove();
            bullets.splice(i, 1);
        }
    }
}

function gameLoop() {
    movePlayer();
    fireBullet();
    // moveBullets();
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

        // if (e.code === 'Space') {
        //     e.preventDefault();
        //     fireBullet();
        // }
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

