let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")
let RED = "255,0,0"
let BLUE = "0,0,255"
let GREEN = "0,255,0"
let currentKey = new Map();
class ParticalEngine {
    constructor() {
        this.parts = [];
        this.particles_enabled = true;
    }
    start(x, y) {
        if (!this.particles_enabled) return;
        this.parts = [];
        for (let i = 0; i < 30; i++) {
            this.parts.push({
                pos: {
                    x: x,
                    y: y,
                },
                vel: {
                    x: (Math.random() - 0.5) * 5,
                    y: (Math.random() - 0.5) * 5,
                },
                alive: true,
                age: 0,
            });
        }
    }
    draw_particles(color) {
        for (let i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            if (part.alive) {
                let a = Math.floor(100 - part.age * 2);
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = "red"
                ctx.fillStyle = `rgba(238,134,149,${a}%)`;
                ctx.fillRect(part.pos.x, part.pos.y, 10,10);
                ctx.restore();
            }
        }
    }
    update_particles() {
        this.parts.forEach((part) => {
            part.pos.x += part.vel.x;
            part.pos.y += part.vel.y;
            part.age += 1;
            if (part.age > 40) {
                part.alive = false;
            }
        });
    }
}
let particals = new ParticalEngine();
class Button {
    constructor(x,y,w,h,color) {
        this.color = color
        this.bounds = new Rect(x,y,w,h)
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    drawText(text) {
        ctx.font = this.bounds.w/4 + "px serif";
        ctx.fillStyle = "black"
        ctx.fillText(text, this.bounds.x+this.bounds.w/15,this.bounds.y+this.bounds.h/1.55);
    }
    
}
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
class Point {
	constructor(x,y) {
		this.x = x
		this.y = y
	}
}
class Rect {
	constructor(x,y,w,h) {
		this.w = w
		this.h = h
		this.x = x
		this.y = y
	}
	intersects(rect2) {
		let TL = new Point(this.x,this.y);
		let TR = new Point(this.x + this.w, this.y);
		let BL = new Point(this.x,this.y + this.h);
		let BR = new Point(this.x + this.w, this.y + this.h);
		if (rect2.contains(TL)) {
			return true
		} else if(rect2.contains(TR)) {
			return true
		} else if(rect2.contains(BL)) {
			return true
		} else if (rect2.contains(BR)) {
			return true
		} else {
			return false
		}
        
	}
	contains(pt) {
        if (pt.x < this.x)
        return false;
        if (pt.y < this.y)
        return false;
        if (pt.x > this.x + this.w)
        return false;
        if (pt.y > this.y + this.h)
        return false;
    return true;
	}
}
function pi() {
    return(Math.PI)
}
function log() {
    let prams = arguments
    for (let i = 0; i < arguments.length; i++) {
        console.log(prams[i])
    }
}
function update(name) {
    requestAnimationFrame(name)
}
class Grid {
    constructor(w,h) {
        this.width = w
        this.height = h
        this.array = []
        this.tileSize = 30
        for(let j = 0; j<this.height; j++) {
            let row = []
            for(let i = 0; i<this.width; i++) {
                row[i] = 0
            }
            this.array[j] = row
        }
    }
    getAt(x,y) {
        return this.array[y][x]
    }
    setAt(x,y,v) {
        this.array[y][x] = v
    }
    fill(color) {
        for (let j=0; j<this.height; j++) {
            for (let i=0; i<this.width; i++) {
                this.setAt(i,j,color)
            }
        }
    }
    draw() {
        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                if (this.getAt(w,h) === 'black') {
                    ctx.fillStyle = "black"
                    ctx.fillRect(w*(this.tileSize),h*(this.tileSize),this.tileSize,this.tileSize)
                }
                if (this.getAt(w,h) === 'red') {
                    ctx.fillStyle = "red"
                    ctx.fillRect(w*(this.tileSize),h*(this.tileSize),this.tileSize,this.tileSize)
                }
                if (this.getAt(w,h) === 'white') {
                    ctx.fillStyle = "white"
                    ctx.fillRect(w*(this.tileSize),h*(this.tileSize),this.tileSize,this.tileSize)
                }
            }
        } 
    }
    canMove(player,direction) {
        if (direction === "forward") {
            if (this.getAt((player.bounds.x),(player.bounds.y)-1) === "black") {
                return true;
            }
        }
        if (direction === "left") {
            if (this.getAt((player.bounds.x)-1,(player.bounds.y)) === "black") {
                return true;
            }
        }
        if (direction === "down") {
            if (this.getAt((player.bounds.x),(player.bounds.y)+1) === "black") {
                return true;
            }
        }
        if (direction === "right") {
            if (this.getAt((player.bounds.x)+1,(player.bounds.y)) === "black") {
                return true;
            }

        }
    }
}

function Camera() {
    const cameraX = (canvas.width / 30) - player.bounds.x*30;
    const cameraY = (canvas.height /30) - player.bounds.y*30;
    ctx.save();
    ctx.translate(cameraX+canvas.width/2-50, cameraY+canvas.height/2);
}   
class Canvas {
    constructor(width,height) {
        this.width = width
        this.height = height
        canvas.width = width
        canvas.height = height
        this.lineWidth = 1;
    }
    fillText(text,x,y,size,color) {
        ctx.font = size + "px serif";
        ctx.fillStyle = color
        ctx.fillText(text, x, y,);
    }
    fillRect(x,y,w,h,color) {
        ctx.fillStyle = color
        ctx.fillRect(x,y,w,h)
    }
    strokeRect(x,y,w,h,color) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = color
        ctx.strokeRect(x,y,w,h)
    }
    drawImage(image,x,y,w,h) {
        this.sprite = new Image();
        this.sprite.src = image
        ctx.drawImage(this.sprite,x,y,w,h)
    }
    setTitle(name) {
        document.querySelector("title").innerHTML = name
    }
    smoothing(d) {
        ctx.imageSmoothingEnabled = d;
    }
    clear() {
        log("Clearing Screen")
        ctx.clearRect(0, 0, this.width, this.height);
    }
    save() {
        ctx.save();
    }
    restore() {
        ctx.restore();
    }
}
function Floor(number) {
    return(Math.floor(number))
}
function Round(number) {
    return(Math.round(number))
}
function Save(data,name) {
    localStorage.setItem(data, name);
}
function GetSaved(name) {
    return(localStorage.getItem(name))
}
function RemoveItem(name) {
    localStorage.removeItem(name)
}
function ClearStorage() {
    localStorage.clear();
}
function init() {
    keyboardInit();
}
init();