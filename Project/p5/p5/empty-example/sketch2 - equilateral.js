const width = 1500; 
const height = 1500; 
var time_step = 0.001; 
var wOffset = width/2; 
var hOffset = height/2; 

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
        positions.push([this.x, this.y]); 
    }
    this.update_direct = function(x, y) { 
        this.x = x; 
        this.y = y; 
    }
    this.show = function() { 
        if (color_num == 1) { 
            fill(100, 200, 255); 
            stroke(100, 200, 255); 
        }
        else if (color_num == 2) { 
            fill(240, 128, 128); 
            stroke(240, 128, 128); 
        }
        else { 
            fill(0, 250, 154);
            stroke(0, 250, 154); 
        }
        // if (positions.length > 25) { 
        //     for (var i = positions.length-1; i > positions.length-25; i--) { 
        //         strokeWeight(1); 
        //         ellipse(positions[i][0], positions[i][1], 1, 1); 
        //     }
        // }
        stroke(0); 
        ellipse(this.x, this.y, 5, 5); 
    }
}

const gravity_const = 1; 

var magSpeed = 1000; 
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
    // old masses 100000000 10000000000 100000000
    // body1 = new body(750, 600, 750000000000000000, 0, 0, 1); // BLUE
    // body2 = new body(650, 600, 1000000000000000000, 0, 0, 2); // RED
    // body3 = new body(725, 730, 1000000000000000000, 0, 3); // GREEN

    // body1 = new body(850, 750, 41500000, bSpeedX, bSpeedY, 1); // BLUE
    // body2 = new body(700, 836.6025403784439, 41500000, rSpeedX, rSpeedY, 2); // RED
    // body3 = new body(700, 663.3974596215562, 41500000, gSpeedX, gSpeedY, 3); // GREEN 

    // body1 = new body(800, 626.7949192, 41500000, -magSpeed, 0, 1); // BLUE
    // body2 = new body(700, 800, 41500000, magSpeed*Math.cos(Math.PI*30/180), magSpeed*Math.sin(Math.PI*30/180), 2); // RED
    // body3 = new body(900, 800, 41500000, magSpeed*Math.sin(Math.PI*30/180), -magSpeed*Math.cos(Math.PI*30/180), 3); // GREEN 

    var radius = 75; 
    // SWITCHING TO POLAR DEFINITION 
    body1 = new body(radius, Math.PI/2, 41500000, magSpeed, Math.PI/2+Math.PI/2, 1); // BLUE
    body2 = new body(radius, Math.PI/2+2*Math.PI/3, 41500000, magSpeed, Math.PI/2+2*Math.PI/3+Math.PI/2, 2); // RED
    body3 = new body(radius, Math.PI/2+4*Math.PI/3, 41500000, magSpeed, Math.PI/2+4*Math.PI/3+Math.PI/2, 3); // GREEN 
    
    var bodies = [body1, body2, body3]; 
}
var k1, k2, k3, k4; 
function rk4() { 
    for (var i = 0; i < bodies.length; i++) { 
        k1x = time_step*bodies[i].vx; 
        k1y = time_step*bodies[i].vy; 
    }
}

function force(mass1, mass2, x1, y1, x2, y2) { 
    var force = 1*gravity_const*mass1*mass2 / (epsilon + Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
    return force; 
}

function forceDirection(coordinate_1, coordinate_2, coordinate_3, force12, force13) { 
    var netForce; 
    if (coordinate_1 <= coordinate_2 && coordinate_1 <= coordinate_3) { 
        netForce = force12 + force13; 
    }
    else if (coordinate_1 <= coordinate_2 && coordinate_1 >= coordinate_3) { 
        netForce = force12 - force13; 
    }
    else if (coordinate_1 >= coordinate_2 && coordinate_1 >= coordinate_3) { 
        netForce = -force12 - force13; 
    }
    else if (coordinate_1 >= coordinate_2 && coordinate_1 <= coordinate_3) { 
        netForce = -force12 + force13; 
    }
    return netForce; 
}
function totalForce(x1, y1, x2, y2, x3, y3, force12, force13, force23) { 
    // x forces
    var xForce_body1 = forceDirection(x1, x2, x3, force12, force13); 
    var xForce_body2 = forceDirection(x2, x1, x3, force12, force23);
    var xForce_body3 = forceDirection(x3, x1, x2, force13, force23); 

    // y forces 
    var yForce_body1 = forceDirection(y1, y2, y3, force12, force13); 
    var yForce_body2 = forceDirection(y2, y1, y3, force12, force23); 
    var yForce_body3 = forceDirection(y3, y1, y2, force13, force23); 

    return [xForce_body1, yForce_body1, xForce_body2, yForce_body2, xForce_body3, yForce_body3]; 
}
function totalForce_Selector(bodyNum, x1, y1, x2, y2, x3, y3, force12, force13, force23) { 
    let totalForces = totalForce(x1, y1, x2, y2, x3, y3, force12, force13, force23); 

    if (bodyNum == 1) { 
        return [totalForces[0], totalForces[1]]; 
    }
    else if (bodyNum == 2) { 
        return [totalForces[2], totalForces[3]]; 
    }
    else if (bodyNum == 3){ 
        return [totalForces[4], totalForces[5]]; 
    }
}

var epsilon = 0;
var totalForces = new Array(6); 
var counter = 0; 
function draw() { 
    // background(255); 
    console.log(body1.vy); 
    var force12 = force(body1.mass, body2.mass, body1.x, body1.y, body2.x, body2.y); 
    var force13 = force(body1.mass, body3.mass, body1.x, body1.y, body3.x, body3.y); 
    var force23 = force(body2.mass, body3.mass, body2.x, body2.y, body3.x, body3.y); 
    totalForces = totalForce(body1.x, body1.y, body2.x, body2.y, body3.x, body3.y, force12, force13, force23); 
    
    body1.update(totalForces[0], totalForces[1]); 
    body2.update(totalForces[2], totalForces[3]); 
    body3.update(totalForces[4], totalForces[5]);

    if (counter % 25 == 0) { 
        body1.show(); 
        body2.show();
        body3.show(); 
    }
    counter++; 
}