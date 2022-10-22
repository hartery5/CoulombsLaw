class particle {
  constructor(x, y, q, r, move, arrow){
    this.x = x;
    this.y = y;
    this.q = q;
    this.move = move;
    this.type = move;
    this.arrow = arrow;
    this.mass = 1.0;
    this.vx = 0.0;
    this.vy = 0.0;
    this.V = 0
    this.Etheta = 0.0;
    this.flag = false;
    this.radius = r;
    if (this.q>0){
      this.color = color('salmon');
    }
    else {
      this.color = color('cornflowerblue');
    }
  }
  
  update(particles, deltat) {
    this.physics(particles, deltat);
    this.draw();
  }
  
  physics(particles, deltat){
    let ax, ay, vx, vy, x, y;
    let sumFx = 0;
    let sumFy = 0;
    let v = 0;
    

    for (let i = 0; i<particles.length; i+=1){
      if (particles[i] == this){
        continue
      }
      else {
        let F = calculateForceMagnitude(this, particles[i]);
        let theta = calculateTheta(this, particles[i]);
        let r = dist(this.x, this.y, particles[i].x, particles[i].y);
        v += k*particles[i].q/r;
        if (r>this.radius/2){
          let Fx = F*cos(theta);
          let Fy = F*sin(theta);
          sumFx += Fx;
          sumFy += Fy;
        } 
        else if ((r < this.radius) & (this.move)) {
          this.flag = true;
          if (particles[i].move){
            particles[i].flag = true;
          }
        }
      }
    }
    
    this.V = v;
    if (this.V>maxV){
      maxV = this.V;
    }
    this.Emag = sumFx**2 + sumFy**2;
    this.Etheta = atan2(sumFy,sumFx);

    if (this.move){
      ax = sumFx/this.mass;
      ay = sumFy/this.mass;


      vx = this.vx + ax*deltat;
      vy = this.vy + ay*deltat;

      if ((this.x + vx*deltat)>(width-this.radius)){
        vx = -1.0001*vx;
      }
      if ((this.x + vx*deltat)<this.radius){
        vx = -1.0001*vx;
      }

      if ((this.y + vy*deltat)>(height-this.radius)){
        vy = -1.0001*vy;
      }

      if ((this.y + vy*deltat)<this.radius){
        vy = -1.0001*vy;
      }

      x = this.x + vx*deltat;
      y = this.y + vy*deltat;

      this.vx = vx;
      this.vy = vy;
      this.x = x;
      this.y = y;
    }
  }
    
  draw(){
    if (!this.arrow){
      push();
      noStroke();
      let v = map(abs(this.q),1,10,0,1);
      let cmax;
      if (this.q>0){
        cmax = color(255,0,0);
      } else {
        cmax = color(0,0,255);
      }
      let c = lerpColor(this.color,cmax,v);
      fill(c);
      circle(this.x, this.y, this.radius*2);
      textSize(this.radius);
      textAlign(CENTER, CENTER);
      fill('black')
      text(nfp(this.q,1,0),this.x,this.y);
      pop();
    }
    else{
      push();
      let c1 = color(80,80,80);
      let c2 = color(180,255,180);
      let c3 = color(180,180,255);
      let v = map(log(abs(this.Emag)),-15,-6,0,1);
      let c;
      //if (this.V>0){
      c = lerpColor(c1,c2,v);
      //} else {
      //  c = lerpColor(c1,c3,v);
      //}
      stroke(c);
      strokeWeight(5);
      fill(c);
      translate(this.x,this.y);
      rotate(this.Etheta);
      line(0, 0, spacing/2, 0);
      triangle(spacing/2, 5, spacing/2+5, 0, spacing/2, -5);
      pop();
    }
  }
}
  
function calculateTheta(particle1, particle2){
  let dy = particle2.y - particle1.y;
  let dx = particle2.x - particle1.x;
  let theta = atan2(dy, dx)
  return theta
}
  
function calculateForceMagnitude(particle1, particle2){
  let r = dist(particle1.x, particle1.y, particle2.x, particle2.y);
  let F = -1.0*k*particle1.q*particle2.q/pow(r, 2);
  return F
}
  
  
