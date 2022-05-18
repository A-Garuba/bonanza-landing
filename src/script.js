import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Textures
const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load('/textures/height.jpg')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(.5,64,64)

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.6
material.roughness = 0.3
material.normalMap = normalTexture;

material.color = new THREE.Color(0xff8000)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights
const pointLight1 = new THREE.PointLight(0xffffff, 0.1)
pointLight1.position.set(2,2,-2)

const pointLight2 = new THREE.PointLight(0xffffff, 0.1)
pointLight2.position.set(-2,-3,1)

scene.add(pointLight1,pointLight2)

    // gui lights

const light1 = gui.addFolder('Light 1')

light1.add(pointLight1.position, 'x').min(-10).max(10).step(0.01)
light1.add(pointLight1.position, 'y').min(-10).max(10).step(0.01)
light1.add(pointLight1.position, 'z').min(-10).max(10).step(0.01)
light1.add(pointLight1, 'intensity').min(0).max(10).step(0.01)

const light1Color = {
    color: 0xffffff
}

light1.addColor(light1Color, 'color')
    .onChange(() => {
        pointLight1.color.set(light1Color.color)
    })

const light2 = gui.addFolder('Light 2')

light2.add(pointLight2.position, 'x').min(-10).max(10).step(0.01)
light2.add(pointLight2.position, 'y').min(-10).max(10).step(0.01)
light2.add(pointLight2.position, 'z').min(-10).max(10).step(0.01)
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

const light2Color = {
    color: 0xffffff
}

light2.addColor(light2Color, 'color')
    .onChange(() => {
        pointLight2.color.set(light2Color.color)
    })

const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1)
const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1)

scene.add(pointLightHelper1, pointLightHelper2)

gui.add(pointLightHelper1, 'visible', false)
gui.add(pointLightHelper2, 'visible', false)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowX
    mouseY = event.clientY - windowY
}

const updateSphere = (event) => {
    sphere.position.y = -window.scrollY * .002
}

window.addEventListener('scroll', updateSphere)

let lightBounce = .01;

const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Sphere motion
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)

    // sphere.position.z -= .05 * (targetY - sphere.rotation.x)
    // sphere.position.z = Math.min(Math.max(sphere.position.z, -2), 0.5);

    // Light motion
    pointLight1.position.x += lightBounce
    pointLight2.position.x -= lightBounce

    if (Math.abs(pointLight1.position.x) > 5) lightBounce *= -1

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()