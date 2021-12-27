let R=25;
let M=1;
let Vmag=5;
let Wmag=1;
let Box=150;
let balls=[];
let poles=[];
let ballnum=3;
let polenum=1;
let run=1;
let G=0;
let g=0;
let ctrl=false;

let ii=0;
function setup(){
  // createCapture(VIDEO);
  // frameRate(4);
  createCanvas(600,600,WEBGL);
  for (let i=0;i<ballnum;i++){
    let b=new Ball();
    balls.push(b);
  }
  for (let i=0;i<polenum;i++){
    let p=new Pole();
    poles.push(p);
  }
  poles[0].v=new vec3(0,0,0);
  poles[0].p=new vec3(0,0,0);
  poles[0].omega=0.001;
  poles[0].axis=new vec3(1,0,0).normalize();
  balls[0].p=new vec3(70,-70,0);
  balls[0].v=new vec3(-Vmag/1.0,0,0);

  // balls[0].p=new vec3(0,0,0);
  // balls[0].v=new vec3(0,0,0);
  // balls[0].m=4;
  // balls[1].p=new vec3(100,0,0);
  // balls[1].v=new vec3(-4*Vmag,0,0);
}


function draw(){
  if (run){
    background(255);
    if (ctrl){
      rotateY(map(mouseX,0,width,0,2*PI));
      rotateX(map(mouseY,0,height,0,PI));
    }
    noFill();
    box(2*Box);

    for (let i=0;i<ballnum;i++){
      balls[i].move();
      balls[i].bounds(false);
      balls[i].gravity();
      balls[i].draw();
      VBounds(balls[i]);
    }

    for (let i=0;i<polenum;i++){
      poles[i].move();
      poles[i].bounds(false);
      poles[i].gravity()
      poles[i].draw();
    }

    for (let i=0;i<ballnum;i++){
      for (let j=0;j<ballnum;j++){
        if (i<j) collideBalls(balls[i],balls[j],false);
      }
    }
    for (let i=0;i<ballnum;i++){
      for (let j=0;j<polenum;j++){
        collideBallPole(balls[i],poles[j],false);
      }
    }
    // for (let i=0;i<polenum;i++){
    //   for (let j=0;j<polenum;j++){
    //     if (i<j) collidePoles(poles[i],poles[j],false)
    //   }
    // }
    // console.log(momentumSum());
    ii++;
  }
}

function collideBallPole(B,P,bool){
  let p=P.p.sub(B.p);
  let v=P.orient;
  let a=v.dot(v);
  let b=2*v.dot(p);
  let c=p.dot(p)-pow(B.r+P.r,2);
  let D=b*b-4*a*c;
  if (D>0){
    let t1=(-b+sqrt(D))/(2*a);
    let t2=(-b-sqrt(D))/(2*a);
    let t;
    if (t1*t1<t2*t2) t=t1;
    else t=t2;
    t=(t1+t2)/2;
    if (abs(t)<P.h/2){
      let n=B.p.sub(P.p.add(v.mult(t))).normalize();
      if (!bool){
        let BV=copyVec(B.v);
        let PV=copyVec(P.v);
        let PA=copyVec(P.axis);
        let PO=copyVec(P.orient);
        let TV=P.getTanV();
        let PMI=P.getI();
        let omega=P.omega;
        console.log(" ");
        // console.log(KESum());
        if (BV.mag()!=0){

          let TV2=(TV.sub(proj(TV,n))).add(proj(B.v,n)).normalize();
          // let w=PO.cross(proj(B.v,n)).normalize();
          let w=PO.cross(TV2).normalize();

          let KE=.5*B.m*pow(proj(BV,n).mag(),2);
          let wmag=sqrt(2*KE/P.getI());

          B.v=B.v.sub(proj(BV,n));



          P.axis=w.normalize().mult(sign(t));
          P.omega+=wmag;



          if (PA.dot(P.axis)<0) P.angle*=-1;
          P.angle=0;
          P.orient0=copyVec(PO);
          // poles[0].orient0=copyVec(PO);
        }
        // console.log(P.orient0);

        if (omega!=0){
          // let cost=getCos(n,TV);
          let w=PA.mult(omega);
          let wPar=proj(w,n);
          let wPerp=w.sub(wPar);

          wPerp=PO.cross(w);

          let KE=.5*PMI*pow(wPerp.mag(),2);
          let vmag=sqrt(2*KE/B.m);

          P.omega-=wPerp.mag();

          // let KE=.5*P.getI()*pow(omega,2);
          // let vmag=sqrt(2*KE/B.m);
          //
          // P.omega-=omega;

          let vnorm=n;

          B.v=B.v.add(vnorm.mult(vmag));
        }
        console.log(KESum());


        // {
        //   BV=copyVec(B.v);
        //   PV=copyVec(P.v);
        //   n=B.p.sub(P.p).normalize();
        //   B.v=B.v.sub(proj(BV,n));
        //   B.v=B.v.add(proj(PV,n));
        //   n=n.mult(-1);
        //   P.v=P.v.sub(proj(PV,n));
        //   P.v=P.v.add(proj(BV,n));
        // }


      }else{
        B.p=B.p.add(n.normalize().mult(20));

      }
      collideBallPole(B,P,true);
    }
  }
}



function collideBalls(a,b,bool){
  if (distance(a.p,b.p)<a.r+b.r){
    let d=a.r+b.r-distance(a.p,b.p);
    let aV=copyVec(a.v);
    let n=a.p.sub(b.p).normalize().mult(1);
    if (!bool){
      a.v=a.v.sub(proj(a.v,n));
      a.v=a.v.add(proj(b.v,n).mult(b.m/a.m));
      n=n.mult(-1);
      b.v=b.v.sub(proj(b.v,n));
      b.v=b.v.add(proj(aV,n).mult(a.m/b.m));
    }else{
      b.p=b.p.sub(n);
      a.p=a.p.add(n);
    }
    collideBalls(a,b,true);
  }
}



function mousePressed(){
  run=1-run;
}

function keyPressed(){
  if(key=='f'){
    for (let i=0;i<ballnum;i++){
      balls[i].v=balls[i].v.mult(-1);
    }
    for (let i=0;i<polenum;i++){
      poles[i].v=poles[i].v.mult(-1);
      poles[i].omega*=-1;//poles[i].axis.mult(-1);
    }
  }
}

function gField(p){
  g=new vec3(0,0,0);
  for (let i=0;i<ballnum;i++){
    if (distance(balls[i].p,p)>2*M+10){
      g=g.add(balls[i].p.sub(p).mult(G*balls[i].m/pow(distance(balls[i].p,p),3)));
    }
  }
  return g;
}

function momentumSum(){
  let p=new vec3(0,0,0);
  for (let i=0;i<ballnum;i++){
    p=p.add(balls[i].v.mult(balls[i].m));
  }
  return p.mag();
}

function KESum(){
  let KE=0;
  for (let i=0;i<ballnum;i++){
    KE+=.5*balls[i].m*pow(balls[i].v.mag(),2);
  }
  for (let i=0;i<polenum;i++){
    KE+=.5*poles[i].getI()*pow(poles[i].omega,2);
    KE+=.5*poles[i].m*pow(poles[i].v.mag(),2);
  }
  return KE;
}

function sign(x){
  if (x>0) return 1;
  return -1;
}



function toPV(a){
  return new p5.Vector(a.x,a.y,a.z);
}

function VBounds(ball){
  if (ball.v.mag()>Box/10.0) ball.v=ball.v.normalize().mult(Box/10.0);
}
