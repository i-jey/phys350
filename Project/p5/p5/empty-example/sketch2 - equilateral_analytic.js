var time_step = 0.001; 
var clock = 0; 
var FINAL_TIME = 1; 

function body(r0, theta_0, mass, initial_velocity_x, initial_velocity_y, color_num) { 
    this.x = r0*cos(theta_0)+width/2; 
    this.y = r0*sin(theta_0)+height/2;
    this.mass = mass; 
    this.vx = initial_velocity_x;
    this.vy = initial_velocity_y; 
    var positions = [[]]; 

    // analytic 
    var distance_to_center = r0;
    var magnitude_v0 = pow(initial_velocity_x*initial_velocity_x + initial_velocity_y*initial_velocity_y, 0.5);
    this.l = this.mass*distance_to_center*magnitude_v0; 
    var alpha = gravity_const*this.mass/pow(3, 0.5); 
    this.energy = (1/2)*this.mass*magnitude_v0*magnitude_v0 - alpha*this.mass/(distance_to_center*pow(3, 0.5)); 
    this.p = this.l*this.l/(this.mass*alpha); 
    console.log(2*this.l*this.l*this.energy/(this.mass*alpha*alpha)); 
    if (abs(2*this.l*this.l*this.energy/(this.mass*alpha*alpha)) < 1) { 
        this.e = pow(1 + 2*this.l*this.l*this.energy/(this.mass*alpha*alpha), 0.5); 
    }
    else { 
        this.e = 0; 
    }
    this.analytic = function(theta) { 
        var radius = (this.p / (1+this.e*cos(theta+Math.PI))); 
        this.x = radius*cos(theta+theta_0) + width/2; 
        this.y = radius*sin(theta+theta_0) + height/2; 
    }

    this.update = function(force_x, force_y) { 
        var xAcceleration = force_x/this.mass; 
        var yAcceleration = force_y/this.mass; 
        this.vx = this.vx + xAcceleration*time_step; 
        this.vy = this.vy + yAcceleration*time_step; 
        this.x += this.vx*time_step; 
        this.y += this.vy*time_step; 
        positions.push([this.x, this.y]); 
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

const width = 1500; 
const height = 1500; 
const gravity_const = 1; 
// var speed1 = 450;
// var speed1 = 0.0045; 
var speed1 = 0.04500; 
var speed2x = 0.04500; 
var speed2y = 0; 
var speed3x = 0.04500; 
var speed3y = 0; 
let buffer; 
var radius = 100; 
function setup() { 
    createCanvas(width, height); 
    buffer = createGraphics(width, height); 
    buffer.background(255); 

    body1 = new body(radius, 0, 10000000, -speed1, 0, 1); // BLUE
    body2 = new body(radius, 2*Math.PI/3, 10000000, speed2x, speed2y, 2); // RED
    body3 = new body(radius, 4*Math.PI/3, 10000000, speed3x, -speed3y, 3); // GREEN
    
    body1.e = 0.5; 
    body2.e = 0.5; 
    body3.e = 0.5; 
    noLoop(); 
}

function force(mass1, mass2, x1, y1, x2, y2) { 
    var force = 1*gravity_const*mass1*mass2 / (epsilon + Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
    return force; 
}
function mouseClicked() {
    loop(); 
}

var epsilon = 10;
var totalForces = new Array(6); 
var theta = 0; 
var counter = 0; 
function draw() { 
    // background(255); 
    var c = document.getElementById("defaultCanvas0");
    var ctx = c.getContext("2d");

    body1.analytic(theta); 
    body2.analytic(theta); 
    body3.analytic(theta); 
    counter++; 

    if (counter % 1 == 0){ 
        theta += 0.01; 
    }
    fill(0); 
    strokeWeight(0); 
    ctx.clearRect(width/2 + 95+200, height/2 - 55, 160, 50); 
    text("Angle: " + Math.round(1000*theta*180/Math.PI)/1000, width/2 + 100+200, height/2 - 20);
    text("Eccentricity: " + Math.round(body1.e*100)/100 + ", " + Math.round(body2.e*100)/100 + ", " + Math.round(body3.e*100)/100, width/2 + 100+200, height/2 - 40);
    body1.show(); 
    // body2.show();
    // body3.show(); 
    fill(0); 
    ellipse((body1.x+body2.x+body3.x)/3, (body1.y+body2.y+body3.y)/3, 15, 15); 
    // console.log(theta % 0.2);
    if (theta % 0.2 < pow(10, -2)) { 
        // noLoop(); 
        theta += 0.01; 
    }
    // stroke(100, 200, 255); 
    // line(body1.x, body1.y, body2.x, body2.y); 
    // stroke(240, 128, 128); 
    // line(body1.x, body1.y, body3.x, body3.y); 
    // stroke(0, 250, 154);
    // line(body2.x, body2.y, body3.x, body3.y); 
}