let E=[],tmpE=[],dt=1,len=40,t=0;
let dx=1/len;c=dx/dt;
let dEdt=[],tmpdEdt=[],dy=dx;
let Et=[],B=[];
let zi=[],zj=[];
let rc=true,rr=false,dse=false,play=true;

function f(x,y){
  x-=.5;
  if(dse || rr) x-=.3;
  y-=.5;
  return .3*exp(-500*(x**2+y**2))*cos(t);
}

function setup(){
  let canvas=createCanvas(500, 400,WEBGL);

  canvas.parent(document.getElementsByClassName("p5div")[0])


  reset=createButton('reset');
  reset.parent(document.getElementsByClassName("p5buttons")[0])
  reset.mousePressed(()=>gen());
  rs=createButton('reflection');
  rs.parent(document.getElementsByClassName("p5buttons")[0])
  rs.mousePressed(()=>{
    rc=true,rr=false,dse=false;
    gen();
  });
  rfr=createButton('refraction');
  rfr.parent(document.getElementsByClassName("p5buttons")[0])
  rfr.mousePressed(()=>{
    rc=false,rr=true,dse=false;
    gen();
  });
  ds=createButton('double slit experiment');
  ds.parent(document.getElementsByClassName("p5buttons")[0])
  ds.mousePressed(()=>{
    rc=false,rr=false,dse=true;
    gen();
  });
  pl=createButton('play/pause');
  pl.parent(document.getElementsByClassName("p5buttons")[0])
  pl.mousePressed(()=>play=!play);

  gen();

}

function gen(){
  t=0;
  E=[],tmpE=[];
  dEdt=[],tmpdEdt=[];
  Et=[],B=[];
  for(let i=0;i<len;i++){
    let Ei=[];
    let dEdti=[];
    let tmpEi=[];
    let tmpdEdti=[];
    let Bi=[];
    for(let j=0;j<len;j++){
      Ei.push(f(i/len,j/len));
      dEdti.push(0);
      tmpdEdti.push(0);
      tmpEi.push(0);
      Bi.push(new vec3(0,0,0));
    }
    E.push(Ei);
    dEdt.push(dEdti);
    tmpE.push(tmpEi);
    tmpdEdt.push(tmpdEdti);
    B.push(Bi)
  }
}


function draw(){
  background(0);
  rotateX(map(mouseY,0,height,PI/2,-PI/2));
  rotateY(map(mouseX,0,width,-PI,PI));
  scale(height,-height,height);
  // stroke(255);
  translate(-1/2,0,-1/2);
  // fill(255);
  colorMode(HSB);
  for(let i=0;i<len-1;i++){
    beginShape(TRIANGLE_STRIP);
    for(let j=0;j<len-1;j++){
      fill(E[i][j]*3055,255,255*(E[i][j]!=0));
      vertex((i)/len,1*E[i][j],(j)/len);
      vertex((i+1)/len,1*E[i+1][j],(j)/len);
      vertex((i)/len,1*E[i][j+1],(j+1)/len);
      vertex((i+1)/len,1*E[i+1][j+1],(j+1)/len);
      // B[i][j].draw(new vec3(i/len,0,j/len));
    }
    endShape();
  }
  let noBound=!rc;

  if(play){
    for(let i=0;i<len;i++){
      for(let j=0;j<len;j++){
        if(i==0){
          tmpE[i][j]=E[i+1][j]*noBound;
          continue;
        }
        if(j==0){
          tmpE[i][j]=E[i][j+1]*noBound;
          continue;
        }
        if(i==len-1){
          tmpE[i][j]=E[i-1][j]*noBound;
          continue;
        }
        if(j==len-1){
          tmpE[i][j]=E[i][j-1]*noBound;
          continue;
        }

        let dEdx_1= (E[i][j]-  E[i-1][j])/dx;
        let dEdx_2= (E[i+1][j]-E[i][j]  )/dx;
        let d2Edx2=(dEdx_2-dEdx_1)/dx;

        let dEdy_1= (E[i][j]-  E[i][j-1])/dy;
        let dEdy_2= (E[i][j+1]-E[i][j]  )/dy;
        let d2Edy2=(dEdy_2-dEdy_1)/dy;

        let laplacianE=d2Edx2+d2Edy2;
        let v=c;
        if(i<20 && rr) v=.5*c;
        let d2Edt2=(v**2)*laplacianE/2;

        tmpdEdt[i][j]=dEdt[i][j]+d2Edt2*dt;
        tmpE[i][j]=E[i][j]+tmpdEdt[i][j]*dt+f(i/len,j/len)*(dse || rr);
      }
    }
    for(let i=0;i<len;i++){
      for(let j=0;j<len;j++){
        E[i][j]=tmpE[i][j];
        dEdt[i][j]=tmpdEdt[i][j];
        if(i<len-1 && j<len-1) B[i][j]=B[i][j].add(new vec3(
           (E[i][j+1]-E[i][j])/dy,
           0,
          -(E[i+1][j]-E[i][j])/dx).mult(dt));

        if(dse && i==20  && (j<16 || j>len-16 || (j>18 && j<len-18))){
          E[i][j]=0;
          dEdt[i][j]=0;
        }
        // if(((i-len/2)**2+(j-len/2)**2)**.5>len/2-1){
        //   E[i][j]=0;
        //   dEdt[i][j]=0;
        // }
      }
    }
  }

  t+=dt;
}
