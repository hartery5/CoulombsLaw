let particles = [];
let testParticles = [];
let fixedCharges = [];

let maxV = 0;

let q = 1;
let k = 20;

let deltat = 5.0;
let spacing = 40;
let radius = 20;

let slider;
let checkbox;
let checkbox2;

let oldwidth;
let oldheight;

let mover = true;
let trashmode = false;

function setup() {
  textFont('Courier New')
  createCanvas(windowWidth, windowHeight);
  let density = displayDensity();
  spacing = width*height*density/25000;
  oldwidth = width;
  oldheight = height;
  
  slider = createSlider(-5, 5, 1);
  slider.position(10, 40);
  slider.style("width", "430px");
  slider.addClass("mySlider");
  
  checkbox = createCheckbox('Static', false);
  checkbox.style("width", "1200px");
  checkbox.style('color', '#ffffff');
  checkbox.style('font-family', 'monospace');
  checkbox.style("font-size", "30px");
  checkbox.position(0,50);
  
  checkbox2 = createCheckbox('Trash Mode', false);
  checkbox2.style("width", "1200px");
  checkbox2.style('color', '#ffffff');
  checkbox2.style('font-family', 'monospace');
  checkbox2.style("font-size", "30px");
  checkbox2.position(0,80);
  
  for (let i = 10; i < width; i += spacing) {
    for (let j = 10; j < width; j += spacing) {
      p = new particle(i, j, q, radius, false, true);
      append(testParticles, p);
    }
  }
  
  particles = particles.concat(fixedCharges,particles);
}

function draw() {
  background(0);
  q = int(slider.value());

  
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
    if (particles[i].flag || particles[i].q==0){
      particles.splice(i,1);
    }
  }
  
  push();
  fill('black');
  rect(0, 0, 450, 120);
  pop();
  
  push();
  fill("white");
  textAlign(CENTER, CENTER);
  textSize(30);
  textFont("monospace");
  for (let i = -5; i < 6; i++) {
    text(nfp(i, 1, 0), (i + 5) * 42 + 10, 15);
  }
  pop();
}

function mousePressed() {
  if (trashmode) {
    for (let i = 0; i < particles.length; i += 1) {
      if (
        abs(mouseX - particles[i].x) < particles[i].radius &&
        abs(mouseY - particles[i].y) < particles[i].radius
      ) {
        particles[i].flag = true;
      }
    }
  } else if (!mover) {
    let check = true;
    for (let i = 0; i < particles.length; i += 1) {
      if (
        abs(mouseX - particles[i].x) < particles[i].radius &&
        abs(mouseY - particles[i].y) < particles[i].radius
      ) {
        particles[i].q += q;

        if (particles[i].q == 0) {
          particles[i].flag = true;
        }

        check = false;
        break;
      }
    }
    if (check && !(mouseY < 140 && mouseX < 450) && abs(q) > 0) {
      let posX = round(mouseX / radius / 2) * radius * 2;
      let posY = round(mouseY / radius / 2) * radius * 2;
      p = new particle(posX, posY, q, radius, mover, false);
      append(particles, p);
    }
  } else if (!(mouseY < 140 && mouseX < 450)) {
    let posX = round(mouseX / radius / 2) * radius * 2;
    let posY = round(mouseY / radius / 2) * radius * 2;
    p = new particle(posX, posY, q, radius, mover, false);
    append(particles, p);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let density = displayDensity();
  spacing = width*height*density/25000;
  
  let nx = width/oldwidth;
  let ny = height/oldheight;
  
  let n = sqrt(nx**2 + ny**2);
  
  for (let i=0; i < testParticles.length; i+=1){
    testParticles[i].x *= nx;
    testParticles[i].y *= ny;
  }
  
  for (let i=0; i < particles.length; i+=1){
    particles[i].x *= nx;
    particles[i].y *= ny;
    particles[i].r *= nx*ny;
  }
  
  radius *= nx*ny;
 
  oldwidth = width;
  oldheight = height;
}
