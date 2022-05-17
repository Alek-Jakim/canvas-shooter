const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// 1st thing is always set the canvas width & height
canvas.width = innerWidth;
canvas.height = innerHeight;

// Center player coordinates
const x_coord = canvas.width / 2;
const y_coord = canvas.height / 2;

// generate random number
function randomNum(start, end) {
    if (!start || !end) return Math.floor(Math.random() * 11);
    let numsArr = [];

    if (start > end) return "Wrong input";

    for (let i = start; i <= end; i++) {
        numsArr.push(i);
    }

    let index = Math.floor(Math.random() * numsArr.length);

    return numsArr[index];
}

// Create player
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};


//Create Projectiles - anytime when you need a multiple instances of sth, create a class
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

//Create Enemy
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}



const player = new Player(x_coord, y_coord, 30, "#333");
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
        const color = "green";


        //Get the x,y velocity
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        );

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));

        console.log(enemies)
    }, 2000);
}


//Animation Loop
function animate() {
    requestAnimationFrame(animate);

    //Clear the canvas so you don't get lines but actual projectiles
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //redraw the player after clearing the canvas
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update()
    });


    enemies.forEach((enemy) => {
        enemy.update();
    })
};



addEventListener("click", (event) => {

    //Get the x,y velocity
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    projectiles.push(new Projectile(player.x, player.y, 5, "red", velocity))
});

animate();
spawnEnemies();