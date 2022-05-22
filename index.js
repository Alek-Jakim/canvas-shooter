import { randomNum } from "./utils.js"
import { Player, Enemy, Projectile, Particle } from "./classes.js"

// DOM Elements
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const endScoreEl = document.getElementById("game-over-score");
const modalEl = document.getElementById("modal");
const buttonEl = document.getElementById("restart-btn");
const startButtonEl = document.getElementById("start-btn");
const startModalEl = document.getElementById("start-modal");



// 1st thing is always set the canvas width & height
canvas.width = innerWidth;
canvas.height = innerHeight;

//Mouse position coordinates for keyboard event (needed to find mouse position) - updated on mousemove event
let clientX;
let clientY;

// Center player coordinates
const x_coord = canvas.width / 2;
const y_coord = canvas.height / 2;

const enemySpeed = 1500;

let player = new Player(x_coord, y_coord, 10, "#fff");
player.draw();


// Group projectiles - management for multiple instances of the same object
let projectiles = [];
//Enemies array
let enemies = [];
//Particles array
let particles = [];
// Needed to stop/restart the animation
let animationId;
// Game Score
let score = 0;
//Cancel the interval set by spawnEnemies()
let intervalId;


function init() {

    player = new Player(x_coord, y_coord, 10, "white");

    // Reset values
    enemies = [];
    projectiles = [];
    particles = [];
    score = 0;
    animationId;

    scoreEl.innerHTML = 0;
}


function spawnEnemies() {
    intervalId = setInterval(() => {
        console.log(intervalId)
        //Math.random() * (30 - 4) + 4; - get a random num from 4 to 30

        const radius = randomNum(10, 40);

        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.floor(Math.random() * 361)}, 50%, 50%)`

        //Get the x,y velocity
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        );

        let enemySpeed = Math.floor(Math.random() * (3 - 1) + 2);

        // multiply velocity by 2 for faster enemies
        const velocity = {
            x: Math.cos(angle) * enemySpeed,
            y: Math.sin(angle) * enemySpeed
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, enemySpeed);
}



//Animation Loop
function animate() {
    animationId = requestAnimationFrame(animate);

    //Clear the canvas so you don't get lines but actual projectiles
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    //rgba used to give the elements a blur effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    //redraw the player after clearing the canvas
    player.draw();


    // LOOP THROUGH PARTICLES
    for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index];

        particle.update();

        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    }

    // LOOP THROUGH PROJECTILES
    for (let index = projectiles.length - 1; index >= 0; index--) {
        const projectile = projectiles[index];

        projectile.update();

        //remove projectile from edge of screen
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {

            projectiles.splice(index, 1);

        }
    }

    // LOOP THROUGH ENEMIES
    for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
        const enemy = enemies[enemyIndex];

        enemy.update();

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if (distance - enemy.radius - player.radius < 3) {
            // this stops the animation when player gets hit - indicating game over
            cancelAnimationFrame(animationId);
            clearInterval(intervalId);
            modalEl.style.display = "block"
        }

        for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
            const projectile = projectiles[projectileIndex];

            //hypot = hypotenuse aka the distance between two points
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            //remove projectile & enemy upon collision
            if (distance - enemy.radius - projectile.radius < 0.5) {

                // CREATE EXPLOSIONS
                // enemy.radius * 2 -> more particles will be generated for bigger enemies
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 3, enemy.color, {
                        // get a random negative or positive number
                        x: (Math.random() - 0.5) * (Math.random() * 6),
                        y: (Math.random() - 0.5) * (Math.random() * 6)
                    }))
                }
                //Shrink the enemy if it's a certain size
                if (enemy.radius - 10 > 5) {
                    // if we shrink the enemy, get a smaller score
                    score += 12;
                    // Using GSAP to gradually shrink the enemy instead of instantly - creates a nice visual effect (script tag included in html)
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    projectiles.splice(projectileIndex, 1);
                } else {
                    // if we destroy the enemy, get a bigger score
                    score += 18;
                    //Remove enemy if too small
                    enemies.splice(enemyIndex, 1);
                    projectiles.splice(projectileIndex, 1);
                }
                scoreEl.innerHTML = score;
                endScoreEl.innerHTML = score;
            }
        }
    }
};




// Event Listeners
addEventListener("click", (event) => {
    //Get the x,y velocity
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );

    // multiply velocity by 4 for faster projectiles
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    };

    projectiles.push(new Projectile(player.x, player.y, 5, "#fff", velocity));
});


addEventListener("keyup", (event) => {

    if (event.key === "f" || event.key === "F") {
        //Get the x,y velocity
        const angle = Math.atan2(
            clientY - canvas.height / 2,
            clientX - canvas.width / 2
        );

        // multiply velocity by 4 for faster projectiles
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        };

        projectiles.push(new Projectile(player.x, player.y, 5, "#fff", velocity));
    }
});


addEventListener("mousemove", (event) => {
    clientX = event.clientX;
    clientY = event.clientY;
});


buttonEl.addEventListener("click", () => {
    //Restart and reinitialize game values
    init();

    // Restart animation loop
    animate();

    //Deactivate modal
    modalEl.style.display = "none";

    // Activate enemies after clearing interval
    spawnEnemies();
});


startButtonEl.addEventListener("click", () => {
    animate();
    spawnEnemies();

    startModalEl.style.display = "none";

    document.querySelector(".score-container").style.display = "block";
});



