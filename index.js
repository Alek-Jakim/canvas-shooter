const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// 1st thing is always set the canvas width & height
canvas.width = innerWidth;
canvas.height = innerHeight;

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

const x_coord = canvas.width / 2;
const y_coord = canvas.height / 2;


const player = new Player(x_coord, y_coord, 30, "#333");

player.draw();