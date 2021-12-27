'use strict'

let sliderCA;
let sliderHue;
let sliderSat;
let sliderBr;
let buttonPlot,buttonX1,buttonX2;
let expr='-10*y-.7*yp';
let expr1='sin(x)';
let inp,inp1,inp2,inp3,inp4;
let exub="[-1,1]";//"[0,2*PI]";
let exvb="[-1,1]";//"[0,PI]";
let exprx="u";//"cos(u)*sin(v)";
let expry=".5*sin(7*(u**2+v**2)**.5-t)";//"sin(u)*sin(v)";
let exprz="v";//"cos(v)";
let t=0;
let sv=new vec3(0,0,-1);
let ev=new vec3(0,0,-1);
let tmp=new vec3(0,0,-1);
let rot=false;
let q;
let cam;
let qb;
let mouse;



function setup(){
  qb=angleAxis(0.01,new vec3(0,1,0));
  q=angleAxis(0.01,new vec3(0,1,0));

  let cnv=createCanvas(500,400,WEBGL);
  let cam=createCamera();
  cam.setPosition(0,0,400);
  createDiv('<p>');
  createDiv('enter function for x (function must be in terms of u, v, and t)');
  inp=createInput(exprx);
  inp.input(myInputEvent)
  createDiv('');
  buttonPlot=createButton("set");
  buttonPlot.mousePressed(()=>{
    try{
      let u,v;
      let a=eval(expr1);
    }catch(error){
      alert("invalid input");
      return;
    }
    exprx=expr1
  });

  createDiv('enter function for y (function must be in terms of u, v, and t)');
  inp=createInput(expry);
  inp.input(myInputEvent)
  createDiv('');
  buttonPlot=createButton("set");
  buttonPlot.mousePressed(()=>{
    try{
      let u,v;
      let a=eval(expr1);
    }catch(error){
      alert("invalid input");
      return;
    }
    expry=expr1
  });

  createDiv('enter function for z (function must be in terms of u, v, and t)');
  inp=createInput(exprz);
  inp.input(myInputEvent)
  createDiv('');
  buttonPlot=createButton("set");
  buttonPlot.mousePressed(()=>{
    try{
      let u,v;
      let a=eval(expr1);
    }catch(error){
      alert("invalid input");
      return;
    }
    exprz=expr1
  });



  createDiv('enter bounds for u');
  inp1=createInput(exub);
  inp1.input(myInputEvent)
  createDiv('');
  buttonPlot=createButton("set");
  buttonPlot.mousePressed(()=>{
    try{
      let u,v;
      let a=eval(expr1);
      if (isNaN(a[0]+1)) throw error;
      if (isNaN(a[1]+1)) throw error;
      if (a[0]>a[1]) throw error;
    }catch(error){
      alert("invalid input");
      return;
    }
    exub=expr1
  });

  createDiv('enter bounds for v');
  inp2=createInput(exvb);
  inp2.input(myInputEvent)
  createDiv('');
  buttonPlot=createButton("set");
  buttonPlot.mousePressed(()=>{
    try{
      let u,v;
      let a=eval(expr1);
      if (isNaN(a[0]+1)) throw error;
      if (isNaN(a[1]+1)) throw error;
      if (a[0]>a[1]) throw error;
    }catch(error){
      alert("invalid input");
      return;
    }
    exvb=expr1
  });
}

function myInputEvent() {
  expr1=this.value();
}

let xa,ya;
let lightD=new vec3(1,-1,0).normalize();
function draw(){
  background(0);
  // rotateY(map(mouseX,0,width,-PI,PI));
  // rotateX(map(mouseY,0,width,PI/2,-PI/2));
  // if (rot){
  //   ev=new vec3(mouseX,mouseY,0);
  //   xa=new vec3(1,0,0).rotate(-map(mouseX*0-ev.x+sv.x,0,width,-PI,PI),new vec3(0,1,0)).conj(qb).v;
  //   ya=new vec3(0,1,0).conj(qb).v;
  //   q=qb.inv().mult(angleAxis(map(mouseX*0-ev.x+sv.x,0,width,-PI,PI),ya));
  //   q=q.mult(angleAxis(map(mouseY*0+ev.y-sv.y,0,height,PI/2,-PI/2),xa));
  //
  // }




  let qb=angleAxis(PI/2*0,new vec3(1,0,0));

  xa=new vec3(1,0,0).rotate(-map(mouseX,0,width,-PI,PI),new vec3(0,1,0)).conj(qb).v;
  ya=new vec3(0,1,0).conj(qb).v;
  q=qb.inv().mult(angleAxis(map(mouseX,0,width,-PI,PI),ya));
  q=q.mult(angleAxis(map(mouseY,0,height,PI/2,-PI/2),xa));





  // xa=new vec3(1,0,0);//.conj(q.inv()).v;
  // q=q.mult(angleAxis(map(mouseY,0,height,PI/2,-PI/2),xa));
  // ya=ya.conj(q.inv(q)).v;
  //let Q=angleAxis(map(mouseX,0,width,-PI,PI),ya).mult(angleAxis(map(mouseY,0,height,PI/2,-PI/2),xa));

  // q=angleAxis(map((2*(mouseX-width/2)**2+(mouseY-height/2)**2)**.5,0,height,PI,-PI),
  // new vec3((mouseY-height/2),-(mouseX-width/2),0));
  // q.getAxis().draw(new vec3(0,0,0));
  // (new vec3(-(mouseX-width/2),-(mouseY-height/2),0)).draw(new vec3(0,0,0));

  rotate(q.getAngle(),q.getAxis().toPV());
  // xa.draw(new vec3(0,0,0));
  // ya.draw(new vec3(0,0,0));

  t=millis()/1000;
  let samples=30;
  let ub=eval(exub);
  let vb=eval(exvb);
  let u0=ub[0],u1=ub[1],v0=vb[0],v1=vb[1];
  let du=(u1-u0)/samples;
  let dv=(v1-v0)/samples;
  let scale=100;
  fill(255,0,255);
  stroke(0);

  strokeWeight(1);
  colorMode(HSB);
  for (let u=u0;u<u1;u+=du){
    beginShape(TRIANGLE_STRIP);
    for (let v=v0;v<v1;v+=2*dv){
      // noStroke();
      // let s1=new vec3(x_(u,v),-y_(u,v),z_(u,v));
      // let s2=new vec3(x_(u+du,v),-y_(u+du,v),z_(u+du,v));
      // let s3=new vec3(x_(u,v+dv),-y_(u,v+dv),z_(u,v+dv));
      // let dsdu=s2.sub(s1).mult(1/du);
      // let dsdv=s3.sub(s1).mult(1/dv);
      // let n=dsdv.cross(dsdu).normalize();
      // let br=-255*n.dot(lightD);
      // if(br<30) br=30;
      let br=255;
      fill((2*255*abs(y_(u,v)))%255,255,br);
      vertex(scale*x_(u,v),-scale*y_(u,v),scale*z_(u,v));
      vertex(scale*x_(u+du,v),-scale*y_(u+du,v),scale*z_(u+du,v));
      vertex(scale*x_(u,v+dv),-scale*y_(u,v+dv),scale*z_(u,v+dv));
      vertex(scale*x_(u+du,v+dv),-scale*y_(u+du,v+dv),scale*z_(u+du,v+dv));
    }
    endShape();
  }
  colorMode(RGB);
  fill(255,0,255);
  stroke(255,0,255);
  strokeWeight(5);
  line(-10*scale,0,0, 10*scale,0,0);
  line(0,-10*scale,0, 0,10*scale,0);
  line(0,0,-10*scale, 0,0,10*scale);


}


function x_(u,v){
  let x=u,y=v;
  return eval(exprx);
}

function y_(u,v){
  let x=u,y=v;
  return eval(expry);
}

function z_(u,v){
  let x=u,y=v;
  return eval(exprz);
}

function mousePressed(){

  if (mouseX<width && mouseY<height){
    rot=true;
    // qb=q.copy();
    sv=new vec3(mouseX,mouseY,0);
    //sv=sv.conj(q).v;
  }
}

function mouseReleased(){

  if (mouseX<width && mouseY<height){
    rot=false;
    qb=q.inv().copy();
    // sv=tmp;
    // ev=new vec3(mouseX,mouseY,height);
    // q=q.mult(fromTo(sv,ev));
  }
}
