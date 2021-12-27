class Pole{
  constructor(){
    this.m=M;
    this.r=15;
    this.h=290;
    let vec=new vec3(0,0,0);
    this.p=vec.random3D().mult(Box/2);
    this.v=vec.random3D().mult(Vmag);
    this.orient=new vec3(0,1,0);
    this.axis=new vec3(0,0,1);
    this.angle=0.0;
    this.omega=.5;
    this.color=random(255);
    this.q=angleAxis(this.angle,this.axis);
    this.orient0=new vec3(0,1,0);
  }
  draw(){
    push();
    translate(this.p.x,this.p.y,this.p.z);

    let q1=fromTo(new vec3(0,1,0),this.orient);
    if (!isNaN(q1.v.mag())){
      rotate(q1.getAngle(),toPV(q1.getAxis()));
      // console.log(this.orient0.rotate(this.angle,this.axis));
      // console.log(this.orient);
    }
    // if (!isNaN(this.q.v.mag())) rotate(this.q.getAngle(),toPV(this.q.getAxis()));
    // rotate(this.angle,toPV(this.axis))
    colorMode(HSB);
    fill(this.color,255,255);
    cylinder(this.r,this.h,6,6);
    pop();
    // this.orient=this.orient0.rotate(this.angle,this.axis);
    this.axis.draw(this.p);
    // let up=new vec3(0,1,0).rotate(q1.getAngle(),(q1.getAxis())).rotate(this.angle,this.axis);
    // up.draw(this.p.add(up.mult(this.h/2)));


    this.getTanV().draw(this.p.add(this.orient.mult(this.h/2)));
    this.orient.draw(this.p.add(this.orient.mult(this.h/2)));
  }
  bounds(bool){
    let bool2=false;
    let push=1;
    //x=+-Box
    let t=(Box-this.p.x)/this.orient.x
    let inter=this.p.add(this.orient.mult(t));
    let d=distance(inter,this.p);
    if (d*d<pow(this.h/2,2)+pow(this.r,2) || this.p.x+this.r>Box){
      if (!bool) this.v.x*=-1;
      this.p.x-=push;
      bool2=true;
    }
    t=(-Box-this.p.x)/this.orient.x
    inter=this.p.add(this.orient.mult(t))
    d=distance(inter,this.p);
    if (d*d<pow(this.h/2,2)+pow(this.r,2) || this.p.x-this.r<-Box){
      if (!bool) this.v.x*=-1;
      this.p.x+=push;
      bool2=true;
    }
    //y=+-Box
    t=(Box-this.p.y)/this.orient.y
    inter=this.p.add(this.orient.mult(t))
    d=distance(inter,this.p);
    if (d*d<pow(this.h/2,2)+pow(this.r,2) || this.p.y+this.r>Box){
      if (!bool) this.v.y*=-1;
      this.p.y-=push;
      bool2=true;
    }
    t=(-Box-this.p.y)/this.orient.y
    inter=this.p.add(this.orient.mult(t))
    d=distance(inter,this.p);
    if (d*d<pow(this.h/2,2)+pow(this.r,2) || this.p.y-this.r<-Box){
      if (!bool) this.v.y*=-1;
      this.p.y+=push;
      bool2=true;
    }
    //z=+-Box
    t=(Box-this.p.z)/this.orient.z
    inter=this.p.add(this.orient.mult(t))
    d=distance(inter,this.p);
    if (d*d<pow(this.h/2,2)+pow(this.r,2)  || this.p.z+this.r>Box){
      if (!bool) this.v.z*=-1;
      this.p.z-=push;
      bool2=true;
    }
    t=(-Box-this.p.z)/this.orient.z
    inter=this.p.add(this.orient.mult(t))
    d=distance(inter,this.p);
    if (d*d<pow(this.h/2,2)+pow(this.r,2) || this.p.z-this.r<-Box){
      if (!bool) this.v.z*=-1;
      this.p.z+=push;
      bool2=true;
    }
    if (bool2) this.bounds(true);

  }
  move(){
    this.p=this.p.add(this.v);
    this.angle+=this.omega;
    this.angle=this.angle%(2*PI);
    // this.orient=new vec3(0,1,0).rotate(this.angle,this.axis);

    this.q=angleAxis(this.angle,this.axis);
    this.orient=this.orient0.rotate(this.angle,this.axis);
    // this.q=this.q.mult(angleAxis(this.omega,this.axis));
    // this.orient=new vec3(0,1,0).rotate(this.q.getAngle(),this.q.getAxis());
    // this.axis=this.q.getAxis();
  }
  gravity(){
    let a=gField(this.p);
    this.v=this.v.add(a);
    // this.y+=g;
  }
  getTanV(){
    return this.axis.cross(this.orient).mult(this.omega*this.h/2);
  }
  getI(){
    return (this.m*pow(this.h,2)/12.0)
    *pow(sin(getAngle(this.axis,this.orient)),3);
  }
}

class Ball{
  constructor(){
    this.m=1;
    this.r=R;
    let vec=new vec3(0,0,0);
    this.p=vec.random3D().mult(Box/2);
    this.v=vec.random3D().mult(Vmag);
    this.axis=vec.random3D().mult(2*PI);
    this.angle=1;
    this.omega=0;
    this.color=random(255);
  }
  draw(){
    push();
    translate(this.p.x,this.p.y,this.p.z);
    rotate(this.angle,toPV(this.axis));
    colorMode(HSB);
    fill(this.color,255,255);
    sphere(this.r,6,6);
    pop();
    this.v.draw(this.p);
  }
  move(){
    this.p=this.p.add(this.v);
    this.angle+=this.omega;
    this.angle=this.angle%(2*PI);
  }
  bounds(bool){
    let bool2=false;
    if (pow(this.p.x,2)>pow(Box,2)){
      if (!bool) this.v.x=-this.v.x;
      else this.p.x=(Box-5)*sign(this.p.x);
      bool2=true;
    }
    if (pow(this.p.y,2)>pow(Box,2)){
      if (!bool) this.v.y=-this.v.y;
      else this.p.y=(Box-5)*sign(this.p.y);
      bool2=true;
    }
    if (pow(this.p.z,2)>pow(Box,2)){
      if (!bool) this.v.z=-this.v.z;
      else this.p.z=(Box-5)*sign(this.p.z);
      bool2=true;
    }
    if (bool2) this.bounds(true);
  }
  gravity(){
    let a=gField(this.p);
    this.v=this.v.add(a);
    // this.y+=g;
  }
}
