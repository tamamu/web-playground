
import "./queue"
import "./keyboard"
import "./renderable"
import Game from "./game"
import MarsZero from "./main"

window.onload = () => {
  let root = document.querySelector('#root')
  let game = new Game(root, MarsZero)
  game.size(12*32, 8*32)
  game.screen.style.width="600px";
  game.screen.style.height="400px";
  game.mainLoop()
}
