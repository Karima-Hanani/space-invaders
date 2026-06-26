const gameCanvas = document.getElementById('gameCanvas');
const playerEl = document.getElementById('player');


//Game Info
const gameInfo= document.getElementById('game-info')
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const livesEl = document.getElementById('lives');

//MSG
const msgEl= document.getElementById('msg')

//Controls
const controlEl = document.querySelector(".controls")
const backGround = document.querySelector('body')//Needs to be removed (for testing only)
const resumeBtn= document.getElementById('resumeBtn');
const restartBtn=  document.getElementById('restartBtn');
const all = document.getElementById('all')


//Satatus:
const gameState = {
    score: 0,
    time: 0.0,
    lives: 3,
    paused: false,
    ended: false,
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
    Player.y = playerRect.y - canvasRect.y;//fixed Y related to canvas
    // Player.x = (playerRect.x+(playerRect.width/2) - canvasRect.x);

    maxX = (canvasRect.width - playerRect.width)/2;
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
}, 500);

function fireBullet() {
    // let count = 0;
    if (keys.Space) {
        //TO-DO: throttle bullet firing
        shootBullet();
    }
    moveBullets(bullets,"up");
}

function moveBullets(bullets,dir) {
    const canvasRect = gameCanvas.getBoundingClientRect();
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        switch (dir) {
            case 'up':
                bullet.y -= bulletSpeed;
                
                break;
            case 'down':
                // console.log(bullet.y);
                
                bullet.y += bulletSpeed;
                
                break;
            
        }
        bullet.element.style.top = `${bullet.y}px`;        

        if (bullet.y < 0) {
            bullet.element.remove();
            bullets.splice(i, 1);
        }
    }
}

function moveEnemyBullets() {
    const canvasRect = gameCanvas.getBoundingClientRect();
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        bullet.y += enemyBulletSpeed;
        bullet.element.style.transform = `translate(${bullet.x}px,${bullet.y}px)`;        

        if (bullet.y > canvasRect.height-20) {
            bullet.element.remove();
            enemyBullets.splice(i, 1);
        }
    }
}

let lastTime = 0;
function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    
    if (!gameState.paused) {
        gameState.time += dt / 1000;
        collision()
        moveEnemies()
        enemiesBullets()
        moveEnemyBullets()
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
        if (e.key.toLocaleLowerCase() === 'p' && !gameState.ended) {
            gameState.paused = !gameState.paused;
            toggleControl('paused');
            console.log("enemies: ",enemies);
            console.log("player Y: ",Player.y);
            console.log("player X: ", Player.x);

            const canvasRect = gameCanvas.getBoundingClientRect();
            const playerRect = playerEl.getBoundingClientRect();

            
            console.log("Canvas width : ",canvasRect.width);
            console.log("Canvas height : ",canvasRect.height);
            console.log("canvas X : ",canvasRect.x);
            console.log("canvas Y : ",canvasRect.y);
            console.log("Player Rect Y : ",playerRect.y);
            console.log("player Rect x : ",playerRect.x);
            console.log("player width : ",playerRect.width);
            console.log("player height : ",playerRect.height);


            
    // const canvasRect = gameCanvas.getBoundingClientRect();
         
            //check status
            console.log(gameState.paused?"Paused":"Resumed");
        }
        //Restart
        if (e.key.toLocaleLowerCase() === 'r') {
            restart();
            hideControl();
        }
        //================For testing purposes only=================
        if (e.key.toLocaleLowerCase() === 'w') {
            toggleControl('win')
        }
        if (e.key.toLocaleLowerCase() === 'l') {
            toggleControl('lose')
        }
        //=======================End of Test=========================
    }
);

window.addEventListener(
    'keyup',
    e => keys[e.code] = false
);

//add pause btn && restart btn
resumeBtn.addEventListener(
    'click',
    () => {
        gameState.paused = !gameState.paused
        toggleControl('paused');
    }
);

restartBtn.addEventListener(
    'click',
    () => {
        // window.location.reload();
        restart();
        hideControl();
    }
);


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
function toggleControl(state) {
    controlEl.classList.toggle('hidden');
    // gameCanvas.classList.toggle('blurred');
    // gameInfo.classList.toggle('blurred');
    // msgEl.classList.toggle('blurred');
    all.classList.toggle('blurred');


    switch (state) {
        case 'paused':
            showMessage("Game Paused ⏸️",state)
            break;
        case 'win':
            gameState.ended = true
            gameState.paused = true 
            showMessage("Congratulations 🥳 ",state)
            break;
        case 'lose':
            gameState.ended = true
            gameState.paused = true 
            showMessage("Game Over 😵",state)
            break;
        
        default:
            break;
    }

}

function hideControl() {
    controlEl.classList.add('hidden');
    gameCanvas.className = '';
    gameInfo.className = '';
    msgEl.className = '';
}


function showMessage(message,state) {
    controlEl.innerHTML=``
    const show = document.createElement("span")
    const status = document.createElement('p')
    
    status.innerHTML = `Score: ${gameState.score}<br>
                        Time: ${String(Math
                            .floor(gameState.time / 60))}.${String(String(Math
                                .floor(gameState.time % 60)))
                                .padStart(2, "0")}`

    show.textContent = `${message}`
    show.className= state
    controlEl.prepend(show)
    if (state=='paused') {
        controlEl.appendChild(resumeBtn)
    } else {
        controlEl.appendChild(status)
    }
    controlEl.appendChild(restartBtn)
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

function restart() {
    all.classList.remove('blurred');
    gameState.paused = false;
    gameState.ended = false;
    gameState.time = 0;
    gameState.lives = 3;
    gameState.score = 0;
    playerEl.style.transform = `translateX(-50%)`;
    Player.x = 0; 
    //Remove bullets
    bullets.forEach(b => {
        b.element.remove();
    });

    enemyBullets.forEach(eb => {
        eb.element.remove()
    })
    
    enemies.forEach(e => {
        e.element.remove()
    })

    bullets.length = 0
    enemyBullets.length = 0
    enemies.length = 0

    createEnemies()
}



//================================================================= Enemy ==============================================================

// const gameCanvas = document.getElementById('gameCanvas');

const enemy = {
        width: 35,
        height: 40,
};

const enemies = [];
const enemyBullets = [];
const enemyBulletSpeed = 5;

let direction = 1;
const speed = 1;
const dropStep = 20;

function getGameSize() {
    return {
        height: gameCanvas.clientHeight,
        width: gameCanvas.clientWidth
    }
}

function createEnemy(x,y) {
    const enemyEl = document.createElement('div');

    enemyEl.className = 'enemy'
    enemyEl.innerHTML = `
        <svg width="35" height="40" viewBox="0 0 281 275" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M172.917 11.9762C183.722 21.806 192.209 35.1283 194.511 51.0965C194.696 52.9191 194.818 54.75 194.924 56.5809C195.546 56.5402 196.169 56.4995 196.811 56.4576C197.63 56.4259 198.449 56.3943 199.292 56.3617C200.103 56.321 200.914 56.2803 201.75 56.2384C204.041 56.5809 204.041 56.5809 205.762 57.8381C207.685 61.1232 208.058 64.3833 208.599 68.2554C208.721 69.0525 208.842 69.8497 208.967 70.671C209.225 72.3792 209.478 74.0884 209.726 75.7985C210.133 78.6033 210.557 81.4042 210.985 84.2049C211.721 89.026 212.444 93.8493 213.158 98.6747C215.164 99.2535 217.169 99.8322 219.236 100.429C219.201 99.583 219.166 98.7374 219.129 97.8662C219.102 96.7584 219.074 95.6506 219.046 94.5091C219.011 93.4103 218.976 92.3116 218.939 91.1795C219.236 88.1512 219.236 88.1512 220.577 86C222.275 84.6434 222.275 84.6434 225.314 84.6434C225.298 83.4929 225.282 82.3424 225.266 81.157C225.211 76.8882 225.176 72.6195 225.147 68.3504C225.132 66.5028 225.111 64.6552 225.085 62.8078C225.048 60.152 225.031 57.4968 225.017 54.8407C225.002 54.0148 224.986 53.1889 224.97 52.3379C224.968 46.7164 224.968 46.7165 226.508 43.7837C229.045 42.0868 230.935 42.0956 233.862 42.0838C234.654 42.0788 234.654 42.0788 235.462 42.0736C236.576 42.0712 237.689 42.0777 238.803 42.0924C240.504 42.1111 242.203 42.0925 243.905 42.0701C244.989 42.0724 246.073 42.0769 247.157 42.0838C248.632 42.0897 248.632 42.0897 250.137 42.0958C252.666 42.5497 252.666 42.5497 254.511 43.7837C256.382 47.3464 256.079 50.7565 256.002 54.8407C255.997 55.6922 255.993 56.5437 255.989 57.421C255.972 60.1377 255.933 62.8533 255.895 65.5697C255.879 67.4126 255.866 69.2556 255.853 71.0986C255.82 75.6139 255.767 80.1285 255.705 84.6434C256.426 84.7339 257.146 84.8243 257.889 84.9175C260.263 85.5204 260.263 85.5204 261.783 88.1512C261.913 90.5067 261.959 92.7688 261.931 95.1223C261.928 96.1386 261.928 96.1386 261.925 97.1755C261.916 99.3379 261.897 101.5 261.878 103.662C261.87 105.129 261.863 106.596 261.857 108.063C261.84 111.657 261.814 115.251 261.783 118.845C262.655 119.217 262.655 119.217 263.544 119.596C266.161 120.884 268.039 122.826 270.093 125.038C270.493 125.465 270.893 125.892 271.305 126.331C275.668 131.115 279.744 136.449 280.198 143.625C280.363 153.519 279.068 159.839 273.093 167.17C272.62 167.718 272.147 168.266 271.66 168.831C271.033 169.585 271.033 169.585 270.393 170.355C267.105 173.999 263.394 176.599 259.456 179.19C258.945 179.528 258.434 179.866 257.907 180.214C257.407 180.533 256.906 180.852 256.39 181.18C255.948 181.463 255.505 181.745 255.049 182.036C252.8 183.181 250.476 183.877 248.107 184.616C248.065 185.108 248.022 185.6 247.978 186.106C247.532 191.243 247.074 196.379 246.609 201.514C246.438 203.428 246.269 205.343 246.103 207.258C245.864 210.017 245.614 212.775 245.362 215.532C245.291 216.383 245.219 217.234 245.146 218.11C244.696 222.89 244.106 226.885 242.029 231.095C239.227 231.917 239.227 231.917 236.711 231.972C236.444 233.057 236.178 234.142 235.903 235.26C232.84 245.689 226.992 253.71 220.756 261.788C220.121 262.628 219.486 263.468 218.832 264.333C211.646 273.747 211.646 273.747 207.222 274.668C203.007 274.377 200.743 271.302 197.963 267.927C197.376 267.236 196.789 266.545 196.185 265.834C177.449 242.978 177.449 242.978 177.449 231.972C176.618 231.935 175.788 231.899 174.932 231.862C172.131 231.095 172.131 231.095 170.872 228.902C169.657 225.249 169.254 221.924 168.949 218.05C168.856 217.044 168.856 217.044 168.761 216.019C168.38 211.671 168.276 207.401 168.332 203.032C167.678 203.174 167.024 203.317 166.351 203.463C163.854 203.895 161.525 204.02 159.004 204.023C157.612 204.027 157.612 204.027 156.192 204.031C155.199 204.029 154.207 204.027 153.184 204.026C152.145 204.026 151.107 204.027 150.068 204.028C147.897 204.029 145.725 204.027 143.554 204.023C140.78 204.018 138.006 204.021 135.231 204.027C133.088 204.03 130.945 204.029 128.802 204.026C127.284 204.026 125.767 204.028 124.249 204.031C123.321 204.028 122.393 204.025 121.437 204.023C120.624 204.022 119.811 204.021 118.973 204.02C116.629 203.907 114.413 203.534 112.109 203.032C112.072 203.986 112.035 204.94 111.996 205.923C111.117 226.661 111.117 226.661 108.384 230.488C106.791 231.972 106.791 231.972 104.701 232.191C104.137 232.118 103.573 232.046 102.992 231.972C102.725 233.057 102.459 234.142 102.185 235.26C99.121 245.689 93.2735 253.71 87.0368 261.788C86.4021 262.628 85.7675 263.468 85.1136 264.333C77.9276 273.747 77.9276 273.747 73.5035 274.668C69.2885 274.377 67.0246 271.302 64.2438 267.927C63.6572 267.236 63.0705 266.545 62.4661 265.834C43.7301 242.978 43.7301 242.978 43.7301 231.972C42.8996 231.953 42.0691 231.935 41.2134 231.917C40.2889 231.645 39.3643 231.374 38.4118 231.095C35.9664 226.137 35.5491 221.14 35.0789 215.532C34.9978 214.645 34.9167 213.759 34.8332 212.845C34.5777 210.032 34.334 207.217 34.0906 204.402C33.9188 202.487 33.7461 200.571 33.5727 198.656C33.1508 193.977 32.7385 189.297 32.3337 184.616C31.8711 184.443 31.4085 184.27 30.9319 184.092C30.0161 183.745 30.0161 183.745 29.0818 183.391C28.4782 183.164 27.8746 182.937 27.2527 182.703C17.3105 178.643 7.30786 169.711 1.94303 159.184C-0.312571 152.624 -0.565059 145.138 0.981449 138.302C4.09407 130.179 10.6599 123.367 17.1383 118.845C17.6398 118.845 18.1412 118.845 18.6579 118.845C18.642 117.933 18.626 117.022 18.6096 116.083C18.5546 112.696 18.5197 109.31 18.4909 105.924C18.4757 104.459 18.4549 102.994 18.4286 101.529C18.3917 99.4221 18.3745 97.3156 18.3611 95.208C18.3454 94.5547 18.3297 93.9014 18.3136 93.2283C18.3124 90.1974 18.4695 88.4579 20.006 85.9563C21.6969 84.6434 21.6969 84.6434 24.736 84.6434C24.7201 83.4929 24.7042 82.3424 24.6878 81.157C24.6328 76.8882 24.5979 72.6195 24.5691 68.3504C24.5538 66.5028 24.533 64.6552 24.5067 62.8078C24.4699 60.152 24.4526 57.4968 24.4392 54.8407C24.4235 54.0148 24.4078 53.1889 24.3917 52.3379C24.39 46.7164 24.39 46.7165 25.9298 43.7837C28.4671 42.0868 30.3571 42.0956 33.2834 42.0838C34.0756 42.0788 34.0756 42.0788 34.8838 42.0736C35.9975 42.0712 37.1112 42.0777 38.2248 42.0924C39.9262 42.1111 41.6252 42.0925 43.3265 42.0701C44.4108 42.0724 45.495 42.0769 46.5793 42.0838C48.0542 42.0897 48.0542 42.0897 49.559 42.0958C52.0876 42.5497 52.0876 42.5497 53.9328 43.7837C55.8034 47.3464 55.501 50.7565 55.4234 54.8407C55.4191 55.6922 55.4148 56.5437 55.4104 57.421C55.3934 60.1377 55.3552 62.8533 55.3166 65.5697C55.3013 67.4126 55.2875 69.2556 55.275 71.0986C55.2415 75.6139 55.1891 80.1285 55.1266 84.6434C55.8475 84.7339 56.5683 84.8243 57.311 84.9175C59.6852 85.5204 59.6852 85.5204 61.2048 88.1512C61.3531 91.0938 61.3531 91.0938 61.2997 94.4543C61.286 95.5701 61.2723 96.6858 61.2582 97.8354C61.2405 98.6911 61.2229 99.5469 61.2048 100.429C64.2134 99.5604 64.2134 99.5604 67.2829 98.6747C67.4321 97.613 67.5812 96.5514 67.7349 95.4576C68.2924 91.5043 68.8597 87.5529 69.4299 83.602C69.675 81.8946 69.9174 80.1866 70.157 78.4782C70.5028 76.0169 70.8581 73.5577 71.2153 71.0986C71.3198 70.3393 71.4244 69.58 71.5321 68.7976C72.1504 64.6137 72.9283 61.1344 74.8805 57.4579C76.9809 56.2457 78.7144 56.4974 81.0536 56.5261C81.8861 56.534 82.7186 56.5419 83.5763 56.5501C84.5371 56.5653 84.5371 56.5653 85.5173 56.5809C85.5878 55.0073 85.5878 55.0073 85.6597 53.402C87.2262 37.6246 95.2808 23.5424 105.657 13.5246C107.506 11.9631 109.376 10.5697 111.349 9.22545C112.034 8.75858 112.718 8.2917 113.424 7.81068C132.264 -4.01615 155.42 -2.24133 172.917 11.9762Z" fill="#231F20"/>
        <path d="M42.7203 203.652C48.7468 203.652 54.7732 203.652 60.9822 203.652C60.9822 208.895 60.9822 214.138 60.9822 219.54C68.3994 219.54 75.8165 219.54 83.4584 219.54C83.4584 214.297 83.4584 209.054 83.4584 203.652C89.4849 203.652 95.5113 203.652 101.72 203.652C95.667 225.047 84.7829 242.741 73.6251 259.262C59.4906 250.819 50.0579 225.87 42.7203 207.624C42.7203 206.313 42.7203 205.002 42.7203 203.652Z" fill="#FF9100"/>
        <path d="M264.042 155.3C261.337 160.932 256.118 165.015 250.232 168.19C244.104 171.496 237.347 173.772 232.092 175.807C202.291 187.154 170.181 189.506 138.938 189.542H138.937C138.242 189.543 137.547 189.544 136.831 189.545C122.932 189.542 109.111 188.971 95.3199 187.08H95.319C94.7794 187.006 94.2392 186.933 93.6832 186.857H93.6842C81.1343 185.113 66.191 182.979 52.1324 178.51C38.1306 174.058 25.06 167.307 16.1188 156.374V155.3H264.042Z" fill="#871F00" stroke="#3125A3"/>
        <path d="M15.5006 142.624C18.205 136.992 23.4239 132.909 29.3102 129.734C35.4381 126.428 42.1948 124.152 47.4498 122.117C77.2514 110.77 109.361 108.418 140.604 108.382H140.605C141.3 108.381 141.995 108.38 142.712 108.379C156.61 108.382 170.431 108.953 184.222 110.844H184.223C184.763 110.918 185.303 110.991 185.859 111.067H185.858C198.408 112.811 213.351 114.945 227.41 119.414C241.412 123.866 254.482 130.617 263.423 141.55V142.624H15.5006Z" fill="#FF6738" stroke="#3125A3"/>
        <path d="M166.052 24.1337C166.515 24.4977 166.977 24.8617 167.453 25.2367C173.762 30.7644 178.65 40.1924 181.248 48.6884C181.624 52.5952 181.624 52.5952 182.007 56.5809C154.428 56.5809 126.848 56.5809 98.4332 56.5809C99.0241 50.4425 99.5792 46.7956 101.947 41.6179C102.359 40.7023 102.359 40.7023 102.779 39.7681C108.436 27.5482 117.692 20.1294 128.922 15.5868C141.677 11.5359 155.478 15.3439 166.052 24.1337Z" fill="#F2E76E"/>
        <path d="M83.9977 70.6122C121.105 70.6122 158.212 70.6122 196.443 70.6122C199.482 91.6591 199.482 91.6591 199.482 96.9208C199.022 96.8503 198.562 96.7798 198.088 96.7071C160.904 91.0881 122.609 89.7281 85.4938 96.7071C83.9977 96.9208 83.9977 96.9208 80.9586 96.9208C81.3993 87.9758 82.7101 79.5296 83.9977 70.6122Z" fill="#56555B"/>
        <path d="M178.72 203.652C184.747 203.652 190.773 203.652 196.982 203.652C196.982 208.895 196.982 214.138 196.982 219.54C204.399 219.54 211.817 219.54 219.458 219.54C219.458 214.297 219.458 209.054 219.458 203.652C225.485 203.652 231.511 203.652 237.72 203.652C231.667 225.047 220.783 242.741 209.625 259.262C195.491 250.819 186.058 225.87 178.72 207.624C178.72 206.313 178.72 205.002 178.72 203.652Z" fill="#FB9611"/>
        <path d="M231.392 98.6747C237.41 98.6747 243.427 98.6747 249.627 98.6747C249.627 103.016 249.627 107.357 249.627 111.829C243.609 109.514 237.592 107.199 231.392 104.813C231.392 102.788 231.392 100.762 231.392 98.6747Z" fill="#3D3C41"/>
        <path d="M237.47 56.5809C239.476 56.5809 241.482 56.5809 243.548 56.5809C243.548 65.8416 243.548 75.1022 243.548 84.6434C241.543 84.6434 239.537 84.6434 237.47 84.6434C237.47 75.3828 237.47 66.1222 237.47 56.5809Z" fill="#EAD709"/>
        <path d="M36.8922 56.5809C38.898 56.5809 40.9038 56.5809 42.9703 56.5809C42.9703 65.8416 42.9703 75.1022 42.9703 84.6434C40.9646 84.6434 38.9588 84.6434 36.8922 84.6434C36.8922 75.3828 36.8922 66.1222 36.8922 56.5809Z" fill="#EAD709"/>
        <path d="M30.8141 98.6747C36.8314 98.6747 42.8488 98.6747 49.0485 98.6747C49.0485 100.7 49.0485 102.726 49.0485 104.813C46.58 105.821 44.1105 106.825 41.6407 107.828C40.9415 108.113 40.2422 108.399 39.5217 108.693C38.8459 108.967 38.1702 109.241 37.4739 109.524C36.8532 109.776 36.2325 110.029 35.593 110.289C34.0225 110.887 32.4186 111.366 30.8141 111.829C30.8141 107.488 30.8141 103.147 30.8141 98.6747Z" fill="#3D3C41"/>
        </svg>
        `

    enemyEl.style.transform = `translate(${x}px,${y}px)`

    gameCanvas.append(enemyEl)

    return {
        x:x,
        y:y,
        element:enemyEl,
        alive: true,
        width: enemy.width,
        height: enemy.height  
    }

}

function createEnemies() {
    const gameSize = getGameSize();
    const spacing = 60;
    const totalWidth = (5 * spacing) + enemy.width;
    const startX = (gameSize.width - totalWidth) / 2;

    for (let i = 0 ; i <= 2 ; i++) {
        for (let j = 0 ; j <= 5;j++) {
            const x = startX + (spacing * j)
            const y = 30 + i * 50
            const newEnemy = createEnemy(x,y)
            enemies.push(newEnemy)
        };
    };
};


function getEnemyLimits() {
    let minX = Infinity;
    let maxX = -Infinity;
    
    for (const e of enemies) {
        if (!e.alive) continue
        if (e.x < minX) {
            minX = e.x
        } 
        if (e.x > maxX) {
            maxX = e.x
        }   
    }

    return{minX,maxX}
}


function moveEnemies() {
    if (isEnemiesReachedPlayer()) {
        toggleControl('lose')
    }
    const gameSize = getGameSize();

    for (const e of enemies) {
        if (!e.alive) continue;
        
        e.x += speed*direction
        e.element.style.transform = `translate(${e.x}px,${e.y}px)`
    }

    let limits = getEnemyLimits();
    
    if (limits.minX <= 0|| limits.maxX > gameSize.width - enemy.width) {
        direction *= -1
        
        for (const e of enemies) {
            if (!e.alive) continue; 
            e.y += dropStep
            e.element.style.transform = `translate(${e.x}px,${e.y}px)`
        }
    }
}


createEnemies()

const enemiesBullets= throttle(()=> {
    let aliveEnemies = enemies.filter((e) => e.alive);
    let index = Math.ceil(Math.random() * (aliveEnemies.length -1))
    let shooter = aliveEnemies[index]

    let bulletX = shooter.x + enemy.width / 2
    let bulletY = shooter.y + enemy.height 

    const bullet = document.createElement('img');
    
    bullet.src = 'source/bullet_down.svg';
    bullet.alt = '';
    bullet.className = 'bullet';

    bullet.style.transform = `translate(${bulletX}px,${bulletY}px)`

    gameCanvas.append(bullet)
    enemyBullets.push({ element: bullet, x: bulletX, y: bulletY, width:8 , height:20 })
},2000)

function isEnemiesReachedPlayer() {
    let enemyY = 0;
    for (let i = enemies.length -1 ; i >= 0 ; i--) {
        if (!enemies[i].alive) continue
        enemyY = enemies[i].y
        break
    } 
    
    const enemiesBottom = enemyY + enemy.height
    if (enemiesBottom >= Player.y) {
        return true 
    }
    return false
}

//===========================collising===================================

function playerRec() {
    const canvasRect = gameCanvas.getBoundingClientRect();
    const playerRect = playerEl.getBoundingClientRect();
    return {
        x: playerRect.left - canvasRect.left,
        y: playerRect.top -canvasRect.top,
        width: playerRect.width,
        height: playerRect.height
    }
}

function updateLives() {
    let hearts = "";

    for (let i = 0; i < 3; i++) {
        hearts += i < gameState.lives ? "♥ " : "♡ ";
    }

    livesEl.textContent = hearts.trim();
}

function updateScore() {
    scoreEl.textContent = gameState.score + 20
}

function collision() {
    const newPlayerRec = playerRec()
    enemyBullets.forEach((bullet,i) => {
        console.log((isColliding(bullet,newPlayerRec)))
            if (isColliding(bullet,newPlayerRec)) {
                bullet.element.remove()
                enemyBullets.splice(i,1)
                gameState.lives-- 
                updateLives()
                if (gameState.lives == 0){
                    toggleControl('lose')
                }
            }
    })

    bullets.forEach((bullet,i) => {
        for (let i = 0 ; i < enemies.length ; i++ ) {
            let e = enemies[i]
            if (isColliding(bullet,e)) {
                e.element.remove()
                bullet.element.remove()   
                enemies.splice(i,1)
                gameState.score+=20
                if (enemies.length <= 0) {
                    toggleControl('win')
                }
            } 
        }
    })
}