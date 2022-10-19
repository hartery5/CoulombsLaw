let particles = [];
let testParticles = [];
let fixedCharges = [];

let maxV = 0;

let q = 1;
let k = 5;

let deltat = 5.0;
let spacing = 75;

let radio1;
let checkbox;
let checkbox2;

let mover = true;
let trashmode = false;

function setup() {
  textFont('Courier New')
  createCanvas(windowWidth, windowHeight);
  
  radio1 = createRadio();
  radio1.option(1, "q = +1");
  radio1.option(-1.0, "q = -1");
  radio1.selected("1");
  radio1.style("width", "400px");
  radio1.style('color', '#ffffff');
  radio1.style('font-family', 'monospace');
  radio1.style("font-size", "75px");
  radio1.position(0,height-38);
  
  checkbox = createCheckbox('Static', false);
  checkbox.style("width", "400px");
  checkbox.style('color', '#ffffff');
  checkbox.style('font-family', 'monospace');
  checkbox.style("font-size", "75px");
  checkbox.position(0,height-93);
  
  checkbox2 = createCheckbox('Trash Mode', false);
  checkbox2.style("width", "400px");
  checkbox2.style('color', '#ffffff');
  checkbox2.style('font-family', 'monospace');
  checkbox2.style("font-size", "75px");
  checkbox2.position(0,height-168);
  


  for (let i = 10; i < width; i += spacing) {
    for (let j = 10; j < width; j += spacing) {
      p = new particle(i, j, q, false, true);
      append(testParticles, p);
    }
  }
  
  particles = particles.concat(fixedCharges,particles);
}

function draw() {
  background(0);
  q = radio1.value();
  if (checkbox.checked()){
    mover = false;
  }
  else{
    mover = true;
  }
  
  if (checkbox2.checked()){
    trashmode = true;
    for (let i = 0; i < particles.length; i += 1) {
      particles[i].move = false;
    }
  }
  else{
    trashmode = false;
    for (let i = 0; i < particles.length; i += 1) {
      if (particles[i].type){
        particles[i].move = true;
      }
    }
  }
  
  for (let i=0; i < testParticles.length; i+=1){
    testParticles[i].update(particles, deltat);
  }

  for (let i = 0; i < particles.length; i += 1) {
    particles[i].update(particles, deltat);
    if (particles[i].flag){
      particles.splice(i,1);
    }
  }
}

function mouseClicked() {
  if (trashmode){
    for (let i = 0; i < particles.length; i += 1) {
      if ((abs(mouseX-particles[i].x)<particles[i].radius) && (abs(mouseY-particles[i].y)<particles[i].radius)){
        particles[i].flag = true;
      }
    }
  }
  else if (mouseY<(height-225)){
    let posX = round(mouseX/25)*25;
    let posY = round(mouseY/25)*25;
    p = new particle(posX,posY, q, mover, false);
    append(particles, p);
  }
}
