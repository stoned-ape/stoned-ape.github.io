let g=0.2;
let jmpGlobal=false;
let jmpV=-7;
let nl=false;
let score=0;
let epsilon=0.005;
let sizesGlobal=[6,1];
let population=450;
let birbs;
let b;
let pipes;
let net;
let generation=0;
let mxs=0;
let currentScore=0;
let cycle=400;
let pipeRatio=.4;

class Birb{
  constructor(w,h,sizes){
    this.x=w/6;
    this.y=h/2;
    this.v=0;
    this.w=w;
    this.h=h;
    this.size=40;
    this.jmp=false;
    this.score=0;
    this.alive=true;
    this.net=new Network(sizes);
  }
  draw(){
    fill(255,100,100);
    square(this.x,this.y,this.size);
  }
  gravity(){
    this.v+=g;
    this.y+=this.v;
  }
  jump(){
    if((this.jmp /*|| jmpGlobal*/) && this.v>0) this.v+=jmpV;
  }
  reset(){
    this.x=this.w/6;
    this.y=this.h/2;
    this.v=0;
  }
  bounds(){
    if (this.y<0) this.v=0;
    if (this.y>this.h){
      this.alive=false;
      let re=true;
      for (let i=0;i<population;i++){
        if (birbs[i].alive) re=false;
      }
      if (re) reset();
    }
  }
  closestPipeIdx(){
    if (pipes[0].x<pipes[1].x && pipes[0].x+pipes[0].width>this.x){
      return 0;
    }else{
      return 1;
    }
  }
  decide(){
    this.jmp=false;
    let idx=this.closestPipeIdx();
    let x=[];
    x.push(this.y/this.h);
    x.push(this.v/jmpV);
    x.push(pipes[idx].x/this.w);
    x.push(pipes[idx].height/this.h);
    x.push(pipes[1-idx].x/this.w);
    x.push(pipes[1-idx].height/this.h);
    let y=this.net.compute(x);
    if (y>.5) this.jmp=true;
  }
  addScore(){
    if (this.alive) this.score++;
  }
}

class Pipe{
  constructor(w,h,offset){
    this.gap=h/3;
    this.height=h*random(0,pipeRatio);
    this.width=w*0.1;
    this.x=w+offset;
    this.h=h;
    this.w=w;
    this.v=-3;
  }
  draw(){
    fill(50,255,50);
    rect(this.x,0,100,this.height);
    rect(this.x,this.h,100,-(this.h-this.height-this.gap));
  }
  move(){
    this.x+=this.v;
  }
  update(){
    this.height=this.h*random(0,pipeRatio);
    this.x=this.w;
  }
  collision(b){
    if (b.x+b.size>this.x && b.x<this.x+this.width+b.size
      && (b.y<this.height || b.y+b.size>this.height+this.gap)){
      b.alive=false;
      let re=true;
      for (let i=0;i<population;i++){
        if (birbs[i].alive) re=false;
      }
      if (re) reset();
    }
  }
}


class Network{
  constructor(sizes){
    this.id=random();
    this.sizes=[];
    for (let i=0;i<sizes.length;i++) this.sizes.push(sizes[i]);
    this.bias=[];
    for (let i=1;i<sizes.length;i++){
      let bi=[];
      for (let j=0;j<sizes[i];j++){
        bi.push(randomGaussian(0,1));
      }
      this.bias.push(bi);
    }
    this.weights=[];
    for (let i=0;i<sizes.length-1;i++){
      let wi=[];
      for (let j=0;j<sizes[i+1];j++){
        let wj=[];
        for (let k=0;k<sizes[i];k++){
          wj.push(randomGaussian(0,1));
        }
        wi.push(wj);
      }
      this.weights.push(wi);
    }
  }
  compute(x){
    let a=[];
    a.push(x);
    for (let i=1;i<this.sizes.length;i++){
      a.push(sigmoid(addV(multiplyVM(this.weights[i-1],a[i-1]),this.bias[i-1])))
    }
    return a[this.sizes.length-1];
  }
  mutate(ms){
    for (let i=1;i<this.sizes.length;i++){
      for (let j=0;j<this.sizes[i];j++){
        this.bias[i-1][j]+=randomGaussian(0,exp(-epsilon*ms));
      }
    }
    for (let i=0;i<this.sizes.length-1;i++){
      for (let j=0;j<this.sizes[i+1];j++){
        for (let k=0;k<this.sizes[i];k++){
          this.weights[i][j][k]+=randomGaussian(0,exp(-epsilon*ms));
        }
      }
    }
    if (randomGaussian(0,exp(-epsilon*ms))>.2) this.addLayer();
    if (randomGaussian(0,exp(-epsilon*ms))>.1) this.addNode();
  }
  copy(net){
    this.sizes=[];
    for (let i=0;i<net.sizes.length;i++) this.sizes.push(net.sizes[i]);
    this.bias=[];
    for (let i=1;i<net.sizes.length;i++){
      let bi=[];
      for (let j=0;j<net.sizes[i];j++){
        bi.push(net.bias[i-1][j]);
      }
      this.bias.push(bi);
    }
    this.weights=[];
    for (let i=0;i<net.sizes.length-1;i++){
      let wi=[];
      for (let j=0;j<net.sizes[i+1];j++){
        let wj=[];
        for (let k=0;k<net.sizes[i];k++){
          wj.push(net.weights[i][j][k]);
        }
        wi.push(wj);
      }
      this.weights.push(wi);
    }
  }
  addNode(){
    if (this.sizes.length==2) return;
    let layers=[]
    for (let i=1;i<this.sizes.length-1;i++) layers.push(i);
    let layer=layers[Math.floor(random()*layers.length)];
    this.bias[layer-1].push(randomGaussian(0,1));
    let w1=[];
    for (let i=0;i<this.sizes[layer-1];i++){
      w1.push(randomGaussian(0,1));
    }
    this.weights[layer-1].push(w1);
    for (let i=0;i<this.sizes[layer+1];i++){
      this.weights[layer][i].push(randomGaussian(0,1));
    }
    this.sizes[layer]++;
  }
  addLayer(){
    this.sizes.push(1);
    this.bias.push([0]);
    this.weights.push([[1]]);
  }
}









function setup(){
  createCanvas(600,600);
  pipes=[];
  p1=new Pipe(width,height,0);
  p2=new Pipe(width,height,1.1*width/2);
  pipes.push(p1);
  pipes.push(p2);

  birbs=[];
  for (let i=0;i<population;i++){
    let birb=new Birb(width,height,sizesGlobal);
    birbs.push(birb);
  }
  buttonPlot=createButton("speed up/slow down");
  buttonPlot.mousePressed(()=>{
    if (cycle==400) cycle=0;
    else if (cycle==0) cycle=400;
    
  });

}


function draw(){
  if (!nl){
    background(150,150,255);
    for (let k=0;k<=cycle;k++){
      pipes[0].move();
      pipes[1].move();
      if (pipes[0].x<-pipes[0].width) pipes[0].update();
      if (pipes[1].x<-pipes[1].width) pipes[1].update();
      for (let j=0;j<population;j++){
        if (!birbs[j].alive) continue;

        for (let i=0;i<pipes.length;i++){
          pipes[i].collision(birbs[j]);
        }
        currentScore=birbs[j].score;
        birbs[j].bounds();
        birbs[j].gravity();
        birbs[j].decide();
        birbs[j].jump();
        birbs[j].addScore();
        jmpGlobal=false;
      }
    }


    for (let j=0;j<population;j++){
      if (!birbs[j].alive) continue;
      birbs[j].draw();
    }
    pipes[0].draw();
    pipes[1].draw();

    fill(255);
    textSize(40);
    text(generation,5*width/7,height/7);
    text(mxs,5*width/7,2*height/7);
    text(currentScore,5*width/7,3*height/7);
  }


}

function keyPressed(){
  if (keyCode===ENTER) jmpGlobal=true;
}

function mousePressed(){
  if (mouseX>width || mouseY>height) return;
  // if (nl==true){
  //   nl=false;
  // }else{
  //   nl=true;
  // }
  if (cycle==400) cycle=0;
  else if (cycle==0) cycle=400;
}

function reset(){
  generation++;
  pipes=[];
  p1=new Pipe(width,height,0-width/2);
  p2=new Pipe(width,height,1.1*width/2-width/2);
  pipes.push(p1);
  pipes.push(p2);


  let maxScore=0;
  // let maxIdx=birbMax(birbs);
  for (let i=0;i<population;i++){
    if (birbs[i].score>maxScore){
      maxScore=birbs[i].score;
      // maxIdx=i;
    }
  }
  if (maxScore>mxs) mxs=maxScore;
  let birbsPrev=[];
  for (let i=0;i<population;i++){
    let birb=new Birb(width,height,birbs[i].net.sizes);
    birb.score=birbs[i].score;
    birb.net.copy(birbs[i].net);
    birbsPrev.push(birb);
  }
  birbsPrev=birbSort(birbsPrev);
  for (let i=0;i<population;i++){
    let rnd=randomGaussian(0,10);
    let idx=0;
    for (let j=1;j<population;j++){
      if (rnd>j-1) idx=j;
    }
    if (birbsPrev[i].net.id!=birbs[i].net.id){
      birbs[i].net.copy(birbsPrev[idx].net);
      birbs[i].net.mutate(maxScore);
    }

  }

  for (let i=0;i<population;i++){
    birbs[i].alive=true;
    birbs[i].v=0;
    birbs[i].y=width/2;
    birbs[i].score=0;
  }
  // console.log("generation");
  // console.log(generation);
  // console.log("maxScore");
  // console.log(mxs);

  currentScore=0;

  // b=new Birb(width,height);
}

function sigmoid(z){
  let u=[];
  for (let i=0;i<z.length;i++){
    u.push(1.0/(1.0+Math.exp(-z[i])));
  }
  return u;
}

function dot(a,b){
  if (a.length!=b.length){
    console.log("error 1");
    return NAN;
  }else{
    let d=0;
    for (let i=0;i<a.length;i++){
      d+=a[i]*b[i];
    }
    return d;
  }
}

function multiplyVM(m,v){
  u=[];
  for (let i=0;i<m.length;i++){
    u.push(dot(v,m[i]));
  }
  return u;
}

function addV(a,b){
  if (a.length!=b.length){
    console.log("error 2");
    return NAN;
  }else{
    let u=[];
    for (let i=0;i<a.length;i++){
      u.push(a[i]+b[i]);
    }
    return u;
  }
}

function birbMax(b){
  let max=0;
  let maxIdx=0;
  for (let i=0;i<b.length;i++){
    if (b[i].score>max){
      max=b[i].score;
      maxIdx=i;
    }
  }
  return maxIdx;
}

function birbSort(b){
  let bs=[];
  let bLen=b.length;
  for (let i=0;i<bLen;i++){
    let j=birbMax(b);
    bs.push(b[j]);
    b.splice(j,1);
  }
  return bs;
}
