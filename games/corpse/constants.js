/* global Struct */

const UV = new Struct("x", "y", "width", "height", { x: 0, y: 0, width: 16, height: 16 });

const Cell = new Struct("id", "uv");

const Collision = new Struct("width", "height", "offsetX", "offsetY", { offsetX: 0, offsetY: 0 });
const RoundCollision = new Struct("radius", "offsetX", "offsetY", { offsetX: 0, offsetY: 0, round: true });