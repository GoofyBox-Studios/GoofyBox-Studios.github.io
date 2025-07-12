class Vector2 {
  constructor(x, y) {
    if (typeof x == "object") {
      this.x = x.x ?? 0;
      this.y = x.y ?? 0;
    } else {
      this.x = x ?? 0;
      this.y = y ?? 0;
    }
  }
  
  distanceTo(vector) {
    return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
  }
  
  // Standard
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    
    return this;
  }
  
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    
    return this;
  }
  
  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    
    return this;
  }
  
  divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
    
    return this;
  }
  
  // Scalar
  addScalar(scalar) {
    this.x += scalar;
    this.y += scalar;
    
    return this;
  }
  
  subtractScalar(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    
    return this;
  }
  
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    
    return this;
  }
  
  divideScalar(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    
    return this;
  }
  
  // New Vector
  added(vector) {
    return new Vector2(
      this.x + vector.x,
      this.y + vector.y,
    );
  }
  
  subtracted(vector) {
    return new Vector2(
      this.x - vector.x,
      this.y - vector.y,
    );
  }
  
  multiplied(vector) {
    return new Vector2(
      this.x * vector.x,
      this.y * vector.y,
    );
  }
  
  divided(vector) {
    return new Vector2(
      this.x / vector.x,
      this.y / vector.y,
    );
  }
  
  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  
  setLength(newLength) {
    const currentLength = this.length();
    
    if (currentLength == 0) return this;
    
    this.x = this.x / currentLength * newLength;
    this.y = this.y / currentLength * newLength;
    
    return this;
  }
  
  clone() {
    return new Vector2(this.x, this.y);
  }
  
  copy(vector) {
    this.x = vector.x;
    this.y = vector.y;
    
    return this;
  }
}