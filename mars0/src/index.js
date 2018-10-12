
import "./queue"
import "./keyboard"
import "./renderable"
import Game from "./game"
import MarsZero from "./main"

window.onload = () => {
  let root = document.querySelector('#root')
  let game = new Game(root, MarsZero)
  game.size(800, 600)
  game.screen.style.width="800px";
  game.screen.style.height="600px";
  game.mainLoop()
}
