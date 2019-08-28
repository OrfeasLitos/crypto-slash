// TODO: use proper "imports"
// TODO: typescript

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const tiles = {}
let selectedLi = null
let selectedTile = null

// TODO: async/await
function loadTiles(onloaded) {
  const ul = document.getElementsByClassName('tools')[0]
  let numLoaded = 0

  for (const tile of resources.tiles) {
    const li = document.createElement('li')
    const img = new Image()

    img.addEventListener('load', () => {
      ++numLoaded
      if (numLoaded == resources.tiles.length) {
        onloaded()
      }
    })
    img.src = '../../resources/tiles/' + tile + '.png'
    img.id = 'tile-' + tile
    img.tile = tile
    tiles[tile] = img
    img.addEventListener('click', (e) => {
      if (selectedLi != null) {
        selectedLi.className = ''
      }
      e.target.parentNode.className = 'selected'
      selectedLi = e.target.parentNode
      selectedTile = e.target.tile
    })
    li.appendChild(img)
    ul.appendChild(li)
  }
}

let TILE_W = 80, TILE_H = 80
let level = [['box', 'box', 'bridge'], ['bridge', 'bridge', 'box'], ['box', 'box', 'box']]
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
    level[x][y] = selectedTile
    render()
  }
}
canvas.addEventListener('mousedown', (e) => {
  if (selectedTile != null) {
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
      ctx.drawImage(tiles[tile], i * TILE_W, j * TILE_H, TILE_W, TILE_H)
    }
  }
}

function resize() {
  const levelEl = document.getElementsByClassName('level')[0]
  canvas.width = levelEl.offsetWidth
  canvas.height = levelEl.offsetHeight
  render()
}

loadTiles(() => {
  render()
  window.addEventListener('resize', resize)
  resize()
})
