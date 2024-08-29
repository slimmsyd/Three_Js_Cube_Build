import * as THREE from "three";
import { pass, mrt, output, emissive, uniform } from "three/tsl";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
//
import { cubeBank } from "scripts/Database.js";

//
window.mobileCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
const isMobile = window.mobileCheck();

// CLASS
export class CubeViewer {
  constructor() {
    //   this.renderCubes();  // Render cubes based on the updated cubeBank
  }
  init() {
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

// CONTAINER
const container = document.getElementById("threeD-container");
const winDim = container.getBoundingClientRect();

// TOOLS
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
raycaster.layers.set(1);

// LOADERS
const manager = new THREE.LoadingManager();
const loaderTex = new THREE.TextureLoader(manager);
const loaderTexture = new THREE.TextureLoader();
const loaderDraco = new DRACOLoader(manager).setDecoderPath(
  "./assets/js/three/jsm/libs/draco/"
);
const loaderGLTF = new GLTFLoader(manager).setDRACOLoader(loaderDraco);
const loaderRGBE = new RGBELoader(manager).setPath(
  "./assets/textures/env/hdri/"
);

// DATA
const mixers = [];
var envMap;

// raycasting
var INTERSECT = null;
var SELECTED = null;
var selectedDATA = null;
var HOVERED = null;

// MOUSE
var mouseDown = false;

//
const gridSize = 30;
const dataGrid = new Array(gridSize).fill(0);
// console.log(dataGrid);

// camera
const camera = new THREE.PerspectiveCamera(
  40,
  winDim.width / winDim.height,
  0.01,
  100
);
camera.layers.enable(1);
camera.position.set(-1, 3, 10);

// scene
const scene = new THREE.Scene();

// scene background
let tex = loaderTex.load("./assets/img/ui_edit/Background2x.png");
tex.minFilter = THREE.NearestFilter;
tex.magFilter = THREE.NearestFilter;
tex.colorSpace = THREE.SRGBColorSpace;
scene.background = tex;

// envMap
const envTex = "creature_hdri.hdr";
loaderRGBE.load(envTex, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = texture;
  // scene.environment = texture;
  envMap = texture;
});

//renderer
const renderer = new THREE.WebGPURenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(winDim.width, winDim.height);
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// POSTPROCESSING
const scenePass = pass(scene, camera);
scenePass.setMRT(
  mrt({
    output,
    emissive,
  })
);

// PASES
const outputPass = scenePass.getTextureNode();
const emissivePass = scenePass.getTextureNode("emissive");
const bloomPass = emissivePass.bloom(2.5, 0.5);

// COMPILE
const postProcessing = new THREE.PostProcessing(renderer);
postProcessing.outputColorTransform = false;
postProcessing.outputNode = outputPass.add(bloomPass).renderOutput();

//lights
const lightAmbient = new THREE.AmbientLight(0xf1d67e, 0.3);
scene.add(lightAmbient);

const lightDir = new THREE.DirectionalLight(0xffffff, 2.5);
lightDir.color.setHSL(0.1, 1, 0.95);
lightDir.position.set(0, 0.5, 1);
lightDir.position.multiplyScalar(30);
scene.add(lightDir);

// COLLIDERS
const colliderData = await gltfAsync(
  "../assets/models/collider/collider_3.glb"
);

// COLLIDER MESH
const colliderMesh = colliderData.scene.children[0];
colliderMesh.rotation.set(0, -Math.PI / 2, 0);
colliderMesh.scale.set(1, 1, 1).multiplyScalar(1);

// CURSOR MESH
const cursorMesh = colliderMesh.clone();
cursorMesh.position.set(-1, 1, 0);
const cursorMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(new THREE.Color("rgb(255, 100, 100)")),
  transparent: true,
  opacity: 0.75,
});
cursorMesh.material = cursorMaterial;
cursorMesh.visible = false;
scene.add(cursorMesh);

// CUBEGROUP
const cubeGroup = new THREE.Group();
scene.add(cubeGroup);

// CUBES
let dataCubes = Object.entries(cubeBank);
for (let i = 0; i < dataCubes.length; i++) {
  let div = document.createElement("div");
  div.classList.add("cube-icon");
  div.setAttribute("id", "icon_" + dataCubes[i][0]);

  let img = document.createElement("img");
  img.src = "../assets/img/cube_thumbnails/" + dataCubes[i][1].icon;
  div.appendChild(img);

  document.getElementById("inventory-holder_content").appendChild(div);
  div.addEventListener("click", (event) => {
    if (event.target.classList.contains("off")) {
      div.classList.remove("off");
      div.classList.add("loading");
      removeModel(dataCubes[i], div);
    } else {
      div.classList.add("loading");
      loadModel(dataCubes[i], div);
    }
  });
}
document
  .getElementById("inventory-holder_exit-btn")
  .addEventListener("click", (event) => {
    document.getElementById("inventory-holder").style.display = "none";
    document.getElementById("inventory-holder_thumb").style.display = "block";
  });
document
  .getElementById("inventory-holder_thumb")
  .addEventListener("click", (event) => {
    document.getElementById("inventory-holder").style.display = "block";
    document.getElementById("inventory-holder_thumb").style.display = "none";
  });

//controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enabled = true;

controls.target = new THREE.Vector3(-1, 1, -1);

//stats
const stats = new Stats();
stats.dom.classList.add("stats_bl");
container.appendChild(stats.dom);

//events
window.addEventListener("resize", onWindowResize, false);

if (isMobile) {
  document.addEventListener("touchstart", onTouchStart, false);
  document.addEventListener("touchmove", onTouchMove, false);
  document.addEventListener("touchend", onTouchEnd, false);
  document.addEventListener("touchcancel", onTouchEnd, false);
} else {
  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("mousedown", onMouseDown, false);
  document.addEventListener("mouseup", onMouseUp, false);
}

//LOADING
manager.onStart = function (url, itemsLoaded, itemsTotal) {
  // console.log('start');
  document.getElementById("inventory-holder_content").classList.add("loading");
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {};

manager.onLoad = function () {
  // console.log('end');
  document
    .getElementById("inventory-holder_content")
    .classList.remove("loading");
};

manager.onError = function (url) {
  console.log("There was an error loading " + url);
};

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixers.length > 0) {
    for (let i = 0; i < mixers.length; i++) {
      mixers[i].update(delta);
    }
  }

  stats.update();
  controls.update();

  render();
}

function render() {
  if (!isMobile) {
    raycaster.setFromCamera(pointer, camera);
    calcRaycast();
  }

  postProcessing.render();
  // renderer.render(scene, camera);
}

// RAYCAST
function calcRaycast() {
  const intersects = raycaster.intersectObjects(scene.children);

  let int = null;
  if (intersects.length > 0) {
    int = intersects[0].object;
  }

  if (int != INTERSECT) {
    INTERSECT = int;
    setCursor(INTERSECT);
  }
}

function setCursor(INTERSECT) {
  if (!SELECTED && !mouseDown) {
    INTERSECT
      ? (container.style.cursor = "grab")
      : (container.style.cursor = "default");
  }
}

var wTime;
var wTimeout = false;
var wDelta = 400;

// WINDOW EVENTS
function onWindowResize() {
  //
  const winDim = container.getBoundingClientRect();
  camera.aspect = winDim.width / winDim.height;
  camera.updateProjectionMatrix();

  //
  renderer.setSize(winDim.width, winDim.height);

  // timeout function
  wTime = new Date();
  if (wTimeout === false) {
    wTimeout = true;
    setTimeout(resizeend, wDelta);
  }
}

function resizeend() {
  if (new Date() - wTime < wDelta) {
    setTimeout(resizeend, wDelta);
  } else {
    wTimeout = false;

    // console.log(camera.aspect);
    updateControls();
  }
}

// TOUCH EVENTS
function onTouchStart(event) {
  pointer.x = clamp(
    ((event.touches[0].clientX - winDim.x) / winDim.width) * 2 - 1,
    -1,
    1
  );
  pointer.y = clamp(
    -((event.touches[0].clientY - winDim.y) / winDim.height) * 2 + 1,
    -1,
    1
  );

  raycaster.setFromCamera(pointer, camera);
  calcRaycast();

  //

  mouseDown = true;

  if (SELECTED) {
    controls.enabled = false;
  } else if (INTERSECT) {
    controls.enabled = false;
    setSelected();
  }
}
function onTouchMove(event) {
  pointer.x = clamp(
    ((event.touches[0].clientX - winDim.x) / winDim.width) * 2 - 1,
    -1,
    1
  );
  pointer.y = clamp(
    -((event.touches[0].clientY - winDim.y) / winDim.height) * 2 + 1,
    -1,
    1
  );

  raycaster.setFromCamera(pointer, camera);
  calcRaycast();

  //

  if (SELECTED) {
    moveSelected();
  } else if (!mouseDown) {
    if (INTERSECT) {
      if (INTERSECT != HOVERED) {
        // hide old
        if (HOVERED) HOVERED.material.visible = false;

        // set var
        HOVERED = INTERSECT;

        // show obj
        HOVERED.material.visible = true;
      }
    } else {
      if (HOVERED != null) {
        // hide old
        if (HOVERED) HOVERED.material.visible = false;

        // set var
        HOVERED = null;
      }
    }
  }
}
function onTouchEnd(event) {
  mouseDown = false;

  controls.enabled = true;

  if (SELECTED) {
    executeSelected();
  } else {
    resetCursor();
    resetSelection();
  }
}

// MOUSE EVENTS
function onMouseDown(event) {
  mouseDown = true;

  if (SELECTED) {
    controls.enabled = false;
  } else if (INTERSECT) {
    controls.enabled = false;
    setSelected();
  }
}

function onMouseMove(event) {
  pointer.x = clamp(((event.clientX - winDim.x) / winDim.width) * 2 - 1, -1, 1);
  pointer.y = clamp(
    -((event.clientY - winDim.y) / winDim.height) * 2 + 1,
    -1,
    1
  );

  if (SELECTED) {
    moveSelected();
  } else if (!mouseDown) {
    if (INTERSECT) {
      if (INTERSECT != HOVERED) {
        // hide old
        if (HOVERED) HOVERED.material.visible = false;

        // set var
        HOVERED = INTERSECT;

        // show obj
        HOVERED.material.visible = true;
      }
    } else {
      if (HOVERED != null) {
        // hide old
        if (HOVERED) HOVERED.material.visible = false;

        // set var
        HOVERED = null;
      }
    }
  }
}

function onMouseUp(event) {
  mouseDown = false;

  controls.enabled = true;

  if (SELECTED) {
    executeSelected();
  } else {
    resetCursor();
    resetSelection();
  }
}

// INTERFACE FUNCTIONS
function setSelected() {
  // CURSOR
  container.style.cursor = "grabbing";

  // DATA
  SELECTED = INTERSECT;

  // SLOT
  let slot = SELECTED.parent.userData.slot;

  selectedDATA = {
    pointerLoc: new THREE.Vector2(pointer.x, pointer.y),
    slot: slot,
  };

  // SELECTED
  SELECTED.layers.disable(1);

  // CURSOR MESH
  cursorMesh.position.set(
    SELECTED.parent.position.x,
    SELECTED.parent.position.y,
    SELECTED.parent.position.z
  );
  // cursorMesh.material.color = new THREE.Color( getRandomColor() );
  cursorMesh.visible = true;
}

function moveSelected() {
  let box = computeBoundingBox(cubeGroup);
  let boxY = Math.floor(box.max.y) + 1;

  let deltaX = pointer.x - selectedDATA.pointerLoc.x;
  let deltaY = pointer.y - selectedDATA.pointerLoc.y;

  let dragDamp = 2.5;

  let sPos = parsePosFromSlot(selectedDATA.slot);

  let destX = sPos.x + deltaX * (winDim.width / (100 * dragDamp));
  let destY = sPos.y + deltaY * (winDim.height / (100 * dragDamp));

  cursorMesh.position.x = destX;
  cursorMesh.position.y = destY;

  cursorMesh.position
    .divideScalar(2)
    .floor()
    .multiplyScalar(2)
    .addScalar(1)
    .clamp(new THREE.Vector3(-3, 1, -1), new THREE.Vector3(1, boxY, -1));
}

function executeSelected() {
  let sPos = parsePosFromSlot(selectedDATA.slot);

  if (
    sPos.x == cursorMesh.position.x &&
    sPos.y == cursorMesh.position.y &&
    sPos.z == cursorMesh.position.z
  ) {
    // console.log('same location');
    resetCursor();
    resetSelection();
  } else if (
    sPos.x != cursorMesh.position.x ||
    sPos.y != cursorMesh.position.y ||
    sPos.z == cursorMesh.position.z
  ) {
    // console.log('different location');
    moveCubes();
  } else {
    console.log("error");
  }
}

function moveCubes() {
  let aniLength = 1;
  let aniDone = 0;

  // CALC CUBES ON CURSOR LOCATION
  let matches = [];
  for (let i = 0; i < cubeGroup.children.length; i++) {
    let child = cubeGroup.children[i];
    if (child.id != SELECTED.id) {
      if (
        child.position.x == cursorMesh.position.x &&
        child.position.y == cursorMesh.position.y &&
        child.position.z == cursorMesh.position.z
      ) {
        matches.push(child);
      }
    }
  }

  // INIT SWAP (OVERLAP CUBES)
  if (matches.length == 0) {
    // console.log('no swap');
  } else if (matches.length == 1) {
    // console.log('swap');
    aniLength++;
    moveCube(matches[0], selectedDATA.slot);
  } else if (matches.length > 1) {
    console.log("error - multiple children on 1 coordinate");
  } else {
    console.log("error - unknown");
  }

  // INIT MOVE SELECTED CUBE
  moveCube(SELECTED.parent, parseSlotFromPos(cursorMesh.position));

  // SWAP FUNCTION
  function moveCube(obj, slot) {
    let sPos = parsePosFromSlot(slot);

    // ANIMATION
    gsap.to(obj.position, {
      x: sPos.x,
      y: sPos.y,
      z: sPos.z,
      duration: 0.25,
      ease: "power4.inOut",
      onComplete() {
        aniDone++;
        if (aniDone == aniLength) {
          resetSelection();
          updateControls();
        }
      },
    });

    // reset old slot
    let replace = dataGrid[slot] == 1 ? true : false;
    if (!replace) updateDataGrid(obj.userData.slot, false);

    // set new slot
    obj.userData.slot = slot;
    updateDataGrid(slot, true);
  }

  // RESET CURSOR
  resetCursor();

  // DATA for cubes
  // console.log(dataGrid);
}

function resetCursor() {
  // CURSOR MESH
  cursorMesh.visible = false;

  // CURSOR
  if (INTERSECT) {
    setCursor(INTERSECT);
  } else {
    container.style.cursor = "default";
  }
}

// RESET
function resetSelection() {
  // SELECTED LAYER
  if (SELECTED) SELECTED.layers.enable(1);

  // VARS
  SELECTED = null;
  selectedDATA = null;
}

//OBJECTS
function loadModel(cubeData, div) {
  //nodes
  let cube = cubeData[1];

  // group
  let group = new THREE.Group();
  group.name = "cube-" + cubeData[0];

  // slot
  let slot = chooseSlot();
  group.userData = { slot: slot };
  updateDataGrid(slot, true);

  // slot pos
  let sPos = parsePosFromSlot(slot);

  //positioning
  group.position.x = sPos.x;
  group.position.y = sPos.y;
  group.position.z = sPos.z;

  // collider
  let collider = colliderMesh.clone();
  collider.position.set(0, 0, 0);
  collider.material = new THREE.MeshBasicMaterial({
    color: new THREE.Color("rgb( 255,255,255 )"),
    transparent: true,
    opacity: 0.2,
    visible: false,
  });

  collider.layers.set(1);
  collider.name = "collider-" + cubeData[0];
  collider.userdata = { type: "cube" };
  group.add(collider);

  //load cube
  loadCube(group, cube, div, slot);
}

function loadCube(group, cube, div) {
  loaderGLTF.load("../assets/models/cubes/" + cube.file, function (gltf) {
    let model = gltf.scene;

    model.position.set(0, -1, 1);
    model.scale.set(1, 1, 1).multiplyScalar(1.2);

    // MODEL
    model.traverse(function (child) {
      if (child.isMesh) {
        child.material.envMap = envMap;
        child.material.envMapIntensity = 1.0;
      }
    });

    // animation
    if (gltf.animations.length > 0) {
      let mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
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

    //
    // document.getElementById( 'inventory-holder' ).style.display = 'none';
    // document.getElementById( 'inventory-holder_thumb' ).style.display = 'block';
  });
}

function removeModel(cubeData, div) {
  let cube = cubeGroup.getObjectByName("cube-" + cubeData[0]);
  cubeGroup.remove(cube);

  //
  div.classList.remove("loading");

  //
  updateDataGrid(cube.userData.slot, false);
}

function updateControls() {
  let time = 0.5;

  let box = computeBoundingBox(cubeGroup);
  let boxX = Math.max(
    Math.floor(box.max.x / 2),
    Math.floor(-box.min.x / 2) - 1
  );
  let boxY = Math.floor(box.max.y / 2) - 1;
  // console.log(boxX, boxY);

  let posCam = new THREE.Vector3(-1, 3, 10);
  var zInit = 8;
  var zDelta = 0;
  if (camera.aspect > 1) {
    zDelta = 1;
  } else if (camera.aspect < 1 && camera.aspect >= 0.8) {
    zDelta = 4;
  } else {
    zInit = 10;
    zDelta = 8;
  }
  posCam.z = zInit + boxX * zDelta + boxY * 1;

  //
  let posControls = new THREE.Vector3().copy(controls.target);
  posControls.y = boxY + 0.5;

  controls.enabled = false;
  gsap.to(camera.position, { z: posCam.z, duration: time });
  gsap.to(controls.target, {
    y: posControls.y,
    duration: time,
    onComplete() {
      controls.enabled = true;
    },
  });
}

function chooseSlot() {
  let index = null;
  for (let i = 0; i < dataGrid.length; i += 3) {
    let l = i;
    let c = i + 1;
    let r = i + 2;

    if (dataGrid[c] == 0) {
      index = c;
      break;
    } else if (dataGrid[l] == 0) {
      index = l;
      break;
    } else if (dataGrid[r] == 0) {
      index = r;
      break;
    }
  }

  return index;
}

function parsePosFromSlot(slot) {
  let sX = (slot % 3) - 1;
  let sY = Math.floor(slot / 3);

  return { x: -1 + sX * 2, y: 1 + sY * 2, z: -1 };
}

function parseSlotFromPos(pos) {
  let sX = (pos.x + 1) / 2;
  let sY = (pos.y - 1) / 2;

  let index = sY * 3 + (sX + 1);

  return index;
}

function updateDataGrid(i, val) {
  if (val) {
    dataGrid[i] = 1;
  } else {
    dataGrid[i] = 0;
  }
}

function computeBoundingBox(group) {
  let aabb = new THREE.Box3();
  aabb.setFromObject(group);
  return aabb;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function average(a, b) {
  return (a * 1 + b * 1) / 2;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function gltfAsync(url) {
  return new Promise((resolve, reject) => {
    loaderGLTF.load(url, (data) => resolve(data), null, reject);
  });
}
