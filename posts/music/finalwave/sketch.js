let numPositions=6;
let baseTime=20;
let overtones=8;
let isPlaying=false;

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
    var snj=new Array(overtones);
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

let decayRate=0.999;
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
let wave=4;

function setup(){
  createCanvas(500,300);
  buttonSin=createButton("sin wave");
  buttonSin.mousePressed(()=>{
    wave=0;
  });
  buttonSquare=createButton("square wave");
  buttonSquare.mousePressed(()=>{
    wave=1;
  });
  buttonTri=createButton("triangle wave");
  buttonTri.mousePressed(()=>{
    wave=2;
  });
  buttonSaw=createButton("sawtooth wave");
  buttonSaw.mousePressed(()=>{
    wave=3;
  });
  buttonSyth=createButton("best wave");
  buttonSyth.mousePressed(()=>{
    wave=4;
  });
  buttonPP=createButton("play/pause");
  buttonPP.mousePressed(()=>{
    //pressed();
    touch()
  });
  
  
  
  
  
  
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


  var q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,q16,q17,q18,q19;
  var q20,q21,q22,q23,q24,q25,q26;

  q1=new Measure();
  q1.keys.push(M[4][3][0][1][4]);
  q1.keys.push(M[3][3][1][1][5]);

  q2=new Measure();
  q2.keys.push(M[4][3][0][2][0]);
  q2.keys.push(M[3][3][1][1][1]);
  q2.keys.push(M[4][3][0][1][2]);
  q2.keys.push(M[1][3][0][1][3]);
  q2.keys.push(M[3][3][0][1][4]);
  q2.keys.push(M[2][3][0][1][5]);

  q3=new Measure();
  q3.keys.push(M[0][3][0][2][0]);q3.keys.push(M[0][1][0][1][0]);
  q3.keys.push(M[4][1][0][1][1]);
  q3.keys.push(M[0][2][0][1][2]);
  q3.keys.push(M[2][2][0][1][3]);
  q3.keys.push(M[4][2][0][1][4]);
  q3.keys.push(M[0][3][0][1][5]);

  q4=new Measure();
  q4.keys.push(M[1][3][0][2][0]);q4.keys.push(M[4][0][0][1][0]);
  q4.keys.push(M[4][1][0][1][1]);
  q4.keys.push(M[6][1][1][1][2]);
  q4.keys.push(M[4][2][0][1][3]);
  q4.keys.push(M[6][2][1][1][4]);
  q4.keys.push(M[1][3][0][1][5]);

  q5=new Measure();
  q5.keys.push(M[2][3][0][2][0]);q5.keys.push(M[0][1][0][1][0]);
  q5.keys.push(M[4][1][0][1][1]);
  q5.keys.push(M[0][2][0][1][2]);
  q5.keys.push(M[4][2][0][1][3]);
  q5.keys.push(M[4][3][0][1][4]);
  q5.keys.push(M[3][3][1][1][5]);

  q6=q2;
  q7=q3;

  q8=new Measure();
  q8.keys.push(M[1][3][0][1][0]);q8.keys.push(M[4][0][0][1][0]);
  q8.keys.push(M[4][1][0][1][1]);
  q8.keys.push(M[6][1][1][1][2]);
  q8.keys.push(M[4][2][0][1][3]);
  q8.keys.push(M[2][3][0][1][4]);
  q8.keys.push(M[1][3][0][1][5]);

  q9=new Measure();
  q9.keys.push(M[0][3][0][2][0]);q9.keys.push(M[0][1][0][1][0]);
  q9.keys.push(M[4][1][0][1][1]);
  q9.keys.push(M[0][2][0][1][2]);

  q10=new Measure();
  q10.keys.push(M[0][3][0][2][0]);q10.keys.push(M[0][1][0][1][0]);
  q10.keys.push(M[4][1][0][1][1]);
  q10.keys.push(M[0][2][0][1][2]);
  q10.keys.push(M[1][3][0][1][3]);
  q10.keys.push(M[2][3][0][1][4]);
  q10.keys.push(M[3][3][0][1][5]);

  q11=new Measure();
  q11.keys.push(M[4][3][0][2][0]);q11.keys.push(M[2][1][0][1][0]);
  q11.keys.push(M[6][1][0][1][1]);
  q11.keys.push(M[2][2][0][1][2]);
  q11.keys.push(M[6][2][0][1][3]);
  q11.keys.push(M[5][3][0][1][4]);
  q11.keys.push(M[4][3][0][1][5]);

  q12=new Measure();
  q12.keys.push(M[3][3][0][2][0]);q12.keys.push(M[6][0][0][1][0]);
  q12.keys.push(M[6][1][0][1][1]);
  q12.keys.push(M[1][2][0][1][2]);
  q12.keys.push(M[5][2][0][1][3]);
  q12.keys.push(M[4][3][0][1][4]);
  q12.keys.push(M[3][3][0][1][5]);

  q13=new Measure();
  q13.keys.push(M[2][3][0][2][0]);q13.keys.push(M[0][1][0][1][0]);
  q13.keys.push(M[4][1][0][1][1]);
  q13.keys.push(M[0][2][0][1][2]);
  q13.keys.push(M[4][2][0][1][3]);
  q13.keys.push(M[3][3][0][1][4]);
  q13.keys.push(M[2][3][0][1][5]);

  q14=new Measure();
  q14.keys.push(M[1][3][0][2][0]);q14.keys.push(M[4][0][0][1][0]);
  q14.keys.push(M[4][1][0][1][1]);
  q14.keys.push(M[4][2][0][1][2]);
  q14.keys.push(M[4][2][0][1][3]);
  q14.keys.push(M[4][3][0][1][4]);
  q14.keys.push(M[4][2][0][1][5]);

  q15=new Measure();
  q15.keys.push(M[4][3][0][1][0]);
  q15.keys.push(M[4][3][0][1][1]);
  q15.keys.push(M[4][4][0][1][2]);
  q15.keys.push(M[3][3][1][1][3]);
  q15.keys.push(M[4][3][0][1][4]);
  q15.keys.push(M[3][3][1][1][5]);

  q16=new Measure();
  q16.keys.push(M[4][3][0][1][0]);
  q16.keys.push(M[3][3][1][1][1]);
  q16.keys.push(M[4][3][0][1][2]);
  q16.keys.push(M[3][3][1][1][3]);
  q16.keys.push(M[4][3][0][1][4]);
  q16.keys.push(M[3][3][0][1][5]);

  q17=q2;
  q18=q3;
  q19=q4;

  q20=new Measure();
  q20.keys.push(M[2][3][0][2][0]);q3.keys.push(M[0][1][0][1][0]);
  q20.keys.push(M[4][1][0][1][1]);
  q20.keys.push(M[0][2][0][1][2]);
  q20.keys.push(M[4][2][0][1][3]);
  q20.keys.push(M[4][3][0][1][4]);
  q20.keys.push(M[3][3][1][1][5]);

  q21=q2;
  q22=q3;

  q23=new Measure();
  q23.keys.push(M[1][3][0][2][0]);q4.keys.push(M[4][0][0][1][0]);
  q23.keys.push(M[4][1][0][1][1]);
  q23.keys.push(M[6][1][1][1][2]);
  q23.keys.push(M[4][2][0][1][3]);
  q23.keys.push(M[2][3][0][1][4]);
  q23.keys.push(M[1][3][0][1][5]);

  q24=q10;

  //blocks.addElement(q1);
  blocks.push(q1);
  blocks.push(q2);
  blocks.push(q3);
  blocks.push(q4);
  blocks.push(q5);
  blocks.push(q6);
  blocks.push(q7);
  blocks.push(q8);
  blocks.push(q9);
  //repeat
  blocks.push(q1);
  blocks.push(q2);
  blocks.push(q3);
  blocks.push(q4);
  blocks.push(q5);
  blocks.push(q6);
  blocks.push(q7);
  blocks.push(q8);
  blocks.push(q10);
  blocks.push(q11);
  blocks.push(q12);
  blocks.push(q13);
  blocks.push(q14);
  blocks.push(q15);
  blocks.push(q16);
  blocks.push(q17);
  blocks.push(q18);
  blocks.push(q19);
  blocks.push(q20);
  blocks.push(q21);
  blocks.push(q22);
  blocks.push(q23);
  blocks.push(q24);
  //repeat
  blocks.push(q11);
  blocks.push(q12);
  blocks.push(q13);
  blocks.push(q14);
  blocks.push(q15);
  blocks.push(q16);
  blocks.push(q17);
  blocks.push(q18);
  blocks.push(q19);
  blocks.push(q20);
  blocks.push(q21);
  blocks.push(q22);
  blocks.push(q23);
  blocks.push(q24);
  //repeat
}

function sinSeries(k){
  if (k>1) return 0;
  return 1;
}

function squareSeries(k){
  if(k%2==0) return 0;
  return 1/k;
}

function trISeries(k){
  if(k%2==0) return 0;
  return .5+.5*pow(-1,(k-1)/2 )/(k**2);
}

function sawSeries(k){
  return 1/k;
}

function series(k){
  if (wave==0) return sinSeries(k);
  if (wave==1) return squareSeries(k);
  if (wave==2) return trISeries(k);
  if (wave==3) return sawSeries(k);
  if (wave==4) return 1;
}

function draw(){
  if (!isPlaying) background(0);
    else{
    if (I>baseTime){
      // play loop
      for (let i=0;i<blocks[K].keys.length;i++){
        if (blocks[K].keys[i].position==J){
          let f=blocks[K].keys[i].getFrequency();
          for (let k=1;k<overtones;k++){
            let amplitude=series(k);  //1.0/k;
            if (sn[J][i][k-1]!=null) sn[J][i][k-1].stop();
            sn[J][i][k-1]=new p5.Oscillator();
            sn[J][i][k-1].freq(k*f);
            sn[J][i][k-1].amp(amplitude);
            sn[J][i][k-1].start();
            ampSin[J][i][k-1]=amplitude;
            freqSin[J][i][k-1]=k*f;
          }
        }
      }


      I=0;
      J++;
      if (J==numPositions){
        J=0;
        K++;

        if (K==blocks.length){
          K=0;
        }
      }
    }

    // exponential decay

    for (let i=0;i<numPositions;i++){
      for (let j=0;j<12;j++){
        for (let k=0;k<overtones;k++){
          if (sn[i][j][k]!=null){
            ampSin[i][j][k]*=pow(decayRate,freqSin[i][j][k]/aBase);
            sn[i][j][k].amp(ampSin[i][j][k]);
            if (ampSin[i][j][k]<0.001) sn[i][j][k].stop();
          }
        }
      }
    }
    I++;
  }
    //draw loop

  colorMode(HSB);
  background(0);
  noStroke();
  for (let i=0;i<numPositions;i++){
    for (let j=0;j<12;j++){
      for (let k=0;k<overtones;k++){
        if (sn[i][j][k]!=null){
          let x=(freqSin[i][j][k]-aBase)*0.5;
          let y=height*ampSin[i][j][k];
          fill(map(x,0,600,0,255+100),255,255);
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




function touch(){
  // if(mouseX>width || mouseY>height) return;
  if (isPlaying){
    noLoop();
    for (let i=0;i<numPositions;i++){
      for (let j=0;j<12;j++){
        for (let k=0;k<overtones;k++){
          if (sn[i][j][k]!=null){
            sn[i][j][k].stop();
          }
        }
      }
    }
    isPlaying=false;
    return false;
  }
  for (let i=0;i<numPositions;i++){
    for (let j=0;j<12;j++){
      for (let k=0;k<overtones;k++){
        if (sn[i][j][k]!=null){
          sn[i][j][k].start();
        }
      }
    }
  }
  loop();
  isPlaying=true;
  return false;
}
  
