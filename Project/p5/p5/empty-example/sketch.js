const width = 700; 
const height = 700; 

let buffer; 
let cx, cy; 
let trace = false; // toggle trails 

function setup() {
  // put setup code here
  createCanvas(width, height); 
  buffer = createGraphics(width, height); 
  buffer.background(255); 
  buffer.translate(cx, cy); 

  m1Slider = createSlider(0, 255, 10);
  m1Slider.position(20, 20);
  m2Slider = createSlider(0, 255, 10);
  m2Slider.position(20, 50);
  v1Slider = createSlider(0, 255, 10);
  v1Slider.position(20, 80);
  v2Slider = createSlider(0, 255, 10);
  v2Slider.position(20, 110);

}

var x = 40; 
var y = 40; 

let turnAround = false; 

function draw() {
  background(255);
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);
  
  /******* Sliders and setting parameters *********/
  const m1 = m1Slider.value(); 
  const m2 = m2Slider.value(); 
  const v1 = v1Slider.value(); 
  const v2 = v2Slider.value(); 

  text('Mass 1\t' + m1, m1Slider.x * 2 + m1Slider.width, 35);
  text('Mass 2\t' + m2, m2Slider.x * 2 + m2Slider.width, 65);
  text('Velocity 1\t' + v1, v1Slider.x * 2 + v1Slider.width, 95);
  text('Velocity 2\t' + v2, v2Slider.x * 2 + v2Slider.width, 125);
  
  /******** */
  if (!trace) { 
    background(204); 
    stroke(0, 255); 
    noFill(); 
  }
  function keyReleased() { 
    if (key == ' ') { 
      trace = !trace; 
      background(255); 
    }
  }
  // if (x % 1 == 0) { 
  //   // clear(); 
    
  //   fill(0); 
  //   ellipse(x, 480/2+40*sin(x/v1), m1, m1); 
  //   // ellipse(320+40*sin(y/v1), x, m2, m2); 
  //   fill(100); 
  //   ellipse(width/2, height/2, m2, m2); 
  // }

  var dt = 0.001; 
  var x1 = 10; 
  var y1 = 10; 
  var x2 = width/2; 
  var y2 = height/2; 
  const gravity_const = 6.674*Math.pow(10, -11); 
  var force = -1*gravity_const*m1*m2 / (Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2)); 
  var xVelocity = xVelocity + force*dt;
  var yVelocity = yVelocity + force*dt; 

  x1 = x1 + xVelocity*dt; 
  y1 = y1 + yVelocity*dt;
  console.log(force); 
  fill(0); 
  ellipse(x1, y1, m1, m1); 
  ellipse(width/2, height/2, m2, m2); 
}

function one_body_attractor(m1, m2, v1, v2) { 
  var dt = 0.001; 
  var x1 = 0; 
  var y1 = 0; 
  var x2 = width/2; 
  var y2 = height/2; 
  const gravity_const = 6.674*Math.pow(10, -11); 
  var force = -1*gravity_const*m1*m2 / (x1*x1+y1*y1); 
  var xVelocity = xVelocity + force*dt;

  x1 = x + xVelocity*dt; 
  y1 = y + yVelocity*dt;

  ellipse(x, y, m1, m1); 
}

function pythagoreanConfiguration() { 

}