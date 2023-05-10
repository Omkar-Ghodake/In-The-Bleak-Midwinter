import './App.css'
import platform from './assets/platform.png'
import platformSmallTall from './assets/platformSmallTall.png'
import spriteRunLeft from './assets/spriteRunLeft.png'
import spriteRunRight from './assets/spriteRunRight.png'
import spriteStandLeft from './assets/spriteStandLeft.png'
import spriteStandRight from './assets/spriteStandRight.png'
import background from './assets/background.png'
import hills from './assets/hills.png'
import { useEffect } from 'react'

function App() {
  const drawCanvas = () => {
    const canvas = document.querySelector('#canvas')
    const c = canvas.getContext('2d')

    canvas.width = 1280
    canvas.height = 720

    const gravity = .5

    class Player {
      constructor() {
        this.position = {
          x: 300, y: -50
        }
        this.velocity = {
          x: 0,
          y: 0
        }
        this.speed = 8
        this.width = 66
        this.height = 150
        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
          stand: {
            right: createImage(spriteStandRight),
            left: createImage(spriteStandLeft),
            cropWidth: 177,
            width: 66
          },
          run: {
            right: createImage(spriteRunRight),
            left: createImage(spriteRunLeft),
            cropWidth: 341,
            width: 127.875
          }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
        this.currentWidth = 66
      }

      draw() {
        c.drawImage(
          this.currentSprite,
          this.currentCropWidth * this.frames,
          0,
          this.currentCropWidth,
          400,
          this.position.x,
          this.position.y,
          this.width,
          this.height,
        )
      }

      update() {
        this.frames++
        if (
          this.frames > 59 &&
          (this.currentSprite === this.sprites.stand.right ||
            this.currentSprite === this.sprites.stand.left)
        ) {
          this.frames = 0
        } else if (
          this.frames > 29 &&
          (this.currentSprite === this.sprites.run.right ||
            this.currentSprite === this.sprites.run.left)
        ) {
          this.frames = 0
        }
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
          this.velocity.y += gravity
        } else {
          // this.velocity.y = 0
        }
      }
    }

    class Platform {
      constructor({ x, y, image }) {
        this.position = { x, y }
        this.image = image
        this.width = image.width
        this.height = image.height
      }

      draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
      }
    }

    class GenericObject {
      constructor({ x, y, image }) {
        this.position = { x, y }
        this.image = image
        this.width = image.width
        this.height = image.height
      }

      draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
      }
    }

    function createImage(imageSrc) {
      const image = new Image()
      image.src = imageSrc
      return image
    }

    let lastKey
    const keys = {
      right: {
        pressed: false
      },
      left: {
        pressed: false
      }
    }

    let player
    let platforms = []
    let genericObjects = []
    let scrollOffset

    function init() {
      player = new Player()

      platforms = [
        new Platform({ x: 0, y: 600, image: createImage(platform) }),
        new Platform({ x: createImage(platform).width * 1 - 2, y: 400, image: createImage(platformSmallTall) }),
        new Platform({ x: createImage(platform).width * 1 - 2, y: 600, image: createImage(platform) }),
        new Platform({ x: createImage(platform).width * 2 + 300, y: 600, image: createImage(platform) }),
        new Platform({ x: createImage(platform).width * 3 + 700, y: 300, image: createImage(platformSmallTall) }),
        new Platform({ x: createImage(platform).width * 3 + 1250, y: 600, image: createImage(platform) }),
        new Platform({ x: createImage(platform).width * 4 + 1550, y: 300, image: createImage(platformSmallTall) }),
        new Platform({ x: createImage(platform).width * 4 + 2150, y: 300, image: createImage(platform) }),
        new Platform({ x: createImage(platform).width * 4 + 2050, y: 600, image: createImage(platform) }),
        new Platform({ x: createImage(platform).width * 5 + 2350, y: 600, image: createImage(platform) }),
        new Platform({ x: createImage(platform).width * 6 + 2750, y: 600, image: createImage(platform) })
      ]

      genericObjects = [
        new GenericObject({ x: -1, y: -1, image: createImage(background) }),
        new GenericObject({ x: -1, y: 140, image: createImage(hills) }),
        // new GenericObject({ x: 1000, y: 400, image: createImage(platform) }),
        // new GenericObject({ x: 1400, y: 300, image: createImage(platform) }),
        // new GenericObject({ x: 1800, y: 600, image: createImage(platform) }),
        // new GenericObject({ x: 2200, y: 400, image: createImage(platform) }),
        // new GenericObject({ x: 2600, y: 200, image: createImage(platform) })
      ]

      scrollOffset = 0
    }

    const animate = () => {
      requestAnimationFrame(animate)

      c.clearRect(0, 0, canvas.width, canvas.height)

      genericObjects.forEach(genericObject => {
        genericObject.draw()
      })

      platforms.forEach(platform => {
        platform.draw()
      })

      player.update()

      if (keys.right.pressed && player.position.x < 500) {
        player.velocity.x = player.speed
      } else if (keys.left.pressed && player.position.x > (scrollOffset > 0 ? 300 : 10)) {
        player.velocity.x = -player.speed
      } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
          scrollOffset += player.speed
          platforms.forEach(platform => {
            platform.position.x -= player.speed
          })

          genericObjects.forEach(genericObject => {
            genericObject.position.x -= player.speed * .60
          })
        } else if (keys.left.pressed & scrollOffset > 0) {
          scrollOffset -= player.speed
          platforms.forEach(platform => {
            platform.position.x += player.speed
          })

          genericObjects.forEach(genericObject => {
            genericObject.position.x += player.speed * .60
          })
        }
      }

      platforms.forEach(platform => {
        if (
          player.position.y + player.height <= platform.position.y &&
          player.position.y + player.height + player.velocity.y >= platform.position.y &&
          player.position.x + player.width >= platform.position.x &&
          player.position.x <= platform.position.x + platform.width
        ) {
          player.velocity.y = 0
        }
      })

      if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
      } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.frames = 1
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
      } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.frames = 1
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
      } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
      }

      // wind
      if (scrollOffset > createImage(platform).width * 6 + 2750) {

      }

      // lose
      if (player.position.y > canvas.height) {
        init()
      }
    }

    init()
    animate()

    addEventListener('keydown', ({ key }) => {
      switch (key) {
        case 'w':
        case 'ArrowUp':
        case ' ':
          if (player.velocity.y === 0) player.velocity.y = -18
          break

        case 'a':
        case 'ArrowLeft':
          keys.left.pressed = true
          lastKey = 'left'
          break

        case 's':
        case 'ArrowDown':

          break

        case 'd':
        case 'ArrowRight':
          keys.right.pressed = true
          lastKey = 'right'
          break

        default:
          // console.log('default Case')
          break
      }
    })

    addEventListener('keyup', ({ key }) => {
      switch (key) {
        case 'w':
        case 'ArrowUp':
        case ' ':
          // player.velocity.y -= 20
          break

        case 'a':
        case 'ArrowLeft':
          keys.left.pressed = false
          player.currentSprite = player.sprites.stand.left
          player.currentCropWidth = player.sprites.stand.cropWidth
          player.width = player.sprites.stand.width
          break

        case 's':
        case 'ArrowDown':

          break

        case 'd':
        case 'ArrowRight':
          keys.right.pressed = false
          player.currentSprite = player.sprites.stand.right
          player.currentCropWidth = player.sprites.stand.cropWidth
          player.width = player.sprites.stand.width
          break

        default:
          break
      }
    })
  }

  useEffect(() => {
    drawCanvas()
    console.log('useeffect called')
  }, [])
  return (
    <div className="App h-screen w-screen flex justify-center items-center bg-black">
      <canvas id='canvas'></canvas>
    </div>
  )
}

export default App
