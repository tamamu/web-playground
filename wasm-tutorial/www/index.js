import {greet, Universe} from "wasm-tutorial";
import {memory} from 'wasm-tutorial/wasm_tutorial_bg'

greet("cddadr");

const univ = Universe.new();
const w = univ.width();
const h = univ.height();

const cellsPtr = univ.cells();
const cells = new Uint8Array(memory.buffer, cellsPtr, w * h)

console.log(cells[0]);
