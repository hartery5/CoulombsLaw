// Object Arrays
let particles = [];
let testParticles = [];
let maxI, maxJ;
let boundaries = [];
let testCharge;

// Image Objects
var mySVG;

// Physics
let q = 1;
let k = 40;
let deltat = 5.0;
let Bz;
let theta_i = 0.0;
let v0;
let mass;

// DOM Elements
let slider;
let slider2;
let slider3;
let slider4;
let slider5;
let checkbox;
let checkbox2;
let checkbox3;
let checkbox4;
let checkbox5;
let checkbox6;

// Various display dimensions
let oldwidth;
let oldheight;
let oldradius;
let fs;
let lowerbound;
let rightbound;
let _spacing;
let _aspect;
let spacing;
let radius;
let fac = 1;
let _nx = 1;
let _ny = 1;
let ospacing;
let fwidth;
let fheight;

// Flags
let mover = true;
let trashmode = false;
let showE = false;
let showV = false;
let showF = false;
let showTest = false;
let menuOpen = false;

function setup() {
  mySvg = loadImage("wastebasket.svg");
  createCanvas(windowWidth, windowHeight);
  
  // Set dimensions
  setDimensions();
  
  slider = createSlider(-5, 5, 1, 1);
  slider2 = createSlider(0, 5, 1, 1);
  slider3 = createSlider(-5, 5, 0, 0.5);
  slider4 = createSlider(1, 5, 1, 0.5);
  slider5 = createSlider(0.2, 2, 1, 0.2);
  
  checkbox = createCheckbox('', true);
  checkbox2 = createCheckbox('', false);
  checkbox3 = createCheckbox('', false);
  checkbox4 = createCheckbox('', false);
  checkbox5 = createCheckbox('', false);
  checkbox6 = createCheckbox('', false);
  
  // Place UI elements
  placeDOM();
  
  // Adjust Menu
  checkMenu();
  
  // Create Field Arrows
  let I = 0;
  let J = 0;
  for (let i = spacing/2; i < width+spacing/2; i += spacing) {
    testParticles[I] = [];
    J = 0;
    for (let j = spacing/2; j < height+spacing/2; j += spacing) {
      p = new particle(i, j, 0.0, 0.0, 1.0, q, spacing/2, false, true);
      testParticles[I][J] = p;
      J += 1;
    }
    I += 1;
  }
  maxI = I;
  maxJ = J;
  
  // Boundaries
  setBoundaries();
  
  // Test Charge
  testCharge = new particle(0, 0, 0.0, 0.0, 1.0, q, spacing/2, false, false);
  
  oldwidth = width;
  oldheight = height;
  oldradius = radius; 
  ospacing = spacing;
  fwidth = width;
  fheight = height;
}

function draw() {
  background(0);
  
  // Read Sliders
  q = int(slider.value());
  v0 = float(slider2.value())/2.0;
  Bz = slider3.value()/1000.0;
  mass = slider4.value();
  fac = slider5.value();
  
  setDimensions();
  
  // Update Checkboxes
  updateCheckboxes();
  
  // Show E field
  if (showE){
    for (let i=0; i < maxI; i+=1){
      for (let j=0; j < maxJ; j+=1){
        testParticles[i][j].physics(particles, boundaries, deltat);
        testParticles[i][j].draw();
      }
    }
  }
  
  // Show B-Field
  if (abs(Bz)>0){
    showBField();
  }

  // Apply physics & show particles
  let newParticles = [];
  for (let i = 0; i < particles.length; i += 1) {
    if (!trashmode){
      particles[i].physics(particles, boundaries, deltat);
    }
    particles[i].draw();
     
    // Only append particle if it hasn't been queued for deletion and |q|>0
    if (!particles[i].flag && abs(particles[i].q)>0){
      append(newParticles,particles[i]);
    }
  }
  // Update particle array
  particles = newParticles;
  
  // Show test charge
  if (showTest){
     testCharge.x = mouseX;
     testCharge.y = mouseY;
     testCharge.physics(particles, boundaries, deltat);
     testCharge.draw();
  }
  
  // Show trashbin
  if (trashmode){
    push();
    imageMode(CENTER);
    image(mySvg, mouseX, mouseY);
    pop();
  }
  
  
  push();
  imageMode(CENTER);
  image(mySvg, width-40, height-40);
  pop();
  

  // Text
  updateMenu();
}

function mousePressed() {
  if (abs(mouseX - (rightbound-0.5*fs))<0.5*fs && abs(mouseY - 0.5*fs)<0.5*fs){
    menuOpen = !menuOpen;
    checkMenu();
  }
  if (abs(mouseX - (width-20))<40 && abs(mouseY - (height-20))<40){
    particles = [];
  }
  else if (trashmode) {
    // Schedule particle for deletion if clicked.
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
    if (check && !(mouseY < lowerbound && mouseX < rightbound) && abs(q) > 0) {
      let posX = round(mouseX / radius / 2) * radius * 2;
      let posY = round(mouseY / radius / 2) * radius * 2;
      p = new particle(posX, posY, 0.0, 0.0, mass, q, radius, mover, false);
      append(particles, p);
    }
  } else if (!(mouseY < lowerbound && mouseX < rightbound)) {
    let posX = round(mouseX / radius / 2) * radius * 2;
    let posY = round(mouseY / radius / 2) * radius * 2;
    p = new particle(posX, posY, v0*cos(theta_i), v0*sin(theta_i), mass, q, radius, mover, false);
    append(particles, p);
  }
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setDimensions();
  
  placeDOM();
  
  let nx = width/oldwidth;
  let ny = height/oldheight;
  _nx = width/fwidth;
  _ny = height/fheight;
  let nr = radius/oldradius;
  
  boundaries = [];
  setBoundaries();
  
  k *= nx*ny;
  
  for (let i=0; i < maxI; i+=1){
    for (let j=0; j < maxJ; j+=1){
      testParticles[i][j].x *= nx;
      testParticles[i][j].y *= ny;
      testParticles[i][j].radius *= nr;
    }
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

function updateMenu(){
  // Create Menu
  push();
  fill(25,25,25);
  rect(0, 0, rightbound, lowerbound);
  pop();
  
  push();
  stroke(0,0,0);
  strokeWeight(2);
  fill(64,64,64);
  rect(rightbound-0.75*fs, 0.2*fs, 0.5*fs, 0.5*fs, 0.1*fs);
  strokeWeight(0);
  fill(0,0,0);
  rect(rightbound-0.65*fs, 0.425*fs, 0.3*fs, 0.05*fs);
  if (!menuOpen){
    rect(rightbound-0.525*fs, 0.3*fs, 0.05*fs, 0.3*fs);
  }
  pop();
  
  push();
  fill("white");
  textAlign(CENTER, CENTER);
  textSize(fs/2);
  textFont("monospace");
  for (let i = -5; i < 6; i++) {
    text(nfp(i, 1, 0), (i + 5) * fs*1.32 / 2 + 0.5*fs, 1.5*fs);
  }
  textAlign(LEFT, TOP);
  text("Electric Charge, q:", 20, 0.15*fs);
  if (menuOpen){
    // Show dial
    updateDial();
    text("θi = " + nfp(round(-1.0*(theta_i*180/PI) % 360),1,0) + "°",10,3.5*fs);
    text("vi = " + nfp(v0,1,1),100+fs,3.5*fs);
    text("Static", 20, 4.5*fs);
    text("Trash Mode", 20, 5.5*fs);
    text("Show E", 20, 6.5*fs);
    if (showE){
      text("Show V", 5*fs*1.3/2+20, 6.5*fs);
    }
    text("Show F", 20, 7.5*fs);
    if (showF){
      text("Test Charge", 5*fs*1.3/2+20, 7.5*fs);
    }
    text("Magnetic Field, B:",20, 8.5*fs);
    text("Mass, m:",20, 9.5*fs);
    text("Radius, r:",20, 10.5*fs);
  }
  pop();
}

function updateDial(){
  let yc = 2.5*fs; 
  let rc = fs/2;
  let xc = 20+rc;
  
  if (mover && abs(mouseX-xc)<rc && (abs(mouseY-yc)<rc)){
    theta_i = round(atan2(mouseY-yc,mouseX-xc)*180.0/PI/15)*15*PI/180;  
  }

  push();
  fill(0);
  stroke(255);
  strokeWeight(0.05*rc);
  translate(xc,yc);
  setLineDash([10, 10]);
  circle(0,0,2.5*rc);
  setLineDash([10, 0]);
  strokeWeight(0.15*rc);
  fill(255);
  rotate(theta_i);
  line(0, 0, rc, 0);
  triangle(rc, 0.1*rc, rc+0.1*rc, 0, rc, -0.1*rc);
  pop(); 
}

function updateCheckboxes(){
  if (checkbox.checked()){
    mover = false;
  } else{
    mover = true;
  }
  if (checkbox2.checked()){
    trashmode = true;
  } else{
    trashmode = false;
  }
  if (checkbox3.checked()){
    showE = true;  
  } else {
    showE = false;
  }
  if (checkbox4.checked()){
    showF = true;  
  } else {
    showF = false;
  }
  if (showF && menuOpen){
     checkbox5.show(); 
     if (checkbox5.checked()){
       showTest = true;
     } else {
       showTest = false; 
     }
  } else {
     checkbox5.hide(); 
  } 
  if (showE && menuOpen){
     checkbox6.show(); 
     if (checkbox6.checked()){
       showV = true;
     } else {
       showV = false; 
     }
  } else {
     checkbox6.hide(); 
  } 
}

function placeDOM(){
  slider.position(10, 0.75*fs);
  let sw = nf(11*fs*1.3/2,1,0) + 'px';
  slider.style("width", sw);
  slider2.position(90+spacing, 3*fs);
  let sw2 = nf(spacing*3,1,0) + 'px';
  slider2.style('width', sw2);
  slider3.position(10, 9*fs);
  let sw3 = nf(11*fs*1.3/2,1,0) + 'px';
  slider3.style("width", sw3);
  slider4.position(10, 10*fs);
  let sw4 = nf(11*fs*1.3/2,1,0) + 'px';
  slider4.style("width", sw3);
  slider5.position(10, 11*fs);
  let sw5 = nf(11*fs*1.3/2,1,0) + 'px';
  slider5.style("width", sw3);
  
  checkbox.style("width", "1200px");
  checkbox.style('color', '#ffffff');
  checkbox.position(0,4.5*fs);
  checkbox2.style("width", "1200px");
  checkbox2.style('color', '#ffffff');
  checkbox2.position(0,5.5*fs);
  checkbox3.style("width", "1200px");
  checkbox3.style('color', '#ffffff');
  checkbox3.position(0,6.5*fs);
  checkbox4.style("width", "1200px");
  checkbox4.style('color', '#ffffff');
  checkbox4.position(0,7.5*fs);
  checkbox5.style("width", "1200px");
  checkbox5.style('color', '#ffffff');
  checkbox5.position(5*fs*1.3/2,7.5*fs);
  checkbox5.hide(); 
  checkbox6.style("width", "1200px");
  checkbox6.style('color', '#ffffff');
  checkbox6.position(5*fs*1.3/2,6.5*fs);
  checkbox6.hide(); 
}

function setBoundaries(){
  topl = new boundaryLine(width, 0.0, 0.0, 0.0);
  bottom = new boundaryLine(0.0, height, width, height);
  left = new boundaryLine(0.0, height, 0.0, 0.0);
  right = new boundaryLine(width, 0.0, width, height);
  boxb = new boundaryLine(0.0, lowerbound, rightbound, lowerbound);
  boxr = new boundaryLine(rightbound, 0.0, rightbound, lowerbound);
  append(boundaries, topl);
  append(boundaries, bottom);
  append(boundaries, left);
  append(boundaries, right);
  append(boundaries, boxb);
  append(boundaries, boxr);
}

function setDimensions(){
  _spacing = sqrt(width*height/400);
  _aspect = width/height;
  spacing = fac*_spacing;
  radius = fac*_spacing/2;
  fs = _spacing;
  if (menuOpen){
    lowerbound = 12*fs;
  } else {
    lowerbound = 2*fs; 
  }
  rightbound = 11*fs*1.42/2;
}

function hideDOM(){
  slider2.hide(); 
  slider3.hide(); 
  slider4.hide();
  slider5.hide();
  checkbox.hide(); 
  checkbox2.hide(); 
  checkbox3.hide(); 
  checkbox4.hide(); 
  checkbox5.hide();
  checkbox6.hide();
}

function showDOM(){
  slider2.show(); 
  slider3.show(); 
  slider4.show();
  slider5.show();
  checkbox.show(); 
  checkbox2.show(); 
  checkbox3.show(); 
  checkbox4.show();
}

function checkMenu(){
  if (menuOpen){
    // shrink lowerbound, hide DOM
    lowerbound = 12*fs;
    boundaries = [];
    setBoundaries();
   
    showDOM();
  } else {
    // extend lowerbound, show DOM
    lowerbound = 2*fs;
    boundaries = [];
    setBoundaries();

    hideDOM();
  } 
}

function showBField(){
  push();

  let v = map(abs(Bz),0,0.005,0,1);
  let cmin = color(0,0,0,0);
  let cmax = color(255,255,255);

  translate(width-40,40);
  let w = 40;
  let c = lerpColor(color(0,0,0,0),color(0,0,0,255),v);
  fill(c);
  strokeWeight(0);
  rect(-w, -w, 2*w, 3*w);
  
  c = lerpColor(cmin,cmax,v);
      
  if (Bz >= 0) {
    strokeWeight(0.05*w);
    fill(0,0,0,0);
    stroke(c);
    circle(0,0,sqrt(2)*w);
    fill(c);
    circle(0,0,0.1*w);
  } else if (Bz < 0){
    strokeWeight(0.1*w);
    rotate(PI/4);
    fill(c);
    stroke(c);
    line(-0.5*w,0,0.5*w,0);
    rotate(PI/2);
    line(-0.5*w,0,0.5*w,0);
    rotate(-3*PI/4);
  } 
  noStroke();
  fill(c);
  textAlign(CENTER, CENTER);
  textSize(fs/2);
  textFont("monospace");
  let s = String.fromCharCode('0x20D1');
  text(s, 0, 1.5*w-0.05*fs);
  text("B", 0, 1.5*w);
  pop(); 
}
