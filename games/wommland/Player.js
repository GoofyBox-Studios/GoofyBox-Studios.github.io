/* global Input Sprite Vector2 Colour CollisionShape shake PlayerBubble */

const playerSprite = new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Womm.png?v=1714367477146");
const playerHatSprite = new Sprite("https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/WommHat.png?v=1714368198253");

class Player {
  constructor(position) {
    this.position = new Vector2(position);
    this.velocity = new Vector2(0, 0);
    this.flipH = false;
    this.idleTime = 0;
    this.walkTime = 0;
    this.frame = 0;
    this.isOnFloor = false;
    this.canQuickStopJump = false;
    this.coyoteTime = 0;
    this.jumpBuffer = 0;
    this.turnAroundTime = 0;
    this.jumpIndex = 0;
    this.squish = 1.0;
    this.timeBeforeAutoJump = 0;
    
    this.collision = new CollisionShape(this.position.x, this.position.y, 5.5, 6);
    this.bubble = new PlayerBubble(this.position);
    
    this.MOVE_SPEED   = 1.2;
    this.SLIDE        = 0.5;
    this.GRAVITY      = 0.19;
    this.FALL_GRAVITY = 0.25;
    this.JUMP_FORCE   = 2.9;
  }
  
  isColliding() {
    this.collision.update(this.position.x, this.position.y);
    
    return this.collision.collidesWithTile() || this.position.x < 4;
  }
  
  update() {
    this.coyoteTime--;
    this.jumpBuffer--;
    this.turnAroundTime--;
    if (this.isOnFloor) this.timeBeforeAutoJump--;
    
    if (this.squish > 1.0) this.squish += (1.0 - this.squish) * 0.2;
    if (this.squish < 1.0) this.squish += (1.0 - this.squish) * 0.1;
    
    let move = 0;
    if (Input.is_action_pressed("moveRight")) move++;
    if (Input.is_action_pressed("moveLeft"))  move--;
    
    if (move == -1) {
      this.velocity.x -= this.MOVE_SPEED;
      this.flipH = true;
      if (this.velocity.x > 0.5) this.turnAroundTime = 5;
    } else if (move == 1) {
      this.velocity.x += this.MOVE_SPEED;
      this.flipH = false;
      if (this.velocity.x < 0.5) this.turnAroundTime = 5;
    }
    
    if (move != 0 && this.isOnFloor) {
      this.walkTime += 0.2;
      this.idleTime = 0.0;
      Input.start_joy_vibration(0, 0.02, 5);
    } else {
      this.walkTime = 0.0;
      this.idleTime += 0.1;
    }
    
    this.velocity.x *= this.SLIDE;
    
    if (this.velocity.y > 0) {
      this.velocity.y += this.FALL_GRAVITY;
    } else {
      this.velocity.y += this.GRAVITY;
      
      if (this.canQuickStopJump && !Input.is_action_pressed("jump")) {
        this.canQuickStopJump = false;
        this.velocity.y *= 0.5;
      }
    }
    
    if (Input.is_action_pressed("fly")) {
      this.squish = 2.0 ** (Math.random() * 2 - 1);
      this.velocity.y = 0;
      Input.start_joy_vibration(0, 0.3, 1);
    }
    
    
    if (Input.is_action_just_pressed("jump")) this.jumpBuffer = 10;
    
    this.isOnFloor = false;
    this.position.y += this.velocity.y;
    if (this.isColliding()) {
      this.position.y = Math.round(this.position.y);
      while (this.isColliding()) {
        this.position.y -= Math.sign(this.velocity.y || 1);
      }
      
      this.isOnFloor = this.velocity.y > 0;
      
      if (Math.abs(this.velocity.y) > 1) {
        shake = Math.max(shake, Math.abs(this.velocity.y) * 4);
        this.squish = 1.4;
        Input.start_joy_vibration(0, 0.5, 50);
      }
      
      this.velocity.y = 0;
      
      if (this.isOnFloor) this.coyoteTime = 5;
    }
    
    this.position.x += this.velocity.x;
    if (this.isColliding()) {
      this.position.x = Math.round(this.position.x);
      while (this.isColliding()) {
        this.position.x -= Math.sign(this.velocity.x || 1);
      }
      
      this.velocity.x = 0;
    }
    
    
    if (this.coyoteTime > 0 && (this.jumpBuffer > 0 || (Input.is_action_pressed("jump") && this.timeBeforeAutoJump <= 0))) {
      this.velocity.y = -this.JUMP_FORCE;
      this.canQuickStopJump = true;
      this.coyoteTime = 0;
      this.jumpBuffer = 0;
      this.jumpIndex = 1 - this.jumpIndex;
      this.squish = 0.65;
      this.timeBeforeAutoJump = 5;
    }
    
    this.frame = 0;
    if (this.isOnFloor) {
      if (this.walkTime != 0) {
        this.squish = Math.max(this.squish, Math.cos(this.walkTime * 2.0) * 0.1 + 1.0);
      } else {
        this.squish = Math.max(this.squish, Math.cos(this.idleTime) * 0.05 + 1.0);
      }
    }
    
    this.bubble.update(this);
  }
  
  draw(ctx) {
    ctx.translate(this.position.x, this.position.y + 4);
    ctx.scale(this.squish, 1.0 / this.squish);
    ctx.translate(0, -4);
    if (this.flipH) ctx.scale(-1, 1);
    ctx.drawImage(playerSprite, (this.frame % 2) * 10, Math.floor(this.frame / 2) * 10, 10, 10, -5, -5, 10, 10);
    ctx.rotate(-0.05 * Math.PI);
    ctx.drawImage(playerHatSprite, -4.7, -9.5);
    ctx.rotate(0.05 * Math.PI);
    if (this.flipH) ctx.scale(-1, 1);
    ctx.translate(0, 4);
    ctx.scale(1.0 / this.squish, this.squish);
    ctx.translate(-this.position.x, -this.position.y - 4);
  }
}