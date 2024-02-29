class particle {
  constructor(x, y, vx, vy, m, q, r, move, arrow) {
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
    this.Ex;
    this.Ey;
    this.Emag = 0.0;
    this.Etheta = 0.0;
    this.flag = false;
    this.radius = r;
    this.bit = 0;
    this.linetype=0;
  }

  physics(particles, boundaries, deltat) {
    let F, Fx, Fy, theta, r;
    let ax, ay, vx, vy, x, y;
    let sumFx = 0.0;
    let sumFy = 0.0;
    let v = 0;

    for (let i = 0; i<particles.length; i+=1) {
      if (particles[i] == this) {
        continue
      } else {
        F = Coulomb(this, particles[i]);
        theta = calculateTheta(this, particles[i]);
        r = dist(this.x, this.y, particles[i].x, particles[i].y);
        if (r < this.radius){
          r = this.radius;  
        }
        v += k*particles[i].q/r;
        if (r>this.radius) {
          Fx = F*cos(theta);
          Fy = F*sin(theta);
          sumFx += Fx;
          sumFy += Fy;

          if (showF && showArr && !this.arrow) {
            this.showArrow(F, theta, particles[i].q, false);
          }
        } else if ((r < this.radius) & (this.move)) {
          this.flag = true;
          if (particles[i].move) {
            particles[i].q += this.q;
            particles[i].q = round(particles[i].q);
          }
          return;
        }
      }
    }
    
    if (showF && showArr && !this.arrow) {
      let netF = pow(pow(sumFx,2) + pow(sumFy,2),0.5);
      let netT = atan2(sumFy,sumFx);
      this.showArrow(netF, netT, 0, false);
    }

    this.V = v;
    if (this.V>isomax) {
      isomax = this.V;
    }
    if (this.V<isomin) {
      isomin = this.V;
    }
    this.Ex = sumFx;
    this.Ey = sumFy;
    this.Emag = sqrt(pow(sumFx, 2) + pow(sumFy, 2));
    this.Etheta = atan2(sumFy, sumFx);

    if (this.move) {
      ax = (sumFx-this.q*this.vy*Bz)/this.mass;
      ay = (sumFy+this.q*this.vx*Bz)/this.mass;

      // Verlet
      vx = this.vx + ax*deltat;
      vy = this.vy + ay*deltat;

      //vx = ax*deltat;
      //vy = ay*deltat;

      x = this.x + vx*deltat;
      y = this.y + vy*deltat;

      for (let j = 0; j < boundaries.length; j +=1) {
        if (boundaries[j].bounce(x, y, this.radius)) {
          //let dotproduct = vx*boundaries[j].nx + vy*boundaries[j].ny;
          //vx += - 2.0*dotproduct*boundaries[j].nx;
          //vy += - 2.0*dotproduct*boundaries[j].ny;
          this.flag = true;
        }
      }

      //x = this.x + vx*deltat;
      //y = this.y + vy*deltat;

      this.ax = ax;
      this.ay = ay;
      this.vx = vx;
      this.vy = vy;
      this.x = x;
      this.y = y;
      this.t += 1;
    }
  }

  getVoltage(){
    return this.V;
  }

  showArrow(F, theta, qq, field) {
    F *= 10000;
    push();
    let v = map(abs(qq), 1, 10, 0, 1);
    let cmax;
    let cmin;
    if (qq > 0) {
      cmin = color("salmon");
      cmax = color(255, 0, 0);
    } else {
      cmin = color("cornflowerblue");
      cmax = color(0, 0, 255);
    }
    let c = lerpColor(cmin, cmax, v);
    if (qq==0) {
      c = color(255,255,255);
    }
    //fill(c);
    stroke(c);
    strokeWeight(0.15*this.radius);
    // Move to center
    translate(this.x, this.y);
    // Rotate along axis
    if (field){
      rotate(theta+PI);
    } else {
      rotate(theta);
    }
    // Move to edge
    translate(Math.sign(F)*this.radius, 0);
    line(0, 0, F, 0);
    triangle(F, 0.1*this.radius, F+Math.sign(F)*0.1*this.radius, 0, F, -0.1*this.radius);
    pop();
  }

  draw() {
    if (!this.arrow) {
      push();
      translate(this.x, this.y);
      noStroke();
      let v = map(abs(this.q), 1, 10, 0, 1);
      let cmax;
      let cmin;
      if (this.q > 0) {
        cmax = color("salmon");
        cmin = color(255, 0, 0);
      } else {
        cmax = color("cornflowerblue");
        cmin = color(0, 0, 255);
      }
      let c = lerpColor(cmin, cmax, v);
      fill(c);
      stroke(0);
      strokeWeight(2);
      circle(0, 0, this.radius*2);
      noStroke();
      textSize(this.radius);
      textFont('Courier New');
      textAlign(CENTER, CENTER);
      fill('black')
        text(nfp(this.q, 1, 0), 0, 0);
      pop();
    } else {
      push();
      translate(this.x, this.y);

      let c, v;
      let c1 = color(0, 0, 0);
      let c2 = color(239,138,98);
      let c3 = color(103,169,207);

      //if (showV) {
      //  v = map(log(abs(this.V)), -1, 1, 0, 1);
      //  if (this.V>0) {
      //    c = lerpColor(c1, c2, v);
      //  } else {
      //    c = lerpColor(c1, c3, v);
      //  }
      //  strokeWeight(0.25);
      //  stroke(c);
      //  fill(c);
      //  rectMode(CENTER);
      //  //rect(0, 0, ospacing*_nx, ospacing*_ny);
      //  rect(0,0, fac*radius, fac*radius);
      // }

      if (showArr && !showV) {
        c1 = color(80, 80, 80, 0);
        c2 = color(255, 255, 255);
        v = map(log(abs(this.Emag)), -18, -6, 0, 1);
        c = lerpColor(c1, c2, v);
        stroke(c);
        strokeWeight(2);
        fill(c);
        rotate(this.Etheta);
        let s = this.radius/fac;
        line(0, 0, 0.9*s, 0);
        triangle(0.9*s, 0.1*s, 0.9*s+0.1*s, 0, 0.9*s, -0.1*s);
      }
      if (showArr && showV) {
        c1 = color(255,255, 255, 0);
        c2 = color(0, 0, 0, 255);
        v = map(log(abs(this.Emag)), -18, -6, 0, 1);
        c = lerpColor(c1, c2, v);
        stroke(c);
        strokeWeight(2);
        fill(c);
        rotate(this.Etheta);
        let s = this.radius/fac;
        line(0, 0, 0.9*s, 0);
        triangle(0.9*s, 0.1*s, 0.9*s+0.1*s, 0, 0.9*s, -0.1*s);
      }
      pop();
    }
  }

  flip(c) {
    if (this.V>=c) {
      this.bit = 1;
    } else {
      this.bit = 0;
    }
  }

  showiso(Pxb,Pyr,Pxt,Pyl,VV,isomin,isomax) {
    push();
    translate(this.x, this.y);
    let spacingx = fac*radius;
    let spacingy = fac*radius;

    let xmb = Pxb*spacingx;
    let xmt = Pxt*spacingx;
    let yml = -Pyl*spacingy;
    let ymr = -Pyr*spacingy;

    let left = 0;
    let right = spacingx;
    let bottom = 0;
    let top = -spacingy;

    let cmax;
    let cmin;
    let v, c;
    if (VV > 0) {
      cmin = color(255,155,155);
      cmax = color(255, 0, 0);
      v = map(VV,0,isomax,0,1);
      c = lerpColor(cmin, cmax, v);
    } else if (VV < 0) {
      cmin = color("cornflowerblue");
      cmax = color(0, 0, 255);
      v = map(VV,isomin,0,0,1);
      c = lerpColor(cmin, cmax, v);
    } else {
      c = color(255,255,255);
    }

    strokeWeight(3);
    stroke(0);
    noFill();
    switch(this.linetype) {
      case 1:
        line(left, yml, xmb, bottom);
        break;
      case 2:
        line(xmb, bottom, right, ymr);
        break;
      case 3:
        line(left, yml, right, ymr);
        break;
      case 4:
        line(xmt, top, right, ymr);
        break;
      case 5:
        line(xmb, bottom, right, ymr);
        line(left, yml, xmt, top);
        break;
      case 6:
        line(xmb, bottom, xmt, top);
        break;
      case 7:
        line(left, yml, xmt, top);
        break;
      case 8:
        line(left, yml, xmt, top);
        break;
      case 9:
        line(xmb, bottom, xmt, top);
        break;
      case 10:
        line(left, yml, xmb, bottom);
        line(xmt, top, right, ymr);
        break;
      case 11:
        line(xmt, top, right, ymr);
        break;
      case 12:
        line(left, yml, right, ymr);
        break;
      case 13:
        line(xmb, bottom, right, ymr);
        break;
      case 14:
        line(left, yml, xmb, bottom);
        break;
      }
    
    pop();
  }

  filliso(Pxb,Pyr,Pxt,Pyl,VV,isomin,isomax){
    push();
    translate(this.x,this.y);
    let cmax;
    let cmin;
    let v, c;
    if (VV > 0) {
      cmin = color(255,155,155);
      cmax = color(255, 0, 0);
      v = map(VV,0,isomax,0,1);
      c = lerpColor(cmin, cmax, v);
    } else if (VV < 0) {
      cmin = color("cornflowerblue");
      cmax = color(0, 0, 255);
      v = map(VV,isomin,0,0,1);
      c = lerpColor(cmax, cmin, v);
    } else {
      c = (255,255,255);
    }

    let spacingx = fac*radius;
    let spacingy = fac*radius;

    let xmb = Pxb*spacingx;
    let xmt = Pxt*spacingx;
    let yml = -Pyl*spacingy;
    let ymr = -Pyr*spacingy;

    let left = 0;
    let right = spacingx;
    let bottom = 0;
    let top = -spacingy;


    //strokeWeight(1);
    //stroke(25);
    beginShape();
    fill(c);
    noStroke();
    switch(this.linetype){
      case 0:
        break;
      case 1:
        vertex(left,bottom);
        vertex(left,yml);
        vertex(xmb,bottom);
        break;
      case 2:
        vertex(xmb,bottom);
        vertex(right,bottom);
        vertex(right,ymr);
        break;
      case 3:
        vertex(0,0);
        vertex(0,yml);
        vertex(right,ymr);
        vertex(right,0);
        break;
      case 4:
        vertex(xmt,-spacingy);
        vertex(spacingx,-spacingy);
        vertex(spacingx,ymr);
        break;
      case 5:
        vertex(0,0);
        vertex(0,yml);
        vertex(xmt,-spacingy);
        vertex(spacingx,-spacingy);
        vertex(spacingx,ymr);
        vertex(xmb,0);
        break;
      case 6:
        vertex(xmb,0);
        vertex(xmt,-spacingy);
        vertex(spacingx,-spacingy);
        vertex(spacingx,0);
        break;
      case 7:
        vertex(0,0);
        vertex(0,yml);
        vertex(xmt,-spacingy);
        vertex(spacingx,-spacingy);
        vertex(spacingx,0);
        break;
      case 8:
        vertex(0,yml);
        vertex(0,-spacingy);
        vertex(xmt,-spacingy);
        break;
      case 9:
        vertex(0,0);
        vertex(0,-spacingy);
        vertex(xmt,-spacingy);
        vertex(xmb,0);
        break;
      case 10:
        vertex(0,yml);
        vertex(0,-spacingy);
        vertex(xmt,-spacingy);
        vertex(spacingx,ymr);
        vertex(spacingx,0);
        vertex(xmb,0);
        break;
      case 11:
        vertex(0,0);
        vertex(0,-spacingy);
        vertex(xmt,-spacingy);
        vertex(spacingx,ymr);
        vertex(spacingx,0);
        break;
      case 12:
        vertex(0,yml);
        vertex(0,-spacingy);
        vertex(spacingx,-spacingy);
        vertex(spacingx,ymr);
        break;
      case 13:
        vertex(0,0);
        vertex(0,-spacingy);
        vertex(spacingx,-spacingy);
        vertex(spacingx,ymr);
        vertex(xmb,0);
        break;
      case 14:
        vertex(0,yml);
        vertex(0,-spacingy);
        vertex(spacingx,-spacingy);
        vertex(spacingx,0);
        vertex(xmb,0);
        break;
      case 15:
        vertex(0,0);
        vertex(0,-spacingy);
        vertex(spacingx,-spacingy);
        vertex(spacingx,0);
    }
    endShape();
    
    pop();
    //this.draw();
  }
}

function calculateTheta(particle1, particle2) {
  let dy = particle2.y - particle1.y;
  let dx = particle2.x - particle1.x;
  let theta = atan2(dy, dx);
  return theta
}

function Coulomb(particle1, particle2) {
  let r = dist(particle1.x, particle1.y, particle2.x, particle2.y);
  let F = -1.0*k*particle1.q*particle2.q/pow(r, 2);
  return F
}
