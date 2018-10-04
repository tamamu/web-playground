
import "./queue"
import "./keyboard"
import "./renderable"
import Game from "./game"
import MarsZero from "./main"

window.onload = () => {
  let root = document.querySelector('#root')
  let game = new Game(root, MarsZero)
  game.size(320, 240)
  game.mainLoop()
}
