const canvas = document.querySelector('#canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 720

const gravity = .5

class Player {
  constructor() {
    this.position = {
      x: 300, y: 200
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.width = 50
    this.height = 50
    this.color = 'red'
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity
    } else {
      this.velocity.y = 0
    }

    this.draw()
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
    console.log(x, y)
    this.position = { x, y }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

const player = new Player()

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

const platforms = [
  new Platform({ x: 0, y: 600, image: createImage(platform) }),
  new Platform({ x: createImage(platform).width - 2, y: 600, image: createImage(platform) }),
  new Platform({ x: 1000, y: 400, image: createImage(platform) }),
  new Platform({ x: 1400, y: 400, image: createImage(platform) }),
  new Platform({ x: 1800, y: 400, image: createImage(platform) }),
  new Platform({ x: 2200, y: 400, image: createImage(platform) }),
  new Platform({ x: 2600, y: 400, image: createImage(platform) })
]

const genericObjects = [
  new GenericObject({ x: -1, y: -1, image: createImage(background) }),
  new GenericObject({ x: -1, y: 22, image: createImage(hills) }),
  // new GenericObject({ x: 1000, y: 400, image: createImage(platform) }),
  // new GenericObject({ x: 1400, y: 300, image: createImage(platform) }),
  // new GenericObject({ x: 1800, y: 600, image: createImage(platform) }),
  // new GenericObject({ x: 2200, y: 400, image: createImage(platform) }),
  // new GenericObject({ x: 2600, y: 200, image: createImage(platform) })
]

const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}

let scrollOffset = 0

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
    player.velocity.x = 5
  } else if (keys.left.pressed && player.position.x > 300) {
    player.velocity.x = -5
  } else {
    player.velocity.x = 0

    if (keys.right.pressed) {
      platforms.forEach(platform => {
        platform.position.x -= 7
        scrollOffset += 7
      })

      genericObjects.forEach(genericObject => {
        genericObject.position.x -= 3
      })
    } else if (keys.left.pressed & scrollOffset > 0) {
      platforms.forEach(platform => {
        platform.position.x += 7
        scrollOffset -= 7
      })

      genericObjects.forEach(genericObject => {
        genericObject.position.x += 3
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

  if (scrollOffset > 10000) {
    console.log('You Win')
  }
}

animate()

addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w':
    case 'ArrowUp':
    case ' ':
      if (player.velocity.y === 0) player.velocity.y = -15
      break

    case 'a':
    case 'ArrowLeft':
      keys.left.pressed = true
      break

    case 's':
    case 'ArrowDown':

      break

    case 'd':
    case 'ArrowRight':
      keys.right.pressed = true
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
      break

    case 's':
    case 'ArrowDown':

      break

    case 'd':
    case 'ArrowRight':
      keys.right.pressed = false
      break

    default:
      break
  }
})