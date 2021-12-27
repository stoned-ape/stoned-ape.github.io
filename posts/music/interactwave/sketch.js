let numPositions=6;
let baseTime=20;
let overtones=8;
let isPlaying=true;

var sn=[];
var cs=[]
var ampSin=[];
var freqSin=[];
for (let i=0;i<numPositions;i++){
  var sni=[];
  var asi=[];
  var fsi=[];
  var csi=[];
  for(let j=0;j<12;j++){
    
    var snj=[];//new Array(overtones);
    for (let k=0;k<overtones;k++) snj.push(new p5.Oscillator());
    var asj=new Array(overtones);
    var fsj=new Array(overtones);
    var csj=new Array(overtones);
    sni.push(snj);
    asi.push(asj);
    fsi.push(fsj);
    csi.push(csj);
  }
  sn.push(sni);
  cs.push(csi);
  ampSin.push(asi);
  freqSin.push(fsi);
}

let decayRate=0.997;
let aBase=27.5;



let I=0;let J=0;let K=0;


class Key{

  constructor(n,o,s,pl,ps){
    this.note=n;
    this.octave=o;
    this.sharp=s;
    this.pulse=pl;
    this.position=ps;
  }
  getFrequency(){
    let r=Math.pow(2.0,1.0/12.0);
    let n=-1;
    if (this.note=='a') n=0;
    if (this.note=='b') n=2;
    if (this.note=='c') n=3;
    if (this.note=='d') n=5;
    if (this.note=='e') n=7;
    if (this.note=='f') n=8;
    if (this.note=='g') n=10;
    let f=aBase*Math.pow(2,this.octave)*Math.pow(r,n+this.sharp);
    return f;
  }
}


class Measure{
  constructor(){
    this.keys=new Array(0);
  }
}



let blocks=[];

function setup(){
  createCanvas(500,300);
  background(255);
  var M=[];
  for (let i=0;i<7;i++){
    var Mi=[];
    for (let j=0;j<5;j++){
      var Mj=[];
      for (let k=0;k<2;k++){
        var Mk=[];
        for (let l=0;l<5;l++){
          var Ml=new Array(6);
          Mk.push(Ml);
        }
        Mj.push(Mk);
      }
      Mi.push(Mj);
    }
    M.push(Mi);
  }

  for (let i=0;i<7;i++){
    let c=' ';
    if (i==0) c='a';
    if (i==1) c='b';
    if (i==2) c='c';
    if (i==3) c='d';
    if (i==4) c='e';
    if (i==5) c='f';
    if (i==6) c='g';
    for (let j=0;j<5;j++){
      for (let k=0;k<2;k++){
        for (let l=0;l<5;l++){
          for (let m=0;m<6;m++){
            let x=new Key(c,j,k,l,m);
            M[i][j][k][l][m]=x;
          }
        }
      }
    }
  }


  
}

function sinSeries(k){
  if (k>1) return 0;
  return 1;
}

function squareSeries(k){
  if(k%2==0) return 0;
  return 1/k;
}

function triSeries(k){
  if(k%2==0) return 0;
  return (pow(-1,(k-1)/2)/pow(k,2)*8/pow(PI,2));
}

function sawSeries(k){
  return 1/k;
}

function draw(){
  
    


  // exponential decay

  for (let i=0;i<numPositions;i++){
    for (let j=0;j<12;j++){
      for (let k=0;k<overtones;k++){
        if (sn[i][j][k]!=null){
          ampSin[i][j][k]*=pow(decayRate,freqSin[i][j][k]/aBase);
          if(!isNaN(ampSin[i][j][k])) sn[i][j][k].amp(ampSin[i][j][k]);
          if (ampSin[i][j][k]<0.001) sn[i][j][k].stop();
        }
      }
    }
  }
  

//   //draw loop

  colorMode(HSB);
  background(0);
  noStroke();
  for (let i=0;i<numPositions;i++){
    for (let j=0;j<12;j++){
      for (let k=0;k<overtones;k++){
        if (sn[i][j][k]!=null){
          let x=(freqSin[i][j][k]-aBase)*0.5;
          let y=height*ampSin[i][j][k];
          fill(map(x,0,width,0,255+100),255,255);
          beginShape();
          vertex(int(x),height);
          vertex(int(x)+5,height);
          vertex(int(x)+5,height-y);
          vertex(int(x),height-y);
          endShape(CLOSE);
        }
      }
    }
  }
}




function play(char,oct,sharp){

  let f=(new Key(char,oct,sharp,1,0)).getFrequency();
  for (let k=1;k<overtones;k++){
    let amplitude=1.0;  //1.0/k;
    if (sn[0][0][k-1]!=null) sn[0][0][k-1].stop();
    sn[0][0][k-1]=new p5.Oscillator();
    sn[0][0][k-1].freq(k*f);
    sn[0][0][k-1].amp(amplitude);
    sn[0][0][k-1].start();
    ampSin[0][0][k-1]=amplitude;
    freqSin[0][0][k-1]=k*f;
  }
}


function keyPressed(){
  if (key=='q') play('c',2,0);
  if (key=='w') play('d',2,0);
  if (key=='e') play('e',2,0);
  if (key=='r') play('f',2,0);
  if (key=='t') play('g',2,0);

  if (key=='y') play('a',3,0);
  if (key=='u') play('b',3,0);
  if (key=='i') play('c',3,0);
  if (key=='o') play('d',3,0);
  if (key=='p') play('e',3,0);
  if (key=='z') play('f',3,0);
  if (key=='x') play('g',3,0);

  if (key=='c') play('a',4,0);
  if (key=='v') play('b',4,0);
  if (key=='b') play('c',4,0);
  if (key=='n') play('f',4,0);
  if (key=='m') play('g',4,0);

  if (key==',') play('a',5,0);
  if (key=='.') play('b',5,0);
  if (key=='/') play('c',5,0);

  if (key=='2') play('c',2,1);
  if (key=='3') play('d',2,1);
  if (key=='5') play('f',2,1);
  if (key=='6') play('g',2,1);

  if (key=='7') play('a',3,1);
  if (key=='9') play('c',3,1);
  if (key=='0') play('d',3,1);
  if (key=='s') play('f',3,1);
  if (key=='d') play('g',3,1);

  if (key=='f') play('a',4,1);
  if (key=='h') play('c',4,1);
  if (key=='j') play('d',4,1);
  if (key=='l') play('f',4,1);
  if (key==';') play('g',4,1);

}
