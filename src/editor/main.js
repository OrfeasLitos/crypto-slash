// TODO: use proper "imports"
// TODO: typescript

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let TILE_W = 80, TILE_H = 80
let drawing = false

class Level {
  constructor() {
    this.board = [['box', 'box', 'bridge'], ['bridge', 'bridge', 'box'], ['box', 'box', 'box']]
  }

  setLocation(x, y, tileName) {
    if (!(y in this.board)) {
      this.board[y] = []
    }
    this.board[y][x] = tileName
  }

  map(f) {
    for (const i in this.board) {
      const row = this.board[i]
      for (const j in row) {
        const tileName = row[j]
        f(i, j, tileName)
      }
    }
  }
}
const level = new Level()

class Tile {
  constructor(name, src) {
    this.img = new Image()
    this.src = src
    this.loaded = false
  }

  load() {
    return new Promise((resolve, reject) => {
      this.img.addEventListener('load', () => {
        this.loaded = true
        resolve()
      })
      this.img.src = this.src
    })
  }
}

class TilesDB {
  constructor() {
    this.tiles = {}
    this.loaded = false
  }

  _loadTile(tileName) {
    const src = '../../resources/tiles/' + tileName + '.png'
    const tile = new Tile(tileName, src)
    this.tiles[tileName] = tile
    return tile.load()
  }

  async load() {
    const loadPromises = []
    for (const tile of resources.tiles) {
      loadPromises.push(this._loadTile(tile))
    }
    await Promise.all(loadPromises)
    this.loaded = true
  }

  getTile(tile) {
    return this.tiles[tile]
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
    const src = tilesDB.getTile(tile).src
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

function hitTest(x, y) {
  return [Math.floor(x / TILE_W), Math.floor(y / TILE_H)]
}

function mousemove(e) {
  if (drawing) {
    const [x, y] = hitTest(
      e.clientX - e.target.offsetLeft,
      e.clientY - e.target.offsetTop
    )
    level.setLocation(x, y, toolbox.selectedTile)
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
  requestAnimationFrame(render)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  level.map((y, x, tileName) => {
    const tile = tilesDB.getTile(tileName)
    if (tile.loaded) {
      ctx.drawImage(tile.img, x * TILE_W, y * TILE_H, TILE_W, TILE_H)
    }
  })
}

function resize() {
  const levelEl = document.getElementsByClassName('level')[0]
  canvas.width = levelEl.offsetWidth
  canvas.height = levelEl.offsetHeight
}

const toolbox = new Toolbox(resources.tiles)
const tilesDB = new TilesDB()

;(async () => {
  const loaded = tilesDB.load()
  resize()
  render()
  await loaded
  toolbox.init()
  window.addEventListener('resize', resize)
})()
