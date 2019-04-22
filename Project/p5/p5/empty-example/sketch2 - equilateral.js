const width = 1500; 
const height = 1500; 
var time_step = 0.0001; 
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
    var positions = [[]]; \

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

    // EQUILATERAL CONFIGURATION 
    // body1 = new body(radius, 0, 41500000, magSpeed, Math.PI/2, 1); // BLUE
    // body2 = new body(radius, 2*Math.PI/3, 41500000, magSpeed, 2*Math.PI/3+Math.PI/2, 2); // RED
    // body3 = new body(radius, 4*Math.PI/3, 41500000, magSpeed, 4*Math.PI/3+Math.PI/2, 3); // GREEN 

    // PYTHAGOREAN 
    // body1 = new body(4*radius/5, 0, 3*51500000, 500, 0, 1); // BLUE
    // body2 = new body(4*radius, Math.PI/12, 3*51500000, -500, Math.PI/2, 2); // RED
    // body3 = new body(4*radius*3/4, -Math.PI/6, 5*51500000, -600, Math.PI/4, 3); // GREEN 

    // 0 initial velocity
    magSpeed = 400; 
    body1 = new body(radius, 0, 101500000, magSpeed, Math.PI/3, 1); // BLUE
    body2 = new body(radius, 2*Math.PI/3, 41500000, magSpeed, Math.PI/3+Math.PI/2, 2); // RED
    body3 = new body(radius, 4*Math.PI/3, 41500000, magSpeed, Math.PI/2, 3); // GREEN 

    body1.x-=200; 
    body2.x-=200; 
    body3.x-=200; 



    bodies = [body1, body2, body3];    
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

    for (var i = 0; i < bodies.length; i++) { \
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
var FRAME_RATE = 2; 
function draw() { 
    // background(255); 
    var c = document.getElementById("defaultCanvas0");
    var ctx = c.getContext("2d");


    for (var i = 0; i < bodies.length; i++) { 
        var force = getForceForBody(i+1); 
        bodies[i].update(force[0], force[1]);

        if (counter % FRAME_RATE == 0) { 
            bodies[i].show(); 
        }
    }
    
    // var force1 = getForceForBody(1); 
    // var force2 = getForceForBody(2); 
    // var force3 = getForceForBody(3); 
    // body1.update(force1[0], force1[1]); 
    // body2.update(force2[0], force2[1]); 
    // body3.update(force3[0], force3[1]);
    timeCounter += time_step; 

    // if (counter % 1 == 0) { 
        // body1.show(); 
        // body2.show();
        // body3.show(); 
        // body4.show();
        // line(body1.x, body1.y, body2.x, body2.y); 
        // line(body1.x, body1.y, body3.x, body3.y); 
        // line(body2.x, body2.y, body3.x, body3.y); 
    // }
    
    ctx.clearRect(width/2 - 253, height/2 - 170, 70, 25); 
    fill(0); 
    strokeWeight(0); 
    text("Time: " + Math.round(timeCounter*1000)/1000, width/2 - 250, height/2 - 150);
    counter++; 
    
    // if (timeCounter >= TIME_END) { 
    //     noLoop(); 
    //     var val1 = positions1.toString(); 
    //     var val2 = positions2.toString(); 
    //     var val3 = positions3.toString(); 
    //     console.log(val1); 
    //     console.log(val2); 
    //     console.log(val3); 
    // }
    // console.log(timeCounter % 0.2); 
    if (timeCounter > 4) {
        if (timeCounter % 0.2 < pow(10, -3)) { 
            // noLoop(); 
            timeCounter += time_step; 
        }
    }
}