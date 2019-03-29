var time_step = 0.001; 
var clock = 0; 
var FINAL_TIME = 1; 

function body(r0, theta_0, mass, initial_velocity_x, initial_velocity_y, color_num) { 
    this.x = r0*cos(theta_0)+width/2; 
    this.y = r0*sin(theta_0)+height/2;
    console.log(this.x, this.y); 
    this.mass = mass; 
    this.vx = initial_velocity_x;
    this.vy = initial_velocity_y; 
    var positions = [[]]; 

    // analytic 
    var distance_to_center = r0;
    var magnitude_v0 = pow(initial_velocity_x*initial_velocity_x + initial_velocity_y*initial_velocity_y, 0.5);
    this.l = 3*this.mass*distance_to_center*magnitude_v0; 
    var alpha = gravity_const*this.mass/pow(3, 0.5); 
    this.energy = (3/2)*this.mass*magnitude_v0*magnitude_v0 - alpha/(distance_to_center*pow(3, 0.5)); 
    this.p = this.l*this.l/(this.mass*alpha); 

    this.analytic = function(theta) { 
        var radius = this.p/1000000000; 
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
        if (positions.length > 50) { 
            for (var i = positions.length-1; i > positions.length-50; i--) { 
                strokeWeight(1); 
                ellipse(positions[i][0], positions[i][1], 1, 1); 
            }
        }
        stroke(0); 
        ellipse(this.x, this.y, 5, 5); 
    }
}

const width = 1500; 
const height = 1500; 
const gravity_const = 1; 
var speed1 = 450; 
var speed2x = 225; 
var speed2y = 390; 
var speed3x = 225; 
var speed3y = 390; 
let buffer; 
function setup() { 
    createCanvas(width, height); 
    buffer = createGraphics(width, height); 
    buffer.background(255); 
    // old masses 100000000 10000000000 100000000
    // body1 = new body(750, 600, 750000000000000000, 0, 0, 1); // BLUE
    // body2 = new body(650, 600, 1000000000000000000, 0, 0, 2); // RED
    // body3 = new body(725, 730, 1000000000000000000, 0, 3); // GREEN
    body1 = new body(100, 0, 41500000, -speed1, 0, 1); // BLUE
    body2 = new body(100, 2*Math.PI/3, 41500000, speed2x, speed2y, 2); // RED
    body3 = new body(100, 4*Math.PI/3, 41500000, speed3x, -speed3y, 3); // GREEN
}

// takes in initial forces, sets new x and y for each body
function rk4(force1_x, force1_y, force2_x, force2_y, force3_x, force3_y) { 
    /*
        * An implementation of the fourth order Runge-Kutta method for numerical integration
        * adapted for 2-dimensional orbit simulation 
        * y_n+1 = y_n + time_step / 6 * (k1 + 2k2 + 2k3 + k4)
        * k1 = f(t_n, y_n)
        * k2 = f(t_n+timestep/2, y_n+k1*timestep/2)
        * k3 = f(t_n+timestep/2, y_n+k2*timestep/2)
        * k4 = f(t_n+timestep/2, y_n+k3*timestep)
    */
    
    // BODY 1
    var xAcceleration = force1_x/body1.mass; 
    var yAcceleration = force1_y/body1.mass; 
    
    var vx_k1 = xAcceleration; 
    var vy_k1 = yAcceleration; 
    var rx_k1 = body1.vx; 
    var ry_k1 = body1.vy; 
    var temp1_x = body1.x + rx_k1*time_step/2; 
    var temp1_y = body1.y + ry_k1*time_step/2;

    // recalculate forces 
    var force12 = force(body1.mass, body2.mass, temp1_x, temp1_y, body2.x, body2.y); 
    var force13 = force(body1.mass, body3.mass, temp1_x, temp1_y, body3.x, body3.y); 
    var force23 = force(body2.mass, body3.mass, body2.x, body2.y, body3.x, body3.y); 

    var newForces = totalForce_Selector(1, temp1_x, temp1_y, body2.x, body2.y, body3.x, body3.y, force12, force13, force23); 
    var vx_k2 = newForces[0]/body1.mass; 
    var vy_k2 = newForces[1]/body1.mass; 
    var rx_k2 = body1.vx*abs(vx_k1)*time_step/2; 
    var ry_k2 = body1.vy*abs(vy_k1)*time_step/2; 
    temp1_x = body1.x + rx_k2*time_step/2; 
    temp1_y = body1.y + ry_k2*time_step/2; 
    
    // recalculate forces 
    var force12 = force(body1.mass, body2.mass, temp1_x, temp1_y, body2.x, body2.y); 
    var force13 = force(body1.mass, body3.mass, temp1_x, temp1_y, body3.x, body3.y); 
    var force23 = force(body2.mass, body3.mass, body2.x, body2.y, body3.x, body3.y); 

    var newForces = totalForce_Selector(1, temp1_x, temp1_y, body2.x, body2.y, body3.x, body3.y, force12, force13, force23); 
    var vx_k3 = newForces[0]/body1.mass; 
    var vy_k3 = newForces[1]/body1.mass; 
    var rx_k3 = body1.vx*abs(vx_k2)*time_step/2; 
    var ry_k3 = body1.vy*abs(vy_k2)*time_step/2; 
    temp1_x = body1.x + rx_k3*time_step; 
    temp1_y = body1.y + ry_k3*time_step; 

    // recalculate forces
    force12 = force(body1.mass, body2.mass, temp1_x, temp1_y, body2.x, body2.y); 
    force13 = force(body1.mass, body3.mass, temp1_x, temp1_y, body3.x, body3.y); 
    force23 = force(body2.mass, body3.mass, body2.x, body2.y, body3.x, body3.y); 
    var newForces = totalForce_Selector(1, temp1_x, temp1_y, body2.x, body2.y, body3.x, body3.y, force12, force13, force23); 
    var vx_k4 = newForces[0]/body1.mass;
    var vy_k4 = newForces[1]/body1.mass; 
    var rx_k4 = body1.vx*abs(vx_k3)*time_step; 
    var ry_k4 = body1.vx*abs(vy_k3)*time_step; 

    body1.vx = body1.vx + time_step/6 * (vx_k1+2*vx_k2+2*vx_k3+vx_k4); 
    body1.vy = body1.vy + time_step/6 * (vy_k1+2*vy_k2+2*vy_k3+vy_k4); 
    body1.x = body1.x + time_step/6 * (rx_k1+2*rx_k2+2*rx_k3+rx_k4); 
    body1.y = body1.y + time_step/6 * (ry_k1+2*ry_k2+2*ry_k3+ry_k4);  

    // BODY 2
    xAcceleration = force2_x/body2.mass; 
    yAcceleration = force2_y/body2.mass; 
    
    vx_k1 = xAcceleration; 
    vy_k1 = yAcceleration; 
    rx_k1 = body2.vx; 
    ry_k1 = body2.vy; 
    temp1_x = body2.x + rx_k1*time_step/2; 
    temp1_y = body2.y + ry_k1*time_step/2;

    // recalculate forces 
    force12 = force(body1.mass, body2.mass, body1.x, body1.y, temp1_x, temp1_y); 
    force13 = force(body1.mass, body3.mass, body1.x, body1.y, body3.x, body3.y); 
    force23 = force(body2.mass, body3.mass, temp1_x, temp1_y, body3.x, body3.y); 

    newForces = totalForce_Selector(2, body1.x, body1.y, temp1_x, temp1_y, body3.x, body3.y, force12, force13, force23); 
    vx_k2 = newForces[0]/body2.mass; 
    vy_k2 = newForces[1]/body2.mass; 
    rx_k2 = body2.vx*abs(vx_k1)*time_step/2; 
    ry_k2 = body2.vy*abs(vy_k1)*time_step/2; 
    temp1_x = body2.x + rx_k2*time_step/2; 
    temp1_y = body2.y + ry_k2*time_step/2; 
    
    // recalculate forces 
    force12 = force(body1.mass, body2.mass, body1.x, body1.y, temp1_x, temp1_y); 
    force13 = force(body1.mass, body3.mass, body1.x, body1.y, body3.x, body3.y); 
    force23 = force(body2.mass, body3.mass, temp1_x, temp1_y, body3.x, body3.y); 

    newForces = totalForce_Selector(2, body1.x, body1.y, temp1_x, temp1_y, body3.x, body3.y, force12, force13, force23); 
    vx_k3 = newForces[0]/body2.mass; 
    vy_k3 = newForces[1]/body2.mass; 
    rx_k3 = body2.vx*abs(vx_k2)*time_step/2; 
    ry_k3 = body2.vy*abs(vy_k2)*time_step/2; 
    temp1_x = body2.x+rx_k3*time_step; 
    temp1_y = body2.y + ry_k3*time_step; 

    // recalculate forces 
    force12 = force(body1.mass, body2.mass, body1.x, body1.y, temp1_x, temp1_y); 
    force13 = force(body1.mass, body3.mass, body1.x, body1.y, body3.x, body3.y); 
    force23 = force(body2.mass, body3.mass, temp1_x, temp1_y, body3.x, body3.y); 
    
    newForces = totalForce_Selector(2, body1.x, body1.y, temp1_x, temp1_y, body3.x, body3.y, force12, force13, force23); 
    vx_k4 = newForces[0]/body2.mass;
    vy_k4 = newForces[1]/body2.mass; 
    rx_k4 = body2.vx*abs(vx_k3)*time_step; 
    ry_k4 = body2.vx*abs(vy_k3)*time_step; 

    body2.vx = body2.vx + time_step/6 * (vx_k1+2*vx_k2+2*vx_k3+vx_k4); 
    body2.vy = body2.vy + time_step/6 * (vy_k1+2*vy_k2+2*vy_k3+vy_k4); 
    body2.x = body2.x + time_step/6 * (rx_k1+2*rx_k2+2*rx_k3+rx_k4); 
    body2.y = body2.y + time_step/6 * (ry_k1+2*ry_k2+2*ry_k3+ry_k4);  

    // BODY 3
    xAcceleration = force3_x/body3.mass; 
    yAcceleration = force3_y/body3.mass; 
    
    vx_k1 = xAcceleration; 
    vy_k1 = yAcceleration; 
    rx_k1 = body3.vx; 
    ry_k1 = body3.vy; 
    temp1_x = body3.x + rx_k1*time_step/2; 
    temp1_y = body3.y + ry_k1*time_step/2;

    // recalculate forces 
    force12 = force(body1.mass, body2.mass, body1.x, body1.y, body2.x, body2.y); 
    force13 = force(body1.mass, body3.mass, body1.x, body1.y, temp1_x, temp1_y); 
    force23 = force(body2.mass, body3.mass, body2.x, body2.y, temp1_x, temp1_y); 
    
    newForces = totalForce_Selector(3, body1.x, body1.y, body2.x, body2.y, temp1_x, temp1_y, force12, force13, force23); 
    vx_k2 = newForces[0]/body3.mass; 
    vy_k2 = newForces[1]/body3.mass; 
    // if (body2.vx > 0 && vx_k1 < 0 || body2.vx < 0 && vx_1 > 0) { 

    // }
    rx_k2 = body2.vx*abs(vx_k1)*time_step/2; 
    ry_k2 = body2.vy*abs(vy_k1)*time_step/2; 
    temp1_x = body3.x + rx_k2*time_step/2; 
    temp1_y = body3.y + ry_k2*time_step/2; 
    
    // recalculate forces 
    force12 = force(body1.mass, body2.mass, body1.x, body1.y, body2.x, body2.y); 
    force13 = force(body1.mass, body3.mass, body1.x, body1.y, temp1_x, temp1_y); 
    force23 = force(body2.mass, body3.mass, body2.x, body2.y, temp1_x, temp1_y); 
    
    newForces = totalForce_Selector(3, body1.x, body1.y, body2.x, body2.y, temp1_x, temp1_y, force12, force13, force23); 
    vx_k3 = newForces[0]/body3.mass; 
    vy_k3 = newForces[1]/body3.mass; 
    rx_k3 = body3.vx*abs(vx_k2)*time_step/2; 
    ry_k3 = body3.vy*abs(vy_k2)*time_step/2; 
    temp1_x = body3.x + rx_k3*time_step; 
    temp1_y = body3.y + ry_k3*time_step; 

    // recalculate forces 
    force12 = force(body1.mass, body2.mass, body1.x, body1.y, body2.x, body2.y); 
    force13 = force(body1.mass, body3.mass, body1.x, body1.y, temp1_x, temp1_y); 
    force23 = force(body2.mass, body3.mass, body2.x, body2.y, temp1_x, temp1_y); 
    
    newForces = totalForce_Selector(3, body1.x, body1.y, body2.x, body2.y, temp1_x, temp1_y, force12, force13, force23); 
    vx_k4 = newForces[0]/body3.mass;
    vy_k4 = newForces[1]/body3.mass; 
    rx_k4 = body3.vx*abs(vx_k3)*time_step; 
    ry_k4 = body3.vx*abs(vy_k3)*time_step; 

    body3.vx = body3.vx + time_step/6 * (vx_k1+2*vx_k2+2*vx_k3+vx_k4); 
    body3.vy = body3.vy + time_step/6 * (vy_k1+2*vy_k2+2*vy_k3+vy_k4); 
    body3.x = body3.x + time_step/6 * (rx_k1+2*rx_k2+2*rx_k3+rx_k4); 
    body3.y = body3.y + time_step/6 * (ry_k1+2*ry_k2+2*ry_k3+ry_k4);
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
function time_step_adjustor(x1, y1, x2, y2, x3, y3) { 
    console.log(x1, x2, x3); 
    if ((abs(x1-x2) < 5 && abs(y1-y2) < 5) || (abs(x1-x3) < 5 && abs(y1-y3) < 5) || (abs(x2-x3) < 5 && abs(y2-y3) < 5)) { 
        time_step = 0.0001; 
    } 
    else { 
        time_step = 0.001; 
    }
}
var epsilon = 1000;
var totalForces = new Array(6); 
var theta = 0; 
var counter = 0; 
function draw() { 
    // background(255); 
    // time_step_adjustor(body1.x, body1.y, body2.x, body2.y, body3.x, body3.y); 

    // var force12 = force(body1.mass, body2.mass, body1.x, body1.y, body2.x, body2.y); 
    // var force13 = force(body1.mass, body3.mass, body1.x, body1.y, body3.x, body3.y); 
    // var force23 = force(body2.mass, body3.mass, body2.x, body2.y, body3.x, body3.y); 
    // totalForces = totalForce(body1.x, body1.y, body2.x, body2.y, body3.x, body3.y, force12, force13, force23); 
    
    // // rk4(totalForces[0], totalForces[1], totalForces[2], totalForces[3], totalForces[4], totalForces[5]); 
    // body1.update(totalForces[0], totalForces[1]); 
    // body2.update(totalForces[2], totalForces[3]); 
    // body3.update(totalForces[4], totalForces[5]);
    body1.analytic(theta); 
    body2.analytic(theta); 
    body3.analytic(theta); 
    counter++; 

    if (counter % 1 == 0){ 
        theta += 0.01; 
    }

    body1.show(); 
    body2.show();
    body3.show(); 
}