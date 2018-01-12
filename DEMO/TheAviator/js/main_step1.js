//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

// THREEJS RELATED VARIABLES
//定义一些基础元素
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

//SCREEN & MOUSE VARIABLES
//初始化一些位置
var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS
//初始化场景
function createScene() {
  //定义显示窗口大小
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  //显示角度
  fieldOfView = 60;
  //近面距离
  nearPlane = 1;
  //远面距离
  farPlane = 10000;
  //创造摄像头
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  //设置雾的效果，雾远点，雾近点
  scene.fog = new THREE.Fog(0xf7d9aa, 100,950);
  //设置摄像头的位置
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  //设置渲染器 包括透明度和抗锯齿
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  //设置大小
  renderer.setSize(WIDTH, HEIGHT);
  //设置开启阴影效果
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  //添加渲染器内容到节点
  container.appendChild(renderer.domElement);
  //对浏览器窗口大小添加事件监听
  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH /HEIGHT;
  //更新场景的渲染
  camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

//添加需要的光照
function createLights() {
  //增加半球光-天光（天空颜色，地面颜色，光强）
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  //增加平行光（光颜色，光强）
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  //设置平行光位置
  shadowLight.position.set(150, 350, 350);
  //开启阴影
  shadowLight.castShadow = true;

  //定义一个正方投影区间，不计算区间之外的阴影
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  //阴影贴图宽度，高度
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  //添加到场景中
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}


var AirPlane = function(){
  //创建一个3D元素
  this.mesh = new THREE.Object3D();
  //设置名字
  this.mesh.name = "airPlane";

  // Create the cabin
  //增加一个立方体，设置（长，宽，高，长截点，宽截点，高截点）
  var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
  //设置一个金属材质（红色，采用平面着色）
  var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  //设置造成阴影，接受阴影
	cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);

  // Create Engine
  //引擎
  var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  //设置模型位置
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
	this.mesh.add(engine);

  // Create Tailplane
  //尾翼
  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  //设置位置
  tailPlane.position.set(-35,25,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);

  // Create Wing
  //机翼
  var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0,0,0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

  // Propeller
  //螺旋桨
  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  // Blades
  //桨片
  var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
  var blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8,0,0);
  blade.castShadow = true;
  blade.receiveShadow = true;
  //添加桨片到螺旋桨上
	this.propeller.add(blade);
  this.propeller.position.set(50,0,0);
  this.mesh.add(this.propeller);
};

Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  //平均获得角度
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    //设置云团
    var c = new Cloud();
    this.clouds.push(c);
    //随机设置云团的位置和旋转角度
    var a = stepAngle*i;
    var h = 750 + Math.random()*200;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -400-Math.random()*400;
    c.mesh.rotation.z = a + Math.PI/2;
    //随机设置云图的缩放
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Sea = function(){
  //创建一个圆柱体
  var geom = new THREE.CylinderGeometry(600,600,800,40,10);
  //元素转动90度，使其水平
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  //设置材质
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.blue,
    //设置透明
    transparent:true,
    opacity:.6,
    shading:THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  //设置立方体
  var geom = new THREE.CubeGeometry(20,20,20);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,
  });
  //连着的方块数目
  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    //随机修改位置和旋转角度
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    //随机设置放大缩小的尺寸
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

// 3D Models
var sea;
var airplane;

function createPlane(){
  airplane = new AirPlane();
  //设置尺寸的缩放
  airplane.mesh.scale.set(.25,.25,.25);
  //设置他的位置
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}

function createSea(){
  sea = new Sea();
  sea.mesh.position.y = -600;
  scene.add(sea.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

function loop(){
  //更新飞机
  updatePlane();
  //设置海洋转动
  sea.mesh.rotation.z += .005;
  //设置天空转动
  sky.mesh.rotation.z += .01;
  //添加摄像机和场景
  renderer.render(scene, camera);
  //重复绘制
  requestAnimationFrame(loop);
}

//更新飞机
function updatePlane(){
  //设置鼠标位置修改对应的移动坐标
  var targetY = normalize(mousePos.y,-.75,.75,25, 175);
  var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
  airplane.mesh.position.y = targetY;
  airplane.mesh.position.x = targetX;
  //设置螺旋桨转动
  airplane.propeller.rotation.x += 0.3;
}

//设置鼠标位置修改对应的移动坐标
function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

//初始化函数
function init(event){
  //为鼠标移动增加事件监听
  document.addEventListener('mousemove', handleMouseMove, false);
  //增加场景
  createScene();
  //增加光照
  createLights();
  //增加飞机
  createPlane();
  //增加海洋
  createSea();
  //增加天空
  createSky();
  //设置显示效果
  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  //保证目标位置始终在一定区域中
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);
