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
        ellipse(this.x, this.y, 35, 35); 
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

    var radius = 175; 
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

var radius = 175; 

function draw() { 
    //background(255); 
    var x, y; 
    // draw initial bodies
    if (timeCounter < 50) { 
        // wait 
    } 
    else if (timeCounter < 100) { 
        body1 = new body(radius, 0, 41500000, magSpeed, Math.PI/2, 1); // BLUE
        body1.show(); 
    }
    else if (timeCounter < 150) { 
        body2 = new body(radius, 2*Math.PI/3, 41500000, magSpeed, 2*Math.PI/3+Math.PI/2, 2); // RED
        body2.show(); 
    }
    else if (timeCounter < 200) { 
        body3 = new body(radius, 4*Math.PI/3, 41500000, magSpeed, 4*Math.PI/3+Math.PI/2, 3); // GREEN 
        body3.show(); 
    }
    else if (timeCounter < 220) { 
        strokeWeight(1); 
        line(body1.x, body1.y, body2.x, body2.y); 
    }
    else if (timeCounter < 240) { 
        line(body2.x, body2.y, body3.x, body3.y); 
    }
    else if (timeCounter < 260) { 
        line(body1.x, body1.y, body3.x, body3.y); 
    }
    else if (timeCounter < 300) { 
        fill(0);
        y = (body2.y+body3.y)/2;  
        x = (body1.x+body2.x+body3.x)/3; 
        ellipse(x, y, 15); 
    }
    else if (timeCounter < 350) { 
        // lines to centre 
        y = (body2.y+body3.y)/2;  
        x = (body1.x+body2.x+body3.x)/3; 
        line(body1.x, body1.y, x, y); 
        line(body2.x, body2.y, x, y); 
        line(body3.x, body3.y, x, y); 
    }
    // else if (timeCounter < 570) { 
    //     background(255); 
    //     y = (body2.y+body3.y)/2+20*Math.cos(timeCounter*Math.PI*2/180);  
    //     x = (body1.x+body2.x+body3.x)/3+20*Math.sin(timeCounter*Math.PI*2/180); 
    //     body1.show(); 
    //     body2.show(); 
    //     body3.show(); 
    //     fill(0); 
    //     ellipse(x, y, 15); 
    //     line(body1.x, body1.y, body2.x, body2.y); 
    //     line(body2.x, body2.y, body3.x, body3.y); 
    //     line(body1.x, body1.y, body3.x, body3.y); 
    //     line(body1.x, body1.y, x, y); 
    //     line(body2.x, body2.y, x, y); 
    //     line(body3.x, body3.y, x, y);
    // }
    // console.log(timeCounter); 
    timeCounter++;
}
