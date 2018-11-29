
import "./queue"
import "./keyboard"
import "./renderable"
import Game from "./game"
import MarsZero from "./main"

window.onload = () => {
  console.log(window.SP)
  let root = document.querySelector('#root')
  let keys = window.SP ? {
    left: document.querySelector('#left'),
    up: document.querySelector('#up'),
    right: document.querySelector('#right'),
    down: document.querySelector('#down'),
    space: document.querySelector('#space'),
    shift: document.querySelector('#shift'),
    option: document.querySelector('#option'),
    j: document.querySelector('#j'),
    fullscreen: document.querySelector('#fullscreen')
  } : null
  let game = new Game(root, MarsZero, keys)
  game.size(800, 600)
  if (window.SP) {
    document.body.onwebkitfullscreenchange = () => {
      game.screen.style.height=`${window.innerHeight}px`
      game.screen.style.width=`${window.innerHeight * (4/3)}px`
    }
  }
  if (window.SP) {
    game.screen.style.height=`${window.innerHeight}px`
    game.screen.style.width=`${window.innerHeight * (4/3)}px`
  } else {
    game.screen.style.width="800px";
    game.screen.style.height="600px";
  }
  game.mainLoop()
}
