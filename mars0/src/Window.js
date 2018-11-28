
export function drawWindow(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.fillRect(x, y, w, h)
  ctx.strokeStyle = 'white'
  ctx.strokeRect(x, y, w, h)
}

