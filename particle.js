class particle {
  constructor(x, y, vx, vy, m, q, r, move, arrow){
    this.x = x;
    this.y = y;
    this.q = q;
    this.move = move;
    this.type = move;
    this.arrow = arrow;
    this.mass = m;
    this.vx = vx;
    this.vy = vy;
    this.ax = 0.0;
    this.ay = 0.0;
    this.V = 0;
    this.t = 0;
    this.Etheta = 0.0;
    this.flag = false;
    this.radius = r;
    this.bit = 0;
    this.linetype=0;
  }
  
  physics(particles, boundaries, deltat){
    let F, Fx, Fy, theta, r
    let ax, ay, vx, vy, x, y;
    let sumFx = 0.0;
    let sumFy = 0.0;
    let v = 0;
    
    for (let i = 0; i<particles.length; i+=1){
      if (particles[i] == this){
        continue
      }
      else {
        F = Coulomb(this, particles[i]);
        theta = calculateTheta(this, particles[i]);
        r = dist(this.x, this.y, particles[i].x, particles[i].y);
        v += k*particles[i].q/r;
        if (r>this.radius){
          Fx = F*cos(theta);
          Fy = F*sin(theta);
          sumFx += Fx;
          sumFy += Fy;
          
          if (showF && !this.arrow){
            this.showArrow(F,theta);
          }
        } 
        else if ((r < this.radius) & (this.move)) {
          this.flag = true;
          if (particles[i].move) {
            particles[i].q += this.q;
            particles[i].q = round(particles[i].q);
          }
          return;
        }
      }
    }
    
    this.V = v;
    if (this.V>isomax){
      isomax = this.V;  
    }
    if (this.V<isomin){
      isomin = this.V;
    }
    this.Emag = pow(sumFx,2) + pow(sumFy,2);
    this.Etheta = atan2(sumFy,sumFx);

    if (this.move){
      ax = (sumFx-this.q*this.vy*Bz)/this.mass;
      ay = (sumFy+this.q*this.vx*Bz)/this.mass;

      // Verlet
      vx = this.vx + ax*deltat;
      vy = this.vy + ay*deltat;

      x = this.x + vx*deltat;
      y = this.y + vy*deltat;
      
      for (let j = 0; j < boundaries.length; j +=1){
        if (boundaries[j].bounce(x,y,this.radius)){
          let dotproduct = vx*boundaries[j].nx + vy*boundaries[j].ny;
          vx += - 2.0*dotproduct*boundaries[j].nx;
          vy += - 2.0*dotproduct*boundaries[j].ny;
        }
      }
      
      x = this.x + vx*deltat;
      y = this.y + vy*deltat;
      
      this.ax = ax;
      this.ay = ay;
      this.vx = vx;
      this.vy = vy;
      this.x = x;
      this.y = y;
      this.t += 1;
    }
  }
  
  showArrow(F,theta){
    F *= 10000;
    push();
    fill(255);
    stroke(255);
    strokeWeight(0.15*this.radius);
    // Move to center
    translate(this.x,this.y);
    // Rotate along axis
    rotate(theta);
    // Move to edge
    translate(Math.sign(F)*this.radius,0);
    line(0, 0, F, 0);
    triangle(F, 0.1*this.radius, F+Math.sign(F)*0.1*this.radius, 0, F, -0.1*this.radius);
    pop();
  }
    
  draw(){
    if (!this.arrow){
      push();
      noStroke();
      let v = map(abs(this.q),1,10,0,1);
      let cmax;
      let cmin;
      if (this.q > 0) {
        cmin = color("salmon");
        cmax = color(255, 0, 0);
      } else {
        cmin = color("cornflowerblue");
        cmax = color(0, 0, 255);
      }
      let c = lerpColor(cmin, cmax, v);
      fill(c);
      circle(this.x, this.y, this.radius*2);
      textSize(this.radius);
      textFont('Courier New');
      textAlign(CENTER, CENTER);
      fill('black')
      text(nfp(this.q,1,0),this.x,this.y);
      pop();
    }
    else{
      push();
      translate(this.x,this.y);
      
      let c, v;
      let c1 = color(0,0,0);
      let c2 = color(180,255,180);
      let c3 = color(180,180,255);

      if (showV){
        v = map(log(abs(this.V)),-1,1,0,1);
        if (this.V>0){
          c = lerpColor(c1,c2,v);
        } else {
          c = lerpColor(c1,c3,v); 
        }
        strokeWeight(0.25);
        stroke(c);
        fill(c);
        rectMode(CENTER);
        //rect(0, 0, ospacing*_nx, ospacing*_ny);
        rect(0, 0, spacing, spacing);
      }
      
      if (!hideArr){
        c1 = color(80,80,80);
        v = map(log(abs(this.Emag)),-15,-6,0,1);
        c = lerpColor(c1,c2,v);
        stroke(c);
        strokeWeight(0.15*this.radius);
        fill(c);
        rotate(this.Etheta);
        line(0, 0, 0.9*this.radius, 0);
        triangle(0.9*this.radius, 0.1*this.radius, 0.9*this.radius+0.1*this.radius, 0, 0.9*this.radius, -0.1*this.radius);
      }
      pop();
    }
  }
  
  flip(c){
    if (this.V>=c){
      this.bit = 1; 
    } else {
      this.bit = 0; 
    }
  }
  
 showiso(){
    push();
    translate(this.x,this.y);
    let spacingx = spacing*_nx;
    let spacingy = spacing*_ny;
    
    let ymid = -spacingy/2;
    let xmid = spacingx/2;
    
    let xmb = xmid;
    let xmt = xmid;
    let yml = ymid;
    let ymr = ymid;
    
    let left = 0;
    let right = spacingx;
    let bottom = 0;
    let top = -spacingy;

    strokeWeight(2);
    stroke(255);
    fill(0,0,0,0);
    switch(this.linetype){
      case 1:
        line(left,yml,xmb,bottom);
        //bezier(left,yml,left,bottom,left,bottom,xmb,bottom);
        break;
      case 2:
        line(xmb,bottom,right,ymr);
        break;
      case 3:
        line(left,yml,right,ymr);
        break;
      case 4:
        line(xmt,top,right,ymr);
        break;
      case 5:
        line(xmb,bottom,right,ymr);
        line(left,yml,xmt,top);
        break;
      case 6:
        line(xmb,bottom,xmt,top);
        break;
      case 7:
        line(left,yml,xmt,top);
        break;
      case 8:
        line(left,yml,xmt,top);
        break;
      case 9:
        line(xmb,bottom,xmt,top);
        break;
      case 10:
        line(left,yml,xmb,bottom);
        line(xmt,top,right,ymr);
        break;
      case 11:
        line(xmt,top,right,ymr);
        break;
      case 12:
        line(left,yml,right,ymr);
        break;
      case 13:
        line(xmb,bottom,right,ymr);
        break;
      case 14:
        line(left,yml,xmb,bottom);
        break;
    }
    pop();
  }
}
  
function calculateTheta(particle1, particle2){
  let dy = particle2.y - particle1.y;
  let dx = particle2.x - particle1.x;
  let theta = atan2(dy, dx)
  return theta
}
  
function Coulomb(particle1, particle2){
  let r = dist(particle1.x, particle1.y, particle2.x, particle2.y);
  let F = -1.0*k*particle1.q*particle2.q/pow(r, 2);
  return F
}
