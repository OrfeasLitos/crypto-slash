// TODO: use proper "imports"
// TODO: typescript

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

class TilesDB {
  constructor() {
    this.numLoaded = 0
    this.tiles = resources.tiles
    this.tileToImage = {}
  }

  _loadTile(tile) {
    const img = new Image()

    img.addEventListener('load', () => {
      ++this.numLoaded
      if (this.numLoaded == this.tiles.length) {
        this.onloaded()
      }
    })
    img.src = '../../resources/tiles/' + tile + '.png'
    this.tileToImage[tile] = img
  }

  load(onloaded) {
    this.onloaded = onloaded
    for (const tile of this.tiles) {
      this._loadTile(tile)
    }
    onloaded()
  }

  getTileImage(tile) {
    return this.tileToImage[tile]
  }
}

class Toolbox {
  constructor(tiles) {
    this.tiles = tiles
    this.selectedLi = null
    this.selectedTile = null
    this.ul = document.getElementsByClassName('tools')[0]
    this.images = {}
  }

  drawTile(tile) {
    const li = document.createElement('li')
    const src = tilesDB.getTileImage(tile).src
    const img = new Image()
    img.src = src
    this.images[tile] = img

    li.appendChild(img)
    this.ul.appendChild(li)
  }

  registerTool(tile) {
    const img = this.images[tile]
    img.tile = tile
    img.addEventListener('click', (e) => {
      if (this.selectedLi != null) {
        this.selectedLi.className = ''
      }
      e.target.parentNode.className = 'selected'
      this.selectedLi = e.target.parentNode
      this.selectedTile = e.target.tile
    })
  }

  init() {
  //resources.eraser
    for (const tile of this.tiles) {
      this.drawTile(tile)
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
    render()
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

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const i in level) {
    const row = level[i]
    for (const j in row) {
      const tile = row[j]
      ctx.drawImage(tilesDB.getTileImage(tile), i * TILE_W, j * TILE_H, TILE_W, TILE_H)
    }
  }
}

function resize() {
  const levelEl = document.getElementsByClassName('level')[0]
  canvas.width = levelEl.offsetWidth
  canvas.height = levelEl.offsetHeight
  render()
}

const toolbox = new Toolbox(resources.tiles)
const tilesDB = new TilesDB()

tilesDB.load(() => {
  toolbox.init()
  render()
  window.addEventListener('resize', resize)
  resize()
})
