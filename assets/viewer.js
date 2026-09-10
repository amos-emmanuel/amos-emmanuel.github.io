/* ============================================
   Reusable STL viewer.
   Call initViewer(containerId, opts) once per viewer instance.
   opts.demo: 'gear' | 'bracket' — which procedural demo part to show
   ============================================ */
function initViewer(rootId, opts){
  opts = opts || {};
  const root = document.getElementById(rootId);
  const host = root.querySelector('.canvas-host');
  const nameEl = root.querySelector('.vt-name');
  const fileInput = root.querySelector('input[type=file]');
  const btnRot = root.querySelector('.btn-rotate');
  const btnWire = root.querySelector('.btn-wire');
  const btnReset = root.querySelector('.btn-reset');

  let W = host.clientWidth, H = host.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 2000);
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(W,H);
  host.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x666670, 0.75));
  const key = new THREE.DirectionalLight(0xc98a4b, 1.0); key.position.set(4,6,5); scene.add(key);
  const fill = new THREE.DirectionalLight(0x8a8790, 0.6); fill.position.set(-5,-2,-4); scene.add(fill);
  const rim = new THREE.PointLight(0xffffff, 0.4); rim.position.set(0,3,-6); scene.add(rim);

  const group = new THREE.Group(); scene.add(group);
  const material = new THREE.MeshStandardMaterial({color:0xc7c2b8, metalness:0.75, roughness:0.38});
  let mesh = null, wire = false, auto = true, camDist = 6;

  function frameObject(geo){
    geo.computeBoundingBox();
    const bb = geo.boundingBox, c = new THREE.Vector3(); bb.getCenter(c);
    geo.translate(-c.x,-c.y,-c.z);
    const size = new THREE.Vector3(); bb.getSize(size);
    const maxd = Math.max(size.x,size.y,size.z) || 1;
    const s = 2.6/maxd;
    if(mesh){ group.remove(mesh); mesh.geometry.dispose(); }
    geo.computeVertexNormals();
    mesh = new THREE.Mesh(geo, material);
    mesh.scale.setScalar(s);
    group.add(mesh);
    material.wireframe = wire;
    resetView();
  }
  function resetView(){
    group.rotation.set(-0.3,0.55,0);
    camera.position.set(0,0.5,6);
    camera.lookAt(0,0,0);
    camDist = 6;
  }

  function makeGear(){
    const teeth=16,rOuter=1.25,rRoot=1.0,rHole=0.42,depth=0.5;
    const shape = new THREE.Shape();
    const step=(Math.PI*2)/teeth;
    for(let i=0;i<teeth;i++){
      const a=i*step, a1=a+step*0.22, a2=a+step*0.30, a3=a+step*0.70, a4=a+step*0.78, an=a+step;
      if(i===0) shape.moveTo(Math.cos(a)*rRoot, Math.sin(a)*rRoot);
      shape.lineTo(Math.cos(a1)*rRoot, Math.sin(a1)*rRoot);
      shape.lineTo(Math.cos(a2)*rOuter, Math.sin(a2)*rOuter);
      shape.lineTo(Math.cos(a3)*rOuter, Math.sin(a3)*rOuter);
      shape.lineTo(Math.cos(a4)*rRoot, Math.sin(a4)*rRoot);
      shape.lineTo(Math.cos(an)*rRoot, Math.sin(an)*rRoot);
    }
    const hole = new THREE.Path(); hole.absarc(0,0,rHole,0,Math.PI*2,true);
    shape.holes.push(hole);
    return new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:0.05,bevelSize:0.04,bevelSegments:2,steps:1,curveSegments:24});
  }
  function makeBracket(){
    const shape = new THREE.Shape();
    shape.moveTo(-1.2,-0.6); shape.lineTo(1.2,-0.6); shape.lineTo(1.2,-0.15);
    shape.lineTo(0.25,-0.15); shape.lineTo(0.25,1.1); shape.lineTo(-0.2,1.1);
    shape.lineTo(-0.2,-0.15); shape.lineTo(-1.2,-0.15); shape.lineTo(-1.2,-0.6);
    const h1=new THREE.Path(); h1.absarc(-0.75,-0.375,0.14,0,Math.PI*2,true); shape.holes.push(h1);
    const h2=new THREE.Path(); h2.absarc(0.75,-0.375,0.14,0,Math.PI*2,true); shape.holes.push(h2);
    const h3=new THREE.Path(); h3.absarc(0.02,0.75,0.14,0,Math.PI*2,true); shape.holes.push(h3);
    return new THREE.ExtrudeGeometry(shape,{depth:0.35,bevelEnabled:true,bevelThickness:0.04,bevelSize:0.03,bevelSegments:2,curveSegments:20});
  }
  frameObject(opts.demo==='bracket' ? makeBracket() : makeGear());

  function parseSTL(buffer){
    const dv = new DataView(buffer);
    const n = dv.getUint32(80,true);
    const isBinary = (84+n*50)===buffer.byteLength && n>0;
    const positions = [];
    if(isBinary){
      let off=84;
      for(let i=0;i<n;i++){
        off+=12;
        for(let v=0;v<3;v++){ positions.push(dv.getFloat32(off,true),dv.getFloat32(off+4,true),dv.getFloat32(off+8,true)); off+=12; }
        off+=2;
      }
    } else {
      const text = new TextDecoder().decode(buffer);
      const re=/vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g; let m;
      while((m=re.exec(text))!==null) positions.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
    return geo;
  }

  fileInput.addEventListener('change', e=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      try{ frameObject(parseSTL(ev.target.result)); nameEl.textContent = f.name; }
      catch(err){ alert('Could not parse that STL file.'); console.error(err); }
    };
    reader.readAsArrayBuffer(f);
  });

  let dragging=false, px=0, py=0;
  host.addEventListener('pointerdown', e=>{dragging=true;px=e.clientX;py=e.clientY;host.classList.add('grabbing');auto=false;btnRot.classList.remove('active');});
  addEventListener('pointerup', ()=>{dragging=false;host.classList.remove('grabbing');});
  addEventListener('pointermove', e=>{
    if(!dragging) return;
    const dx=(e.clientX-px)/180, dy=(e.clientY-py)/180;
    group.rotation.y+=dx; group.rotation.x+=dy;
    px=e.clientX; py=e.clientY;
  });
  host.addEventListener('wheel', e=>{
    e.preventDefault();
    camDist *= (1+(e.deltaY>0?0.08:-0.08));
    camDist = Math.max(2.4, Math.min(14, camDist));
    camera.position.z = camDist;
  }, {passive:false});

  btnRot.addEventListener('click', ()=>{auto=!auto; btnRot.classList.toggle('active',auto);});
  btnWire.addEventListener('click', ()=>{wire=!wire; material.wireframe=wire; btnWire.classList.toggle('active',wire);});
  btnReset.addEventListener('click', resetView);

  new ResizeObserver(()=>{
    W=host.clientWidth; H=host.clientHeight;
    camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H);
  }).observe(host);

  (function loop(){
    requestAnimationFrame(loop);
    if(auto) group.rotation.y += 0.005;
    renderer.render(scene,camera);
  })();
}
