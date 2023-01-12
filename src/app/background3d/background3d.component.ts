import { Component, OnInit } from '@angular/core';
import { group } from 'console';
import * as THREE from 'three';
import { UniformsLib } from 'three';

@Component({
  selector: 'app-background3d',
  templateUrl: './background3d.component.html',
  styleUrls: ['./background3d.component.css']
})
export class Background3dComponent implements OnInit {

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;


  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 40;
    this.camera.position.y = 40;
    this.camera.rotation.x = -0.78;
    this.renderer = new THREE.WebGLRenderer();

    this.sceneInit();
   }

  ngOnInit(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.animate();
  }

  animate(): void {
    requestAnimationFrame( this.animate.bind(this) );
    this.renderer.render( this.scene, this.camera );
    this.scene.children.forEach(element => {
      if(element.userData["moon"]){
        element.rotation.y += 0.01;
        element.position.x = (Math.cos(Date.now() / 1000 * element.userData["speed"]) * element.userData['distance']) + element.userData['center'].position.x;
        element.position.z = (Math.sin(Date.now() / 1000 * element.userData["speed"]) * element.userData['distance']) + element.userData['center'].position.z;
      } else if(element.userData["speed"]){
        element.rotation.y += 0.01;
        element.position.x = Math.cos(Date.now() / 1000 * element.userData["speed"]) * element.userData['distance'];
        element.position.z = Math.sin(Date.now() / 1000 * element.userData["speed"]) * element.userData['distance'];
      }
    });
  }

  async sceneInit(): Promise<void>{
    this.scene.add(await this.createSun());
    this.scene.add(this.createPlanet(15,1,1,
      this.createMaterial("assets/Mars_color.png","assets/Mars_normal.png")));
    let earth = this.createPlanet(22,0.1,3,
      this.createMaterialColor("assets/Earth_color_day.jpg"))
    this.scene.add(earth);
    let earthNight = this.createPlanet(22,0.1,3.05,
      this.createShadowMaterial("assets/Earth_color_night.jpg","assets/Earth_lightmap_night.jpg"));
    this.scene.add(earthNight);
    this.scene.add(this.createMoon(earth,7,1,1,
      this.createMaterial("assets/Moon_2k.jpg","assets/Moon_normal.png")));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    console.log(this.scene.children)
  }


  async createSun(): Promise<THREE.Object3D<THREE.Event>> {
    const geometry = new THREE.SphereGeometry(5, 32, 32);

    let shader = await (await fetch("assets/sun.glsl")).text();
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      wireframe: false
    });
    

    const sun = new THREE.Mesh(geometry, material);

    const light = new THREE.PointLight(0xffffff, 3,100);
    light.position.set(0, 0, 0);

    const group = new THREE.Group();
    group.add(sun);
    group.add(light);

    return group;
  }

  createPlanet(distance:number,speed:number, radius:number, material:THREE.Material): THREE.Object3D {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const planet = new THREE.Mesh(geometry, material);

    planet.userData = {
      "distance" : distance,
      "speed" : speed,
      "center" : [0,0,0],
      "moon" : false
    }

    planet.position.x = distance;

    return planet;
  }

  createMoon(planet:THREE.Object3D, distance:number, radius:number, speed:number, material:THREE.Material): THREE.Object3D {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const moon = new THREE.Mesh(geometry, material);

    moon.userData = {
      "distance" : distance,
      "speed" : speed,
      "center" : planet,
      "moon" : true
    }

    return moon;
  }

  createMaterial(pathColor:string, pathNormal:string): THREE.MeshStandardMaterial {
    const textureLoader = new THREE.TextureLoader();
    const colorTexture = textureLoader.load(pathColor);
    const normalTexture = textureLoader.load(pathNormal);

    console.log(colorTexture)
    console.log(normalTexture)

    const material = new THREE.MeshStandardMaterial();
    material.map = colorTexture;
    material.normalMap = normalTexture;
    return material;
  }

  createMaterialColor(pathColor:string): THREE.MeshStandardMaterial {
    const textureLoader = new THREE.TextureLoader();
    const colorTexture = textureLoader.load(pathColor);

    console.log(colorTexture)

    const material = new THREE.MeshStandardMaterial();
    material.map = colorTexture;
    return material;
  }

  createShadowMaterial(pathShadow:string,pathLightMap:string): THREE.MeshLambertMaterial {
    const textureLoader = new THREE.TextureLoader();
    const shadowTexture = textureLoader.load(pathShadow);
    const lightmapTexture = textureLoader.load(pathLightMap);

    console.log(shadowTexture)

    const material = new THREE.MeshPhongMaterial({
      opacity: 0.4,
      transparent: true,
      shininess: 50,
      specular:0.5
    });
    material.map = shadowTexture;
  
    material.emissive = new THREE.Color(0xffffff);
    material.emissiveIntensity = 1.5;
    material.emissiveMap = lightmapTexture;
    material.lightMap = lightmapTexture;
    
    return material;
  }

}
