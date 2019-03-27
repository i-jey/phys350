const width = 1500; 
const height = 1500; 

let buffer; 
let cx, cy; 
let trace = true; // toggle trails 

function setup() {
  // put setup code here
  createCanvas(width, height); 
  buffer = createGraphics(width, height); 
  buffer.background(255); 

  m1Slider = createSlider(0, 255, 10);
  m1Slider.position(20, 20);
  m2Slider = createSlider(0, 255, 10);
  m2Slider.position(20, 50);
  v1Slider = createSlider(0, 255, 10);
  v1Slider.position(20, 80);
  v2Slider = createSlider(0, 255, 10);
  v2Slider.position(20, 110);

}

var xVelocity = 30500; 
var yVelocity = -4550;
let turnAround = false; 
var x1 = 350; 
var y1 = 350; 
var x2 = 750; 
var y2 = 750; 

function draw() {
  var scale1 = 100000000000; 
  var scale2 = 1000000000; 
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);
  
  /******* Sliders and setting parameters *********/
  const m1 = m1Slider.value()*scale1; 
  const m2 = m2Slider.value()*scale2; 
  const v1 = v1Slider.value(); 
  const v2 = v2Slider.value(); 

  text('Mass 1\t' + m1, m1Slider.x * 2 + m1Slider.width, 35);
  text('Mass 2\t' + m2, m2Slider.x * 2 + m2Slider.width, 65);
  text('Velocity 1\t' + v1, v1Slider.x * 2 + v1Slider.width, 95);
  text('Velocity 2\t' + v2, v2Slider.x * 2 + v2Slider.width, 125);

  var dt = 0.0001; 
  const gravity_const = 6.674*Math.pow(10, -11); 
  var force = 1*gravity_const*m1*m2 / (Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2)); 

  if(x1 > x2) { 
    xVelocity = xVelocity - force*dt;
  }
  else { 
    xVelocity = xVelocity + force*dt;
  }
  if (y1 > y2) {  
    yVelocity = yVelocity - force*dt; 
  }
  else { 
    yVelocity = yVelocity + force*dt; 
  }
  
  x1 = x1 + xVelocity*dt; 
  y1 = y1 + yVelocity*dt;
  console.log("pos: ", x1, y1);
  console.log("force: ", force);
  fill(0); 
  if (trace) { 
    stroke(0, 0, 255); 
    fill(0, 0, 255); 
    erad = 1; 
  }
  ellipse(x1, y1, m1/scale1, m1/scale1); 
  ellipse(x2, y2, m2/scale2, m2/scale2); 
  buffer.strokeWeight(4); 
  buffer.stroke('rgba(100, 100, 100, 0.5)'); 
  buffer.point(x1, y1); 
}

function pythagoreanConfiguration() { 

}