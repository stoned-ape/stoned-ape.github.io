
// 'use strict'

class Network{
  constructor(sizes){
    // this.id=random();
    this.sizes=[];
    for (let i=0;i<sizes.length;i++) this.sizes.push(sizes[i]);
    this.bias=[];
    // for (let i=1;i<sizes.length;i++){
    //   let bi=[];
    //   for (let j=0;j<sizes[i];j++){
    //     bi.push(randomGaussian(0,1));
    //   }
    //   this.bias.push(bi);
    // }
    this.weights=[];
    // for (let i=0;i<sizes.length-1;i++){
    //   let wi=[];
    //   for (let j=0;j<sizes[i+1];j++){
    //     let wj=[];
    //     for (let k=0;k<sizes[i];k++){
    //       wj.push(randomGaussian(0,1));
    //     }
    //     wi.push(wj);
    //   }
    //   this.weights.push(wi);
    // }
  }
  compute(x){
    let a=[];
    a.push(x);
    for (let i=1;i<this.sizes.length;i++){
      a.push(sigmoid(addV(multiplyVM(this.weights[i-1],a[i-1]),this.bias[i-1])))
    }
    return a[this.sizes.length-1];
  }
  // mutate(ms){
  //   for (let i=1;i<this.sizes.length;i++){
  //     for (let j=0;j<this.sizes[i];j++){
  //       this.bias[i-1][j]+=randomGaussian(0,exp(-epsilon*ms));
  //     }
  //   }
  //   for (let i=0;i<this.sizes.length-1;i++){
  //     for (let j=0;j<this.sizes[i+1];j++){
  //       for (let k=0;k<this.sizes[i];k++){
  //         this.weights[i][j][k]+=randomGaussian(0,exp(-epsilon*ms));
  //       }
  //     }
  //   }
  //   if (randomGaussian(0,exp(-epsilon*ms))>.2) this.addLayer();
  //   if (randomGaussian(0,exp(-epsilon*ms))>.1) this.addNode();
  // }
  // copy(net){
  //   this.sizes=[];
  //   for (let i=0;i<net.sizes.length;i++) this.sizes.push(net.sizes[i]);
  //   this.bias=[];
  //   for (let i=1;i<net.sizes.length;i++){
  //     let bi=[];
  //     for (let j=0;j<net.sizes[i];j++){
  //       bi.push(net.bias[i-1][j]);
  //     }
  //     this.bias.push(bi);
  //   }
  //   this.weights=[];
  //   for (let i=0;i<net.sizes.length-1;i++){
  //     let wi=[];
  //     for (let j=0;j<net.sizes[i+1];j++){
  //       let wj=[];
  //       for (let k=0;k<net.sizes[i];k++){
  //         wj.push(net.weights[i][j][k]);
  //       }
  //       wi.push(wj);
  //     }
  //     this.weights.push(wi);
  //   }
  // }
  // addNode(){
  //   if (this.sizes.length==2) return;
  //   let layers=[]
  //   for (let i=1;i<this.sizes.length-1;i++) layers.push(i);
  //   let layer=layers[Math.floor(random()*layers.length)];
  //   this.bias[layer-1].push(randomGaussian(0,1));
  //   let w1=[];
  //   for (let i=0;i<this.sizes[layer-1];i++){
  //     w1.push(randomGaussian(0,1));
  //   }
  //   this.weights[layer-1].push(w1);
  //   for (let i=0;i<this.sizes[layer+1];i++){
  //     this.weights[layer][i].push(randomGaussian(0,1));
  //   }
  //   this.sizes[layer]++;
  // }
  // addLayer(){
  //   this.sizes.push(1);
  //   this.bias.push([0]);
  //   this.weights.push([[1]]);
  // }
}
let weights,biases,net,butt,buttc;
let sizes=[784,32,10];
let img=[];
let md=false;

function preload(){
  net=new Network(sizes);
  net.weights=eval(weights);
  net.bias=eval(biases);

  fetch('biases.txt')
  .then(response => response.text())
  .then(text => biases=text)
  .then(()=>net.bias=eval(biases));

  fetch('weights.txt')
  .then(response => response.text())
  .then(text => weights=text)
  .then(()=>net.weights=eval(weights));
}

let rnd;
let count=0;
let right=0;
let guess=0;
function setup(){
  rnd=floor(random(0,10));
  console.log(rnd);
  createCanvas(400,400);
  background(255,0,255);
  for (let i=0;i<28;i++){
    for (let j=0;j<28;j++){
      img.push(0);
    }
  }
  butt=createButton("compute");
  butt.mousePressed(()=>{
    let y=net.compute(img);
    let max=-1e10,idx=0;
    for (let i=0;i<y.length;i++){
      if (y[i]>max){
        idx=i;
        max=y[i];
      }
    }
    guess=idx;
    // console.log(y);
    // console.log(idx);
    // count++
    // if (idx=rnd){
    //   console.log("right");
    //   right++;
    //   console.log(right/count);
    //
    // }
    rnd=floor(random(0,10));
    console.log(rnd);
    // for (let i=0;i<28;i++){
    //   for (let j=0;j<28;j++){
    //     img[j*28+i]=0;
    //   }
    // }
  });
  buttc=createButton("clear");
  buttc.mousePressed(()=>{
    for (let i=0;i<28;i++){
      for (let j=0;j<28;j++){
        img[j*28+i]=0;
      }
    }
  });

  // createDiv("<p> <form oninput='result.value=parseInt(a.value)+parseInt(b.value)'>"+
  // "<input type='range' id='b' name='b' value='50' /> +"+
  // "<input type='number' id='a' name='a' value='10' /> ="+
  // "<output name='result' for='a b'>60</output></form>");
}

function mousePressed(){
  if (mouseX>width || mouseY>width) return;
  md=true;
}
function mouseReleased(){
  md=false;
}


function draw(){
  if(md){
    let x=mouseX*28/width; y=(mouseY)*28/width;
    let k=floor(mouseX*28/width),l=floor((mouseY)*28/width);
    let lm=.4;
    for (let i=-0;i<=1;i++){
      for (let j=-0;j<=1;j++){
        img[(l+j)*28+k+i]=1-random(lm+.01*(((l+j-y)**2+(k+i-x)**2)**2));
      }
    }
  }
  for (let i=0;i<28;i++){
    for (let j=0;j<28;j++){
      fill(img[j*28+i]*255);
      square(i*width/28,j*width/28,width/28);
    }
  }
  textSize(22);
  fill(255,0,255);
  text('guess: '+guess, 10, 30);
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
  let u=[];
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
