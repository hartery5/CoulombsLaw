let particles = [];
let testParticles = [];
let fixedCharges = [];
let boundaries = [];

let maxV = 0;

let q = 1;
let k = 40;

let deltat = 5.0;
let spacing = 40;
let radius;

let slider;
let checkbox;
let checkbox2;

let oldwidth;
let oldheight;
let oldradius;
let fs;

let mover = true;
let trashmode = false;

function setup() {
  angleMode(RADIANS);
  textFont('Courier New')
  createCanvas(windowWidth, windowHeight);
  let density = displayDensity();
  spacing = sqrt(width*height/500);
  radius = spacing/2;
  oldwidth = width;
  oldheight = height;
  oldradius = radius;
  fs = 2*radius;
  
  slider = createSlider(-5, 5, 1);
  slider.position(10, 0.75*fs);
  let sw = nf(11*fs*1.3/2,1,0) + 'px';
  slider.style("width", sw);
  
  checkbox = createCheckbox('', false);
  checkbox.style("width", "1200px");
  checkbox.style('color', '#ffffff');
  checkbox.style('font-family', 'monospace');
  checkbox.style("font-size", fs);
  checkbox.position(0,1.5*fs);
  
  checkbox2 = createCheckbox('', false);
  checkbox2.style("width", "1200px");
  checkbox2.style('color', '#ffffff');
  checkbox2.style('font-family', 'monospace');
  checkbox2.style("font-size", fs);
  checkbox2.position(0,2.5*fs);
  
  for (let i = 10; i < width; i += spacing) {
    for (let j = 10; j < height; j += spacing) {
      p = new particle(i, j, q, spacing/2, false, true);
      append(testParticles, p);
    }
  }
  
  b = new boundaryLine(100.0,500.0,500.0,500.0);
  topl = new boundaryLine(width, 0.0, 0.0, 0.0);
  bottom = new boundaryLine(0.0, height, width, height);
  left = new boundaryLine(0.0, height, 0.0, 0.0);
  right = new boundaryLine(width, 0.0, width, height);
  boxb = new boundaryLine(0.0, 3*fs, 11*fs*1.42/2, 3*fs);
  boxr = new boundaryLine(11*fs*1.42/2, 0.0, 11*fs*1.42/2, 3*fs);
  append(boundaries, topl);
  append(boundaries, bottom);
  append(boundaries, left);
  append(boundaries, right);
  append(boundaries, boxb);
  append(boundaries, boxr);
  
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
    particles[i].update(particles, boundaries, deltat);
    
    if (particles[i].flag || particles[i].q==0){
      particles.splice(i,1);
    }
  }
  
  push();
  fill('black');
  rect(0, 0, 11*fs*1.42/2, 3*fs);
  pop();
  
  push();
  fill("white");
  textAlign(CENTER, CENTER);
  textSize(fs/2);
  textFont("monospace");
  for (let i = -5; i < 6; i++) {
    text(nfp(i, 1, 0), (i + 5) * fs*1.42 / 2 + 10, 15);
  }
  textAlign(LEFT, TOP);
  text("Static", 20, 1.5*fs);
  text("Trash Mode", 20, 2.5*fs);
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
    if (check && !(mouseY < 3*fs && mouseX < 11*fs*1.42/2) && abs(q) > 0) {
      let posX = round(mouseX / radius / 2) * radius * 2;
      let posY = round(mouseY / radius / 2) * radius * 2;
      p = new particle(posX, posY, q, radius, mover, false);
      append(particles, p);
    }
  } else if (!(mouseY < 3*fs && mouseX < 11*fs*1.42/2)) {
    let posX = round(mouseX / radius / 2) * radius * 2;
    let posY = round(mouseY / radius / 2) * radius * 2;
    p = new particle(posX, posY, q, radius, mover, false);
    append(particles, p);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let density = displayDensity();
  spacing = sqrt(width*height/500);
  radius = spacing/2;
  fs = 2*radius;
  
  slider.position(10, 0.75*fs);
  let sw = nf(11*fs*1.3/2,1,0) + 'px';
  slider.style("width", sw);
  checkbox.position(0,1.5*fs);
  checkbox2.position(0,2.5*fs);
  
  let nx = width/oldwidth;
  let ny = height/oldheight;
  let nr = radius/oldradius;
  
  boundaries = [];
  topl = new boundaryLine(width, 0.0, 0.0, 0.0);
  bottom = new boundaryLine(0.0, height, width, height);
  left = new boundaryLine(0.0, height, 0.0, 0.0);
  right = new boundaryLine(width, 0.0, width, height);
  boxb = new boundaryLine(0.0, 3*fs, 11*fs*1.42/2, 3*fs);
  boxr = new boundaryLine(11*fs*1.42/2, 0.0, 11*fs*1.42/2, 3*fs);
  append(boundaries, topl);
  append(boundaries, bottom);
  append(boundaries, left);
  append(boundaries, right);
  append(boundaries, boxb);
  append(boundaries, boxr);
  
  k *= nr*nr;
  
  for (let i=0; i < testParticles.length; i+=1){
    testParticles[i].x *= nx;
    testParticles[i].y *= ny;
    testParticles[i].radius *= nr;
  }
  
  for (let i=0; i < particles.length; i+=1){
    particles[i].x *= nx;
    particles[i].y *= ny;
    particles[i].vx *= nx;
    particles[i].vy *= ny;
    particles[i].radius *= nr;
  }
 
  oldwidth = width;
  oldheight = height;
  oldradius = radius;
}
