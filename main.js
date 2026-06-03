const gameCanvas = document.getElementById('gameCanvas');
//Game Info
const score = document.getElementById('score');
const level = document.getElementById('level');
const lives = document.getElementById('lives');
const highScore = document.getElementById('high-score');
//Controls
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

function createSprite(x,y,w,h,color) {
    const el= document.createElement('div');

    el.style.position = 'absolute';
    
    el.style.width = w +'px';
    el.style.position = h + 'px';
    
    el.style.backgroundColor = color;

    gameCanvas.appendChild(el);

    return {
        x,
        y,
        el
    };
}


function render(entity) {
    entity.el.style.transform =
        `translate(${entity.x}px,
        ${entity.y}px)`;
    
}

const player =
    createSprite(
        100,
        200,
        50,
        50,
        "yellow"
    );

//Game loop
let lastTime = 0;
let paused = false;

function gameLoop(time) {
    const delta = (time - lastTime) / 1000;

    lastTime = time;

    if (paused) {
        requestAnimationFrame(
            gameLoop
        );

        return;
    }

    update(delta);

    render(player);

    requestAnimationFrame(
        gameLoop
    );
}

requestAnimationFrame(
    gameLoop
);

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


//
pauseBtn.addEventListener(
    'click',
    () => paused = !paused
);

