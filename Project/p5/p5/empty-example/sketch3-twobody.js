function body(r0, theta_0, vtheta_0, velocity_0, mass1, mass2, color_num) { 
    const gravity_const = 6.674*Math.pow(10, -11); 
    this.r0 = r0; 
    this.v0 = velocity_0; 
    this.theta_0 = theta_0; 
    this.a = vtheta_0;  
    this.mass1 = mass1;
    this.mass2 = mass2;  
    this.k = this.mass1*this.mass1*this.mass2 / pow(mass1+mass2, 2); 
    this.r = 0; 
    this.e = 0; 
    // initial position
    // this.x = this.r0*cos(this.theta_0)+1000; 
    // this.y = this.r0*sin(this.theta_0)+1000; 
    
    // integration constants 
    this.l = this.r0*this.v0*sin(this.a);
    this.e = pow(pow(((this.l*this.l) / (this.k*this.r0) - 1), 2) + this.l*this.l*this.v0*this.v0*cos(this.a)*cos(this.a)/(this.k*this.k), 0.5); 
    
    this.set = function(theta) { 
        this.r = pow(this.l, 2) / (this.k*(1+this.e*cos(this.theta_0+theta)));
        this.x = abs(this.r)*Math.cos(this.theta_0+theta)+1000;
        this.y = abs(this.r)*Math.sin(this.theta_0+theta)+1000; 
    }
    this.show = function() { 
        if (color_num == 1) { 
            fill(100, 200, 255); 
        }
        else if (color_num == 2) { 
            fill(240, 128, 128); 
        }
        else { 
            fill(0, 250, 154);
        }
        ellipse(this.x, this.y, 50, 50); 
    }
}

const width = 2000; 
const height = 2000; 

let buffer; 

function setup() { 
    createCanvas(width, height); 
    buffer = createGraphics(width, height); 
    buffer.background(255); 
    body1 = new body(300, 0, Math.PI/2, 10, 1000000, 10000000, 0); 
    body2 = new body(300, 0, -1*Math.PI/2, 10, 10000000, 500000, 1); 
}

var theta_step = 0.01; 
var theta = 0; 
function draw() { 
    // background(255);
    theta = theta + theta_step;   
    theta %= 2*Math.PI; 
    body1.set(theta); 
    body2.set(theta);
    body1.show(); 
    body2.show();
}