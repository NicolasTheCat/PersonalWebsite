import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Mesh } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-citybackground3d',
  templateUrl: './citybackground3d.component.html',
  styleUrls: ['./citybackground3d.component.css']
})
export class Citybackground3dComponent implements OnInit {

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls!: OrbitControls;

  minX = -50;

  lastMeshFront : Mesh | null = null;
  lastMeshBack : Mesh | null = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    let light = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(light);
    for (let i = 0; i < 10; i++) {
      this.lastMeshFront = this.createNextBuilding(this.lastMeshFront,50,0,0.2);
      this.scene.add(this.lastMeshFront);
    }
    for (let i = 0; i < 15; i ++){
      this.lastMeshBack = this.createNextBuilding(this.lastMeshBack,30,-30,0.1);
      this.scene.add(this.lastMeshBack);
    }

    this.scene.add(this.createRoad());
  }

  ngOnInit(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set( 50, 0, 60);
    //this.controls.update();
    this.animate();
  }

  animate(): void {
    requestAnimationFrame( this.animate.bind(this) );
    //this.controls.update();
    this.handleAnimation()
    this.renderer.render( this.scene, this.camera );
  }

  handleAnimation(){
    this.scene.children.forEach(e => {
      if(e.userData["s"] != undefined){
        if(e.position.x < this.minX){
          this.scene.remove(e);
          if(e.userData["s"] <= 0.1){
            this.lastMeshBack = this.createNextBuilding(this.lastMeshBack,30,-30,0.1);
            this.scene.add(this.lastMeshBack);
          }

          else{
            this.lastMeshFront = this.createNextBuilding(this.lastMeshFront,50,0,0.2);
            this.scene.add(this.lastMeshFront);
          }

        }
        e.position.x -= e.userData["s"];
      }
    });
  }

  createRoad(){
    let geometry = new THREE.BoxGeometry(200,0.5,20);

    let material = new THREE.MeshStandardMaterial({
      color: 0xffaaff,
      metalness: 0.1,
      roughness: 0.5,
      wireframe: false
    });

    let mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(50,-10,10);

    return mesh;
  }



  createNextBuilding(Mesh:THREE.Mesh | null, MaxHeight:number, Z: number, scrollSpeed:number) : Mesh{
    let building = this.createBuilding(this.randomInt(10,20),this.randomInt(5,MaxHeight),this.randomInt(10,20),scrollSpeed);
    if(Mesh != null){
      building.position.x = Mesh.position.x + Mesh.userData["x"] + this.randomInt(2,10);
    } else {
      building.position.x = -30;
    }
    building.position.y = building.userData["y"] / 2 - 10;  
    building.position.z = - building.userData["z"] / 2 + Z;
    return building;
  }

  createBuilding(X:number,Y:number,Z:number,scrollSpeed:number): THREE.Mesh{

    let geometry = new THREE.BoxGeometry(X,Y,Z);

    let material = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.1,
      roughness: 0.5,
      wireframe: false
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {x: X, y: Y, z: Z, s: scrollSpeed};


    for (let index = 0; index < 4; index++) {
      let nWindows = this.randomInt(10,50);

      for(let i = 0; i < nWindows; i++){
        mesh.add(this.createWindow(X,Y-2,Z,index));
      }

    }
    return mesh;
  }

  createWindow(X:number,Y:number,Z:number,Yrotation:number): THREE.Mesh{
    let geometry = new THREE.PlaneGeometry(0.8,0.8,1,1);

    let material = new THREE.MeshStandardMaterial({
      color: 0xFFFF00,
      metalness: 0.1,
      roughness: 0.5,
      emissive: 0xFFFF00,
      emissiveIntensity: 1
    });
    let mesh = new THREE.Mesh(geometry, material);

    if(Yrotation > 1){
      X = -X
      Z = -Z
    }

    if(Yrotation % 2 == 0){
      X = this.removeFromNumber(X,2);
      mesh.position.x = this.randomInt(X / -2,X / 2);
      mesh.position.z = 0.5 * Z + (Yrotation > 1 ?  -0.1 : 0.1);
    } else {
      Z = this.removeFromNumber(Z,2);
      mesh.position.x = 0.5 * X + (Yrotation > 1 ?  -0.1 : 0.1);
      mesh.position.z = this.randomInt(Z / -2,Z / 2);
      
    }

    mesh.position.y = this.randomInt(Y / -2,Y / 2);

    mesh.rotation.y = Yrotation * Math.PI/2;

    return mesh;
  }

  randomInt(min: number, max: number): number{
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  removeFromNumber(num:number,remove:number){
    if(num > 0){
      num-=remove;
    } else {
      num+=remove;
    }

    return num;
  }

  to_rgb(r:number, g:number, b:number) { return "0x" + 
    this.convert(r) + 
    this.convert(g) + 
    this.convert(b); 
  ;}

  convert(integer:number) {
    var str = Number(integer).toString(16);
    return str.length == 1 ? "0" + str : str;
  };
}
