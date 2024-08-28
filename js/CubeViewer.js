import * as THREE from 'three'; 
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LUTPass } from 'three/addons/postprocessing/LUTPass.js';
import { LUTCubeLoader } from 'three/addons/loaders/LUTCubeLoader.js';
import { LUT3dlLoader } from 'three/addons/loaders/LUT3dlLoader.js';
import { LUTImageLoader } from 'three/addons/loaders/LUTImageLoader.js';
//
import { cubeBank } from 'scripts/Database.js';









export class CubeViewer {
    constructor() {}
  
    init() {
      console.log('Rendering with cubeBank:', cubeBank);  // Log the cubeBank used for rendering
    //   this.renderCubes();  // Render cubes based on the updated cubeBank
      animate();
    }
  
  
//     renderCubes() {
//         // Clear any previous cubes before rendering new ones
//         cubeGroup.clear();

//         // Loop over the cubeBank entries and render the cubes
//         let dataCubes = Object.entries(cubeBank);



//         console.log("Loggin data cubes", dataCubes)
//         for(let i=0;i<dataCubes.length;i++){
        
//             let div = document.createElement('div');
//             div.classList.add("cube-icon");
//             div.setAttribute("id", "icon_" + dataCubes[i][0]);
        
//             let img = document.createElement('img');
//             img.src = "../assets/img/cube_thumbnails/icon_" + dataCubes[i][0] + ".png";
//             div.appendChild(img);
        
//             document.getElementById('inventory-holder_content').appendChild( div );
//             div.addEventListener("click", (event) => {
//                 if (event.target.classList.contains('off')) {
//                     div.classList.remove("off");
//                     div.classList.add("loading");
//                     removeModel(dataCubes[i], div);
//                 }else{
//                     div.classList.add("loading");
//                     loadModel(dataCubes[i], div);
//                 }
                
                
//             });
//     }
// }
  }


// TOOLS



const pointer = new THREE.Vector2();
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
raycaster.layers.set(1);

// LOADERS
const manager = new THREE.LoadingManager();
const loaderDraco = new DRACOLoader(manager).setDecoderPath( './assets/js/three/jsm/libs/draco/' );
const loaderGLTF = new GLTFLoader(manager).setDRACOLoader( loaderDraco );
const loaderRGBE = new RGBELoader(manager).setPath( './assets/js/three/textures/equirectangular/' );

// DATA
const mixers = [];
const cubeGroup = new THREE.Group();
var envMap;

// raycasting
var INTERSECT = null;
var SELECTED = null;
var selectedDATA = null;

// 
const posSlots = [
    [-1, 1, -1],
    [1, 1, -1],
    [-3, 1, -1],
    [-1, 3, -1],
    [1, 3, -1],
    [-3, 3, -1],
    [-1, 5, -1],
    [1, 5, -1],
];

const lutParams = {
    enabled: true,
    lut: 'Presetpro-Cinematic.3dl',
    intensity: 1
};
const lutMap = {
    'Presetpro-Cinematic.3dl': null
};

const container = document.getElementById("threeD-container");
const winDim = container.getBoundingClientRect();


// camera
const camera = new THREE.PerspectiveCamera( 40, winDim.width / winDim.height, 0.01, 100 );
camera.layers.enable(1);
camera.position.set(-1,3,10);

// scene
const scene = new THREE.Scene();

// Last setup code here 
// scene.background = new THREE.Color( 0xe0e0e0 );

// envMap
const envTex = 'royal_esplanade_1k.hdr';
loaderRGBE.load( envTex, function ( texture ) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
    scene.environment = texture;
    envMap = texture;
});

// lutmaps
Object.keys( lutMap ).forEach( name => {
    if ( /\.CUBE$/i.test( name ) ) {
        new LUTCubeLoader()
            .load( '../assets/js/three/luts/' + name, function ( result ) {
                lutMap[ name ] = result;
            } );
    } else if ( /\LUT$/i.test( name ) ) {
        new LUTImageLoader()
            .load( `../assets/js/three/luts/${name}.png`, function ( result ) {
                lutMap[ name ] = result;
            } );
    } else {
        new LUT3dlLoader()
            .load( '../assets/js/three/luts/' + name, function ( result ) {
                lutMap[ name ] = result;
            } );
    }
} );

//renderer
// const renderer = new WebGPURenderer( { antialias: true } );
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( winDim.width, winDim.height );
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild( renderer.domElement );

//composer
const composer = new EffectComposer( renderer );
composer.setPixelRatio( window.devicePixelRatio );
composer.setSize( winDim.width, winDim.height );
composer.addPass( new RenderPass( scene, camera ) );
composer.addPass( new OutputPass() );

const lutPass = new LUTPass();
composer.addPass( lutPass );

//lights
const lightAmbient = new THREE.AmbientLight( 0xf1d67e, 0.3 );
scene.add(lightAmbient);

const lightDir = new THREE.DirectionalLight( 0xffffff, 2.5 );
lightDir.color.setHSL( 0.1, 1, 0.95 );
lightDir.position.set( 0, 0.5, 1 );
lightDir.position.multiplyScalar( 30 );
scene.add( lightDir );

// models
// const grid = new THREE.GridHelper( 200, 100, 0x000000, 0x000000 );
// grid.material.opacity = 0.2;
// grid.material.transparent = true;
// scene.add( grid );

// cursor
const cursorMesh = new THREE.Mesh( new THREE.BoxGeometry( 2.01, 2.01, 2.01 ), new THREE.MeshBasicMaterial( { color: new THREE.Color( new THREE.Color("rgb(255, 100, 100)") ), transparent: true, opacity: 0.75 }) ); 
cursorMesh.position.set(-1, 1, -1);
cursorMesh.visible = false;
scene.add(cursorMesh);

// cubegroup
scene.add(cubeGroup);

//controls
const controls = new OrbitControls( camera, renderer.domElement );
// controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enabled = true;

controls.target = new THREE.Vector3( -1, 1, -1 );

//stats
// const stats = new Stats();
// stats.dom.classList.add("stats_bl");
// container.appendChild( stats.dom );

//events
window.addEventListener("resize", onWindowResize, false);
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);




// CUBES
let dataCubes = Object.entries(cubeBank);
// Function to extract the number from filenames like "3 Ruby (#3) thumbnail"
for (let i = 0; i < dataCubes.length; i++) {
    let div = document.createElement('div');
    div.classList.add("cube-icon");
    div.setAttribute("id",  + dataCubes[i][0]);

    let img = document.createElement('img');

    // Encode the filename to handle special characters like spaces and parentheses
    const encodedFileName = encodeURIComponent(dataCubes[i][0]);

    // Set the image source with the encoded filename
    img.src = `../assets/img/cube_thumbnails/${encodedFileName}.png`;

    div.appendChild(img);

    console.log("Logging image source:", img.src);
    document.getElementById('inventory-holder_content').appendChild(div);

    div.addEventListener("click", (event) => {
        if (event.target.classList.contains('off')) {
            div.classList.remove("off");
            div.classList.add("loading");
            removeModel(dataCubes[i], div);
        } else {
            div.classList.add("loading");
            loadModel(dataCubes[i], div);
        }
    });

}
document.getElementById('inventory-holder_exit-btn').addEventListener("click", (event) => {
    document.getElementById( 'inventory-holder' ).style.display = 'none';
    document.getElementById( 'inventory-holder_thumb' ).style.display = 'block';
});
document.getElementById('inventory-holder_thumb').addEventListener("click", (event) => {
    document.getElementById( 'inventory-holder' ).style.display = 'block';
    document.getElementById( 'inventory-holder_thumb' ).style.display = 'none';
});

// 
// animate();
//


//LOADING
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    // console.log('start');
    document.getElementById('inventory-holder_content').classList.add("loading");
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

};

manager.onLoad = function ( ) {
    // console.log('end');
    document.getElementById('inventory-holder_content').classList.remove("loading");
};

manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};


function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();
    if(mixers.length > 0){
        for(let i=0;i<mixers.length;i++){
            mixers[i].update( delta );
        }
    }
    
    // stats.update();
    controls.update();

    render();

}



  

function render() {

    lutPass.enabled = lutParams.enabled;
    lutPass.intensity = lutParams.intensity;
    if ( lutMap[ lutParams.lut ] ) {
        const lut = lutMap[ lutParams.lut ];
        lutPass.lut = lut.texture3D;
    }

    composer.render();
    // renderer.render(scene, camera);

    raycaster.setFromCamera( pointer, camera );
    calcRaycast(); 

}

// RAYCAST
function calcRaycast(){


    const intersects = raycaster.intersectObjects( scene.children );   


    let int = null;
    if( intersects.length > 0 ){
        int = intersects[0].object;
    }

    if( int != INTERSECT){
        if(!SELECTED){
            (int) ? container.style.cursor = "grab" : container.style.cursor = "default";
        }
        INTERSECT = int;
    }

}


// EVENTS
function onWindowResize(){

    const winDim = container.getBoundingClientRect();

    camera.aspect = winDim.width / winDim.height;
    camera.updateProjectionMatrix();

    renderer.setSize( winDim.width, winDim.height );

};


function onMouseDown( event ) {

    if(SELECTED){
        console.log("LOGIGN THE SELECTED", SELECTED)
        controls.enabled = false;
        controls.enabled = false;
    }else if(INTERSECT){
        setSelected();
    }
    
}



function onMouseMove( event ) {

	pointer.x = clamp(( (event.clientX-winDim.x) / winDim.width ) * 2 - 1, -1, 1);
	pointer.y = clamp(-( (event.clientY-winDim.y) / winDim.height ) * 2 + 1, -1, 1);


    //Assigned when you click on object 
    if(SELECTED){
        moveSelected();
    }

}

function onMouseUp( event ){

    controls.enabled = true;

    if(SELECTED){
        executeSelected();
    }else{
        resetCursor();
        resetSelection();
    }
    
}


// INTERFACE FUNCTIONS
function setSelected(){

    // CURSOR
    container.style.cursor = "grabbing";

    console.log("LOGGING INTERSECt", INTERSECT)

    // DATA
    SELECTED = INTERSECT;

    
    selectedDATA = {
        pointerLoc: new THREE.Vector2(pointer.x, pointer.y),
        objLoc: new THREE.Vector3(SELECTED.parent.position.x,SELECTED.parent.position.y,SELECTED.parent.position.z)
    }

    // SELECTED
    SELECTED.layers.disable(1);

    // CURSOR MESH
    //This Snaps to have cursor mesh to selected cube
    cursorMesh.position.set(SELECTED.parent.position.x, SELECTED.parent.position.y, SELECTED.parent.position.z);
    cursorMesh.visible = true;

}

function moveSelected(){


    console.log("IS tihe function being executed in move selected ")

    let box = computeBoundingBox(cubeGroup);
    let boxY = Math.floor(box.max.y) + 1;

    let deltaX = pointer.x - selectedDATA.pointerLoc.x;
    let deltaY = pointer.y - selectedDATA.pointerLoc.y;

    let dragDamp = 2.5;

    let destX = selectedDATA.objLoc.x + (deltaX * (winDim.width/(100*dragDamp)) );
    let destY = selectedDATA.objLoc.y + (deltaY * (winDim.height/(100*dragDamp)) );

    cursorMesh.position.x = destX;
    cursorMesh.position.y = destY;

    //This causes SNAP
    //This is 
    cursorMesh.position.divideScalar( 2 ).floor().multiplyScalar( 2 ).addScalar( 1 ).clamp(new THREE.Vector3(-3,1,-1), new THREE.Vector3(1,boxY,-1));

}

function executeSelected(){

    if(selectedDATA.objLoc.x == cursorMesh.position.x && selectedDATA.objLoc.y == cursorMesh.position.y && selectedDATA.objLoc.z == cursorMesh.position.z){
        // console.log('same location');
        resetCursor();
        resetSelection();
    }else if(selectedDATA.objLoc.x != cursorMesh.position.x || selectedDATA.objLoc.y != cursorMesh.position.y || selectedDATA.objLoc.z == cursorMesh.position.z){
        // console.log('different location');
        moveCubes();
    }else{
        console.log('error');
    }

}


//Move cube handles the swapping 

function moveCubes(){

    console.log("IS tihe function being executed in move cube ")

    let aniLength = 1;
    let aniDone = 0;

    // CALC CUBES ON CURSOR LOCATION
    let matches = [];
    for(let i=0;i<cubeGroup.children.length;i++){
        let child = cubeGroup.children[i];
        if(child.id != SELECTED.id){
            if(child.position.x == cursorMesh.position.x && child.position.y == cursorMesh.position.y && child.position.z == cursorMesh.position.z){
                matches.push(child);
            }
        }
    }

    // INIT SWAP (OVERLAP CUBES)
    if(matches.length == 0){
        // console.log('no swap');
    }else if(matches.length == 1){
        // console.log('swap');
        aniLength++;
        moveCube(matches[0].position, selectedDATA.objLoc);
    }else if(matches.length > 1){
        console.log('error - multiple children on 1 coordinate');
    }else{
        console.log('error - unknown');
    }

    // INIT MOVE SELECTED CUBE
    moveCube(SELECTED.parent.position, cursorMesh.position);


    // SWAP FUNCTION
    function moveCube(objPos, targetPos){


            console.log(
              `Moving from (${objPos.x}, ${objPos.y}, ${objPos.z}) to (${targetPos.x}, ${targetPos.y}, ${targetPos.z})`
            );
        // let distance = objPos.distanceTo(targetPos);

        // ANIMATION
        gsap.to(objPos, { 
            x: targetPos.x, 
            y: targetPos.y, 
            z: targetPos.z,
            duration: 0.25,
            ease: "power4.inOut",
            onComplete() {
                aniDone++;
                if(aniDone == aniLength){
                    resetSelection();
                    updateControls();
                }
            }
        });
    }

    // RESET CURSOR
    resetCursor();

}


function resetCursor(){

    // CURSOR MESH
    cursorMesh.visible = false;

    // CURSOR
    container.style.cursor = "default";

}


// RESET
function resetSelection(){

    // SELECTED LAYER
    if(SELECTED) SELECTED.layers.enable(1);

    // VARS
    SELECTED = null;
    selectedDATA = null;

}



//OBJECTS
function loadModel(cubeData, div){
    
    //nodes
    let cube = cubeData[1];
    let slot = posSlots[cubeGroup.children.length];

    // group
    let group = new THREE.Group();
    group.name = "cube-" + cubeData[0];

    //positioning
    group.position.x = slot[0];
    group.position.y = slot[1];
    group.position.z = slot[2];

    // collider 
    let scl = 2;   
    let geometry = new THREE.BoxGeometry( scl,scl,scl ); 
    let material = new THREE.MeshBasicMaterial( { color: new THREE.Color( getRandomColor() ), transparent: true, opacity: 0.75, visible: false }); 
    let collider = new THREE.Mesh( geometry, material ); 
    collider.layers.set(1);
    collider.name = "collider-" + cubeData[0];
    collider.userdata = {"type": "cube"};
    group.add( collider );

    //load cube
    loadCube(group, cube, div);

}

function loadCube(group, cube, div){

    loaderGLTF.load( '../assets/models/misc/' + cube.file, function ( gltf ) {
        let model = gltf.scene;

        model.rotation.set(0,-Math.PI/2,0);
        model.position.set(0,-1,-0.1);

        // MODEL
        model.traverse( function ( child ) {
            if ( child.isMesh ){
                child.material.envMap = envMap;
                child.material.envMapIntensity = 1.0;
            }
        } );

        // animation
        if(cube.animation && gltf.animations.length > 0){
            let mixer = new THREE.AnimationMixer( model );
            gltf.animations.forEach( clip => {
                const action = mixer.clipAction(clip);
                action.play();
            });
            mixers.push(mixer);
        }

        // ADD
        group.add(model);
        cubeGroup.add(group);

        //
        updateControls();

        //
        div.classList.remove("loading");
        div.classList.add("off");

    });

}

function removeModel(cubeData, div){

    let cube = cubeGroup.getObjectByName("cube-" + cubeData[0]);
    cubeGroup.remove( cube );

    //
    div.classList.remove("loading");

}


function updateControls(){

    let time = 0.5;

    let box = computeBoundingBox(cubeGroup);
    let boxX = Math.floor(box.max.x-box.min.x)/2;
    let boxY = Math.floor(box.max.y)/2;
    // console.log(boxX, boxY);

    let posCam = new THREE.Vector3(-1,3,10);
    posCam.z = 6 + boxY + boxX;

    let posControls = new THREE.Vector3().copy(controls.target);
    posControls.y = boxY;

    gsap.to(camera.position, { z: posCam.z, duration: time });
    gsap.to(controls.target, { y: posControls.y, duration: time });

}

function computeBoundingBox( group ){
    let aabb = new THREE.Box3();
    aabb.setFromObject( group );
    return aabb;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function clamp(num, min, max) {
    return num <= min 
        ? min 
        : num >= max 
        ? max 
        : num
}

