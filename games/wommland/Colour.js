class Colour {
  constructor(r = 0, g = 0, b = 0, a = 1) {
    this._r = Math.max(Math.min(r, 1), 0);
    this._g = Math.max(Math.min(g, 1), 0);
    this._b = Math.max(Math.min(b, 1), 0);
    this._a = Math.max(Math.min(a, 1), 0);
  }
  
  get r() {
    return this._r;
  }
  
  get g() {
    return this._g;
  }
  
  get b() {
    return this._b;
  }
  
  get a() {
    return this._a;
  }
  
  set r(value) {
    this._r = Math.max(Math.min(value, 1), 0);
  }
  
  set g(value) {
    this._g = Math.max(Math.min(value, 1), 0);
  }
  
  set b(value) {
    this._b = Math.max(Math.min(value, 1), 0);
  }
  
  set a(value) {
    this._a = Math.max(Math.min(value, 1), 0);
  }
  
  get hex() {
    return "#" +
      Math.floor(this.r * 255).toString(16).padStart(2, "0") +
      Math.floor(this.g * 255).toString(16).padStart(2, "0") +
      Math.floor(this.b * 255).toString(16).padStart(2, "0");
  }
}

Colour.fromHSV = function (h, s, v) {
  var r, g, b, i, f, p, q, t;

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return new Colour(r, g, b);
}