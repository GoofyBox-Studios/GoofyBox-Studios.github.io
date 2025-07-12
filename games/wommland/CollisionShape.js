/* global cellData map */

class CollisionShape {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  update(x, y, w = this.w, h = this.h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  collidesWithTile() {
    const minX = Math.floor((this.x - this.w / 2) / 8);
    const minY = Math.floor((this.y - this.h / 2) / 8);
    const maxX = Math.ceil ((this.x + this.w / 2) / 8);
    const maxY = Math.ceil ((this.y + this.h / 2) / 8);
    
    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        const cell = map[y]?.[x] ?? [1, 0];
        
        if (cellData[cell]?.solid) return true;
      }
    }
    
    return false;
  }
}