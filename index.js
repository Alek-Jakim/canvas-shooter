import { randomNum } from "./utils.js"
import { Player, Enemy, Projectile } from "./classes.js"

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// 1st thing is always set the canvas width & height
canvas.width = innerWidth;
canvas.height = innerHeight;

// Center player coordinates
const x_coord = canvas.width / 2;
const y_coord = canvas.height / 2;

const enemySpeed = 1000;

const player = new Player(x_coord, y_coord, 10, "#fff");
player.draw();


// Group projectiles - management for multiple instances of the same object
const projectiles = [];

//Enemies array
const enemies = [];


function spawnEnemies() {
    setInterval(() => {
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
        // let color = (radius >= 10 && radius <= 20) ? "#42FF33" : (radius >= 20 && radius <= 30) ? "#039CDA" : "#9D33DD";

        const color = `hsl(${Math.floor(Math.random() * 361)}, 50%, 50%)`


        //Get the x,y velocity
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        );

        // multiply velocity by 2 for faster enemies
        const velocity = {
            x: Math.cos(angle) * 2,
            y: Math.sin(angle) * 2
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, enemySpeed);
}


let animationId;

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
    projectiles.forEach((projectile, index) => {
        projectile.update();

        //remove projectile from edge of screen
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });


    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);


        if (distance - enemy.radius - player.radius < 3) {
            // this stops the animation when player gets hit - indicating game over
            cancelAnimationFrame(animationId);
            console.log("game over");
        }

        projectiles.forEach((projectile, projectileIndex) => {
            //hypot = hypotenuse aka the distance between two points
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            //remove projectile & enemy upon collision
            if (distance - enemy.radius - projectile.radius < 0.5) {


                //Shrink the enemy if it's a certain size
                if (enemy.radius - 10 > 5) {

                    // Using GSAP to gradually shrink the enemy instead of instantly - creates a nice visual effect (script tag included in html)
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                } else {
                    //setTimeout is to prevent the flash effect upon collision
                    setTimeout(() => {
                        enemies.splice(enemyIndex, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                }
            }
        })
    })
};


addEventListener("click", (event) => {
    //Get the x,y velocity
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );

    // multiply velocity by 4 for faster projectiles
    const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4
    };

    projectiles.push(new Projectile(player.x, player.y, 5, "#fff", velocity));

});

animate();
spawnEnemies();