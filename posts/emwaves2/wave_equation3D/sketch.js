let E=[],tmpE=[],dt=1,len=25,t=0;
let dx=1/len;c=dx/dt;
let dEdt=[],tmpdEdt=[],dy=dx,dz=dx;
let Et=[],B=[];
let zi=[],zj=[];
let paused=false;

function f(p){
  p.x-=.5;
  p.y-=.5;
  p.z-=.5;
  return new vec3(0,3000*exp(-50*p.mag()**2)*cos(t*.5),0);
}
function v3(x,y,z){
  return new vec3(x,y,z);
}

function setup(){
  createCanvas(400, 400,WEBGL);
  let pp=createButton('play/pause');
  pp.mousePressed(()=>paused=!paused);
  let rs=createButton('reset');
  rs.mousePressed(()=>gen());
  gen();
  
}

function gen(){
  E=[],tmpE=[],t=0;
  dEdt=[],tmpdEdt=[];
  for(let i=0;i<len;i++){
    let Ei=[];
    let dEdti=[];
    let tmpEi=[];
    let tmpdEdti=[];
    let Bi=[];
    for(let j=0;j<len;j++){
      let Ej=[];
      let dEdtj=[];
      let tmpEj=[];
      let tmpdEdtj=[];
      let Bj=[];
      for(let k=0;k<len;k++){
        Ej.push(f(v3(i/len,k/len,j/len)));
        dEdtj.push(v3(0,0,0));
        tmpdEdtj.push(v3(0,0,0));
        tmpEj.push(v3(0,0,0));
        Bj.push(v3(0,0,0));
      }
      Ei.push(Ej);
      dEdti.push(dEdtj);
      tmpEi.push(tmpEj);
      tmpdEdti.push(tmpdEdtj);
      Bi.push(Bj)
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
  scale(width/2,-height/2,width/2);

  noFill();
  stroke(255);
  box(1);
  translate(-1/2,-1/2,-1/2);
  fill(255);
  colorMode(HSB);


  for(let i=0;i<len;i++){
    for(let j=0;j<len;j++){
      for(let k=0;k<len;k++){

        let b=B[i][j][k];
        let e=E[i][j][k];
        noStroke();
        // stroke(E[i][j][k].mag()%255,255,255);
        fill((e.mag()+300)%355,255,255);
        // point(i/len,j/len,k/len);
        if(abs(e.y)>300 ){
          push();
          translate(i/len,j/len,k/len)
          box(dx);
          pop();
          // stroke(255);
          // B[i][j][k].draw(v3(i/len,j/len,k/len),.05);
        }
        // line(e.x,e.y,e.z,i/len,j/len,k/len);
        // B[i][j][k].draw(v3(i/len,k/len,j/len),.1);

        // E[i][j][k].draw(v3(i/len,k/len,j/len),1);
      }
    }
  }
  if(!paused){
    let noBound=false;
  
    if(1){
      for(let i=0;i<len;i++){
        for(let j=0;j<len;j++){
          for(let k=0;k<len;k++){
            if(i==0){
              tmpE[i][j][k]=E[i+1][j][k].mult(noBound);
              continue;
            }
            if(j==0){
              tmpE[i][j][k]=E[i][j+1][k].mult(noBound);
              continue;
            }
            if(k==0){
              tmpE[i][j][k]=E[i][j][k+1].mult(noBound);
              continue;
            }
            if(i==len-1){
              tmpE[i][j][k]=E[i-1][j][k].mult(noBound);
              continue;
            }
            if(j==len-1){
              tmpE[i][j][k]=E[i][j-1][k].mult(noBound);
              continue;
            }
            if(k==len-1){
              tmpE[i][j][k]=E[i][j][k-1].mult(noBound);
              continue;
            }

            let dEdx_1= (E[i][j][k].y-  E[i-1][j][k].y)/dx;
            let dEdx_2= (E[i+1][j][k].y-E[i][j][k].y  )/dx;
            let d2Edx2=(dEdx_2-dEdx_1)/dx;

            let dEdz_1= (E[i][j][k].y-  E[i][j-1][k].y)/dz;
            let dEdz_2= (E[i][j+1][k].y-E[i][j][k].y  )/dz;
            let d2Edz2=(dEdz_2-dEdz_1)/dz;

            let dEdy_1= (E[i][j][k].y-  E[i][j][k-1].y)/dy;
            let dEdy_2= (E[i][j][k+1].y-E[i][j][k].y  )/dy;
            let d2Edy2=(dEdy_2-dEdy_1)/dy;

            let laplacianE=d2Edx2+d2Edy2+d2Edz2;
            let v=c;
            // if(i<20) v=.5*c;
            let d2Edt2=(v**2)*laplacianE/3;

            tmpdEdt[i][j][k]=dEdt[i][j][k].add(v3(0,d2Edt2*dt,0));
            tmpE[i][j][k]=E[i][j][k].add(tmpdEdt[i][j][k].mult(dt));//.add(f(v3(i/len,k/len,j/len)));
          }
        }
      }
      for(let i=0;i<len;i++){
        for(let j=0;j<len;j++){
          for(let k=0;k<len;k++){
            E[i][j][k]=tmpE[i][j][k];//.mult(1);
            dEdt[i][j][k]=tmpdEdt[i][j][k];
            if(i<len-1 && j<len-1 && k<len-1) B[i][j][k]=B[i][j][k].add(v3(
               (E[i][j+1][k].y-E[i][j][k].y)/dz,
               0,
              -(E[i+1][j][k].y-E[i][j][k].y)/dx).mult(dt));
            // else B[i][j][k]=B[i][j][k].add(v3(
            //    (E[i][j][k].y-E[i][j-1][k].y)/dz,
            //    0,
            //   -(E[i][j][k].y-E[i-1][j][k].y)/dx).mult(dt));
            // if(i==20  && (j<16 || j>len-16 || (j>22 && j<28))){
            //   E[i][j]=0;
            //   dEdt[i][j]=0;
            // }
            // if(((i-len/2)**2+(j-len/2)**2+(k-len/2)**2)**.5>len/2-1){
            //   E[i][j][k]=v3(0,0,0);
            //   dEdt[i][j][k]=v3(0,0,0);
            // }
          }
        }
      }  
    }

    t+=dt;
  }
}





