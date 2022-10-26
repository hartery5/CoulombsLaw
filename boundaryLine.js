class boundaryLine {
  constructor (x1,y1,x2,y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.theta = abs(atan2(this.y2-this.y1, this.x2-this.x1) + PI/2);
    this.dx = this.x2-this.x1;
    this.dy = this.y2-this.y1;
    this.mag = sqrt(pow(this.x2-this.x1,2)+pow(this.y2-this.y1,2));
    this.nx = -1.0*this.dy/this.mag;
    this.ny = this.dx/this.mag;
  }
  
  bounce(x, y, r){
    let a = pow(this.mag,2);
    let b = 2*((this.x1-x)*(this.x2-this.x1) + (this.y1-y)*(this.y2-this.y1));
    let c = pow(this.x1-x,2) + pow(this.y1-y,2) - pow(r,2);
    
    let d = b*b - 4*a*c;
    if (d < 0){
      return false
    } else {
      d = sqrt(d);

      let t1 = (-b - d)/(2*a);
      let t2 = (-b + d)/(2*a);
      
      if (((t1 >= 0) && (t1 <=1)) || ((t2>=0) && (t2<=1))){
        return true
      }
    }
    return false
  }
}
