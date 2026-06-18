const gameCanvas = document.getElementById('gameCanvas');
const player = document.getElementById('player');
window.addEventListener('resize',()=>{
    
})
// const canvasRect = gameCanvas.getBoundingClientRect();
// const playerRect = player.getBoundingClientRect();
// console.log(canvasRect.x);
// console.log(playerRect.x);
// console.log("X: ",playerRect.x-canvasRect.x);

//Game Info
const score = document.getElementById('score');
const level = document.getElementById('level');
const lives = document.getElementById('lives');
const highScore = document.getElementById('high-score');

//btn
// const continueBtn= document.getElementById('continue');
// const restartBtn=  document.getElementById('restart');

//Satatus:

const Player = {
    x:0,
    y: 0,
    speed: 5,
}

let maxX = 0;
function updateMovementLimits() {
    const canvasRect = gameCanvas.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

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
}


function gameLoop() {
    movePlayer();
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
    e => keys[e.code] = true
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
