let distmax=1000000
let minpath=[];
let mindist=distmax;
let nodes=[];
let d=[];

class vec2{
  constructor(x_,y_){
    this.x=x_;
    this.y=y_;
  }
}



function maze(p,len){
  if (nodes[p.y][p.x]==1) return;
  nodes[p.y][p.x]=1;
  let adj=[];
  if(p.x>0    ) adj.push(new vec2(p.x-2,p.y));
  if(p.x<len-2) adj.push(new vec2(p.x+2,p.y));
  if(p.y>0    ) adj.push(new vec2(p.x,p.y-2));
  if(p.y<len-2) adj.push(new vec2(p.x,p.y+2));
  adj=shuffle(adj);
  for (let i=0;i<adj.length;i++){
    if(nodes[adj[i].y][adj[i].x]==0){
      nodes[(p.y+adj[i].y)/2][(p.x+adj[i].x)/2]=1;
      maze(adj[i],len);
    }
  }
}



function distSort(adj,end){
  let s=[]
  xe=end%nodes.length;
  ye=floor(end/nodes.length);
  while(adj.length>0){
    let minsq=10000000;
    let minIdx=0;
    for (let i=0;i<adj.length;i++){
      x=adj[i]%nodes.length;
      y=floor(adj[i]/nodes.length);
      dist=pow(x-xe,2)+pow(y-ye,2);
      if(dist<minsq){
        minsq=dist;
        minIdx=i;
      }
    }
    s.push(adj[minIdx]);
    adj.splice(minIdx,1);
  }
  return s;
}

function findPath(d,path,start,end,dist=0){
  if (dist>=mindist) return;
  if (mindist<distmax) return;
  if (start==end){
    mindist=dist;
    minpath=path;
    return;
  }
  let x=start%nodes.length;
  let y=floor(start/nodes.length);
  let adj=[];
  if(x>0) adj.push(y*nodes.length+x-1);
  if(x<nodes.length-1) adj.push(y*nodes.length+x+1);
  if(y>0) adj.push((y-1)*nodes.length+x);
  if(y<nodes.length-1) adj.push((y+1)*nodes.length+x);
  adj=distSort(adj,end);
  for (let i=0;i<adj.length;i++){
    if (nodes[floor(adj[i]/nodes.length)][adj[i]%nodes.length]>0 && !path.includes(adj[i])){
      let newpath=path.slice();
      newpath.push(adj[i]);
      findPath(d,newpath,adj[i],end,dist+1);
    }
  }
}

function printPath(d,start,end){
  let path=[start];
  findPath(d,path,start,end);
}

function mousePressed(){
  let x=floor(mouseX*nodes.length/width);
  let y=floor(mouseY*nodes[0].length/height);
  nodes[y][x]=1-nodes[y][x];

  mindist=distmax;
  minpath=[];
  printPath(d,0,pow(nodes.length,2)-1);

}

function gen(){
  nodes=[];
  mindist=distmax;
  minpath=[];
  let len=51;
  for (let i=0;i<len;i++){
    let ni=[];
    for (let j=0;j<len;j++){
      if((i==0 || j==0) || (i==len-1 || j==len-1)) ni.push(0);
      else ni.push(0);
    }
    nodes.push(ni);
  }
  noStroke();

  let start=new vec2(0,0);

  maze(start,len);

  printPath(d,0,pow(nodes.length,2)-1);
}


function setup(){
  createCanvas(550,550);
  background(0);
  gen();
}

let timepath=[]
let I=0;
function draw(){
  for (let i=0;i<5;i++) timepath.push(minpath[I+i]);

  for (let i=0;i<nodes.length;i++){
    for (let j=0;j<nodes[0].length;j++){
      fill(nodes[i][j]*255);
      if (timepath.includes(i*nodes.length+j)) fill(255,0,255);
      rect(j*height/nodes[0].length,i*width/nodes.length,height/nodes[0].length,width/nodes.length);
    }
  }

  if (I+5>minpath.length){
    I=-5;
    timepath=[];
    gen();
  }

  I+=5;
  // noLoop();
}
