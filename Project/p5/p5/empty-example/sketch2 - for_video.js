const width = 1500; 
const height = 1500; 
var time_step = 0.001; 
var timeCounter = 0; 
var TIME_END = 2; 
var wOffset = width/2; 
var hOffset = height/2; 
var bodies = []; 
function body(r, theta, mass, mag_v, v_theta, color_num) { 
    this.x = r*Math.cos(theta) + wOffset; 
    this.y = r*Math.sin(theta) + hOffset; 
    
    this.mass = mass; 
    this.vx = mag_v*Math.cos(v_theta);
    this.vy = mag_v*Math.sin(v_theta); 
    var positions = [[]]; 

    this.update = function(force_x, force_y) { 
        var xAcceleration = force_x/this.mass; 
        var yAcceleration = force_y/this.mass; 
        this.vx = this.vx + xAcceleration*time_step; 
        this.vy = this.vy + yAcceleration*time_step; 
        this.x += this.vx*time_step; 
        this.y += this.vy*time_step; 
        positions.push([timeCounter, this.x, this.y]); 
    }
    this.update_direct = function(x, y) { 
        this.x = x; 
        this.y = y; 
    }
    this.show = function() { 
        if (color_num == 1) { 
            fill(100, 200, 255); 
            // stroke(100, 200, 255); 
        }
        else if (color_num == 2) { 
            fill(240, 128, 128); 
            // stroke(240, 128, 128); 
        }
        else { 
            fill(0, 250, 154);
            // stroke(0, 250, 154); 
        }

        // stroke(0); 
        strokeWeight(1);
        ellipse(this.x, this.y, 5, 5); 
    }
}

const gravity_const = 1; 

var magSpeed = 500; 
var rads_60 = Math.PI*60/180; 

// red speed 
var rSpeedX = magSpeed*Math.cos(rads_60); 
var rSpeedY = magSpeed*Math.sin(rads_60); 

// blue speed 
var bSpeedX = 0; 
var bSpeedY = -magSpeed; 

// green speed
var gSpeedX = -magSpeed*Math.sin(rads_60); 
var gSpeedY = magSpeed*Math.cos(rads_60);

let buffer; 
function setup() { 
    createCanvas(width, height); 
    buffer = createGraphics(width, height); 
    buffer.background(255); 

    var radius = 75; 
    // SWITCHING TO POLAR DEFINITION 
    body1 = new body(radius, 0, 41500000, magSpeed, Math.PI/2, 1); // BLUE
    body2 = new body(radius, 2*Math.PI/3, 41500000, magSpeed, 2*Math.PI/3+Math.PI/2, 2); // RED
    body3 = new body(radius, 4*Math.PI/3, 41500000, magSpeed, 4*Math.PI/3+Math.PI/2, 3); // GREEN 
    bodies = [body1, body2, body3];    
    

    // hard coded positions for video 
    body1.x -= 200; 
    body1.y += 100; 
    body2.x += 200; 
    body2.y -= 60; 
    body3.x += 50; 
    body3.y -= 50;
    noLoop(); 
}

function force(mass1, mass2, x1, y1, x2, y2) { 
    var force = 1*gravity_const*mass1*mass2 / (epsilon + Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
    return force; 
}

function getForceForBody(bodyNum) { 
    var index = bodyNum-1; 
    var body = bodies[index]; 
    var xForce = 0; 
    var yForce = 0; 
    var forceMagnitude = 0; 
    var theta; 

    for (var i = 0; i < bodies.length; i++) { 
        if (i==index) { 
            continue; 
        } 
        forceMagnitude = gravity_const*body.mass*bodies[i].mass / (epsilon + Math.pow(bodies[i].x-body.x, 2)+Math.pow(bodies[i].y-body.y, 2));
        theta = abs(Math.atan((bodies[i].y-body.y) / (bodies[i].x-body.x))); 
        xForce += forceMagnitude*Math.cos(theta)*Math.sign(bodies[i].x-body.x); 
        yForce += forceMagnitude*Math.sin(theta)*Math.sign(bodies[i].y-body.y); 
    }
    return [xForce, yForce]; 
}

function mouseClicked() {
    loop(); 
}

function mouseMoved() { 
    console.log(event.x, event.y); 
}

var epsilon = 0;
var counter = 0; 

var mass1 = 50; 
var mass2 = 50; 
var mass3 = 50; 

function draw() { 
    //background(255); 
    // setTimeout(first(), 1000); 

    // draw initial bodies 
    if (timeCounter < 100) { 
        fill(0); 
        ellipse(body1.x, body1.y, 50); 
        ellipse(body2.x, body2.y, 50); 
        ellipse(body3.x, body3.y, 50);
    }
    // increase masses
    else if (timeCounter < 300) { 
        if (mass1 < 55) { 
            if (timeCounter % 1 == 0) {
                mass1 += 0.5; 
                fill(100, 200, 255); 
                ellipse(body1.x, body1.y, mass1)
            }
        }
        if (mass2 < 25*4) {
            if (timeCounter % 1 == 0) { 
                        mass2 += 0.5; 
                        fill(240, 128, 128); 
                        ellipse(body2.x, body2.y, mass2); 
            }
        }
        if (mass3 < 25*3) {
            if (timeCounter % 1 == 0) { 
                        mass3 += 0.5; 
                        fill(0, 250, 154);
                        ellipse(body3.x, body3.y, mass3); 
            }
        }
        fill(0); 
        text(26); 
        text("m1", body1.x-6, body1.y+1); 
        text("m2", body2.x-5, body2.y+2); 
        text("m3", body3.x-6, body3.y+1)
    }
    // line to an arbritrary point 
    else if (timeCounter < 360) { 
        strokeWeight(2); 
        var randX = body2.x-50; 
        var randY = body2.y+150; 
        ellipse(randX, randY, 10, 10); 

        if (timeCounter > 350) {
            stroke(100, 200, 255); 
            line(body1.x, body1.y, randX, randY); 
            stroke(240, 128, 128); 
            line(body2.x, body2.y, randX, randY);
            stroke(0, 250, 154); 
            line(body3.x, body3.y, randX, randY);
            stroke(0); 
            strokeWeight(1); 
            fill(0); 
            textSize(26);
            text("r1", (body1.x+randX)/2, 5+(body1.y+randY)/2); 
            text("r2", (body2.x+randX)/2, 25+(body2.y+randY)/2); 
            text("r3", (body3.x+randX)/2, 15+(body3.y+randY)/2); 
        }
    }
    // console.log(timeCounter); 
    timeCounter++;
}
