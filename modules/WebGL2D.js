const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aUV;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 UV;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  UV = aUV;
}
`;

const fsSource = `
precision mediump float;

uniform float TIME;
varying vec2 UV;

void main() {
  vec4 COLOR = vec4(0.0, 0.0, 0.0, 1.0);
  
  if (UV.y < cos(UV.x * 8.0 + TIME) * 0.125 + 0.25) {
    COLOR.r = 1.0;
  } else {
    if (UV.y < cos(UV.x * 8.0 - TIME) * 0.125 + 0.75) {
      COLOR.g = 1.0;
    } else {
      COLOR.b = 1.0;
    }
  }
  
  gl_FragColor = COLOR;
}
`;

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram,
      )}`,
    );
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);
  const uvBuffer = initUVBuffer(gl);

  return {
    position: positionBuffer,
    uv: uvBuffer,
  };
}

function initPositionBuffer(gl) {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initUVBuffer(gl) {
  const uvBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  const positions = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return uvBuffer;
}

function drawScene(gl, programInfo, buffers, time) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (20 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0],
  ); // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);
  setUVAttribute(gl, buffers, programInfo);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );
  gl.uniform1f(
    programInfo.uniformLocations.TIME,
    time
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setUVAttribute(gl, buffers, programInfo) {
  if (programInfo.attribLocations.UV == -1) return;
  
  const numComponents = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
  gl.vertexAttribPointer(
    programInfo.attribLocations.UV,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.UV);
}






class WebGL2D {
  constructor(ctx) {
    this.time = 0;
    this.last = Date.now();
    
    this.ctx = ctx;
    this.shaderProgram = initShaderProgram(this.ctx, vsSource, fsSource);
    this.programInfo = {
      program: this.shaderProgram,
      attribLocations: {
        vertexPosition: this.ctx.getAttribLocation(this.shaderProgram, "aVertexPosition"),
        UV: this.ctx.getAttribLocation(this.shaderProgram, "aUV"),
      },
      uniformLocations: {
        projectionMatrix: this.ctx.getUniformLocation(this.shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: this.ctx.getUniformLocation(this.shaderProgram, "uModelViewMatrix"),
        TIME: this.ctx.getUniformLocation(this.shaderProgram, "TIME"),
      },
    };
    this.buffers = initBuffers(this.ctx);
  }
  
  get canvas() {
    return this.ctx.canvas;
  }
  
  fillRect() {}
  fillText() {}
  resetTransform() {}
  clearRect() {}
  scale() {}
  translate() {}
  drawImage() {}
  
  update() {
    let delta = Date.now() - this.last;
    this.time += delta / 1000;
    this.last = Date.now();
    
    drawScene(this.ctx, this.programInfo, this.buffers, this.time);
  }
}