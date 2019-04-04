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
        else if (color_num == 3) { 
            fill(0, 250, 154);
            // stroke(0, 250, 154); 
        }
        else { 
            fill(200, 100, 50); 
        }

        // stroke(0); 
        strokeWeight(1);
        if (color_num == 2) { 
            ellipse(this.x, this.y, 25, 25); 
        }
        else { 
            ellipse(this.x, this.y, 5, 5); 
        }
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

    // EQUILATERAL CONFIGURATION 
    body1 = new body(radius, Math.PI/3, 41500000, -2*magSpeed, Math.PI/4, 1); // BLUE
    body2 = new body(radius, 0, 5*41500000, magSpeed, 2*Math.PI/3+Math.PI/2, 2); // RED
    body3 = new body(radius, 2*Math.PI/3, 41500000, 2*magSpeed, 2*Math.PI/3+Math.PI/2, 3); // GREEN 
    body4 = new body(2*radius, 4*Math.PI/3, 41500000, 2*magSpeed, 4*Math.PI/3+Math.PI/2, 4);

    // PYTHAGOREAN 
    // body1 = new body(4*radius/5, 0, 3*51500000, -500, -600, 1); // BLUE
    // body2 = new body(4*radius, Math.PI/12, 5*51500000, -500, Math.PI/2, 2); // RED
    // body3 = new body(4*radius*3/4, -Math.PI/6, 5*51500000, -600, Math.PI/4, 3); // GREEN 
    body1.x-=200; 
    body2.x-=200; 
    body3.x-=200; 



    bodies = [body1, body2];    
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

var epsilon = 0;
var counter = 0; 
var positions1 = []; 
var positions2 = []; 
var positions3 = []; 

function draw() { 
    // background(255); 
    var c = document.getElementById("defaultCanvas0");
    var ctx = c.getContext("2d");
    
    // var force2 = getForceForBody(2); 
    // var force3 = getForceForBody(3);
    // body2.update(force2[0], force2[1]); 
    // body3.update(force3[0], force3[1]);

    if (timeCounter < 700) { 
        var force1 = getForceForBody(1); 
        body1.update(force1[0], force1[1]); 
        body1.show(); 
    }
    else if (timeCounter < 720) { 
        // background(255); 
    }
    else if (timeCounter < 721) { 
        bodies.push(body3); 
        bodies.shift(); 
    }
    else if (timeCounter < 1400) { 
        var force3 = getForceForBody(2); 
        body3.update(force3[0], force3[1]); 
        body3.show(); 
    }
    else if (timeCounter< 1450) { 
        bodies.push(body4);
        bodies.splice(1, 1); 
        console.log(bodies); 
    }
    else if (timeCounter < 2100) { 
        var force4 = getForceForBody(2); 
        body4.update(force4[0], force4[1]); 
        body4.show(); 
    }
    timeCounter += 1; 
    body2.show(); 
}