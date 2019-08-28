// TODO: use proper "imports"
// TODO: typescript

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

class Toolbox {
  constructor(tiles) {
    this.tiles = tiles
    this.selectedLi = null
    this.selectedTile = null
    this.ul = document.getElementsByClassName('tools')[0]
    this.tileToImage = {}
    this.numLoaded = 0
  }

  drawTile(tile, onloaded) {
    const li = document.createElement('li')
    const img = new Image()

    img.addEventListener('load', () => {
      ++this.numLoaded
      if (this.numLoaded == this.tiles.length) {
        onloaded()
      }
    })
    img.src = '../../resources/tiles/' + tile + '.png'
    img.id = 'tile-' + tile
    img.tile = tile
    this.tileToImage[tile] = img

    li.appendChild(img)
    this.ul.appendChild(li)
  }

  registerTool(tile) {
    const img = this.tileToImage[tile]
    img.addEventListener('click', (e) => {
      if (this.selectedLi != null) {
        this.selectedLi.className = ''
      }
      e.target.parentNode.className = 'selected'
      this.selectedLi = e.target.parentNode
      this.selectedTile = e.target.tile
    })
  }

  loadTiles(onloaded) {
  //resources.eraser
    for (const tile of this.tiles) {
      this.drawTile(tile, onloaded)
      this.registerTool(tile)
    }
  }
}

// TODO: async/await

let TILE_W = 80, TILE_H = 80
const level = [['box', 'box', 'bridge'], ['bridge', 'bridge', 'box'], ['box', 'box', 'box']]
let drawing = false

function hitTest(x, y) {
  return [Math.floor(x / TILE_W), Math.floor(y / TILE_H)]
}

function mousemove(e) {
  if (drawing) {
    const [x, y] = hitTest(
      e.clientX - e.target.offsetLeft,
      e.clientY - e.target.offsetTop
    )
    console.log(x, y)
    if (!(x in level)) {
      level[x] = []
    }
    level[x][y] = toolbox.selectedTile
    render(toolbox.tileToImage)
  }
}

canvas.addEventListener('mousedown', (e) => {
  if (toolbox.selectedTile != null) {
    drawing = true
  }
  mousemove(e)
})
canvas.addEventListener('mousemove', mousemove)
canvas.addEventListener('mouseup', () => {
  drawing = false
})

function render(tileToImage) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const i in level) {
    const row = level[i]
    for (const j in row) {
      const tile = row[j]
      ctx.drawImage(tileToImage[tile], i * TILE_W, j * TILE_H, TILE_W, TILE_H)
    }
  }
}

function resize(tileToImage) {
  const levelEl = document.getElementsByClassName('level')[0]
  canvas.width = levelEl.offsetWidth
  canvas.height = levelEl.offsetHeight
  render(tileToImage)
}

const toolbox = new Toolbox(resources.tiles)

toolbox.loadTiles(() => {
  render(toolbox.tileToImage)
  window.addEventListener('resize', () => {
    resize(toolbox.tileToImage)
  })
  resize(toolbox.tileToImage)
})
