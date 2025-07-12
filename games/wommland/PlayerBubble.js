/* global Input Sprite Vector2 Colour CollisionShape shake */

const playerBubbleSprite = new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Bubble.png?v=1714372202452");

class PlayerBubble {
  constructor(position) {
    this.position = new Vector2(position);
    this.position.x -= 12;
    this.position.y -= 8;
    this.velocity = new Vector2(0, 0);
    this.flipH = false;
    this.time = 0;
  }
  
  update(player) {
    this.time++;
    
    const toX = player.position.x + (player.flipH * 24 - 12) + Math.sin(this.time * 0.035) * 3 * (this.flipH * 2 - 1);
    const toY = player.position.y - 8 + Math.cos(this.time * 0.059) * 3;
    this.velocity.x += (toX - this.position.x) * 0.01;
    this.velocity.y += (toY - this.position.y) * 0.01;
    this.velocity.multiplyScalar(0.9);
    this.position.add(this.velocity);
    
    this.flipH = this.position.x > player.position.x;
  }
  
  draw(ctx) {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);

    // Add three color stops
    gradient.addColorStop(0.0, "#00999999");
    gradient.addColorStop(0.8, "#ffffff00");
    
    ctx.fillStyle = gradient;
    
    ctx.globalAlpha = 0.75;
    ctx.translate( this.position.x,  this.position.y);
    if (this.flipH) ctx.scale(-1, 1);
    
    ctx.globalCompositeOperation = "lighten";
    ctx.fillRect(-15, -15, 30, 30);
    ctx.globalCompositeOperation = "source-over";
    
    ctx.drawImage(playerBubbleSprite, -4, -4);
    if (this.flipH) ctx.scale(-1, 1);
    ctx.translate(-this.position.x, -this.position.y);
    ctx.globalAlpha = 1;
  }
}