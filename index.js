const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// 1st thing is always set the canvas width & height
canvas.width = innerWidth;
canvas.height = innerHeight;

// Center player coordinates
const x = canvas.width / 2;
const y = canvas.height / 2;

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



const player = new Player(x, y, 30, "#333");
player.draw();


// const projectile = new Projectile(
//     player.x,
//     player.y,
//     5,
//     "purple",
//     {
//         x: -1,
//         y: -1
//     });


// Group projectiles - management for multiple instances of the same object
const projectiles = [];



//Animation Loop

function animate() {
    requestAnimationFrame(animate);

    //Clear the canvas so you don't get lines but actual projectiles
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //redraw the player after clearing the canvas
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update()
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
