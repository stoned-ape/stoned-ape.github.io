//#version 100


precision mediump float;

//out vec4 gl_FragColor;

varying vec2 vTexCoord;



uniform vec2 iMouse;
uniform vec2 iResolution;
//uniform vec3 camP;
uniform vec2 thetaM;
uniform vec2 phiM;

uniform vec3 sp1;
uniform vec3 sp2;
uniform vec3 sp3;

uniform mat3 Mtx;






vec3 lightD=normalize(vec3(-1.,-2.,-0.));
float PI=3.14159265;
vec3 camP=vec3(0.,0.,500.);


mat3 getRotZ(float theta){
    return mat3(cos(theta),sin(theta),0.,
                -sin(theta), cos(theta),0.,
                0.,0.,1.);
}



mat3 getRotY(float theta){
    return mat3(cos(theta),0.,-sin(theta),
                0.,1.,0.,
                sin(theta),0., cos(theta));
}

mat3 getRotX(float theta){
    return mat3(1.,0.,0.,
                0.,cos(theta),sin(theta),
                0.,-sin(theta), cos(theta));
}



float min(float a,float b,float c){
    return min(min(a,b),c);
}
float min(float a,float b,float c,float d){
    return min(min(a,b,c),d);
}
float min(float a,float b,float c,float d,float e){
    return min(min(a,b,c,d),e);
}
float min(float a,float b,float c,float d,float e,float f){
    return min(min(a,b,c,d,e),f);
}



float sphereDE(vec3 p,vec3 c,float r){
    return distance(p,c)-r;
}

float planeDE(vec3 p,vec3 n, float D){
    return dot(p,n)-D;
}

float boxDE( vec3 p,vec3 c, vec3 b ){
  p+=c;
  p*=getRotX(PI/4.);
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float cylinderDE( vec3 p,vec3 c,float r ){
  vec3 a=vec3(r);
  p-=c;

  return length(p.xz-a.xy)-a.z;
}

float cappedCylinderDE( vec3 p,vec3 c, float h, float r ){
  p-=c;
  p=Mtx*p;
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float octahedronDE( vec3 p, float s){
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}

float DE(vec3 p){
    return min( sphereDE(p,sp1,25.),
                sphereDE(p,sp2,25.),
                sphereDE(p,sp3,25.),
                cappedCylinderDE(p,vec3(0.),15.,290./2.),
                planeDE(p,vec3(0.,1.,0.),-175.)
    			                        );

}

vec3 getNorm(vec3 p){
    float ds=.1;
    float DEp=DE(p);
    return normalize(vec3( (DE(p+vec3(ds,0.,0.))-DEp)/ds,
                           (DE(p+vec3(0.,ds,0.))-DEp)/ds,
                           (DE(p+vec3(0.,0.,ds))-DEp)/ds  ));
}


vec3 shade(vec3 c,vec3 p,vec3 v,vec3 n){
    vec3 N=normalize(n);
    vec3 L=-lightD;//normalize(lightP-p);
    vec3 R=reflect(L,N);
    return c*dot(N,L);//+vec3(1.)*pow(dot(-v,R),23.);
}



float map(float t,float a,float b,float c,float d){
    return c+(d-c)*(t-a)/(b-a);
}





bool raymarch(inout vec3 p,inout vec3 v,inout vec3 col){
    p+=v*DE(p);
    if (DE(p)<.02){
        col=normalize(vec3(1.,1.,1.))*2.;
        col=shade(col,p,v,getNorm(p));
        return true;
    }
	return false;
}















void main(){

    vec2 uv = vTexCoord;

    uv-=.5;
    uv*=2.;
    uv.y*=iResolution.y/iResolution.x;

    float theta=map(iMouse.x,0.,iResolution.x,-PI,PI);
    float phi=map(iMouse.y,0.,iResolution.y,-PI/2.,PI/2.);

    float fov=.25*PI;
    float hyp=1./sin(fov/2.);
    float sd=sqrt(hyp-1.);
    vec3 v=vec3(uv.x,uv.y,-sd);
    v=normalize(v);

    //v=getRotY(-theta)*getRotX(-phi)*v;
    //v=getRotY(PI/9.*0.)*getRotX(-PI/11.*0.)*v;

    vec3 p=vec3(camP.x,camP.y,camP.z);

    vec3 Col=vec3(.7,.8,1.)+
        vec3(1.)*pow(dot(-v,normalize(-lightD)),630.);

    //Col=vec3(0.);
    vec3 col=vec3(Col);
    vec3 scol=vec3(0.);

    int ref=0;
    const int imax=60;
    vec3 sv=-lightD;

    for (int i=0;i<imax;i++){
        if (raymarch(p,v,col)){
            vec3 sp=p+sv*.1;
            for (int j=0;j<imax;j++){
                if (raymarch(sp,sv,scol)){
                    col=vec3(0.);
                    break;
                }
            }
            break;
        }
        if (distance(camP,p)>20000.) break;
    }









    gl_FragColor = vec4(col,1.0);

}
