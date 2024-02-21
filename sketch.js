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
let slider6;
let slider7;
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
let scaling = 0;
let oscaling = 0;
let isolines = [];
let isoscale = 0.5;
let isomax = 0.0;
let isomin = 0.0;

// Flags
let mover = true;
let trashmode = false;
let showE = false;
let showV = false;
let showF = false;
let showArr = true;
let showTest = false;
let fillShape = true;

function setup() {
  mySvg = loadImage("wastebasket.svg");
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Set dimensions
  setDimensions();

  slider = createSlider(-5, 5, 1, 1);
  slider2 = createSlider(0, 5, 1, 1);
  slider3 = createSlider(-5, 5, 0, 0.5);
  slider4 = createSlider(1, 5, 1, 0.5);
  slider5 = createSlider(0.6, 2, 1, 0.2);
  slider5.input(updateTest);
  slider6 = createSlider(0.2, 1, 1, 0.2);
  slider7 = createSlider(-2, 0, 0, 0.1);
  slider7.input(updateZoom);

  checkbox = createCheckbox('', true);
  checkbox2 = createCheckbox('', false);
  checkbox3 = createCheckbox('', false);
  checkbox4 = createCheckbox('', false);
  checkbox5 = createCheckbox('', false);
  checkbox6 = createCheckbox('', false);
  checkbox7 = createCheckbox('', false);

  checkbox6.changed(() => {
    if (checkbox6.checked()){
      showArr=false;
      checkbox7.checked(true);
    }
  });

  // Place UI elements
  placeDOM();

  // Adjust Menu
  checkMenu();

  // Create Field Arrows
  let I = 0;
  let J = 0;
  for (let i = 400; i < width+2*fac*radius; i += fac*radius) {
    testParticles[I] = [];
    J = 0;
    for (let j = 0; j < height+fac*radius; j += fac*radius) {
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
  fac = float(slider5.value());
  isoscale = float(slider6.value());
  scaling = float(slider7.value());

  // Update Checkboxes
  updateCheckboxes();

  // Show Cartesian Grid
  push();
  setLineDash([radius/4, radius/4]);
  stroke(50, 50, 50, 200);
  for (let i = 400; i < width; i += fac*radius) {
    line(i, 0, i, height);
  }
  for (let j = fac*radius; j < height; j += fac*radius) {
    line(0, j, width, j);
  }
  pop();


  // Show E field
  if (showE && !showV) {
    isomax = 0.0;
    isomin = 0.0;
    for (let i=0; i < maxI; i+=1) {
      for (let j=0; j < maxJ; j+=1) {
        testParticles[i][j].physics(particles, boundaries, deltat);
        testParticles[i][j].draw();
      }
    }
  }
  if (showE && showV){
    isomax = 0.0;
    isomin = 0.0;
    for (let i=0; i < maxI; i+=1) {
      for (let j=0; j < maxJ; j+=1) {
        testParticles[i][j].physics(particles, boundaries, deltat);
        //testParticles[i][j].draw();
      }
    }
    //print(isomin,isomax);
    isolines = [];
    isomin = Math.floor(-4);
    //isomax = 4;
    isoscale = 0.5;
    //for (let i = log(abs(isomin)); i>=-1; i = i - isoscale) {
    //  append(isolines, Math.sign(isomin)*exp(i));
    //}
    //append(isolines, 0.0);
    //for (let i = -1; i<=log(abs(isomax)); i = i + isoscale) {
    //  append(isolines, Math.sign(isomax)*exp(i));
    //}

    for (let i = isomin; i<=isomax; i += isoscale) {
      append(isolines, i);
    }

    for (let k=0; k<isolines.length; k++) {
      //Marching squares
      // Step 1 flip the bits (1: V>=iso[k]; 0: V<iso[k])
      showV = false
      for (let i =0; i<maxI; i++) {
        for (let j=0; j<maxJ; j++) {
          testParticles[i][j].flip(isolines[k]);
          //testParticles[i][j].draw();
        }
      }
      showV=true
      // Step 2 "March"
      // Each 2x2 cell is assigned ID from 0-15 based on bits
      // Line is drawn based on look-up-table
      for (let i = 0; i<maxI-1; i++) {
        for (let j = 1; j<maxJ; j++) {
          let Pyr = 1 - (isolines[k] - testParticles[i+1][j-1].V)/(testParticles[i+1][j].V-testParticles[i+1][j-1].V);
          let Pxt = (isolines[k] - testParticles[i][j-1].V)/(testParticles[i+1][j-1].V-testParticles[i][j-1].V);
          let Pyl = 1 - (isolines[k] - testParticles[i][j-1].V)/(testParticles[i][j].V-testParticles[i][j-1].V);
          let Pxb = (isolines[k] - testParticles[i][j].V)/(testParticles[i+1][j].V-testParticles[i][j].V);
          testParticles[i][j].linetype = testParticles[i][j].bit + 2*testParticles[i+1][j].bit + 4*testParticles[i+1][j-1].bit + 8*testParticles[i][j-1].bit; // clumsy but correct
          testParticles[i][j].filliso(Pxb,Pyr,Pxt,Pyl,isolines[k],isomin,isomax);
        }
      }
    }

    // Show Cartesian Grid
    push();
    setLineDash([radius/4, radius/4]);
    stroke(100, 100, 100, 200);
    for (let i = 400; i < width; i += fac*radius) {
      line(i, 0, i, height);
    }
    for (let j = fac*radius; j < height; j += fac*radius) {
      line(0, j, width, j);
    }
    pop();

    for (let i=0; i < maxI; i+=1) {
      for (let j=0; j < maxJ; j+=1) {
        //testParticles[i][j].physics(particles, boundaries, deltat);
        testParticles[i][j].draw();
      }
    }
  }

  // Show B-Field
  if (abs(Bz)>0) {
    showBField();
  }

  // Apply physics & show particles
  let newParticles = [];
  for (let i = 0; i < particles.length; i += 1) {
    if (!trashmode) {
      particles[i].physics(particles, boundaries, deltat);
    }
    particles[i].draw();

    // Only append particle if it hasn't been queued for deletion and |q|>0
    if (!particles[i].flag && abs(particles[i].q)>0) {
      append(newParticles, particles[i]);
    }
  }
  // Update particle array
  particles = newParticles;

  // Show test charge
  if (showTest) {
    testCharge.x = mouseX;
    testCharge.y = mouseY;
    testCharge.physics(particles, boundaries, deltat);
    testCharge.draw();
  }

  // Show trashbin
  if (trashmode) {
    push();
    imageMode(CENTER);
    image(mySvg, mouseX, mouseY);
    pop();
  }

  // Clear Screen
  push();
  imageMode(CENTER);
  image(mySvg, width-40, height-40);
  pop();


  // Text
  updateMenu();
}

function updateTest() {
  fac = float(slider5.value());
  let s = fac*radius;
  setDimensions();
  testParticles = [];
  let I = 0;
  let J = 0;
  for (let i = 400; i < width+s; i += s) {
    testParticles[I] = [];
    J = 0;
    for (let j = -s; j < height+s; j += s) {
      p = new particle(i, j, 0.0, 0.0, 1.0, q, s, false, true);
      testParticles[I][J] = p;
      J += 1;
    }
    I += 1;
  }
  maxI = I;
  maxJ = J;
}

function updateZoom() {
  let z = pow(10, float(slider7.value()));
  let zo = pow(10, oscaling);
  let xc = width/2;
  let yc = height/2;

  for (let i=0; i<particles.length; i++) {
    let r = dist(xc, yc, particles[i].x, particles[i].y);
    let t = atan2(particles[i].y-yc, particles[i].x-xc);
    let rn = r*z/zo;
    particles[i].x = rn*cos(t)+xc;
    particles[i].y = rn*sin(t)+yc;
    particles[i].radius = radius + 8*float(slider7.value());
  }
  oscaling = float(slider7.value());
}

function mousePressed() {
  if (abs(mouseX - (width-20))<40 && abs(mouseY - (height-20))<40) 
  {
    particles = [];
  } 
  else if (trashmode) 
  {
    // Schedule particle for deletion if clicked.
    for (let i = 0; i < particles.length; i += 1) 
    {
      if (
        abs(mouseX - particles[i].x) < particles[i].radius &&
        abs(mouseY - particles[i].y) < particles[i].radius
        ) {
        particles[i].flag = true;
      }
    }
  } 
  else if (!mover) 
  {
    let check = true;
    for (let i = 0; i < particles.length; i += 1) 
    {
      if (abs(mouseX - particles[i].x) < particles[i].radius &&abs(mouseY - particles[i].y) < particles[i].radius) 
      {
        particles[i].q += q;

        if (particles[i].q == 0) 
        {
          particles[i].flag = true;
        }

        check = false;
        break;
      }
    }
    if (check && !(mouseY < lowerbound && mouseX < rightbound) && abs(q) > 0) 
    {
      let posX = round(mouseX / (2 * radius * fac)) * 2 * fac * radius;
      let posY = round(mouseY / (2 * radius * fac)) * 2 * fac * radius;
      p = new particle(posX, posY, 0.0, 0.0, mass, q, fac*radius, mover, false);
      append(particles, p);
    }
  } 
  else if (!(mouseY < lowerbound && mouseX < rightbound)) 
  {
    let posX = round(mouseX / (2 * fac * radius)) * 2 * fac * radius;
    let posY = round(mouseY / (2 * fac * radius)) * 2 * fac * radius;
    p = new particle(posX, posY, v0*cos(theta_i), v0*sin(theta_i), mass, q, fac*radius, mover, false);
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
  _nx = width/spacing;
  _ny = height/spacing;
  let nr = radius/oldradius;

  setBoundaries();

  k *= nx*ny;

  for (let i=0; i < maxI; i+=1) {
    for (let j=0; j < maxJ; j+=1) {
      testParticles[i][j].x *= nx;
      testParticles[i][j].y *= ny;
      testParticles[i][j].radius *= nr;
    }
  }

  for (let i=0; i < particles.length; i+=1) {
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

function updateMenu() {
  // Create Menu
  push();
  fill(25, 25, 25);
  rect(0, 0, rightbound, lowerbound);
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

  // Show dial
  updateDial();
  text("θi = " + nfp(round(-1.0*(theta_i*180/PI) % 360), 1, 0) + "°", 10, 3.5*fs);
  text("vi = " + nfp(v0, 1, 1), 100+fs, 3.5*fs);
  text("Static", 20, 4.5*fs);
  text("Trash Mode", 20, 5.5*fs);
  text("Show E", 20, 6.5*fs);
  if (showE) {
    text("Show V", 4*fs*1.3/2+20, 6.5*fs);
    text("Hide →", 8*fs*1.3/2+20, 6.5*fs);
  }
  text("Show F", 20, 7.5*fs);
  if (showF) {
    text("Test Charge", 4*fs*1.3/2+20, 7.5*fs);
  }
  text("Magnetic Field, B:", 20, 8.5*fs);
  text("Mass, m:", 20, 9.5*fs);
  text("Grid Spacing:", 20, 10.5*fs);
  text("Isopotential Spacing:", 20, 11.5*fs);
  text("Zoom:", 20, 12.5*fs);
  pop();
}

function updateDial() {
  let yc = 2.5*fs;
  let rc = fs/2;
  let xc = 20+rc;

  if (mover && abs(mouseX-xc)<rc && (abs(mouseY-yc)<rc)) {
    theta_i = round(atan2(mouseY-yc, mouseX-xc)*180.0/PI/45)*45*PI/180;
  }

  push();
  fill(0);
  stroke(255);
  strokeWeight(0.05*rc);
  translate(xc, yc);
  setLineDash([10, 10]);
  circle(0, 0, 2.5*rc);
  setLineDash([10, 0]);
  strokeWeight(0.15*rc);
  fill(255);
  rotate(theta_i);
  line(0, 0, rc, 0);
  triangle(rc, 0.1*rc, rc+0.1*rc, 0, rc, -0.1*rc);
  pop();
}

function updateCheckboxes() {
  if (checkbox.checked()) {
    mover = false;
  } else {
    mover = true;
  }
  if (checkbox2.checked()) {
    trashmode = true;
  } else {
    trashmode = false;
  }
  if (checkbox3.checked()) {
    showE = true;
  } else {
    showE = false;
  }
  if (checkbox4.checked()) {
    showF = true;
  } else {
    showF = false;
  }
  if (showF) {
    checkbox5.show();
    if (checkbox5.checked()) {
      showTest = true;
    } else {
      showTest = false;
    }
  } else {
    checkbox5.hide();
  }
  if (showE) {
    checkbox6.show();
    checkbox7.show();
    if (checkbox6.checked()) {
      showV = true;
    } else {
      showV = false;
    }
    if (checkbox7.checked()) {
      showArr = false;
    } else {
      showArr = true;
    }
  } else {
    checkbox6.hide();
    checkbox7.hide();
  }
}

function placeDOM() {
  slider.position(10, 0.75*fs);
  let sw = 11*fs*1.3/2;
  slider.size(sw);
  slider2.position(90+fs, 3*fs);
  let sw2 = fs*3;
  slider2.size(sw2);
  slider3.position(10, 9*fs);
  slider3.size(sw);
  slider4.position(10, 10*fs);
  slider4.size(sw);
  slider5.position(10, 11*fs);
  slider5.size(sw);
  slider6.position(10, 12*fs);
  slider6.size(sw);
  slider7.position(10, 13*fs);
  slider7.size(sw);

  checkbox.style("width", "1200px");
  checkbox.style('color', '#ffffff');
  checkbox.position(0, 4.5*fs);
  checkbox2.style("width", "1200px");
  checkbox2.style('color', '#ffffff');
  checkbox2.position(0, 5.5*fs);
  checkbox3.style("width", "1200px");
  checkbox3.style('color', '#ffffff');
  checkbox3.position(0, 6.5*fs);
  checkbox4.style("width", "1200px");
  checkbox4.style('color', '#ffffff');
  checkbox4.position(0, 7.5*fs);
  checkbox5.style("width", "1200px");
  checkbox5.style('color', '#ffffff');
  checkbox5.position(4*fs*1.3/2, 7.5*fs);
  checkbox6.style("width", "1200px");
  checkbox6.style('color', '#ffffff');
  checkbox6.position(4*fs*1.3/2, 6.5*fs);
  checkbox7.style('color', '#ffffff');
  checkbox7.position(8*fs*1.3/2, 6.5*fs);
}

function setBoundaries() {
  boundaries = [];
  topl = new boundaryLine(width, 0.0, rightbound, 0.0);
  bottom = new boundaryLine(0.0, height, width, height);
  left = new boundaryLine(rightbound, height, rightbound, 0.0);
  right = new boundaryLine(width, 0.0, width, height);
  append(boundaries, topl);
  append(boundaries, bottom);
  append(boundaries, left);
  append(boundaries, right);
}

function setDimensions() {
  _spacing = sqrt(windowWidth*windowHeight/2000);
  _aspect = windowWidth/windowHeight;
  spacing = fac*_spacing;
  radius = 20;
  fs = 50;
  lowerbound = height;
  rightbound = 400;
}

function checkMenu() {
  lowerbound = height;
  setBoundaries();
}

function showBField() {
  push();

  let v = map(abs(Bz), 0, 0.005, 0, 1);
  let cmin = color(0, 0, 0, 0);
  let cmax = color(255, 255, 255);

  translate(width-40, 40);
  let w = 40;
  let c = lerpColor(color(0, 0, 0, 0), color(0, 0, 0, 255), v);
  fill(c);
  strokeWeight(0);
  rect(-w, -w, 2*w, 3*w);

  c = lerpColor(cmin, cmax, v);

  if (Bz >= 0) {
    strokeWeight(0.05*w);
    fill(0, 0, 0, 0);
    stroke(c);
    circle(0, 0, sqrt(2)*w);
    fill(c);
    circle(0, 0, 0.1*w);
  } else if (Bz < 0) {
    strokeWeight(0.1*w);
    rotate(PI/4);
    fill(c);
    stroke(c);
    line(-0.5*w, 0, 0.5*w, 0);
    rotate(PI/2);
    line(-0.5*w, 0, 0.5*w, 0);
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
