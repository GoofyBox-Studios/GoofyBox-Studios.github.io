var beepbox = (function (t) {
  "use strict";
  /*!
    Copyright (c) 2012-2022 John Nesky and contributing authors

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
    of the Software, and to permit persons to whom the Software is furnished to do
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */ class e {}
  function n(t) {
    let e = 0;
    for (let n = 0; n < t.length; n++) e += t[n];
    const n = e / t.length;
    for (let e = 0; e < t.length; e++) t[e] -= n;
    return a(t), t.push(0), new Float32Array(t);
  }
  function i(t) {
    let e = 0;
    n(t);
    for (let n = 0; n < t.length - 1; n++) e += Math.abs(t[n]);
    const i = e / (t.length - 1);
    for (let e = 0; e < t.length - 1; e++) t[e] = t[e] / i;
    return new Float32Array(t);
  }
  function a(t) {
    let e = 0,
      n = new Float32Array(t.length);
    for (let i = 0; i < t.length; i++) (n[i] = e), (e += t[i]);
    return n;
  }
  function r(t) {
    return t / (2 * e.pulseWidthRange);
  }
  function o(t, n, i) {
    let a = e.chipNoises[t].samples;
    if (null == a) {
      if (
        ((a = new Float32Array(e.chipNoiseLength + 1)),
        (e.chipNoises[t].samples = a),
        0 == t)
      ) {
        let t = 1;
        for (let n = 0; n < e.chipNoiseLength; n++) {
          a[n] = 2 * (1 & t) - 1;
          let e = t >> 1;
          1 == ((t + e) & 1) && (e += 16384), (t = e);
        }
      } else if (1 == t)
        for (let t = 0; t < e.chipNoiseLength; t++)
          a[t] = 2 * Math.random() - 1;
      else if (2 == t) {
        let t = 1;
        for (let n = 0; n < e.chipNoiseLength; n++) {
          a[n] = 2 * (1 & t) - 1;
          let e = t >> 1;
          1 == ((t + e) & 1) && (e += 32768), (t = e);
        }
      } else if (3 == t) {
        let t = 1;
        for (let n = 0; n < e.chipNoiseLength; n++) {
          a[n] = 2 * (1 & t) - 1;
          let e = t >> 1;
          1 == ((t + e) & 1) && (e += 40), (t = e);
        }
      } else if (4 == t)
        s(a, e.chipNoiseLength, 10, 11, 1, 1, 0),
          s(a, e.chipNoiseLength, 11, 14, 0.6578, 0.6578, 0),
          n(a, e.chipNoiseLength),
          i(a, 1 / Math.sqrt(e.chipNoiseLength));
      else if (5 == t)
        for (var r = 1, o = 0; o < e.chipNoiseLength; o++) {
          (a[o] = 2 * (1 & r) - 1),
            1 == ((r + (l = r >> 1)) & 1) && (l += 40),
            (r = l);
        }
      else if (6 == t)
        s(a, e.chipNoiseLength, 1, 10, 1, 1, 0),
          s(a, e.chipNoiseLength, 20, 14, -2, -2, 0),
          n(a, e.chipNoiseLength),
          i(a, 1 / Math.sqrt(e.chipNoiseLength));
      else if (7 == t)
        for (r = 1, o = 0; o < e.chipNoiseLength; o++) {
          (a[o] = 4 * (1 & r) * (14 * Math.random() + 1) - 8),
            1 == ((r + (l = r >> 1)) & 1) && (l += 60),
            (r = l);
        }
      else {
        if (8 != t) throw new Error("Unrecognized drum index: " + t);
        for (r = 1, o = 0; o < 32768; o++) {
          var l;
          (a[o] = (1 & r) / 2 - 0.5),
            1 == ((r + (l = r >> 1)) & 1) && (l -= 40),
            (r = l);
        }
      }
      a[e.chipNoiseLength] = a[0];
    }
    return a;
  }
  function s(t, e, n, i, a, r, s) {
    const l = 0 | Math.pow(2, n),
      c = Math.min(e >> 1, 0 | Math.pow(2, i)),
      h = o(0, null, null);
    let p = 0;
    for (let o = l; o < c; o++) {
      let l = a + ((r - a) * (Math.log2(o) - n)) / (i - n),
        c = Math.pow(2, 7 * (l - 1) + 1) * l;
      (c *= Math.pow(o / 2048, s)), (p += c), (c *= h[o]);
      const d = 0.61803398875 * o * o * Math.PI * 2;
      (t[o] = Math.cos(d) * c), (t[e - o] = Math.sin(d) * c);
    }
    return p;
  }
  function l(t = 0) {
    const n = new Float32Array(e.sineWaveLength + 1),
      i = e.sineWaveLength / 4;
    for (let a = 0; a < e.sineWaveLength + 1; a++)
      n[a] =
        2 *
          +(
            Math.abs(a - i) < (t * e.sineWaveLength) / 2 ||
            Math.abs(a - e.sineWaveLength - i) < (t * e.sineWaveLength) / 2
          ) -
        1;
    return n;
  }
  function c(t = !1) {
    const n = new Float32Array(e.sineWaveLength + 1);
    for (let i = 0; i < e.sineWaveLength + 1; i++)
      (n[i] = (((2 * (i + e.sineWaveLength / 4)) / e.sineWaveLength) % 2) - 1),
        (n[i] = t ? -n[i] : n[i]);
    return n;
  }
  function h(t, n, i) {
    let a = e.arpeggioPatterns[t - 1];
    return null != a
      ? (2 == t && 0 == n && (a = [0, 0, 1, 1]), a[i % a.length])
      : i % t;
  }
  function p(t) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n];
      (i.index = n), (e[i.name] = i);
    }
    const n = t;
    return (n.dictionary = e), n;
  }
  function d(t) {
    return !!(1024 & t);
  }
  function m(t) {
    return !!(2048 & t);
  }
  function u(t) {
    return !!(128 & t);
  }
  function f(t) {
    return !!(256 & t);
  }
  function y(t) {
    return !!(512 & t);
  }
  function b(t) {
    return !!(32 & t);
  }
  function g(t) {
    return !!(8 & t);
  }
  function v(t) {
    return !!(16 & t);
  }
  function k(t) {
    return !!(4 & t);
  }
  function w(t) {
    return !!(2 & t);
  }
  function M(t) {
    return !!(64 & t);
  }
  function F(t) {
    return !!(1 & t);
  }
  (e.thresholdVal = -10),
    (e.kneeVal = 40),
    (e.ratioVal = 12),
    (e.attackVal = 0),
    (e.releaseVal = 0.25),
    (e.scales = p([
      {
        name: "Free",
        realName: "chromatic",
        flags: [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0],
      },
      {
        name: "Major",
        realName: "ionian",
        flags: [!0, !1, !0, !1, !0, !0, !1, !0, !1, !0, !1, !0],
      },
      {
        name: "Minor",
        realName: "aeolian",
        flags: [!0, !1, !0, !0, !1, !0, !1, !0, !0, !1, !0, !1],
      },
      {
        name: "Mixolydian",
        realName: "mixolydian",
        flags: [!0, !1, !0, !1, !0, !0, !1, !0, !1, !0, !0, !1],
      },
      {
        name: "Lydian",
        realName: "lydian",
        flags: [!0, !1, !0, !1, !0, !1, !0, !0, !1, !0, !1, !0],
      },
      {
        name: "Dorian",
        realName: "dorian",
        flags: [!0, !1, !0, !0, !1, !0, !1, !0, !1, !0, !0, !1],
      },
      {
        name: "Phrygian",
        realName: "phrygian",
        flags: [!0, !0, !1, !0, !1, !0, !1, !0, !0, !1, !0, !1],
      },
      {
        name: "Locrian",
        realName: "locrian",
        flags: [!0, !0, !1, !0, !1, !0, !0, !1, !0, !1, !0, !1],
      },
      {
        name: "Lydian Dominant",
        realName: "lydian dominant",
        flags: [!0, !1, !0, !1, !0, !1, !0, !0, !1, !0, !0, !1],
      },
      {
        name: "Phrygian Dominant",
        realName: "phrygian dominant",
        flags: [!0, !0, !1, !1, !0, !0, !1, !0, !0, !1, !0, !1],
      },
      {
        name: "Harmonic Major",
        realName: "harmonic major",
        flags: [!0, !1, !0, !1, !0, !0, !1, !0, !0, !1, !1, !0],
      },
      {
        name: "Harmonic Minor",
        realName: "harmonic minor",
        flags: [!0, !1, !0, !0, !1, !0, !1, !0, !0, !1, !1, !0],
      },
      {
        name: "Melodic Minor",
        realName: "melodic minor",
        flags: [!0, !1, !0, !0, !1, !0, !1, !0, !1, !0, !1, !0],
      },
      {
        name: "Blues",
        realName: "blues",
        flags: [!0, !1, !1, !0, !1, !0, !0, !0, !1, !1, !0, !1],
      },
      {
        name: "Altered",
        realName: "altered",
        flags: [!0, !0, !1, !0, !0, !1, !0, !1, !0, !1, !0, !1],
      },
      {
        name: "Major Pentatonic",
        realName: "major pentatonic",
        flags: [!0, !1, !0, !1, !0, !1, !1, !0, !1, !0, !1, !1],
      },
      {
        name: "Minor Pentatonic",
        realName: "minor pentatonic",
        flags: [!0, !1, !1, !0, !1, !0, !1, !0, !1, !1, !0, !1],
      },
      {
        name: "Whole Tone",
        realName: "whole tone",
        flags: [!0, !1, !0, !1, !0, !1, !0, !1, !0, !1, !0, !1],
      },
      {
        name: "Octatonic",
        realName: "octatonic",
        flags: [!0, !1, !0, !0, !1, !0, !0, !1, !0, !0, !1, !0],
      },
      {
        name: "Hexatonic",
        realName: "hexatonic",
        flags: [!0, !1, !1, !0, !0, !1, !1, !0, !0, !1, !1, !0],
      },
      {
        name: "Goofy-onic",
        realName: "goofyonic",
        flags: [!0, !0, !0, !0, !0, !0, !1, !1, !1, !1, !1, !1],
      },
    ])),
    (e.keys = p([
      { name: "C", isWhiteKey: !0, basePitch: 12 },
      { name: "C♯", isWhiteKey: !1, basePitch: 13 },
      { name: "D", isWhiteKey: !0, basePitch: 14 },
      { name: "D♯", isWhiteKey: !1, basePitch: 15 },
      { name: "E", isWhiteKey: !0, basePitch: 16 },
      { name: "F", isWhiteKey: !0, basePitch: 17 },
      { name: "F♯", isWhiteKey: !1, basePitch: 18 },
      { name: "G", isWhiteKey: !0, basePitch: 19 },
      { name: "G♯", isWhiteKey: !1, basePitch: 20 },
      { name: "A", isWhiteKey: !0, basePitch: 21 },
      { name: "A♯", isWhiteKey: !1, basePitch: 22 },
      { name: "B", isWhiteKey: !0, basePitch: 23 },
    ])),
    (e.blackKeyNameParents = [-1, 1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1]),
    (e.tempoMin = 30),
    (e.tempoMax = 320),
    (e.echoDelayRange = 48),
    (e.echoDelayStepTicks = 4),
    (e.echoSustainRange = 8),
    (e.echoShelfHz = 4e3),
    (e.echoShelfGain = Math.pow(2, -0.5)),
    (e.reverbShelfHz = 8e3),
    (e.reverbShelfGain = Math.pow(2, -1.5)),
    (e.reverbRange = 64),
    (e.reverbDelayBufferSize = 16384),
    (e.reverbDelayBufferMask = e.reverbDelayBufferSize - 1),
    (e.beatsPerBarMin = 3),
    (e.beatsPerBarMax = 16),
    (e.barCountMin = 1),
    (e.barCountMax = 256),
    (e.instrumentCountMin = 1),
    (e.layeredInstrumentCountMax = 4),
    (e.patternInstrumentCountMax = 10),
    (e.partsPerBeat = 24),
    (e.ticksPerPart = 2),
    (e.ticksPerArpeggio = 3),
    (e.arpeggioPatterns = [
      [0],
      [0, 1],
      [0, 1, 2, 1],
      [0, 1, 2, 3],
      [0, 1, 2, 3, 4],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 1, 2, 3, 4, 5, 6, 7],
    ]),
    (e.rhythms = p([
      {
        name: "÷3 (triplets)",
        stepsPerBeat: 3,
        roundUpThresholds: [5, 12, 18],
      },
      {
        name: "÷4 (standard)",
        stepsPerBeat: 4,
        roundUpThresholds: [3, 9, 17, 21],
      },
      { name: "÷5", stepsPerBeat: 5, roundUpThresholds: null },
      { name: "÷6", stepsPerBeat: 6, roundUpThresholds: null },
      { name: "÷8", stepsPerBeat: 8, roundUpThresholds: null },
      { name: "freehand", stepsPerBeat: 24, roundUpThresholds: null },
    ])),
    (e.instrumentTypeNames = [
      "chip",
      "FM",
      "noise",
      "spectrum",
      "drumset",
      "harmonics",
      "PWM",
      "Picked String",
      "supersaw",
      "custom chip",
      "mod",
    ]),
    (e.instrumentTypeHasSpecialInterval = [
      !0,
      !0,
      !1,
      !1,
      !1,
      !0,
      !1,
      !1,
      !1,
      !1,
    ]),
    (e.chipBaseExpression = 0.03375),
    (e.fmBaseExpression = 0.03),
    (e.noiseBaseExpression = 0.19),
    (e.spectrumBaseExpression = 0.3),
    (e.drumsetBaseExpression = 0.45),
    (e.harmonicsBaseExpression = 0.025),
    (e.pwmBaseExpression = 0.04725),
    (e.supersawBaseExpression = 0.061425),
    (e.pickedStringBaseExpression = 0.025),
    (e.distortionBaseVolume = 0.011),
    (e.bitcrusherBaseVolume = 0.01),
    (e.rawChipWaves = p([
      {
        name: "rounded",
        expression: 0.94,
        samples: n([
          0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.2,
          0, -0.2, -0.4, -0.5, -0.6, -0.7, -0.8, -0.85, -0.9, -0.95, -1, -1, -1,
          -1, -1, -1, -1, -1, -1, -1, -1, -0.95, -0.9, -0.85, -0.8, -0.7, -0.6,
          -0.5, -0.4, -0.2,
        ]),
      },
      {
        name: "triangle",
        expression: 1,
        samples: n([
          1 / 15,
          0.2,
          5 / 15,
          7 / 15,
          0.6,
          11 / 15,
          13 / 15,
          1,
          1,
          13 / 15,
          11 / 15,
          0.6,
          7 / 15,
          5 / 15,
          0.2,
          1 / 15,
          -1 / 15,
          -0.2,
          -5 / 15,
          -7 / 15,
          -0.6,
          -11 / 15,
          -13 / 15,
          -1,
          -1,
          -13 / 15,
          -11 / 15,
          -0.6,
          -7 / 15,
          -5 / 15,
          -0.2,
          -1 / 15,
        ]),
      },
      { name: "square", expression: 0.5, samples: n([1, -1]) },
      { name: "1/4 pulse", expression: 0.5, samples: n([1, -1, -1, -1]) },
      {
        name: "1/8 pulse",
        expression: 0.5,
        samples: n([1, -1, -1, -1, -1, -1, -1, -1]),
      },
      {
        name: "sawtooth",
        expression: 0.65,
        samples: n([
          1 / 31,
          3 / 31,
          5 / 31,
          7 / 31,
          9 / 31,
          11 / 31,
          13 / 31,
          15 / 31,
          17 / 31,
          19 / 31,
          21 / 31,
          23 / 31,
          25 / 31,
          27 / 31,
          29 / 31,
          1,
          -1,
          -29 / 31,
          -27 / 31,
          -25 / 31,
          -23 / 31,
          -21 / 31,
          -19 / 31,
          -17 / 31,
          -15 / 31,
          -13 / 31,
          -11 / 31,
          -9 / 31,
          -7 / 31,
          -5 / 31,
          -3 / 31,
          -1 / 31,
        ]),
      },
      {
        name: "double saw",
        expression: 0.5,
        samples: n([
          0, -0.2, -0.4, -0.6, -0.8, -1, 1, -0.8, -0.6, -0.4, -0.2, 1, 0.8, 0.6,
          0.4, 0.2,
        ]),
      },
      {
        name: "double pulse",
        expression: 0.4,
        samples: n([1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1]),
      },
      { name: "spiky", expression: 0.4, samples: n([1, -1, 1, -1, 1, 0]) },
      {
        name: "sine",
        expression: 0.88,
        samples: i([
          8, 9, 11, 12, 13, 14, 15, 15, 15, 15, 14, 14, 13, 11, 10, 9, 7, 6, 4,
          3, 2, 1, 0, 0, 0, 0, 1, 1, 2, 4, 5, 6,
        ]),
      },
      {
        name: "flute",
        expression: 0.8,
        samples: i([3, 4, 6, 8, 10, 11, 13, 14, 15, 15, 14, 13, 11, 8, 5, 3]),
      },
      {
        name: "harp",
        expression: 0.8,
        samples: i([
          0, 3, 3, 3, 4, 5, 5, 6, 7, 8, 9, 11, 11, 13, 13, 15, 15, 14, 12, 11,
          10, 9, 8, 7, 7, 5, 4, 3, 2, 1, 0, 0,
        ]),
      },
      {
        name: "sharp clarinet",
        expression: 0.38,
        samples: i([
          0, 0, 0, 1, 1, 8, 8, 9, 9, 9, 8, 8, 8, 8, 8, 9, 9, 7, 9, 9, 10, 4, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]),
      },
      {
        name: "soft clarinet",
        expression: 0.45,
        samples: i([
          0, 1, 5, 8, 9, 9, 9, 9, 9, 9, 9, 11, 11, 12, 13, 12, 10, 9, 7, 6, 4,
          3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1,
        ]),
      },
      {
        name: "alto sax",
        expression: 0.3,
        samples: i([
          5, 5, 6, 4, 3, 6, 8, 7, 2, 1, 5, 6, 5, 4, 5, 7, 9, 11, 13, 14, 14, 14,
          14, 13, 10, 8, 7, 7, 4, 3, 4, 2,
        ]),
      },
      {
        name: "bassoon",
        expression: 0.35,
        samples: i([
          9, 9, 7, 6, 5, 4, 4, 4, 4, 5, 7, 8, 9, 10, 11, 13, 13, 11, 10, 9, 7,
          6, 4, 2, 1, 1, 1, 2, 2, 5, 11, 14,
        ]),
      },
      {
        name: "trumpet",
        expression: 0.22,
        samples: i([
          10, 11, 8, 6, 5, 5, 5, 6, 7, 7, 7, 7, 6, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6,
          6, 6, 6, 6, 7, 8, 9, 11, 14,
        ]),
      },
      {
        name: "electric guitar",
        expression: 0.2,
        samples: i([
          11, 12, 12, 10, 6, 6, 8, 0, 2, 4, 8, 10, 9, 10, 1, 7, 11, 3, 6, 6, 8,
          13, 14, 2, 0, 12, 8, 4, 13, 11, 10, 13,
        ]),
      },
      {
        name: "organ",
        expression: 0.2,
        samples: i([
          11, 10, 12, 11, 14, 7, 5, 5, 12, 10, 10, 9, 12, 6, 4, 5, 13, 12, 12,
          10, 12, 5, 2, 2, 8, 6, 6, 5, 8, 3, 2, 1,
        ]),
      },
      {
        name: "pan flute",
        expression: 0.35,
        samples: i([
          1, 4, 7, 6, 7, 9, 7, 7, 11, 12, 13, 15, 13, 11, 11, 12, 13, 10, 7, 5,
          3, 6, 10, 7, 3, 3, 1, 0, 1, 0, 1, 0,
        ]),
      },
      {
        name: "glitch",
        expression: 0.5,
        samples: n([
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1,
          -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1,
          -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1,
          -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1,
        ]),
      },
    ])),
    (e.chipWaves = (function (t) {
      const e = new Array(t.length),
        n = {};
      for (let i = 0; i < e.length; i++) {
        e[i] = Object.assign([], t[i]);
        const a = e[i];
        (a.index = i), (n[a.name] = a);
      }
      for (let t in n) n[t].samples = a(n[t].samples);
      const i = e;
      return (i.dictionary = n), i;
    })(e.rawChipWaves)),
    (e.chipNoises = p([
      {
        name: "retro",
        expression: 0.25,
        basePitch: 69,
        pitchFilterMult: 1024,
        isSoft: !1,
        samples: null,
      },
      {
        name: "white",
        expression: 1,
        basePitch: 69,
        pitchFilterMult: 8,
        isSoft: !0,
        samples: null,
      },
      {
        name: "clang",
        expression: 0.4,
        basePitch: 69,
        pitchFilterMult: 1024,
        isSoft: !1,
        samples: null,
      },
      {
        name: "buzz",
        expression: 0.3,
        basePitch: 69,
        pitchFilterMult: 1024,
        isSoft: !1,
        samples: null,
      },
      {
        name: "hollow",
        expression: 1.5,
        basePitch: 96,
        pitchFilterMult: 1,
        isSoft: !0,
        samples: null,
      },
      {
        name: "shine",
        expression: 1,
        basePitch: 69,
        pitchFilterMult: 1024,
        isSoft: !1,
        samples: null,
      },
      {
        name: "deep",
        expression: 1.5,
        basePitch: 120,
        pitchFilterMult: 1024,
        isSoft: !0,
        samples: null,
      },
      {
        name: "cutter",
        expression: 0.005,
        basePitch: 96,
        pitchFilterMult: 1024,
        isSoft: !1,
        samples: null,
      },
      {
        name: "metallic",
        expression: 1,
        basePitch: 96,
        pitchFilterMult: 1024,
        isSoft: !1,
        samples: null,
      },
    ])),
    (e.filterFreqStep = 1 / 4),
    (e.filterFreqRange = 34),
    (e.filterFreqReferenceSetting = 28),
    (e.filterFreqReferenceHz = 8e3),
    (e.filterFreqMaxHz =
      e.filterFreqReferenceHz *
      Math.pow(
        2,
        e.filterFreqStep *
          (e.filterFreqRange - 1 - e.filterFreqReferenceSetting)
      )),
    (e.filterFreqMinHz = 8),
    (e.filterGainRange = 15),
    (e.filterGainCenter = 7),
    (e.filterGainStep = 0.5),
    (e.filterMaxPoints = 8),
    (e.filterTypeNames = ["low-pass", "high-pass", "peak"]),
    (e.filterMorphCount = 10),
    (e.filterSimpleCutRange = 11),
    (e.filterSimplePeakRange = 8),
    (e.fadeInRange = 10),
    (e.fadeOutTicks = [-24, -12, -6, -3, -1, 6, 12, 24, 48, 72, 96]),
    (e.fadeOutNeutral = 4),
    (e.drumsetFadeOutTicks = 48),
    (e.transitions = p([
      {
        name: "normal",
        isSeamless: !1,
        continues: !1,
        slides: !1,
        slideTicks: 3,
        includeAdjacentPatterns: !1,
      },
      {
        name: "interrupt",
        isSeamless: !0,
        continues: !1,
        slides: !1,
        slideTicks: 3,
        includeAdjacentPatterns: !0,
      },
      {
        name: "continue",
        isSeamless: !0,
        continues: !0,
        slides: !1,
        slideTicks: 3,
        includeAdjacentPatterns: !0,
      },
      {
        name: "slide1",
        isSeamless: !0,
        continues: !1,
        slides: !0,
        slideTicks: 3,
        includeAdjacentPatterns: !0,
      },
      {
        name: "slide2",
        isSeamless: !0,
        continues: !1,
        slides: !0,
        slideTicks: 6,
        includeAdjacentPatterns: !0,
      },
      {
        name: "slide3",
        isSeamless: !0,
        continues: !1,
        slides: !0,
        slideTicks: 12,
        includeAdjacentPatterns: !0,
      },
      {
        name: "slide1 in pattern",
        isSeamless: !0,
        continues: !1,
        slides: !0,
        slideTicks: 3,
        includeAdjacentPatterns: !1,
      },
      {
        name: "slide2 in pattern",
        isSeamless: !0,
        continues: !1,
        slides: !0,
        slideTicks: 6,
        includeAdjacentPatterns: !1,
      },
      {
        name: "slide3 in pattern",
        isSeamless: !0,
        continues: !1,
        slides: !0,
        slideTicks: 12,
        includeAdjacentPatterns: !1,
      },
      {
        name: "tapped",
        isSeamless: !1,
        continues: !1,
        slides: !0,
        slideTicks: 3,
        includeAdjacentPatterns: !0,
      },
    ])),
    (e.vibratos = p([
      { name: "none", amplitude: 0, type: 0, delayTicks: 0 },
      { name: "light", amplitude: 0.15, type: 0, delayTicks: 0 },
      { name: "delayed", amplitude: 0.3, type: 0, delayTicks: 37 },
      { name: "heavy", amplitude: 0.45, type: 0, delayTicks: 0 },
      { name: "shaky", amplitude: 0.1, type: 1, delayTicks: 0 },
    ])),
    (e.vibratoTypes = p([
      { name: "normal", periodsSeconds: [0.14], period: 0.14 },
      { name: "shaky", periodsSeconds: [0.11, 0.17798, 0.33], period: 266.97 },
      { name: "wacky", periodsSeconds: [0.1, 0.2, 0.4], period: 0.4 },
    ])),
    (e.arpSpeedScale = [
      0,
      0.0625,
      0.125,
      0.2,
      0.25,
      1 / 3,
      0.4,
      0.5,
      2 / 3,
      0.75,
      0.8,
      0.9,
      1,
      1.1,
      1.2,
      1.3,
      1.4,
      1.5,
      1.6,
      1.7,
      1.8,
      1.9,
      2,
      2.1,
      2.2,
      2.3,
      2.4,
      2.5,
      2.6,
      2.7,
      2.8,
      2.9,
      3,
      3.1,
      3.2,
      3.3,
      3.4,
      3.5,
      3.6,
      3.7,
      3.8,
      3.9,
      4,
      4.15,
      4.3,
      4.5,
      4.8,
      5,
      5.5,
      6,
      8,
    ]),
    (e.unisons = p([
      {
        name: "none",
        voices: 1,
        spread: 0,
        offset: 0,
        expression: 1.4,
        sign: 1,
      },
      {
        name: "shimmer",
        voices: 2,
        spread: 0.018,
        offset: 0,
        expression: 0.8,
        sign: 1,
      },
      {
        name: "hum",
        voices: 2,
        spread: 0.045,
        offset: 0,
        expression: 1,
        sign: 1,
      },
      {
        name: "honky tonk",
        voices: 2,
        spread: 0.09,
        offset: 0,
        expression: 1,
        sign: 1,
      },
      {
        name: "dissonant",
        voices: 2,
        spread: 0.25,
        offset: 0,
        expression: 0.9,
        sign: 1,
      },
      {
        name: "fifth",
        voices: 2,
        spread: 3.5,
        offset: 3.5,
        expression: 0.9,
        sign: 1,
      },
      {
        name: "octave",
        voices: 2,
        spread: 6,
        offset: 6,
        expression: 0.8,
        sign: 1,
      },
      {
        name: "double octave",
        voices: 4,
        spread: 12,
        offset: 0,
        expression: 0.8,
        sign: 1,
      },
      {
        name: "bowed",
        voices: 2,
        spread: 0.02,
        offset: 0,
        expression: 1,
        sign: -1,
      },
      {
        name: "piano",
        voices: 2,
        spread: 0.01,
        offset: 0,
        expression: 1,
        sign: 0.7,
      },
      {
        name: "warbled",
        voices: 2,
        spread: 0.25,
        offset: 0.05,
        expression: 0.9,
        sign: -0.8,
      },
    ])),
    (e.effectNames = [
      "reverb",
      "chorus",
      "panning",
      "distortion",
      "bitcrusher",
      "note filter",
      "echo",
      "pitch shift",
      "detune",
      "vibrato",
      "transition type",
      "chord type",
    ]),
    (e.effectOrder = [2, 10, 11, 7, 8, 9, 5, 3, 4, 1, 6, 0]),
    (e.noteSizeMax = 6),
    (e.volumeRange = 50),
    (e.volumeLogScale = 0.1428),
    (e.panCenter = 50),
    (e.panMax = 2 * e.panCenter),
    (e.panDelaySecondsMax = 0.001),
    (e.chorusRange = 8),
    (e.chorusPeriodSeconds = 2),
    (e.chorusDelayRange = 0.0034),
    (e.chorusDelayOffsets = [
      [1.51, 2.1, 3.35],
      [1.47, 2.15, 3.25],
    ]),
    (e.chorusPhaseOffsets = [
      [0, 2.1, 4.2],
      [3.2, 5.3, 1],
    ]),
    (e.chorusMaxDelay =
      e.chorusDelayRange *
      (1 +
        e.chorusDelayOffsets[0]
          .concat(e.chorusDelayOffsets[1])
          .reduce((t, e) => Math.max(t, e)))),
    (e.chords = p([
      {
        name: "simultaneous",
        customInterval: !1,
        arpeggiates: !1,
        strumParts: 0,
        singleTone: !1,
      },
      {
        name: "strum",
        customInterval: !1,
        arpeggiates: !1,
        strumParts: 1,
        singleTone: !1,
      },
      {
        name: "arpeggio",
        customInterval: !1,
        arpeggiates: !0,
        strumParts: 0,
        singleTone: !0,
      },
      {
        name: "custom interval",
        customInterval: !0,
        arpeggiates: !1,
        strumParts: 0,
        singleTone: !0,
      },
    ])),
    (e.maxChordSize = 9),
    (e.operatorCount = 4),
    (e.maxPitchOrOperatorCount = Math.max(e.maxChordSize, e.operatorCount)),
    (e.algorithms = p([
      {
        name: "1←(2 3 4)",
        carrierCount: 1,
        associatedCarrier: [1, 1, 1, 1],
        modulatedBy: [[2, 3, 4], [], [], []],
      },
      {
        name: "1←(2 3←4)",
        carrierCount: 1,
        associatedCarrier: [1, 1, 1, 1],
        modulatedBy: [[2, 3], [], [4], []],
      },
      {
        name: "1←2←(3 4)",
        carrierCount: 1,
        associatedCarrier: [1, 1, 1, 1],
        modulatedBy: [[2], [3, 4], [], []],
      },
      {
        name: "1←(2 3)←4",
        carrierCount: 1,
        associatedCarrier: [1, 1, 1, 1],
        modulatedBy: [[2, 3], [4], [4], []],
      },
      {
        name: "1←2←3←4",
        carrierCount: 1,
        associatedCarrier: [1, 1, 1, 1],
        modulatedBy: [[2], [3], [4], []],
      },
      {
        name: "1←3 2←4",
        carrierCount: 2,
        associatedCarrier: [1, 2, 1, 2],
        modulatedBy: [[3], [4], [], []],
      },
      {
        name: "1 2←(3 4)",
        carrierCount: 2,
        associatedCarrier: [1, 2, 2, 2],
        modulatedBy: [[], [3, 4], [], []],
      },
      {
        name: "1 2←3←4",
        carrierCount: 2,
        associatedCarrier: [1, 2, 2, 2],
        modulatedBy: [[], [3], [4], []],
      },
      {
        name: "(1 2)←3←4",
        carrierCount: 2,
        associatedCarrier: [1, 2, 2, 2],
        modulatedBy: [[3], [3], [4], []],
      },
      {
        name: "(1 2)←(3 4)",
        carrierCount: 2,
        associatedCarrier: [1, 2, 2, 2],
        modulatedBy: [[3, 4], [3, 4], [], []],
      },
      {
        name: "1 2 3←4",
        carrierCount: 3,
        associatedCarrier: [1, 2, 3, 3],
        modulatedBy: [[], [], [4], []],
      },
      {
        name: "(1 2 3)←4",
        carrierCount: 3,
        associatedCarrier: [1, 2, 3, 3],
        modulatedBy: [[4], [4], [4], []],
      },
      {
        name: "1 2 3 4",
        carrierCount: 4,
        associatedCarrier: [1, 2, 3, 4],
        modulatedBy: [[], [], [], []],
      },
    ])),
    (e.operatorCarrierInterval = [0, 0.04, -0.073, 0.091]),
    (e.operatorAmplitudeMax = 15),
    (e.operatorFrequencies = p([
      { name: "1×", mult: 1, hzOffset: 0, amplitudeSign: 1 },
      { name: "~1×", mult: 1, hzOffset: 1.5, amplitudeSign: -1 },
      { name: "2×", mult: 2, hzOffset: 0, amplitudeSign: 1 },
      { name: "~2×", mult: 2, hzOffset: -1.3, amplitudeSign: -1 },
      { name: "3×", mult: 3, hzOffset: 0, amplitudeSign: 1 },
      { name: "4×", mult: 4, hzOffset: 0, amplitudeSign: 1 },
      { name: "5×", mult: 5, hzOffset: 0, amplitudeSign: 1 },
      { name: "6×", mult: 6, hzOffset: 0, amplitudeSign: 1 },
      { name: "7×", mult: 7, hzOffset: 0, amplitudeSign: 1 },
      { name: "8×", mult: 8, hzOffset: 0, amplitudeSign: 1 },
      { name: "9×", mult: 9, hzOffset: 0, amplitudeSign: 1 },
      { name: "11×", mult: 11, hzOffset: 0, amplitudeSign: 1 },
      { name: "13×", mult: 13, hzOffset: 0, amplitudeSign: 1 },
      { name: "16×", mult: 16, hzOffset: 0, amplitudeSign: 1 },
      { name: "20×", mult: 20, hzOffset: 0, amplitudeSign: 1 },
    ])),
    (e.envelopes = p([
      { name: "none", type: 1, speed: 0 },
      { name: "note size", type: 0, speed: 0 },
      { name: "punch", type: 2, speed: 0 },
      { name: "flare 1", type: 3, speed: 32 },
      { name: "flare 2", type: 3, speed: 8 },
      { name: "flare 3", type: 3, speed: 2 },
      { name: "twang 1", type: 4, speed: 32 },
      { name: "twang 2", type: 4, speed: 8 },
      { name: "twang 3", type: 4, speed: 2 },
      { name: "swell 1", type: 5, speed: 32 },
      { name: "swell 2", type: 5, speed: 8 },
      { name: "swell 3", type: 5, speed: 2 },
      { name: "tremolo1", type: 6, speed: 4 },
      { name: "tremolo2", type: 6, speed: 2 },
      { name: "tremolo3", type: 6, speed: 1 },
      { name: "tremolo4", type: 7, speed: 4 },
      { name: "tremolo5", type: 7, speed: 2 },
      { name: "tremolo6", type: 7, speed: 1 },
      { name: "decay 1", type: 8, speed: 10 },
      { name: "decay 2", type: 8, speed: 7 },
      { name: "decay 3", type: 8, speed: 4 },
      { name: "blip 0", type: 9, speed: 3 },
      { name: "blip 1", type: 9, speed: 6 },
      { name: "blip 2", type: 9, speed: 16 },
      { name: "blip 3", type: 9, speed: 32 },
      { name: "0.5x", type: 10, speed: 0.5 },
      { name: "1.5x", type: 10, speed: 1.5 },
      { name: "2x", type: 10, speed: 2 },
      { name: "random", type: 11, speed: 1 },
    ])),
    (e.feedbacks = p([
      { name: "1⟲", indices: [[1], [], [], []] },
      { name: "2⟲", indices: [[], [2], [], []] },
      { name: "3⟲", indices: [[], [], [3], []] },
      { name: "4⟲", indices: [[], [], [], [4]] },
      { name: "1⟲ 2⟲", indices: [[1], [2], [], []] },
      { name: "3⟲ 4⟲", indices: [[], [], [3], [4]] },
      { name: "1⟲ 2⟲ 3⟲", indices: [[1], [2], [3], []] },
      { name: "2⟲ 3⟲ 4⟲", indices: [[], [2], [3], [4]] },
      { name: "1⟲ 2⟲ 3⟲ 4⟲", indices: [[1], [2], [3], [4]] },
      { name: "1→2", indices: [[], [1], [], []] },
      { name: "1→3", indices: [[], [], [1], []] },
      { name: "1→4", indices: [[], [], [], [1]] },
      { name: "2→3", indices: [[], [], [2], []] },
      { name: "2→4", indices: [[], [], [], [2]] },
      { name: "3→4", indices: [[], [], [], [3]] },
      { name: "1→3 2→4", indices: [[], [], [1], [2]] },
      { name: "1→4 2→3", indices: [[], [], [2], [1]] },
      { name: "1→2→3→4", indices: [[], [1], [2], [3]] },
    ])),
    (e.chipNoiseLength = 32768),
    (e.spectrumNoiseLength = 32768),
    (e.spectrumBasePitch = 24),
    (e.spectrumControlPoints = 30),
    (e.spectrumControlPointsPerOctave = 7),
    (e.spectrumControlPointBits = 3),
    (e.spectrumMax = (1 << e.spectrumControlPointBits) - 1),
    (e.harmonicsControlPoints = 28),
    (e.harmonicsRendered = 64),
    (e.harmonicsRenderedForPickedString = 256),
    (e.harmonicsControlPointBits = 3),
    (e.harmonicsMax = (1 << e.harmonicsControlPointBits) - 1),
    (e.harmonicsWavelength = 2048),
    (e.pulseWidthRange = 50),
    (e.pulseWidthStepPower = 0.5),
    (e.supersawVoiceCount = 7),
    (e.supersawDynamismMax = 6),
    (e.supersawSpreadMax = 12),
    (e.supersawShapeMax = 6),
    (e.pitchChannelCountMin = 1),
    (e.pitchChannelCountMax = 40),
    (e.noiseChannelCountMin = 0),
    (e.noiseChannelCountMax = 16),
    (e.modChannelCountMin = 0),
    (e.modChannelCountMax = 12),
    (e.noiseInterval = 6),
    (e.pitchesPerOctave = 12),
    (e.drumCount = 12),
    (e.pitchOctaves = 8),
    (e.modCount = 6),
    (e.maxPitch = e.pitchOctaves * e.pitchesPerOctave),
    (e.maximumTonesPerChannel = 2 * e.maxChordSize),
    (e.justIntonationSemitones = [
      0.5,
      8 / 15,
      9 / 16,
      0.6,
      5 / 8,
      2 / 3,
      32 / 45,
      3 / 4,
      0.8,
      5 / 6,
      8 / 9,
      15 / 16,
      1,
      16 / 15,
      9 / 8,
      1.2,
      5 / 4,
      4 / 3,
      45 / 32,
      1.5,
      1.6,
      5 / 3,
      16 / 9,
      15 / 8,
      2,
    ].map((t) => Math.log2(t) * e.pitchesPerOctave)),
    (e.pitchShiftRange = e.justIntonationSemitones.length),
    (e.pitchShiftCenter = e.pitchShiftRange >> 1),
    (e.detuneCenter = 200),
    (e.detuneMax = 400),
    (e.detuneMin = 0),
    (e.songDetuneMin = 0),
    (e.songDetuneMax = 500),
    (e.sineWaveLength = 256),
    (e.sineWaveMask = e.sineWaveLength - 1),
    (e.sineWave = (function () {
      const t = new Float32Array(e.sineWaveLength + 1);
      for (let n = 0; n < e.sineWaveLength + 1; n++)
        t[n] = Math.sin((n * Math.PI * 2) / e.sineWaveLength);
      return t;
    })()),
    (e.pickedStringDispersionCenterFreq = 6e3),
    (e.pickedStringDispersionFreqScale = 0.3),
    (e.pickedStringDispersionFreqMult = 4),
    (e.pickedStringShelfHz = 4e3),
    (e.distortionRange = 8),
    (e.stringSustainRange = 15),
    (e.stringDecayRate = 0.12),
    (e.enableAcousticSustain = !1),
    (e.sustainTypeNames = ["bright", "acoustic"]),
    (e.bitcrusherFreqRange = 14),
    (e.bitcrusherOctaveStep = 0.5),
    (e.bitcrusherQuantizationRange = 8),
    (e.maxEnvelopeCount = 12),
    (e.defaultAutomationRange = 13),
    (e.instrumentAutomationTargets = p([
      {
        name: "none",
        computeIndex: null,
        displayName: "none",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: null,
      },
      {
        name: "noteVolume",
        computeIndex: 0,
        displayName: "note volume",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: null,
      },
      {
        name: "pulseWidth",
        computeIndex: 2,
        displayName: "pulse width",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: [6, 8],
      },
      {
        name: "stringSustain",
        computeIndex: 3,
        displayName: "sustain",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: [7],
      },
      {
        name: "unison",
        computeIndex: 4,
        displayName: "unison",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: [0, 5, 7],
      },
      {
        name: "operatorFrequency",
        computeIndex: 5,
        displayName: "fm# freq",
        interleave: !0,
        isFilter: !1,
        maxCount: e.operatorCount,
        effect: null,
        compatibleInstruments: [1],
      },
      {
        name: "operatorAmplitude",
        computeIndex: 9,
        displayName: "fm# volume",
        interleave: !1,
        isFilter: !1,
        maxCount: e.operatorCount,
        effect: null,
        compatibleInstruments: [1],
      },
      {
        name: "feedbackAmplitude",
        computeIndex: 13,
        displayName: "fm feedback",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: [1],
      },
      {
        name: "pitchShift",
        computeIndex: 14,
        displayName: "pitch shift",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: 7,
        compatibleInstruments: null,
      },
      {
        name: "detune",
        computeIndex: 15,
        displayName: "detune",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: 8,
        compatibleInstruments: null,
      },
      {
        name: "vibratoDepth",
        computeIndex: 16,
        displayName: "vibrato range",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: 9,
        compatibleInstruments: null,
      },
      {
        name: "noteFilterAllFreqs",
        computeIndex: 1,
        displayName: "n. filter freqs",
        interleave: !1,
        isFilter: !0,
        maxCount: 1,
        effect: 5,
        compatibleInstruments: null,
      },
      {
        name: "noteFilterFreq",
        computeIndex: 17,
        displayName: "n. filter # freq",
        interleave: !1,
        isFilter: !0,
        maxCount: e.filterMaxPoints,
        effect: 5,
        compatibleInstruments: null,
      },
      {
        name: "noteFilterGain",
        computeIndex: null,
        displayName: "n. filter # vol",
        interleave: !1,
        isFilter: !0,
        maxCount: e.filterMaxPoints,
        effect: 5,
        compatibleInstruments: null,
      },
      {
        name: "supersawDynamism",
        computeIndex: 33,
        displayName: "dynamism",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: [8],
      },
      {
        name: "supersawSpread",
        computeIndex: 34,
        displayName: "spread",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: [8],
      },
      {
        name: "supersawShape",
        computeIndex: 35,
        displayName: "saw↔pulse",
        interleave: !1,
        isFilter: !1,
        maxCount: 1,
        effect: null,
        compatibleInstruments: [8],
      },
    ])),
    (e.operatorWaves = p([
      { name: "sine", samples: e.sineWave },
      {
        name: "triangle",
        samples: (function () {
          const t = new Float32Array(e.sineWaveLength + 1);
          for (let n = 0; n < e.sineWaveLength + 1; n++)
            t[n] =
              Math.asin(Math.sin((n * Math.PI * 2) / e.sineWaveLength)) /
              (Math.PI / 2);
          return t;
        })(),
      },
      { name: "sawtooth", samples: c() },
      { name: "pulse width", samples: l() },
      { name: "ramp", samples: c(!0) },
      {
        name: "trapezoid",
        samples: (function (t = 2) {
          const n = new Float32Array(e.sineWaveLength + 1);
          for (let i = 0; i < e.sineWaveLength + 1; i++)
            n[i] = Math.max(
              -1,
              Math.min(
                1,
                Math.asin(Math.sin((i * Math.PI * 2) / e.sineWaveLength)) * t
              )
            );
          return n;
        })(2),
      },
    ])),
    (e.pwmOperatorWaves = p([
      { name: "1%", samples: l(0.01) },
      { name: "5%", samples: l(0.05) },
      { name: "12.5%", samples: l(0.125) },
      { name: "25%", samples: l(0.25) },
      { name: "33%", samples: l(1 / 3) },
      { name: "50%", samples: l(0.5) },
      { name: "66%", samples: l(2 / 3) },
      { name: "75%", samples: l(0.75) },
      { name: "87.5%", samples: l(0.875) },
      { name: "95%", samples: l(0.95) },
      { name: "99%", samples: l(0.99) },
    ])),
    (e.barEditorHeight = 10),
    (e.modulators = p([
      {
        name: "none",
        pianoName: "None",
        maxRawVol: 6,
        newNoteVol: 6,
        forSong: !0,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "No Mod Setting",
        promptDesc: [
          "No setting has been chosen yet, so this modulator will have no effect. Try choosing a setting with the dropdown, then click this '?' again for more info.",
          "[$LO - $HI]",
        ],
      },
      {
        name: "song volume",
        pianoName: "Volume",
        maxRawVol: 100,
        newNoteVol: 100,
        forSong: !0,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Song Volume",
        promptDesc: [
          "This setting affects the overall volume of the song, just like the main volume slider.",
          "At $HI, the volume will be unchanged from default, and it will get gradually quieter down to $LO.",
          "[MULTIPLICATIVE] [$LO - $HI] [%]",
        ],
      },
      {
        name: "tempo",
        pianoName: "Tempo",
        maxRawVol: e.tempoMax - e.tempoMin,
        newNoteVol: Math.ceil((e.tempoMax - e.tempoMin) / 2),
        forSong: !0,
        convertRealFactor: e.tempoMin,
        associatedEffect: 12,
        promptName: "Song Tempo",
        promptDesc: [
          "This setting controls the speed your song plays at, just like the tempo slider.",
          "When you first make a note for this setting, it will default to your current tempo. Raising it speeds up the song, up to $HI BPM, and lowering it slows it down, to a minimum of $LO BPM.",
          "Note that you can make a 'swing' effect by rapidly changing between two tempo values.",
          "[OVERWRITING] [$LO - $HI] [BPM]",
        ],
      },
      {
        name: "song reverb",
        pianoName: "Reverb",
        maxRawVol: 2 * e.reverbRange,
        newNoteVol: e.reverbRange,
        forSong: !0,
        convertRealFactor: -e.reverbRange,
        associatedEffect: 12,
        promptName: "Song Reverb",
        promptDesc: [
          "This setting affects the overall reverb of your song. It works by multiplying existing reverb for instruments, so those with no reverb set will be unaffected.",
          "At $MID, all instruments' reverb will be unchanged from default. This increases up to double the reverb value at $HI, or down to no reverb at $LO.",
          "[MULTIPLICATIVE] [$LO - $HI]",
        ],
      },
      {
        name: "next bar",
        pianoName: "Next Bar",
        maxRawVol: 1,
        newNoteVol: 1,
        forSong: !0,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Go To Next Bar",
        promptDesc: [
          "This setting functions a little different from most. Wherever a note is placed, the song will jump immediately to the next bar when it is encountered.",
          "This jump happens at the very start of the note, so the length of a next-bar note is irrelevant. Also, the note can be value 0 or 1, but the value is also irrelevant - wherever you place a note, the song will jump.",
          "You can make mixed-meter songs or intro sections by cutting off unneeded beats with a next-bar modulator.",
          "[$LO - $HI]",
        ],
      },
      {
        name: "note volume",
        pianoName: "Note Vol.",
        maxRawVol: e.volumeRange,
        newNoteVol: Math.ceil(e.volumeRange / 2),
        forSong: !1,
        convertRealFactor: Math.ceil(-e.volumeRange / 2),
        associatedEffect: 12,
        promptName: "Note Volume",
        promptDesc: [
          "This setting affects the volume of your instrument as if its note size had been scaled.",
          "At $MID, an instrument's volume will be unchanged from default. This means you can still use the volume sliders to mix the base volume of instruments. The volume gradually increases up to $HI, or decreases down to mute at $LO.",
          "This setting was the default for volume modulation in JummBox for a long time. Due to some new effects like distortion and bitcrush, note volume doesn't always allow fine volume control. Also, this modulator affects the value of FM modulator waves instead of just carriers. This can distort the sound which may be useful, but also may be undesirable. In those cases, use the 'mix volume' modulator instead, which will always just scale the volume with no added effects.",
          "For display purposes, this mod will show up on the instrument volume slider, as long as there is not also an active 'mix volume' modulator anyhow. However, as mentioned, it works more like changing note volume.",
          "[MULTIPLICATIVE] [$LO - $HI]",
        ],
      },
      {
        name: "pan",
        pianoName: "Pan",
        maxRawVol: e.panMax,
        newNoteVol: Math.ceil(e.panMax / 2),
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 2,
        promptName: "Instrument Panning",
        promptDesc: [
          "This setting controls the panning of your instrument, just like the panning slider.",
          "At $LO, your instrument will sound like it is coming fully from the left-ear side. At $MID it will be right in the middle, and at $HI, it will sound like it's on the right.",
          "[OVERWRITING] [$LO - $HI] [L-R]",
        ],
      },
      {
        name: "reverb",
        pianoName: "Reverb",
        maxRawVol: e.reverbRange,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 0,
        promptName: "Instrument Reverb",
        promptDesc: [
          "This setting controls the reverb of your insturment, just like the reverb slider.",
          "At $LO, your instrument will have no reverb. At $HI, it will be at maximum.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "distortion",
        pianoName: "Distortion",
        maxRawVol: e.distortionRange - 1,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 3,
        promptName: "Instrument Distortion",
        promptDesc: [
          "This setting controls the amount of distortion for your instrument, just like the distortion slider.",
          "At $LO, your instrument will have no distortion. At $HI, it will be at maximum.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "fm slider 1",
        pianoName: "FM 1",
        maxRawVol: 15,
        newNoteVol: 15,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "FM Slider 1",
        promptDesc: [
          "This setting affects the strength of the first FM slider, just like the corresponding slider on your instrument.",
          "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.",
          "For the full range of control with this mod, move your underlying slider all the way to the right.",
          "[MULTIPLICATIVE] [$LO - $HI] [%]",
        ],
      },
      {
        name: "fm slider 2",
        pianoName: "FM 2",
        maxRawVol: 15,
        newNoteVol: 15,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "FM Slider 2",
        promptDesc: [
          "This setting affects the strength of the second FM slider, just like the corresponding slider on your instrument.",
          "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.",
          "For the full range of control with this mod, move your underlying slider all the way to the right.",
          "[MULTIPLICATIVE] [$LO - $HI] [%]",
        ],
      },
      {
        name: "fm slider 3",
        pianoName: "FM 3",
        maxRawVol: 15,
        newNoteVol: 15,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "FM Slider 3",
        promptDesc: [
          "This setting affects the strength of the third FM slider, just like the corresponding slider on your instrument.",
          "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.",
          "For the full range of control with this mod, move your underlying slider all the way to the right.",
          "[MULTIPLICATIVE] [$LO - $HI] [%]",
        ],
      },
      {
        name: "fm slider 4",
        pianoName: "FM 4",
        maxRawVol: 15,
        newNoteVol: 15,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "FM Slider 4",
        promptDesc: [
          "This setting affects the strength of the fourth FM slider, just like the corresponding slider on your instrument.",
          "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.",
          "For the full range of control with this mod, move your underlying slider all the way to the right.",
          "[MULTIPLICATIVE] [$LO - $HI] [%]",
        ],
      },
      {
        name: "fm feedback",
        pianoName: "FM Feedback",
        maxRawVol: 15,
        newNoteVol: 15,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "FM Feedback",
        promptDesc: [
          "This setting affects the strength of the FM feedback slider, just like the corresponding slider on your instrument.",
          "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.",
          "For the full range of control with this mod, move your underlying slider all the way to the right.",
          "[MULTIPLICATIVE] [$LO - $HI] [%]",
        ],
      },
      {
        name: "pulse width",
        pianoName: "Pulse Width",
        maxRawVol: e.pulseWidthRange,
        newNoteVol: e.pulseWidthRange,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Pulse Width",
        promptDesc: [
          "This setting controls the width of this instrument's pulse wave, just like the pulse width slider.",
          "At $HI, your instrument will sound like a pure square wave (on 50% of the time). It will gradually sound narrower down to $LO, where it will be inaudible (as it is on 0% of the time).",
          "Changing pulse width randomly between a few values is a common strategy in chiptune music to lend some personality to a lead instrument.",
          "[OVERWRITING] [$LO - $HI] [%Duty]",
        ],
      },
      {
        name: "detune",
        pianoName: "Detune",
        maxRawVol: e.detuneMax - e.detuneMin,
        newNoteVol: e.detuneCenter,
        forSong: !1,
        convertRealFactor: -e.detuneCenter,
        associatedEffect: 8,
        promptName: "Instrument Detune",
        promptDesc: [
          "This setting controls the detune for this instrument, just like the detune slider.",
          "At $MID, your instrument will have no detune applied. Each tick corresponds to one cent, or one-hundredth of a pitch. Thus, each change of 100 ticks corresponds to one half-step of detune, up to two half-steps up at $HI, or two half-steps down at $LO.",
          "[OVERWRITING] [$LO - $HI] [cents]",
        ],
      },
      {
        name: "vibrato depth",
        pianoName: "Vibrato Depth",
        maxRawVol: 50,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 9,
        promptName: "Vibrato Depth",
        promptDesc: [
          "This setting controls the amount that your pitch moves up and down by during vibrato, just like the vibrato depth slider.",
          "At $LO, your instrument will have no vibrato depth so its vibrato would be inaudible. This increases up to $HI, where an extreme pitch change will be noticeable.",
          "[OVERWRITING] [$LO - $HI] [pitch ÷25]",
        ],
      },
      {
        name: "song detune",
        pianoName: "Detune",
        maxRawVol: e.songDetuneMax - e.songDetuneMin,
        newNoteVol: Math.ceil((e.songDetuneMax - e.songDetuneMin) / 2),
        forSong: !0,
        convertRealFactor: -250,
        associatedEffect: 12,
        promptName: "Song Detune",
        promptDesc: [
          "This setting controls the overall detune of the entire song. There is no associated slider.",
          "At $MID, your song will have no extra detune applied and sound unchanged from default. Each tick corresponds to four cents, or four hundredths of a pitch. Thus, each change of 25 ticks corresponds to one half-step of detune, up to 10 half-steps up at $HI, or 10 half-steps down at $LO.",
          "[MULTIPLICATIVE] [$LO - $HI] [cents x4]",
        ],
      },
      {
        name: "vibrato speed",
        pianoName: "Vibrato Speed",
        maxRawVol: 30,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 9,
        promptName: "Vibrato Speed",
        promptDesc: [
          "This setting controls the speed your instrument will vibrato at, just like the slider.",
          "A setting of $LO means there will be no oscillation, and vibrato will be disabled. Higher settings will increase the speed, up to a dramatic trill at the max value, $HI.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "vibrato delay",
        pianoName: "Vibrato Delay",
        maxRawVol: 50,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 9,
        promptName: "Vibrato Delay",
        promptDesc: [
          "This setting controls the amount of time vibrato will be held off for before triggering for every new note, just like the slider.",
          "A setting of $LO means there will be no delay. A setting of 24 corresponds to one full beat of delay. As a sole exception to this scale, setting delay to $HI will completely disable vibrato (as if it had infinite delay).",
          "[OVERWRITING] [$LO - $HI] [beats ÷24]",
        ],
      },
      {
        name: "arp speed",
        pianoName: "Arp Speed",
        maxRawVol: 50,
        newNoteVol: 12,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 11,
        promptName: "Arpeggio Speed",
        promptDesc: [
          "This setting controls the speed at which your instrument's chords arpeggiate, just like the arpeggio speed slider.",
          "Each setting corresponds to a different speed, from the slowest to the fastest. The speeds are listed below.",
          "[0-4]: x0, x1/16, x⅛, x⅕, x¼,",
          "[5-9]: x⅓, x⅖, x½, x⅔, x¾,",
          "[10-14]: x⅘, x0.9, x1, x1.1, x1.2,",
          "[15-19]: x1.3, x1.4, x1.5, x1.6, x1.7,",
          "[20-24]: x1.8, x1.9, x2, x2.1, x2.2,",
          "[25-29]: x2.3, x2.4, x2.5, x2.6, x2.7,",
          "[30-34]: x2.8, x2.9, x3, x3.1, x3.2,",
          "[35-39]: x3.3, x3.4, x3.5, x3.6, x3.7,",
          "[40-44]: x3.8, x3.9, x4, x4.15, x4.3,",
          "[45-50]: x4.5, x4.8, x5, x5.5, x6, x8",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "pan delay",
        pianoName: "Pan Delay",
        maxRawVol: 20,
        newNoteVol: 10,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 2,
        promptName: "Panning Delay",
        promptDesc: [
          "This setting controls the delay applied to panning for your instrument, just like the pan delay slider.",
          "With more delay, the panning effect will generally be more pronounced. $MID is the default value, whereas $LO will remove any delay at all. No delay can be desirable for chiptune songs.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "reset arp",
        pianoName: "Reset Arp",
        maxRawVol: 1,
        newNoteVol: 1,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 11,
        promptName: "Reset Arpeggio",
        promptDesc: [
          "This setting functions a little different from most. Wherever a note is placed, the arpeggio of this instrument will reset at the very start of that note. This is most noticeable with lower arpeggio speeds. The lengths and values of notes for this setting don't matter, just the note start times.",
          "This mod can be used to sync up your apreggios so that they always sound the same, even if you are using an odd-ratio arpeggio speed or modulating arpeggio speed.",
          "[$LO - $HI]",
        ],
      },
      {
        name: "eq filter",
        pianoName: "EQFlt",
        maxRawVol: 10,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "EQ Filter",
        promptDesc: [
          "This setting controls a few separate things for your instrument's EQ filter.",
          "When the option 'morph' is selected, your modulator values will indicate a sub-filter index of your EQ filter to 'morph' to over time. For example, a change from 0 to 1 means your main filter (default) will morph to sub-filter 1 over the specified duration. You can shape the main filter and sub-filters in the large filter editor ('+' button). If your two filters' number, type, and order of filter dots all match up, the morph will happen smoothly and you'll be able to hear them changing. If they do not match up, the filters will simply jump between each other.",
          "Note that filters will morph based on endpoints in the pattern editor. So, if you specify a morph from sub-filter 1 to 4 but do not specifically drag in new endpoints for 2 and 3, it will morph directly between 1 and 4 without going through the others.",
          "If you target Dot X or Dot Y, you can finely tune the coordinates of a single dot for your filter. The number of available dots to choose is dependent on your main filter's dot count.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "note filter",
        pianoName: "N.Flt",
        maxRawVol: 10,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 5,
        promptName: "Note Filter",
        promptDesc: [
          "This setting controls a few separate things for your instrument's note filter.",
          "When the option 'morph' is selected, your modulator values will indicate a sub-filter index of your note filter to 'morph' to over time. For example, a change from 0 to 1 means your main filter (default) will morph to sub-filter 1 over the specified duration. You can shape the main filter and sub-filters in the large filter editor ('+' button). If your two filters' number, type, and order of filter dots all match up, the morph will happen smoothly and you'll be able to hear them changing. If they do not match up, the filters will simply jump between each other.",
          "Note that filters will morph based on endpoints in the pattern editor. So, if you specify a morph from sub-filter 1 to 4 but do not specifically drag in new endpoints for 2 and 3, it will morph directly between 1 and 4 without going through the others.",
          "If you target Dot X or Dot Y, you can finely tune the coordinates of a single dot for your filter. The number of available dots to choose is dependent on your main filter's dot count.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "bit crush",
        pianoName: "Bitcrush",
        maxRawVol: e.bitcrusherQuantizationRange - 1,
        newNoteVol: Math.round(e.bitcrusherQuantizationRange / 2),
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 4,
        promptName: "Instrument Bit Crush",
        promptDesc: [
          "This setting controls the bit crush of your instrument, just like the bit crush slider.",
          "At a value of $LO, no bit crush will be applied. This increases and the bit crush effect gets more noticeable up to the max value, $HI.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "freq crush",
        pianoName: "Freq Crush",
        maxRawVol: e.bitcrusherFreqRange - 1,
        newNoteVol: Math.round(e.bitcrusherFreqRange / 2),
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 4,
        promptName: "Instrument Frequency Crush",
        promptDesc: [
          "This setting controls the frequency crush of your instrument, just like the freq crush slider.",
          "At a value of $LO, no frequency crush will be applied. This increases and the frequency crush effect gets more noticeable up to the max value, $HI.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "echo",
        pianoName: "Echo",
        maxRawVol: e.echoSustainRange - 1,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 6,
        promptName: "Instrument Echo Sustain",
        promptDesc: [
          "This setting controls the echo sustain (echo loudness) of your instrument, just like the echo slider.",
          "At $LO, your instrument will have no echo sustain and echo will not be audible. Echo sustain increases and the echo effect gets more noticeable up to the max value, $HI.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "echo delay",
        pianoName: "Echo Delay",
        maxRawVol: e.echoDelayRange,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Instrument Echo Delay",
        promptDesc: [
          "This setting controls the echo delay of your instrument, just like the echo delay slider.",
          "At $LO, your instrument will have very little echo delay, and this increases up to 2 beats of delay at $HI.",
          "[OVERWRITING] [$LO - $HI] [~beats ÷12]",
        ],
      },
      {
        name: "chorus",
        pianoName: "Chorus",
        maxRawVol: e.chorusRange - 1,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 1,
        promptName: "Instrument Chorus",
        promptDesc: [
          "This setting controls the chorus strength of your instrument, just like the chorus slider.",
          "At $LO, the chorus effect will be disabled. The strength of the chorus effect increases up to the max value, $HI.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "eq filt cut",
        pianoName: "EQFlt Cut",
        maxRawVol: e.filterSimpleCutRange - 1,
        newNoteVol: e.filterSimpleCutRange - 1,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "EQ Filter Cutoff Frequency",
        promptDesc: [
          "This setting controls the filter cut position of your instrument, just like the filter cut slider.",
          "This setting is roughly analagous to the horizontal position of a single low-pass dot on the advanced filter editor. At lower values, a wider range of frequencies is cut off.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "eq filt peak",
        pianoName: "EQFlt Peak",
        maxRawVol: e.filterSimplePeakRange - 1,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "EQ Filter Peak Gain",
        promptDesc: [
          "This setting controls the filter peak position of your instrument, just like the filter peak slider.",
          "This setting is roughly analagous to the vertical position of a single low-pass dot on the advanced filter editor. At lower values, the cutoff frequency will not be emphasized, and at higher values you will hear emphasis on the cutoff frequency.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "note filt cut",
        pianoName: "N.Flt Cut",
        maxRawVol: e.filterSimpleCutRange - 1,
        newNoteVol: e.filterSimpleCutRange - 1,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 5,
        promptName: "Note Filter Cutoff Frequency",
        promptDesc: [
          "This setting controls the filter cut position of your instrument, just like the filter cut slider.",
          "This setting is roughly analagous to the horizontal position of a single low-pass dot on the advanced filter editor. At lower values, a wider range of frequencies is cut off.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "note filt peak",
        pianoName: "N.Flt Peak",
        maxRawVol: e.filterSimplePeakRange - 1,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 5,
        promptName: "Note Filter Peak Gain",
        promptDesc: [
          "This setting controls the filter peak position of your instrument, just like the filter peak slider.",
          "This setting is roughly analagous to the vertical position of a single low-pass dot on the advanced filter editor. At lower values, the cutoff frequency will not be emphasized, and at higher values you will hear emphasis on the cutoff frequency.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "pitch shift",
        pianoName: "Pitch Shift",
        maxRawVol: e.pitchShiftRange - 1,
        newNoteVol: e.pitchShiftCenter,
        forSong: !1,
        convertRealFactor: -e.pitchShiftCenter,
        associatedEffect: 7,
        promptName: "Pitch Shift",
        promptDesc: [
          "This setting controls the pitch offset of your instrument, just like the pitch shift slider.",
          "At $MID your instrument will have no pitch shift. This increases as you decrease toward $LO pitches (half-steps) at the low end, or increases towards +$HI pitches at the high end.",
          "[OVERWRITING] [$LO - $HI] [pitch]",
        ],
      },
      {
        name: "sustain",
        pianoName: "Sustain",
        maxRawVol: e.stringSustainRange - 1,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Picked String Sustain",
        promptDesc: [
          "This setting controls the sustain of your picked string instrument, just like the sustain slider.",
          "At $LO, your instrument will have minimum sustain and sound 'plucky'. This increases to a more held sound as your modulator approaches the maximum, $HI.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "mix volume",
        pianoName: "Mix Vol.",
        maxRawVol: e.volumeRange,
        newNoteVol: Math.ceil(e.volumeRange / 2),
        forSong: !1,
        convertRealFactor: Math.ceil(-e.volumeRange / 2),
        associatedEffect: 12,
        promptName: "Mix Volume",
        promptDesc: [
          "This setting affects the volume of your instrument as if its volume slider had been moved.",
          "At $MID, an instrument's volume will be unchanged from default. This means you can still use the volume sliders to mix the base volume of instruments, since this setting and the default value work multiplicatively. The volume gradually increases up to $HI, or decreases down to mute at $LO.",
          "Unlike the 'note volume' setting, mix volume is very straightforward and simply affects the resultant instrument volume after all effects are applied.",
          "[MULTIPLICATIVE] [$LO - $HI]",
        ],
      },
      {
        name: "envelope speed",
        pianoName: "EnvelopeSpd",
        maxRawVol: 50,
        newNoteVol: 12,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Envelope Speed",
        promptDesc: [
          "This setting controls how fast all of the envelopes for the instrument play.",
          "At $LO, your instrument's envelopes will be frozen, and at values near there they will change very slowly. At 12, the envelopes will work as usual, performing at normal speed. This increases up to $HI, where the envelopes will change very quickly. The speeds are given below:",
          "[0-4]: x0, x1/16, x⅛, x⅕, x¼,",
          "[5-9]: x⅓, x⅖, x½, x⅔, x¾,",
          "[10-14]: x⅘, x0.9, x1, x1.1, x1.2,",
          "[15-19]: x1.3, x1.4, x1.5, x1.6, x1.7,",
          "[20-24]: x1.8, x1.9, x2, x2.1, x2.2,",
          "[25-29]: x2.3, x2.4, x2.5, x2.6, x2.7,",
          "[30-34]: x2.8, x2.9, x3, x3.1, x3.2,",
          "[35-39]: x3.3, x3.4, x3.5, x3.6, x3.7,",
          "[40-44]: x3.8, x3.9, x4, x4.15, x4.3,",
          "[45-50]: x4.5, x4.8, x5, x5.5, x6, x8",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "dynamism",
        pianoName: "Dynamism",
        maxRawVol: e.supersawDynamismMax,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Supersaw Dynamism",
        promptDesc: [
          "This setting controls the supersaw dynamism of your instrument, just like the dynamism slider.",
          "At $LO, your instrument will have only a single pulse contributing. Increasing this will raise the contribution of other waves which is similar to a chorus effect. The effect gets more noticeable up to the max value, $HI.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "spread",
        pianoName: "Spread",
        maxRawVol: e.supersawSpreadMax,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Supersaw Spread",
        promptDesc: [
          "This setting controls the supersaw spread of your instrument, just like the spread slider.",
          "At $LO, all the pulses in your supersaw will be at the same frequency. Increasing this value raises the frequency spread of the contributing waves, up to a dissonant spread at the max value, $HI.",
          "[OVERWRITING] [$LO - $HI]",
        ],
      },
      {
        name: "saw shape",
        pianoName: "Saw Shape",
        maxRawVol: e.supersawShapeMax,
        newNoteVol: 0,
        forSong: !1,
        convertRealFactor: 0,
        associatedEffect: 12,
        promptName: "Supersaw Shape",
        promptDesc: [
          "This setting controls the supersaw shape of your instrument, just like the Saw↔Pulse slider.",
          "As the slider's name implies, this effect will give you a sawtooth wave at $LO, and a full pulse width wave at $HI. Values in between will be a blend of the two.",
          "[OVERWRITING] [$LO - $HI] [%]",
        ],
      },
    ]));
  var S =
      (t && t.t) ||
      function (t) {
        var e = "function" == typeof Symbol && Symbol.iterator,
          n = e && t[e],
          i = 0;
        if (n) return n.call(t);
        if (t && "number" == typeof t.length)
          return {
            next: function () {
              return (
                t && i >= t.length && (t = void 0),
                { value: t && t[i++], done: !t }
              );
            },
          };
        throw new TypeError(
          e ? "Object is not iterable." : "Symbol.iterator is not defined."
        );
      },
    x =
      (t && t.i) ||
      function (t, e) {
        var n = "function" == typeof Symbol && t[Symbol.iterator];
        if (!n) return t;
        var i,
          a,
          r = n.call(t),
          o = [];
        try {
          for (; (void 0 === e || e-- > 0) && !(i = r.next()).done; )
            o.push(i.value);
        } catch (t) {
          a = { error: t };
        } finally {
          try {
            i && !i.done && (n = r.return) && n.call(r);
          } finally {
            if (a) throw a.error;
          }
        }
        return o;
      },
    I =
      (t && t.o) ||
      function () {
        for (var t = [], e = 0; e < arguments.length; e++)
          t = t.concat(x(arguments[e]));
        return t;
      };
  function P(t, e) {
    var n, i, a, r, o, s;
    try {
      for (var l = S(e), c = l.next(); !c.done; c = l.next()) {
        var h = c.value;
        if (h instanceof Node) t.appendChild(h);
        else if ("string" == typeof h)
          t.appendChild(document.createTextNode(h));
        else if ("function" == typeof h) P(t, [h()]);
        else if (Array.isArray(h)) P(t, h);
        else if (
          h &&
          "undefined" != typeof Symbol &&
          "function" == typeof h[Symbol.iterator]
        )
          P(t, I(h));
        else if (h && h.constructor === Object && t instanceof Element)
          try {
            for (
              var p = ((a = void 0), S(Object.keys(h))), d = p.next();
              !d.done;
              d = p.next()
            ) {
              var m = d.value,
                u = h[m];
              if ("class" === m)
                "string" == typeof u
                  ? t.setAttribute("class", u)
                  : Array.isArray(h) ||
                    (u &&
                      "undefined" != typeof Symbol &&
                      "function" == typeof u[Symbol.iterator])
                  ? t.setAttribute("class", I(u).join(" "))
                  : console.warn(
                      "Invalid " +
                        m +
                        ' value "' +
                        u +
                        '" on ' +
                        t.tagName +
                        " element."
                    );
              else if ("style" === m)
                if (u && u.constructor === Object)
                  try {
                    for (
                      var f = ((o = void 0), S(Object.keys(u))), y = f.next();
                      !y.done;
                      y = f.next()
                    ) {
                      var b = y.value;
                      b in t.style
                        ? (t.style[b] = u[b])
                        : t.style.setProperty(b, u[b]);
                    }
                  } catch (t) {
                    o = { error: t };
                  } finally {
                    try {
                      y && !y.done && (s = f.return) && s.call(f);
                    } finally {
                      if (o) throw o.error;
                    }
                  }
                else t.setAttribute(m, u);
              else
                "function" == typeof u
                  ? (t[m] = u)
                  : "boolean" == typeof u
                  ? u
                    ? t.setAttribute(m, "")
                    : t.removeAttribute(m)
                  : t.setAttribute(m, u);
            }
          } catch (t) {
            a = { error: t };
          } finally {
            try {
              d && !d.done && (r = p.return) && r.call(p);
            } finally {
              if (a) throw a.error;
            }
          }
        else t.appendChild(document.createTextNode(h));
      }
    } catch (t) {
      n = { error: t };
    } finally {
      try {
        c && !c.done && (i = l.return) && i.call(l);
      } finally {
        if (n) throw n.error;
      }
    }
    return t;
  }
  var A = "http://www.w3.org/2000/svg";
  var T,
    C,
    D,
    q,
    E =
      (t && t.t) ||
      function (t) {
        var e = "function" == typeof Symbol && Symbol.iterator,
          n = e && t[e],
          i = 0;
        if (n) return n.call(t);
        if (t && "number" == typeof t.length)
          return {
            next: function () {
              return (
                t && i >= t.length && (t = void 0),
                { value: t && t[i++], done: !t }
              );
            },
          };
        throw new TypeError(
          e ? "Object is not iterable." : "Symbol.iterator is not defined."
        );
      },
    O = function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return document.createRange().createContextualFragment(t.join());
    },
    R = function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      for (
        var n = document.createDocumentFragment(),
          i = new DOMParser().parseFromString(
            '<svg xmlns="http://www.w3.org/2000/svg">' + t.join() + "</svg>",
            "image/svg+xml"
          ).documentElement;
        null !== i.firstChild;

      )
        document.importNode(i.firstChild, !0), n.appendChild(i.firstChild);
      return n;
    },
    N = function (t) {
      O[t] = function () {
        for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
        return P(document.createElement(t), e);
      };
    };
  try {
    for (
      var z = E(
          "a abbr address area article aside audio b base bdi bdo blockquote br button canvas caption cite code col colgroup datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr i iframe img input ins kbd label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr".split(
            " "
          )
        ),
        L = z.next();
      !L.done;
      L = z.next()
    ) {
      N(L.value);
    }
  } catch (t) {
    T = { error: t };
  } finally {
    try {
      L && !L.done && (C = z.return) && C.call(z);
    } finally {
      if (T) throw T.error;
    }
  }
  var H = function (t) {
    if (
      ((R[t] = function () {
        for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
        return P(document.createElementNS(A, t), e);
      }),
      /-/.test(t))
    ) {
      var e = t.replace(/-/g, "_");
      R[e] = function () {
        for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
        return P(document.createElementNS(A, t), e);
      };
    }
  };
  try {
    for (
      var B = E(
          "a altGlyph altGlyphDef altGlyphItem animate animateMotion animateTransform circle clipPath color-profile cursor defs desc discard ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font font-face font-face-format font-face-name font-face-src font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient marker mask metadata missing-glyph mpath path pattern polygon polyline radialGradient rect script set stop style svg switch symbol text textPath title tref tspan use view vkern".split(
            " "
          )
        ),
        G = B.next();
      !G.done;
      G = B.next()
    ) {
      H(G.value);
    }
  } catch (t) {
    D = { error: t };
  } finally {
    try {
      G && !G.done && (q = B.return) && q.call(B);
    } finally {
      if (D) throw D.error;
    }
  }
  class V {
    static resetColors() {
      this.colorLookup.clear();
    }
    static getComputedChannelColor(t, e) {
      if (this.usesColorFormula) return V.getChannelColor(t, e);
      {
        let i = V.getChannelColor(t, e);
        var n = /\(([^)]+)\)/;
        return {
          secondaryChannel: V.getComputed(n.exec(i.secondaryChannel)[1]),
          primaryChannel: V.getComputed(n.exec(i.primaryChannel)[1]),
          secondaryNote: V.getComputed(n.exec(i.secondaryNote)[1]),
          primaryNote: V.getComputed(n.exec(i.primaryNote)[1]),
        };
      }
    }
    static getChannelColor(t, n) {
      if (this.usesColorFormula) {
        if (V.colorLookup.has(n)) return V.colorLookup.get(n);
        if (n < t.pitchChannelCount) {
          let t = {
            secondaryChannel:
              "hsl(" +
              ((this.c_pitchSecondaryChannelHue +
                ((n * this.c_pitchSecondaryChannelHueScale) /
                  e.pitchChannelCountMax) *
                  256) %
                360) +
              "," +
              this.c_pitchSecondaryChannelSat *
                (1 - this.c_pitchSecondaryChannelSatScale * Math.floor(n / 9)) +
              "%," +
              this.c_pitchSecondaryChannelLum *
                (1 - this.c_pitchSecondaryChannelLumScale * Math.floor(n / 9)) +
              "%)",
            primaryChannel:
              "hsl(" +
              ((this.c_pitchPrimaryChannelHue +
                ((n * this.c_pitchPrimaryChannelHueScale) /
                  e.pitchChannelCountMax) *
                  256) %
                360) +
              "," +
              this.c_pitchPrimaryChannelSat *
                (1 - this.c_pitchPrimaryChannelSatScale * Math.floor(n / 9)) +
              "%," +
              this.c_pitchPrimaryChannelLum *
                (1 - this.c_pitchPrimaryChannelLumScale * Math.floor(n / 9)) +
              "%)",
            secondaryNote:
              "hsl(" +
              ((this.c_pitchSecondaryNoteHue +
                ((n * this.c_pitchSecondaryNoteHueScale) /
                  e.pitchChannelCountMax) *
                  256) %
                360) +
              "," +
              this.c_pitchSecondaryNoteSat *
                (1 - this.c_pitchSecondaryNoteSatScale * Math.floor(n / 9)) +
              "%," +
              this.c_pitchSecondaryNoteLum *
                (1 - this.c_pitchSecondaryNoteLumScale * Math.floor(n / 9)) +
              "%)",
            primaryNote:
              "hsl(" +
              ((this.c_pitchPrimaryNoteHue +
                ((n * this.c_pitchPrimaryNoteHueScale) /
                  e.pitchChannelCountMax) *
                  256) %
                360) +
              "," +
              this.c_pitchPrimaryNoteSat *
                (1 - this.c_pitchPrimaryNoteSatScale * Math.floor(n / 9)) +
              "%," +
              this.c_pitchPrimaryNoteLum *
                (1 - this.c_pitchPrimaryNoteLumScale * Math.floor(n / 9)) +
              "%)",
          };
          return V.colorLookup.set(n, t), t;
        }
        if (n < t.pitchChannelCount + t.noiseChannelCount) {
          let i = {
            secondaryChannel:
              "hsl(" +
              ((this.c_noiseSecondaryChannelHue +
                (((n - t.pitchChannelCount) *
                  this.c_noiseSecondaryChannelHueScale) /
                  e.noiseChannelCountMax) *
                  256) %
                360) +
              "," +
              (this.c_noiseSecondaryChannelSat +
                n * this.c_noiseSecondaryChannelSatScale) +
              "%," +
              (this.c_noiseSecondaryChannelLum +
                n * this.c_noiseSecondaryChannelLumScale) +
              "%)",
            primaryChannel:
              "hsl(" +
              ((this.c_noisePrimaryChannelHue +
                (((n - t.pitchChannelCount) *
                  this.c_noisePrimaryChannelHueScale) /
                  e.noiseChannelCountMax) *
                  256) %
                360) +
              "," +
              (this.c_noisePrimaryChannelSat +
                n * this.c_noisePrimaryChannelSatScale) +
              "%," +
              (this.c_noisePrimaryChannelLum +
                n * this.c_noisePrimaryChannelLumScale) +
              "%)",
            secondaryNote:
              "hsl(" +
              ((this.c_noiseSecondaryNoteHue +
                (((n - t.pitchChannelCount) *
                  this.c_noiseSecondaryNoteHueScale) /
                  e.noiseChannelCountMax) *
                  256) %
                360) +
              "," +
              (this.c_noiseSecondaryNoteSat +
                n * this.c_noiseSecondaryNoteSatScale) +
              "%," +
              (this.c_noiseSecondaryNoteLum +
                n * this.c_noiseSecondaryNoteLumScale) +
              "%)",
            primaryNote:
              "hsl(" +
              ((this.c_noisePrimaryNoteHue +
                (((n - t.pitchChannelCount) * this.c_noisePrimaryNoteHueScale) /
                  e.noiseChannelCountMax) *
                  256) %
                360) +
              "," +
              (this.c_noisePrimaryNoteSat +
                n * this.c_noisePrimaryNoteSatScale) +
              "%," +
              (this.c_noisePrimaryNoteLum +
                n * this.c_noisePrimaryNoteLumScale) +
              "%)",
          };
          return V.colorLookup.set(n, i), i;
        }
        {
          let i = {
            secondaryChannel:
              "hsl(" +
              ((this.c_modSecondaryChannelHue +
                (((n - t.pitchChannelCount - t.noiseChannelCount) *
                  this.c_modSecondaryChannelHueScale) /
                  e.modChannelCountMax) *
                  256) %
                360) +
              "," +
              (this.c_modSecondaryChannelSat +
                n * this.c_modSecondaryChannelSatScale) +
              "%," +
              (this.c_modSecondaryChannelLum +
                n * this.c_modSecondaryChannelLumScale) +
              "%)",
            primaryChannel:
              "hsl(" +
              ((this.c_modPrimaryChannelHue +
                (((n - t.pitchChannelCount - t.noiseChannelCount) *
                  this.c_modPrimaryChannelHueScale) /
                  e.modChannelCountMax) *
                  256) %
                360) +
              "," +
              (this.c_modPrimaryChannelSat +
                n * this.c_modPrimaryChannelSatScale) +
              "%," +
              (this.c_modPrimaryChannelLum +
                n * this.c_modPrimaryChannelLumScale) +
              "%)",
            secondaryNote:
              "hsl(" +
              ((this.c_modSecondaryNoteHue +
                (((n - t.pitchChannelCount - t.noiseChannelCount) *
                  this.c_modSecondaryNoteHueScale) /
                  e.modChannelCountMax) *
                  256) %
                360) +
              "," +
              (this.c_modSecondaryNoteSat +
                n * this.c_modSecondaryNoteSatScale) +
              "%," +
              (this.c_modSecondaryNoteLum +
                n * this.c_modSecondaryNoteLumScale) +
              "%)",
            primaryNote:
              "hsl(" +
              ((this.c_modPrimaryNoteHue +
                (((n - t.pitchChannelCount - t.noiseChannelCount) *
                  this.c_modPrimaryNoteHueScale) /
                  e.modChannelCountMax) *
                  256) %
                360) +
              "," +
              (this.c_modPrimaryNoteSat + n * this.c_modPrimaryNoteSatScale) +
              "%," +
              (this.c_modPrimaryNoteLum + n * this.c_modPrimaryNoteLumScale) +
              "%)",
          };
          return V.colorLookup.set(n, i), i;
        }
      }
      return n < t.pitchChannelCount
        ? V.pitchChannels[n % V.pitchChannels.length]
        : n < t.pitchChannelCount + t.noiseChannelCount
        ? V.noiseChannels[(n - t.pitchChannelCount) % V.noiseChannels.length]
        : V.modChannels[
            (n - t.pitchChannelCount - t.noiseChannelCount) %
              V.modChannels.length
          ];
    }
    static setTheme(t) {
      let e = this.themes[t];
      null == e && (e = this.themes["jummbox classic"]),
        (this.l.textContent = e);
      const n = document.querySelector("meta[name='theme-color']");
      null != n &&
        n.setAttribute(
          "content",
          getComputedStyle(document.documentElement).getPropertyValue(
            "--ui-widget-background"
          )
        ),
        this.resetColors(),
        (this.usesColorFormula =
          "true" ==
          getComputedStyle(this.l)
            .getPropertyValue("--use-color-formula")
            .trim()),
        (this.c_invertedText = getComputedStyle(this.l).getPropertyValue(
          "--inverted-text"
        )),
        (this.c_trackEditorBgNoiseDim = getComputedStyle(
          this.l
        ).getPropertyValue("--track-editor-bg-noise-dim")),
        (this.c_trackEditorBgNoise = getComputedStyle(this.l).getPropertyValue(
          "--track-editor-bg-noise"
        )),
        (this.c_trackEditorBgModDim = getComputedStyle(this.l).getPropertyValue(
          "--track-editor-bg-mod-dim"
        )),
        (this.c_trackEditorBgMod = getComputedStyle(this.l).getPropertyValue(
          "--track-editor-bg-mod"
        )),
        (this.c_trackEditorBgPitchDim = getComputedStyle(
          this.l
        ).getPropertyValue("--track-editor-bg-pitch-dim")),
        (this.c_trackEditorBgPitch = getComputedStyle(this.l).getPropertyValue(
          "--track-editor-bg-pitch"
        )),
        this.usesColorFormula &&
          ((this.c_pitchSecondaryChannelHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-channel-hue")),
          (this.c_pitchSecondaryChannelHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-channel-hue-scale")),
          (this.c_pitchSecondaryChannelSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-channel-sat")),
          (this.c_pitchSecondaryChannelSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-channel-sat-scale")),
          (this.c_pitchSecondaryChannelLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-channel-lum")),
          (this.c_pitchSecondaryChannelLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-channel-lum-scale")),
          (this.c_pitchPrimaryChannelHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-channel-hue")),
          (this.c_pitchPrimaryChannelHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-channel-hue-scale")),
          (this.c_pitchPrimaryChannelSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-channel-sat")),
          (this.c_pitchPrimaryChannelSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-channel-sat-scale")),
          (this.c_pitchPrimaryChannelLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-channel-lum")),
          (this.c_pitchPrimaryChannelLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-channel-lum-scale")),
          (this.c_pitchSecondaryNoteHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-note-hue")),
          (this.c_pitchSecondaryNoteHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-note-hue-scale")),
          (this.c_pitchSecondaryNoteSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-note-sat")),
          (this.c_pitchSecondaryNoteSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-note-sat-scale")),
          (this.c_pitchSecondaryNoteLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-note-lum")),
          (this.c_pitchSecondaryNoteLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-secondary-note-lum-scale")),
          (this.c_pitchPrimaryNoteHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-note-hue")),
          (this.c_pitchPrimaryNoteHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-note-hue-scale")),
          (this.c_pitchPrimaryNoteSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-note-sat")),
          (this.c_pitchPrimaryNoteSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-note-sat-scale")),
          (this.c_pitchPrimaryNoteLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-note-lum")),
          (this.c_pitchPrimaryNoteLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--pitch-primary-note-lum-scale")),
          (this.c_noiseSecondaryChannelHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-channel-hue")),
          (this.c_noiseSecondaryChannelHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-channel-hue-scale")),
          (this.c_noiseSecondaryChannelSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-channel-sat")),
          (this.c_noiseSecondaryChannelSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-channel-sat-scale")),
          (this.c_noiseSecondaryChannelLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-channel-lum")),
          (this.c_noiseSecondaryChannelLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-channel-lum-scale")),
          (this.c_noisePrimaryChannelHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-channel-hue")),
          (this.c_noisePrimaryChannelHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-channel-hue-scale")),
          (this.c_noisePrimaryChannelSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-channel-sat")),
          (this.c_noisePrimaryChannelSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-channel-sat-scale")),
          (this.c_noisePrimaryChannelLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-channel-lum")),
          (this.c_noisePrimaryChannelLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-channel-lum-scale")),
          (this.c_noiseSecondaryNoteHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-note-hue")),
          (this.c_noiseSecondaryNoteHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-note-hue-scale")),
          (this.c_noiseSecondaryNoteSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-note-sat")),
          (this.c_noiseSecondaryNoteSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-note-sat-scale")),
          (this.c_noiseSecondaryNoteLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-note-lum")),
          (this.c_noiseSecondaryNoteLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-secondary-note-lum-scale")),
          (this.c_noisePrimaryNoteHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-note-hue")),
          (this.c_noisePrimaryNoteHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-note-hue-scale")),
          (this.c_noisePrimaryNoteSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-note-sat")),
          (this.c_noisePrimaryNoteSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-note-sat-scale")),
          (this.c_noisePrimaryNoteLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-note-lum")),
          (this.c_noisePrimaryNoteLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--noise-primary-note-lum-scale")),
          (this.c_modSecondaryChannelHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-channel-hue")),
          (this.c_modSecondaryChannelHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-channel-hue-scale")),
          (this.c_modSecondaryChannelSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-channel-sat")),
          (this.c_modSecondaryChannelSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-channel-sat-scale")),
          (this.c_modSecondaryChannelLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-channel-lum")),
          (this.c_modSecondaryChannelLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-channel-lum-scale")),
          (this.c_modPrimaryChannelHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-channel-hue")),
          (this.c_modPrimaryChannelHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-channel-hue-scale")),
          (this.c_modPrimaryChannelSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-channel-sat")),
          (this.c_modPrimaryChannelSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-channel-sat-scale")),
          (this.c_modPrimaryChannelLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-channel-lum")),
          (this.c_modPrimaryChannelLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-channel-lum-scale")),
          (this.c_modSecondaryNoteHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-note-hue")),
          (this.c_modSecondaryNoteHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-note-hue-scale")),
          (this.c_modSecondaryNoteSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-note-sat")),
          (this.c_modSecondaryNoteSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-note-sat-scale")),
          (this.c_modSecondaryNoteLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-note-lum")),
          (this.c_modSecondaryNoteLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-secondary-note-lum-scale")),
          (this.c_modPrimaryNoteHue = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-note-hue")),
          (this.c_modPrimaryNoteHueScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-note-hue-scale")),
          (this.c_modPrimaryNoteSat = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-note-sat")),
          (this.c_modPrimaryNoteSatScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-note-sat-scale")),
          (this.c_modPrimaryNoteLum = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-note-lum")),
          (this.c_modPrimaryNoteLumScale = +getComputedStyle(
            this.l
          ).getPropertyValue("--mod-primary-note-lum-scale")));
    }
    static getComputed(t) {
      return getComputedStyle(this.l).getPropertyValue(t);
    }
  }
  (V.colorLookup = new Map()),
    (V.usesColorFormula = !1),
    (V.themes = {
      "dark classic":
        "\n\t\t\t:root {\n\t\t\t\t--page-margin: black;\n\t\t\t\t--editor-background: black;\n\t\t\t\t--hover-preview: white;\n\t\t\t\t--playhead: white;\n\t\t\t\t--primary-text: white;\n\t\t\t\t--secondary-text: #999;\n\t\t\t\t--inverted-text: black;\n\t\t\t\t--text-selection: rgba(119,68,255,0.99);\n\t\t\t\t--box-selection-fill: rgba(255,255,255,0.2);\n\t\t\t\t--loop-accent: #74f;\n\t\t\t\t--link-accent: #98f;\n\t\t\t\t--ui-widget-background: #444;\n\t\t\t\t--ui-widget-focus: #777;\n\t\t\t\t--pitch-background: #444;\n\t\t\t\t--tonic: #864;\n\t\t\t\t--fifth-note: #468;\n\t\t\t\t--white-piano-key: #bbb;\n\t\t\t\t--black-piano-key: #444;\n\t\t\t\t\t--use-color-formula: false;\n\t\t\t\t\t--track-editor-bg-pitch: #444;\n\t\t\t\t\t--track-editor-bg-pitch-dim: #333;\n\t\t\t\t\t--track-editor-bg-noise: #444;\n\t\t\t\t\t--track-editor-bg-noise-dim: #333;\n\t\t\t\t\t--track-editor-bg-mod: #234;\n\t\t\t\t\t--track-editor-bg-mod-dim: #123;\n\t\t\t\t\t--multiplicative-mod-slider: #456;\n\t\t\t\t\t--overwriting-mod-slider: #654;\n\t\t\t\t\t--indicator-primary: #74f;\n\t\t\t\t\t--indicator-secondary: #444;\n\t\t\t\t\t--select2-opt-group: #585858;\n\t\t\t\t\t--input-box-outline: #333;\n\t\t\t\t\t--mute-button-normal: #ffa033;\n\t\t\t\t\t--mute-button-mod: #9a6bff;\n\t\t\t\t--pitch1-secondary-channel: #0099A1;\n\t\t\t\t--pitch1-primary-channel:   #25F3FF;\n\t\t\t\t--pitch1-secondary-note:    #00BDC7;\n\t\t\t\t--pitch1-primary-note:      #92F9FF;\n\t\t\t\t--pitch2-secondary-channel: #A1A100;\n\t\t\t\t--pitch2-primary-channel:   #FFFF25;\n\t\t\t\t--pitch2-secondary-note:    #C7C700;\n\t\t\t\t--pitch2-primary-note:      #FFFF92;\n\t\t\t\t--pitch3-secondary-channel: #C75000;\n\t\t\t\t--pitch3-primary-channel:   #FF9752;\n\t\t\t\t--pitch3-secondary-note:    #FF771C;\n\t\t\t\t--pitch3-primary-note:      #FFCDAB;\n\t\t\t\t--pitch4-secondary-channel: #00A100;\n\t\t\t\t--pitch4-primary-channel:   #50FF50;\n\t\t\t\t--pitch4-secondary-note:    #00C700;\n\t\t\t\t--pitch4-primary-note:      #A0FFA0;\n\t\t\t\t--pitch5-secondary-channel: #D020D0;\n\t\t\t\t--pitch5-primary-channel:   #FF90FF;\n\t\t\t\t--pitch5-secondary-note:    #E040E0;\n\t\t\t\t--pitch5-primary-note:      #FFC0FF;\n\t\t\t\t--pitch6-secondary-channel: #7777B0;\n\t\t\t\t--pitch6-primary-channel:   #A0A0FF;\n\t\t\t\t--pitch6-secondary-note:    #8888D0;\n\t\t\t\t--pitch6-primary-note:      #D0D0FF;\n\t\t\t\t--pitch7-secondary-channel: #8AA100;\n\t\t\t\t--pitch7-primary-channel:   #DEFF25;\n\t\t\t\t--pitch7-secondary-note:    #AAC700;\n\t\t\t\t--pitch7-primary-note:      #E6FF92;\n\t\t\t\t--pitch8-secondary-channel: #DF0019;\n\t\t\t\t--pitch8-primary-channel:   #FF98A4;\n\t\t\t\t--pitch8-secondary-note:    #FF4E63;\n\t\t\t\t--pitch8-primary-note:      #FFB2BB;\n\t\t\t\t--pitch9-secondary-channel: #00A170;\n\t\t\t\t--pitch9-primary-channel:   #50FFC9;\n\t\t\t\t--pitch9-secondary-note:    #00C78A;\n\t\t\t\t--pitch9-primary-note:      #83FFD9;\n\t\t\t\t--pitch10-secondary-channel:#A11FFF;\n\t\t\t\t--pitch10-primary-channel:  #CE8BFF;\n\t\t\t\t--pitch10-secondary-note:   #B757FF;\n\t\t\t\t--pitch10-primary-note:     #DFACFF;\n\t\t\t\t--noise1-secondary-channel: #6F6F6F;\n\t\t\t\t--noise1-primary-channel:   #AAAAAA;\n\t\t\t\t--noise1-secondary-note:    #A7A7A7;\n\t\t\t\t--noise1-primary-note:      #E0E0E0;\n\t\t\t\t--noise2-secondary-channel: #996633;\n\t\t\t\t--noise2-primary-channel:   #DDAA77;\n\t\t\t\t--noise2-secondary-note:    #CC9966;\n\t\t\t\t--noise2-primary-note:      #F0D0BB;\n\t\t\t\t--noise3-secondary-channel: #4A6D8F;\n\t\t\t\t--noise3-primary-channel:   #77AADD;\n\t\t\t\t--noise3-secondary-note:    #6F9FCF;\n\t\t\t\t--noise3-primary-note:      #BBD7FF;\n\t\t\t\t--noise4-secondary-channel: #7A4F9A;\n\t\t\t\t--noise4-primary-channel:   #AF82D2;\n\t\t\t\t--noise4-secondary-note:    #9E71C1;\n\t\t\t\t--noise4-primary-note:      #D4C1EA;\n\t\t\t\t--noise5-secondary-channel: #607837;\n\t\t\t\t--noise5-primary-channel:   #A2BB77;\n\t\t\t\t--noise5-secondary-note:    #91AA66;\n\t\t\t\t--noise5-primary-note:      #C5E2B2;\n          --mod1-secondary-channel:   #339955;\n\t\t\t\t\t--mod1-primary-channel:     #77fc55;\n\t\t\t\t\t--mod1-secondary-note:      #77ff8a;\n\t\t\t\t\t--mod1-primary-note:        #cdffee;\n\t\t\t\t\t--mod2-secondary-channel:   #993355;\n\t\t\t\t\t--mod2-primary-channel:     #f04960;\n\t\t\t\t\t--mod2-secondary-note:      #f057a0;\n\t\t\t\t\t--mod2-primary-note:        #ffb8de;\n\t\t\t\t\t--mod3-secondary-channel:   #553399;\n\t\t\t\t\t--mod3-primary-channel:     #8855fc;\n\t\t\t\t\t--mod3-secondary-note:      #aa64ff;\n\t\t\t\t\t--mod3-primary-note:\t    #f8ddff;\n\t\t\t\t\t--mod4-secondary-channel:   #a86436;\n\t\t\t\t\t--mod4-primary-channel:     #c8a825;\n\t\t\t\t\t--mod4-secondary-note:      #e8ba46;\n\t\t\t\t\t--mod4-primary-note:        #fff6d3;\n\t\t\t\t\t--mod-label-primary:        #999;\n\t\t\t\t\t--mod-label-secondary-text: #333;\n\t\t\t\t\t--mod-label-primary-text:   black;\n\t\t\t\t\t--disabled-note-primary:    #999;\n\t\t\t\t\t--disabled-note-secondary:  #666;\n\t\t\t\t}\n\t\t\t",
      "dark competition":
        "\n\t\t\t\t:root {\n\t\t\t\t\t--page-margin: black;\n\t\t\t\t\t--editor-background: black;\n\t\t\t\t\t--hover-preview: #ddd;\n\t\t\t\t\t--playhead: #ddd;\n\t\t\t\t\t--primary-text: #ddd;\n\t\t\t\t\t--secondary-text: #8e695b;\n\t\t\t\t\t--inverted-text: black;\n\t\t\t\t\t--text-selection: rgba(169,0,255,0.99);\n\t\t\t\t\t--box-selection-fill: rgba(221,221,221,0.2);\n\t\t\t\t\t--loop-accent: #bf15ba;\n\t\t\t\t\t--link-accent: #f888ff;\n\t\t\t\t\t--ui-widget-background: #443a3a;\n\t\t\t\t\t--ui-widget-focus: #777;\n\t\t\t\t\t--pitch-background: #353333;\n\t\t\t\t\t--tonic: #884a44;\n\t\t\t\t\t--fifth-note: #415498;\n\t\t\t\t\t--white-piano-key: #bbb;\n\t\t\t\t\t--black-piano-key: #444;\n\t\t\t\t\t--use-color-formula: false;\n\t\t\t\t\t--track-editor-bg-pitch: #444;\n\t\t\t\t\t--track-editor-bg-pitch-dim: #333;\n\t\t\t\t\t--track-editor-bg-noise: #444;\n\t\t\t\t\t--track-editor-bg-noise-dim: #333;\n\t\t\t\t\t--track-editor-bg-mod: #234;\n\t\t\t\t\t--track-editor-bg-mod-dim: #123;\n\t\t\t\t\t--multiplicative-mod-slider: #456;\n\t\t\t\t\t--overwriting-mod-slider: #654;\n\t\t\t\t\t--indicator-primary: #74f;\n\t\t\t\t\t--indicator-secondary: #444;\n\t\t\t\t\t--select2-opt-group: #585858;\n\t\t\t\t\t--input-box-outline: #333;\n\t\t\t\t\t--mute-button-normal: #ffa033;\n\t\t\t\t\t--mute-button-mod: #9a6bff;\n\t\t\t\t\t--pitch1-secondary-channel: #0099a1;\n\t\t\t\t\t--pitch1-primary-channel:   #25f3ff;\n\t\t\t\t\t--pitch1-secondary-note:    #00bdc7;\n\t\t\t\t\t--pitch1-primary-note:      #92f9ff;\n\t\t\t\t\t--pitch2-secondary-channel: #a1a100;\n\t\t\t\t\t--pitch2-primary-channel:   #ffff25;\n\t\t\t\t\t--pitch2-secondary-note:    #c7c700;\n\t\t\t\t\t--pitch2-primary-note:      #ffff92;\n\t\t\t\t\t--pitch3-secondary-channel: #c75000;\n\t\t\t\t\t--pitch3-primary-channel:   #ff9752;\n\t\t\t\t\t--pitch3-secondary-note:    #ff771c;\n\t\t\t\t\t--pitch3-primary-note:      #ffcdab;\n\t\t\t\t\t--pitch4-secondary-channel: #00a100;\n\t\t\t\t\t--pitch4-primary-channel:   #50ff50;\n\t\t\t\t\t--pitch4-secondary-note:    #00c700;\n\t\t\t\t\t--pitch4-primary-note:      #a0ffa0;\n\t\t\t\t\t--pitch5-secondary-channel: #d020d0;\n\t\t\t\t\t--pitch5-primary-channel:   #ff90ff;\n\t\t\t\t\t--pitch5-secondary-note:    #e040e0;\n\t\t\t\t\t--pitch5-primary-note:      #ffc0ff;\n\t\t\t\t\t--pitch6-secondary-channel: #7777b0;\n\t\t\t\t\t--pitch6-primary-channel:   #a0a0ff;\n\t\t\t\t\t--pitch6-secondary-note:    #8888d0;\n\t\t\t\t\t--pitch6-primary-note:      #d0d0ff;\n\t\t\t\t\t--pitch7-secondary-channel: #8AA100;\n\t\t\t\t\t--pitch7-primary-channel:   #DEFF25;\n\t\t\t\t\t--pitch7-secondary-note:\t  #AAC700;\n\t\t\t\t\t--pitch7-primary-note:\t\t\t#E6FF92;\n\t\t\t\t\t--pitch8-secondary-channel: #DF0019;\n\t\t\t\t\t--pitch8-primary-channel:   #FF98A4;\n\t\t\t\t\t--pitch8-secondary-note:    #FF4E63;\n\t\t\t\t\t--pitch8-primary-note:      #FFB2BB;\n\t\t\t\t\t--pitch9-secondary-channel: #00A170;\n\t\t\t\t\t--pitch9-primary-channel:   #50FFC9;\n\t\t\t\t\t--pitch9-secondary-note:    #00C78A;\n\t\t\t\t\t--pitch9-primary-note:\t\t\t#83FFD9;\n\t\t\t\t\t--pitch10-secondary-channel:#A11FFF;\n\t\t\t\t\t--pitch10-primary-channel:  #CE8BFF;\n\t\t\t\t\t--pitch10-secondary-note:   #B757FF;\n\t\t\t\t\t--pitch10-primary-note:     #DFACFF;\n\t\t\t\t\t--noise1-secondary-channel: #6f6f6f;\n\t\t\t\t\t--noise1-primary-channel:   #aaaaaa;\n\t\t\t\t\t--noise1-secondary-note:    #a7a7a7;\n\t\t\t\t\t--noise1-primary-note:      #e0e0e0;\n\t\t\t\t\t--noise2-secondary-channel: #996633;\n\t\t\t\t\t--noise2-primary-channel:   #ddaa77;\n\t\t\t\t\t--noise2-secondary-note:    #cc9966;\n\t\t\t\t\t--noise2-primary-note:      #f0d0bb;\n\t\t\t\t\t--noise3-secondary-channel: #4a6d8f;\n\t\t\t\t\t--noise3-primary-channel:   #77aadd;\n\t\t\t\t\t--noise3-secondary-note:    #6f9fcf;\n\t\t\t\t\t--noise3-primary-note:      #bbd7ff;\n\t\t\t\t\t--noise4-secondary-channel: #6B3E8E;\n\t\t\t\t\t--noise4-primary-channel:   #AF82D2;\n\t\t\t\t\t--noise4-secondary-note:    #9E71C1;\n\t\t\t\t\t--noise4-primary-note:      #D4C1EA;\n\t\t\t\t\t--noise5-secondary-channel: #607837;\n\t\t\t\t\t--noise5-primary-channel:   #A2BB77;\n\t\t\t\t\t--noise5-secondary-note:    #91AA66;\n\t\t\t\t\t--noise5-primary-note:      #C5E2B2;\n\t\t\t\t\t--mod1-secondary-channel:   #339955;\n\t\t\t\t\t--mod1-primary-channel:     #77fc55;\n\t\t\t\t\t--mod1-secondary-note:      #77ff8a;\n\t\t\t\t\t--mod1-primary-note:        #cdffee;\n\t\t\t\t\t--mod2-secondary-channel:   #993355;\n\t\t\t\t\t--mod2-primary-channel:     #f04960;\n\t\t\t\t\t--mod2-secondary-note:      #f057a0;\n\t\t\t\t\t--mod2-primary-note:        #ffb8de;\n\t\t\t\t\t--mod3-secondary-channel:   #553399;\n\t\t\t\t\t--mod3-primary-channel:     #8855fc;\n\t\t\t\t\t--mod3-secondary-note:      #aa64ff;\n\t\t\t\t\t--mod3-primary-note:\t\t\t  #f8ddff;\n\t\t\t\t\t--mod4-secondary-channel:   #a86436;\n\t\t\t\t\t--mod4-primary-channel:     #c8a825;\n\t\t\t\t\t--mod4-secondary-note:      #e8ba46;\n\t\t\t\t\t--mod4-primary-note:        #fff6d3;\n\t\t\t\t\t--mod-label-primary:        #999;\n\t\t\t\t\t--mod-label-secondary-text: #333;\n\t\t\t\t\t--mod-label-primary-text:   black;\n\t\t\t\t\t--disabled-note-primary:    #999;\n\t\t\t\t\t--disabled-note-secondary:  #666;\n\n\t\t\t}\n\t\t",
      "light classic":
        "\n\t\t\t:root {\n\t\t\t\t-webkit-text-stroke-width: 0.5px;\n\t\t\t\t--page-margin: #685d88;\n\t\t\t\t--editor-background: white;\n\t\t\t\t--hover-preview: black;\n\t\t\t\t--playhead: rgba(0,0,0,0.5);\n\t\t\t\t--primary-text: black;\n\t\t\t\t--secondary-text: #777;\n\t\t\t\t--inverted-text: white;\n\t\t\t\t--text-selection: rgba(200,170,255,0.99);\n\t\t\t\t--box-selection-fill: rgba(0,0,0,0.1);\n\t\t\t\t--loop-accent: #98f;\n\t\t\t\t--link-accent: #74f;\n\t\t\t\t--ui-widget-background: #ececec;\n\t\t\t\t--ui-widget-focus: #eee;\n\t\t\t\t--pitch-background: #ececec;\n\t\t\t\t--tonic: #f0d6b6;\n\t\t\t\t--fifth-note: #bbddf0;\n\t\t\t\t--white-piano-key: #eee;\n\t\t\t\t--black-piano-key: #666;\n\t\t\t\t\t--use-color-formula: false;\n\t\t\t\t\t--track-editor-bg-pitch: #ececec;\n\t\t\t\t\t--track-editor-bg-pitch-dim: #fdfdfd;\n\t\t\t\t\t--track-editor-bg-noise: #ececec;\n\t\t\t\t\t--track-editor-bg-noise-dim: #fdfdfd;\n\t\t\t\t\t--track-editor-bg-mod: #dbecfd;\n\t\t\t\t\t--track-editor-bg-mod-dim: #ecfdff;\n\t\t\t\t\t--multiplicative-mod-slider: #789;\n\t\t\t\t\t--overwriting-mod-slider: #987;\n\t\t\t\t\t--indicator-primary: #98f;\n\t\t\t\t\t--indicator-secondary: #cde;\n\t\t\t\t\t--select2-opt-group: #cecece;\n\t\t\t\t\t--input-box-outline: #ddd;\n\t\t\t\t\t--mute-button-normal: #c0b47f;\n\t\t\t\t\t--mute-button-mod: #bd7fc0;\n\t\t\t\t--pitch1-secondary-channel: #6CD9ED;\n\t\t\t\t--pitch1-primary-channel:   #00A0BD;\n\t\t\t\t--pitch1-secondary-note:    #34C2DC;\n\t\t\t\t--pitch1-primary-note:      #00758A;\n\t\t\t\t--pitch2-secondary-channel: #E3C941;\n\t\t\t\t--pitch2-primary-channel:   #B49700;\n\t\t\t\t--pitch2-secondary-note:    #D1B628;\n\t\t\t\t--pitch2-primary-note:      #836E00;\n\t\t\t\t--pitch3-secondary-channel: #FF9D61;\n\t\t\t\t--pitch3-primary-channel:   #E14E00;\n\t\t\t\t--pitch3-secondary-note:    #F67D3C;\n\t\t\t\t--pitch3-primary-note:      #B64000;\n\t\t\t\t--pitch4-secondary-channel: #4BE24B;\n\t\t\t\t--pitch4-primary-channel:   #00A800;\n\t\t\t\t--pitch4-secondary-note:    #2DC82D;\n\t\t\t\t--pitch4-primary-note:      #008000;\n\t\t\t\t--pitch5-secondary-channel: #FF90FF;\n\t\t\t\t--pitch5-primary-channel:   #E12EDF;\n\t\t\t\t--pitch5-secondary-note:    #EC6EEC;\n\t\t\t\t--pitch5-primary-note:      #A600A5;\n\t\t\t\t--pitch6-secondary-channel: #B5B5FE;\n\t\t\t\t--pitch6-primary-channel:   #6969FD;\n\t\t\t\t--pitch6-secondary-note:    #9393FE;\n\t\t\t\t--pitch6-primary-note:      #4A4AD7;\n\t\t\t\t--pitch7-secondary-channel: #C2D848;\n\t\t\t\t--pitch7-primary-channel:   #8EA800;\n\t\t\t\t--pitch7-secondary-note:    #B0C82D;\n\t\t\t\t--pitch7-primary-note:      #6C8000;\n\t\t\t\t--pitch8-secondary-channel: #FF90A4;\n\t\t\t\t--pitch8-primary-channel:   #E12E4D;\n\t\t\t\t--pitch8-secondary-note:    #EC6E85;\n\t\t\t\t--pitch8-primary-note:      #A6001D;\n\t\t\t\t--pitch9-secondary-channel: #41E3B5;\n\t\t\t\t--pitch9-primary-channel:   #00B481;\n\t\t\t\t--pitch9-secondary-note:    #28D1A1;\n\t\t\t\t--pitch9-primary-note:      #00835E;\n\t\t\t\t--pitch10-secondary-channel:#CA77FF;\n\t\t\t\t--pitch10-primary-channel:  #9609FF;\n\t\t\t\t--pitch10-secondary-note:   #B54FFF;\n\t\t\t\t--pitch10-primary-note:     #8400E3;\n\t\t\t\t--noise1-secondary-channel: #C1C1C1;\n\t\t\t\t--noise1-primary-channel:   #898989;\n\t\t\t\t--noise1-secondary-note:    #ADADAD;\n\t\t\t\t--noise1-primary-note:      #6C6C6C;\n\t\t\t\t--noise2-secondary-channel: #E8BB8C;\n\t\t\t\t--noise2-primary-channel:   #BD7D3A;\n\t\t\t\t--noise2-secondary-note:    #D1A374;\n\t\t\t\t--noise2-primary-note:      #836342;\n\t\t\t\t--noise3-secondary-channel: #9BC4EB;\n\t\t\t\t--noise3-primary-channel:   #4481BE;\n\t\t\t\t--noise3-secondary-note:    #7CA7D3;\n\t\t\t\t--noise3-primary-note:      #476685;\n\t\t\t\t--noise4-secondary-channel: #C5A5E0;\n\t\t\t\t--noise4-primary-channel:   #8553AE;\n\t\t\t\t--noise4-secondary-note:    #B290CC;\n\t\t\t\t--noise4-primary-note:      #684F7D;\n\t\t\t\t--noise5-secondary-channel: #B8CE93;\n\t\t\t\t--noise5-primary-channel:   #87A74F;\n\t\t\t\t--noise5-secondary-note:    #ABC183;\n\t\t\t\t--noise5-primary-note:      #68784C;\n\t\t\t\t\t--mod1-secondary-channel:   #339955;\n\t\t\t\t\t--mod1-primary-channel:     #77dd55;\n\t\t\t\t\t--mod1-secondary-note:      #77ff8a;\n\t\t\t\t\t--mod1-primary-note:        #2ad84a;\n\t\t\t\t\t--mod2-secondary-channel:   #993355;\n\t\t\t\t\t--mod2-primary-channel:     #f04960;\n\t\t\t\t\t--mod2-secondary-note:      #f057a0;\n\t\t\t\t\t--mod2-primary-note:        #ba124a;\n\t\t\t\t\t--mod3-secondary-channel:   #553399;\n\t\t\t\t\t--mod3-primary-channel:     #8855fc;\n\t\t\t\t\t--mod3-secondary-note:      #aa64ff;\n\t\t\t\t\t--mod3-primary-note:        #7a1caa;\n\t\t\t\t\t--mod4-secondary-channel:   #a86436;\n\t\t\t\t\t--mod4-primary-channel:     #c8a825;\n\t\t\t\t\t--mod4-secondary-note:      #e8ba46;\n\t\t\t\t\t--mod4-primary-note:        #a86810;\n\t\t\t\t\t--mod-label-primary:        #dddddd;\n\t\t\t\t\t--mod-label-secondary-text: #777;\n\t\t\t\t\t--mod-label-primary-text:   black;\n\t\t\t\t\t--disabled-note-primary:    #666;\n\t\t\t\t\t--disabled-note-secondary:  #aaa;\n\t\t\t}\n\t\t\t\n\t\t\t.beepboxEditor button, .beepboxEditor select {\n\t\t\t\tbox-shadow: inset 0 0 0 1px var(--secondary-text);\n\t\t\t}\n\n\t\t\t\t.select2-selection__rendered {\n\t\t\t\t\tbox-shadow: inset 0 0 0 1px var(--secondary-text);\n\t\t\t\t}\n\t\t",
      "jummbox classic":
        "\n\t\t\t\t:root {\n\t\t\t\t\t--page-margin: #040410;\n\t\t\t\t\t--editor-background: #040410;\n\t\t\t\t\t--hover-preview: white;\n\t\t\t\t\t--playhead: rgba(255, 255, 255, 0.9);\n\t\t\t\t\t--primary-text: white;\n\t\t\t\t\t--secondary-text: #84859a;\n\t\t\t\t\t--inverted-text: black;\n\t\t\t\t\t--text-selection: rgba(119,68,255,0.99);\n\t\t\t\t\t--box-selection-fill: #044b94;\n\t\t\t\t\t--loop-accent: #74f;\n\t\t\t\t\t--link-accent: #98f;\n\t\t\t\t\t--ui-widget-background: #393e4f;\n\t\t\t\t\t--ui-widget-focus: #6d6886;\n\t\t\t\t\t--pitch-background: #393e4f;\n\t\t\t\t\t--tonic: #725491;\n\t\t\t\t\t--fifth-note: #54547a;\n\t\t\t\t\t--white-piano-key: #eee;\n\t\t\t\t\t--black-piano-key: #666;\n\t\t\t\t\t--use-color-formula: true;\n\t\t\t\t\t--track-editor-bg-pitch: #393e4f;\n\t\t\t\t\t--track-editor-bg-pitch-dim: #1c1d28;\n\t\t\t\t\t--track-editor-bg-noise: #3d3535;\n\t\t\t\t\t--track-editor-bg-noise-dim: #161313;\n\t\t\t\t\t--track-editor-bg-mod: #283560;\n\t\t\t\t\t--track-editor-bg-mod-dim: #0a101f;\n\t\t\t\t\t--multiplicative-mod-slider: #606c9f;\n\t\t\t\t\t--overwriting-mod-slider: #6850b5;\n\t\t\t\t\t--indicator-primary: #9c64f7;\n\t\t\t\t\t--indicator-secondary: #393e4f;\n\t\t\t\t\t--select2-opt-group: #5d576f;\n\t\t\t\t\t--input-box-outline: #222;\n\t\t\t\t\t--mute-button-normal: #dda85d;\n\t\t\t\t\t--mute-button-mod: #886eae;\n\t\t\t\t\t--mod-label-primary: #282840;\n\t\t\t\t\t--mod-label-secondary-text: rgb(87, 86, 120);\n\t\t\t\t\t--mod-label-primary-text: white;\n\t\t\t\t\t--pitch-secondary-channel-hue: 0;\n\t\t\t\t\t--pitch-secondary-channel-hue-scale: 6.5;\n\t\t\t\t\t--pitch-secondary-channel-sat: 83.3;\n\t\t\t\t\t--pitch-secondary-channel-sat-scale: 0.1;\n\t\t\t\t\t--pitch-secondary-channel-lum: 40;\n\t\t\t\t\t--pitch-secondary-channel-lum-scale: 0.05;\n\t\t\t\t\t--pitch-primary-channel-hue: 0;\n\t\t\t\t\t--pitch-primary-channel-hue-scale: 6.5;\n\t\t\t\t\t--pitch-primary-channel-sat: 100;\n\t\t\t\t\t--pitch-primary-channel-sat-scale: 0.1;\n\t\t\t\t\t--pitch-primary-channel-lum: 67.5;\n\t\t\t\t\t--pitch-primary-channel-lum-scale: 0.05;\n\t\t\t\t\t--pitch-secondary-note-hue: 0;\n\t\t\t\t\t--pitch-secondary-note-hue-scale: 6.5;\n\t\t\t\t\t--pitch-secondary-note-sat: 93.9;\n\t\t\t\t\t--pitch-secondary-note-sat-scale: 0.1;\n\t\t\t\t\t--pitch-secondary-note-lum: 25;\n\t\t\t\t\t--pitch-secondary-note-lum-scale: 0.05;\n\t\t\t\t\t--pitch-primary-note-hue: 0;\n\t\t\t\t\t--pitch-primary-note-hue-scale: 6.5;\n\t\t\t\t\t--pitch-primary-note-sat: 100;\n\t\t\t\t\t--pitch-primary-note-sat-scale: 0.05;\n\t\t\t\t\t--pitch-primary-note-lum: 85.6;\n\t\t\t\t\t--pitch-primary-note-lum-scale: 0.025;\n\t\t\t\t\t--noise-secondary-channel-hue: 0;\n\t\t\t\t\t--noise-secondary-channel-hue-scale: 2;\n\t\t\t\t\t--noise-secondary-channel-sat: 25;\n\t\t\t\t\t--noise-secondary-channel-sat-scale: 0;\n\t\t\t\t\t--noise-secondary-channel-lum: 42;\n\t\t\t\t\t--noise-secondary-channel-lum-scale: 0;\n\t\t\t\t\t--noise-primary-channel-hue: 0;\n\t\t\t\t\t--noise-primary-channel-hue-scale: 2;\n\t\t\t\t\t--noise-primary-channel-sat: 33;\n\t\t\t\t\t--noise-primary-channel-sat-scale: 0;\n\t\t\t\t\t--noise-primary-channel-lum: 63.5;\n\t\t\t\t\t--noise-primary-channel-lum-scale: 0;\n\t\t\t\t\t--noise-secondary-note-hue: 0;\n\t\t\t\t\t--noise-secondary-note-hue-scale: 2;\n\t\t\t\t\t--noise-secondary-note-sat: 33.5;\n\t\t\t\t\t--noise-secondary-note-sat-scale: 0;\n\t\t\t\t\t--noise-secondary-note-lum: 55;\n\t\t\t\t\t--noise-secondary-note-lum-scale: 0;\n\t\t\t\t\t--noise-primary-note-hue: 0;\n\t\t\t\t\t--noise-primary-note-hue-scale: 2;\n\t\t\t\t\t--noise-primary-note-sat: 46.5;\n\t\t\t\t\t--noise-primary-note-sat-scale: 0;\n\t\t\t\t\t--noise-primary-note-lum: 74;\n\t\t\t\t\t--noise-primary-note-lum-scale: 0;\n\t\t\t\t\t--mod-secondary-channel-hue: 192;\n\t\t\t\t\t--mod-secondary-channel-hue-scale: 1.5;\n\t\t\t\t\t--mod-secondary-channel-sat: 88;\n\t\t\t\t\t--mod-secondary-channel-sat-scale: 0;\n\t\t\t\t\t--mod-secondary-channel-lum: 50;\n\t\t\t\t\t--mod-secondary-channel-lum-scale: 0;\n\t\t\t\t\t--mod-primary-channel-hue: 192;\n\t\t\t\t\t--mod-primary-channel-hue-scale: 1.5;\n\t\t\t\t\t--mod-primary-channel-sat: 96;\n\t\t\t\t\t--mod-primary-channel-sat-scale: 0;\n\t\t\t\t\t--mod-primary-channel-lum: 80;\n\t\t\t\t\t--mod-primary-channel-lum-scale: 0;\n\t\t\t\t\t--mod-secondary-note-hue: 192;\n\t\t\t\t\t--mod-secondary-note-hue-scale: 1.5;\n\t\t\t\t\t--mod-secondary-note-sat: 92;\n\t\t\t\t\t--mod-secondary-note-sat-scale: 0;\n\t\t\t\t\t--mod-secondary-note-lum: 45;\n\t\t\t\t\t--mod-secondary-note-lum-scale: 0;\n\t\t\t\t\t--mod-primary-note-hue: 192;\n\t\t\t\t\t--mod-primary-note-hue-scale: 1.5;\n\t\t\t\t\t--mod-primary-note-sat: 96;\n\t\t\t\t\t--mod-primary-note-sat-scale: 0;\n\t\t\t\t\t--mod-primary-note-lum: 85;\n\t\t\t\t\t--mod-primary-note-lum-scale: 0;\n\t\t\t\t\t--disabled-note-primary:    #91879f;\n\t\t\t\t\t--disabled-note-secondary:  #6a677a;\n\t\t\t\t}\n\t\t\t",
      forest:
        "\n\t\t\t\t:root {\n\t\t\t\t\t--page-margin: #010c03;\n\t\t\t\t\t--editor-background: #010c03;\n\t\t\t\t\t--hover-preview: #efe;\n\t\t\t\t\t--playhead: rgba(232, 255, 232, 0.9);\n\t\t\t\t\t--primary-text: #efe;\n\t\t\t\t\t--secondary-text: #70A070;\n\t\t\t\t\t--inverted-text: #280228;\n\t\t\t\t\t--text-selection: rgba(255,68,199,0.99);\n\t\t\t\t\t--box-selection-fill: #267aa3;\n\t\t\t\t\t--loop-accent: #ffe845;\n\t\t\t\t\t--link-accent: #9f8;\n\t\t\t\t\t--ui-widget-background: #203829;\n\t\t\t\t\t--ui-widget-focus: #487860;\n\t\t\t\t\t--pitch-background: #203829;\n\t\t\t\t\t--tonic: #2b8d20;\n\t\t\t\t\t--fifth-note: #385840;\n\t\t\t\t\t--white-piano-key: #bda;\n\t\t\t\t\t--black-piano-key: #573;\n\t\t\t\t\t--use-color-formula: true;\n\t\t\t\t\t--track-editor-bg-pitch: #254820;\n\t\t\t\t\t--track-editor-bg-pitch-dim: #102819;\n\t\t\t\t\t--track-editor-bg-noise: #304050;\n\t\t\t\t\t--track-editor-bg-noise-dim: #102030;\n\t\t\t\t\t--track-editor-bg-mod: #506030;\n\t\t\t\t\t--track-editor-bg-mod-dim: #2a300a;\n\t\t\t\t\t--multiplicative-mod-slider: #205c8f;\n\t\t\t\t\t--overwriting-mod-slider: #20ac6f;\n\t\t\t\t\t--indicator-primary: #dcd866;\n\t\t\t\t\t--indicator-secondary: #203829;\n\t\t\t\t\t--select2-opt-group: #1a6f5a;\n\t\t\t\t\t--input-box-outline: #242;\n\t\t\t\t\t--mute-button-normal: #49e980;\n\t\t\t\t\t--mute-button-mod: #c2e502;\n\t\t\t\t\t--mod-label-primary: #133613;\n\t\t\t\t\t--mod-label-secondary-text: rgb(27, 126, 40);\n\t\t\t\t\t--mod-label-primary-text: #efe;\n\t\t\t\t\t--pitch-secondary-channel-hue: 120;\n\t\t\t\t\t--pitch-secondary-channel-hue-scale: 8.1;\n\t\t\t\t\t--pitch-secondary-channel-sat: 59;\n\t\t\t\t\t--pitch-secondary-channel-sat-scale: 0.1;\n\t\t\t\t\t--pitch-secondary-channel-lum: 50;\n\t\t\t\t\t--pitch-secondary-channel-lum-scale: 0.04;\n\t\t\t\t\t--pitch-primary-channel-hue: 120;\n\t\t\t\t\t--pitch-primary-channel-hue-scale: 8.1;\n\t\t\t\t\t--pitch-primary-channel-sat: 86;\n\t\t\t\t\t--pitch-primary-channel-sat-scale: 0.1;\n\t\t\t\t\t--pitch-primary-channel-lum: 70;\n\t\t\t\t\t--pitch-primary-channel-lum-scale: 0.04;\n\t\t\t\t\t--pitch-secondary-note-hue: 120;\n\t\t\t\t\t--pitch-secondary-note-hue-scale: 8.1;\n\t\t\t\t\t--pitch-secondary-note-sat: 85;\n\t\t\t\t\t--pitch-secondary-note-sat-scale: 0.1;\n\t\t\t\t\t--pitch-secondary-note-lum: 30;\n\t\t\t\t\t--pitch-secondary-note-lum-scale: 0.04;\n\t\t\t\t\t--pitch-primary-note-hue: 120;\n\t\t\t\t\t--pitch-primary-note-hue-scale: 8.1;\n\t\t\t\t\t--pitch-primary-note-sat: 90;\n\t\t\t\t\t--pitch-primary-note-sat-scale: 0.05;\n\t\t\t\t\t--pitch-primary-note-lum: 80;\n\t\t\t\t\t--pitch-primary-note-lum-scale: 0.025;\n\t\t\t\t\t--noise-secondary-channel-hue: 200;\n\t\t\t\t\t--noise-secondary-channel-hue-scale: 1.1;\n\t\t\t\t\t--noise-secondary-channel-sat: 25;\n\t\t\t\t\t--noise-secondary-channel-sat-scale: 0;\n\t\t\t\t\t--noise-secondary-channel-lum: 22;\n\t\t\t\t\t--noise-secondary-channel-lum-scale: 0;\n\t\t\t\t\t--noise-primary-channel-hue: 200;\n\t\t\t\t\t--noise-primary-channel-hue-scale: 1.1;\n\t\t\t\t\t--noise-primary-channel-sat: 48;\n\t\t\t\t\t--noise-primary-channel-sat-scale: 0;\n\t\t\t\t\t--noise-primary-channel-lum: 65;\n\t\t\t\t\t--noise-primary-channel-lum-scale: 0;\n\t\t\t\t\t--noise-secondary-note-hue: 200;\n\t\t\t\t\t--noise-secondary-note-hue-scale: 1.1;\n\t\t\t\t\t--noise-secondary-note-sat: 33.5;\n\t\t\t\t\t--noise-secondary-note-sat-scale: 0;\n\t\t\t\t\t--noise-secondary-note-lum: 33;\n\t\t\t\t\t--noise-secondary-note-lum-scale: 0;\n\t\t\t\t\t--noise-primary-note-hue: 200;\n\t\t\t\t\t--noise-primary-note-hue-scale: 1.1;\n\t\t\t\t\t--noise-primary-note-sat: 46.5;\n\t\t\t\t\t--noise-primary-note-sat-scale: 0;\n\t\t\t\t\t--noise-primary-note-lum: 64;\n\t\t\t\t\t--noise-primary-note-lum-scale: 0;\n\t\t\t\t\t--mod-secondary-channel-hue: 40;\n\t\t\t\t\t--mod-secondary-channel-hue-scale: 1.8;\n\t\t\t\t\t--mod-secondary-channel-sat: 44;\n\t\t\t\t\t--mod-secondary-channel-sat-scale: 0;\n\t\t\t\t\t--mod-secondary-channel-lum: 50;\n\t\t\t\t\t--mod-secondary-channel-lum-scale: 0;\n\t\t\t\t\t--mod-primary-channel-hue: 40;\n\t\t\t\t\t--mod-primary-channel-hue-scale: 1.8;\n\t\t\t\t\t--mod-primary-channel-sat: 60;\n\t\t\t\t\t--mod-primary-channel-sat-scale: 0;\n\t\t\t\t\t--mod-primary-channel-lum: 80;\n\t\t\t\t\t--mod-primary-channel-lum-scale: 0;\n\t\t\t\t\t--mod-secondary-note-hue: 40;\n\t\t\t\t\t--mod-secondary-note-hue-scale: 1.8;\n\t\t\t\t\t--mod-secondary-note-sat: 62;\n\t\t\t\t\t--mod-secondary-note-sat-scale: 0;\n\t\t\t\t\t--mod-secondary-note-lum: 55;\n\t\t\t\t\t--mod-secondary-note-lum-scale: 0;\n\t\t\t\t\t--mod-primary-note-hue: 40;\n\t\t\t\t\t--mod-primary-note-hue-scale: 1.8;\n\t\t\t\t\t--mod-primary-note-sat: 66;\n\t\t\t\t\t--mod-primary-note-sat-scale: 0;\n\t\t\t\t\t--mod-primary-note-lum: 85;\n\t\t\t\t\t--mod-primary-note-lum-scale: 0;\n\t\t\t\t\t--disabled-note-primary:    #536e5c;\n\t\t\t\t\t--disabled-note-secondary:  #395440;\n\t\t\t\t}\n\t\t\t",
      canyon:
        "\n\t\t\t\t:root {\n\t\t\t\t\t--page-margin: #0a0000;\n\t\t\t\t\t--editor-background: #0a0000;\n\t\t\t\t\t--hover-preview: white;\n\t\t\t\t\t--playhead: rgba(247, 172, 196, 0.9);\n\t\t\t\t\t--primary-text: #f5d6bf;\n\t\t\t\t\t--secondary-text: #934050;\n\t\t\t\t\t--inverted-text: #290505;\n\t\t\t\t\t--text-selection: rgba(255, 208, 68, 0.99);\n\t\t\t\t\t--box-selection-fill: #94044870;\n\t\t\t\t\t--loop-accent: #ff1e1e;\n\t\t\t\t\t--link-accent: #da7b76;\n\t\t\t\t\t--ui-widget-background: #533137;\n\t\t\t\t\t--ui-widget-focus: #743e4b;\n\t\t\t\t\t--pitch-background: #4f3939;\n\t\t\t\t\t--tonic: #9e4145;\n\t\t\t\t\t--fifth-note: #5b3e6b;\n\t\t\t\t\t--white-piano-key: #d89898;\n\t\t\t\t\t--black-piano-key: #572b29;\n\t\t\t\t\t--use-color-formula: true;\n\t\t\t\t\t--track-editor-bg-pitch: #5e3a41;\n\t\t\t\t\t--track-editor-bg-pitch-dim: #281d1c;\n\t\t\t\t\t--track-editor-bg-noise: #3a3551;\n\t\t\t\t\t--track-editor-bg-noise-dim: #272732;\n\t\t\t\t\t--track-editor-bg-mod: #552045;\n\t\t\t\t\t--track-editor-bg-mod-dim: #3e1442;\n\t\t\t\t\t--multiplicative-mod-slider: #9f6095;\n\t\t\t\t\t--overwriting-mod-slider: #b55050;\n\t\t\t\t\t--indicator-primary: #f2f764;\n\t\t\t\t\t--indicator-secondary: #4f3939;\n\t\t\t\t\t--select2-opt-group: #673030;\n\t\t\t\t\t--input-box-outline: #443131;\n\t\t\t\t\t--mute-button-normal: #d81833;\n\t\t\t\t\t--mute-button-mod: #9e2691;\n\t\t\t\t\t--mod-label-primary: #5f2b39;\n\t\t\t\t\t--mod-label-secondary-text: rgb(158, 66, 122);\n\t\t\t\t\t--mod-label-primary-text: #e6caed;\n\t\t\t\t\t--pitch-secondary-channel-hue: 0;\n\t\t\t\t\t--pitch-secondary-channel-hue-scale: 11.8;\n\t\t\t\t\t--pitch-secondary-channel-sat: 73.3;\n\t\t\t\t\t--pitch-secondary-channel-sat-scale: 0.1;\n\t\t\t\t\t--pitch-secondary-channel-lum: 40;\n\t\t\t\t\t--pitch-secondary-channel-lum-scale: 0.05;\n\t\t\t\t\t--pitch-primary-channel-hue: 0;\n\t\t\t\t\t--pitch-primary-channel-hue-scale: 11.8;\n\t\t\t\t\t--pitch-primary-channel-sat: 90;\n\t\t\t\t\t--pitch-primary-channel-sat-scale: 0.1;\n\t\t\t\t\t--pitch-primary-channel-lum: 67.5;\n\t\t\t\t\t--pitch-primary-channel-lum-scale: 0.05;\n\t\t\t\t\t--pitch-secondary-note-hue: 0;\n\t\t\t\t\t--pitch-secondary-note-hue-scale: 11.8;\n\t\t\t\t\t--pitch-secondary-note-sat: 83.9;\n\t\t\t\t\t--pitch-secondary-note-sat-scale: 0.1;\n\t\t\t\t\t--pitch-secondary-note-lum: 35;\n\t\t\t\t\t--pitch-secondary-note-lum-scale: 0.05;\n\t\t\t\t\t--pitch-primary-note-hue: 0;\n\t\t\t\t\t--pitch-primary-note-hue-scale: 11.8;\n\t\t\t\t\t--pitch-primary-note-sat: 100;\n\t\t\t\t\t--pitch-primary-note-sat-scale: 0.05;\n\t\t\t\t\t--pitch-primary-note-lum: 85.6;\n\t\t\t\t\t--pitch-primary-note-lum-scale: 0.025;\n\t\t\t\t\t--noise-secondary-channel-hue: 60;\n\t\t\t\t\t--noise-secondary-channel-hue-scale: 2;\n\t\t\t\t\t--noise-secondary-channel-sat: 25;\n\t\t\t\t\t--noise-secondary-channel-sat-scale: 0;\n\t\t\t\t\t--noise-secondary-channel-lum: 42;\n\t\t\t\t\t--noise-secondary-channel-lum-scale: 0;\n\t\t\t\t\t--noise-primary-channel-hue: 60;\n\t\t\t\t\t--noise-primary-channel-hue-scale: 2;\n\t\t\t\t\t--noise-primary-channel-sat: 33;\n\t\t\t\t\t--noise-primary-channel-sat-scale: 0;\n\t\t\t\t\t--noise-primary-channel-lum: 63.5;\n\t\t\t\t\t--noise-primary-channel-lum-scale: 0;\n\t\t\t\t\t--noise-secondary-note-hue: 60;\n\t\t\t\t\t--noise-secondary-note-hue-scale: 2;\n\t\t\t\t\t--noise-secondary-note-sat: 33.5;\n\t\t\t\t\t--noise-secondary-note-sat-scale: 0;\n\t\t\t\t\t--noise-secondary-note-lum: 55;\n\t\t\t\t\t--noise-secondary-note-lum-scale: 0;\n\t\t\t\t\t--noise-primary-note-hue: 60;\n\t\t\t\t\t--noise-primary-note-hue-scale: 2;\n\t\t\t\t\t--noise-primary-note-sat: 46.5;\n\t\t\t\t\t--noise-primary-note-sat-scale: 0;\n\t\t\t\t\t--noise-primary-note-lum: 74;\n\t\t\t\t\t--noise-primary-note-lum-scale: 0;\n\t\t\t\t\t--mod-secondary-channel-hue: 222;\n\t\t\t\t\t--mod-secondary-channel-hue-scale: 1.5;\n\t\t\t\t\t--mod-secondary-channel-sat: 88;\n\t\t\t\t\t--mod-secondary-channel-sat-scale: 0;\n\t\t\t\t\t--mod-secondary-channel-lum: 50;\n\t\t\t\t\t--mod-secondary-channel-lum-scale: 0;\n\t\t\t\t\t--mod-primary-channel-hue: 222;\n\t\t\t\t\t--mod-primary-channel-hue-scale: 1.5;\n\t\t\t\t\t--mod-primary-channel-sat: 96;\n\t\t\t\t\t--mod-primary-channel-sat-scale: 0;\n\t\t\t\t\t--mod-primary-channel-lum: 80;\n\t\t\t\t\t--mod-primary-channel-lum-scale: 0;\n\t\t\t\t\t--mod-secondary-note-hue: 222;\n\t\t\t\t\t--mod-secondary-note-hue-scale: 1.5;\n\t\t\t\t\t--mod-secondary-note-sat: 92;\n\t\t\t\t\t--mod-secondary-note-sat-scale: 0;\n\t\t\t\t\t--mod-secondary-note-lum: 54;\n\t\t\t\t\t--mod-secondary-note-lum-scale: 0;\n\t\t\t\t\t--mod-primary-note-hue: 222;\n\t\t\t\t\t--mod-primary-note-hue-scale: 1.5;\n\t\t\t\t\t--mod-primary-note-sat: 96;\n\t\t\t\t\t--mod-primary-note-sat-scale: 0;\n\t\t\t\t\t--mod-primary-note-lum: 75;\n\t\t\t\t\t--mod-primary-note-lum-scale: 0;\n\t\t\t\t\t--disabled-note-primary:    #515164;\n\t\t\t\t\t--disabled-note-secondary:  #2a2a3a;\n\t\t\t\t}\n\t\t\t",
      midnight:
        "\n\t\t:root {\n\t\t\t--page-margin: #000;\n\t\t\t--editor-background: #000;\n\t\t\t--hover-preview: #757575;\n\t\t\t--playhead: #fff;\n\t\t\t--primary-text: #fff;\n\t\t\t--secondary-text: #acacac;\n\t\t\t--inverted-text: #290505;\n\t\t\t--text-selection: rgba(155, 155, 155, 0.99);\n\t\t\t--box-selection-fill: #79797970;\n\t\t\t--loop-accent: #646464;\n\t\t\t--link-accent: #707070;\n\t\t\t--ui-widget-background: #353535;\n\t\t\t--ui-widget-focus: #464646;\n\t\t\t--pitch-background: #222121;\n\t\t\t--tonic: #555955;\n\t\t\t--fifth-note: #1a1818;\n\t\t\t--white-piano-key: #a89e9e;\n\t\t\t--black-piano-key: #2d2424;\n\t\t\t--use-color-formula: true;\n\t\t\t--track-editor-bg-pitch: #373737;\n\t\t\t--track-editor-bg-pitch-dim: #131313;\n\t\t\t--track-editor-bg-noise: #484848;\n\t\t\t--track-editor-bg-noise-dim: #131313;\n\t\t\t--track-editor-bg-mod: #373737;\n\t\t\t--track-editor-bg-mod-dim: #131313;\n\t\t\t--multiplicative-mod-slider: #555;\n\t\t\t--overwriting-mod-slider: #464545;\n\t\t\t--indicator-primary: #e0e0e0;\n\t\t\t--indicator-secondary: #404040;\n\t\t\t--select2-opt-group: #3c3b3b;\n\t\t\t--input-box-outline: #757575;\n\t\t\t--mute-button-normal: #8e8d8d;\n\t\t\t--mute-button-mod: #ddd;\n\t\t\t--mod-label-primary: #262526;\n\t\t\t--mod-label-secondary-text: rgb(227, 222, 225);\n\t\t\t--mod-label-primary-text: #b9b9b9;\n\t\t\t--pitch-secondary-channel-hue: 240;\n\t\t\t--pitch-secondary-channel-hue-scale: 228;\n\t\t\t--pitch-secondary-channel-sat: 73.3;\n\t\t\t--pitch-secondary-channel-sat-scale: 0.1;\n\t\t\t--pitch-secondary-channel-lum: 25;\n\t\t\t--pitch-secondary-channel-lum-scale: 0.05;\n\t\t\t--pitch-primary-channel-hue: 240;\n\t\t\t--pitch-primary-channel-hue-scale: 228;\n\t\t\t--pitch-primary-channel-sat: 80;\n\t\t\t--pitch-primary-channel-sat-scale: 0.1;\n\t\t\t--pitch-primary-channel-lum: 60.5;\n\t\t\t--pitch-primary-channel-lum-scale: 0.05;\n\t\t\t--pitch-secondary-note-hue: 240;\n\t\t\t--pitch-secondary-note-hue-scale: 228;\n\t\t\t--pitch-secondary-note-sat: 73.9;\n\t\t\t--pitch-secondary-note-sat-scale: 0.1;\n\t\t\t--pitch-secondary-note-lum: 32;\n\t\t\t--pitch-secondary-note-lum-scale: 0.05;\n\t\t\t--pitch-primary-note-hue: 240;\n\t\t\t--pitch-primary-note-hue-scale: 228;\n\t\t\t--pitch-primary-note-sat: 90;\n\t\t\t--pitch-primary-note-sat-scale: 0.05;\n\t\t\t--pitch-primary-note-lum: 80.6;\n\t\t\t--pitch-primary-note-lum-scale: 0.025;\n\t\t\t--noise-secondary-channel-hue: 160;\n\t\t\t--noise-secondary-channel-hue-scale: 2;\n\t\t\t--noise-secondary-channel-sat: 25;\n\t\t\t--noise-secondary-channel-sat-scale: 0;\n\t\t\t--noise-secondary-channel-lum: 42;\n\t\t\t--noise-secondary-channel-lum-scale: 0;\n\t\t\t--noise-primary-channel-hue: 160;\n\t\t\t--noise-primary-channel-hue-scale: 2;\n\t\t\t--noise-primary-channel-sat: 33;\n\t\t\t--noise-primary-channel-sat-scale: 0;\n\t\t\t--noise-primary-channel-lum: 63.5;\n\t\t\t--noise-primary-channel-lum-scale: 0;\n\t\t\t--noise-secondary-note-hue: 160;\n\t\t\t--noise-secondary-note-hue-scale: 2;\n\t\t\t--noise-secondary-note-sat: 33.5;\n\t\t\t--noise-secondary-note-sat-scale: 0;\n\t\t\t--noise-secondary-note-lum: 55;\n\t\t\t--noise-secondary-note-lum-scale: 0;\n\t\t\t--noise-primary-note-hue: 160;\n\t\t\t--noise-primary-note-hue-scale: 2;\n\t\t\t--noise-primary-note-sat: 46.5;\n\t\t\t--noise-primary-note-sat-scale: 0;\n\t\t\t--noise-primary-note-lum: 74;\n\t\t\t--noise-primary-note-lum-scale: 0;\n\t\t\t--mod-secondary-channel-hue: 62;\n\t\t\t--mod-secondary-channel-hue-scale: 1.5;\n\t\t\t--mod-secondary-channel-sat: 88;\n\t\t\t--mod-secondary-channel-sat-scale: 0;\n\t\t\t--mod-secondary-channel-lum: 30;\n\t\t\t--mod-secondary-channel-lum-scale: 0;\n\t\t\t--mod-primary-channel-hue: 62;\n\t\t\t--mod-primary-channel-hue-scale: 1.5;\n\t\t\t--mod-primary-channel-sat: 96;\n\t\t\t--mod-primary-channel-sat-scale: 0;\n\t\t\t--mod-primary-channel-lum: 80;\n\t\t\t--mod-primary-channel-lum-scale: 0;\n\t\t\t--mod-secondary-note-hue: 62;\n\t\t\t--mod-secondary-note-hue-scale: 1.5;\n\t\t\t--mod-secondary-note-sat: 92;\n\t\t\t--mod-secondary-note-sat-scale: 0;\n\t\t\t--mod-secondary-note-lum: 34;\n\t\t\t--mod-secondary-note-lum-scale: 0;\n\t\t\t--mod-primary-note-hue: 62;\n\t\t\t--mod-primary-note-hue-scale: 1.5;\n\t\t\t--mod-primary-note-sat: 96;\n\t\t\t--mod-primary-note-sat-scale: 0;\n\t\t\t--mod-primary-note-lum: 75;\n\t\t\t--mod-primary-note-lum-scale: 0;\n\t\t\t--disabled-note-primary:    #66a;\n\t\t\t--disabled-note-secondary:  #447;\n\t\t}\n\t",
      "jummbox light":
        "\n\t\t\t\t:root {\n\t\t\t\t\t-webkit-text-stroke-width: 0.5px;\n\t\t\t\t\t--page-margin: #fefdff;\n\t\t\t\t\t--editor-background: #fefdff;\n\t\t\t\t\t--hover-preview: #302880;\n\t\t\t\t\t--playhead: rgba(62, 32, 120, 0.9);\n\t\t\t\t\t--primary-text: #401890;\n\t\t\t\t\t--secondary-text: #8769af;\n\t\t\t\t\t--inverted-text: #fefdff;\n\t\t\t\t\t--text-selection: rgba(255,160,235,0.99);\n\t\t\t\t\t--box-selection-fill: rgba(30,62,220,0.5);\n\t\t\t\t\t--loop-accent: #4c35d4;\n\t\t\t\t\t--link-accent: #7af;\n\t\t\t\t\t--ui-widget-background: #bf9cec;\n\t\t\t\t\t--ui-widget-focus: #e9c4ff;\n\t\t\t\t\t--pitch-background: #e2d9f9;\n\t\t\t\t\t--tonic: #c288cc;\n\t\t\t\t\t--fifth-note: #d8c9fd;\n\t\t\t\t\t--white-piano-key: #e2e2ff;\n\t\t\t\t\t--black-piano-key: #66667a;\n\t\t\t\t\t--use-color-formula: true;\n\t\t\t\t\t--track-editor-bg-pitch: #d9e5ec;\n\t\t\t\t\t--track-editor-bg-pitch-dim: #eaeef5;\n\t\t\t\t\t--track-editor-bg-noise: #ffc3ae;\n\t\t\t\t\t--track-editor-bg-noise-dim: #ffe0cf;\n\t\t\t\t\t--track-editor-bg-mod: #c9accc;\n\t\t\t\t\t--track-editor-bg-mod-dim: #ebe3ef;\n\t\t\t\t\t--multiplicative-mod-slider: #807caf;\n\t\t\t\t\t--overwriting-mod-slider: #909cdf;\n\t\t\t\t\t--indicator-primary: #ae38ff;\n\t\t\t\t\t--indicator-secondary: #bbd4ec;\n\t\t\t\t\t--select2-opt-group: #c1b7f1;\n\t\t\t\t\t--input-box-outline: #bbb;\n\t\t\t\t\t--mute-button-normal: #e9b752;\n\t\t\t\t\t--mute-button-mod: #9558ee;\n\t\t\t\t\t--mod-label-primary: #ececff;\n\t\t\t\t\t--mod-label-secondary-text: rgb(197, 145, 247);\n\t\t\t\t\t--mod-label-primary-text: #302880;\n\t\t\t\t\t--pitch-secondary-channel-hue: 0;\n\t\t\t\t\t--pitch-secondary-channel-hue-scale: 8.1;\n\t\t\t\t\t--pitch-secondary-channel-sat: 53.3;\n\t\t\t\t\t--pitch-secondary-channel-sat-scale: -0.1;\n\t\t\t\t\t--pitch-secondary-channel-lum: 72;\n\t\t\t\t\t--pitch-secondary-channel-lum-scale: -0.05;\n\t\t\t\t\t--pitch-primary-channel-hue: 0;\n\t\t\t\t\t--pitch-primary-channel-hue-scale: 8.1;\n\t\t\t\t\t--pitch-primary-channel-sat: 97;\n\t\t\t\t\t--pitch-primary-channel-sat-scale: -0.1;\n\t\t\t\t\t--pitch-primary-channel-lum: 45.5;\n\t\t\t\t\t--pitch-primary-channel-lum-scale: -0.05;\n\t\t\t\t\t--pitch-secondary-note-hue: 0;\n\t\t\t\t\t--pitch-secondary-note-hue-scale: 8.1;\n\t\t\t\t\t--pitch-secondary-note-sat: 93.9;\n\t\t\t\t\t--pitch-secondary-note-sat-scale: -0.1;\n\t\t\t\t\t--pitch-secondary-note-lum: 95;\n\t\t\t\t\t--pitch-secondary-note-lum-scale: -0.05;\n\t\t\t\t\t--pitch-primary-note-hue: 0;\n\t\t\t\t\t--pitch-primary-note-hue-scale: 8.1;\n\t\t\t\t\t--pitch-primary-note-sat: 100;\n\t\t\t\t\t--pitch-primary-note-sat-scale: 0.05;\n\t\t\t\t\t--pitch-primary-note-lum: 43.6;\n\t\t\t\t\t--pitch-primary-note-lum-scale: -0.025;\n\t\t\t\t\t--noise-secondary-channel-hue: 220;\n\t\t\t\t\t--noise-secondary-channel-hue-scale: 2;\n\t\t\t\t\t--noise-secondary-channel-sat: 25;\n\t\t\t\t\t--noise-secondary-channel-sat-scale: 0;\n\t\t\t\t\t--noise-secondary-channel-lum: 62;\n\t\t\t\t\t--noise-secondary-channel-lum-scale: -0.1;\n\t\t\t\t\t--noise-primary-channel-hue: 220;\n\t\t\t\t\t--noise-primary-channel-hue-scale: 2;\n\t\t\t\t\t--noise-primary-channel-sat: 53;\n\t\t\t\t\t--noise-primary-channel-sat-scale: 0;\n\t\t\t\t\t--noise-primary-channel-lum: 53.5;\n\t\t\t\t\t--noise-primary-channel-lum-scale: -0.1;\n\t\t\t\t\t--noise-secondary-note-hue: 220;\n\t\t\t\t\t--noise-secondary-note-hue-scale: 2;\n\t\t\t\t\t--noise-secondary-note-sat: 58.5;\n\t\t\t\t\t--noise-secondary-note-sat-scale: 0;\n\t\t\t\t\t--noise-secondary-note-lum: 85;\n\t\t\t\t\t--noise-secondary-note-lum-scale: -1;\n\t\t\t\t\t--noise-primary-note-hue: 220;\n\t\t\t\t\t--noise-primary-note-hue-scale: 2;\n\t\t\t\t\t--noise-primary-note-sat: 56.5;\n\t\t\t\t\t--noise-primary-note-sat-scale: 0;\n\t\t\t\t\t--noise-primary-note-lum: 54;\n\t\t\t\t\t--noise-primary-note-lum-scale: -1;\n\t\t\t\t\t--mod-secondary-channel-hue: 90;\n\t\t\t\t\t--mod-secondary-channel-hue-scale: 1.5;\n\t\t\t\t\t--mod-secondary-channel-sat: 88;\n\t\t\t\t\t--mod-secondary-channel-sat-scale: 0;\n\t\t\t\t\t--mod-secondary-channel-lum: 60;\n\t\t\t\t\t--mod-secondary-channel-lum-scale: 0;\n\t\t\t\t\t--mod-primary-channel-hue: 90;\n\t\t\t\t\t--mod-primary-channel-hue-scale: 1.5;\n\t\t\t\t\t--mod-primary-channel-sat: 100;\n\t\t\t\t\t--mod-primary-channel-sat-scale: 0;\n\t\t\t\t\t--mod-primary-channel-lum: 65;\n\t\t\t\t\t--mod-primary-channel-lum-scale: 0;\n\t\t\t\t\t--mod-secondary-note-hue: 90;\n\t\t\t\t\t--mod-secondary-note-hue-scale: 1.5;\n\t\t\t\t\t--mod-secondary-note-sat: 92;\n\t\t\t\t\t--mod-secondary-note-sat-scale: 0;\n\t\t\t\t\t--mod-secondary-note-lum: 95;\n\t\t\t\t\t--mod-secondary-note-lum-scale: 0;\n\t\t\t\t\t--mod-primary-note-hue: 90;\n\t\t\t\t\t--mod-primary-note-hue-scale: 1.5;\n\t\t\t\t\t--mod-primary-note-sat: 96;\n\t\t\t\t\t--mod-primary-note-sat-scale: 0;\n\t\t\t\t\t--mod-primary-note-lum: 55;\n\t\t\t\t\t--mod-primary-note-lum-scale: 0;\n\t\t\t\t\t--disabled-note-primary:    #868;\n\t\t\t\t\t--disabled-note-secondary:  #767;\n\t\t\t\t}\n\n\t\t\t\t.beepboxEditor button, .beepboxEditor select {\n\t\t\t\t\tbox-shadow: inset 0 0 0 1px var(--secondary-text);\n\t\t\t\t}\n\n\t\t\t\t.select2-selection__rendered {\n\t\t\t\t\tbox-shadow: inset 0 0 0 1px var(--secondary-text);\n\t\t\t\t}\n\t\t\t",
      beachcombing:
        "\n\t\t\t:root {\n\t\t\t--page-margin: #010121;\n\t\t\t--editor-background: #020222;\n\t\t\t--hover-preview: #f3ffff;\n\t\t\t--playhead: #fff;\n\t\t\t--primary-text: #c1f1ff;\n\t\t\t--secondary-text: #546775;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgba(119,68,255,0.99);\n\t\t\t--box-selection-fill: #3e0028;\n\t\t\t--loop-accent: #5a00ff;\n\t\t\t--link-accent: #ff00c8fc;\n\t\t\t--ui-widget-background: #1f2b52;\n\t\t\t--ui-widget-focus: #384e91;\n\t\t\t--pitch-background: #2c3155;\n\t\t\t--tonic: #a32f6e;\n\t\t\t--fifth-note: #0044a0;\n\t\t\t--white-piano-key: #fff;\n\t\t\t--black-piano-key: #202d42;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #34406c;\n\t\t\t--track-editor-bg-pitch-dim: #1c1d28;\n\t\t\t--track-editor-bg-noise: #562e3b;\n\t\t\t--track-editor-bg-noise-dim: #161313;\n\t\t\t--track-editor-bg-mod: #372e66;\n\t\t\t--track-editor-bg-mod-dim: #2a1640;\n\t\t\t--multiplicative-mod-slider: #606c9f;\n\t\t\t--overwriting-mod-slider: #6850b5;\n\t\t\t--indicator-primary: #ff67c2;\n\t\t\t--indicator-secondary: #393e4f;\n\t\t\t--select2-opt-group: #5d576f;\n\t\t\t--input-box-outline: #222;\n\t\t\t--mute-button-normal: #7ce1ff;\n\t\t\t--mute-button-mod: #db519d;\n\t\t\t--pitch1-secondary-channel: #329b70;\n\t\t\t--pitch1-primary-channel: #53ffb8;\n\t\t\t--pitch1-secondary-note: #4cb98c;\n\t\t\t--pitch1-primary-note: #98ffd4;\n\t\t\t--pitch2-secondary-channel: #8e8632;\n\t\t\t--pitch2-primary-channel: #fff36a;\n\t\t\t--pitch2-secondary-note: #afaf22;\n\t\t\t--pitch2-primary-note: #f9f93f;\n\t\t\t--pitch3-secondary-channel: #018e8e;\n\t\t\t--pitch3-primary-channel: #00ffff;\n\t\t\t--pitch3-secondary-note: #24b7b7;\n\t\t\t--pitch3-primary-note: #a7ffff;\n\t\t\t--pitch4-secondary-channel: #6c003d;\n\t\t\t--pitch4-primary-channel: #ff0090;\n\t\t\t--pitch4-secondary-note: #a73c78;\n\t\t\t--pitch4-primary-note: #ff98d2;\n\t\t\t--pitch5-secondary-channel: #0e8153;\n\t\t\t--pitch5-primary-channel: #59ffbd;\n\t\t\t--pitch5-secondary-note: #489979;\n\t\t\t--pitch5-primary-note: #b0ffe0;\n\t\t\t--pitch6-secondary-channel: #185aab;\n\t\t\t--pitch6-primary-channel: #4e7ce5;\n\t\t\t--pitch6-secondary-note: #3e99d9;\n\t\t\t--pitch6-primary-note: #b3e3ff;\n\t\t\t--pitch7-secondary-channel: #4f007d;\n\t\t\t--pitch7-primary-channel: #a200ff;\n\t\t\t--pitch7-secondary-note: #9741c9;\n\t\t\t--pitch7-primary-note: #d386ff;\n\t\t\t--pitch8-secondary-channel: #101c8d;\n\t\t\t--pitch8-primary-channel: #1c5df1;\n\t\t\t--pitch8-secondary-note: #FF4E63;\n\t\t\t--pitch8-primary-note: #FFB2BB;\n\t\t\t--pitch9-secondary-channel: #00A170;\n\t\t\t--pitch9-primary-channel: #50FFC9;\n\t\t\t--pitch9-secondary-note: #00C78A;\n\t\t\t--pitch9-primary-note: #83FFD9;\n\t\t\t--pitch10-secondary-channel: #A11FFF;\n\t\t\t--pitch10-primary-channel: #CE8BFF;\n\t\t\t--pitch10-secondary-note: #B757FF;\n\t\t\t--pitch10-primary-note: #DFACFF;\n\t\t\t--noise1-secondary-channel: #635070;\n\t\t\t--noise1-primary-channel: #9071db;\n\t\t\t--noise1-secondary-note: #915dc1;\n\t\t\t--noise1-primary-note: #c5a5ff;\n\t\t\t--noise2-secondary-channel: #993367;\n\t\t\t--noise2-primary-channel: #dd777c;\n\t\t\t--noise2-secondary-note: #cc6695;\n\t\t\t--noise2-primary-note: #f0bbd1;\n\t\t\t--noise3-secondary-channel: #4a8c8f;\n\t\t\t--noise3-primary-channel: #77c5dd;\n\t\t\t--noise3-secondary-note: #6fb4cf;\n\t\t\t--noise3-primary-note: #bbf2ff;\n\t\t\t--noise4-secondary-channel: #8e3e7d;\n\t\t\t--noise4-primary-channel: #c682d2;\n\t\t\t--noise4-secondary-note: #b871c1;\n\t\t\t--noise4-primary-note: #ffb8f0;\n\t\t\t--noise5-secondary-channel: #785e37;\n\t\t\t--noise5-primary-channel: #bb9d77;\n\t\t\t--noise5-secondary-note: #aa8c66;\n\t\t\t--noise5-primary-note: #e2d1b2;\n\t\t\t--mod1-secondary-channel: #4e8397;\n\t\t\t--mod1-primary-channel: #92e6f3;\n\t\t\t--mod1-secondary-note: #76b9d9;\n\t\t\t--mod1-primary-note: #cde3ff;\n\t\t\t--mod2-secondary-channel: #ad5774;\n\t\t\t--mod2-primary-channel: #eba4ae;\n\t\t\t--mod2-secondary-note: #c9719b;\n\t\t\t--mod2-primary-note: #fdcee7;\n\t\t\t--mod3-secondary-channel: #6f579f;\n\t\t\t--mod3-primary-channel: #b192f7;\n\t\t\t--mod3-secondary-note: #a778e1;\n\t\t\t--mod3-primary-note: #f8ddff;\n\t\t\t--mod4-secondary-channel: #a88a36;\n\t\t\t--mod4-primary-channel: #bec825;\n\t\t\t--mod4-secondary-note: #aecb57;\n\t\t\t--mod4-primary-note: #dee9bd;\n\t\t\t--mod-label-primary: #2c2c56;\n\t\t\t--mod-label-secondary-text: rgb(71,69,147);\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--disabled-note-primary: #91879f;\n\t\t\t--disabled-note-secondary: #6a677a;\n\n\n\t\t\t}\n\t\t",
      roe: "\n\t\t\t:root {\n\t\t\t--page-margin: #050000;\n\t\t\t--editor-background: #050000;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: #b8cee0;\n\t\t\t--secondary-text: #cb3434;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgb(255 68 68 / 99%);\n\t\t\t--box-selection-fill: rgb(255 0 0 / 30%);\n\t\t\t--loop-accent: #7744FF;\n\t\t\t--link-accent: #FF2A2A;\n\t\t\t--ui-widget-background: #1a2642;\n\t\t\t--ui-widget-focus: #2c3f6d;\n\t\t\t--pitch-background: #15111a;\n\t\t\t--tonic: #1b3041;\n\t\t\t--fifth-note: #381818;\n\t\t\t--white-piano-key: #cdcdcd;\n\t\t\t--black-piano-key: #232323;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #302938;\n\t\t\t--track-editor-bg-pitch-dim: #211c26;\n\t\t\t--track-editor-bg-noise: #261f42;\n\t\t\t--track-editor-bg-noise-dim: #1a152d;\n\t\t\t--track-editor-bg-mod: #183049;\n\t\t\t--track-editor-bg-mod-dim: #102132;\n\t\t\t--multiplicative-mod-slider: #344a7f;\n\t\t\t--overwriting-mod-slider: #344a7f;\n\t\t\t--indicator-primary: #FF2A2A;\n\t\t\t--indicator-secondary: #800000;\n\t\t\t--select2-opt-group: #141e34;\n\t\t\t--input-box-outline: #141e34;\n\t\t\t--mute-button-normal: #299eff;\n\t\t\t--mute-button-mod: #165a93;\n\t\t\t--pitch1-secondary-channel: #273c90;\n\t\t\t--pitch1-primary-channel: #476BFF;\n\t\t\t--pitch1-secondary-note: #273c90;\n\t\t\t--pitch1-primary-note: #476BFF;\n\t\t\t--pitch2-secondary-channel: #3a3898;\n\t\t\t--pitch2-primary-channel: #625FFB;\n\t\t\t--pitch2-secondary-note: #3a3898;\n\t\t\t--pitch2-primary-note: #625FFB;\n\t\t\t--pitch3-secondary-channel: #542780;\n\t\t\t--pitch3-primary-channel: #9C49EC;\n\t\t\t--pitch3-secondary-note: #542780;\n\t\t\t--pitch3-primary-note: #9C49EC;\n\t\t\t--pitch4-secondary-channel: #84225d;\n\t\t\t--pitch4-primary-channel: #fd3fb1;\n\t\t\t--pitch4-secondary-note: #84225d;\n\t\t\t--pitch4-primary-note: #fd3fb1;\n\t\t\t--pitch5-secondary-channel: #8d2323;\n\t\t\t--pitch5-primary-channel: #ff3f3f;\n\t\t\t--pitch5-secondary-note: #8d2323;\n\t\t\t--pitch5-primary-note: #ff3f3f;\n\t\t\t--pitch6-secondary-channel: #84225d;\n\t\t\t--pitch6-primary-channel: #fd3fb1;\n\t\t\t--pitch6-secondary-note: #84225d;\n\t\t\t--pitch6-primary-note: #fd3fb1;\n\t\t\t--pitch7-secondary-channel: #542780;\n\t\t\t--pitch7-primary-channel: #9C49EC;\n\t\t\t--pitch7-secondary-note: #542780;\n\t\t\t--pitch7-primary-note: #9C49EC;\n\t\t\t--pitch8-secondary-channel: #3a3898;\n\t\t\t--pitch8-primary-channel: #625FFB;\n\t\t\t--pitch8-secondary-note: #3a3898;\n\t\t\t--pitch8-primary-note: #625FFB;\n\t\t\t--pitch9-secondary-channel: #273c90;\n\t\t\t--pitch9-primary-channel: #476BFF;\n\t\t\t--pitch9-secondary-note: #273c90;\n\t\t\t--pitch9-primary-note: #476BFF;\n\t\t\t--pitch10-secondary-channel: #165a93;\n\t\t\t--pitch10-primary-channel: #299EFF;\n\t\t\t--pitch10-secondary-note: #165a93;\n\t\t\t--pitch10-primary-note: #299EFF;\n\t\t\t--noise1-secondary-channel: #4281FF;\n\t\t\t--noise1-primary-channel: #96b9ff;\n\t\t\t--noise1-secondary-note: #4281FF;\n\t\t\t--noise1-primary-note: #96b9ff;\n\t\t\t--noise2-secondary-channel: #7347FF;\n\t\t\t--noise2-primary-channel: #c3b0ff;\n\t\t\t--noise2-secondary-note: #7347FF;\n\t\t\t--noise2-primary-note: #c3b0ff;\n\t\t\t--noise3-secondary-channel: #9F3CBF;\n\t\t\t--noise3-primary-channel: #e29cf9;\n\t\t\t--noise3-secondary-note: #9F3CBF;\n\t\t\t--noise3-primary-note: #e29cf9;\n\t\t\t--noise4-secondary-channel: #D3326F;\n\t\t\t--noise4-primary-channel: #fb9bbf;\n\t\t\t--noise4-secondary-note: #D3326F;\n\t\t\t--noise4-primary-note: #fb9bbf;\n\t\t\t--noise5-secondary-channel: #FF2A2A;\n\t\t\t--noise5-primary-channel: #ffa2a2;\n\t\t\t--noise5-secondary-note: #FF2A2A;\n\t\t\t--noise5-primary-note: #ffa2a2;\n\t\t\t--mod1-secondary-channel: #47587a;\n\t\t\t--mod1-primary-channel: #96b9ff;\n\t\t\t--mod1-secondary-note: #47587a;\n\t\t\t--mod1-primary-note: #96b9ff;\n\t\t\t--mod2-secondary-channel: #716791;\n\t\t\t--mod2-primary-channel: #c3b0ff;\n\t\t\t--mod2-secondary-note: #716791;\n\t\t\t--mod2-primary-note: #c3b0ff;\n\t\t\t--mod3-secondary-channel: #6f4c7b;\n\t\t\t--mod3-primary-channel: #e29cf9;\n\t\t\t--mod3-secondary-note: #6f4c7b;\n\t\t\t--mod3-primary-note: #e29cf9;\n\t\t\t--mod4-secondary-channel: #9e6279;\n\t\t\t--mod4-primary-channel: #fb9bbf;\n\t\t\t--mod4-secondary-note: #9e6279;\n\t\t\t--mod4-primary-note: #fb9bbf;\n\t\t\t--mod-label-primary: #15111a;\n\t\t\t--mod-label-secondary-text: #cb3434;\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--disabled-note-primary: #c9c9c9;\n\t\t\t--disabled-note-secondary: #616161;\n\t\t}",
      moonlight:
        "\n\t\t\t:root {\n\t\t\t--page-margin: #020514;\n\t\t\t--editor-background: #020514;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: #D4DCE9;\n\t\t\t--secondary-text: #3E87DA;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: #03599bd9;\n\t\t\t--box-selection-fill: hsl(206deg 66% 41% / 85%);\n\t\t\t--loop-accent: #639BD6;\n\t\t\t--link-accent: #A8C6E8;\n\t\t\t--ui-widget-background: #1e2940;\n\t\t\t--ui-widget-focus: #324b81;\n\t\t\t--pitch-background: #223849;\n\t\t\t--tonic: #33536c;\n\t\t\t--fifth-note: hsl(206deg 36% 16%);\n\t\t\t--white-piano-key: #c1bfe9;\n\t\t\t--black-piano-key: #454354;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #25568d80;\n\t\t\t--track-editor-bg-pitch-dim: #10253c80;\n\t\t\t--track-editor-bg-noise: #25568d80;\n\t\t\t--track-editor-bg-noise-dim: #10253c80;\n\t\t\t--track-editor-bg-mod: #25568d80;\n\t\t\t--track-editor-bg-mod-dim: #10253c80;\n\t\t\t--multiplicative-mod-slider: #0476cd;\n\t\t\t--overwriting-mod-slider: #035899;\n\t\t\t--indicator-primary: #57a1f4;\n\t\t\t--indicator-secondary: #2e5684;\n\t\t\t--select2-opt-group: #24355c;\n\t\t\t--input-box-outline: #141e34;\n\t\t\t--mute-button-normal: #6ebffc;\n\t\t\t--mute-button-mod: #0a92fa;\n\t\t\t--pitch1-secondary-channel: #47425c;\n\t\t\t--pitch1-primary-channel: #918bac;\n\t\t\t--pitch1-secondary-note: #6b6489;\n\t\t\t--pitch1-primary-note: #a8a3bf;\n\t\t\t--pitch2-secondary-channel: #626493;\n\t\t\t--pitch2-primary-channel: #bdbed3;\n\t\t\t--pitch2-secondary-note: #626493;\n\t\t\t--pitch2-primary-note: #bdbed3;\n\t\t\t--pitch3-secondary-channel: #6e89b4;\n\t\t\t--pitch3-primary-channel: #d4dce9;\n\t\t\t--pitch3-secondary-note: #6e89b4;\n\t\t\t--pitch3-primary-note: #d4dce9;\n\t\t\t--pitch4-secondary-channel: #4c77a9;\n\t\t\t--pitch4-primary-channel: #a8c6e8;\n\t\t\t--pitch4-secondary-note: #4c77a9;\n\t\t\t--pitch4-primary-note: #a8c6e8;\n\t\t\t--pitch5-secondary-channel: #314e6d;\n\t\t\t--pitch5-primary-channel: #639bd6;\n\t\t\t--pitch5-secondary-note: #46698f;\n\t\t\t--pitch5-primary-note: #639bd6;\n\t\t\t--pitch6-secondary-channel: #143d6b;\n\t\t\t--pitch6-primary-channel: #3e87da;\n\t\t\t--pitch6-secondary-note: #143d6b;\n\t\t\t--pitch6-primary-note: #3e87da;\n\t\t\t--pitch7-secondary-channel: #314e6d;\n\t\t\t--pitch7-primary-channel: #639bd6;\n\t\t\t--pitch7-secondary-note: #314e6d;\n\t\t\t--pitch7-primary-note: #639bd6;\n\t\t\t--pitch8-secondary-channel: #4c77a9;\n\t\t\t--pitch8-primary-channel: #a8c6e8;\n\t\t\t--pitch8-secondary-note: #4c77a9;\n\t\t\t--pitch8-primary-note: #a8c6e8;\n\t\t\t--pitch9-secondary-channel: #6e89b4;\n\t\t\t--pitch9-primary-channel: #d4dce9;\n\t\t\t--pitch9-secondary-note: #6e89b4;\n\t\t\t--pitch9-primary-note: #d4dce9;\n\t\t\t--pitch10-secondary-channel: #626493;\n\t\t\t--pitch10-primary-channel: #bdbed3;\n\t\t\t--pitch10-secondary-note: #626493;\n\t\t\t--pitch10-primary-note: #bdbed3;\n\t\t\t--noise1-secondary-channel: #4b4a55;\n\t\t\t--noise1-primary-channel: #9795a3;\n\t\t\t--noise1-secondary-note: #4b4a55;\n\t\t\t--noise1-primary-note: #9795a3;\n\t\t\t--noise2-secondary-channel: #858e9d;\n\t\t\t--noise2-primary-channel: #d7dce5;\n\t\t\t--noise2-secondary-note: #858e9d;\n\t\t\t--noise2-primary-note: #d7dce5;\n\t\t\t--noise3-secondary-channel: #394e65;\n\t\t\t--noise3-primary-channel: #809bb7;\n\t\t\t--noise3-secondary-note: #394e65;\n\t\t\t--noise3-primary-note: #809bb7;\n\t\t\t--noise4-secondary-channel: #37577b;\n\t\t\t--noise4-primary-channel: #6189b8;\n\t\t\t--noise4-secondary-note: #37577b;\n\t\t\t--noise4-primary-note: #6189b8;\n\t\t\t--noise5-secondary-channel: #223849;\n\t\t\t--noise5-primary-channel: #5588af;\n\t\t\t--noise5-secondary-note: #223849;\n\t\t\t--noise5-primary-note: #5588af;\n\t\t\t--mod1-secondary-channel: #3e336c;\n\t\t\t--mod1-primary-channel: #6d60a4;\n\t\t\t--mod1-secondary-note: #3e336c;\n\t\t\t--mod1-primary-note: #6d60a4;\n\t\t\t--mod2-secondary-channel: #716791;\n\t\t\t--mod2-primary-channel: #bdbed3;\n\t\t\t--mod2-secondary-note: #716791;\n\t\t\t--mod2-primary-note: #bdbed3;\n\t\t\t--mod3-secondary-channel: #6b91bd;\n\t\t\t--mod3-primary-channel: #4b8fdd;\n\t\t\t--mod3-secondary-note: #597ca7;\n\t\t\t--mod3-primary-note: #7eade3;\n\t\t\t--mod4-secondary-channel: #14559f;\n\t\t\t--mod4-primary-channel: #3386e6;\n\t\t\t--mod4-secondary-note: #14559f;\n\t\t\t--mod4-primary-note: #3386e6;\n\t\t\t--mod-label-primary: #1e2940;\n\t\t\t--mod-label-secondary-text: #748ebe;\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--disabled-note-primary: #828282;\n\t\t\t--disabled-note-secondary: #4f4f4f;\n\t\t\t}",
      autumn:
        "\n\t\t:root {\n\t\t\t--page-margin: #060304;\n\t\t\t--editor-background: #060304;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: white;\n\t\t\t--secondary-text: #999;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgb(115 80 76);\n\t\t\t--box-selection-fill: rgb(174 73 81 / 45%);\n\t\t\t--loop-accent: #834A69;\n\t\t\t--link-accent: #98f;\n\t\t\t--ui-widget-background: #2a2523;\n\t\t\t--ui-widget-focus: #4e4c44;\n\t\t\t--pitch-background: #121212;\n\t\t\t--tonic: #4f4f4f;\n\t\t\t--fifth-note: #222;\n\t\t\t--white-piano-key: #b59b9b;\n\t\t\t--black-piano-key: #231e1e;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #352f38;\n\t\t\t--track-editor-bg-pitch-dim: #232025;\n\t\t\t--track-editor-bg-noise: #3c3029;\n\t\t\t--track-editor-bg-noise-dim: #251d19;\n\t\t\t--track-editor-bg-mod: #202623;\n\t\t\t--track-editor-bg-mod-dim: #131715;\n\t\t\t--multiplicative-mod-slider: #D9D16E;\n\t\t\t--overwriting-mod-slider: #2D826F;\n\t\t\t--indicator-primary: #D9D16E;\n\t\t\t--indicator-secondary: #444226;\n\t\t\t--select2-opt-group: #20191c;\n\t\t\t--input-box-outline: #20191c;\n\t\t\t--mute-button-normal: var(--pitch2-primary-channel);\n\t\t\t--mute-button-mod: var(--pitch4-primary-channel);\n\t\t\t--pitch1-secondary-channel: #704a34;\n\t\t\t--pitch1-primary-channel: #D9895A;\n\t\t\t--pitch1-secondary-note: #704a34;\n\t\t\t--pitch1-primary-note: #D9895A;\n\t\t\t--pitch2-secondary-channel: #5f3538;\n\t\t\t--pitch2-primary-channel: #AE4951;\n\t\t\t--pitch2-secondary-note: #5f3538;\n\t\t\t--pitch2-primary-note: #AE4951;\n\t\t\t--pitch3-secondary-channel: #5c4336;\n\t\t\t--pitch3-primary-channel: #CA9A81;\n\t\t\t--pitch3-secondary-note: #5c4336;\n\t\t\t--pitch3-primary-note: #CA9A81;\n\t\t\t--pitch4-secondary-channel: #1d3143;\n\t\t\t--pitch4-primary-channel: #386995;\n\t\t\t--pitch4-secondary-note: #1d3143;\n\t\t\t--pitch4-primary-note: #386995;\n\t\t\t--pitch5-secondary-channel: #9c8a58;\n\t\t\t--pitch5-primary-channel: #D9D16E;\n\t\t\t--pitch5-secondary-note: #7c783f;\n\t\t\t--pitch5-primary-note: #D9D16E;\n\t\t\t--pitch6-secondary-channel: #886562;\n\t\t\t--pitch6-primary-channel: #D3A9A5;\n\t\t\t--pitch6-secondary-note: #886562;\n\t\t\t--pitch6-primary-note: #D3A9A5;\n\t\t\t--pitch7-secondary-channel: #1c3f37;\n\t\t\t--pitch7-primary-channel: #2D826F;\n\t\t\t--pitch7-secondary-note: #1c3f37;\n\t\t\t--pitch7-primary-note: #2D826F;\n\t\t\t--pitch8-secondary-channel: #442e2d;\n\t\t\t--pitch8-primary-channel: #815150;\n\t\t\t--pitch8-secondary-note: #442e2d;\n\t\t\t--pitch8-primary-note: #815150;\n\t\t\t--pitch9-secondary-channel: #8e6f60;\n\t\t\t--pitch9-primary-channel: #E5B8A1;\n\t\t\t--pitch9-secondary-note: #8e6f60;\n\t\t\t--pitch9-primary-note: #E5B8A1;\n\t\t\t--pitch10-secondary-channel: #4f3142;\n\t\t\t--pitch10-primary-channel: #834A69;\n\t\t\t--pitch10-secondary-note: #4f3142;\n\t\t\t--pitch10-primary-note: #834A69;\n\t\t\t--noise1-secondary-channel: #6b5346;\n\t\t\t--noise1-primary-channel: #b99c89;\n\t\t\t--noise1-secondary-note: #6b5346;\n\t\t\t--noise1-primary-note: #F0D0BB;\n\t\t\t--noise2-secondary-channel: #4a3839;\n\t\t\t--noise2-primary-channel: #9c6b6e;\n\t\t\t--noise2-secondary-note: #4a3839;\n\t\t\t--noise2-primary-note: #c18b8f;\n\t\t\t--noise3-secondary-channel: #2d3c4a;\n\t\t\t--noise3-primary-channel: #536e86;\n\t\t\t--noise3-secondary-note: #2d3c4a;\n\t\t\t--noise3-primary-note: #8fa8c0;\n\t\t\t--noise4-secondary-channel: #273f3a;\n\t\t\t--noise4-primary-channel: #4e8377;\n\t\t\t--noise4-secondary-note: #273f3a;\n\t\t\t--noise4-primary-note: #87baae;\n\t\t\t--noise5-secondary-channel: #372730;\n\t\t\t--noise5-primary-channel: #7f5e70;\n\t\t\t--noise5-secondary-note: #372730;\n\t\t\t--noise5-primary-note: #cc96b3;\n\t\t\t--mod1-secondary-channel: #783f1f;\n\t\t\t--mod1-primary-channel: #dc6d2c;\n\t\t\t--mod1-secondary-note: #783f1f;\n\t\t\t--mod1-primary-note: #dc6d2c;\n\t\t\t--mod2-secondary-channel: #0b3153;\n\t\t\t--mod2-primary-channel: #1464ac;\n\t\t\t--mod2-secondary-note: #0b3153;\n\t\t\t--mod2-primary-note: #1464ac;\n\t\t\t--mod3-secondary-channel: #075040;\n\t\t\t--mod3-primary-channel: #08a17f;\n\t\t\t--mod3-secondary-note: #075040;\n\t\t\t--mod3-primary-note: #08a17f;\n\t\t\t--mod4-secondary-channel: #631640;\n\t\t\t--mod4-primary-channel: #b4186d;\n\t\t\t--mod4-secondary-note: #631640;\n\t\t\t--mod4-primary-note: #b4186d;\n\t\t\t--mod-label-primary: #000;\n\t\t\t--mod-label-secondary-text: #707070;\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--disabled-note-primary: #5d5d5d;\n\t\t\t--disabled-note-secondary: #292929;\n\t\t}",
      fruit:
        "\n\t\t:root {\n\t\t\t--page-margin: #040507;\n\t\t\t--editor-background: #040507;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: white;\n\t\t\t--secondary-text: #999;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgb(115 103 76);\n\t\t\t--box-selection-fill: rgb(174 109 73 / 45%);\n\t\t\t--loop-accent: #EC897D;\n\t\t\t--link-accent: #FDE484;\n\t\t\t--ui-widget-background: #22222c;\n\t\t\t--ui-widget-focus: #39394c;\n\t\t\t--pitch-background: #101010;\n\t\t\t--tonic: #2c2d34;\n\t\t\t--fifth-note: #191a20;\n\t\t\t--white-piano-key: #bbbaba;\n\t\t\t--black-piano-key: #2d2d2d;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #2b2d40;\n\t\t\t--track-editor-bg-pitch-dim: #191a25;\n\t\t\t--track-editor-bg-noise: #3c3644;\n\t\t\t--track-editor-bg-noise-dim: #26222b;\n\t\t\t--track-editor-bg-mod: #322a2a;\n\t\t\t--track-editor-bg-mod-dim: #191515;\n\t\t\t--multiplicative-mod-slider: #977da9;\n\t\t\t--overwriting-mod-slider: #798FA7;\n\t\t\t--indicator-primary: #EAAC9D;\n\t\t\t--indicator-secondary: #5e413a;\n\t\t\t--select2-opt-group: #191920;\n\t\t\t--input-box-outline: #191920;\n\t\t\t--mute-button-normal: #798FA7;\n\t\t\t--mute-button-mod: #354457;\n\t\t\t--pitch1-secondary-channel: #91655a;\n\t\t\t--pitch1-primary-channel: #EAAC9D;\n\t\t\t--pitch1-secondary-note: #91655a;\n\t\t\t--pitch1-primary-note: #EAAC9D;\n\t\t\t--pitch2-secondary-channel: #8f6513;\n\t\t\t--pitch2-primary-channel: #FFAF12;\n\t\t\t--pitch2-secondary-note: #8f6513;\n\t\t\t--pitch2-primary-note: #FFAF12;\n\t\t\t--pitch3-secondary-channel: #212f46;\n\t\t\t--pitch3-primary-channel: #34558B;\n\t\t\t--pitch3-secondary-note: #212f46;\n\t\t\t--pitch3-primary-note: #34558B;\n\t\t\t--pitch4-secondary-channel: #2e6b5b;\n\t\t\t--pitch4-primary-channel: #4EC5A7;\n\t\t\t--pitch4-secondary-note: #2e6b5b;\n\t\t\t--pitch4-primary-note: #4EC5A7;\n\t\t\t--pitch5-secondary-channel: #555D46;\n\t\t\t--pitch5-primary-channel: #aabf84;\n\t\t\t--pitch5-secondary-note: #555D46;\n\t\t\t--pitch5-primary-note: #aabf84;\n\t\t\t--pitch6-secondary-channel: #A2553B;\n\t\t\t--pitch6-primary-channel: #e59a81;\n\t\t\t--pitch6-secondary-note: #A2553B;\n\t\t\t--pitch6-primary-note: #e59a81;\n\t\t\t--pitch7-secondary-channel: #7b4021;\n\t\t\t--pitch7-primary-channel: #FE813E;\n\t\t\t--pitch7-secondary-note: #7b4021;\n\t\t\t--pitch7-primary-note: #FE813E;\n\t\t\t--pitch8-secondary-channel: #847753;\n\t\t\t--pitch8-primary-channel: #EFDAA3;\n\t\t\t--pitch8-secondary-note: #847753;\n\t\t\t--pitch8-primary-note: #EFDAA3;\n\t\t\t--pitch9-secondary-channel: #2c3642;\n\t\t\t--pitch9-primary-channel: #798FA7;\n\t\t\t--pitch9-secondary-note: #2c3642;\n\t\t\t--pitch9-primary-note: #798FA7;\n\t\t\t--pitch10-secondary-channel: #0d4453;\n\t\t\t--pitch10-primary-channel: #107895;\n\t\t\t--pitch10-secondary-note: #0d4453;\n\t\t\t--pitch10-primary-note: #107895;\n\t\t\t--noise1-secondary-channel: #71617C;\n\t\t\t--noise1-primary-channel: #977da9;\n\t\t\t--noise1-secondary-note: #71617C;\n\t\t\t--noise1-primary-note: #977da9;\n\t\t\t--noise2-secondary-channel: #3B3D4A;\n\t\t\t--noise2-primary-channel: #707591;\n\t\t\t--noise2-secondary-note: #3B3D4A;\n\t\t\t--noise2-primary-note: #707591;\n\t\t\t--noise3-secondary-channel: #625f5e;\n\t\t\t--noise3-primary-channel: #A19D9C;\n\t\t\t--noise3-secondary-note: #625f5e;\n\t\t\t--noise3-primary-note: #A19D9C;\n\t\t\t--noise4-secondary-channel: #ab847b;\n\t\t\t--noise4-primary-channel: #EAAC9D;\n\t\t\t--noise4-secondary-note: #ab847b;\n\t\t\t--noise4-primary-note: #EAAC9D;\n\t\t\t--noise5-secondary-channel: #B49D74;\n\t\t\t--noise5-primary-channel: #dec69b;\n\t\t\t--noise5-secondary-note: #B49D74;\n\t\t\t--noise5-primary-note: #dec69b;\n\t\t\t--mod1-secondary-channel: #722124;\n\t\t\t--mod1-primary-channel: #D13A41;\n\t\t\t--mod1-secondary-note: #722124;\n\t\t\t--mod1-primary-note: #D13A41;\n\t\t\t--mod2-secondary-channel: #213657;\n\t\t\t--mod2-primary-channel: #34558B;\n\t\t\t--mod2-secondary-note: #213657;\n\t\t\t--mod2-primary-note: #34558B;\n\t\t\t--mod3-secondary-channel: #555D46;\n\t\t\t--mod3-primary-channel: #848f6d;\n\t\t\t--mod3-secondary-note: #555D46;\n\t\t\t--mod3-primary-note: #848f6d;\n\t\t\t--mod4-secondary-channel: #71617C;\n\t\t\t--mod4-primary-channel: #a68ab9;\n\t\t\t--mod4-secondary-note: #71617C;\n\t\t\t--mod4-primary-note: #a68ab9;\n\t\t\t--mod-label-primary: #282828;\n\t\t\t--mod-label-secondary-text: #707070;\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--disabled-note-primary: #5d5d5d;\n\t\t\t--disabled-note-secondary: #292929;\n\t\t}",
      sunset:
        "\n\t\t:root {\n\t\t\t--page-margin: #040300;\n\t\t\t--editor-background: #040300;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: white;\n\t\t\t--secondary-text: #999;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgb(94 0 157);\n\t\t\t--box-selection-fill: rgb(174 173 73 / 45%);\n\t\t\t--loop-accent: #EC897D;\n\t\t\t--link-accent: #FDE484;\n\t\t\t--ui-widget-background: #241b24;\n\t\t\t--ui-widget-focus: #3a2e39;\n\t\t\t--pitch-background: #141414;\n\t\t\t--tonic: #2C212B;\n\t\t\t--fifth-note: #2E2A15;\n\t\t\t--white-piano-key: #bbbaba;\n\t\t\t--black-piano-key: #2d2d2d;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #2d2e42;\n\t\t\t--track-editor-bg-pitch-dim: #191a25;\n\t\t\t--track-editor-bg-noise: #393340;\n\t\t\t--track-editor-bg-noise-dim: #26222b;\n\t\t\t--track-editor-bg-mod: #232a2c;\n\t\t\t--track-editor-bg-mod-dim: #151819;\n\t\t\t--multiplicative-mod-slider: #977da9;\n\t\t\t--overwriting-mod-slider: #798FA7;\n\t\t\t--indicator-primary: #F28891;\n\t\t\t--indicator-secondary: #601d23;\n\t\t\t--select2-opt-group: #151015;\n\t\t\t--input-box-outline: #151015;\n\t\t\t--mute-button-normal: #E4739D;\n\t\t\t--mute-button-mod: #9650A6;\n\t\t\t--pitch1-secondary-channel: #7F7721;\n\t\t\t--pitch1-primary-channel: #F3E79A;\n\t\t\t--pitch1-secondary-note: #7F7721;\n\t\t\t--pitch1-primary-note: #F3E79A;\n\t\t\t--pitch2-secondary-channel: #785E20;\n\t\t\t--pitch2-primary-channel: #F7D086;\n\t\t\t--pitch2-secondary-note: #785E20;\n\t\t\t--pitch2-primary-note: #F7D086;\n\t\t\t--pitch3-secondary-channel: #6E4219;\n\t\t\t--pitch3-primary-channel: #F9B881;\n\t\t\t--pitch3-secondary-note: #6E4219;\n\t\t\t--pitch3-primary-note: #F9B881;\n\t\t\t--pitch4-secondary-channel: #79351F;\n\t\t\t--pitch4-primary-channel: #F7A086;\n\t\t\t--pitch4-secondary-note: #79351F;\n\t\t\t--pitch4-primary-note: #F7A086;\n\t\t\t--pitch5-secondary-channel: #81272F;\n\t\t\t--pitch5-primary-channel: #F28891;\n\t\t\t--pitch5-secondary-note: #81272F;\n\t\t\t--pitch5-primary-note: #F28891;\n\t\t\t--pitch6-secondary-channel: #8F224D;\n\t\t\t--pitch6-primary-channel: #E4739D;\n\t\t\t--pitch6-secondary-note: #8F224D;\n\t\t\t--pitch6-primary-note: #E4739D;\n\t\t\t--pitch7-secondary-channel: #611548;\n\t\t\t--pitch7-primary-channel: #CF63A6;\n\t\t\t--pitch7-secondary-note: #611548;\n\t\t\t--pitch7-primary-note: #CF63A6;\n\t\t\t--pitch8-secondary-channel: #561253;\n\t\t\t--pitch8-primary-channel: #B557A9;\n\t\t\t--pitch8-secondary-note: #4D104A;\n\t\t\t--pitch8-primary-note: #B557A9;\n\t\t\t--pitch9-secondary-channel: #4c1260;\n\t\t\t--pitch9-primary-channel: #9650A6;\n\t\t\t--pitch9-secondary-note: #3C0F4C;\n\t\t\t--pitch9-primary-note: #9650A6;\n\t\t\t--pitch10-secondary-channel: #3e1d78;\n\t\t\t--pitch10-primary-channel: #704D9E;\n\t\t\t--pitch10-secondary-note: #27124C;\n\t\t\t--pitch10-primary-note: #704D9E;\n\t\t\t--noise1-secondary-channel: #A7A578;\n\t\t\t--noise1-primary-channel: #EFE9AC;\n\t\t\t--noise1-secondary-note: #A7A578;\n\t\t\t--noise1-primary-note: #EFE9AC;\n\t\t\t--noise2-secondary-channel: #947A5F;\n\t\t\t--noise2-primary-channel: #FBCEA8;\n\t\t\t--noise2-secondary-note: #947A5F;\n\t\t\t--noise2-primary-note: #FBCEA8;\n\t\t\t--noise3-secondary-channel: #A3635D;\n\t\t\t--noise3-primary-channel: #F4A5AB;\n\t\t\t--noise3-secondary-note: #A3635D;\n\t\t\t--noise3-primary-note: #F4A5AB;\n\t\t\t--noise4-secondary-channel: #724D60;\n\t\t\t--noise4-primary-channel: #CD90B6;\n\t\t\t--noise4-secondary-note: #724D60;\n\t\t\t--noise4-primary-note: #CD90B6;\n\t\t\t--noise5-secondary-channel: #503F5C;\n\t\t\t--noise5-primary-channel: #7C6A9E;\n\t\t\t--noise5-secondary-note: #503F5C;\n\t\t\t--noise5-primary-note: #7C6A9E;\n\t\t\t--mod1-secondary-channel: #371883;\n\t\t\t--mod1-primary-channel: #6416C6;\n\t\t\t--mod1-secondary-note: #1F0A52;\n\t\t\t--mod1-primary-note: #6416C6;\n\t\t\t--mod2-secondary-channel: #690645;\n\t\t\t--mod2-primary-channel: #E52FA2;\n\t\t\t--mod2-secondary-note: #690645;\n\t\t\t--mod2-primary-note: #E52FA2;\n\t\t\t--mod3-secondary-channel: #943618;\n\t\t\t--mod3-primary-channel: #eb5b2c;\n\t\t\t--mod3-secondary-note: #943618;\n\t\t\t--mod3-primary-note: #eb5b2c;\n\t\t\t--mod4-secondary-channel: #928409;\n\t\t\t--mod4-primary-channel: #ecd50e;\n\t\t\t--mod4-secondary-note: #928409;\n\t\t\t--mod4-primary-note: #ecd50e;\n\t\t\t--mod-label-primary: #282828;\n\t\t\t--mod-label-secondary-text: #707070;\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--disabled-note-primary: #5d5d5d;\n\t\t\t--disabled-note-secondary: #292929;\n\t\t}",
      toxic:
        "\n\t\t:root {\n\t\t\t--page-margin: #010003;\n\t\t\t--editor-background: #010003;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: white;\n\t\t\t--secondary-text: #999;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgb(147 195 0);\n\t\t\t--box-selection-fill: rgb(145 174 73 / 49%);\n\t\t\t--loop-accent: #BCDE2C;\n\t\t\t--link-accent: #edff9f;\n\t\t\t--ui-widget-background: #261e2e;\n\t\t\t--ui-widget-focus: #322042;\n\t\t\t--pitch-background: #141c15;\n\t\t\t--tonic: #282c21;\n\t\t\t--fifth-note: #18221a;\n\t\t\t--white-piano-key: #e3e3e3;\n\t\t\t--black-piano-key: #2d2d2d;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #38293e;\n\t\t\t--track-editor-bg-pitch-dim: #251c29;\n\t\t\t--track-editor-bg-noise: #2c304c;\n\t\t\t--track-editor-bg-noise-dim: #191b2b;\n\t\t\t--track-editor-bg-mod: #311b32;\n\t\t\t--track-editor-bg-mod-dim: #1d101e;\n\t\t\t--multiplicative-mod-slider: #977da9;\n\t\t\t--overwriting-mod-slider: #798FA7;\n\t\t\t--indicator-primary: #aae9ff;\n\t\t\t--indicator-secondary: #253e46;\n\t\t\t--select2-opt-group: #110d15;\n\t\t\t--input-box-outline: #110d15;\n\t\t\t--mute-button-normal: #8f5ad1;\n\t\t\t--mute-button-mod: #482574;\n\t\t\t--pitch1-secondary-channel: #6b7f19;\n\t\t\t--pitch1-primary-channel: #BCDE2C;\n\t\t\t--pitch1-secondary-note: #6b7f19;\n\t\t\t--pitch1-primary-note: #BCDE2C;\n\t\t\t--pitch2-secondary-channel: #497a31;\n\t\t\t--pitch2-primary-channel: #7BD152;\n\t\t\t--pitch2-secondary-note: #497a31;\n\t\t\t--pitch2-primary-note: #7BD152;\n\t\t\t--pitch3-secondary-channel: #286b40;\n\t\t\t--pitch3-primary-channel: #45BE71;\n\t\t\t--pitch3-secondary-note: #286b40;\n\t\t\t--pitch3-primary-note: #45BE71;\n\t\t\t--pitch4-secondary-channel: #125140;\n\t\t\t--pitch4-primary-channel: #25A884;\n\t\t\t--pitch4-secondary-note: #125140;\n\t\t\t--pitch4-primary-note: #25A884;\n\t\t\t--pitch5-secondary-channel: #114c49;\n\t\t\t--pitch5-primary-channel: #21908C;\n\t\t\t--pitch5-secondary-note: #114c49;\n\t\t\t--pitch5-primary-note: #21908C;\n\t\t\t--pitch6-secondary-channel: #143843;\n\t\t\t--pitch6-primary-channel: #2B788E;\n\t\t\t--pitch6-secondary-note: #143843;\n\t\t\t--pitch6-primary-note: #2B788E;\n\t\t\t--pitch7-secondary-channel: #1d354e;\n\t\t\t--pitch7-primary-channel: #355F8D;\n\t\t\t--pitch7-secondary-note: #1a2f46;\n\t\t\t--pitch7-primary-note: #355F8D;\n\t\t\t--pitch8-secondary-channel: #2c2e5a;\n\t\t\t--pitch8-primary-channel: #414486;\n\t\t\t--pitch8-secondary-note: #1e1f3d;\n\t\t\t--pitch8-primary-note: #414486;\n\t\t\t--pitch9-secondary-channel: #3c1f5e;\n\t\t\t--pitch9-primary-channel: #5e3b89;\n\t\t\t--pitch9-secondary-note: #25133b;\n\t\t\t--pitch9-primary-note: #5e3b89;\n\t\t\t--pitch10-secondary-channel: #510264;\n\t\t\t--pitch10-primary-channel: #720d8a;\n\t\t\t--pitch10-secondary-note: #440154;\n\t\t\t--pitch10-primary-note: #720d8a;\n\t\t\t--noise1-secondary-channel: #BCDE2C;\n\t\t\t--noise1-primary-channel: #edff9f;\n\t\t\t--noise1-secondary-note: #BCDE2C;\n\t\t\t--noise1-primary-note: #edff9f;\n\t\t\t--noise2-secondary-channel: #45BE71;\n\t\t\t--noise2-primary-channel: #89ffb4;\n\t\t\t--noise2-secondary-note: #45BE71;\n\t\t\t--noise2-primary-note: #89ffb4;\n\t\t\t--noise3-secondary-channel: #21908C;\n\t\t\t--noise3-primary-channel: #72fffa;\n\t\t\t--noise3-secondary-note: #21908C;\n\t\t\t--noise3-primary-note: #72fffa;\n\t\t\t--noise4-secondary-channel: #355F8D;\n\t\t\t--noise4-primary-channel: #7cb6f5;\n\t\t\t--noise4-secondary-note: #355F8D;\n\t\t\t--noise4-primary-note: #7cb6f5;\n\t\t\t--noise5-secondary-channel: #482574;\n\t\t\t--noise5-primary-channel: #8f5ad1;\n\t\t\t--noise5-secondary-note: #48257A;\n\t\t\t--noise5-primary-note: #8f5ad1;\n\t\t\t--mod1-secondary-channel: #815a16;\n\t\t\t--mod1-primary-channel: #F5AB29;\n\t\t\t--mod1-secondary-note: #815a16;\n\t\t\t--mod1-primary-note: #F5AB29;\n\t\t\t--mod2-secondary-channel: #4d341a;\n\t\t\t--mod2-primary-channel: #C98540;\n\t\t\t--mod2-secondary-note: #4d341a;\n\t\t\t--mod2-primary-note: #C98540;\n\t\t\t--mod3-secondary-channel: #643734;\n\t\t\t--mod3-primary-channel: #A75D58;\n\t\t\t--mod3-secondary-note: #643734;\n\t\t\t--mod3-primary-note: #A75D58;\n\t\t\t--mod4-secondary-channel: #461430;\n\t\t\t--mod4-primary-channel: #812359;\n\t\t\t--mod4-secondary-note: #3f112b;\n\t\t\t--mod4-primary-note: #812359;\n\t\t\t--mod-label-primary: #282828;\n\t\t\t--mod-label-secondary-text: #707070;\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--disabled-note-primary: #5d5d5d;\n\t\t\t--disabled-note-secondary: #292929;\n\t\t}",
      "violet verdant":
        "\n\t\t:root {\n\t\t\t--page-margin: #0e031a;\n\t\t\t--editor-background: #0e031a;\n\t\t\t--hover-preview: #e5ffea;\n\t\t\t--playhead: rgba(255, 255, 255, 0.9);\n\t\t\t--primary-text: #f0e0ff;\n\t\t\t--secondary-text: #706087;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgba(119,68,255,0.99);\n\t\t\t--box-selection-fill: #225835;\n\t\t\t--loop-accent: #8f00fb;\n\t\t\t--link-accent: #82dd5d;\n\t\t\t--ui-widget-background: #303c66;\n\t\t\t--ui-widget-focus: #62559b;\n\t\t\t--pitch-background: #293b52;\n\t\t\t--tonic: #5b46ad;\n\t\t\t--fifth-note: #42604d;\n\t\t\t--white-piano-key: #f6e8ff;\n\t\t\t--black-piano-key: #5a4972;\n\t\t\t--use-color-formula: true;\n\t\t\t--track-editor-bg-pitch: #392a46;\n\t\t\t--track-editor-bg-pitch-dim: #1c1d28;\n\t\t\t--track-editor-bg-noise: #403150;\n\t\t\t--track-editor-bg-noise-dim: #161313;\n\t\t\t--track-editor-bg-mod: #253c25;\n\t\t\t--track-editor-bg-mod-dim: #0c1811;\n\t\t\t--multiplicative-mod-slider: #606c9f;\n\t\t\t--overwriting-mod-slider: #6850b5;\n\t\t\t--indicator-primary: #9c64f7;\n\t\t\t--indicator-secondary: #393e4f;\n\t\t\t--select2-opt-group: #5d576f;\n\t\t\t--input-box-outline: #403150;\n\t\t\t--mute-button-normal: #82dd5d;\n\t\t\t--mute-button-mod: #945de5;\n\t\t\t--mod-label-primary: #312840;\n\t\t\t--mod-label-secondary-text: rgb(88 70 104);\n\t\t\t--mod-label-primary-text: #82dd5d;\n\t\t\t--pitch-secondary-channel-hue: 64;\n\t\t\t--pitch-secondary-channel-hue-scale: 6.1;\n\t\t\t--pitch-secondary-channel-sat: 63.3;\n\t\t\t--pitch-secondary-channel-sat-scale: 0.1;\n\t\t\t--pitch-secondary-channel-lum: 40;\n\t\t\t--pitch-secondary-channel-lum-scale: 0.05;\n\t\t\t--pitch-primary-channel-hue: 64;\n\t\t\t--pitch-primary-channel-hue-scale: 6.1;\n\t\t\t--pitch-primary-channel-sat: 90;\n\t\t\t--pitch-primary-channel-sat-scale: 0.1;\n\t\t\t--pitch-primary-channel-lum: 67.5;\n\t\t\t--pitch-primary-channel-lum-scale: 0.05;\n\t\t\t--pitch-secondary-note-hue: 32;\n\t\t\t--pitch-secondary-note-hue-scale: 6.1;\n\t\t\t--pitch-secondary-note-sat: 87.9;\n\t\t\t--pitch-secondary-note-sat-scale: 0.1;\n\t\t\t--pitch-secondary-note-lum: 25;\n\t\t\t--pitch-secondary-note-lum-scale: 0.05;\n\t\t\t--pitch-primary-note-hue: 64;\n\t\t\t--pitch-primary-note-hue-scale: 6.1;\n\t\t\t--pitch-primary-note-sat: 90;\n\t\t\t--pitch-primary-note-sat-scale: 0.05;\n\t\t\t--pitch-primary-note-lum: 85.6;\n\t\t\t--pitch-primary-note-lum-scale: 0.025;\n\t\t\t--noise-secondary-channel-hue: 192;\n\t\t\t--noise-secondary-channel-hue-scale: 2;\n\t\t\t--noise-secondary-channel-sat: 45;\n\t\t\t--noise-secondary-channel-sat-scale: 0;\n\t\t\t--noise-secondary-channel-lum: 32;\n\t\t\t--noise-secondary-channel-lum-scale: 0;\n\t\t\t--noise-primary-channel-hue: 192;\n\t\t\t--noise-primary-channel-hue-scale: 2;\n\t\t\t--noise-primary-channel-sat: 33;\n\t\t\t--noise-primary-channel-sat-scale: 0;\n\t\t\t--noise-primary-channel-lum: 43.5;\n\t\t\t--noise-primary-channel-lum-scale: 0;\n\t\t\t--noise-secondary-note-hue: 160;\n\t\t\t--noise-secondary-note-hue-scale: 2;\n\t\t\t--noise-secondary-note-sat: 33.5;\n\t\t\t--noise-secondary-note-sat-scale: 0;\n\t\t\t--noise-secondary-note-lum: 45;\n\t\t\t--noise-secondary-note-lum-scale: 0;\n\t\t\t--noise-primary-note-hue: 192;\n\t\t\t--noise-primary-note-hue-scale: 2;\n\t\t\t--noise-primary-note-sat: 46.5;\n\t\t\t--noise-primary-note-sat-scale: 0;\n\t\t\t--noise-primary-note-lum: 74;\n\t\t\t--noise-primary-note-lum-scale: 0;\n\t\t\t--mod-secondary-channel-hue: 132;\n\t\t\t--mod-secondary-channel-hue-scale: 1.5;\n\t\t\t--mod-secondary-channel-sat: 88;\n\t\t\t--mod-secondary-channel-sat-scale: 0;\n\t\t\t--mod-secondary-channel-lum: 50;\n\t\t\t--mod-secondary-channel-lum-scale: 0;\n\t\t\t--mod-primary-channel-hue: 132;\n\t\t\t--mod-primary-channel-hue-scale: 1.5;\n\t\t\t--mod-primary-channel-sat: 96;\n\t\t\t--mod-primary-channel-sat-scale: 0;\n\t\t\t--mod-primary-channel-lum: 80;\n\t\t\t--mod-primary-channel-lum-scale: 0;\n\t\t\t--mod-secondary-note-hue: 100;\n\t\t\t--mod-secondary-note-hue-scale: 1.5;\n\t\t\t--mod-secondary-note-sat: 92;\n\t\t\t--mod-secondary-note-sat-scale: 0;\n\t\t\t--mod-secondary-note-lum: 45;\n\t\t\t--mod-secondary-note-lum-scale: 0;\n\t\t\t--mod-primary-note-hue: 132;\n\t\t\t--mod-primary-note-hue-scale: 1.5;\n\t\t\t--mod-primary-note-sat: 96;\n\t\t\t--mod-primary-note-sat-scale: 0;\n\t\t\t--mod-primary-note-lum: 85;\n\t\t\t--mod-primary-note-lum-scale: 0;\n\t\t\t--disabled-note-primary: #91879f;\n\t\t\t--disabled-note-secondary: #6a677a;\n\t\t}",
      portal:
        "\n\t\t:root {\n\t\t\t--page-margin: #04081a;\n\t\t\t--editor-background: #04081a;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: white;\n\t\t\t--secondary-text: #999;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgba(119,68,255,0.99);\n\t\t\t--box-selection-fill: rgb(0 72 181);\n\t\t\t--loop-accent: #44d4ff;\n\t\t\t--link-accent: #ffa500;\n\t\t\t--ui-widget-background: #212c4a;\n\t\t\t--ui-widget-focus: #121f42;\n\t\t\t--pitch-background: #1b263e;\n\t\t\t--tonic: #995d00;\n\t\t\t--fifth-note: #0898a1;\n\t\t\t--white-piano-key: #ffffff;\n\t\t\t--black-piano-key: #516d7a;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #213352;\n\t\t\t--track-editor-bg-pitch-dim: #152032;\n\t\t\t--track-editor-bg-noise: #403524;\n\t\t\t--track-editor-bg-noise-dim: #2a1f0e;\n\t\t\t--track-editor-bg-mod: #234;\n\t\t\t--track-editor-bg-mod-dim: #123;\n\t\t\t--multiplicative-mod-slider: #456;\n\t\t\t--overwriting-mod-slider: #654;\n\t\t\t--indicator-primary: #5490ff;\n\t\t\t--indicator-secondary: #444;\n\t\t\t--select2-opt-group: #585858;\n\t\t\t--input-box-outline: #333;\n\t\t\t--mute-button-normal: #3372ff;\n\t\t\t--mute-button-mod: #dd872f;\n\t\t\t--pitch1-secondary-channel: #0099A1;\n\t\t\t--pitch1-primary-channel: #77f7ff;\n\t\t\t--pitch1-secondary-note: #00BDC7;\n\t\t\t--pitch1-primary-note: #92F9FF;\n\t\t\t--pitch2-secondary-channel: #0083a1;\n\t\t\t--pitch2-primary-channel: #35d9ff;\n\t\t\t--pitch2-secondary-note: #0083a1;\n\t\t\t--pitch2-primary-note: #a4eeff;\n\t\t\t--pitch3-secondary-channel: #0074c7;\n\t\t\t--pitch3-primary-channel: #3caeff;\n\t\t\t--pitch3-secondary-note: #00477a;\n\t\t\t--pitch3-primary-note: #aadcff;\n\t\t\t--pitch4-secondary-channel: #0039a1;\n\t\t\t--pitch4-primary-channel: #2673ff;\n\t\t\t--pitch4-secondary-note: #001f56;\n\t\t\t--pitch4-primary-note: #9bbeff;\n\t\t\t--pitch5-secondary-channel: #31148b;\n\t\t\t--pitch5-primary-channel: #7042ff;\n\t\t\t--pitch5-secondary-note: #190656;\n\t\t\t--pitch5-primary-note: #b79fff;\n\t\t\t--pitch6-secondary-channel: #979934;\n\t\t\t--pitch6-primary-channel: #fbff2f;\n\t\t\t--pitch6-secondary-note: #5d5e0a;\n\t\t\t--pitch6-primary-note: #fdff9a;\n\t\t\t--pitch7-secondary-channel: #b78f00;\n\t\t\t--pitch7-primary-channel: #ffd747;\n\t\t\t--pitch7-secondary-note: #5e3d00;\n\t\t\t--pitch7-primary-note: #ffe381;\n\t\t\t--pitch8-secondary-channel: #9d6500;\n\t\t\t--pitch8-primary-channel: #ffa400;\n\t\t\t--pitch8-secondary-note: #583900;\n\t\t\t--pitch8-primary-note: #ffd07c;\n\t\t\t--pitch9-secondary-channel: #744203;\n\t\t\t--pitch9-primary-channel: #ff8e00;\n\t\t\t--pitch9-secondary-note: #502d00;\n\t\t\t--pitch9-primary-note: #ffcb89;\n\t\t\t--pitch10-secondary-channel: #a32d00;\n\t\t\t--pitch10-primary-channel: #ff885b;\n\t\t\t--pitch10-secondary-note: #521700;\n\t\t\t--pitch10-primary-note: #ffb397;\n\t\t\t--noise1-secondary-channel: #6e2210;\n\t\t\t--noise1-primary-channel: #ff4600;\n\t\t\t--noise1-secondary-note: #4c1a08;\n\t\t\t--noise1-primary-note: #ffc9b4;\n\t\t\t--noise2-secondary-channel: #6a3110;\n\t\t\t--noise2-primary-channel: #ff782a;\n\t\t\t--noise2-secondary-note: #4c1f05;\n\t\t\t--noise2-primary-note: #ffb488;\n\t\t\t--noise3-secondary-channel: #72460e;\n\t\t\t--noise3-primary-channel: #d9871f;\n\t\t\t--noise3-secondary-note: #442905;\n\t\t\t--noise3-primary-note: #ffdcae;\n\t\t\t--noise4-secondary-channel: #837a0f;\n\t\t\t--noise4-primary-channel: #f7ea55;\n\t\t\t--noise4-secondary-note: #605906;\n\t\t\t--noise4-primary-note: #fff9ab;\n\t\t\t--noise5-secondary-channel: #8c8f00;\n\t\t\t--noise5-primary-channel: #fdff90;\n\t\t\t--noise5-secondary-note: #606200;\n\t\t\t--noise5-primary-note: #feffbc;\n\t\t\t--mod1-secondary-channel: #561b97;\n\t\t\t--mod1-primary-channel: #aa66f5;\n\t\t\t--mod1-secondary-note: #30075c;\n\t\t\t--mod1-primary-note: #cd9fff;\n\t\t\t--mod2-secondary-channel: #5116df;\n\t\t\t--mod2-primary-channel: #6b2dff;\n\t\t\t--mod2-secondary-note: #36138b;\n\t\t\t--mod2-primary-note: #bea3ff;\n\t\t\t--mod3-secondary-channel: #2535a1;\n\t\t\t--mod3-primary-channel: #3f57ff;\n\t\t\t--mod3-secondary-note: #0e185c;\n\t\t\t--mod3-primary-note: #8494ff;\n\t\t\t--mod4-secondary-channel: #1b5883;\n\t\t\t--mod4-primary-channel: #5eb7f5;\n\t\t\t--mod4-secondary-note: #072f4a;\n\t\t\t--mod4-primary-note: #63beff;\n\t\t\t--mod-label-primary: #24293a;\n\t\t\t--mod-label-secondary-text: #454d4e;\n\t\t\t--mod-label-primary-text: #7bd4ff;\n\t\t\t--disabled-note-primary: #072f4a;\n\t\t\t--disabled-note-secondary: #6585a7;\n\t\t}",
      fusion:
        ":root {\n\t\t\t--page-margin: #0c0306;\n\t\t\t--editor-background: #0c0306;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: #26d9cd;\n\t\t\t--secondary-text: #ff6666;\n\t\t\t--inverted-text: white;\n\t\t\t--text-selection: #ffffff;\n\t\t\t--box-selection-fill: #ff00004d;\n\t\t\t--loop-accent: #ff6666;\n\t\t\t--link-accent: white;\n\t\t\t--ui-widget-background: #232323;\n\t\t\t--ui-widget-focus: #303030;\n\t\t\t--pitch-background: hsl(61deg 100% 70% / 25%);\n\t\t\t--tonic: #66a3ff40;\n\t\t\t--fifth-note: #ff666640;\n\t\t\t--white-piano-key: #cdcdcd;\n\t\t\t--black-piano-key: #232323;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #404040bf;\n\t\t\t--track-editor-bg-pitch-dim: #151515;\n\t\t\t--track-editor-bg-noise: #404040bf;\n\t\t\t--track-editor-bg-noise-dim: #151515;\n\t\t\t--track-editor-bg-mod: #404040bf;\n\t\t\t--track-editor-bg-mod-dim: #151515;\n\t\t\t--multiplicative-mod-slider: #ef7692;\n\t\t\t--overwriting-mod-slider: #f43e69;\n\t\t\t--indicator-primary: #26d9cd;\n\t\t\t--indicator-secondary: hsl(176deg 70% 25%);\n\t\t\t--select2-opt-group: #232323;\n\t\t\t--input-box-outline: #141e34;\n\t\t\t--mute-button-normal: #26d9cd;\n\t\t\t--mute-button-mod: hsl(346deg 70% 50%);\n\t\t\t--pitch1-secondary-channel: #bf4040;\n\t\t\t--pitch1-primary-channel: #ff6666;\n\t\t\t--pitch1-secondary-note: #bf4040;\n\t\t\t--pitch1-primary-note: #ff6666;\n\t\t\t--pitch2-secondary-channel: #bf5b40;\n\t\t\t--pitch2-primary-channel: #ff8766;\n\t\t\t--pitch2-secondary-note: #bf5b40;\n\t\t\t--pitch2-primary-note: #ff8766;\n\t\t\t--pitch3-secondary-channel: #bf7940;\n\t\t\t--pitch3-primary-channel: #ffab66;\n\t\t\t--pitch3-secondary-note: #bf7940;\n\t\t\t--pitch3-primary-note: #ffab66;\n\t\t\t--pitch4-secondary-channel: #bf9b40;\n\t\t\t--pitch4-primary-channel: #ffd466;\n\t\t\t--pitch4-secondary-note: #bf9b40;\n\t\t\t--pitch4-primary-note: #ffd466;\n\t\t\t--pitch5-secondary-channel: #bdbf40;\n\t\t\t--pitch5-primary-channel: #fcff66;\n\t\t\t--pitch5-secondary-note: #bdbf40;\n\t\t\t--pitch5-primary-note: #fcff66;\n\t\t\t--pitch6-secondary-channel: #9dbf40;\n\t\t\t--pitch6-primary-channel: #d6ff66;\n\t\t\t--pitch6-secondary-note: #9dbf40;\n\t\t\t--pitch6-primary-note: #d6ff66;\n\t\t\t--pitch7-secondary-channel: #9dbf40;\n\t\t\t--pitch7-primary-channel: #fcff66;\n\t\t\t--pitch7-secondary-note: #9dbf40;\n\t\t\t--pitch7-primary-note: #fcff66;\n\t\t\t--pitch8-secondary-channel: #bf9b40;\n\t\t\t--pitch8-primary-channel: #ffd466;\n\t\t\t--pitch8-secondary-note: #bf9b40;\n\t\t\t--pitch8-primary-note: #ffd466;\n\t\t\t--pitch9-secondary-channel: #bf5b40;\n\t\t\t--pitch9-primary-channel: #ffab66;\n\t\t\t--pitch9-secondary-note: #bf5b40;\n\t\t\t--pitch9-primary-note: #ffab66;\n\t\t\t--pitch10-secondary-channel: #d15a1f;\n\t\t\t--pitch10-primary-channel: #ff8766;\n\t\t\t--pitch10-secondary-note: #d15a1f;\n\t\t\t--pitch10-primary-note: #ff8766;\n\t\t\t--noise1-secondary-channel: #4073bf;\n\t\t\t--noise1-primary-channel: #66a3ff;\n\t\t\t--noise1-secondary-note: #4073bf;\n\t\t\t--noise1-primary-note: #66a3ff;\n\t\t\t--noise2-secondary-channel: #405dbf;\n\t\t\t--noise2-primary-channel: #668aff;\n\t\t\t--noise2-secondary-note: #405dbf;\n\t\t\t--noise2-primary-note: #668aff;\n\t\t\t--noise3-secondary-channel: #4f40bf;\n\t\t\t--noise3-primary-channel: #7866ff;\n\t\t\t--noise3-secondary-note: #4f40bf;\n\t\t\t--noise3-primary-note: #7866ff;\n\t\t\t--noise4-secondary-channel: #8840bf;\n\t\t\t--noise4-primary-channel: #bd66ff;\n\t\t\t--noise4-secondary-note: #8840bf;\n\t\t\t--noise4-primary-note: #bd66ff;\n\t\t\t--noise5-secondary-channel: #bf40b5;\n\t\t\t--noise5-primary-channel: #ff66f2;\n\t\t\t--noise5-secondary-note: #bf40b5;\n\t\t\t--noise5-primary-note: #ff66f2;\n\t\t\t--mod1-secondary-channel: #cc6666;\n\t\t\t--mod1-primary-channel: #ff9999;\n\t\t\t--mod1-secondary-note: #cc6666;\n\t\t\t--mod1-primary-note: #ff9999;\n\t\t\t--mod2-secondary-channel: #cc7766;\n\t\t\t--mod2-primary-channel: #ffaa99;\n\t\t\t--mod2-secondary-note: #bf5540;\n\t\t\t--mod2-primary-note: #ffaa99;\n\t\t\t--mod3-secondary-channel: #cc8866;\n\t\t\t--mod3-primary-channel: #ffbb99;\n\t\t\t--mod3-secondary-note: #cc8866;\n\t\t\t--mod3-primary-note: #ffbb99;\n\t\t\t--mod4-secondary-channel: #cc9966;\n\t\t\t--mod4-primary-channel: #ffcc99;\n\t\t\t--mod4-secondary-note: #cc9966;\n\t\t\t--mod4-primary-note: #ffcc99;\n\t\t\t--mod-label-primary: #999;\n\t\t\t--mod-label-secondary-text: #333;\n\t\t\t--mod-label-primary-text: black;\n\t\t\t--disabled-note-primary: #696969;\n\t\t\t--disabled-note-secondary: #232323;\n\t\t}",
      inverse:
        ":root {\n\t\t\t--page-margin: #c4c8e3;\n\t\t\t--editor-background: #c4c8e3;\n\t\t\t--hover-preview: #000000;\n\t\t\t--playhead: #243953;\n\t\t\t--primary-text: black;\n\t\t\t--secondary-text: #855b95;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgb(132 125 255);\n\t\t\t--box-selection-fill: rgb(174 109 73 / 65%);\n\t\t\t--loop-accent: #EC897D;\n\t\t\t--link-accent: #4e00c8;\n\t\t\t--ui-widget-background: #e7e7ff;\n\t\t\t--ui-widget-focus: #d0d3e9;\n\t\t\t--pitch-background: #ffffff;\n\t\t\t--tonic: #bbbbbb;\n\t\t\t--fifth-note: #dcdcdc;\n\t\t\t--white-piano-key: #ffffff;\n\t\t\t--black-piano-key: #615f66;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #e9ebff;\n\t\t\t--track-editor-bg-pitch-dim: #e9ebff;\n\t\t\t--track-editor-bg-noise: #fdf2fe;\n\t\t\t--track-editor-bg-noise-dim: #fdf2fe;\n\t\t\t--track-editor-bg-mod: #dbdefe;\n\t\t\t--track-editor-bg-mod-dim: #dbdefe;\n\t\t\t--multiplicative-mod-slider: #6900b3;\n\t\t\t--overwriting-mod-slider: #004b9d;\n\t\t\t--indicator-primary: #ff633d;\n\t\t\t--indicator-secondary: #933822;\n\t\t\t--select2-opt-group: #e7e7ff;\n\t\t\t--input-box-outline: #e7e7ff;\n\t\t\t--mute-button-normal: #0072ef;\n\t\t\t--mute-button-mod: #002e67;\n\t\t\t--pitch1-secondary-channel: #b77d6e;\n\t\t\t--pitch1-primary-channel: #ff9d85;\n\t\t\t--pitch1-secondary-note: #b77d6e;\n\t\t\t--pitch1-primary-note: #ff9d85;\n\t\t\t--pitch2-secondary-channel: #be8821;\n\t\t\t--pitch2-primary-channel: #FFAF12;\n\t\t\t--pitch2-secondary-note: #be8821;\n\t\t\t--pitch2-primary-note: #FFAF12;\n\t\t\t--pitch3-secondary-channel: #3a62a4;\n\t\t\t--pitch3-primary-channel: #528ae6;\n\t\t\t--pitch3-secondary-note: #3a62a4;\n\t\t\t--pitch3-primary-note: #528ae6;\n\t\t\t--pitch4-secondary-channel: #3e8d78;\n\t\t\t--pitch4-primary-channel: #4EC5A7;\n\t\t\t--pitch4-secondary-note: #3e8d78;\n\t\t\t--pitch4-primary-note: #4EC5A7;\n\t\t\t--pitch5-secondary-channel: #84906d;\n\t\t\t--pitch5-primary-channel: #aabf84;\n\t\t\t--pitch5-secondary-note: #84906d;\n\t\t\t--pitch5-primary-note: #aabf84;\n\t\t\t--pitch6-secondary-channel: #bd6345;\n\t\t\t--pitch6-primary-channel: #e59a81;\n\t\t\t--pitch6-secondary-note: #bd6345;\n\t\t\t--pitch6-primary-note: #e59a81;\n\t\t\t--pitch7-secondary-channel: #aa592f;\n\t\t\t--pitch7-primary-channel: #FE813E;\n\t\t\t--pitch7-secondary-note: #aa592f;\n\t\t\t--pitch7-primary-note: #FE813E;\n\t\t\t--pitch8-secondary-channel: #b2a171;\n\t\t\t--pitch8-primary-channel: #ffd76d;\n\t\t\t--pitch8-secondary-note: #b2a171;\n\t\t\t--pitch8-primary-note: #ffd76d;\n\t\t\t--pitch9-secondary-channel: #4f6177;\n\t\t\t--pitch9-primary-channel: #798FA7;\n\t\t\t--pitch9-secondary-note: #4f6177;\n\t\t\t--pitch9-primary-note: #798FA7;\n\t\t\t--pitch10-secondary-channel: #165162;\n\t\t\t--pitch10-primary-channel: #107895;\n\t\t\t--pitch10-secondary-note: #165162;\n\t\t\t--pitch10-primary-note: #107895;\n\t\t\t--noise1-secondary-channel: #71617C;\n\t\t\t--noise1-primary-channel: #977da9;\n\t\t\t--noise1-secondary-note: #71617C;\n\t\t\t--noise1-primary-note: #977da9;\n\t\t\t--noise2-secondary-channel: #4a4c5b;\n\t\t\t--noise2-primary-channel: #707591;\n\t\t\t--noise2-secondary-note: #4a4c5b;\n\t\t\t--noise2-primary-note: #707591;\n\t\t\t--noise3-secondary-channel: #817c7b;\n\t\t\t--noise3-primary-channel: #A19D9C;\n\t\t\t--noise3-secondary-note: #817c7b;\n\t\t\t--noise3-primary-note: #A19D9C;\n\t\t\t--noise4-secondary-channel: #ab847b;\n\t\t\t--noise4-primary-channel: #EAAC9D;\n\t\t\t--noise4-secondary-note: #ab847b;\n\t\t\t--noise4-primary-note: #EAAC9D;\n\t\t\t--noise5-secondary-channel: #B49D74;\n\t\t\t--noise5-primary-channel: #dec69b;\n\t\t\t--noise5-secondary-note: #B49D74;\n\t\t\t--noise5-primary-note: #dec69b;\n\t\t\t--mod1-secondary-channel: #722124;\n\t\t\t--mod1-primary-channel: #D13A41;\n\t\t\t--mod1-secondary-note: #722124;\n\t\t\t--mod1-primary-note: #D13A41;\n\t\t\t--mod2-secondary-channel: #213657;\n\t\t\t--mod2-primary-channel: #34558B;\n\t\t\t--mod2-secondary-note: #213657;\n\t\t\t--mod2-primary-note: #34558B;\n\t\t\t--mod3-secondary-channel: #555D46;\n\t\t\t--mod3-primary-channel: #848f6d;\n\t\t\t--mod3-secondary-note: #555D46;\n\t\t\t--mod3-primary-note: #848f6d;\n\t\t\t--mod4-secondary-channel: #71617C;\n\t\t\t--mod4-primary-channel: #a68ab9;\n\t\t\t--mod4-secondary-note: #71617C;\n\t\t\t--mod4-primary-note: #a68ab9;\n\t\t\t--mod-label-primary: #e9e9e9;\n\t\t\t--mod-label-secondary-text: #707070;\n\t\t\t--mod-label-primary-text: black;\n\t\t\t--disabled-note-primary: #959595;\n\t\t\t--disabled-note-secondary: #6e6e6e;\n\t\t\t}",
      nebula:
        "\n\t\t:root {\n\t\t\t--page-margin: #040410;\n\t\t\t--editor-background: #150e1f;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: rgba(255, 255, 255, 0.9);\n\t\t\t--primary-text: white;\n\t\t\t--secondary-text: #8C849A;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgba(141,79,201,0.99);\n\t\t\t--box-selection-fill: #311E44;\n\t\t\t--loop-accent: #CC688C;\n\t\t\t--link-accent: #817DC9;\n\t\t\t--ui-widget-background: #44394F;\n\t\t\t--ui-widget-focus: #7A6386;\n\t\t\t--pitch-background: #393e4f40;\n\t\t\t--tonic: #7D5C9EC0;\n\t\t\t--fifth-note: #ab77bd50;\n\t\t\t--white-piano-key: #EEEEEE;\n\t\t\t--black-piano-key: #5F5566;\n\t\t\t--use-color-formula: true;\n\t\t\t--track-editor-bg-pitch: #46374C;\n\t\t\t--track-editor-bg-pitch-dim: #1F1C2850;\n\t\t\t--track-editor-bg-noise: #3D353B;\n\t\t\t--track-editor-bg-noise-dim: #16131550;\n\t\t\t--track-editor-bg-mod: #623F4C;\n\t\t\t--track-editor-bg-mod-dim: #361A2450;\n\t\t\t--multiplicative-mod-slider: #9F6E6A;\n\t\t\t--overwriting-mod-slider: #A664B5;\n\t\t\t--indicator-primary: #CC6B8E;\n\t\t\t--indicator-secondary: #44394F;\n\t\t\t--select2-opt-group: #6A576F;\n\t\t\t--input-box-outline: #222;\n\t\t\t--mute-button-normal: #BF91DC;\n\t\t\t--mute-button-mod: #DC8C9A;\n\t\t\t--mod-label-primary: #3A2840;\n\t\t\t--mod-label-secondary-text: #62485E;\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--pitch-secondary-channel-hue: -96;\n\t\t\t--pitch-secondary-channel-hue-scale: 4.2;\n\t\t\t--pitch-secondary-channel-sat: 50.3;\n\t\t\t--pitch-secondary-channel-sat-scale: 0.1;\n\t\t\t--pitch-secondary-channel-lum: 40;\n\t\t\t--pitch-secondary-channel-lum-scale: 0.05;\n\t\t\t--pitch-primary-channel-hue: -96;\n\t\t\t--pitch-primary-channel-hue-scale: 4.2;\n\t\t\t--pitch-primary-channel-sat: 70;\n\t\t\t--pitch-primary-channel-sat-scale: 0.1;\n\t\t\t--pitch-primary-channel-lum: 67.5;\n\t\t\t--pitch-primary-channel-lum-scale: 0.05;\n\t\t\t--pitch-secondary-note-hue: -96;\n\t\t\t--pitch-secondary-note-hue-scale: 4.2;\n\t\t\t--pitch-secondary-note-sat: 70.9;\n\t\t\t--pitch-secondary-note-sat-scale: 0.1;\n\t\t\t--pitch-secondary-note-lum: 25;\n\t\t\t--pitch-secondary-note-lum-scale: 0.05;\n\t\t\t--pitch-primary-note-hue: -96;\n\t\t\t--pitch-primary-note-hue-scale: 4.2;\n\t\t\t--pitch-primary-note-sat: 90;\n\t\t\t--pitch-primary-note-sat-scale: 0.05;\n\t\t\t--pitch-primary-note-lum: 85.6;\n\t\t\t--pitch-primary-note-lum-scale: 0.025;\n\t\t\t--noise-secondary-channel-hue: 16;\n\t\t\t--noise-secondary-channel-hue-scale: -1.33;\n\t\t\t--noise-secondary-channel-sat: 25;\n\t\t\t--noise-secondary-channel-sat-scale: 0;\n\t\t\t--noise-secondary-channel-lum: 42;\n\t\t\t--noise-secondary-channel-lum-scale: 0;\n\t\t\t--noise-primary-channel-hue: 16;\n\t\t\t--noise-primary-channel-hue-scale: -1.33;\n\t\t\t--noise-primary-channel-sat: 33;\n\t\t\t--noise-primary-channel-sat-scale: 0;\n\t\t\t--noise-primary-channel-lum: 63.5;\n\t\t\t--noise-primary-channel-lum-scale: 0;\n\t\t\t--noise-secondary-note-hue: 12;\n\t\t\t--noise-secondary-note-hue-scale: -1.33;\n\t\t\t--noise-secondary-note-sat: 33.5;\n\t\t\t--noise-secondary-note-sat-scale: 0;\n\t\t\t--noise-secondary-note-lum: 55;\n\t\t\t--noise-secondary-note-lum-scale: 0;\n\t\t\t--noise-primary-note-hue: 12;\n\t\t\t--noise-primary-note-hue-scale: -1.33;\n\t\t\t--noise-primary-note-sat: 46.5;\n\t\t\t--noise-primary-note-sat-scale: 0;\n\t\t\t--noise-primary-note-lum: 74;\n\t\t\t--noise-primary-note-lum-scale: 0;\n\t\t\t--mod-secondary-channel-hue: 12;\n\t\t\t--mod-secondary-channel-hue-scale: -.75;\n\t\t\t--mod-secondary-channel-sat: 50;\n\t\t\t--mod-secondary-channel-sat-scale: 0;\n\t\t\t--mod-secondary-channel-lum: 50;\n\t\t\t--mod-secondary-channel-lum-scale: 0;\n\t\t\t--mod-primary-channel-hue: 12;\n\t\t\t--mod-primary-channel-hue-scale: -.75;\n\t\t\t--mod-primary-channel-sat: 70;\n\t\t\t--mod-primary-channel-sat-scale: 0;\n\t\t\t--mod-primary-channel-lum: 80;\n\t\t\t--mod-primary-channel-lum-scale: 0;\n\t\t\t--mod-secondary-note-hue: 12;\n\t\t\t--mod-secondary-note-hue-scale: -.75;\n\t\t\t--mod-secondary-note-sat: 75;\n\t\t\t--mod-secondary-note-sat-scale: 0;\n\t\t\t--mod-secondary-note-lum: 45;\n\t\t\t--mod-secondary-note-lum-scale: 0;\n\t\t\t--mod-primary-note-hue: 12;\n\t\t\t--mod-primary-note-hue-scale: -.75;\n\t\t\t--mod-primary-note-sat: 85;\n\t\t\t--mod-primary-note-sat-scale: 0;\n\t\t\t--mod-primary-note-lum: 85;\n\t\t\t--mod-primary-note-lum-scale: 0;\n\t\t\t--disabled-note-primary: #aaa;\n\t\t\t--disabled-note-secondary: #666;\n\t\t}",
      "roe light":
        "\n\t\t:root {\n\t\t\t--page-margin: #fff5f5;\n\t\t\t--editor-background: #fff5f5;\n\t\t\t--hover-preview: #0e8bf1;\n\t\t\t--playhead: 000;\n\t\t\t--primary-text: #0e8bf1;\n\t\t\t--secondary-text: #f10e0e;\n\t\t\t--inverted-text: white;\n\t\t\t--text-selection: #ff4444fc;\n\t\t\t--box-selection-fill: #ff00004d;\n\t\t\t--loop-accent: #9a75ff;\n\t\t\t--link-accent: #ff7070;\n\t\t\t--ui-widget-background: #bdc9e5;\n\t\t\t--ui-widget-focus: #a3b7e5;\n\t\t\t--pitch-background: #d0c7db;\n\t\t\t--tonic: #bed3e4;\n\t\t\t--fifth-note: #e7c6c6;\n\t\t\t--white-piano-key: #cdcdcd;\n\t\t\t--black-piano-key: #232323;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #e5e1ea;\n\t\t\t--track-editor-bg-pitch-dim: #cbc4d4;\n\t\t\t--track-editor-bg-noise: #e0ddee;\n\t\t\t--track-editor-bg-noise-dim: #c1bade;\n\t\t\t--track-editor-bg-mod: #d8e6f3;\n\t\t\t--track-editor-bg-mod-dim: #b1cce7;\n\t\t\t--multiplicative-mod-slider: #8097cb;\n\t\t\t--overwriting-mod-slider: #8097cb;\n\t\t\t--indicator-primary: #FF2A2A;\n\t\t\t--indicator-secondary: #92a6d3;\n\t\t\t--select2-opt-group: #b6c4e2;\n\t\t\t--input-box-outline: #bdc9e5;\n\t\t\t--mute-button-normal: #66baff;\n\t\t\t--mute-button-mod: #1a98ff;\n\t\t\t--pitch1-secondary-channel: #273c90;\n\t\t\t--pitch1-primary-channel: #476BFF;\n\t\t\t--pitch1-secondary-note: #273c90;\n\t\t\t--pitch1-primary-note: #476BFF;\n\t\t\t--pitch2-secondary-channel: #3a3898;\n\t\t\t--pitch2-primary-channel: #625FFB;\n\t\t\t--pitch2-secondary-note: #3a3898;\n\t\t\t--pitch2-primary-note: #625FFB;\n\t\t\t--pitch3-secondary-channel: #542780;\n\t\t\t--pitch3-primary-channel: #9C49EC;\n\t\t\t--pitch3-secondary-note: #542780;\n\t\t\t--pitch3-primary-note: #9C49EC;\n\t\t\t--pitch4-secondary-channel: #84225d;\n\t\t\t--pitch4-primary-channel: #fd3fb1;\n\t\t\t--pitch4-secondary-note: #84225d;\n\t\t\t--pitch4-primary-note: #fd3fb1;\n\t\t\t--pitch5-secondary-channel: #8d2323;\n\t\t\t--pitch5-primary-channel: #ff3f3f;\n\t\t\t--pitch5-secondary-note: #8d2323;\n\t\t\t--pitch5-primary-note: #ff3f3f;\n\t\t\t--pitch6-secondary-channel: #84225d;\n\t\t\t--pitch6-primary-channel: #fd3fb1;\n\t\t\t--pitch6-secondary-note: #84225d;\n\t\t\t--pitch6-primary-note: #fd3fb1;\n\t\t\t--pitch7-secondary-channel: #542780;\n\t\t\t--pitch7-primary-channel: #9C49EC;\n\t\t\t--pitch7-secondary-note: #542780;\n\t\t\t--pitch7-primary-note: #9C49EC;\n\t\t\t--pitch8-secondary-channel: #3a3898;\n\t\t\t--pitch8-primary-channel: #625FFB;\n\t\t\t--pitch8-secondary-note: #3a3898;\n\t\t\t--pitch8-primary-note: #625FFB;\n\t\t\t--pitch9-secondary-channel: #273c90;\n\t\t\t--pitch9-primary-channel: #476BFF;\n\t\t\t--pitch9-secondary-note: #273c90;\n\t\t\t--pitch9-primary-note: #476BFF;\n\t\t\t--pitch10-secondary-channel: #165a93;\n\t\t\t--pitch10-primary-channel: #299EFF;\n\t\t\t--pitch10-secondary-note: #165a93;\n\t\t\t--pitch10-primary-note: #299EFF;\n\t\t\t--noise1-secondary-channel: #336bdb;\n\t\t\t--noise1-primary-channel: #4281FF;\n\t\t\t--noise1-secondary-note: #336bdb;\n\t\t\t--noise1-primary-note: #4281FF;\n\t\t\t--noise2-secondary-channel: #5e38dc;\n\t\t\t--noise2-primary-channel: #7347FF;\n\t\t\t--noise2-secondary-note: #5e38dc;\n\t\t\t--noise2-primary-note: #7347FF;\n\t\t\t--noise3-secondary-channel: #7d3097;\n\t\t\t--noise3-primary-channel: #9F3CBF;\n\t\t\t--noise3-secondary-note: #7d3097;\n\t\t\t--noise3-primary-note: #9F3CBF;\n\t\t\t--noise4-secondary-channel: #ad2559;\n\t\t\t--noise4-primary-channel: #D3326F;\n\t\t\t--noise4-secondary-note: #ad2559;\n\t\t\t--noise4-primary-note: #D3326F;\n\t\t\t--noise5-secondary-channel: #d02525;\n\t\t\t--noise5-primary-channel: #FF2A2A;\n\t\t\t--noise5-secondary-note: #d02525;\n\t\t\t--noise5-primary-note: #FF2A2A;\n\t\t\t--mod1-secondary-channel: #35415a;\n\t\t\t--mod1-primary-channel: #47587a;\n\t\t\t--mod1-secondary-note: #35415a;\n\t\t\t--mod1-primary-note: #47587a;\n\t\t\t--mod2-secondary-channel: #5a5374;\n\t\t\t--mod2-primary-channel: #716791;\n\t\t\t--mod2-secondary-note: #5a5374;\n\t\t\t--mod2-primary-note: #716791;\n\t\t\t--mod3-secondary-channel: #53385c;\n\t\t\t--mod3-primary-channel: #6f4c7b;\n\t\t\t--mod3-secondary-note: #53385c;\n\t\t\t--mod3-primary-note: #6f4c7b;\n\t\t\t--mod4-secondary-channel: #7e4e60;\n\t\t\t--mod4-primary-channel: #9e6279;\n\t\t\t--mod4-secondary-note: #7e4e60;\n\t\t\t--mod4-primary-note: #9e6279;\n\t\t\t--mod-label-primary: #d0c7db;\n\t\t\t--mod-label-secondary-text: #cb3434;\n\t\t\t--mod-label-primary-text: black;\n\t\t\t--disabled-note-primary: #616161;\n\t\t\t--disabled-note-secondary: #474747;\n\t\t}",
      energized:
        "\n\t\t:root {\n\t\t\t--page-margin: #000a08;\n\t\t\t--editor-background: #000a08;\n\t\t\t--hover-preview: #ffffcc;\n\t\t\t--playhead: #ccfff5;\n\t\t\t--primary-text: white;\n\t\t\t--secondary-text: #d9d98c;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: #ffff6659;\n\t\t\t--box-selection-fill: #ffffff33;\n\t\t\t--loop-accent: #ffff00;\n\t\t\t--link-accent: #00ffcc;\n\t\t\t--ui-widget-background: #141f1d;\n\t\t\t--ui-widget-focus: #24423d;\n\t\t\t--pitch-background: #001410;\n\t\t\t--tonic: #00241d;\n\t\t\t--fifth-note: #ffff6633;\n\t\t\t--white-piano-key: #66998f;\n\t\t\t--black-piano-key: #141f1d;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #66998f40;\n\t\t\t--track-editor-bg-pitch-dim: #293d3940;\n\t\t\t--track-editor-bg-noise: #66998f40;\n\t\t\t--track-editor-bg-noise-dim: #293d3940;\n\t\t\t--track-editor-bg-mod: #99996640;\n\t\t\t--track-editor-bg-mod-dim: #3d3d2940;\n\t\t\t--multiplicative-mod-slider: #ffff00;\n\t\t\t--overwriting-mod-slider: #00ffcc;\n\t\t\t--indicator-primary: #ffff00;\n\t\t\t--indicator-secondary: #141f1d;\n\t\t\t--select2-opt-group: #1b312e;\n\t\t\t--input-box-outline: #141f1d;\n\t\t\t--mute-button-normal: #00ffcc;\n\t\t\t--mute-button-mod: #00997a;\n\t\t\t--pitch1-secondary-channel: #bfbf40;\n\t\t\t--pitch1-primary-channel: #ffff64;\n\t\t\t--pitch1-secondary-note: #bfbf40;\n\t\t\t--pitch1-primary-note: #ffff64;\n\t\t\t--pitch2-secondary-channel: #a2bf40;\n\t\t\t--pitch2-primary-channel: #e0ff7d;\n\t\t\t--pitch2-secondary-note: #a2bf40;\n\t\t\t--pitch2-primary-note: #e0ff7d;\n\t\t\t--pitch3-secondary-channel: #75bf40;\n\t\t\t--pitch3-primary-channel: #c1ff96;\n\t\t\t--pitch3-secondary-note: #75bf40;\n\t\t\t--pitch3-primary-note: #c1ff96;\n\t\t\t--pitch4-secondary-channel: #40bf51;\n\t\t\t--pitch4-primary-channel: #a2ffaf;\n\t\t\t--pitch4-secondary-note: #40bf51;\n\t\t\t--pitch4-primary-note: #a2ffaf;\n\t\t\t--pitch5-secondary-channel: #40bf86;\n\t\t\t--pitch5-primary-channel: #83ffc8;\n\t\t\t--pitch5-secondary-note: #40bf86;\n\t\t\t--pitch5-primary-note: #83ffc8;\n\t\t\t--pitch6-secondary-channel: #40bfa6;\n\t\t\t--pitch6-primary-channel: #64ffe1;\n\t\t\t--pitch6-secondary-note: #40bfa6;\n\t\t\t--pitch6-primary-note: #64ffe1;\n\t\t\t--pitch7-secondary-channel: #40bf86;\n\t\t\t--pitch7-primary-channel: #83ffc8;\n\t\t\t--pitch7-secondary-note: #40bf86;\n\t\t\t--pitch7-primary-note: #83ffc8;\n\t\t\t--pitch8-secondary-channel: #40bf51;\n\t\t\t--pitch8-primary-channel: #a2ffaf;\n\t\t\t--pitch8-secondary-note: #40bf51;\n\t\t\t--pitch8-primary-note: #a2ffaf;\n\t\t\t--pitch9-secondary-channel: #75bf40;\n\t\t\t--pitch9-primary-channel: #c1ff96;\n\t\t\t--pitch9-secondary-note: #75bf40;\n\t\t\t--pitch9-primary-note: #c1ff96;\n\t\t\t--pitch10-secondary-channel: #a2bf40;\n\t\t\t--pitch10-primary-channel: #e0ff7d;\n\t\t\t--pitch10-secondary-note: #a2bf40;\n\t\t\t--pitch10-primary-note: #e0ff7d;\n\t\t\t--noise1-secondary-channel: #a6a659;\n\t\t\t--noise1-primary-channel: #ffffcc;\n\t\t\t--noise1-secondary-note: #a6a659;\n\t\t\t--noise1-primary-note: #ffffcc;\n\t\t\t--noise2-secondary-channel: #94a659;\n\t\t\t--noise2-primary-channel: #f3ffcc;\n\t\t\t--noise2-secondary-note: #94a659;\n\t\t\t--noise2-primary-note: #f3ffcc;\n\t\t\t--noise3-secondary-channel: #79a659;\n\t\t\t--noise3-primary-channel: #e1ffcc;\n\t\t\t--noise3-secondary-note: #79a659;\n\t\t\t--noise3-primary-note: #e1ffcc;\n\t\t\t--noise4-secondary-channel: #94a659;\n\t\t\t--noise4-primary-channel: #f3ffcc;\n\t\t\t--noise4-secondary-note: #94a659;\n\t\t\t--noise4-primary-note: #f3ffcc;\n\t\t\t--noise5-secondary-channel: #a6a659;\n\t\t\t--noise5-primary-channel: #ffffcc;\n\t\t\t--noise5-secondary-note: #a6a659;\n\t\t\t--noise5-primary-note: #ffffcc;\n\t\t\t--mod1-secondary-channel: #a3a329;\n\t\t\t--mod1-primary-channel: #ffff00;\n\t\t\t--mod1-secondary-note: #a3a329;\n\t\t\t--mod1-primary-note: #ffff00;\n\t\t\t--mod2-secondary-channel: #a38529;\n\t\t\t--mod2-primary-channel: #ffbf00;\n\t\t\t--mod2-secondary-note: #a38529;\n\t\t\t--mod2-primary-note: #ffbf00;\n\t\t\t--mod3-secondary-channel: #a36629;\n\t\t\t--mod3-primary-channel: #ff7f00;\n\t\t\t--mod3-secondary-note: #a36629;\n\t\t\t--mod3-primary-note: #ff7f00;\n\t\t\t--mod4-secondary-channel: #a38529;\n\t\t\t--mod4-primary-channel: #ffbf00;\n\t\t\t--mod4-secondary-note: #a38529;\n\t\t\t--mod4-primary-note: #ffbf00;\n\t\t\t--mod-label-primary: #141f1d;\n\t\t\t--mod-label-secondary-text: #d9d98c;\n\t\t\t--mod-label-primary-text: white;\n\t\t\t--disabled-note-primary: #808080;\n\t\t\t--disabled-note-secondary: #666666;\n\t\t}",
      neapolitan:
        ":root {\n\t\t\t--page-margin: #120807;\n\t\t\t--editor-background: #120807;\n\t\t\t--hover-preview: #e79a82;\n\t\t\t--playhead: #e79a82;\n\t\t\t--primary-text: #decdbf;\n\t\t\t--secondary-text: #fa99bb;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: #990036;\n\t\t\t--box-selection-fill: rgba(255,255,255,0.2);\n\t\t\t--loop-accent: #f6377a;\n\t\t\t--link-accent: #f6377a;\n\t\t\t--ui-widget-background: #24160f;\n\t\t\t--ui-widget-focus: #362217;\n\t\t\t--pitch-background: #1e1106;\n\t\t\t--tonic: #382414;\n\t\t\t--fifth-note: #41240c;\n\t\t\t--white-piano-key: #e1c5b7;\n\t\t\t--black-piano-key: #482c1e;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #4d2a19;\n\t\t\t--track-editor-bg-pitch-dim: #27150c;\n\t\t\t--track-editor-bg-noise: #4d2a19;\n\t\t\t--track-editor-bg-noise-dim: #27150c;\n\t\t\t--track-editor-bg-mod: #4d2a19;\n\t\t\t--track-editor-bg-mod-dim: #27150c;\n\t\t\t--multiplicative-mod-slider: #decdbf;\n\t\t\t--overwriting-mod-slider: #decdbf;\n\t\t\t--indicator-primary: #decdbf;\n\t\t\t--indicator-secondary: #362217;\n\t\t\t--select2-opt-group: #24160f;\n\t\t\t--input-box-outline: #24160f;\n\t\t\t--mute-button-normal: #ff66a1;\n\t\t\t--mute-button-mod: #e61968;\n\t\t\t--pitch1-secondary-channel: #680029;\n\t\t\t--pitch1-primary-channel: #cc0052;\n\t\t\t--pitch1-secondary-note: #660029;\n\t\t\t--pitch1-primary-note: #cc0052;\n\t\t\t--pitch2-secondary-channel: #7e1b43;\n\t\t\t--pitch2-primary-channel: #d32e71;\n\t\t\t--pitch2-secondary-note: #7e1b43;\n\t\t\t--pitch2-primary-note: #d32e71;\n\t\t\t--pitch3-secondary-channel: #aa275e;\n\t\t\t--pitch3-primary-channel: #da5d91;\n\t\t\t--pitch3-secondary-note: #aa275e;\n\t\t\t--pitch3-primary-note: #da5d91;\n\t\t\t--pitch4-secondary-channel: #cc3878;\n\t\t\t--pitch4-primary-channel: #e18bb0;\n\t\t\t--pitch4-secondary-note: #cc3878;\n\t\t\t--pitch4-primary-note: #e18bb0;\n\t\t\t--pitch5-secondary-channel: #d06c9b;\n\t\t\t--pitch5-primary-channel: #e9bad0;\n\t\t\t--pitch5-secondary-note: #d06c9b;\n\t\t\t--pitch5-primary-note: #e9bad0;\n\t\t\t--pitch6-secondary-channel: #c9acc5;\n\t\t\t--pitch6-primary-channel: #f0e8ef;\n\t\t\t--pitch6-secondary-note: #c9acc5;\n\t\t\t--pitch6-primary-note: #f0e8ef;\n\t\t\t--pitch7-secondary-channel: #d06c9b;\n\t\t\t--pitch7-primary-channel: #e9bad0;\n\t\t\t--pitch7-secondary-note: #d06c9b;\n\t\t\t--pitch7-primary-note: #e9bad0;\n\t\t\t--pitch8-secondary-channel: #cc3878;\n\t\t\t--pitch8-primary-channel: #e18bb0;\n\t\t\t--pitch8-secondary-note: #cc3878;\n\t\t\t--pitch8-primary-note: #e18bb0;\n\t\t\t--pitch9-secondary-channel: #aa275e;\n\t\t\t--pitch9-primary-channel: #da5d91;\n\t\t\t--pitch9-secondary-note: #aa275e;\n\t\t\t--pitch9-primary-note: #da5d91;\n\t\t\t--pitch10-secondary-channel: #7e1b43;\n\t\t\t--pitch10-primary-channel: #d32e71;\n\t\t\t--pitch10-secondary-note: #7e1b43;\n\t\t\t--pitch10-primary-note: #d32e71;\n\t\t\t--noise1-secondary-channel: #683a37;\n\t\t\t--noise1-primary-channel: #A85F5A;\n\t\t\t--noise1-secondary-note: #683a37;\n\t\t\t--noise1-primary-note: #A85F5A;\n\t\t\t--noise2-secondary-channel: #7c4a41;\n\t\t\t--noise2-primary-channel: #B47A70;\n\t\t\t--noise2-secondary-note: #7c4a41;\n\t\t\t--noise2-primary-note: #B47A70;\n\t\t\t--noise3-secondary-channel: #935f4d;\n\t\t\t--noise3-primary-channel: #c09587;\n\t\t\t--noise3-secondary-note: #935f4d;\n\t\t\t--noise3-primary-note: #C09587;\n\t\t\t--noise4-secondary-channel: #aa795a;\n\t\t\t--noise4-primary-channel: #cdb09d;\n\t\t\t--noise4-secondary-note: #aa795a;\n\t\t\t--noise4-primary-note: #CDAF9D;\n\t\t\t--noise5-secondary-channel: #bb987c;\n\t\t\t--noise5-primary-channel: #decdbf;\n\t\t\t--noise5-secondary-note: #bb987c;\n\t\t\t--noise5-primary-note: #decdbf;\n\t\t\t--mod1-secondary-channel: #6ca784;\n\t\t\t--mod1-primary-channel: #accdb9;\n\t\t\t--mod1-secondary-note: #6ca784;\n\t\t\t--mod1-primary-note: #accdb9;\n\t\t\t--mod2-secondary-channel: #7daa9f;\n\t\t\t--mod2-primary-channel: #bbd3cd;\n\t\t\t--mod2-secondary-note: #7daa9f;\n\t\t\t--mod2-primary-note: #bbd3cd;\n\t\t\t--mod3-secondary-channel: #70a3a9;\n\t\t\t--mod3-primary-channel: #afcccf;\n\t\t\t--mod3-secondary-note: #70a3a9;\n\t\t\t--mod3-primary-note: #afcccf;\n\t\t\t--mod4-secondary-channel: #5698b8;\n\t\t\t--mod4-primary-channel: #9ec3d6;\n\t\t\t--mod4-secondary-note: #5698b8;\n\t\t\t--mod4-primary-note: #9ec3d6;\n\t\t\t--mod-label-primary: #24160f;\n\t\t\t--mod-label-secondary-text: #E5AFC2;\n\t\t\t--mod-label-primary-text: #decdbf;\n\t\t\t--disabled-note-primary: #bababa;\n\t\t\t--disabled-note-secondary: #878787;\n\t\t}",
      poly: ":root {\n\t\t\t--page-margin: #000;\n\t\t\t--editor-background: #000;\n\t\t\t--hover-preview: #808080;\n\t\t\t--playhead: #808080;\n\t\t\t--primary-text: white;\n\t\t\t--secondary-text: #cccccc;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: #696969;\n\t\t\t--box-selection-fill: #cccccc40;\n\t\t\t--loop-accent: #808080;\n\t\t\t--link-accent: white;\n\t\t\t--ui-widget-background: #232323;\n\t\t\t--ui-widget-focus: #303030;\n\t\t\t--pitch-background: #1a1a1a;\n\t\t\t--tonic: #262626;\n\t\t\t--fifth-note: #0d0d0d;\n\t\t\t--white-piano-key: #808080;\n\t\t\t--black-piano-key: #232323;\n\t\t\t--use-color-formula: true;\n\t\t\t--track-editor-bg-pitch: #262626;\n\t\t\t--track-editor-bg-pitch-dim: #1a1a1a;\n\t\t\t--track-editor-bg-noise: #262626;\n\t\t\t--track-editor-bg-noise-dim: #1a1a1a;\n\t\t\t--track-editor-bg-mod: #262626;\n\t\t\t--track-editor-bg-mod-dim: #1a1a1a;\n\t\t\t--multiplicative-mod-slider: #808080;\n\t\t\t--overwriting-mod-slider: #808080;\n\t\t\t--indicator-primary: #808080;\n\t\t\t--indicator-secondary: #333333;\n\t\t\t--select2-opt-group: #232323;\n\t\t\t--input-box-outline: #222;\n\t\t\t--mute-button-normal: #808080;\n\t\t\t--mute-button-mod: #808080;\n\t\t\t--mod-label-primary: #232323;\n\t\t\t--mod-label-secondary-text: #696969;\n\t\t\t--mod-label-primary-text: #cdcdcd;\n\t\t\t--pitch-secondary-channel-hue: 208;\n\t\t\t--pitch-secondary-channel-hue-scale: 10;\n\t\t\t--pitch-secondary-channel-sat: 100;\n\t\t\t--pitch-secondary-channel-sat-scale: 0;\n\t\t\t--pitch-secondary-channel-lum: 88;\n\t\t\t--pitch-secondary-channel-lum-scale: 0;\n\t\t\t--pitch-primary-channel-hue: 207;\n\t\t\t--pitch-primary-channel-hue-scale: 10;\n\t\t\t--pitch-primary-channel-sat: 100;\n\t\t\t--pitch-primary-channel-sat-scale: 0;\n\t\t\t--pitch-primary-channel-lum: 910;\n\t\t\t--pitch-primary-channel-lum-scale: 0;\n\t\t\t--pitch-secondary-note-hue: 208;\n\t\t\t--pitch-secondary-note-hue-scale: 10;\n\t\t\t--pitch-secondary-note-sat: 100;\n\t\t\t--pitch-secondary-note-sat-scale: 0;\n\t\t\t--pitch-secondary-note-lum: 88;\n\t\t\t--pitch-secondary-note-lum-scale: 0;\n\t\t\t--pitch-primary-note-hue: 208;\n\t\t\t--pitch-primary-note-hue-scale: 10;\n\t\t\t--pitch-primary-note-sat: 100;\n\t\t\t--pitch-primary-note-sat-scale: 0;\n\t\t\t--pitch-primary-note-lum: 910;\n\t\t\t--pitch-primary-note-lum-scale: 0;\n\t\t\t--noise-secondary-channel-hue: 328;\n\t\t\t--noise-secondary-channel-hue-scale: 10;\n\t\t\t--noise-secondary-channel-sat: 100;\n\t\t\t--noise-secondary-channel-sat-scale: 0;\n\t\t\t--noise-secondary-channel-lum: 88;\n\t\t\t--noise-secondary-channel-lum-scale: 0;\n\t\t\t--noise-primary-channel-hue: 327;\n\t\t\t--noise-primary-channel-hue-scale: 10;\n\t\t\t--noise-primary-channel-sat: 100;\n\t\t\t--noise-primary-channel-sat-scale: 0;\n\t\t\t--noise-primary-channel-lum: 910;\n\t\t\t--noise-primary-channel-lum-scale: 0;\n\t\t\t--noise-secondary-note-hue: 328;\n\t\t\t--noise-secondary-note-hue-scale: 10;\n\t\t\t--noise-secondary-note-sat: 100;\n\t\t\t--noise-secondary-note-sat-scale: 0;\n\t\t\t--noise-secondary-note-lum: 88;\n\t\t\t--noise-secondary-note-lum-scale: 0;\n\t\t\t--noise-primary-note-hue: 327;\n\t\t\t--noise-primary-note-hue-scale: 10;\n\t\t\t--noise-primary-note-sat: 100;\n\t\t\t--noise-primary-note-sat-scale: 0;\n\t\t\t--noise-primary-note-lum: 910;\n\t\t\t--noise-primary-note-lum-scale: 0;\n\t\t\t--mod-secondary-channel-hue: 87;\n\t\t\t--mod-secondary-channel-hue-scale: 10;\n\t\t\t--mod-secondary-channel-sat: 100;\n\t\t\t--mod-secondary-channel-sat-scale: 0;\n\t\t\t--mod-secondary-channel-lum: 88;\n\t\t\t--mod-secondary-channel-lum-scale: 0;\n\t\t\t--mod-primary-channel-hue: 88;\n\t\t\t--mod-primary-channel-hue-scale: 10;\n\t\t\t--mod-primary-channel-sat: 100;\n\t\t\t--mod-primary-channel-sat-scale: 0;\n\t\t\t--mod-primary-channel-lum: 910;\n\t\t\t--mod-primary-channel-lum-scale: 0;\n\t\t\t--mod-secondary-note-hue: 87;\n\t\t\t--mod-secondary-note-hue-scale: 10;\n\t\t\t--mod-secondary-note-sat: 100;\n\t\t\t--mod-secondary-note-sat-scale: 0;\n\t\t\t--mod-secondary-note-lum: 88;\n\t\t\t--mod-secondary-note-lum-scale: 0;\n\t\t\t--mod-primary-note-hue: 88;\n\t\t\t--mod-primary-note-hue-scale: 10;\n\t\t\t--mod-primary-note-sat: 100;\n\t\t\t--mod-primary-note-sat-scale: 0;\n\t\t\t--mod-primary-note-lum: 910;\n\t\t\t--mod-primary-note-lum-scale: 0;\n\t\t\t--disabled-note-primary: #c6c6c6;\n\t\t\t--disabled-note-secondary: #8c8c8c;\n\t\t}",
      blutonium:
        ":root {\n\t\t\t--page-margin: #02070D;\n\t\t\t--editor-background: #02070D;\n\t\t\t--hover-preview: white;\n\t\t\t--playhead: white;\n\t\t\t--primary-text: #9bd1ee;\n\t\t\t--secondary-text: #5a6da8;\n\t\t\t--inverted-text: black;\n\t\t\t--text-selection: rgb(68 68 255 / 99%);\n\t\t\t--box-selection-fill: rgb(0 0 255 / 30%);\n\t\t\t--loop-accent: #024aca;\n\t\t\t--link-accent: #024aca;\n\t\t\t--ui-widget-background: #161c2e;\n\t\t\t--ui-widget-focus: #262c3e;\n\t\t\t--pitch-background: #22272D;\n\t\t\t--tonic: #1b3056;\n\t\t\t--fifth-note: #344051;\n\t\t\t--white-piano-key: #a6c6ed;\n\t\t\t--black-piano-key: #2f4687;\n\t\t\t--use-color-formula: false;\n\t\t\t--track-editor-bg-pitch: #25284c;\n\t\t\t--track-editor-bg-pitch-dim: #211c26;\n\t\t\t--track-editor-bg-noise: #261f42;\n\t\t\t--track-editor-bg-noise-dim: #1a152d;\n\t\t\t--track-editor-bg-mod: #183049;\n\t\t\t--track-editor-bg-mod-dim: #102132;\n\t\t\t--multiplicative-mod-slider: #344a7f;\n\t\t\t--overwriting-mod-slider: #344a7f;\n\t\t\t--indicator-primary: #024aca;\n\t\t\t--indicator-secondary: #00177d;\n\t\t\t--select2-opt-group: #141e34;\n\t\t\t--input-box-outline: #141e34;\n\t\t\t--mute-button-normal: #273b9d;\n\t\t\t--mute-button-mod: #27989d;\n\t\t\t--pitch1-secondary-channel: hsl(200, 100%, 40%);\n\t\t\t--pitch1-primary-channel: #99ddff;\n\t\t\t--pitch1-secondary-note: hsl(200, 100%, 40%);\n\t\t\t--pitch1-primary-note: #99ddff;\n\t\t\t--pitch2-secondary-channel: \thsl(212, 100%, 34%);\n\t\t\t--pitch2-primary-channel: #5BA8FF;\n\t\t\t--pitch2-secondary-note: hsl(212, 100%, 34%);\n\t\t\t--pitch2-primary-note: #5BA8FF;\n\t\t\t--pitch3-secondary-channel: #024ACA;\n\t\t\t--pitch3-primary-channel: #0A89FF;\n\t\t\t--pitch3-secondary-note: #024ACA;\n\t\t\t--pitch3-primary-note: #0A89FF;\n\t\t\t--pitch4-secondary-channel: #00177D;\n\t\t\t--pitch4-primary-channel: #024ACA;\n\t\t\t--pitch4-secondary-note: #00177D;\n\t\t\t--pitch4-primary-note: #024ACA;\n\t\t\t--pitch5-secondary-channel: #000e4e;\n\t\t\t--pitch5-primary-channel: #0023bf;\n\t\t\t--pitch5-secondary-note: #000e4e;\n\t\t\t--pitch5-primary-note: #0023bf;\n\t\t\t--pitch6-secondary-channel: #8990FE;\n\t\t\t--pitch6-primary-channel: #C2C6FF;\n\t\t\t--pitch6-secondary-note: #8990FE;\n\t\t\t--pitch6-primary-note: #C2C6FF;\n\t\t\t--pitch7-secondary-channel: #5E65D3;\n\t\t\t--pitch7-primary-channel: #8990FE;\n\t\t\t--pitch7-secondary-note: #5E65D3;\n\t\t\t--pitch7-primary-note: #8990FE;\n\t\t\t--pitch8-secondary-channel: #3138A6;\n\t\t\t--pitch8-primary-channel: #5E65D3;\n\t\t\t--pitch8-secondary-note: #3138A6;\n\t\t\t--pitch8-primary-note: #5E65D3;\n\t\t\t--pitch9-secondary-channel: #1B0B7F;\n\t\t\t--pitch9-primary-channel: #3138A6;\n\t\t\t--pitch9-secondary-note: #1B0B7F;\n\t\t\t--pitch9-primary-note: #3138A6;\n\t\t\t--pitch10-secondary-channel: #13015D;\n\t\t\t--pitch10-primary-channel: #1c02bd;\n\t\t\t--pitch10-secondary-note: #13015D;\n\t\t\t--pitch10-primary-note: #1c02bd;\n\t\t\t--noise1-secondary-channel: #A675FE;\n\t\t\t--noise1-primary-channel: #E2C9FF;\n\t\t\t--noise1-secondary-note: #A675FE;\n\t\t\t--noise1-primary-note: #E2C9FF;\n\t\t\t--noise2-secondary-channel: #6A31CA;\n\t\t\t--noise2-primary-channel: #A675FE;\n\t\t\t--noise2-secondary-note: #6A31CA;\n\t\t\t--noise2-primary-note: #A675FE;\n\t\t\t--noise3-secondary-channel: #5A1991;\n\t\t\t--noise3-primary-channel: #6A31CA;\n\t\t\t--noise3-secondary-note: #5A1991;\n\t\t\t--noise3-primary-note: #6A31CA;\n\t\t\t--noise4-secondary-channel: #2f1a68;\n\t\t\t--noise4-primary-channel: #5A1991;\n\t\t\t--noise4-secondary-note: #2f1a68;\n\t\t\t--noise4-primary-note: #5A1991;\n\t\t\t--noise5-secondary-channel: #211640;\n\t\t\t--noise5-primary-channel: #391b8d;\n\t\t\t--noise5-secondary-note: #211640;\n\t\t\t--noise5-primary-note: #391b8d;\n\t\t\t--mod1-secondary-channel: #25E2CD;\n\t\t\t--mod1-primary-channel: #BDFFCA;\n\t\t\t--mod1-secondary-note: #25E2CD;\n\t\t\t--mod1-primary-note: #BDFFCA;\n\t\t\t--mod2-secondary-channel: #0A98AC;\n\t\t\t--mod2-primary-channel: #25E2CD;\n\t\t\t--mod2-secondary-note: #0A98AC;\n\t\t\t--mod2-primary-note: #25E2CC;\n\t\t\t--mod3-secondary-channel: #005280;\n\t\t\t--mod3-primary-channel: #0A98AC;\n\t\t\t--mod3-secondary-note: #005280;\n\t\t\t--mod3-primary-note: #0A98AC;\n\t\t\t--mod4-secondary-channel: #0f3670;\n\t\t\t--mod4-primary-channel: #1369c1;\n\t\t\t--mod4-secondary-note: #0f3670;\n\t\t\t--mod4-primary-note: #1369c1;\n\t\t\t--mod-label-primary: #191d26;\n\t\t\t--mod-label-secondary-text: #024aca;\n\t\t\t--mod-label-primary-text: #ffffffa6;\n\t\t\t--disabled-note-primary: #c9c9c9;\n\t\t\t--disabled-note-secondary: #616161;\n\t}",
    }),
    (V.pageMargin = "var(--page-margin)"),
    (V.editorBackground = "var(--editor-background)"),
    (V.hoverPreview = "var(--hover-preview)"),
    (V.playhead = "var(--playhead)"),
    (V.primaryText = "var(--primary-text)"),
    (V.secondaryText = "var(--secondary-text)"),
    (V.invertedText = "var(--inverted-text)"),
    (V.textSelection = "var(--text-selection)"),
    (V.boxSelectionFill = "var(--box-selection-fill)"),
    (V.loopAccent = "var(--loop-accent)"),
    (V.linkAccent = "var(--link-accent)"),
    (V.uiWidgetBackground = "var(--ui-widget-background)"),
    (V.uiWidgetFocus = "var(--ui-widget-focus)"),
    (V.pitchBackground = "var(--pitch-background)"),
    (V.tonic = "var(--tonic)"),
    (V.fifthNote = "var(--fifth-note)"),
    (V.whitePianoKey = "var(--white-piano-key)"),
    (V.blackPianoKey = "var(--black-piano-key)"),
    (V.useColorFormula = "var(--use-color-formula)"),
    (V.pitchSecondaryChannelHue = "var(--pitch-secondary-channel-hue)"),
    (V.pitchSecondaryChannelHueScale =
      "var(--pitch-secondary-channel-hue-scale)"),
    (V.pitchSecondaryChannelSat = "var(--pitch-secondary-channel-sat)"),
    (V.pitchSecondaryChannelSatScale =
      "var(--pitch-secondary-channel-sat-scale)"),
    (V.pitchSecondaryChannelLum = "var(--pitch-secondary-channel-lum)"),
    (V.pitchSecondaryChannelLumScale =
      "var(--pitch-secondary-channel-lum-scale)"),
    (V.pitchPrimaryChannelHue = "var(--pitch-primary-channel-hue)"),
    (V.pitchPrimaryChannelHueScale = "var(--pitch-primary-channel-hue-scale)"),
    (V.pitchPrimaryChannelSat = "var(--pitch-primary-channel-sat)"),
    (V.pitchPrimaryChannelSatScale = "var(--pitch-primary-channel-sat-scale)"),
    (V.pitchPrimaryChannelLum = "var(--pitch-primary-channel-lum)"),
    (V.pitchPrimaryChannelLumScale = "var(--pitch-primary-channel-lum-scale)"),
    (V.pitchSecondaryNoteHue = "var(--pitch-secondary-note-hue)"),
    (V.pitchSecondaryNoteHueScale = "var(--pitch-secondary-note-hue-scale)"),
    (V.pitchSecondaryNoteSat = "var(--pitch-secondary-note-sat)"),
    (V.pitchSecondaryNoteSatScale = "var(--pitch-secondary-note-sat-scale)"),
    (V.pitchSecondaryNoteLum = "var(--pitch-secondary-note-lum)"),
    (V.pitchSecondaryNoteLumScale = "var(--pitch-secondary-note-lum-scale)"),
    (V.pitchPrimaryNoteHue = "var(--pitch-primary-note-hue)"),
    (V.pitchPrimaryNoteHueScale = "var(--pitch-primary-note-hue-scale)"),
    (V.pitchPrimaryNoteSat = "var(--pitch-primary-note-sat)"),
    (V.pitchPrimaryNoteSatScale = "var(--pitch-primary-note-sat-scale)"),
    (V.pitchPrimaryNoteLum = "var(--pitch-primary-note-lum)"),
    (V.pitchPrimaryNoteLumScale = "var(--pitch-primary-note-lum-scale)"),
    (V.modSecondaryChannelHue = "var(--mod-secondary-channel-hue)"),
    (V.modSecondaryChannelHueScale = "var(--mod-secondary-channel-hue-scale)"),
    (V.modSecondaryChannelSat = "var(--mod-secondary-channel-sat)"),
    (V.modSecondaryChannelSatScale = "var(--mod-secondary-channel-sat-scale)"),
    (V.modSecondaryChannelLum = "var(--mod-secondary-channel-lum)"),
    (V.modSecondaryChannelLumScale = "var(--mod-secondary-channel-lum-scale)"),
    (V.modPrimaryChannelHue = "var(--mod-primary-channel-hue)"),
    (V.modPrimaryChannelHueScale = "var(--mod-primary-channel-hue-scale)"),
    (V.modPrimaryChannelSat = "var(--mod-primary-channel-sat)"),
    (V.modPrimaryChannelSatScale = "var(--mod-primary-channel-sat-scale)"),
    (V.modPrimaryChannelLum = "var(--mod-primary-channel-lum)"),
    (V.modPrimaryChannelLumScale = "var(--mod-primary-channel-lum-scale)"),
    (V.modSecondaryNoteHue = "var(--mod-secondary-note-hue)"),
    (V.modSecondaryNoteHueScale = "var(--mod-secondary-note-hue-scale)"),
    (V.modSecondaryNoteSat = "var(--mod-secondary-note-sat)"),
    (V.modSecondaryNoteSatScale = "var(--mod-secondary-note-sat-scale)"),
    (V.modSecondaryNoteLum = "var(--mod-secondary-note-lum)"),
    (V.modSecondaryNoteLumScale = "var(--mod-secondary-note-lum-scale)"),
    (V.modPrimaryNoteHue = "var(--mod-primary-note-hue)"),
    (V.modPrimaryNoteHueScale = "var(--mod-primary-note-hue-scale)"),
    (V.modPrimaryNoteSat = "var(--mod-primary-note-sat)"),
    (V.modPrimaryNoteSatScale = "var(--mod-primary-note-sat-scale)"),
    (V.modPrimaryNoteLum = "var(--mod-primary-note-lum)"),
    (V.modPrimaryNoteLumScale = "var(--mod-primary-note-lum-scale)"),
    (V.noiseSecondaryChannelHue = "var(--noise-secondary-channel-hue)"),
    (V.noiseSecondaryChannelHueScale =
      "var(--noise-secondary-channel-hue-scale)"),
    (V.noiseSecondaryChannelSat = "var(--noise-secondary-channel-sat)"),
    (V.noiseSecondaryChannelSatScale =
      "var(--noise-secondary-channel-sat-scale)"),
    (V.noiseSecondaryChannelLum = "var(--noise-secondary-channel-lum)"),
    (V.noiseSecondaryChannelLumScale =
      "var(--noise-secondary-channel-lum-scale)"),
    (V.noisePrimaryChannelHue = "var(--noise-primary-channel-hue)"),
    (V.noisePrimaryChannelHueScale = "var(--noise-primary-channel-hue-scale)"),
    (V.noisePrimaryChannelSat = "var(--noise-primary-channel-sat)"),
    (V.noisePrimaryChannelSatScale = "var(--noise-primary-channel-sat-scale)"),
    (V.noisePrimaryChannelLum = "var(--noise-primary-channel-lum)"),
    (V.noisePrimaryChannelLumScale = "var(--noise-primary-channel-lum-scale)"),
    (V.noiseSecondaryNoteHue = "var(--noise-secondary-note-hue)"),
    (V.noiseSecondaryNoteHueScale = "var(--noise-secondary-note-hue-scale)"),
    (V.noiseSecondaryNoteSat = "var(--noise-secondary-note-sat)"),
    (V.noiseSecondaryNoteSatScale = "var(--noise-secondary-note-sat-scale)"),
    (V.noiseSecondaryNoteLum = "var(--noise-secondary-note-lum)"),
    (V.noiseSecondaryNoteLumScale = "var(--noise-secondary-note-lum-scale)"),
    (V.noisePrimaryNoteHue = "var(--noise-primary-note-hue)"),
    (V.noisePrimaryNoteHueScale = "var(--noise-primary-note-hue-scale)"),
    (V.noisePrimaryNoteSat = "var(--noise-primary-note-sat)"),
    (V.noisePrimaryNoteSatScale = "var(--noise-primary-note-sat-scale)"),
    (V.noisePrimaryNoteLum = "var(--noise-primary-note-lum)"),
    (V.noisePrimaryNoteLumScale = "var(--noise-primary-note-lum-scale)"),
    (V.trackEditorBgPitch = "var(--track-editor-bg-pitch)"),
    (V.trackEditorBgPitchDim = "var(--track-editor-bg-pitch-dim)"),
    (V.trackEditorBgNoise = "var(--track-editor-bg-noise)"),
    (V.trackEditorBgNoiseDim = "var(--track-editor-bg-noise-dim)"),
    (V.trackEditorBgMod = "var(--track-editor-bg-mod)"),
    (V.trackEditorBgModDim = "var(--track-editor-bg-mod-dim)"),
    (V.multiplicativeModSlider = "var(--multiplicative-mod-slider)"),
    (V.overwritingModSlider = "var(--overwriting-mod-slider)"),
    (V.indicatorPrimary = "var(--indicator-primary)"),
    (V.indicatorSecondary = "var(--indicator-secondary)"),
    (V.select2OptGroup = "var(--select2-opt-group)"),
    (V.inputBoxOutline = "var(--input-box-outline)"),
    (V.muteButtonNormal = "var(--mute-button-normal)"),
    (V.muteButtonMod = "var(--mute-button-mod)"),
    (V.modLabelPrimary = "var(--mod-label-primary)"),
    (V.modLabelSecondaryText = "var(--mod-label-secondary-text)"),
    (V.modLabelPrimaryText = "var(--mod-label-primary-text)"),
    (V.disabledNotePrimary = "var(--disabled-note-primary)"),
    (V.disabledNoteSecondary = "var(--disabled-note-secondary)"),
    (V.c_pitchSecondaryChannelHue = 0),
    (V.c_pitchSecondaryChannelHueScale = 0),
    (V.c_pitchSecondaryChannelSat = 0),
    (V.c_pitchSecondaryChannelSatScale = 0),
    (V.c_pitchSecondaryChannelLum = 0),
    (V.c_pitchSecondaryChannelLumScale = 0),
    (V.c_pitchPrimaryChannelHue = 0),
    (V.c_pitchPrimaryChannelHueScale = 0),
    (V.c_pitchPrimaryChannelSat = 0),
    (V.c_pitchPrimaryChannelSatScale = 0),
    (V.c_pitchPrimaryChannelLum = 0),
    (V.c_pitchPrimaryChannelLumScale = 0),
    (V.c_pitchSecondaryNoteHue = 0),
    (V.c_pitchSecondaryNoteHueScale = 0),
    (V.c_pitchSecondaryNoteSat = 0),
    (V.c_pitchSecondaryNoteSatScale = 0),
    (V.c_pitchSecondaryNoteLum = 0),
    (V.c_pitchSecondaryNoteLumScale = 0),
    (V.c_pitchPrimaryNoteHue = 0),
    (V.c_pitchPrimaryNoteHueScale = 0),
    (V.c_pitchPrimaryNoteSat = 0),
    (V.c_pitchPrimaryNoteSatScale = 0),
    (V.c_pitchPrimaryNoteLum = 0),
    (V.c_pitchPrimaryNoteLumScale = 0),
    (V.c_modSecondaryChannelHue = 0),
    (V.c_modSecondaryChannelHueScale = 0),
    (V.c_modSecondaryChannelSat = 0),
    (V.c_modSecondaryChannelSatScale = 0),
    (V.c_modSecondaryChannelLum = 0),
    (V.c_modSecondaryChannelLumScale = 0),
    (V.c_modPrimaryChannelHue = 0),
    (V.c_modPrimaryChannelHueScale = 0),
    (V.c_modPrimaryChannelSat = 0),
    (V.c_modPrimaryChannelSatScale = 0),
    (V.c_modPrimaryChannelLum = 0),
    (V.c_modPrimaryChannelLumScale = 0),
    (V.c_modSecondaryNoteHue = 0),
    (V.c_modSecondaryNoteHueScale = 0),
    (V.c_modSecondaryNoteSat = 0),
    (V.c_modSecondaryNoteSatScale = 0),
    (V.c_modSecondaryNoteLum = 0),
    (V.c_modSecondaryNoteLumScale = 0),
    (V.c_modPrimaryNoteHue = 0),
    (V.c_modPrimaryNoteHueScale = 0),
    (V.c_modPrimaryNoteSat = 0),
    (V.c_modPrimaryNoteSatScale = 0),
    (V.c_modPrimaryNoteLum = 0),
    (V.c_modPrimaryNoteLumScale = 0),
    (V.c_noiseSecondaryChannelHue = 0),
    (V.c_noiseSecondaryChannelHueScale = 0),
    (V.c_noiseSecondaryChannelSat = 0),
    (V.c_noiseSecondaryChannelSatScale = 0),
    (V.c_noiseSecondaryChannelLum = 0),
    (V.c_noiseSecondaryChannelLumScale = 0),
    (V.c_noisePrimaryChannelHue = 0),
    (V.c_noisePrimaryChannelHueScale = 0),
    (V.c_noisePrimaryChannelSat = 0),
    (V.c_noisePrimaryChannelSatScale = 0),
    (V.c_noisePrimaryChannelLum = 0),
    (V.c_noisePrimaryChannelLumScale = 0),
    (V.c_noiseSecondaryNoteHue = 0),
    (V.c_noiseSecondaryNoteHueScale = 0),
    (V.c_noiseSecondaryNoteSat = 0),
    (V.c_noiseSecondaryNoteSatScale = 0),
    (V.c_noiseSecondaryNoteLum = 0),
    (V.c_noiseSecondaryNoteLumScale = 0),
    (V.c_noisePrimaryNoteHue = 0),
    (V.c_noisePrimaryNoteHueScale = 0),
    (V.c_noisePrimaryNoteSat = 0),
    (V.c_noisePrimaryNoteSatScale = 0),
    (V.c_noisePrimaryNoteLum = 0),
    (V.c_noisePrimaryNoteLumScale = 0),
    (V.c_invertedText = ""),
    (V.c_trackEditorBgNoiseDim = ""),
    (V.c_trackEditorBgNoise = ""),
    (V.c_trackEditorBgModDim = ""),
    (V.c_trackEditorBgMod = ""),
    (V.c_trackEditorBgPitchDim = ""),
    (V.c_trackEditorBgPitch = ""),
    (V.pitchChannels = p([
      {
        name: "pitch1",
        secondaryChannel: "var(--pitch1-secondary-channel)",
        primaryChannel: "var(--pitch1-primary-channel)",
        secondaryNote: "var(--pitch1-secondary-note)",
        primaryNote: "var(--pitch1-primary-note)",
      },
      {
        name: "pitch2",
        secondaryChannel: "var(--pitch2-secondary-channel)",
        primaryChannel: "var(--pitch2-primary-channel)",
        secondaryNote: "var(--pitch2-secondary-note)",
        primaryNote: "var(--pitch2-primary-note)",
      },
      {
        name: "pitch3",
        secondaryChannel: "var(--pitch3-secondary-channel)",
        primaryChannel: "var(--pitch3-primary-channel)",
        secondaryNote: "var(--pitch3-secondary-note)",
        primaryNote: "var(--pitch3-primary-note)",
      },
      {
        name: "pitch4",
        secondaryChannel: "var(--pitch4-secondary-channel)",
        primaryChannel: "var(--pitch4-primary-channel)",
        secondaryNote: "var(--pitch4-secondary-note)",
        primaryNote: "var(--pitch4-primary-note)",
      },
      {
        name: "pitch5",
        secondaryChannel: "var(--pitch5-secondary-channel)",
        primaryChannel: "var(--pitch5-primary-channel)",
        secondaryNote: "var(--pitch5-secondary-note)",
        primaryNote: "var(--pitch5-primary-note)",
      },
      {
        name: "pitch6",
        secondaryChannel: "var(--pitch6-secondary-channel)",
        primaryChannel: "var(--pitch6-primary-channel)",
        secondaryNote: "var(--pitch6-secondary-note)",
        primaryNote: "var(--pitch6-primary-note)",
      },
      {
        name: "pitch7",
        secondaryChannel: "var(--pitch7-secondary-channel)",
        primaryChannel: "var(--pitch7-primary-channel)",
        secondaryNote: "var(--pitch7-secondary-note)",
        primaryNote: "var(--pitch7-primary-note)",
      },
      {
        name: "pitch8",
        secondaryChannel: "var(--pitch8-secondary-channel)",
        primaryChannel: "var(--pitch8-primary-channel)",
        secondaryNote: "var(--pitch8-secondary-note)",
        primaryNote: "var(--pitch8-primary-note)",
      },
      {
        name: "pitch9",
        secondaryChannel: "var(--pitch9-secondary-channel)",
        primaryChannel: "var(--pitch9-primary-channel)",
        secondaryNote: "var(--pitch9-secondary-note)",
        primaryNote: "var(--pitch9-primary-note)",
      },
      {
        name: "pitch10",
        secondaryChannel: "var(--pitch10-secondary-channel)",
        primaryChannel: "var(--pitch10-primary-channel)",
        secondaryNote: "var(--pitch10-secondary-note)",
        primaryNote: "var(--pitch10-primary-note)",
      },
    ])),
    (V.noiseChannels = p([
      {
        name: "noise1",
        secondaryChannel: "var(--noise1-secondary-channel)",
        primaryChannel: "var(--noise1-primary-channel)",
        secondaryNote: "var(--noise1-secondary-note)",
        primaryNote: "var(--noise1-primary-note)",
      },
      {
        name: "noise2",
        secondaryChannel: "var(--noise2-secondary-channel)",
        primaryChannel: "var(--noise2-primary-channel)",
        secondaryNote: "var(--noise2-secondary-note)",
        primaryNote: "var(--noise2-primary-note)",
      },
      {
        name: "noise3",
        secondaryChannel: "var(--noise3-secondary-channel)",
        primaryChannel: "var(--noise3-primary-channel)",
        secondaryNote: "var(--noise3-secondary-note)",
        primaryNote: "var(--noise3-primary-note)",
      },
      {
        name: "noise4",
        secondaryChannel: "var(--noise4-secondary-channel)",
        primaryChannel: "var(--noise4-primary-channel)",
        secondaryNote: "var(--noise4-secondary-note)",
        primaryNote: "var(--noise4-primary-note)",
      },
      {
        name: "noise5",
        secondaryChannel: "var(--noise5-secondary-channel)",
        primaryChannel: "var(--noise5-primary-channel)",
        secondaryNote: "var(--noise5-secondary-note)",
        primaryNote: "var(--noise5-primary-note)",
      },
    ])),
    (V.modChannels = p([
      {
        name: "mod1",
        secondaryChannel: "var(--mod1-secondary-channel)",
        primaryChannel: "var(--mod1-primary-channel)",
        secondaryNote: "var(--mod1-secondary-note)",
        primaryNote: "var(--mod1-primary-note)",
      },
      {
        name: "mod2",
        secondaryChannel: "var(--mod2-secondary-channel)",
        primaryChannel: "var(--mod2-primary-channel)",
        secondaryNote: "var(--mod2-secondary-note)",
        primaryNote: "var(--mod2-primary-note)",
      },
      {
        name: "mod3",
        secondaryChannel: "var(--mod3-secondary-channel)",
        primaryChannel: "var(--mod3-primary-channel)",
        secondaryNote: "var(--mod3-secondary-note)",
        primaryNote: "var(--mod3-primary-note)",
      },
      {
        name: "mod4",
        secondaryChannel: "var(--mod4-secondary-channel)",
        primaryChannel: "var(--mod4-primary-channel)",
        secondaryNote: "var(--mod4-secondary-note)",
        primaryNote: "var(--mod4-primary-note)",
      },
    ])),
    (V.l = document.head.appendChild(O.style({ type: "text/css" }))),
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|android|ipad|playbook|silk/i.test(
      navigator.userAgent
    );
  class $ {
    static valueToPreset(t) {
      const e = t >> 6,
        n = 63 & t;
      return $.presetCategories[e].presets[n];
    }
    static midiProgramToPresetValue(t) {
      for (let e = 0; e < $.presetCategories.length; e++) {
        const n = $.presetCategories[e];
        for (let i = 0; i < n.presets.length; i++) {
          const a = n.presets[i];
          if (a.generalMidi && a.midiProgram == t) return (e << 6) + i;
        }
      }
      return null;
    }
    static nameToPresetValue(t) {
      for (let e = 0; e < $.presetCategories.length; e++) {
        const n = $.presetCategories[e];
        for (let i = 0; i < n.presets.length; i++) {
          if (n.presets[i].name == t) return (e << 6) + i;
        }
      }
      return null;
    }
  }
  function W(t, e) {
    for (let n = 0; n < t.length; n++) t[n] *= e;
  }
  function j(t) {
    if (
      !(function (t) {
        return !(!t || t & (t - 1));
      })(t)
    )
      throw new Error("FFT array length must be a power of 2.");
    return Math.round(Math.log(t) / Math.log(2));
  }
  function U(t, e) {
    const n = j(e);
    if (e < 4) throw new Error("FFT array length must be at least 4.");
    for (let i = n - 1; i >= 2; i--) {
      const n = 1 << i,
        a = n >> 1,
        r = n << 1,
        o = (2 * Math.PI) / r,
        s = Math.cos(o),
        l = Math.sin(o),
        c = 2 * s;
      for (let i = 0; i < e; i += r) {
        const e = i,
          r = e + a,
          o = e + n,
          h = o + a,
          p = o + n,
          d = t[e],
          m = t[o];
        (t[e] = d + m), (t[r] *= 2), (t[o] = d - m), (t[h] *= 2);
        let u = s,
          f = -l,
          y = 1,
          b = 0;
        for (let n = 1; n < a; n++) {
          const i = e + n,
            a = o - n,
            r = o + n,
            s = p - n,
            l = t[i],
            h = t[a],
            d = t[r],
            m = t[s],
            g = l - h,
            v = d + m;
          (t[i] = l + h),
            (t[a] = m - d),
            (t[r] = g * u - v * f),
            (t[s] = v * u + g * f);
          const k = c * u - y,
            w = c * f - b;
          (y = u), (b = f), (u = k), (f = w);
        }
      }
    }
    for (let n = 0; n < e; n += 4) {
      const e = n + 1,
        i = n + 2,
        a = n + 3,
        r = t[n],
        o = 2 * t[e],
        s = t[i],
        l = 2 * t[a],
        c = r + s,
        h = r - s;
      (t[n] = c + o), (t[e] = c - o), (t[i] = h + l), (t[a] = h - l);
    }
    !(function (t, e) {
      const n = j(e);
      if (n > 16)
        throw new Error("FFT array length must not be greater than 2^16.");
      const i = 16 - n;
      for (let n = 0; n < e; n++) {
        let e;
        if (
          ((e = ((43690 & n) >> 1) | ((21845 & n) << 1)),
          (e = ((52428 & e) >> 2) | ((13107 & e) << 2)),
          (e = ((61680 & e) >> 4) | ((3855 & e) << 4)),
          (e = ((e >> 8) | ((255 & e) << 8)) >> i),
          e > n)
        ) {
          let i = t[n];
          (t[n] = t[e]), (t[e] = i);
        }
      }
    })(t, e);
  }
  ($.version = "2.6"),
    ($.versionDisplayName = "GoofyBox " + $.version),
    ($.releaseNotesURL =
      "https://jummbus.bitbucket.io/patch_notes/" + $.version + ".html"),
    ($.isOnMac =
      /^Mac/i.test(navigator.platform) ||
      /Mac OS X/i.test(navigator.userAgent) ||
      /^(iPhone|iPad|iPod)/i.test(navigator.platform) ||
      /(iPhone|iPad|iPod)/i.test(navigator.userAgent)),
    ($.ctrlSymbol = $.isOnMac ? "⌘" : "Ctrl+"),
    ($.ctrlName = $.isOnMac ? "command" : "control"),
    ($.presetCategories = p([
      {
        name: "Custom Instruments",
        presets: p([
          { name: "chip wave", customType: 0 },
          { name: "FM (expert)", customType: 1 },
          { name: "basic noise", customType: 2 },
          { name: "spectrum", customType: 3 },
          { name: "drumset", customType: 4 },
          { name: "harmonics", customType: 5 },
          { name: "pulse width", customType: 6 },
          { name: "picked string", customType: 7 },
          { name: "supersaw", customType: 8 },
          { name: "custom chip", customType: 9 },
        ]),
      },
      {
        name: "Retro Presets",
        presets: p([
          {
            name: "square wave",
            midiProgram: 80,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["aliasing"],
              transition: "interrupt",
              fadeInSeconds: 0,
              fadeOutTicks: -1,
              chord: "arpeggio",
              wave: "square",
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "triangle wave",
            midiProgram: 71,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["aliasing"],
              transition: "interrupt",
              fadeInSeconds: 0,
              fadeOutTicks: -1,
              chord: "arpeggio",
              wave: "triangle",
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "square lead",
            midiProgram: 80,
            generalMidi: !0,
            settings: {
              type: "chip",
              eqFilter: [
                { type: "low-pass", cutoffHz: 8e3, linearGain: 0.3536 },
              ],
              effects: ["aliasing"],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "simultaneous",
              wave: "square",
              unison: "hum",
              envelopes: [],
            },
          },
          {
            name: "sawtooth lead 1",
            midiProgram: 81,
            generalMidi: !0,
            settings: {
              type: "chip",
              eqFilter: [{ type: "low-pass", cutoffHz: 4e3, linearGain: 0.5 }],
              effects: ["aliasing"],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "simultaneous",
              wave: "sawtooth",
              unison: "shimmer",
              envelopes: [],
            },
          },
          {
            name: "sawtooth lead 2",
            midiProgram: 81,
            settings: {
              type: "chip",
              eqFilter: [
                { type: "low-pass", cutoffHz: 6727.17, linearGain: 1 },
              ],
              effects: ["vibrato", "aliasing"],
              vibrato: "light",
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 72,
              chord: "simultaneous",
              wave: "sawtooth",
              unison: "hum",
              envelopes: [],
            },
          },
          {
            name: "chip noise",
            midiProgram: 116,
            isNoise: !0,
            settings: {
              type: "noise",
              transition: "hard",
              effects: ["aliasing"],
              chord: "arpeggio",
              filterCutoffHz: 4e3,
              filterResonance: 0,
              filterEnvelope: "steady",
              wave: "retro",
            },
          },
          {
            name: "FM twang",
            midiProgram: 32,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "simultaneous",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "1×", amplitude: 15 },
                { frequency: "1×", amplitude: 15 },
                { frequency: "1×", amplitude: 0 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "twang 2", index: 1 },
              ],
            },
          },
          {
            name: "FM bass",
            midiProgram: 36,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "custom interval",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "2×", amplitude: 11 },
                { frequency: "1×", amplitude: 7 },
                { frequency: "1×", amplitude: 9 },
                { frequency: "20×", amplitude: 3 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "twang 2", index: 1 },
                { target: "operatorAmplitude", envelope: "twang 3", index: 2 },
                { target: "operatorAmplitude", envelope: "twang 2", index: 3 },
              ],
            },
          },
          {
            name: "FM flute",
            midiProgram: 73,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0.0263,
              fadeOutTicks: -3,
              chord: "simultaneous",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "1×", amplitude: 15 },
                { frequency: "1×", amplitude: 6 },
                { frequency: "1×", amplitude: 0 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "twang 2", index: 1 },
              ],
            },
          },
          {
            name: "FM organ",
            midiProgram: 16,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["vibrato"],
              vibrato: "delayed",
              transition: "normal",
              fadeInSeconds: 0.0263,
              fadeOutTicks: -3,
              chord: "custom interval",
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "1×", amplitude: 14 },
                { frequency: "2×", amplitude: 14 },
                { frequency: "1×", amplitude: 11 },
                { frequency: "2×", amplitude: 11 },
              ],
              envelopes: [],
            },
          },
          {
            name: "NES Pulse",
            midiProgram: 80,
            settings: {
              type: "custom chip",
              effects: ["aliasing"],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "arpeggio",
              eqFilter: [{ type: "low-pass", cutoffHz: 8e3, linearGain: 0.5 }],
              unison: "none",
              vibrato: "none",
              envelopes: [],
              customChipWave: [
                -24, -24, -24, -24, -23, -23, -23, -23, -22, -22, -22, -22, -21,
                -21, -21, -21, -20, -20, -20, -20, -19, -19, -19, -19, -18, -18,
                -18, -18, -17, -17, -17, -17, 24, 24, 24, 24, 23, 23, 23, 23,
                22, 22, 22, 22, 21, 21, 21, 21, 20, 20, 20, 20, 19, 19, 19, 19,
                18, 18, 18, 18, 17, 17, 17, 17,
              ],
            },
          },
          {
            name: "Gameboy Pulse",
            midiProgram: 80,
            settings: {
              type: "custom chip",
              effects: ["aliasing"],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "arpeggio",
              eqFilter: [{ type: "low-pass", cutoffHz: 8e3, linearGain: 0.5 }],
              unison: "none",
              envelopes: [],
              customChipWave: [
                -24, -20, -17, -15, -13, -13, -11, -11, -11, -9, -9, -9, -9, -7,
                -7, -7, -7, -7, -5, -5, -5, -5, -5, -5, -3, -3, -3, -3, -3, -3,
                -3, -3, 24, 20, 17, 15, 13, 13, 11, 11, 11, 9, 9, 9, 9, 7, 7, 7,
                7, 7, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3,
              ],
            },
          },
          {
            name: "VRC6 Sawtooth",
            midiProgram: 81,
            settings: {
              type: "custom chip",
              effects: ["aliasing"],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "arpeggio",
              eqFilter: [{ type: "low-pass", cutoffHz: 8e3, linearGain: 0.5 }],
              unison: "none",
              envelopes: [],
              customChipWave: [
                -24, -20, -16, -13, -10, -8, -6, -5, -4, -4, 0, 0, 0, 0, 4, 4,
                4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 12, 12, 12, 12, 12,
                12, 16, 16, 16, 16, 16, 16, 16, 16, 20, 20, 20, 20, 20, 20, 20,
                20, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
              ],
            },
          },
          {
            name: "Atari Square",
            midiProgram: 80,
            settings: {
              type: "custom chip",
              effects: ["aliasing"],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "arpeggio",
              eqFilter: [{ type: "low-pass", cutoffHz: 4e3, linearGain: 0.5 }],
              unison: "none",
              envelopes: [],
              customChipWave: [
                -24, -24, -24, -23, -23, -23, -22, -22, -22, -21, -21, -21, -20,
                -20, -20, -19, -19, -19, -18, -18, -18, -17, -17, -17, -16, -16,
                -16, -15, -15, -15, -14, -14, -14, -13, -13, -13, 24, 24, 24,
                23, 23, 23, 22, 22, 22, 21, 21, 21, 20, 20, 20, 19, 19, 19, 18,
                18, 18, 17, 17, 17, 16, 16, 15, 15,
              ],
            },
          },
          {
            name: "Atari Bass",
            midiProgram: 36,
            settings: {
              type: "custom chip",
              effects: ["aliasing"],
              transition: "interrupt",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "arpeggio",
              eqFilter: [{ type: "low-pass", cutoffHz: 4e3, linearGain: 0.5 }],
              unison: "none",
              envelopes: [],
              customChipWave: [
                -24, -24, -24, -24, -24, -24, -24, -24, -24, 24, 24, 24, 24, 24,
                24, -24, -24, -24, 24, 24, 24, -24, -24, -24, 24, 24, 24, -24,
                -24, -24, 24, 24, -24, -24, -24, -24, -24, -24, -24, -24, -24,
                24, 24, 24, 24, 24, 24, -24, -24, 24, 24, 24, 24, 24, -24, -24,
                -24, -24, 24, 24, -24, -24, 24, 24,
              ],
            },
          },
          {
            name: "Sunsoft Bass",
            midiProgram: 36,
            settings: {
              type: "custom chip",
              effects: ["aliasing"],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "arpeggio",
              eqFilter: [{ type: "low-pass", cutoffHz: 4e3, linearGain: 0.5 }],
              unison: "none",
              envelopes: [],
              customChipWave: [
                24, 24, 15, 15, 9, 9, -4, -4, 0, 0, -13, -13, -19, -19, -24,
                -24, -24, -24, -10, -10, 0, 0, -7, -7, -7, -7, 0, 0, 6, 6, -4,
                -4, 3, 3, -4, -4, 3, 3, 3, 3, 9, 9, 15, 15, 15, 15, 6, 6, -4,
                -4, -4, -4, -4, -4, -4, -4, -4, -4, 3, 3, 12, 12, 24, 24,
              ],
            },
          },
          {
            name: "supersaw lead",
            midiProgram: 81,
            settings: {
              type: "supersaw",
              eqFilter: [
                { type: "low-pass", cutoffHz: 6727.17, linearGain: 2 },
              ],
              effects: ["reverb"],
              reverb: 67,
              fadeInSeconds: 0,
              fadeOutTicks: -6,
              pulseWidth: 50,
              dynamism: 100,
              spread: 58,
              shape: 0,
              envelopes: [],
            },
          },
        ]),
      },
      {
        name: "Keyboard Presets",
        presets: p([
          {
            name: "grand piano 1",
            midiProgram: 0,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "high-pass", cutoffHz: 148.65, linearGain: 0.7071 },
                { type: "peak", cutoffHz: 2e3, linearGain: 2.8284 },
              ],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 8e3, linearGain: 0.125 },
              ],
              reverb: 67,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              harmonics: [
                100, 100, 86, 86, 86, 71, 71, 71, 0, 86, 71, 71, 71, 57, 57, 71,
                57, 14, 57, 57, 57, 57, 57, 57, 57, 57, 29, 57,
              ],
              unison: "piano",
              stringSustain: 79,
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "note size" },
              ],
            },
          },
          {
            name: "bright piano",
            midiProgram: 1,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 1681.79, linearGain: 0.7071 },
                { type: "high-pass", cutoffHz: 148.65, linearGain: 0.5 },
                { type: "peak", cutoffHz: 3363.59, linearGain: 1.4142 },
              ],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 24,
              chord: "simultaneous",
              harmonics: [
                100, 100, 86, 86, 71, 71, 0, 71, 71, 71, 71, 71, 71, 14, 57, 57,
                57, 57, 57, 57, 29, 57, 57, 57, 57, 57, 57, 57,
              ],
              unison: "piano",
              stringSustain: 86,
              envelopes: [],
            },
          },
          {
            name: "electric grand",
            midiProgram: 2,
            generalMidi: !0,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 2378.41, linearGain: 0.5 },
              ],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              wave: "1/8 pulse",
              unison: "shimmer",
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 3" },
              ],
            },
          },
          {
            name: "honky-tonk piano",
            midiProgram: 3,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 5656.85, linearGain: 0.3536 },
              ],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              harmonics: [
                100, 100, 86, 71, 86, 71, 43, 71, 43, 43, 57, 57, 57, 29, 57,
                57, 57, 57, 57, 57, 43, 57, 57, 57, 43, 43, 43, 43,
              ],
              unison: "honky tonk",
              stringSustain: 71,
              envelopes: [],
            },
          },
          {
            name: "electric piano 1",
            midiProgram: 4,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 3363.59, linearGain: 0.5 },
              ],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "simultaneous",
              harmonics: [
                86, 100, 100, 71, 71, 57, 57, 43, 43, 43, 29, 29, 29, 14, 14,
                14, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0,
              ],
              unison: "none",
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 2" },
              ],
            },
          },
          {
            name: "electric piano 2",
            midiProgram: 5,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 13454.34, linearGain: 0.25 },
              ],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "1×", amplitude: 12 },
                { frequency: "1×", amplitude: 6 },
                { frequency: "1×", amplitude: 9 },
                { frequency: "16×", amplitude: 6 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 3" },
                { target: "operatorAmplitude", envelope: "twang 3", index: 3 },
              ],
            },
          },
          {
            name: "harpsichord",
            midiProgram: 6,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "high-pass", cutoffHz: 250, linearGain: 0.3536 },
                { type: "peak", cutoffHz: 11313.71, linearGain: 2.8284 },
              ],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 24,
              chord: "simultaneous",
              harmonics: [
                100, 100, 100, 86, 57, 86, 86, 86, 86, 57, 57, 71, 71, 86, 86,
                71, 71, 86, 86, 71, 71, 71, 71, 71, 71, 71, 71, 71,
              ],
              unison: "none",
              stringSustain: 79,
              envelopes: [],
            },
          },
          {
            name: "clavinet",
            midiProgram: 7,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 19027.31, linearGain: 0.3536 },
              ],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "simultaneous",
              algorithm: "1←(2 3 4)",
              feedbackType: "3⟲",
              feedbackAmplitude: 6,
              operators: [
                { frequency: "3×", amplitude: 15 },
                { frequency: "~1×", amplitude: 6 },
                { frequency: "8×", amplitude: 4 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 2" },
                { target: "feedbackAmplitude", envelope: "twang 2" },
              ],
            },
          },
          {
            name: "dulcimer",
            midiProgram: 15,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 8e3, linearGain: 0.3536 },
              ],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "strum",
              harmonics: [
                100, 100, 100, 86, 100, 86, 57, 100, 100, 86, 100, 86, 100, 86,
                100, 71, 57, 71, 71, 100, 86, 71, 86, 86, 100, 86, 86, 86,
              ],
              unison: "piano",
              stringSustain: 79,
              envelopes: [],
            },
          },
          {
            name: "grand piano 2",
            midiProgram: 0,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              eqFilter: [
                { type: "high-pass", cutoffHz: 148.65, linearGain: 0.7071 },
                { type: "peak", cutoffHz: 2e3, linearGain: 2.8284 },
              ],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 8e3, linearGain: 0.125 },
              ],
              reverb: 67,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              harmonics: [
                100, 86, 86, 86, 86, 71, 71, 57, 0, 57, 29, 43, 57, 57, 57, 43,
                43, 0, 29, 43, 43, 43, 43, 43, 43, 29, 0, 29,
              ],
              unison: "piano",
              stringSustain: 79,
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "note size" },
              ],
            },
          },
          {
            name: "grand piano 3",
            midiProgram: 0,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "high-pass", cutoffHz: 148.65, linearGain: 0.7071 },
                { type: "peak", cutoffHz: 1681.79, linearGain: 4 },
                { type: "low-pass", cutoffHz: 8e3, linearGain: 0.1768 },
                { type: "peak", cutoffHz: 3363.59, linearGain: 4 },
                { type: "peak", cutoffHz: 2378.41, linearGain: 0.25 },
              ],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 0.3536 },
                { type: "high-pass", cutoffHz: 125, linearGain: 0.0884 },
              ],
              reverb: 67,
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              harmonics: [
                100, 100, 86, 86, 86, 71, 71, 71, 0, 71, 71, 71, 71, 57, 57, 71,
                57, 14, 57, 57, 57, 57, 57, 57, 57, 57, 29, 57,
              ],
              unison: "piano",
              stringSustain: 86,
              stringSustainType: "acoustic",
              envelopes: [
                { target: "noteFilterFreq", envelope: "note size", index: 0 },
                { target: "noteFilterFreq", envelope: "twang 1", index: 1 },
                { target: "noteFilterFreq", envelope: "twang 1", index: 1 },
              ],
            },
          },
        ]),
      },
      {
        name: "Idiophone Presets",
        presets: p([
          {
            name: "celesta",
            midiProgram: 8,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 5657,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              vibrato: "none",
              algorithm: "(1 2)←(3 4)",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "~1×", amplitude: 11, envelope: "custom" },
                { frequency: "8×", amplitude: 6, envelope: "custom" },
                { frequency: "20×", amplitude: 3, envelope: "twang 1" },
                { frequency: "3×", amplitude: 1, envelope: "twang 2" },
              ],
            },
          },
          {
            name: "glockenspiel",
            midiProgram: 9,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 5657,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              vibrato: "none",
              algorithm: "(1 2 3)←4",
              feedbackType: "1⟲ 2⟲ 3⟲",
              feedbackAmplitude: 2,
              feedbackEnvelope: "decay 1",
              operators: [
                { frequency: "1×", amplitude: 7, envelope: "custom" },
                { frequency: "5×", amplitude: 11, envelope: "custom" },
                { frequency: "8×", amplitude: 7, envelope: "custom" },
                { frequency: "20×", amplitude: 2, envelope: "twang 1" },
              ],
            },
          },
          {
            name: "music box 1",
            midiProgram: 10,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 0.5 },
              ],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "strum",
              harmonics: [
                100, 0, 0, 100, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0,
                86, 0, 0, 0, 0, 0, 0, 71, 0,
              ],
              unison: "none",
              stringSustain: 64,
              envelopes: [],
            },
          },
          {
            name: "music box 2",
            midiProgram: 10,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 0.7071 },
              ],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "strum",
              harmonics: [
                100, 57, 57, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                43, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              unison: "none",
              stringSustain: 29,
              envelopes: [],
            },
          },
          {
            name: "vibraphone",
            midiProgram: 11,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              vibrato: "none",
              algorithm: "1 2 3 4",
              feedbackType: "1→2→3→4",
              feedbackAmplitude: 3,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "1×", amplitude: 9, envelope: "custom" },
                { frequency: "~1×", amplitude: 9, envelope: "custom" },
                { frequency: "9×", amplitude: 3, envelope: "custom" },
                { frequency: "4×", amplitude: 9, envelope: "custom" },
              ],
            },
          },
          {
            name: "marimba",
            midiProgram: 12,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2e3,
              filterResonance: 29,
              filterEnvelope: "decay 1",
              vibrato: "none",
              algorithm: "1 2←(3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 10, envelope: "custom" },
                { frequency: "4×", amplitude: 6, envelope: "custom" },
                { frequency: "13×", amplitude: 6, envelope: "twang 1" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "kalimba",
            midiProgram: 108,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "decay 1",
              vibrato: "none",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 11, envelope: "custom" },
                { frequency: "5×", amplitude: 3, envelope: "twang 2" },
                { frequency: "20×", amplitude: 3, envelope: "twang 1" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "xylophone",
            midiProgram: 13,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "(1 2 3)←4",
              feedbackType: "1⟲ 2⟲ 3⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 9, envelope: "custom" },
                { frequency: "6×", amplitude: 9, envelope: "custom" },
                { frequency: "11×", amplitude: 9, envelope: "custom" },
                { frequency: "20×", amplitude: 6, envelope: "twang 1" },
              ],
            },
          },
          {
            name: "tubular bell",
            midiProgram: 14,
            generalMidi: !0,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4e3, linearGain: 0.5 },
                { type: "high-pass", cutoffHz: 105.11, linearGain: 0.3536 },
              ],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 96,
              chord: "strum",
              harmonics: [
                43, 71, 0, 100, 0, 100, 0, 86, 0, 0, 86, 0, 14, 71, 14, 14, 57,
                14, 14, 43, 14, 14, 43, 14, 14, 43, 14, 14,
              ],
              unison: "shimmer",
              stringSustain: 86,
              envelopes: [],
            },
          },
          {
            name: "bell synth",
            midiProgram: 14,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2e3,
              filterResonance: 29,
              filterEnvelope: "twang 3",
              vibrato: "none",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "~2×", amplitude: 10, envelope: "custom" },
                { frequency: "7×", amplitude: 6, envelope: "twang 3" },
                { frequency: "20×", amplitude: 1, envelope: "twang 1" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "rain drop",
            midiProgram: 96,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 4e3,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "(1 2)←(3 4)",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 12, envelope: "custom" },
                { frequency: "6×", amplitude: 4, envelope: "custom" },
                { frequency: "20×", amplitude: 3, envelope: "twang 1" },
                { frequency: "1×", amplitude: 6, envelope: "tremolo1" },
              ],
            },
          },
          {
            name: "crystal",
            midiProgram: 98,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              vibrato: "delayed",
              algorithm: "1 2 3 4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 4,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "1×", amplitude: 10, envelope: "custom" },
                { frequency: "3×", amplitude: 7, envelope: "custom" },
                { frequency: "6×", amplitude: 4, envelope: "custom" },
                { frequency: "13×", amplitude: 4, envelope: "custom" },
              ],
            },
          },
          {
            name: "tinkle bell",
            midiProgram: 112,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              vibrato: "none",
              algorithm: "1 2 3 4",
              feedbackType: "1→2→3→4",
              feedbackAmplitude: 5,
              feedbackEnvelope: "twang 3",
              operators: [
                { frequency: "~2×", amplitude: 7, envelope: "custom" },
                { frequency: "5×", amplitude: 7, envelope: "custom" },
                { frequency: "7×", amplitude: 7, envelope: "custom" },
                { frequency: "16×", amplitude: 7, envelope: "custom" },
              ],
            },
          },
          {
            name: "agogo",
            midiProgram: 113,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 4e3,
              filterResonance: 14,
              filterEnvelope: "decay 1",
              vibrato: "none",
              algorithm: "1 2 3 4",
              feedbackType: "1→4",
              feedbackAmplitude: 15,
              feedbackEnvelope: "decay 1",
              operators: [
                { frequency: "2×", amplitude: 9, envelope: "custom" },
                { frequency: "5×", amplitude: 6, envelope: "custom" },
                { frequency: "8×", amplitude: 9, envelope: "custom" },
                { frequency: "13×", amplitude: 11, envelope: "custom" },
              ],
            },
          },
        ]),
      },
      {
        name: "Guitar Presets",
        presets: p([
          {
            name: "nylon guitar",
            midiProgram: 24,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 5657,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "1←2←3←4",
              feedbackType: "3⟲",
              feedbackAmplitude: 6,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 6, envelope: "steady" },
                { frequency: "5×", amplitude: 2, envelope: "steady" },
                { frequency: "7×", amplitude: 4, envelope: "steady" },
              ],
            },
          },
          {
            name: "steel guitar",
            midiProgram: 25,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "strum",
              harmonics: [
                100, 100, 86, 71, 71, 71, 86, 86, 71, 57, 43, 43, 43, 57, 57,
                57, 57, 57, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43,
              ],
              unison: "none",
              stringSustain: 71,
              envelopes: [],
            },
          },
          {
            name: "jazz guitar",
            midiProgram: 26,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              interval: "union",
              vibrato: "none",
              harmonics: [
                100, 100, 86, 71, 57, 71, 71, 43, 57, 71, 57, 43, 29, 29, 29,
                29, 29, 29, 29, 29, 14, 14, 14, 14, 14, 14, 14, 0,
              ],
            },
          },
          {
            name: "clean guitar",
            midiProgram: 27,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              interval: "union",
              vibrato: "none",
              harmonics: [
                86, 100, 100, 100, 86, 57, 86, 100, 100, 100, 71, 57, 43, 71,
                86, 71, 57, 57, 71, 71, 71, 71, 57, 57, 57, 57, 57, 43,
              ],
            },
          },
          {
            name: "muted guitar",
            midiProgram: 28,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 7,
              feedbackEnvelope: "twang 2",
              operators: [
                { frequency: "1×", amplitude: 13, envelope: "custom" },
                { frequency: "1×", amplitude: 4, envelope: "twang 3" },
                { frequency: "4×", amplitude: 4, envelope: "twang 2" },
                { frequency: "16×", amplitude: 4, envelope: "twang 1" },
              ],
            },
          },
        ]),
      },
      {
        name: "Picked Bass Presets",
        presets: p([
          {
            name: "acoustic bass",
            midiProgram: 32,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 4e3,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              interval: "union",
              vibrato: "none",
              harmonics: [
                100, 86, 71, 71, 71, 71, 57, 57, 57, 57, 43, 43, 43, 43, 43, 29,
                29, 29, 29, 29, 29, 14, 14, 14, 14, 14, 14, 14,
              ],
            },
          },
          {
            name: "fingered bass",
            midiProgram: 33,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              interval: "union",
              vibrato: "none",
              harmonics: [
                100, 86, 71, 57, 71, 43, 57, 29, 29, 29, 29, 29, 29, 14, 14, 14,
                14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0,
              ],
            },
          },
          {
            name: "picked bass",
            midiProgram: 34,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 0,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "3⟲",
              feedbackAmplitude: 4,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 5, envelope: "steady" },
                { frequency: "11×", amplitude: 1, envelope: "twang 3" },
                { frequency: "1×", amplitude: 9, envelope: "steady" },
              ],
            },
          },
          {
            name: "fretless bass",
            midiProgram: 35,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 1e3,
              filterResonance: 14,
              filterEnvelope: "flare 2",
              interval: "union",
              vibrato: "none",
              harmonics: [
                100, 100, 86, 71, 71, 57, 57, 71, 71, 71, 57, 57, 57, 57, 57,
                57, 57, 43, 43, 43, 43, 43, 43, 43, 43, 29, 29, 14,
              ],
            },
          },
          {
            name: "slap bass 1",
            midiProgram: 36,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 4e3,
              filterResonance: 0,
              filterEnvelope: "twang 1",
              interval: "union",
              vibrato: "none",
              harmonics: [
                100, 100, 100, 100, 86, 71, 57, 29, 29, 43, 43, 57, 71, 57, 29,
                29, 43, 57, 57, 57, 43, 43, 43, 57, 71, 71, 71, 71,
              ],
            },
          },
          {
            name: "slap bass 2",
            midiProgram: 37,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 5657,
              filterResonance: 0,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "1←2←3←4",
              feedbackType: "3⟲",
              feedbackAmplitude: 4,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "3×", amplitude: 13, envelope: "custom" },
                { frequency: "1×", amplitude: 7, envelope: "steady" },
                { frequency: "13×", amplitude: 3, envelope: "steady" },
                { frequency: "1×", amplitude: 11, envelope: "steady" },
              ],
            },
          },
          {
            name: "bass synth 1",
            midiProgram: 38,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard",
              chord: "strum",
              filterCutoffHz: 4e3,
              filterResonance: 43,
              filterEnvelope: "twang 2",
              vibrato: "none",
              algorithm: "1←3 2←4",
              feedbackType: "3⟲ 4⟲",
              feedbackAmplitude: 9,
              feedbackEnvelope: "twang 2",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 10, envelope: "custom" },
                { frequency: "1×", amplitude: 14, envelope: "twang 1" },
                { frequency: "~1×", amplitude: 13, envelope: "twang 2" },
              ],
            },
          },
          {
            name: "bass synth 2",
            midiProgram: 39,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 1e3,
              filterResonance: 57,
              filterEnvelope: "punch",
              vibrato: "none",
              algorithm: "1←(2 3 4)",
              feedbackType: "1→2",
              feedbackAmplitude: 4,
              feedbackEnvelope: "twang 3",
              operators: [
                { frequency: "1×", amplitude: 9, envelope: "custom" },
                { frequency: "1×", amplitude: 9, envelope: "steady" },
                { frequency: "3×", amplitude: 0, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "bass & lead",
            midiProgram: 87,
            generalMidi: !0,
            settings: {
              type: "chip",
              transition: "hard",
              effects: "reverb",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 86,
              filterEnvelope: "twang 2",
              wave: "sawtooth",
              interval: "shimmer",
              vibrato: "none",
            },
          },
          {
            name: "dubstep yoi yoi",
            midiProgram: 87,
            settings: {
              type: "chip",
              eqFilter: [
                { type: "low-pass", cutoffHz: 6727.17, linearGain: 0.7071 },
              ],
              effects: ["note filter", "bitcrusher"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 594.6, linearGain: 11.3137 },
              ],
              bitcrusherOctave: 1.5,
              bitcrusherQuantization: 0,
              transition: "slide",
              fadeInSeconds: 0.0263,
              fadeOutTicks: -3,
              chord: "arpeggio",
              wave: "sawtooth",
              unison: "none",
              envelopes: [
                { target: "noteFilterFreq", envelope: "flare 2", index: 0 },
              ],
            },
          },
        ]),
      },
      {
        name: "Picked String Presets",
        presets: p([
          {
            name: "pizzicato strings",
            midiProgram: 45,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "medium fade",
              chord: "harmony",
              filterCutoffHz: 1e3,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "(1 2 3)←4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 7,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "1×", amplitude: 14, envelope: "custom" },
                { frequency: "3×", amplitude: 11, envelope: "custom" },
                { frequency: "6×", amplitude: 9, envelope: "custom" },
                { frequency: "~1×", amplitude: 10, envelope: "steady" },
              ],
            },
          },
          {
            name: "harp",
            midiProgram: 46,
            generalMidi: !0,
            settings: {
              type: "FM",
              transition: "hard fade",
              effects: "reverb",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 0,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "1←3 2←4",
              feedbackType: "3⟲",
              feedbackAmplitude: 6,
              feedbackEnvelope: "twang 2",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "4×", amplitude: 6, envelope: "custom" },
                { frequency: "~2×", amplitude: 3, envelope: "steady" },
                { frequency: "1×", amplitude: 6, envelope: "steady" },
              ],
            },
          },
          {
            name: "sitar",
            midiProgram: 104,
            generalMidi: !0,
            settings: {
              type: "FM",
              transition: "hard fade",
              effects: "reverb",
              chord: "strum",
              filterCutoffHz: 8e3,
              filterResonance: 57,
              filterEnvelope: "twang 2",
              vibrato: "none",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 14, envelope: "twang 3" },
                { frequency: "9×", amplitude: 3, envelope: "twang 3" },
                { frequency: "16×", amplitude: 9, envelope: "swell 3" },
              ],
            },
          },
          {
            name: "banjo",
            midiProgram: 105,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "2⟲",
              feedbackAmplitude: 4,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "4×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 10, envelope: "steady" },
                { frequency: "11×", amplitude: 3, envelope: "twang 3" },
                { frequency: "1×", amplitude: 11, envelope: "steady" },
              ],
            },
          },
          {
            name: "ukulele",
            midiProgram: 105,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2e3,
              filterResonance: 0,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "3⟲",
              feedbackAmplitude: 5,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "2×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 6, envelope: "steady" },
                { frequency: "9×", amplitude: 4, envelope: "twang 2" },
                { frequency: "1×", amplitude: 11, envelope: "steady" },
              ],
            },
          },
          {
            name: "shamisen",
            midiProgram: 106,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "harmony",
              filterCutoffHz: 8e3,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "3⟲",
              feedbackAmplitude: 9,
              feedbackEnvelope: "twang 3",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 12, envelope: "steady" },
                { frequency: "16×", amplitude: 4, envelope: "twang 3" },
                { frequency: "1×", amplitude: 7, envelope: "steady" },
              ],
            },
          },
          {
            name: "koto",
            midiProgram: 107,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard fade",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              vibrato: "none",
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 5,
              feedbackEnvelope: "twang 2",
              operators: [
                { frequency: "~1×", amplitude: 12, envelope: "custom" },
                { frequency: "6×", amplitude: 10, envelope: "custom" },
                { frequency: "4×", amplitude: 8, envelope: "twang 3" },
                { frequency: "~2×", amplitude: 8, envelope: "twang 3" },
              ],
            },
          },
        ]),
      },
      {
        name: "Distortion Presets",
        presets: p([
          {
            name: "overdrive guitar",
            midiProgram: 29,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 0.7071 },
                { type: "high-pass", cutoffHz: 210.22, linearGain: 1 },
                { type: "low-pass", cutoffHz: 5656.85, linearGain: 1 },
                { type: "peak", cutoffHz: 840.9, linearGain: 0.5 },
              ],
              effects: ["note filter", "distortion"],
              noteFilter: [
                { type: "high-pass", cutoffHz: 297.3, linearGain: 2 },
                { type: "low-pass", cutoffHz: 2378.41, linearGain: 0.7071 },
              ],
              distortion: 71,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 12,
              chord: "strum",
              harmonics: [
                86, 100, 100, 86, 86, 86, 86, 71, 71, 71, 71, 71, 71, 71, 71,
                71, 71, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57,
              ],
              unison: "none",
              stringSustain: 71,
              envelopes: [
                { target: "noteFilterFreq", envelope: "note size", index: 1 },
              ],
            },
          },
          {
            name: "distortion guitar",
            midiProgram: 30,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 0.7071 },
                { type: "high-pass", cutoffHz: 210.22, linearGain: 1 },
                { type: "low-pass", cutoffHz: 5656.85, linearGain: 1 },
                { type: "peak", cutoffHz: 594.6, linearGain: 0.3536 },
                { type: "peak", cutoffHz: 1e3, linearGain: 0.25 },
              ],
              effects: ["note filter", "distortion", "reverb"],
              noteFilter: [
                { type: "high-pass", cutoffHz: 353.55, linearGain: 2 },
                { type: "low-pass", cutoffHz: 2e3, linearGain: 1 },
              ],
              distortion: 86,
              reverb: 67,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 12,
              chord: "strum",
              harmonics: [
                86, 100, 100, 86, 86, 86, 86, 71, 71, 71, 71, 71, 71, 71, 71,
                71, 71, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57,
              ],
              unison: "none",
              stringSustain: 71,
              envelopes: [
                { target: "noteFilterFreq", envelope: "note size", index: 1 },
              ],
            },
          },
          {
            name: "charango synth",
            midiProgram: 84,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 11313.71, linearGain: 1 },
              ],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "strum",
              algorithm: "1←(2 3←4)",
              feedbackType: "1→2→3→4",
              feedbackAmplitude: 8,
              operators: [
                { frequency: "3×", amplitude: 13 },
                { frequency: "~1×", amplitude: 5 },
                { frequency: "4×", amplitude: 6 },
                { frequency: "3×", amplitude: 7 },
              ],
              envelopes: [{ target: "feedbackAmplitude", envelope: "twang 3" }],
            },
          },
          {
            name: "guitar harmonics",
            midiProgram: 31,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [{ type: "low-pass", cutoffHz: 4e3, linearGain: 2 }],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "strum",
              algorithm: "1←(2 3)←4",
              feedbackType: "1⟲",
              feedbackAmplitude: 2,
              operators: [
                { frequency: "4×", amplitude: 12 },
                { frequency: "16×", amplitude: 5 },
                { frequency: "1×", amplitude: 2 },
                { frequency: "~1×", amplitude: 12 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "swell 1", index: 1 },
                { target: "operatorAmplitude", envelope: "punch", index: 2 },
                { target: "operatorAmplitude", envelope: "twang 1", index: 3 },
              ],
            },
          },
          {
            name: "PWM overdrive",
            midiProgram: 29,
            settings: {
              type: "PWM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 5656.85, linearGain: 1.4142 },
              ],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "strum",
              pulseWidth: 17.67767,
              envelopes: [{ target: "pulseWidth", envelope: "punch" }],
            },
          },
          {
            name: "PWM distortion",
            midiProgram: 30,
            settings: {
              type: "PWM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 3363.59, linearGain: 2 },
              ],
              effects: ["vibrato"],
              vibrato: "delayed",
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "strum",
              pulseWidth: 50,
              envelopes: [{ target: "pulseWidth", envelope: "swell 1" }],
            },
          },
          {
            name: "FM overdrive",
            midiProgram: 29,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 1 },
              ],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "strum",
              algorithm: "1←(2 3←4)",
              feedbackType: "1→2",
              feedbackAmplitude: 2,
              operators: [
                { frequency: "~1×", amplitude: 15 },
                { frequency: "1×", amplitude: 12 },
                { frequency: "~2×", amplitude: 6 },
                { frequency: "1×", amplitude: 12 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "twang 1", index: 2 },
                { target: "operatorAmplitude", envelope: "swell 3", index: 3 },
                { target: "feedbackAmplitude", envelope: "punch" },
              ],
            },
          },
          {
            name: "FM distortion",
            midiProgram: 30,
            settings: {
              type: "FM",
              eqFilter: [{ type: "low-pass", cutoffHz: 4e3, linearGain: 2 }],
              effects: ["reverb"],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "strum",
              algorithm: "1←(2 3←4)",
              feedbackType: "1→2",
              feedbackAmplitude: 4,
              operators: [
                { frequency: "~1×", amplitude: 15 },
                { frequency: "1×", amplitude: 11 },
                { frequency: "1×", amplitude: 9 },
                { frequency: "~2×", amplitude: 4 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "swell 1", index: 2 },
                { target: "operatorAmplitude", envelope: "swell 3", index: 3 },
              ],
            },
          },
        ]),
      },
      {
        name: "Bellows Presets",
        presets: p([
          {
            name: "drawbar organ 1",
            midiProgram: 16,
            generalMidi: !0,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "hard",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "steady",
              interval: "union",
              vibrato: "none",
              harmonics: [
                86, 86, 0, 86, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          },
          {
            name: "drawbar organ 2",
            midiProgram: 16,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "hard",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "steady",
              interval: "union",
              vibrato: "none",
              harmonics: [
                86, 29, 71, 86, 71, 14, 0, 100, 0, 0, 0, 86, 0, 0, 0, 71, 0, 0,
                0, 57, 0, 0, 0, 29, 0, 0, 0, 0,
              ],
            },
          },
          {
            name: "percussive organ",
            midiProgram: 17,
            generalMidi: !0,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "FM",
              transition: "hard",
              effects: "reverb",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "punch",
              vibrato: "light",
              algorithm: "1 2 3 4",
              feedbackType: "1→3 2→4",
              feedbackAmplitude: 7,
              feedbackEnvelope: "decay 1",
              operators: [
                { frequency: "1×", amplitude: 7, envelope: "custom" },
                { frequency: "2×", amplitude: 7, envelope: "custom" },
                { frequency: "3×", amplitude: 8, envelope: "custom" },
                { frequency: "4×", amplitude: 8, envelope: "custom" },
              ],
            },
          },
          {
            name: "rock organ",
            midiProgram: 18,
            generalMidi: !0,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "hard",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 14,
              filterEnvelope: "punch",
              vibrato: "delayed",
              algorithm: "(1 2 3)←4",
              feedbackType: "1⟲ 2⟲ 3⟲",
              feedbackAmplitude: 2,
              feedbackEnvelope: "flare 1",
              operators: [
                { frequency: "1×", amplitude: 9, envelope: "custom" },
                { frequency: "4×", amplitude: 9, envelope: "custom" },
                { frequency: "6×", amplitude: 9, envelope: "custom" },
                { frequency: "2×", amplitude: 5, envelope: "steady" },
              ],
            },
          },
          {
            name: "pipe organ",
            midiProgram: 19,
            generalMidi: !0,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "FM",
              transition: "cross fade",
              effects: "reverb",
              chord: "harmony",
              filterCutoffHz: 5657,
              filterResonance: 43,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1 2 3 4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 5,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 8, envelope: "custom" },
                { frequency: "2×", amplitude: 9, envelope: "custom" },
                { frequency: "4×", amplitude: 9, envelope: "custom" },
                { frequency: "8×", amplitude: 8, envelope: "custom" },
              ],
            },
          },
          {
            name: "reed organ",
            midiProgram: 20,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 29,
              filterEnvelope: "steady",
              interval: "union",
              vibrato: "none",
              harmonics: [
                71, 86, 100, 86, 71, 100, 57, 71, 71, 71, 43, 43, 43, 71, 43,
                71, 57, 57, 57, 57, 57, 57, 57, 29, 43, 29, 29, 14,
              ],
            },
          },
          {
            name: "accordion",
            midiProgram: 21,
            generalMidi: !0,
            settings: {
              type: "chip",
              effects: "reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 5657,
              filterResonance: 0,
              filterEnvelope: "swell 1",
              wave: "double saw",
              interval: "honky tonk",
              vibrato: "none",
            },
          },
          {
            name: "bandoneon",
            midiProgram: 23,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 29,
              filterEnvelope: "swell 1",
              interval: "hum",
              vibrato: "none",
              harmonics: [
                86, 86, 86, 57, 71, 86, 57, 71, 71, 71, 57, 43, 57, 43, 71, 43,
                71, 57, 57, 43, 43, 43, 57, 43, 43, 29, 29, 29,
              ],
            },
          },
          {
            name: "bagpipe",
            midiProgram: 109,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 5657,
              filterResonance: 43,
              filterEnvelope: "punch",
              interval: "hum",
              vibrato: "none",
              harmonics: [
                71, 86, 86, 100, 100, 86, 57, 100, 86, 71, 71, 71, 57, 57, 57,
                71, 57, 71, 57, 71, 43, 57, 57, 43, 43, 43, 43, 43,
              ],
            },
          },
        ]),
      },
      {
        name: "String Presets",
        presets: p([
          {
            name: "violin 1",
            midiProgram: 40,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4e3, linearGain: 1.4142 },
                { type: "high-pass", cutoffHz: 105.11, linearGain: 0.3536 },
              ],
              effects: ["vibrato", "reverb"],
              vibrato: "delayed",
              reverb: 67,
              transition: "normal",
              fadeInSeconds: 0.0413,
              fadeOutTicks: 6,
              chord: "simultaneous",
              algorithm: "(1 2)←(3 4)",
              feedbackType: "1→2",
              feedbackAmplitude: 5,
              operators: [
                { frequency: "4×", amplitude: 9 },
                { frequency: "3×", amplitude: 9 },
                { frequency: "2×", amplitude: 7 },
                { frequency: "7×", amplitude: 5 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "swell 1", index: 3 },
                { target: "feedbackAmplitude", envelope: "twang 3" },
              ],
            },
          },
          {
            name: "viola",
            midiProgram: 41,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 29,
              filterEnvelope: "steady",
              vibrato: "delayed",
              algorithm: "(1 2 3)←4",
              feedbackType: "1⟲ 2⟲ 3⟲",
              feedbackAmplitude: 8,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "2×", amplitude: 11, envelope: "custom" },
                { frequency: "7×", amplitude: 7, envelope: "custom" },
                { frequency: "13×", amplitude: 4, envelope: "custom" },
                { frequency: "1×", amplitude: 5, envelope: "steady" },
              ],
            },
          },
          {
            name: "cello",
            midiProgram: 42,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4e3, linearGain: 0.1768 },
                { type: "high-pass", cutoffHz: 297.3, linearGain: 0.7071 },
                { type: "peak", cutoffHz: 4756.83, linearGain: 5.6569 },
              ],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 16e3, linearGain: 0.0884 },
              ],
              reverb: 67,
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 12,
              chord: "simultaneous",
              algorithm: "(1 2)←3←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 3,
              operators: [
                { frequency: "16×", amplitude: 5 },
                { frequency: "~1×", amplitude: 10 },
                { frequency: "1×", amplitude: 9 },
                { frequency: "6×", amplitude: 3 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "swell 1" },
                { target: "operatorAmplitude", envelope: "swell 1", index: 3 },
              ],
            },
          },
          {
            name: "contrabass",
            midiProgram: 43,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 29,
              filterEnvelope: "steady",
              vibrato: "delayed",
              algorithm: "(1 2)←3←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "16×", amplitude: 5, envelope: "custom" },
                { frequency: "1×", amplitude: 10, envelope: "custom" },
                { frequency: "1×", amplitude: 10, envelope: "steady" },
                { frequency: "6×", amplitude: 3, envelope: "swell 1" },
              ],
            },
          },
          {
            name: "fiddle",
            midiProgram: 110,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 29,
              filterEnvelope: "steady",
              vibrato: "delayed",
              algorithm: "(1 2)←(3 4)",
              feedbackType: "3⟲ 4⟲",
              feedbackAmplitude: 5,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "2×", amplitude: 10, envelope: "custom" },
                { frequency: "8×", amplitude: 8, envelope: "custom" },
                { frequency: "1×", amplitude: 8, envelope: "steady" },
                { frequency: "16×", amplitude: 3, envelope: "steady" },
              ],
            },
          },
          {
            name: "tremolo strings",
            midiProgram: 44,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "medium fade",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 0,
              filterEnvelope: "tremolo4",
              vibrato: "none",
              algorithm: "1 2 3 4",
              feedbackType: "1→2→3→4",
              feedbackAmplitude: 12,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 8, envelope: "custom" },
                { frequency: "~2×", amplitude: 8, envelope: "custom" },
                { frequency: "4×", amplitude: 8, envelope: "custom" },
                { frequency: "7×", amplitude: 8, envelope: "custom" },
              ],
            },
          },
          {
            name: "strings",
            midiProgram: 48,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 43,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "(1 2)←(3 4)",
              feedbackType: "4⟲",
              feedbackAmplitude: 5,
              feedbackEnvelope: "twang 3",
              operators: [
                { frequency: "4×", amplitude: 9, envelope: "custom" },
                { frequency: "3×", amplitude: 9, envelope: "custom" },
                { frequency: "2×", amplitude: 7, envelope: "steady" },
                { frequency: "7×", amplitude: 3, envelope: "swell 1" },
              ],
            },
          },
          {
            name: "slow strings",
            midiProgram: 49,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "soft fade",
              chord: "harmony",
              filterCutoffHz: 1414,
              filterResonance: 0,
              filterEnvelope: "swell 2",
              vibrato: "none",
              algorithm: "(1 2)←(3 4)",
              feedbackType: "4⟲",
              feedbackAmplitude: 6,
              feedbackEnvelope: "flare 3",
              operators: [
                { frequency: "4×", amplitude: 10, envelope: "custom" },
                { frequency: "3×", amplitude: 10, envelope: "custom" },
                { frequency: "2×", amplitude: 7, envelope: "steady" },
                { frequency: "7×", amplitude: 4, envelope: "swell 1" },
              ],
            },
          },
          {
            name: "strings synth 1",
            midiProgram: 50,
            generalMidi: !0,
            settings: {
              type: "chip",
              transition: "soft fade",
              effects: "chorus & reverb",
              chord: "harmony",
              filterCutoffHz: 1414,
              filterResonance: 43,
              filterEnvelope: "steady",
              wave: "sawtooth",
              interval: "hum",
              vibrato: "delayed",
            },
          },
          {
            name: "strings synth 2",
            midiProgram: 51,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "soft fade",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 43,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1 2 3 4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 12,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "3×", amplitude: 6, envelope: "custom" },
                { frequency: "2×", amplitude: 7, envelope: "custom" },
                { frequency: "1×", amplitude: 8, envelope: "custom" },
                { frequency: "1×", amplitude: 9, envelope: "custom" },
              ],
            },
          },
          {
            name: "orchestra hit 1",
            midiProgram: 55,
            generalMidi: !0,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "hard fade",
              chord: "harmony",
              filterCutoffHz: 8e3,
              filterResonance: 14,
              filterEnvelope: "custom",
              vibrato: "none",
              algorithm: "1 2 3 4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 14,
              feedbackEnvelope: "twang 3",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "twang 3" },
                { frequency: "2×", amplitude: 15, envelope: "flare 3" },
                { frequency: "4×", amplitude: 15, envelope: "flare 2" },
                { frequency: "8×", amplitude: 15, envelope: "flare 1" },
              ],
            },
          },
          {
            name: "violin 2",
            midiProgram: 40,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2828, linearGain: 1.4142 },
                { type: "high-pass", cutoffHz: 105.11, linearGain: 0.3536 },
              ],
              effects: ["vibrato", "reverb"],
              vibrato: "light",
              reverb: 67,
              transition: "normal",
              fadeInSeconds: 0.0413,
              fadeOutTicks: 6,
              chord: "simultaneous",
              algorithm: "(1 2)←(3 4)",
              feedbackType: "4⟲",
              feedbackAmplitude: 5,
              feedbackEnvelope: "twang 3",
              operators: [
                { frequency: "4×", amplitude: 15, envelope: "custom" },
                { frequency: "3×", amplitude: 13, envelope: "custom" },
                { frequency: "2×", amplitude: 7, envelope: "steady" },
                { frequency: "7×", amplitude: 8, envelope: "swell 1" },
              ],
            },
          },
          {
            name: "orchestra hit 2",
            midiProgram: 55,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "medium fade",
              chord: "harmony",
              filterCutoffHz: 8e3,
              filterResonance: 0,
              filterEnvelope: "decay 1",
              vibrato: "delayed",
              algorithm: "1 2 3 4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 14,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 12, envelope: "custom" },
                { frequency: "2×", amplitude: 14, envelope: "custom" },
                { frequency: "3×", amplitude: 12, envelope: "custom" },
                { frequency: "4×", amplitude: 14, envelope: "custom" },
              ],
            },
          },
          {
            name: "supersaw string",
            midiProgram: 41,
            settings: {
              type: "supersaw",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 1.4142 },
                { type: "low-pass", cutoffHz: 3363.59, linearGain: 0.1768 },
              ],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "high-pass", cutoffHz: 500, linearGain: 0.1768 },
              ],
              reverb: 33,
              fadeInSeconds: 0.0263,
              fadeOutTicks: 6,
              pulseWidth: 35.35534,
              dynamism: 83,
              spread: 8,
              shape: 50,
              envelopes: [
                { target: "noteFilterFreq", envelope: "twang 1", index: 0 },
              ],
            },
          },
          {
            name: "supersaw string 2",
            midiProgram: 41,
            settings: {
              type: "supersaw",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2378.41, linearGain: 0.5 },
                { type: "high-pass", cutoffHz: 594.6, linearGain: 0.25 },
                { type: "peak", cutoffHz: 2e3, linearGain: 2.8284 },
                { type: "peak", cutoffHz: 4756.83, linearGain: 2 },
              ],
              eqFilterType: !1,
              eqSimpleCut: 10,
              eqSimplePeak: 0,
              envelopeSpeed: 12,
              discreteEnvelope: !1,
              eqSubFilters0: [
                { type: "low-pass", cutoffHz: 2378.41, linearGain: 0.5 },
                { type: "high-pass", cutoffHz: 594.6, linearGain: 0.25 },
                { type: "peak", cutoffHz: 2e3, linearGain: 2.8284 },
                { type: "peak", cutoffHz: 4756.83, linearGain: 2 },
              ],
              effects: ["note filter", "chorus", "reverb"],
              noteFilterType: !1,
              noteSimpleCut: 10,
              noteSimplePeak: 0,
              noteFilter: [{ type: "low-pass", cutoffHz: 8e3, linearGain: 1 }],
              noteSubFilters0: [
                { type: "low-pass", cutoffHz: 8e3, linearGain: 1 },
              ],
              chorus: 57,
              reverb: 42,
              fadeInSeconds: 0.0575,
              fadeOutTicks: -6,
              pulseWidth: 50,
              dynamism: 67,
              spread: 58,
              shape: 0,
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "punch" },
                { target: "pulseWidth", envelope: "flare 2" },
              ],
            },
          },
        ]),
      },
      {
        name: "Vocal Presets",
        presets: p([
          {
            name: "choir soprano",
            midiProgram: 94,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 2 },
                { type: "peak", cutoffHz: 1189.21, linearGain: 5.6569 },
                { type: "high-pass", cutoffHz: 707.11, linearGain: 2.8284 },
                { type: "peak", cutoffHz: 2e3, linearGain: 0.0884 },
                { type: "peak", cutoffHz: 840.9, linearGain: 0.25 },
                { type: "low-pass", cutoffHz: 6727.17, linearGain: 11.3137 },
              ],
              effects: ["vibrato", "chorus", "reverb"],
              vibrato: "shaky",
              chorus: 100,
              reverb: 33,
              fadeInSeconds: 0.0413,
              fadeOutTicks: 24,
              harmonics: [
                100, 100, 86, 57, 29, 29, 57, 71, 57, 29, 14, 14, 14, 29, 43,
                57, 43, 29, 14, 14, 14, 14, 14, 14, 0, 0, 0, 0,
              ],
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "choir tenor",
            midiProgram: 52,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              eqFilter: [
                { type: "peak", cutoffHz: 1e3, linearGain: 11.3137 },
                { type: "peak", cutoffHz: 707.11, linearGain: 5.6569 },
                { type: "peak", cutoffHz: 840.9, linearGain: 0.0884 },
                { type: "peak", cutoffHz: 1681.79, linearGain: 0.0884 },
                { type: "high-pass", cutoffHz: 297.3, linearGain: 0.7071 },
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 11.3137 },
              ],
              effects: ["vibrato", "chorus", "reverb"],
              vibrato: "shaky",
              chorus: 100,
              reverb: 67,
              transition: "normal",
              fadeInSeconds: 0.0413,
              fadeOutTicks: 48,
              chord: "simultaneous",
              harmonics: [
                86, 100, 100, 86, 71, 57, 43, 29, 29, 29, 29, 43, 43, 43, 29,
                29, 29, 29, 29, 29, 29, 29, 29, 14, 14, 14, 14, 14,
              ],
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "choir bass",
            midiProgram: 52,
            settings: {
              type: "harmonics",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2378.41, linearGain: 11.3137 },
                { type: "peak", cutoffHz: 594.6, linearGain: 5.6569 },
                { type: "peak", cutoffHz: 1681.79, linearGain: 0.0884 },
                { type: "peak", cutoffHz: 707.11, linearGain: 0.0884 },
                { type: "peak", cutoffHz: 840.9, linearGain: 11.3137 },
              ],
              effects: ["vibrato", "chorus", "reverb"],
              vibrato: "shaky",
              chorus: 100,
              reverb: 67,
              transition: "normal",
              fadeInSeconds: 0.0413,
              fadeOutTicks: 48,
              chord: "simultaneous",
              harmonics: [
                71, 86, 100, 100, 86, 86, 57, 43, 29, 29, 29, 29, 29, 29, 43,
                43, 43, 43, 43, 29, 29, 29, 29, 14, 14, 14, 14, 14,
              ],
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "solo soprano",
            midiProgram: 85,
            settings: {
              type: "harmonics",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 2 },
                { type: "peak", cutoffHz: 1189.21, linearGain: 5.6569 },
                { type: "high-pass", cutoffHz: 707.11, linearGain: 2.8284 },
                { type: "peak", cutoffHz: 2e3, linearGain: 0.0884 },
                { type: "peak", cutoffHz: 840.9, linearGain: 0.25 },
              ],
              effects: ["vibrato", "reverb"],
              vibrato: "shaky",
              reverb: 33,
              fadeInSeconds: 0.0413,
              fadeOutTicks: 12,
              harmonics: [
                86, 100, 86, 43, 14, 14, 57, 71, 57, 14, 14, 14, 14, 14, 43, 57,
                43, 14, 14, 14, 14, 14, 14, 14, 0, 0, 0, 0,
              ],
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "solo tenor",
            midiProgram: 85,
            settings: {
              type: "harmonics",
              eqFilter: [
                { type: "peak", cutoffHz: 1e3, linearGain: 11.3137 },
                { type: "peak", cutoffHz: 707.11, linearGain: 5.6569 },
                { type: "peak", cutoffHz: 840.9, linearGain: 0.0884 },
                { type: "peak", cutoffHz: 1681.79, linearGain: 0.0884 },
                { type: "high-pass", cutoffHz: 297.3, linearGain: 0.7071 },
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 11.3137 },
              ],
              effects: ["vibrato", "reverb"],
              vibrato: "shaky",
              reverb: 33,
              fadeInSeconds: 0.0413,
              fadeOutTicks: 12,
              harmonics: [
                86, 100, 100, 86, 71, 57, 43, 29, 29, 29, 29, 43, 43, 43, 29,
                29, 29, 29, 29, 29, 29, 29, 29, 14, 14, 14, 14, 14,
              ],
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "solo bass",
            midiProgram: 85,
            settings: {
              type: "harmonics",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2378.41, linearGain: 5.6569 },
                { type: "peak", cutoffHz: 594.6, linearGain: 8 },
                { type: "peak", cutoffHz: 1681.79, linearGain: 0.0884 },
                { type: "peak", cutoffHz: 707.11, linearGain: 0.0884 },
                { type: "peak", cutoffHz: 840.9, linearGain: 8 },
                { type: "high-pass", cutoffHz: 210.22, linearGain: 1.4142 },
              ],
              effects: ["vibrato", "reverb"],
              vibrato: "shaky",
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0.0263,
              fadeOutTicks: 12,
              chord: "simultaneous",
              harmonics: [
                71, 86, 100, 100, 86, 86, 57, 43, 29, 29, 29, 29, 29, 29, 43,
                43, 43, 43, 43, 29, 29, 29, 29, 14, 14, 14, 14, 14,
              ],
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "voice ooh",
            midiProgram: 53,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 1414,
              filterResonance: 57,
              filterEnvelope: "steady",
              interval: "union",
              vibrato: "shaky",
              harmonics: [
                100, 57, 43, 43, 14, 14, 0, 0, 0, 14, 29, 29, 14, 0, 14, 29, 29,
                14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          },
          {
            name: "voice synth",
            midiProgram: 54,
            generalMidi: !0,
            settings: {
              type: "chip",
              transition: "medium fade",
              effects: "chorus & reverb",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 57,
              filterEnvelope: "steady",
              wave: "rounded",
              interval: "union",
              vibrato: "light",
            },
          },
          {
            name: "vox synth lead",
            midiProgram: 85,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "steady",
              vibrato: "light",
              algorithm: "(1 2 3)←4",
              feedbackType: "1→2→3→4",
              feedbackAmplitude: 2,
              feedbackEnvelope: "punch",
              operators: [
                { frequency: "2×", amplitude: 10, envelope: "custom" },
                { frequency: "9×", amplitude: 5, envelope: "custom" },
                { frequency: "20×", amplitude: 1, envelope: "custom" },
                { frequency: "~1×", amplitude: 4, envelope: "steady" },
              ],
            },
          },
          {
            name: "tiny robot",
            midiProgram: 85,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["vibrato", "reverb"],
              vibrato: "delayed",
              reverb: 33,
              transition: "slide",
              fadeInSeconds: 0.0263,
              fadeOutTicks: -3,
              chord: "simultaneous",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 2,
              operators: [
                { frequency: "2×", amplitude: 15 },
                { frequency: "1×", amplitude: 7 },
                { frequency: "~1×", amplitude: 7 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "punch", index: 1 },
                { target: "feedbackAmplitude", envelope: "twang 3" },
              ],
            },
          },
          {
            name: "yowie",
            midiProgram: 85,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 86,
              filterEnvelope: "tremolo5",
              vibrato: "none",
              algorithm: "1←2←(3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 12,
              feedbackEnvelope: "tremolo3",
              operators: [
                { frequency: "2×", amplitude: 12, envelope: "custom" },
                { frequency: "16×", amplitude: 5, envelope: "steady" },
                { frequency: "1×", amplitude: 5, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "mouse",
            midiProgram: 85,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["vibrato", "reverb"],
              vibrato: "light",
              reverb: 33,
              transition: "slide in pattern",
              fadeInSeconds: 0.0263,
              fadeOutTicks: -3,
              chord: "simultaneous",
              algorithm: "1 2 3 4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 5,
              operators: [
                { frequency: "2×", amplitude: 13 },
                { frequency: "5×", amplitude: 12 },
                { frequency: "1×", amplitude: 0 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "noteVolume", envelope: "note size" },
                { target: "feedbackAmplitude", envelope: "flare 2" },
              ],
            },
          },
          {
            name: "gumdrop",
            midiProgram: 85,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "hard",
              chord: "harmony",
              filterCutoffHz: 8e3,
              filterResonance: 0,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "(1 2 3)←4",
              feedbackType: "1⟲ 2⟲ 3⟲",
              feedbackAmplitude: 0,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "2×", amplitude: 15, envelope: "punch" },
                { frequency: "4×", amplitude: 15, envelope: "punch" },
                { frequency: "7×", amplitude: 15, envelope: "punch" },
                { frequency: "1×", amplitude: 10, envelope: "twang 1" },
              ],
            },
          },
          {
            name: "echo drop",
            midiProgram: 102,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "hard",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "punch",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 2,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "~2×", amplitude: 11, envelope: "custom" },
                { frequency: "~1×", amplitude: 5, envelope: "steady" },
                { frequency: "11×", amplitude: 2, envelope: "steady" },
                { frequency: "16×", amplitude: 5, envelope: "swell 3" },
              ],
            },
          },
          {
            name: "dark choir",
            midiProgram: 85,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 29,
              filterEnvelope: "swell 1",
              spectrum: [
                43, 14, 14, 14, 14, 14, 14, 100, 14, 14, 14, 57, 14, 14, 100,
                14, 43, 14, 43, 14, 14, 43, 14, 29, 14, 29, 14, 14, 29, 0,
              ],
            },
          },
        ]),
      },
      {
        name: "Brass Presets",
        presets: p([
          {
            name: "trumpet",
            midiProgram: 56,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 43,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 9,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "1×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 8, envelope: "steady" },
                { frequency: "1×", amplitude: 5, envelope: "flare 2" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "trombone",
            midiProgram: 57,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 43,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←(2 3 4)",
              feedbackType: "2⟲",
              feedbackAmplitude: 7,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "1×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 8, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "tuba",
            midiProgram: 58,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 43,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←(2 3 4)",
              feedbackType: "2⟲",
              feedbackAmplitude: 8,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "1×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 6, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "muted trumpet",
            midiProgram: 59,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 8e3, linearGain: 2.8284 },
                { type: "peak", cutoffHz: 4e3, linearGain: 2.8284 },
              ],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 3363.59, linearGain: 1 },
              ],
              reverb: 33,
              fadeInSeconds: 0.0263,
              fadeOutTicks: -3,
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 5,
              operators: [
                { frequency: "1×", amplitude: 13 },
                { frequency: "1×", amplitude: 5 },
                { frequency: "9×", amplitude: 5 },
                { frequency: "13×", amplitude: 7 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "swell 1" },
                { target: "operatorAmplitude", envelope: "swell 1", index: 3 },
                { target: "feedbackAmplitude", envelope: "flare 2" },
              ],
            },
          },
          {
            name: "french horn",
            midiProgram: 60,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4e3, linearGain: 1 },
                { type: "peak", cutoffHz: 2378.41, linearGain: 2.8284 },
              ],
              effects: ["reverb"],
              reverb: 33,
              fadeInSeconds: 0.0263,
              fadeOutTicks: -3,
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 3,
              operators: [
                { frequency: "1×", amplitude: 15 },
                { frequency: "1×", amplitude: 12 },
                { frequency: "1×", amplitude: 10 },
                { frequency: "~1×", amplitude: 8 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "swell 1", index: 2 },
                { target: "operatorAmplitude", envelope: "flare 2", index: 3 },
                { target: "feedbackAmplitude", envelope: "swell 1" },
              ],
            },
          },
          {
            name: "brass section",
            midiProgram: 61,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "punch",
              vibrato: "none",
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 6,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "1×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 12, envelope: "custom" },
                { frequency: "1×", amplitude: 10, envelope: "swell 1" },
                { frequency: "~1×", amplitude: 10, envelope: "swell 1" },
              ],
            },
          },
          {
            name: "brass synth 1",
            midiProgram: 62,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 29,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 11,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "1×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 12, envelope: "flare 1" },
                { frequency: "~1×", amplitude: 8, envelope: "flare 2" },
              ],
            },
          },
          {
            name: "brass synth 2",
            midiProgram: 63,
            generalMidi: !0,
            settings: {
              type: "FM",
              transition: "soft",
              effects: "reverb",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 43,
              filterEnvelope: "twang 3",
              vibrato: "none",
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 9,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 10, envelope: "flare 1" },
                { frequency: "~1×", amplitude: 7, envelope: "flare 1" },
              ],
            },
          },
          {
            name: "pulse brass",
            midiProgram: 62,
            settings: {
              type: "PWM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 29,
              filterEnvelope: "swell 1",
              pulseWidth: 50,
              pulseEnvelope: "flare 3",
              vibrato: "none",
            },
          },
        ]),
      },
      {
        name: "Reed Presets",
        presets: p([
          {
            name: "soprano sax",
            midiProgram: 64,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 29,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←2←3←4",
              feedbackType: "4⟲",
              feedbackAmplitude: 5,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "1×", amplitude: 13, envelope: "custom" },
                { frequency: "4×", amplitude: 4, envelope: "swell 1" },
                { frequency: "1×", amplitude: 7, envelope: "steady" },
                { frequency: "5×", amplitude: 4, envelope: "punch" },
              ],
            },
          },
          {
            name: "alto sax",
            midiProgram: 65,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 43,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 4,
              feedbackEnvelope: "punch",
              operators: [
                { frequency: "1×", amplitude: 13, envelope: "custom" },
                { frequency: "1×", amplitude: 6, envelope: "steady" },
                { frequency: "4×", amplitude: 6, envelope: "swell 1" },
                { frequency: "1×", amplitude: 12, envelope: "steady" },
              ],
            },
          },
          {
            name: "tenor sax",
            midiProgram: 66,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 29,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←2←3←4",
              feedbackType: "1⟲",
              feedbackAmplitude: 6,
              feedbackEnvelope: "swell 1",
              operators: [
                { frequency: "2×", amplitude: 12, envelope: "custom" },
                { frequency: "3×", amplitude: 7, envelope: "steady" },
                { frequency: "1×", amplitude: 3, envelope: "steady" },
                { frequency: "8×", amplitude: 3, envelope: "steady" },
              ],
            },
          },
          {
            name: "baritone sax",
            midiProgram: 67,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 0,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 2,
              feedbackEnvelope: "swell 2",
              operators: [
                { frequency: "1×", amplitude: 12, envelope: "custom" },
                { frequency: "8×", amplitude: 4, envelope: "steady" },
                { frequency: "4×", amplitude: 5, envelope: "steady" },
                { frequency: "1×", amplitude: 4, envelope: "punch" },
              ],
            },
          },
          {
            name: "sax synth",
            midiProgram: 64,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 8e3,
              filterResonance: 0,
              filterEnvelope: "steady",
              vibrato: "light",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 4,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "4×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 15, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "shehnai",
            midiProgram: 111,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 8e3,
              filterResonance: 0,
              filterEnvelope: "steady",
              vibrato: "light",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 3,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "4×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 8, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "oboe",
            midiProgram: 68,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 14,
              filterEnvelope: "swell 1",
              vibrato: "none",
              algorithm: "1 2←(3 4)",
              feedbackType: "2⟲",
              feedbackAmplitude: 2,
              feedbackEnvelope: "tremolo5",
              operators: [
                { frequency: "1×", amplitude: 7, envelope: "custom" },
                { frequency: "4×", amplitude: 12, envelope: "custom" },
                { frequency: "1×", amplitude: 6, envelope: "steady" },
                { frequency: "6×", amplitude: 2, envelope: "steady" },
              ],
            },
          },
          {
            name: "english horn",
            midiProgram: 69,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1 2←(3 4)",
              feedbackType: "2⟲",
              feedbackAmplitude: 2,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "4×", amplitude: 12, envelope: "custom" },
                { frequency: "2×", amplitude: 10, envelope: "custom" },
                { frequency: "1×", amplitude: 8, envelope: "punch" },
                { frequency: "8×", amplitude: 4, envelope: "steady" },
              ],
            },
          },
          {
            name: "bassoon",
            midiProgram: 70,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 707,
              filterResonance: 57,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 2,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "2×", amplitude: 11, envelope: "custom" },
                { frequency: "1×", amplitude: 6, envelope: "steady" },
                { frequency: "6×", amplitude: 6, envelope: "swell 1" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
          {
            name: "clarinet",
            midiProgram: 71,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 1414,
              filterResonance: 14,
              filterEnvelope: "steady",
              interval: "union",
              vibrato: "none",
              harmonics: [
                100, 43, 86, 57, 86, 71, 86, 71, 71, 71, 71, 71, 71, 43, 71, 71,
                57, 57, 57, 57, 57, 57, 43, 43, 43, 29, 14, 0,
              ],
            },
          },
          {
            name: "harmonica",
            midiProgram: 22,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 5657,
              filterResonance: 29,
              filterEnvelope: "swell 1",
              vibrato: "none",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 9,
              feedbackEnvelope: "tremolo5",
              operators: [
                { frequency: "2×", amplitude: 14, envelope: "custom" },
                { frequency: "1×", amplitude: 15, envelope: "steady" },
                { frequency: "~2×", amplitude: 2, envelope: "twang 3" },
                { frequency: "1×", amplitude: 0, envelope: "steady" },
              ],
            },
          },
        ]),
      },
      {
        name: "Flute Presets",
        presets: p([
          {
            name: "flute 1",
            midiProgram: 73,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 5657,
              filterResonance: 14,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←(2 3 4)",
              feedbackType: "4⟲",
              feedbackAmplitude: 7,
              feedbackEnvelope: "decay 2",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "2×", amplitude: 4, envelope: "steady" },
                { frequency: "1×", amplitude: 3, envelope: "steady" },
                { frequency: "~1×", amplitude: 1, envelope: "punch" },
              ],
            },
          },
          {
            name: "recorder",
            midiProgram: 74,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 29,
              filterEnvelope: "swell 2",
              interval: "union",
              vibrato: "none",
              harmonics: [
                100, 43, 57, 43, 57, 43, 43, 43, 43, 43, 43, 43, 43, 29, 29, 29,
                29, 29, 29, 29, 14, 14, 14, 14, 14, 14, 14, 0,
              ],
            },
          },
          {
            name: "whistle",
            midiProgram: 78,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "chorus & reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 43,
              filterEnvelope: "steady",
              interval: "union",
              vibrato: "delayed",
              harmonics: [
                100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
              ],
            },
          },
          {
            name: "ocarina",
            midiProgram: 79,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 43,
              filterEnvelope: "steady",
              interval: "union",
              vibrato: "none",
              harmonics: [
                100, 14, 57, 14, 29, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          },
          {
            name: "piccolo",
            midiProgram: 72,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 5657,
              filterResonance: 43,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1←3 2←4",
              feedbackType: "4⟲",
              feedbackAmplitude: 15,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "1×", amplitude: 10, envelope: "custom" },
                { frequency: "~2×", amplitude: 3, envelope: "punch" },
                { frequency: "~1×", amplitude: 5, envelope: "punch" },
              ],
            },
          },
          {
            name: "shakuhachi",
            midiProgram: 77,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 14,
              filterEnvelope: "steady",
              vibrato: "delayed",
              algorithm: "1←(2 3←4)",
              feedbackType: "3→4",
              feedbackAmplitude: 15,
              feedbackEnvelope: "steady",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "2×", amplitude: 3, envelope: "punch" },
                { frequency: "~1×", amplitude: 4, envelope: "twang 1" },
                { frequency: "20×", amplitude: 15, envelope: "steady" },
              ],
            },
          },
          {
            name: "pan flute",
            midiProgram: 75,
            generalMidi: !0,
            settings: {
              type: "spectrum",
              eqFilter: [
                { type: "low-pass", cutoffHz: 9513.66, linearGain: 5.6569 },
              ],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "high-pass", cutoffHz: 4756.83, linearGain: 0.7071 },
              ],
              reverb: 33,
              fadeInSeconds: 0.0125,
              fadeOutTicks: -3,
              spectrum: [
                100, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 71, 0, 0, 14, 0, 57, 0, 29,
                14, 29, 14, 14, 29, 14, 29, 14, 14, 29, 14,
              ],
              envelopes: [
                { target: "noteFilterFreq", envelope: "twang 1", index: 0 },
                { target: "noteVolume", envelope: "punch" },
              ],
            },
          },
          {
            name: "blown bottle",
            midiProgram: 76,
            generalMidi: !0,
            settings: {
              type: "FM",
              effects: "chorus & reverb",
              transition: "cross fade",
              chord: "harmony",
              filterCutoffHz: 5657,
              filterResonance: 57,
              filterEnvelope: "steady",
              vibrato: "none",
              algorithm: "1 2 3 4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 7,
              feedbackEnvelope: "twang 1",
              operators: [
                { frequency: "1×", amplitude: 15, envelope: "custom" },
                { frequency: "3×", amplitude: 4, envelope: "custom" },
                { frequency: "6×", amplitude: 2, envelope: "custom" },
                { frequency: "11×", amplitude: 2, envelope: "custom" },
              ],
            },
          },
          {
            name: "calliope",
            midiProgram: 82,
            generalMidi: !0,
            settings: {
              type: "spectrum",
              transition: "cross fade",
              effects: "reverb",
              chord: "harmony",
              filterCutoffHz: 5657,
              filterResonance: 14,
              filterEnvelope: "steady",
              spectrum: [
                100, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 71, 0, 0, 57, 0, 43, 0, 29,
                14, 14, 29, 14, 14, 14, 14, 14, 14, 14, 14,
              ],
            },
          },
          {
            name: "chiffer",
            midiProgram: 83,
            generalMidi: !0,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "punch",
              spectrum: [
                86, 0, 0, 0, 0, 0, 0, 71, 0, 0, 0, 71, 0, 0, 57, 0, 57, 0, 43,
                14, 14, 43, 14, 29, 14, 29, 29, 29, 29, 14,
              ],
            },
          },
          {
            name: "breath noise",
            midiProgram: 121,
            generalMidi: !0,
            settings: {
              type: "spectrum",
              eqFilter: [],
              effects: ["chord type", "note filter", "reverb"],
              chord: "strum",
              noteFilter: [
                { type: "high-pass", cutoffHz: 840.9, linearGain: 0.3536 },
                { type: "low-pass", cutoffHz: 16e3, linearGain: 0.3536 },
              ],
              reverb: 33,
              fadeInSeconds: 0.0413,
              fadeOutTicks: 12,
              spectrum: [
                71, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 71, 0, 0, 29, 0, 100, 29, 14,
                29, 100, 29, 100, 14, 14, 71, 0, 29, 0, 0,
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 1" },
              ],
            },
          },
          {
            name: "flute 2",
            midiProgram: 73,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              effects: "reverb",
              transition: "seamless",
              chord: "harmony",
              filterCutoffHz: 1414,
              filterResonance: 14,
              filterEnvelope: "steady",
              interval: "union",
              vibrato: "delayed",
              harmonics: [
                100, 43, 86, 57, 86, 71, 86, 71, 71, 71, 71, 71, 71, 43, 71, 71,
                57, 57, 57, 57, 57, 57, 43, 43, 43, 29, 14, 0,
              ],
            },
          },
        ]),
      },
      {
        name: "Pad Presets",
        presets: p([
          {
            name: "new age pad",
            midiProgram: 88,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["chorus"],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 3,
              operators: [
                { frequency: "2×", amplitude: 14 },
                { frequency: "~1×", amplitude: 4 },
                { frequency: "6×", amplitude: 3 },
                { frequency: "13×", amplitude: 3 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "swell 2", index: 1 },
                { target: "operatorAmplitude", envelope: "twang 3", index: 2 },
                { target: "feedbackAmplitude", envelope: "swell 3" },
              ],
            },
          },
          {
            name: "warm pad",
            midiProgram: 89,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["note filter", "chorus"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 3363.59, linearGain: 1 },
              ],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0.0575,
              fadeOutTicks: 96,
              chord: "simultaneous",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 7,
              operators: [
                { frequency: "1×", amplitude: 14 },
                { frequency: "1×", amplitude: 6 },
                { frequency: "1×", amplitude: 0 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "swell 3" },
                { target: "operatorAmplitude", envelope: "swell 1", index: 1 },
              ],
            },
          },
          {
            name: "polysynth pad",
            midiProgram: 90,
            generalMidi: !0,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["vibrato", "note filter", "chorus"],
              vibrato: "delayed",
              noteFilter: [
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 1 },
              ],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              wave: "sawtooth",
              unison: "honky tonk",
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 3" },
              ],
            },
          },
          {
            name: "space voice pad",
            midiProgram: 91,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 6727.17, linearGain: 5.6569 },
                { type: "peak", cutoffHz: 2828.43, linearGain: 5.6569 },
                { type: "peak", cutoffHz: 1414.21, linearGain: 0.1768 },
              ],
              effects: ["chorus"],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 72,
              chord: "simultaneous",
              algorithm: "(1 2 3)←4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 5,
              operators: [
                { frequency: "1×", amplitude: 10 },
                { frequency: "2×", amplitude: 8 },
                { frequency: "3×", amplitude: 7 },
                { frequency: "11×", amplitude: 2 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "punch", index: 3 },
                { target: "feedbackAmplitude", envelope: "swell 2" },
              ],
            },
          },
          {
            name: "bowed glass pad",
            midiProgram: 92,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 0.5 },
              ],
              transition: "normal",
              fadeInSeconds: 0.0575,
              fadeOutTicks: 96,
              chord: "simultaneous",
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "1×", amplitude: 10 },
                { frequency: "2×", amplitude: 12 },
                { frequency: "3×", amplitude: 7 },
                { frequency: "7×", amplitude: 4 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 3" },
                { target: "operatorAmplitude", envelope: "twang 3", index: 2 },
                { target: "operatorAmplitude", envelope: "flare 3", index: 3 },
              ],
            },
          },
          {
            name: "metallic pad",
            midiProgram: 93,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 6727.17, linearGain: 0.5 },
              ],
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 72,
              chord: "simultaneous",
              algorithm: "1←3 2←4",
              feedbackType: "1⟲ 2⟲",
              feedbackAmplitude: 13,
              operators: [
                { frequency: "1×", amplitude: 15 },
                { frequency: "~1×", amplitude: 9 },
                { frequency: "1×", amplitude: 7 },
                { frequency: "11×", amplitude: 7 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 3" },
                { target: "operatorAmplitude", envelope: "swell 2", index: 2 },
                { target: "feedbackAmplitude", envelope: "twang 3" },
              ],
            },
          },
          {
            name: "sweep pad",
            midiProgram: 95,
            generalMidi: !0,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["note filter", "chorus"],
              noteFilter: [{ type: "low-pass", cutoffHz: 4e3, linearGain: 4 }],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0.0575,
              fadeOutTicks: 96,
              chord: "simultaneous",
              wave: "sawtooth",
              unison: "hum",
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "flare 3" },
              ],
            },
          },
          {
            name: "atmosphere",
            midiProgram: 99,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 1 },
              ],
              effects: ["chorus", "reverb"],
              chorus: 100,
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "strum",
              algorithm: "1←(2 3 4)",
              feedbackType: "3⟲ 4⟲",
              feedbackAmplitude: 3,
              operators: [
                { frequency: "1×", amplitude: 14 },
                { frequency: "~1×", amplitude: 10 },
                { frequency: "3×", amplitude: 7 },
                { frequency: "1×", amplitude: 7 },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "swell 3", index: 1 },
                { target: "operatorAmplitude", envelope: "twang 2", index: 2 },
                { target: "operatorAmplitude", envelope: "twang 3", index: 3 },
              ],
            },
          },
          {
            name: "brightness",
            midiProgram: 100,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 2 },
              ],
              effects: ["chorus"],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 72,
              chord: "simultaneous",
              harmonics: [
                100, 86, 86, 86, 43, 57, 43, 71, 43, 43, 43, 57, 43, 43, 57, 71,
                57, 43, 29, 43, 57, 57, 43, 29, 29, 29, 29, 14,
              ],
              unison: "octave",
              stringSustain: 86,
              envelopes: [],
            },
          },
          {
            name: "goblins",
            midiProgram: 101,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "peak", cutoffHz: 2828.43, linearGain: 11.3137 },
              ],
              effects: ["note filter", "chorus"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 1681.79, linearGain: 0.5 },
              ],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0.0575,
              fadeOutTicks: 96,
              chord: "simultaneous",
              algorithm: "1←2←3←4",
              feedbackType: "1⟲",
              feedbackAmplitude: 10,
              operators: [
                { frequency: "1×", amplitude: 15 },
                { frequency: "4×", amplitude: 5 },
                { frequency: "1×", amplitude: 10 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "swell 2" },
                { target: "operatorAmplitude", envelope: "swell 3", index: 1 },
                { target: "operatorAmplitude", envelope: "tremolo1", index: 2 },
                { target: "feedbackAmplitude", envelope: "flare 3" },
              ],
            },
          },
          {
            name: "sci-fi",
            midiProgram: 103,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "peak", cutoffHz: 9513.66, linearGain: 2.8284 },
              ],
              effects: ["note filter", "chorus"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 6727.17, linearGain: 0.5 },
              ],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 48,
              chord: "simultaneous",
              algorithm: "(1 2)←3←4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 8,
              operators: [
                { frequency: "~1×", amplitude: 13 },
                { frequency: "2×", amplitude: 10 },
                { frequency: "5×", amplitude: 5 },
                { frequency: "11×", amplitude: 8 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 3" },
                { target: "operatorAmplitude", envelope: "twang 3", index: 2 },
                { target: "operatorAmplitude", envelope: "tremolo5", index: 3 },
                { target: "feedbackAmplitude", envelope: "twang 3" },
              ],
            },
          },
          {
            name: "flutter pad",
            midiProgram: 90,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["vibrato", "note filter", "chorus"],
              vibrato: "delayed",
              noteFilter: [{ type: "low-pass", cutoffHz: 4e3, linearGain: 4 }],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              algorithm: "(1 2)←(3 4)",
              feedbackType: "1⟲ 2⟲ 3⟲",
              feedbackAmplitude: 9,
              operators: [
                { frequency: "1×", amplitude: 13 },
                { frequency: "5×", amplitude: 7 },
                { frequency: "7×", amplitude: 5 },
                { frequency: "~1×", amplitude: 6 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 3" },
                { target: "operatorAmplitude", envelope: "tremolo1", index: 2 },
                { target: "operatorAmplitude", envelope: "punch", index: 3 },
              ],
            },
          },
          {
            name: "feedback pad",
            midiProgram: 89,
            settings: {
              type: "FM",
              eqFilter: [{ type: "peak", cutoffHz: 2378.41, linearGain: 8 }],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0.0575,
              fadeOutTicks: 96,
              chord: "custom interval",
              algorithm: "1 2 3 4",
              feedbackType: "1⟲ 2⟲ 3⟲ 4⟲",
              feedbackAmplitude: 8,
              operators: [
                { frequency: "1×", amplitude: 15 },
                { frequency: "1×", amplitude: 15 },
                { frequency: "1×", amplitude: 15 },
                { frequency: "~1×", amplitude: 15 },
              ],
              envelopes: [{ target: "feedbackAmplitude", envelope: "swell 2" }],
            },
          },
          {
            name: "supersaw pad",
            midiProgram: 93,
            settings: {
              type: "supersaw",
              eqFilter: [
                { type: "low-pass", cutoffHz: 8e3, linearGain: 0.1768 },
              ],
              effects: ["reverb"],
              reverb: 100,
              fadeInSeconds: 0.0263,
              fadeOutTicks: 24,
              pulseWidth: 50,
              dynamism: 100,
              spread: 58,
              shape: 0,
              envelopes: [],
            },
          },
        ]),
      },
      {
        name: "Drum Presets",
        presets: p([
          {
            name: "standard drumset",
            midiProgram: 116,
            isNoise: !0,
            settings: {
              type: "drumset",
              effects: "reverb",
              drums: [
                {
                  filterEnvelope: "twang 1",
                  spectrum: [
                    57, 71, 71, 86, 86, 86, 71, 71, 71, 71, 57, 57, 57, 57, 43,
                    43, 43, 43, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
                  ],
                },
                {
                  filterEnvelope: "twang 1",
                  spectrum: [
                    0, 0, 0, 100, 71, 71, 57, 86, 57, 57, 57, 71, 43, 43, 57,
                    43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43,
                  ],
                },
                {
                  filterEnvelope: "twang 1",
                  spectrum: [
                    0, 0, 0, 0, 100, 57, 43, 43, 29, 57, 43, 29, 71, 43, 43, 43,
                    43, 57, 43, 43, 43, 43, 43, 43, 43, 43, 29, 43, 43, 43,
                  ],
                },
                {
                  filterEnvelope: "twang 1",
                  spectrum: [
                    0, 0, 0, 0, 0, 71, 57, 43, 43, 43, 57, 57, 43, 29, 57, 43,
                    43, 43, 29, 43, 57, 43, 43, 43, 43, 43, 43, 29, 43, 43,
                  ],
                },
                {
                  filterEnvelope: "decay 2",
                  spectrum: [
                    0, 14, 29, 43, 86, 71, 29, 43, 43, 43, 43, 29, 71, 29, 71,
                    29, 43, 43, 43, 43, 57, 43, 43, 57, 43, 43, 43, 57, 57, 57,
                  ],
                },
                {
                  filterEnvelope: "decay 1",
                  spectrum: [
                    0, 0, 14, 14, 14, 14, 29, 29, 29, 43, 43, 43, 57, 57, 57,
                    71, 71, 71, 71, 71, 71, 71, 71, 57, 57, 57, 57, 43, 43, 43,
                  ],
                },
                {
                  filterEnvelope: "twang 3",
                  spectrum: [
                    43, 43, 43, 71, 29, 29, 43, 43, 43, 29, 43, 43, 43, 29, 29,
                    43, 43, 29, 29, 29, 57, 14, 57, 43, 43, 57, 43, 43, 57, 57,
                  ],
                },
                {
                  filterEnvelope: "decay 3",
                  spectrum: [
                    29, 43, 43, 43, 43, 29, 29, 43, 29, 29, 43, 29, 14, 29, 43,
                    29, 43, 29, 57, 29, 43, 57, 43, 71, 43, 71, 57, 57, 71, 71,
                  ],
                },
                {
                  filterEnvelope: "twang 3",
                  spectrum: [
                    43, 29, 29, 43, 29, 29, 29, 57, 29, 29, 29, 57, 43, 43, 29,
                    29, 57, 43, 43, 43, 71, 43, 43, 71, 57, 71, 71, 71, 71, 71,
                  ],
                },
                {
                  filterEnvelope: "decay 3",
                  spectrum: [
                    57, 57, 57, 43, 57, 57, 43, 43, 57, 43, 43, 43, 71, 57, 43,
                    57, 86, 71, 57, 86, 71, 57, 86, 100, 71, 86, 86, 86, 86, 86,
                  ],
                },
                {
                  filterEnvelope: "flare 1",
                  spectrum: [
                    0, 0, 14, 14, 14, 14, 29, 29, 29, 43, 43, 43, 57, 57, 71,
                    71, 86, 86, 100, 100, 100, 100, 100, 100, 100, 100, 86, 57,
                    29, 0,
                  ],
                },
                {
                  filterEnvelope: "decay 2",
                  spectrum: [
                    14, 14, 14, 14, 29, 14, 14, 29, 14, 43, 14, 43, 57, 86, 57,
                    57, 100, 57, 43, 43, 57, 100, 57, 43, 29, 14, 0, 0, 0, 0,
                  ],
                },
              ],
            },
          },
          {
            name: "steel pan",
            midiProgram: 114,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "high-pass", cutoffHz: 62.5, linearGain: 0.1768 },
              ],
              effects: ["note filter", "chorus", "reverb"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 13454.34, linearGain: 0.25 },
              ],
              chorus: 67,
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 24,
              chord: "simultaneous",
              algorithm: "1←(2 3←4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "~1×", amplitude: 14 },
                { frequency: "7×", amplitude: 3 },
                { frequency: "3×", amplitude: 5 },
                { frequency: "4×", amplitude: 4 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "decay 2" },
                { target: "operatorAmplitude", envelope: "flare 1", index: 1 },
                { target: "operatorAmplitude", envelope: "flare 2", index: 2 },
                { target: "operatorAmplitude", envelope: "swell 2", index: 3 },
              ],
            },
          },
          {
            name: "steel pan synth",
            midiProgram: 114,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 13454.34, linearGain: 0.25 },
              ],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
              chord: "simultaneous",
              algorithm: "1 2 3←4",
              feedbackType: "1⟲",
              feedbackAmplitude: 5,
              operators: [
                { frequency: "~1×", amplitude: 12 },
                { frequency: "2×", amplitude: 15 },
                { frequency: "4×", amplitude: 14 },
                { frequency: "~1×", amplitude: 3 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 1" },
                {
                  target: "operatorAmplitude",
                  envelope: "note size",
                  index: 0,
                },
                {
                  target: "operatorAmplitude",
                  envelope: "note size",
                  index: 1,
                },
                { target: "operatorAmplitude", envelope: "flare 1", index: 2 },
                { target: "operatorAmplitude", envelope: "flare 2", index: 3 },
                { target: "feedbackAmplitude", envelope: "flare 1" },
              ],
            },
          },
          {
            name: "timpani",
            midiProgram: 47,
            generalMidi: !0,
            settings: {
              type: "spectrum",
              eqFilter: [
                { type: "peak", cutoffHz: 6727.17, linearGain: 5.6569 },
              ],
              effects: ["pitch shift", "note filter", "reverb"],
              pitchShiftSemitones: 15,
              noteFilter: [
                { type: "low-pass", cutoffHz: 19027.31, linearGain: 0.5 },
              ],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              spectrum: [
                100, 0, 0, 0, 86, 0, 0, 71, 0, 14, 43, 14, 43, 43, 0, 29, 43,
                29, 29, 29, 43, 29, 43, 29, 43, 43, 43, 43, 43, 43,
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 1" },
                { target: "pitchShift", envelope: "twang 1" },
              ],
            },
          },
          {
            name: "dark strike",
            midiProgram: 47,
            settings: {
              type: "spectrum",
              eqFilter: [],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 4756.83, linearGain: 0.7071 },
              ],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              spectrum: [
                0, 0, 14, 14, 14, 29, 29, 43, 43, 86, 43, 43, 43, 29, 86, 29,
                29, 29, 86, 29, 14, 14, 14, 14, 0, 0, 0, 0, 0, 0,
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 2" },
              ],
            },
          },
          {
            name: "woodblock",
            midiProgram: 115,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -2.5,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              spectrum: [
                0, 14, 29, 43, 43, 57, 86, 86, 71, 57, 57, 43, 43, 57, 86, 86,
                43, 43, 71, 57, 57, 57, 57, 57, 86, 86, 71, 71, 71, 71,
              ],
            },
          },
          {
            name: "taiko drum",
            midiProgram: 116,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -0.5,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 29,
              filterEnvelope: "twang 1",
              spectrum: [
                71, 100, 100, 43, 43, 71, 71, 43, 43, 43, 43, 43, 43, 57, 29,
                57, 43, 57, 43, 43, 57, 43, 43, 43, 43, 43, 43, 43, 43, 43,
              ],
            },
          },
          {
            name: "melodic drum",
            midiProgram: 117,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -1.5,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2828,
              filterResonance: 43,
              filterEnvelope: "twang 1",
              spectrum: [
                100, 71, 71, 57, 57, 43, 43, 71, 43, 43, 43, 57, 43, 43, 57, 43,
                43, 43, 43, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
              ],
            },
          },
          {
            name: "drum synth",
            midiProgram: 118,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -2,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard fade",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 43,
              filterEnvelope: "decay 1",
              spectrum: [
                100, 86, 71, 57, 43, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
                29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
              ],
            },
          },
          {
            name: "tom-tom",
            midiProgram: 116,
            isNoise: !0,
            midiSubharmonicOctaves: -1,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "twang 1",
              spectrum: [
                100, 29, 14, 0, 0, 86, 14, 43, 29, 86, 29, 14, 29, 57, 43, 43,
                43, 43, 57, 43, 43, 43, 29, 57, 43, 43, 43, 43, 43, 43,
              ],
            },
          },
          {
            name: "metal pipe",
            midiProgram: 117,
            isNoise: !0,
            midiSubharmonicOctaves: -1.5,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 8e3,
              filterResonance: 14,
              filterEnvelope: "twang 2",
              spectrum: [
                29, 43, 86, 43, 43, 43, 43, 43, 100, 29, 14, 14, 100, 14, 14, 0,
                0, 0, 0, 0, 14, 29, 29, 14, 0, 0, 14, 29, 0, 0,
              ],
            },
          },
          {
            name: "synth kick",
            midiProgram: 47,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -6,
              chord: "simultaneous",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "8×", amplitude: 15 },
                { frequency: "1×", amplitude: 0 },
                { frequency: "1×", amplitude: 0 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "operatorFrequency", envelope: "twang 1", index: 0 },
                { target: "noteVolume", envelope: "twang 2" },
              ],
            },
          },
        ]),
      },
      {
        name: "Novelty Presets",
        presets: p([
          {
            name: "guitar fret noise",
            midiProgram: 120,
            generalMidi: !0,
            settings: {
              type: "spectrum",
              eqFilter: [
                { type: "high-pass", cutoffHz: 1e3, linearGain: 0.1768 },
              ],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 6727.17, linearGain: 5.6569 },
              ],
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: -3,
              chord: "simultaneous",
              spectrum: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 29, 14, 0,
                0, 43, 0, 43, 0, 71, 43, 0, 57, 0,
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "flare 1" },
                { target: "noteVolume", envelope: "twang 2" },
              ],
            },
          },
          {
            name: "fifth saw lead",
            midiProgram: 86,
            generalMidi: !0,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["note filter", "chorus"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 1.4142 },
              ],
              chorus: 67,
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              wave: "sawtooth",
              unison: "fifth",
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 3" },
              ],
            },
          },
          {
            name: "fifth swell",
            midiProgram: 86,
            midiSubharmonicOctaves: 1,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["note filter", "chorus"],
              noteFilter: [{ type: "low-pass", cutoffHz: 2e3, linearGain: 2 }],
              chorus: 100,
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 72,
              chord: "simultaneous",
              wave: "sawtooth",
              unison: "fifth",
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "swell 3" },
              ],
            },
          },
          {
            name: "soundtrack",
            midiProgram: 97,
            generalMidi: !0,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["note filter", "chorus"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 2378.41, linearGain: 0.5 },
              ],
              chorus: 67,
              transition: "normal",
              fadeInSeconds: 0.0413,
              fadeOutTicks: 72,
              chord: "simultaneous",
              wave: "sawtooth",
              unison: "fifth",
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "flare 3" },
              ],
            },
          },
          {
            name: "reverse cymbal",
            midiProgram: 119,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -3,
            settings: {
              type: "spectrum",
              effects: "none",
              transition: "soft",
              chord: "harmony",
              filterCutoffHz: 4e3,
              filterResonance: 14,
              filterEnvelope: "swell 3",
              spectrum: [
                29, 57, 57, 29, 57, 57, 29, 29, 43, 29, 29, 43, 29, 29, 57, 57,
                14, 57, 14, 57, 71, 71, 57, 86, 57, 100, 86, 86, 86, 86,
              ],
            },
          },
          {
            name: "seashore",
            midiProgram: 122,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -3,
            settings: {
              type: "spectrum",
              transition: "soft fade",
              effects: "reverb",
              chord: "harmony",
              filterCutoffHz: 2828,
              filterResonance: 0,
              filterEnvelope: "swell 3",
              spectrum: [
                14, 14, 29, 29, 43, 43, 43, 57, 57, 57, 57, 57, 57, 71, 71, 71,
                71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 57,
              ],
            },
          },
          {
            name: "bird tweet",
            midiProgram: 123,
            generalMidi: !0,
            settings: {
              type: "harmonics",
              eqFilter: [],
              effects: ["chord type", "vibrato", "reverb"],
              chord: "strum",
              vibrato: "heavy",
              reverb: 67,
              fadeInSeconds: 0.0575,
              fadeOutTicks: -6,
              harmonics: [
                0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
              ],
              unison: "hum",
              envelopes: [{ target: "noteVolume", envelope: "decay 1" }],
            },
          },
          {
            name: "telephone ring",
            midiProgram: 124,
            generalMidi: !0,
            settings: {
              type: "FM",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 5656.85, linearGain: 1 },
              ],
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: -3,
              chord: "arpeggio",
              algorithm: "1←(2 3 4)",
              feedbackType: "1⟲",
              feedbackAmplitude: 0,
              operators: [
                { frequency: "2×", amplitude: 12 },
                { frequency: "1×", amplitude: 4 },
                { frequency: "20×", amplitude: 1 },
                { frequency: "1×", amplitude: 0 },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "tremolo4" },
                { target: "operatorAmplitude", envelope: "tremolo1", index: 1 },
              ],
            },
          },
          {
            name: "helicopter",
            midiProgram: 125,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -0.5,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "seamless",
              chord: "arpeggio",
              filterCutoffHz: 1414,
              filterResonance: 14,
              filterEnvelope: "tremolo4",
              spectrum: [
                14, 43, 43, 57, 57, 57, 71, 71, 71, 71, 86, 86, 86, 86, 86, 86,
                86, 86, 86, 86, 86, 71, 71, 71, 71, 71, 71, 71, 57, 57,
              ],
            },
          },
          {
            name: "applause",
            midiProgram: 126,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -3,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "soft fade",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "swell 3",
              spectrum: [
                14, 14, 29, 29, 29, 43, 43, 57, 71, 71, 86, 86, 86, 71, 71, 57,
                57, 57, 71, 86, 86, 86, 86, 86, 71, 71, 57, 57, 57, 57,
              ],
            },
          },
          {
            name: "gunshot",
            midiProgram: 127,
            generalMidi: !0,
            isNoise: !0,
            midiSubharmonicOctaves: -2,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard fade",
              chord: "strum",
              filterCutoffHz: 1414,
              filterResonance: 29,
              filterEnvelope: "twang 1",
              spectrum: [
                14, 29, 43, 43, 57, 57, 57, 71, 71, 71, 86, 86, 86, 86, 86, 86,
                86, 86, 86, 86, 86, 71, 71, 71, 71, 57, 57, 57, 57, 43,
              ],
            },
          },
          {
            name: "scoot",
            midiProgram: 92,
            settings: {
              type: "chip",
              eqFilter: [],
              effects: ["note filter"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 707.11, linearGain: 4 },
              ],
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: -3,
              chord: "simultaneous",
              wave: "double saw",
              unison: "shimmer",
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "flare 1" },
              ],
            },
          },
          {
            name: "buzz saw",
            midiProgram: 30,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 9513.66, linearGain: 0.5 },
              ],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0.0263,
              fadeOutTicks: -3,
              chord: "custom interval",
              algorithm: "1←2←3←4",
              feedbackType: "1⟲",
              feedbackAmplitude: 4,
              operators: [
                { frequency: "5×", amplitude: 13 },
                { frequency: "1×", amplitude: 10 },
                { frequency: "~1×", amplitude: 6 },
                { frequency: "11×", amplitude: 12 },
              ],
              envelopes: [],
            },
          },
          {
            name: "mosquito",
            midiProgram: 93,
            settings: {
              type: "PWM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 2828.43, linearGain: 2 },
              ],
              effects: ["vibrato"],
              vibrato: "shaky",
              transition: "normal",
              fadeInSeconds: 0.0575,
              fadeOutTicks: -6,
              chord: "simultaneous",
              pulseWidth: 4.41942,
              envelopes: [{ target: "pulseWidth", envelope: "tremolo6" }],
            },
          },
          {
            name: "breathing",
            midiProgram: 126,
            isNoise: !0,
            midiSubharmonicOctaves: -1,
            settings: {
              type: "spectrum",
              effects: "reverb",
              transition: "hard fade",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 14,
              filterEnvelope: "swell 2",
              spectrum: [
                14, 14, 14, 29, 29, 29, 29, 29, 43, 29, 29, 43, 43, 43, 29, 29,
                71, 43, 86, 86, 57, 100, 86, 86, 86, 86, 71, 86, 71, 57,
              ],
            },
          },
          {
            name: "klaxon synth",
            midiProgram: 125,
            isNoise: !0,
            midiSubharmonicOctaves: -1,
            settings: {
              type: "noise",
              effects: "reverb",
              transition: "slide",
              chord: "harmony",
              filterCutoffHz: 2e3,
              filterResonance: 86,
              filterEnvelope: "steady",
              wave: "buzz",
            },
          },
          {
            name: "theremin",
            midiProgram: 40,
            settings: {
              type: "harmonics",
              eqFilter: [
                { type: "low-pass", cutoffHz: 8e3, linearGain: 0.7071 },
              ],
              effects: ["vibrato", "reverb"],
              vibrato: "heavy",
              reverb: 33,
              transition: "slide in pattern",
              fadeInSeconds: 0.0263,
              fadeOutTicks: -6,
              chord: "simultaneous",
              harmonics: [
                100, 71, 57, 43, 29, 29, 14, 14, 14, 14, 14, 14, 14, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              unison: "none",
              envelopes: [],
            },
          },
          {
            name: "sonar ping",
            midiProgram: 121,
            settings: {
              type: "spectrum",
              eqFilter: [],
              effects: ["note filter", "reverb"],
              noteFilter: [
                { type: "low-pass", cutoffHz: 1681.79, linearGain: 0.5 },
              ],
              reverb: 33,
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 72,
              chord: "simultaneous",
              spectrum: [
                100, 43, 29, 29, 14, 14, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 2" },
              ],
            },
          },
        ]),
      },
      {
        name: "Custom Instruments",
        presets: p([
          {
            name: "mallet",
            midiProgram: 12,
            generalMidi: !0,
            settings: {
              type: "Picked String",
              eqFilter: [],
              effects: [],
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
              chord: "simultaneous",
              harmonics: [
                100, 100, 86, 71, 71, 71, 86, 86, 71, 57, 43, 43, 43, 57, 57,
                57, 57, 57, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43,
              ],
              unison: "none",
              stringSustain: 0,
              envelopes: [],
            },
          },
          {
            name: "cow bell",
            midiProgram: 113,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 16e3, linearGain: 11.3137 },
              ],
              eqFilterType: !1,
              eqSimpleCut: 10,
              eqSimplePeak: 0,
              envelopeSpeed: 12,
              discreteEnvelope: !1,
              effects: ["panning", "chord type", "note filter", "reverb"],
              chord: "simultaneous",
              fastTwoNoteArp: !1,
              arpeggioSpeed: 12,
              noteFilterType: !1,
              noteSimpleCut: 6,
              noteSimplePeak: 1,
              noteFilter: [
                { type: "low-pass", cutoffHz: 594.6, linearGain: 1.4142 },
              ],
              pan: 0,
              panDelay: 10,
              reverb: 0,
              fadeInSeconds: 0,
              fadeOutTicks: -24,
              algorithm: "(1 2 3)←4",
              feedbackType: "1→2",
              feedbackAmplitude: 2,
              operators: [
                {
                  frequency: "1×",
                  amplitude: 15,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "6×",
                  amplitude: 15,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "11×",
                  amplitude: 15,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "16×",
                  amplitude: 15,
                  waveform: "sine",
                  pulseWidth: 5,
                },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "twang 2" },
                { target: "noteFilterAllFreqs", envelope: "twang 2" },
              ],
              isDrum: !1,
            },
          },
          {
            name: "tremolo strings 1",
            midiProgram: 45,
            settings: {
              type: "FM",
              eqFilter: [],
              eqFilterType: !1,
              eqSimpleCut: 10,
              eqSimplePeak: 0,
              envelopeSpeed: 12,
              discreteEnvelope: !1,
              eqSubFilters0: [],
              effects: ["panning", "note filter", "chorus", "reverb"],
              noteFilterType: !0,
              noteSimpleCut: 6,
              noteSimplePeak: 0,
              noteFilter: [
                { type: "low-pass", cutoffHz: 11313.71, linearGain: 0.1768 },
              ],
              noteSubFilters1: [
                { type: "low-pass", cutoffHz: 11313.71, linearGain: 0.1768 },
              ],
              pan: 0,
              panDelay: 10,
              chorus: 100,
              reverb: 0,
              fadeInSeconds: 0.0125,
              fadeOutTicks: 72,
              algorithm: "1 2 3 4",
              feedbackType: "1→2→3→4",
              feedbackAmplitude: 15,
              operators: [
                {
                  frequency: "1×",
                  amplitude: 8,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "2×",
                  amplitude: 8,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "4×",
                  amplitude: 8,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "8×",
                  amplitude: 8,
                  waveform: "sine",
                  pulseWidth: 5,
                },
              ],
              envelopes: [
                { target: "noteFilterAllFreqs", envelope: "tremolo1" },
              ],
              isDrum: !1,
            },
          },
          {
            name: "tremolo strings 2",
            midiProgram: 45,
            settings: {
              type: "FM",
              eqFilter: [
                { type: "low-pass", cutoffHz: 3049.17, linearGain: 1.4142 },
              ],
              eqFilterType: !0,
              eqSimpleCut: 7,
              eqSimplePeak: 3,
              envelopeSpeed: 12,
              discreteEnvelope: !1,
              eqSubFilters1: [],
              effects: ["panning", "chorus", "reverb"],
              pan: 0,
              panDelay: 10,
              chorus: 100,
              reverb: 0,
              fadeInSeconds: 0.0413,
              fadeOutTicks: 6,
              algorithm: "(1 2)←(3 4)",
              feedbackType: "4⟲",
              feedbackAmplitude: 10,
              operators: [
                {
                  frequency: "4×",
                  amplitude: 9,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "2×",
                  amplitude: 9,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "1×",
                  amplitude: 7,
                  waveform: "sine",
                  pulseWidth: 5,
                },
                {
                  frequency: "8×",
                  amplitude: 3,
                  waveform: "sine",
                  pulseWidth: 5,
                },
              ],
              envelopes: [
                { target: "operatorAmplitude", envelope: "swell 1", index: 3 },
                { target: "feedbackAmplitude", envelope: "twang 3" },
              ],
              isDrum: !1,
            },
          },
        ]),
      },
    ]));
  class Q {
    constructor() {
      (this.h = 1),
        (this.p = [void 0]),
        (this.m = 0),
        (this.u = 0),
        (this.v = 0);
    }
    pushFront(t) {
      this.v >= this.h && this.k(),
        (this.u = (this.u - 1) & this.m),
        (this.p[this.u] = t),
        this.v++;
    }
    pushBack(t) {
      this.v >= this.h && this.k(),
        (this.p[(this.u + this.v) & this.m] = t),
        this.v++;
    }
    popFront() {
      if (this.v <= 0) throw new Error("No elements left to pop.");
      const t = this.p[this.u];
      return (
        (this.p[this.u] = void 0), (this.u = (this.u + 1) & this.m), this.v--, t
      );
    }
    popBack() {
      if (this.v <= 0) throw new Error("No elements left to pop.");
      this.v--;
      const t = (this.u + this.v) & this.m,
        e = this.p[t];
      return (this.p[t] = void 0), e;
    }
    peakFront() {
      if (this.v <= 0) throw new Error("No elements left to pop.");
      return this.p[this.u];
    }
    peakBack() {
      if (this.v <= 0) throw new Error("No elements left to pop.");
      return this.p[(this.u + this.v - 1) & this.m];
    }
    count() {
      return this.v;
    }
    set(t, e) {
      if (t < 0 || t >= this.v) throw new Error("Invalid index");
      this.p[(this.u + t) & this.m] = e;
    }
    get(t) {
      if (t < 0 || t >= this.v) throw new Error("Invalid index");
      return this.p[(this.u + t) & this.m];
    }
    remove(t) {
      if (t < 0 || t >= this.v) throw new Error("Invalid index");
      if (t <= this.v >> 1) {
        for (; t > 0; ) this.set(t, this.get(t - 1)), t--;
        this.popFront();
      } else {
        for (t++; t < this.v; ) this.set(t - 1, this.get(t)), t++;
        this.popBack();
      }
    }
    k() {
      if (this.h >= 1073741824) throw new Error("Capacity too big.");
      this.h = this.h << 1;
      const t = this.p,
        e = new Array(this.h),
        n = 0 | this.v,
        i = 0 | this.u;
      for (let a = 0; a < n; a++) e[a] = t[(i + a) & this.m];
      for (let t = n; t < this.h; t++) e[t] = void 0;
      (this.u = 0), (this.p = e), (this.m = this.h - 1);
    }
  }
  class _ {
    constructor() {
      (this.a = [1]), (this.b = [1]), (this.order = 0);
    }
    linearGain0thOrder(t) {
      (this.b[0] = t), (this.order = 0);
    }
    lowPass1stOrderButterworth(t) {
      const e = 1 / Math.tan(0.5 * t),
        n = 1 + e;
      (this.a[1] = (1 - e) / n),
        (this.b[1] = this.b[0] = 1 / n),
        (this.order = 1);
    }
    lowPass1stOrderSimplified(t) {
      const e = 2 * Math.sin(0.5 * t);
      (this.a[1] = e - 1), (this.b[0] = e), (this.b[1] = 0), (this.order = 1);
    }
    highPass1stOrderButterworth(t) {
      const e = 1 / Math.tan(0.5 * t),
        n = 1 + e;
      (this.a[1] = (1 - e) / n),
        (this.b[0] = e / n),
        (this.b[1] = -e / n),
        (this.order = 1);
    }
    highShelf1stOrder(t, e) {
      const n = Math.tan(0.5 * t),
        i = Math.sqrt(e),
        a = (n * i - 1) / (n * i + 1);
      (this.a[1] = a / 1),
        (this.b[0] = (1 + a + e * (1 - a)) / 2),
        (this.b[1] = (1 + a - e * (1 - a)) / 2),
        (this.order = 1);
    }
    allPass1stOrderInvertPhaseAbove(t) {
      const e = (Math.sin(t) - 1) / Math.cos(t);
      (this.a[1] = e), (this.b[0] = e), (this.b[1] = 1), (this.order = 1);
    }
    allPass1stOrderFractionalDelay(t) {
      const e = (1 - t) / (1 + t);
      (this.a[1] = e), (this.b[0] = e), (this.b[1] = 1), (this.order = 1);
    }
    lowPass2ndOrderButterworth(t, e) {
      const n = Math.sin(t) / (2 * e),
        i = Math.cos(t),
        a = 1 + n;
      (this.a[1] = (-2 * i) / a),
        (this.a[2] = (1 - n) / a),
        (this.b[2] = this.b[0] = (1 - i) / (2 * a)),
        (this.b[1] = (1 - i) / a),
        (this.order = 2);
    }
    lowPass2ndOrderSimplified(t, e) {
      const n = 2 * Math.sin(t / 2),
        i = 1 - 1 / (2 * e),
        a = i + i / (1 - n);
      (this.a[1] = 2 * n + (n - 1) * n * a - 2),
        (this.a[2] = (n - 1) * (n - n * a - 1)),
        (this.b[0] = n * n),
        (this.b[1] = 0),
        (this.b[2] = 0),
        (this.order = 2);
    }
    highPass2ndOrderButterworth(t, e) {
      const n = Math.sin(t) / (2 * e),
        i = Math.cos(t),
        a = 1 + n;
      (this.a[1] = (-2 * i) / a),
        (this.a[2] = (1 - n) / a),
        (this.b[2] = this.b[0] = (1 + i) / (2 * a)),
        (this.b[1] = -(1 + i) / a),
        (this.order = 2);
    }
    highShelf2ndOrder(t, e, n) {
      const i = Math.sqrt(e),
        a = Math.cos(t),
        r = i + 1,
        o = i - 1,
        s = 0.5 * Math.sin(t) * Math.sqrt((r / i) * (1 / n - 1) + 2),
        l = 2 * Math.sqrt(i) * s,
        c = r - o * a + l;
      (this.a[1] = (2 * (o - r * a)) / c),
        (this.a[2] = (r - o * a - l) / c),
        (this.b[0] = (i * (r + o * a + l)) / c),
        (this.b[1] = (-2 * i * (o + r * a)) / c),
        (this.b[2] = (i * (r + o * a - l)) / c),
        (this.order = 2);
    }
    peak2ndOrder(t, e, n) {
      const i = Math.sqrt(e),
        a = (n * t) / (i >= 1 ? i : 1 / i),
        r = Math.tan(0.5 * a),
        o = 1 + r / i;
      (this.b[0] = (1 + r * i) / o),
        (this.b[1] = this.a[1] = (-2 * Math.cos(t)) / o),
        (this.b[2] = (1 - r * i) / o),
        (this.a[2] = (1 - r / i) / o),
        (this.order = 2);
    }
  }
  class J {
    constructor() {
      (this.real = 0), (this.imag = 0), (this.denom = 1);
    }
    analyze(t, e) {
      this.analyzeComplex(t, Math.cos(e), Math.sin(e));
    }
    analyzeComplex(t, e, n) {
      const i = t.a,
        a = t.b,
        r = e,
        o = -n;
      let s = a[0] + a[1] * r,
        l = a[1] * o,
        c = 1 + i[1] * r,
        h = i[1] * o,
        p = r,
        d = o;
      for (let e = 2; e <= t.order; e++) {
        const t = p * o + d * r;
        (p = p * r - d * o),
          (d = t),
          (s += a[e] * p),
          (l += a[e] * d),
          (c += i[e] * p),
          (h += i[e] * d);
      }
      (this.denom = c * c + h * h),
        (this.real = s * c + l * h),
        (this.imag = l * c - s * h);
    }
    magnitude() {
      return (
        Math.sqrt(this.real * this.real + this.imag * this.imag) / this.denom
      );
    }
    angle() {
      return Math.atan2(this.imag, this.real);
    }
  }
  class K {
    constructor() {
      (this.a1 = 0),
        (this.a2 = 0),
        (this.b0 = 1),
        (this.b1 = 0),
        (this.b2 = 0),
        (this.a1Delta = 0),
        (this.a2Delta = 0),
        (this.b0Delta = 0),
        (this.b1Delta = 0),
        (this.b2Delta = 0),
        (this.output1 = 0),
        (this.output2 = 0),
        (this.useMultiplicativeInputCoefficients = !1);
    }
    resetOutput() {
      (this.output1 = 0), (this.output2 = 0);
    }
    loadCoefficientsWithGradient(t, e, n, i) {
      if (2 != t.order || 2 != e.order) throw new Error();
      (this.a1 = t.a[1]),
        (this.a2 = t.a[2]),
        (this.b0 = t.b[0]),
        (this.b1 = t.b[1]),
        (this.b2 = t.b[2]),
        (this.a1Delta = (e.a[1] - t.a[1]) * n),
        (this.a2Delta = (e.a[2] - t.a[2]) * n),
        i
          ? ((this.b0Delta = Math.pow(e.b[0] / t.b[0], n)),
            (this.b1Delta = Math.pow(e.b[1] / t.b[1], n)),
            (this.b2Delta = Math.pow(e.b[2] / t.b[2], n)))
          : ((this.b0Delta = (e.b[0] - t.b[0]) * n),
            (this.b1Delta = (e.b[1] - t.b[1]) * n),
            (this.b2Delta = (e.b[2] - t.b[2]) * n)),
        (this.useMultiplicativeInputCoefficients = i);
    }
  }
  function Y(t) {
    return 2 * Math.atan(0.5 * t);
  }
  const X = 1e-24;
  function Z(t, e, n) {
    return n <= (e -= 1) ? (n >= t ? n : t) : e;
  }
  function tt(t, e, n) {
    if (t <= n && n <= e) return n;
    throw new Error(`Value ${n} not in range [${t}, ${e}]`);
  }
  const et = [
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102, 103,
      104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
      119, 120, 121, 122, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
      78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 45, 95,
    ],
    nt = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62, 62, 0, 0,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 36, 37, 38, 39, 40, 41,
      42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
      60, 61, 0, 0, 0, 0, 63, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 0, 0, 0, 0, 0,
    ];
  class it {
    constructor(t, e, n) {
      (this.M = []), (this.S = 0);
      for (let i = e; i < n; i++) {
        const e = nt[t.charCodeAt(i)];
        this.M.push((e >> 5) & 1),
          this.M.push((e >> 4) & 1),
          this.M.push((e >> 3) & 1),
          this.M.push((e >> 2) & 1),
          this.M.push((e >> 1) & 1),
          this.M.push(1 & e);
      }
    }
    read(t) {
      let e = 0;
      for (; t > 0; ) (e <<= 1), (e += this.M[this.S++]), t--;
      return e;
    }
    readLongTail(t, e) {
      let n = t,
        i = e;
      for (; this.M[this.S++]; ) (n += 1 << i), i++;
      for (; i > 0; ) i--, this.M[this.S++] && (n += 1 << i);
      return n;
    }
    readPartDuration() {
      return this.readLongTail(1, 3);
    }
    readLegacyPartDuration() {
      return this.readLongTail(1, 2);
    }
    readPinCount() {
      return this.readLongTail(1, 0);
    }
    readPitchInterval() {
      return this.read(1) ? -this.readLongTail(1, 3) : this.readLongTail(1, 3);
    }
  }
  class at {
    constructor() {
      (this.I = 0), (this.M = []);
    }
    clear() {
      this.I = 0;
    }
    write(t, e) {
      for (t--; t >= 0; ) (this.M[this.I++] = (e >>> t) & 1), t--;
    }
    writeLongTail(t, e, n) {
      if (n < t) throw new Error("value out of bounds");
      n -= t;
      let i = e;
      for (; n >= 1 << i; ) (this.M[this.I++] = 1), (n -= 1 << i), i++;
      for (this.M[this.I++] = 0; i > 0; )
        i--, (this.M[this.I++] = (n >>> i) & 1);
    }
    writePartDuration(t) {
      this.writeLongTail(1, 3, t);
    }
    writePinCount(t) {
      this.writeLongTail(1, 0, t);
    }
    writePitchInterval(t) {
      t < 0
        ? (this.write(1, 1), this.writeLongTail(1, 3, -t))
        : (this.write(1, 0), this.writeLongTail(1, 3, t));
    }
    concat(t) {
      for (let e = 0; e < t.I; e++) this.M[this.I++] = t.M[e];
    }
    encodeBase64(t) {
      for (let e = 0; e < this.I; e += 6) {
        const n =
          (this.M[e] << 5) |
          (this.M[e + 1] << 4) |
          (this.M[e + 2] << 3) |
          (this.M[e + 3] << 2) |
          (this.M[e + 4] << 1) |
          this.M[e + 5];
        t.push(et[n]);
      }
      return t;
    }
    lengthBase64() {
      return Math.ceil(this.I / 6);
    }
  }
  function rt(t, e, n) {
    return { interval: t, time: e, size: n };
  }
  class ot {
    constructor(t, e, n, i, a = !1) {
      (this.pitches = [t]),
        (this.pins = [rt(0, 0, i), rt(0, n - e, a ? 0 : i)]),
        (this.start = e),
        (this.end = n),
        (this.continuesLastPattern = !1);
    }
    pickMainInterval() {
      let t = 0,
        e = 0;
      for (let n = 1; n < this.pins.length; n++) {
        const i = this.pins[n - 1],
          a = this.pins[n];
        if (i.interval == a.interval) {
          const n = a.time - i.time;
          t < n && ((t = n), (e = i.interval));
        }
      }
      if (0 == t) {
        let t = 0;
        for (let n = 0; n < this.pins.length; n++) {
          const i = this.pins[n];
          t < i.size && ((t = i.size), (e = i.interval));
        }
      }
      return e;
    }
    clone() {
      const t = new ot(-1, this.start, this.end, 3);
      (t.pitches = this.pitches.concat()), (t.pins = []);
      for (const e of this.pins) t.pins.push(rt(e.interval, e.time, e.size));
      return (t.continuesLastPattern = this.continuesLastPattern), t;
    }
    getEndPinIndex(t) {
      let e;
      for (
        e = 1;
        e < this.pins.length - 1 && !(this.pins[e].time + this.start > t);
        e++
      );
      return e;
    }
  }
  class st {
    constructor() {
      (this.notes = []), (this.instruments = [0]);
    }
    cloneNotes() {
      const t = [];
      for (const e of this.notes) t.push(e.clone());
      return t;
    }
    reset() {
      (this.notes.length = 0),
        (this.instruments[0] = 0),
        (this.instruments.length = 1);
    }
    toJsonObject(t, n, i) {
      const a = [];
      for (const r of this.notes) {
        let o = n.instruments[this.instruments[0]],
          s = Math.max(0, e.modCount - r.pitches[0] - 1),
          l = t.getVolumeCapForSetting(i, o.modulators[s], o.modFilterTypes[s]);
        const c = [];
        for (const n of r.pins) {
          let a = i ? Math.round(n.size) : Math.round((100 * n.size) / l);
          c.push({
            tick:
              ((n.time + r.start) * e.rhythms[t.rhythm].stepsPerBeat) /
              e.partsPerBeat,
            pitchBend: n.interval,
            volume: a,
            forMod: i,
          });
        }
        const h = { pitches: r.pitches, points: c };
        0 == r.start && (h.continuesLastPattern = r.continuesLastPattern),
          a.push(h);
      }
      const r = { notes: a };
      return (
        t.patternInstruments &&
          (r.instruments = this.instruments.map((t) => t + 1)),
        r
      );
    }
    fromJsonObject(t, n, i, a, r, o) {
      if (n.patternInstruments)
        if (Array.isArray(t.instruments)) {
          const a = t.instruments,
            r = Z(
              e.instrumentCountMin,
              n.getMaxInstrumentsPerPatternForChannel(i) + 1,
              a.length
            );
          for (let t = 0; t < r; t++)
            this.instruments[t] = Z(0, i.instruments.length, (0 | a[t]) - 1);
          this.instruments.length = r;
        } else
          (this.instruments[0] = Z(
            0,
            i.instruments.length,
            (0 | t.instrument) - 1
          )),
            (this.instruments.length = 1);
      if (t.notes && t.notes.length > 0) {
        const s = Math.min(
          n.beatsPerBar * e.partsPerBeat * (o ? e.modCount : 1),
          t.notes.length >>> 0
        );
        for (let l = 0; l < t.notes.length && !(l >= s); l++) {
          const s = t.notes[l];
          if (
            !(
              s &&
              s.pitches &&
              s.pitches.length >= 1 &&
              s.points &&
              s.points.length >= 2
            )
          )
            continue;
          const c = new ot(0, 0, 0, 0);
          (c.pitches = []), (c.pins = []);
          for (let t = 0; t < s.pitches.length; t++) {
            const n = 0 | s.pitches[t];
            if (
              -1 == c.pitches.indexOf(n) &&
              (c.pitches.push(n), c.pitches.length >= e.maxChordSize)
            )
              break;
          }
          if (c.pitches.length < 1) continue;
          let h = 0;
          for (let t = 0; t < s.points.length; t++) {
            const r = s.points[t];
            if (null == r || null == r.tick) continue;
            const l = null == r.pitchBend ? 0 : 0 | r.pitchBend,
              p = Math.round((+r.tick * e.partsPerBeat) / a);
            let d,
              m = i.instruments[this.instruments[0]],
              u = Math.max(0, e.modCount - c.pitches[0] - 1),
              f = n.getVolumeCapForSetting(
                o,
                m.modulators[u],
                m.modFilterTypes[u]
              );
            (d =
              null == r.volume
                ? f
                : null == r.forMod
                ? Math.max(
                    0,
                    Math.min(f, Math.round(((0 | r.volume) * f) / 100))
                  )
                : (0 | r.forMod) > 0
                ? Math.round(0 | r.volume)
                : Math.max(
                    0,
                    Math.min(f, Math.round(((0 | r.volume) * f) / 100))
                  )),
              p > n.beatsPerBar * e.partsPerBeat ||
                (0 == c.pins.length && ((c.start = p), (h = l)),
                c.pins.push(rt(l - h, p - c.start, d)));
          }
          if (c.pins.length < 2) continue;
          c.end = c.pins[c.pins.length - 1].time + c.start;
          const p = r ? e.drumCount - 1 : e.maxPitch;
          let d = p,
            m = 0;
          for (let t = 0; t < c.pitches.length; t++)
            (c.pitches[t] += h),
              (c.pitches[t] < 0 || c.pitches[t] > p) &&
                (c.pitches.splice(t, 1), t--),
              c.pitches[t] < d && (d = c.pitches[t]),
              c.pitches[t] > m && (m = c.pitches[t]);
          if (!(c.pitches.length < 1)) {
            for (let t = 0; t < c.pins.length; t++) {
              const e = c.pins[t];
              e.interval + d < 0 && (e.interval = -d),
                e.interval + m > p && (e.interval = p - m),
                t >= 2 &&
                  e.interval == c.pins[t - 1].interval &&
                  e.interval == c.pins[t - 2].interval &&
                  e.size == c.pins[t - 1].size &&
                  e.size == c.pins[t - 2].size &&
                  (c.pins.splice(t - 1, 1), t--);
            }
            0 == c.start
              ? (c.continuesLastPattern = !0 === s.continuesLastPattern)
              : (c.continuesLastPattern = !1),
              this.notes.push(c);
          }
        }
      }
    }
  }
  class lt {
    constructor(t) {
      (this.frequency = 0),
        (this.amplitude = 0),
        (this.waveform = 0),
        (this.pulseWidth = 0.5),
        this.reset(t);
    }
    reset(t) {
      (this.frequency = 0),
        (this.amplitude = t <= 1 ? e.operatorAmplitudeMax : 0),
        (this.waveform = 0),
        (this.pulseWidth = 5);
    }
    copy(t) {
      (this.frequency = t.frequency),
        (this.amplitude = t.amplitude),
        (this.waveform = t.waveform),
        (this.pulseWidth = t.pulseWidth);
    }
  }
  class ct {
    constructor(t) {
      (this.spectrum = []), (this.hash = -1), this.reset(t);
    }
    reset(t) {
      for (let n = 0; n < e.spectrumControlPoints; n++)
        if (t)
          this.spectrum[n] = Math.round(
            e.spectrumMax * (1 / Math.sqrt(1 + n / 3))
          );
        else {
          const t =
            0 == n ||
            7 == n ||
            11 == n ||
            14 == n ||
            16 == n ||
            18 == n ||
            21 == n ||
            23 == n ||
            n >= 25;
          this.spectrum[n] = t
            ? Math.max(0, Math.round(e.spectrumMax * (1 - n / 30)))
            : 0;
        }
      this.markCustomWaveDirty();
    }
    markCustomWaveDirty() {
      const t = St.fittingPowerOfTwo(e.spectrumMax + 2) - 1;
      let n = 0;
      for (const e of this.spectrum) n = (n * t + e) >>> 0;
      this.hash = n;
    }
  }
  class ht {
    constructor() {
      (this.wave = null), (this.P = -1);
    }
    getCustomWave(t, n) {
      if (this.P == t.hash) return this.wave;
      this.P = t.hash;
      const i = e.spectrumNoiseLength;
      (null != this.wave && this.wave.length == i + 1) ||
        (this.wave = new Float32Array(i + 1));
      const a = this.wave;
      for (let t = 0; t < i; t++) a[t] = 0;
      const r = [
        0,
        1 / 7,
        Math.log2(5 / 4),
        3 / 7,
        Math.log2(1.5),
        5 / 7,
        6 / 7,
      ];
      function o(t) {
        return (
          n +
          Math.floor(t / e.spectrumControlPointsPerOctave) +
          r[
            (t + e.spectrumControlPointsPerOctave) %
              e.spectrumControlPointsPerOctave
          ]
        );
      }
      let l = 1;
      for (let n = 0; n < e.spectrumControlPoints + 1; n++) {
        const r = n <= 0 ? 0 : t.spectrum[n - 1],
          c =
            n >= e.spectrumControlPoints
              ? t.spectrum[e.spectrumControlPoints - 1]
              : t.spectrum[n],
          h = o(n - 1);
        let p = o(n);
        n >= e.spectrumControlPoints && (p = 14 + 0.25 * (p - 14)),
          (0 == r && 0 == c) ||
            (l +=
              0.02 * s(a, i, h, p, r / e.spectrumMax, c / e.spectrumMax, -0.5));
      }
      return (
        t.spectrum[e.spectrumControlPoints - 1] > 0 &&
          (l +=
            0.02 *
            s(
              a,
              i,
              14 + 0.25 * (o(e.spectrumControlPoints) - 14),
              14,
              t.spectrum[e.spectrumControlPoints - 1] / e.spectrumMax,
              0,
              -0.5
            )),
        U(a, i),
        W(a, 5 / (Math.sqrt(i) * Math.pow(l, 0.75))),
        (a[i] = a[0]),
        a
      );
    }
  }
  class pt {
    constructor() {
      (this.harmonics = []), (this.hash = -1), this.reset();
    }
    reset() {
      for (let t = 0; t < e.harmonicsControlPoints; t++) this.harmonics[t] = 0;
      (this.harmonics[0] = e.harmonicsMax),
        (this.harmonics[3] = e.harmonicsMax),
        (this.harmonics[6] = e.harmonicsMax),
        this.markCustomWaveDirty();
    }
    markCustomWaveDirty() {
      const t = St.fittingPowerOfTwo(e.harmonicsMax + 2) - 1;
      let n = 0;
      for (const e of this.harmonics) n = (n * t + e) >>> 0;
      this.hash = n;
    }
  }
  class dt {
    constructor() {
      (this.wave = null), (this.P = -1);
    }
    getCustomWave(t, n) {
      if (this.P == t.hash && this.T == n) return this.wave;
      (this.P = t.hash), (this.T = n);
      const i =
          7 == n ? e.harmonicsRenderedForPickedString : e.harmonicsRendered,
        a = e.harmonicsWavelength,
        r = o(0, null, null);
      (null != this.wave && this.wave.length == a + 1) ||
        (this.wave = new Float32Array(a + 1));
      const s = this.wave;
      for (let t = 0; t < a; t++) s[t] = 0;
      let l = 1;
      for (let n = 0; n < i; n++) {
        const o = n + 1;
        let c =
          n < e.harmonicsControlPoints
            ? t.harmonics[n]
            : t.harmonics[e.harmonicsControlPoints - 1];
        n >= e.harmonicsControlPoints &&
          (c *=
            1 -
            (n - e.harmonicsControlPoints) / (i - e.harmonicsControlPoints));
        const h = c / e.harmonicsMax;
        let p = Math.pow(2, c - e.harmonicsMax + 1) * Math.sqrt(h);
        n < e.harmonicsControlPoints && (l += p),
          (p *= Math.pow(o, -0.25)),
          (p *= r[n + 589]),
          (s[a - o] = p);
      }
      U(s, a);
      const c = 1 / Math.pow(l, 0.7);
      for (let t = 0; t < s.length; t++) s[t] *= c;
      return (
        (function (t) {
          let e = 0;
          for (let n = 0; n < t.length; n++) {
            const i = t[n];
            (t[n] = e), (e += i);
          }
        })(s),
        (s[a] = s[0]),
        s
      );
    }
  }
  class mt {
    constructor() {
      (this.freq = 0), (this.gain = e.filterGainCenter), (this.type = 2);
    }
    set(t, e) {
      (this.freq = t), (this.gain = e);
    }
    getHz() {
      return mt.getHzFromSettingValue(this.freq);
    }
    static getHzFromSettingValue(t) {
      return (
        e.filterFreqReferenceHz *
        Math.pow(2, (t - e.filterFreqReferenceSetting) * e.filterFreqStep)
      );
    }
    static getSettingValueFromHz(t) {
      return (
        Math.log2(t / e.filterFreqReferenceHz) / e.filterFreqStep +
        e.filterFreqReferenceSetting
      );
    }
    static getRoundedSettingValueFromHz(t) {
      return Math.max(
        0,
        Math.min(e.filterFreqRange - 1, Math.round(mt.getSettingValueFromHz(t)))
      );
    }
    getLinearGain(t = 1) {
      const n = (this.gain - e.filterGainCenter) * e.filterGainStep,
        i = 2 == this.type ? 0 : -0.5,
        a = i + (n - i) * t;
      return Math.pow(2, a);
    }
    static getRoundedSettingValueFromLinearGain(t) {
      return Math.max(
        0,
        Math.min(
          e.filterGainRange - 1,
          Math.round(Math.log2(t) / e.filterGainStep + e.filterGainCenter)
        )
      );
    }
    toCoefficients(t, n, i = 1, a = 1) {
      const r =
          (2 *
            Math.PI *
            Math.max(
              e.filterFreqMinHz,
              Math.min(e.filterFreqMaxHz, i * this.getHz())
            )) /
          n,
        o = this.getLinearGain(a);
      switch (this.type) {
        case 0:
          t.lowPass2ndOrderButterworth(r, o);
          break;
        case 1:
          t.highPass2ndOrderButterworth(r, o);
          break;
        case 2:
          t.peak2ndOrder(r, o, 1);
          break;
        default:
          throw new Error();
      }
    }
    getVolumeCompensationMult() {
      const t = (this.freq - e.filterFreqReferenceSetting) * e.filterFreqStep,
        n = (this.gain - e.filterGainCenter) * e.filterGainStep;
      switch (this.type) {
        case 0:
          const i = (Math.pow(2, t) * e.filterFreqReferenceHz) / 8e3,
            a = (Math.sqrt(1 + 4 * i) - 1) / 2,
            r = Math.log2(a);
          return Math.pow(
            0.5,
            0.2 * Math.max(0, n + 1) +
              Math.min(0, Math.max(-3, 0.595 * r + 0.35 * Math.min(0, n + 1)))
          );
        case 1:
          return Math.pow(
            0.5,
            0.125 * Math.max(0, n + 1) +
              Math.min(
                0,
                0.3 * (-t - Math.log2(e.filterFreqReferenceHz / 125)) +
                  0.2 * Math.min(0, n + 1)
              )
          );
        case 2:
          const o = t + Math.log2(e.filterFreqReferenceHz / 2e3),
            s = Math.pow(1 / (1 + Math.pow(o / 3, 2)), 2);
          return Math.pow(
            0.5,
            0.125 * Math.max(0, n) + 0.1 * s * Math.min(0, n)
          );
        default:
          throw new Error();
      }
    }
  }
  class ut {
    constructor() {
      (this.controlPoints = []), (this.controlPointCount = 0), this.reset();
    }
    reset() {
      this.controlPointCount = 0;
    }
    addPoint(t, e, n) {
      let i;
      this.controlPoints.length <= this.controlPointCount
        ? ((i = new mt()), (this.controlPoints[this.controlPointCount] = i))
        : (i = this.controlPoints[this.controlPointCount]),
        this.controlPointCount++,
        (i.type = t),
        i.set(e, n);
    }
    toJsonObject() {
      const t = [];
      for (let n = 0; n < this.controlPointCount; n++) {
        const i = this.controlPoints[n];
        t.push({
          type: e.filterTypeNames[i.type],
          cutoffHz: Math.round(100 * i.getHz()) / 100,
          linearGain: Math.round(1e4 * i.getLinearGain()) / 1e4,
        });
      }
      return t;
    }
    fromJsonObject(t) {
      if (((this.controlPoints.length = 0), t))
        for (const n of t) {
          const t = new mt();
          (t.type = e.filterTypeNames.indexOf(n.type)),
            -1 == t.type && (t.type = 2),
            null != n.cutoffHz
              ? (t.freq = mt.getRoundedSettingValueFromHz(n.cutoffHz))
              : (t.freq = 0),
            null != n.linearGain
              ? (t.gain = mt.getRoundedSettingValueFromLinearGain(n.linearGain))
              : (t.gain = e.filterGainCenter),
            this.controlPoints.push(t);
        }
      this.controlPointCount = this.controlPoints.length;
    }
    static filtersCanMorph(t, e) {
      if (t.controlPointCount != e.controlPointCount) return !1;
      for (let n = 0; n < t.controlPointCount; n++)
        if (t.controlPoints[n].type != e.controlPoints[n].type) return !1;
      return !0;
    }
    static lerpFilters(t, e, n) {
      let i = new ut();
      if (null == t) return t;
      if (null == e) return e;
      if (((n = Math.max(0, Math.min(1, n))), this.filtersCanMorph(t, e))) {
        for (let a = 0; a < t.controlPointCount; a++)
          (i.controlPoints[a] = new mt()),
            (i.controlPoints[a].type = t.controlPoints[a].type),
            (i.controlPoints[a].freq =
              t.controlPoints[a].freq +
              (e.controlPoints[a].freq - t.controlPoints[a].freq) * n),
            (i.controlPoints[a].gain =
              t.controlPoints[a].gain +
              (e.controlPoints[a].gain - t.controlPoints[a].gain) * n);
        return (i.controlPointCount = t.controlPointCount), i;
      }
      return n >= 1 ? e : t;
    }
    convertLegacySettings(t, e, n) {
      this.reset();
      const i = 2 * Math.asin(0.475),
        a = e > 1,
        r = 0 == e,
        o = 10 == t,
        s = 3 == n.type || 4 == n.type || 8 == n.type || 0 == n.type,
        l = 48e3,
        c = 8e3 * Math.pow(2, 0.5 * (t - 10)),
        h = Math.min(i, (2 * Math.PI * c) / l);
      if (1 == n.type && !a && o);
      else if (r) {
        const t = 3.5,
          e = h * Math.pow(2, t),
          n = (l * (e / (1 + e / Math.PI))) / (2 * Math.PI),
          i = mt.getRoundedSettingValueFromHz(n),
          a = mt.getHzFromSettingValue(i),
          r = (2 * Math.PI * a) / l,
          o = new _();
        o.lowPass1stOrderSimplified(h);
        const c = new J();
        c.analyze(o, r);
        const p = c.magnitude();
        let d = Math.log2(p);
        (d = 0.82 * (d + t) - t), s && (d = Math.min(d, -1));
        const m = Math.pow(2, d),
          u = mt.getRoundedSettingValueFromLinearGain(m);
        this.addPoint(0, i, u);
      } else {
        const t = 0.5 / (1 - 0.95 * Math.sqrt(Math.max(0, e - 1) / 6)),
          n = 0.5 / t,
          i =
            h +
            (h * ((h / ((2 * Math.PI * 8e3) / l)) * Math.pow(n, 0.9) + 1) - h) *
              n;
        let r;
        r = s
          ? (l * Math.min(i, h * Math.pow(2, 0.25))) / (2 * Math.PI)
          : (l * i) / (2 * Math.PI);
        const o = mt.getRoundedSettingValueFromHz(r);
        let c;
        if (s) c = t;
        else {
          const e = new _();
          e.lowPass2ndOrderSimplified(h, t);
          const n = new J();
          n.analyze(e, i), (c = n.magnitude());
        }
        a || (c = Math.min(c, Math.sqrt(0.5)));
        const p = mt.getRoundedSettingValueFromLinearGain(c);
        this.addPoint(0, o, p);
      }
      this.controlPoints.length = this.controlPointCount;
    }
    convertLegacySettingsForSynth(t, e, n = !1) {
      this.reset();
      const i = 2 * Math.asin(0.475),
        a = 0 == e && n,
        r = 48e3,
        o = 8e3 * Math.pow(2, 0.5 * (t - 10)),
        s = Math.min(i, (2 * Math.PI * o) / r);
      if (a) {
        const t = 3.5,
          e = s * Math.pow(2, t),
          n = (r * (e / (1 + e / Math.PI))) / (2 * Math.PI),
          i = mt.getRoundedSettingValueFromHz(n),
          a = mt.getHzFromSettingValue(i),
          o = (2 * Math.PI * a) / r,
          l = new _();
        l.lowPass1stOrderSimplified(s);
        const c = new J();
        c.analyze(l, o);
        const h = c.magnitude();
        let p = Math.log2(h);
        p = 0.82 * (p + t) - t;
        const d = Math.pow(2, p),
          m = mt.getRoundedSettingValueFromLinearGain(d);
        this.addPoint(0, i, m);
      } else {
        const t = 0.5 / (1 - 0.95 * Math.sqrt(Math.max(0, e - 1) / 6)),
          n = 0.5 / t,
          i =
            s +
            (s * ((s / ((2 * Math.PI * 8e3) / r)) * Math.pow(n, 0.9) + 1) - s) *
              n;
        let a;
        a = (r * i) / (2 * Math.PI);
        const o = mt.getSettingValueFromHz(a);
        let l;
        const c = new _();
        c.lowPass2ndOrderSimplified(s, t);
        const h = new J();
        h.analyze(c, i), (l = h.magnitude());
        const p = mt.getRoundedSettingValueFromLinearGain(l);
        this.addPoint(0, o, p);
      }
    }
  }
  class ft {
    constructor() {
      (this.target = 0), (this.index = 0), (this.envelope = 0), this.reset();
    }
    reset() {
      (this.target = 0), (this.index = 0), (this.envelope = 0);
    }
    toJsonObject() {
      const t = {
        target: e.instrumentAutomationTargets[this.target].name,
        envelope: e.envelopes[this.envelope].name,
      };
      return (
        e.instrumentAutomationTargets[this.target].maxCount > 1 &&
          (t.index = this.index),
        t
      );
    }
    fromJsonObject(t) {
      this.reset();
      let n = e.instrumentAutomationTargets.dictionary[t.target];
      null == n && (n = e.instrumentAutomationTargets.dictionary.noteVolume),
        (this.target = n.index);
      let i = e.envelopes.dictionary[t.envelope];
      null == i && (i = e.envelopes.dictionary.none),
        (this.envelope = i.index),
        null != t.index
          ? (this.index = Z(
              0,
              e.instrumentAutomationTargets[this.target].maxCount,
              0 | t.index
            ))
          : (this.index = 0);
    }
  }
  class yt {
    constructor(t, n) {
      if (
        ((this.type = 0),
        (this.preset = 0),
        (this.chipWave = 2),
        (this.chipNoise = 1),
        (this.eqFilter = new ut()),
        (this.eqFilterType = !1),
        (this.eqFilterSimpleCut = e.filterSimpleCutRange - 1),
        (this.eqFilterSimplePeak = 0),
        (this.noteFilter = new ut()),
        (this.noteFilterType = !1),
        (this.noteFilterSimpleCut = e.filterSimpleCutRange - 1),
        (this.noteFilterSimplePeak = 0),
        (this.eqSubFilters = []),
        (this.noteSubFilters = []),
        (this.envelopes = []),
        (this.fadeIn = 0),
        (this.fadeOut = e.fadeOutNeutral),
        (this.envelopeCount = 0),
        (this.transition = e.transitions.dictionary.normal.index),
        (this.pitchShift = 0),
        (this.detune = 0),
        (this.vibrato = 0),
        (this.interval = 0),
        (this.vibratoDepth = 0),
        (this.vibratoSpeed = 10),
        (this.vibratoDelay = 0),
        (this.vibratoType = 0),
        (this.envelopeSpeed = 12),
        (this.discreteEnvelope = !1),
        (this.unison = 0),
        (this.effects = 0),
        (this.chord = 1),
        (this.volume = 0),
        (this.pan = e.panCenter),
        (this.panDelay = 10),
        (this.arpeggioSpeed = 12),
        (this.fastTwoNoteArp = !1),
        (this.legacyTieOver = !1),
        (this.clicklessTransition = !1),
        (this.aliases = !1),
        (this.pulseWidth = e.pulseWidthRange),
        (this.supersawDynamism = e.supersawDynamismMax),
        (this.supersawSpread = Math.ceil(e.supersawSpreadMax / 2)),
        (this.supersawShape = 0),
        (this.stringSustain = 10),
        (this.stringSustainType = 1),
        (this.distortion = 0),
        (this.bitcrusherFreq = 0),
        (this.bitcrusherQuantization = 0),
        (this.chorus = 0),
        (this.reverb = 0),
        (this.echoSustain = 0),
        (this.echoDelay = 0),
        (this.algorithm = 0),
        (this.feedbackType = 0),
        (this.feedbackAmplitude = 0),
        (this.customChipWave = new Float32Array(64)),
        (this.customChipWaveIntegral = new Float32Array(65)),
        (this.operators = []),
        (this.harmonicsWave = new pt()),
        (this.drumsetEnvelopes = []),
        (this.drumsetSpectrumWaves = []),
        (this.modChannels = []),
        (this.modInstruments = []),
        (this.modulators = []),
        (this.modFilterTypes = []),
        (this.invalidModulators = []),
        n)
      )
        for (let t = 0; t < e.modCount; t++)
          this.modChannels.push(-2),
            this.modInstruments.push(0),
            this.modulators.push(e.modulators.dictionary.none.index);
      this.spectrumWave = new ct(t);
      for (let t = 0; t < e.operatorCount; t++) this.operators[t] = new lt(t);
      for (let t = 0; t < e.drumCount; t++)
        (this.drumsetEnvelopes[t] = e.envelopes.dictionary["twang 2"].index),
          (this.drumsetSpectrumWaves[t] = new ct(!0));
      for (let t = 0; t < 64; t++)
        this.customChipWave[t] = 24 - Math.floor(0.75 * t);
      let i = 0;
      for (let t = 0; t < this.customChipWave.length; t++)
        i += this.customChipWave[t];
      const a = i / this.customChipWave.length;
      let r = 0,
        o = 0;
      for (let t = 0; t < this.customChipWave.length; t++)
        (r += o),
          (o = this.customChipWave[t] - a),
          (this.customChipWaveIntegral[t] = r);
      this.customChipWaveIntegral[64] = 0;
    }
    setTypeAndReset(t, n, i) {
      i && (t = 10),
        (this.type = t),
        (this.preset = t),
        (this.volume = 0),
        (this.effects = 4),
        (this.chorus = e.chorusRange - 1),
        (this.reverb = 0),
        (this.echoSustain = Math.floor(0.5 * (e.echoSustainRange - 1))),
        (this.echoDelay = Math.floor(0.5 * (e.echoDelayRange - 1))),
        this.eqFilter.reset(),
        (this.eqFilterType = !1),
        (this.eqFilterSimpleCut = e.filterSimpleCutRange - 1),
        (this.eqFilterSimplePeak = 0);
      for (let t = 0; t < e.filterMorphCount; t++)
        (this.eqSubFilters[t] = null), (this.noteSubFilters[t] = null);
      switch (
        (this.noteFilter.reset(),
        (this.noteFilterType = !1),
        (this.noteFilterSimpleCut = e.filterSimpleCutRange - 1),
        (this.noteFilterSimplePeak = 0),
        (this.distortion = Math.floor(0.75 * (e.distortionRange - 1))),
        (this.bitcrusherFreq = Math.floor(0.5 * (e.bitcrusherFreqRange - 1))),
        (this.bitcrusherQuantization = Math.floor(
          0.5 * (e.bitcrusherQuantizationRange - 1)
        )),
        (this.pan = e.panCenter),
        (this.panDelay = 10),
        (this.pitchShift = e.pitchShiftCenter),
        (this.detune = e.detuneCenter),
        (this.vibrato = 0),
        (this.unison = 0),
        (this.stringSustain = 10),
        (this.stringSustainType = e.enableAcousticSustain ? 1 : 0),
        (this.clicklessTransition = !1),
        (this.arpeggioSpeed = 12),
        (this.envelopeSpeed = 12),
        (this.discreteEnvelope = !1),
        (this.legacyTieOver = !1),
        (this.aliases = !1),
        (this.fadeIn = 0),
        (this.fadeOut = e.fadeOutNeutral),
        (this.transition = e.transitions.dictionary.normal.index),
        (this.envelopeCount = 0),
        t)
      ) {
        case 0:
          (this.chipWave = 2),
            (this.chord = e.chords.dictionary.arpeggio.index);
          break;
        case 9:
          (this.chipWave = 2),
            (this.chord = e.chords.dictionary.arpeggio.index);
          for (let t = 0; t < 64; t++)
            this.customChipWave[t] = 24 - Math.floor(0.75 * t);
          let i = 0;
          for (let t = 0; t < this.customChipWave.length; t++)
            i += this.customChipWave[t];
          const a = i / this.customChipWave.length;
          let r = 0,
            o = 0;
          for (let t = 0; t < this.customChipWave.length; t++)
            (r += o),
              (o = this.customChipWave[t] - a),
              (this.customChipWaveIntegral[t] = r);
          this.customChipWaveIntegral[64] = 0;
          break;
        case 1:
          (this.chord = e.chords.dictionary["custom interval"].index),
            (this.algorithm = 0),
            (this.feedbackType = 0),
            (this.feedbackAmplitude = 0);
          for (let t = 0; t < this.operators.length; t++)
            this.operators[t].reset(t);
          break;
        case 2:
          (this.chipNoise = 1),
            (this.chord = e.chords.dictionary.arpeggio.index);
          break;
        case 3:
          (this.chord = e.chords.dictionary.simultaneous.index),
            this.spectrumWave.reset(n);
          break;
        case 4:
          this.chord = e.chords.dictionary.simultaneous.index;
          for (let t = 0; t < e.drumCount; t++)
            (this.drumsetEnvelopes[t] =
              e.envelopes.dictionary["twang 2"].index),
              null == this.drumsetSpectrumWaves[t] &&
                (this.drumsetSpectrumWaves[t] = new ct(!0)),
              this.drumsetSpectrumWaves[t].reset(n);
          break;
        case 5:
          (this.chord = e.chords.dictionary.simultaneous.index),
            this.harmonicsWave.reset();
          break;
        case 6:
          (this.chord = e.chords.dictionary.arpeggio.index),
            (this.pulseWidth = e.pulseWidthRange);
          break;
        case 7:
          (this.chord = e.chords.dictionary.strum.index),
            this.harmonicsWave.reset();
          break;
        case 10:
          (this.transition = 0),
            (this.vibrato = 0),
            (this.interval = 0),
            (this.effects = 0),
            (this.chord = 0),
            (this.modChannels = []),
            (this.modInstruments = []),
            (this.modulators = []);
          for (let t = 0; t < e.modCount; t++)
            this.modChannels.push(-2),
              this.modInstruments.push(0),
              this.modulators.push(e.modulators.dictionary.none.index),
              (this.invalidModulators[t] = !1),
              (this.modFilterTypes[t] = 0);
          break;
        case 8:
          (this.chord = e.chords.dictionary.arpeggio.index),
            (this.supersawDynamism = e.supersawDynamismMax),
            (this.supersawSpread = Math.ceil(e.supersawSpreadMax / 2)),
            (this.supersawShape = 0),
            (this.pulseWidth = e.pulseWidthRange - 1);
          break;
        default:
          throw new Error("Unrecognized instrument type: " + t);
      }
      this.chord != e.chords.dictionary.simultaneous.index &&
        (this.effects = 2048 | this.effects);
    }
    convertLegacySettings(t, n) {
      let i = t.filterCutoff,
        a = t.filterResonance,
        r = t.filterEnvelope,
        o = t.pulseEnvelope,
        s = t.operatorEnvelopes,
        l = t.feedbackEnvelope;
      null == i && (i = 0 == this.type ? 6 : 10),
        null == a && (a = 0),
        null == r && (r = e.envelopes.dictionary.none),
        null == o &&
          (o = e.envelopes.dictionary[6 == this.type ? "twang 2" : "none"]),
        null == s &&
          (s = [
            e.envelopes.dictionary[1 == this.type ? "note size" : "none"],
            e.envelopes.dictionary.none,
            e.envelopes.dictionary.none,
            e.envelopes.dictionary.none,
          ]),
        null == l && (l = e.envelopes.dictionary.none);
      10 == i && 2 == r.type && (r = e.envelopes.dictionary.none);
      const c = e.algorithms[this.algorithm].carrierCount;
      let h = !0,
        p = !0,
        d = 0 == r.type || 0 == o.type;
      if (1 == this.type) {
        d = d || 0 == l.type;
        for (let t = 0; t < s.length; t++)
          t < c
            ? 0 != s[t].type
              ? (p = !1)
              : (h = !1)
            : (d = d || 0 == s[t].type);
      }
      (this.envelopeCount = 0),
        1 == this.type &&
          (p && d
            ? this.addEnvelope(
                e.instrumentAutomationTargets.dictionary.noteVolume.index,
                0,
                e.envelopes.dictionary["note size"].index
              )
            : h &&
              !d &&
              this.addEnvelope(
                e.instrumentAutomationTargets.dictionary.none.index,
                0,
                e.envelopes.dictionary["note size"].index
              )),
        1 == r.type
          ? (this.noteFilter.reset(),
            (this.noteFilterType = !1),
            this.eqFilter.convertLegacySettings(i, a, r),
            (this.effects &= -33),
            (n || this.eqFilterType) &&
              ((this.eqFilterType = !0),
              (this.eqFilterSimpleCut = i),
              (this.eqFilterSimplePeak = a)))
          : (this.eqFilter.reset(),
            (this.eqFilterType = !1),
            (this.noteFilterType = !1),
            this.noteFilter.convertLegacySettings(i, a, r),
            (this.effects |= 32),
            this.addEnvelope(
              e.instrumentAutomationTargets.dictionary.noteFilterAllFreqs.index,
              0,
              r.index
            ),
            (n || this.noteFilterType) &&
              ((this.noteFilterType = !0),
              (this.noteFilterSimpleCut = i),
              (this.noteFilterSimplePeak = a))),
        1 != o.type &&
          this.addEnvelope(
            e.instrumentAutomationTargets.dictionary.pulseWidth.index,
            0,
            o.index
          );
      for (let t = 0; t < s.length; t++)
        (t < c && p) ||
          (1 != s[t].type &&
            this.addEnvelope(
              e.instrumentAutomationTargets.dictionary.operatorAmplitude.index,
              t,
              s[t].index
            ));
      1 != l.type &&
        this.addEnvelope(
          e.instrumentAutomationTargets.dictionary.feedbackAmplitude.index,
          0,
          l.index
        );
    }
    toJsonObject() {
      const t = {
        type: e.instrumentTypeNames[this.type],
        volume: this.volume,
        eqFilter: this.eqFilter.toJsonObject(),
        eqFilterType: this.eqFilterType,
        eqSimpleCut: this.eqFilterSimpleCut,
        eqSimplePeak: this.eqFilterSimplePeak,
        envelopeSpeed: this.envelopeSpeed,
        discreteEnvelope: this.discreteEnvelope,
      };
      this.preset != this.type && (t.preset = this.preset);
      for (let n = 0; n < e.filterMorphCount; n++)
        null != this.eqSubFilters[n] &&
          (t["eqSubFilters" + n] = this.eqSubFilters[n].toJsonObject());
      const n = [];
      for (const t of e.effectOrder)
        this.effects & (1 << t) && n.push(e.effectNames[t]);
      if (
        ((t.effects = n),
        d(this.effects) &&
          ((t.transition = e.transitions[this.transition].name),
          (t.clicklessTransition = this.clicklessTransition)),
        m(this.effects) &&
          ((t.chord = this.getChord().name),
          (t.fastTwoNoteArp = this.fastTwoNoteArp),
          (t.arpeggioSpeed = this.arpeggioSpeed)),
        u(this.effects) && (t.pitchShiftSemitones = this.pitchShift),
        f(this.effects) && (t.detuneCents = St.detuneToCents(this.detune)),
        y(this.effects) &&
          (-1 == this.vibrato && (this.vibrato = 5),
          5 != this.vibrato
            ? (t.vibrato = e.vibratos[this.vibrato].name)
            : (t.vibrato = "custom"),
          (t.vibratoDepth = this.vibratoDepth),
          (t.vibratoDelay = this.vibratoDelay),
          (t.vibratoSpeed = this.vibratoSpeed),
          (t.vibratoType = this.vibratoType)),
        b(this.effects))
      ) {
        (t.noteFilterType = this.noteFilterType),
          (t.noteSimpleCut = this.noteFilterSimpleCut),
          (t.noteSimplePeak = this.noteFilterSimplePeak),
          (t.noteFilter = this.noteFilter.toJsonObject());
        for (let n = 0; n < e.filterMorphCount; n++)
          null != this.noteSubFilters[n] &&
            (t["noteSubFilters" + n] = this.noteSubFilters[n].toJsonObject());
      }
      if (
        (g(this.effects) &&
          ((t.distortion = Math.round(
            (100 * this.distortion) / (e.distortionRange - 1)
          )),
          (t.aliases = this.aliases)),
        v(this.effects) &&
          ((t.bitcrusherOctave =
            (e.bitcrusherFreqRange - 1 - this.bitcrusherFreq) *
            e.bitcrusherOctaveStep),
          (t.bitcrusherQuantization = Math.round(
            (100 * this.bitcrusherQuantization) /
              (e.bitcrusherQuantizationRange - 1)
          ))),
        k(this.effects) &&
          ((t.pan = Math.round((100 * (this.pan - e.panCenter)) / e.panCenter)),
          (t.panDelay = this.panDelay)),
        w(this.effects) &&
          (t.chorus = Math.round((100 * this.chorus) / (e.chorusRange - 1))),
        M(this.effects) &&
          ((t.echoSustain = Math.round(
            (100 * this.echoSustain) / (e.echoSustainRange - 1)
          )),
          (t.echoDelayBeats =
            Math.round(
              (1e3 * (this.echoDelay + 1) * e.echoDelayStepTicks) /
                (e.ticksPerPart * e.partsPerBeat)
            ) / 1e3)),
        F(this.effects) &&
          (t.reverb = Math.round((100 * this.reverb) / (e.reverbRange - 1))),
        4 != this.type &&
          ((t.fadeInSeconds =
            Math.round(1e4 * St.fadeInSettingToSeconds(this.fadeIn)) / 1e4),
          (t.fadeOutTicks = St.fadeOutSettingToTicks(this.fadeOut))),
        5 == this.type || 7 == this.type)
      ) {
        t.harmonics = [];
        for (let n = 0; n < e.harmonicsControlPoints; n++)
          t.harmonics[n] = Math.round(
            (100 * this.harmonicsWave.harmonics[n]) / e.harmonicsMax
          );
      }
      if (2 == this.type) t.wave = e.chipNoises[this.chipNoise].name;
      else if (3 == this.type) {
        t.spectrum = [];
        for (let n = 0; n < e.spectrumControlPoints; n++)
          t.spectrum[n] = Math.round(
            (100 * this.spectrumWave.spectrum[n]) / e.spectrumMax
          );
      } else if (4 == this.type) {
        t.drums = [];
        for (let n = 0; n < e.drumCount; n++) {
          const i = [];
          for (let t = 0; t < e.spectrumControlPoints; t++)
            i[t] = Math.round(
              (100 * this.drumsetSpectrumWaves[n].spectrum[t]) / e.spectrumMax
            );
          t.drums[n] = {
            filterEnvelope: this.getDrumsetEnvelope(n).name,
            spectrum: i,
          };
        }
      } else if (0 == this.type)
        (t.wave = e.chipWaves[this.chipWave].name),
          (t.unison = e.unisons[this.unison].name);
      else if (6 == this.type) t.pulseWidth = this.pulseWidth;
      else if (8 == this.type)
        (t.pulseWidth = this.pulseWidth),
          (t.dynamism = Math.round(
            (100 * this.supersawDynamism) / e.supersawDynamismMax
          )),
          (t.spread = Math.round(
            (100 * this.supersawSpread) / e.supersawSpreadMax
          )),
          (t.shape = Math.round(
            (100 * this.supersawShape) / e.supersawShapeMax
          ));
      else if (7 == this.type)
        (t.unison = e.unisons[this.unison].name),
          (t.stringSustain = Math.round(
            (100 * this.stringSustain) / (e.stringSustainRange - 1)
          )),
          e.enableAcousticSustain &&
            (t.stringSustainType = e.sustainTypeNames[this.stringSustainType]);
      else if (5 == this.type) t.unison = e.unisons[this.unison].name;
      else if (1 == this.type) {
        const n = [];
        for (const t of this.operators)
          n.push({
            frequency: e.operatorFrequencies[t.frequency].name,
            amplitude: t.amplitude,
            waveform: e.operatorWaves[t.waveform].name,
            pulseWidth: t.pulseWidth,
          });
        (t.algorithm = e.algorithms[this.algorithm].name),
          (t.feedbackType = e.feedbacks[this.feedbackType].name),
          (t.feedbackAmplitude = this.feedbackAmplitude),
          (t.operators = n);
      } else if (9 == this.type) {
        (t.wave = e.chipWaves[this.chipWave].name),
          (t.unison = e.unisons[this.unison].name),
          (t.customChipWave = new Float64Array(64)),
          (t.customChipWaveIntegral = new Float64Array(65));
        for (let e = 0; e < this.customChipWave.length; e++)
          t.customChipWave[e] = this.customChipWave[e];
      } else {
        if (10 != this.type) throw new Error("Unrecognized instrument type");
        (t.modChannels = []),
          (t.modInstruments = []),
          (t.modSettings = []),
          (t.modFilterTypes = []);
        for (let n = 0; n < e.modCount; n++)
          (t.modChannels[n] = this.modChannels[n]),
            (t.modInstruments[n] = this.modInstruments[n]),
            (t.modSettings[n] = this.modulators[n]),
            (t.modFilterTypes[n] = this.modFilterTypes[n]);
      }
      const i = [];
      for (let t = 0; t < this.envelopeCount; t++)
        i.push(this.envelopes[t].toJsonObject());
      return (t.envelopes = i), t;
    }
    fromJsonObject(t, n, i, a, r, o = 0) {
      null == t && (t = {});
      let s = e.instrumentTypeNames.indexOf(t.type);
      if (
        (-1 == s && (s = i ? 10 : n ? 2 : 0),
        this.setTypeAndReset(s, n, i),
        (this.effects &= -5),
        null != t.preset && (this.preset = t.preset >>> 0),
        null != t.volume
          ? (this.volume = Z(
              -e.volumeRange / 2,
              e.volumeRange / 2 + 1,
              0 | t.volume
            ))
          : (this.volume = 0),
        null != t.envelopeSpeed
          ? (this.envelopeSpeed = Z(
              0,
              e.modulators.dictionary["envelope speed"].maxRawVol + 1,
              0 | t.envelopeSpeed
            ))
          : (this.envelopeSpeed = 12),
        null != t.discreteEnvelope
          ? (this.discreteEnvelope = t.discreteEnvelope)
          : (this.discreteEnvelope = !1),
        Array.isArray(t.effects))
      ) {
        let n = 0;
        for (let i = 0; i < t.effects.length; i++)
          n |= 1 << e.effectNames.indexOf(t.effects[i]);
        this.effects = 4095 & n;
      } else {
        const e = ["none", "reverb", "chorus", "chorus & reverb"];
        (this.effects = e.indexOf(t.effects)),
          -1 == this.effects && (this.effects = 2 == this.type ? 0 : 1);
      }
      this.transition = e.transitions.dictionary.normal.index;
      const l = t.transition || t.envelope;
      if (null != l) {
        let n = e.transitions.dictionary[l];
        if (null == t.fadeInSeconds || null == t.fadeOutTicks) {
          const t = {
            binary: {
              transition: "interrupt",
              fadeInSeconds: 0,
              fadeOutTicks: -1,
            },
            seamless: {
              transition: "interrupt",
              fadeInSeconds: 0,
              fadeOutTicks: -1,
            },
            sudden: {
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: -3,
            },
            hard: { transition: "normal", fadeInSeconds: 0, fadeOutTicks: -3 },
            smooth: {
              transition: "normal",
              fadeInSeconds: 0.025,
              fadeOutTicks: -3,
            },
            soft: {
              transition: "normal",
              fadeInSeconds: 0.025,
              fadeOutTicks: -3,
            },
            slide: {
              transition: "slide in pattern",
              fadeInSeconds: 0.025,
              fadeOutTicks: -3,
            },
            "cross fade": {
              transition: "normal",
              fadeInSeconds: 0.04,
              fadeOutTicks: 6,
            },
            "hard fade": {
              transition: "normal",
              fadeInSeconds: 0,
              fadeOutTicks: 48,
            },
            "medium fade": {
              transition: "normal",
              fadeInSeconds: 0.0125,
              fadeOutTicks: 72,
            },
            "soft fade": {
              transition: "normal",
              fadeInSeconds: 0.06,
              fadeOutTicks: 96,
            },
          }[l];
          null != t &&
            ((n = e.transitions.dictionary[t.transition]),
            (this.fadeIn = St.secondsToFadeInSetting(t.fadeInSeconds)),
            (this.fadeOut = St.ticksToFadeOutSetting(t.fadeOutTicks)));
        }
        null != n && (this.transition = n.index),
          this.transition != e.transitions.dictionary.normal.index &&
            (this.effects = 1024 | this.effects);
      }
      null != t.fadeInSeconds &&
        (this.fadeIn = St.secondsToFadeInSetting(+t.fadeInSeconds)),
        null != t.fadeOutTicks &&
          (this.fadeOut = St.ticksToFadeOutSetting(+t.fadeOutTicks));
      {
        const n = t.chord,
          i = { harmony: "simultaneous" },
          a = e.chords.dictionary[i[n]] || e.chords.dictionary[n];
        null != a
          ? (this.chord = a.index)
          : 2 == this.type
          ? (this.chord = e.chords.dictionary.arpeggio.index)
          : 7 == this.type
          ? (this.chord = e.chords.dictionary.strum.index)
          : 0 == this.type
          ? (this.chord = e.chords.dictionary.arpeggio.index)
          : 1 == this.type
          ? (this.chord = e.chords.dictionary["custom interval"].index)
          : (this.chord = e.chords.dictionary.simultaneous.index);
      }
      this.unison = e.unisons.dictionary.none.index;
      const c = t.unison || t.interval || t.chorus;
      if (null != c) {
        const t = { union: "none", fifths: "fifth", octaves: "octave" },
          n = e.unisons.dictionary[t[c]] || e.unisons.dictionary[c];
        null != n && (this.unison = n.index);
      }
      "custom harmony" == t.chorus &&
        ((this.unison = e.unisons.dictionary.hum.index),
        (this.chord = e.chords.dictionary["custom interval"].index)),
        this.chord == e.chords.dictionary.simultaneous.index ||
          Array.isArray(t.effects) ||
          (this.effects = 2048 | this.effects),
        null != t.pitchShiftSemitones &&
          (this.pitchShift = Z(
            0,
            e.pitchShiftRange,
            Math.round(+t.pitchShiftSemitones)
          )),
        null != t.detuneCents &&
          (this.detune = Z(
            e.detuneMin,
            e.detuneMax + 1,
            Math.round(St.centsToDetune(+t.detuneCents))
          )),
        (this.vibrato = e.vibratos.dictionary.none.index);
      const h = t.vibrato || t.effect;
      if (null != h) {
        const n = {
            "vibrato light": "light",
            "vibrato delayed": "delayed",
            "vibrato heavy": "heavy",
          },
          i = e.vibratos.dictionary[n[c]] || e.vibratos.dictionary[h];
        null != i
          ? (this.vibrato = i.index)
          : "custom" == h && (this.vibrato = e.vibratos.length),
          this.vibrato == e.vibratos.length
            ? ((this.vibratoDepth = t.vibratoDepth),
              (this.vibratoSpeed = t.vibratoSpeed),
              (this.vibratoDelay = t.vibratoDelay),
              (this.vibratoType = t.vibratoType))
            : ((this.vibratoDepth = e.vibratos[this.vibrato].amplitude),
              (this.vibratoDelay = e.vibratos[this.vibrato].delayTicks / 2),
              (this.vibratoSpeed = 10),
              (this.vibratoType = e.vibratos[this.vibrato].type)),
          i != e.vibratos.dictionary.none &&
            (this.effects = 512 | this.effects);
      }
      if (
        (null != t.pan
          ? ((this.pan = Z(
              0,
              e.panMax + 1,
              Math.round(e.panCenter + ((0 | t.pan) * e.panCenter) / 100)
            )),
            this.pan != e.panCenter && (this.effects = 4 | this.effects))
          : (this.pan = e.panCenter),
        null != t.panDelay
          ? (this.panDelay = 0 | t.panDelay)
          : (this.panDelay = 10),
        null != t.detune
          ? (this.detune = Z(e.detuneMin, e.detuneMax + 1, 0 | t.detune))
          : null == t.detuneCents && (this.detune = e.detuneCenter),
        null != t.distortion &&
          (this.distortion = Z(
            0,
            e.distortionRange,
            Math.round(((e.distortionRange - 1) * (0 | t.distortion)) / 100)
          )),
        null != t.bitcrusherOctave &&
          (this.bitcrusherFreq =
            e.bitcrusherFreqRange -
            1 -
            +t.bitcrusherOctave / e.bitcrusherOctaveStep),
        null != t.bitcrusherQuantization &&
          (this.bitcrusherQuantization = Z(
            0,
            e.bitcrusherQuantizationRange,
            Math.round(
              ((e.bitcrusherQuantizationRange - 1) *
                (0 | t.bitcrusherQuantization)) /
                100
            )
          )),
        null != t.echoSustain &&
          (this.echoSustain = Z(
            0,
            e.echoSustainRange,
            Math.round(((e.echoSustainRange - 1) * (0 | t.echoSustain)) / 100)
          )),
        null != t.echoDelayBeats &&
          (this.echoDelay = Z(
            0,
            e.echoDelayRange,
            Math.round(
              (+t.echoDelayBeats * (e.ticksPerPart * e.partsPerBeat)) /
                e.echoDelayStepTicks -
                1
            )
          )),
        isNaN(t.chorus) ||
          (this.chorus = Z(
            0,
            e.chorusRange,
            Math.round(((e.chorusRange - 1) * (0 | t.chorus)) / 100)
          )),
        null != t.reverb
          ? (this.reverb = Z(
              0,
              e.reverbRange,
              Math.round(((e.reverbRange - 1) * (0 | t.reverb)) / 100)
            ))
          : (this.reverb = o),
        null != t.pulseWidth
          ? (this.pulseWidth = Z(
              1,
              e.pulseWidthRange + 1,
              Math.round(t.pulseWidth)
            ))
          : (this.pulseWidth = e.pulseWidthRange),
        null != t.dynamism
          ? (this.supersawDynamism = Z(
              0,
              e.supersawDynamismMax + 1,
              Math.round((e.supersawDynamismMax * (0 | t.dynamism)) / 100)
            ))
          : (this.supersawDynamism = e.supersawDynamismMax),
        null != t.spread
          ? (this.supersawSpread = Z(
              0,
              e.supersawSpreadMax + 1,
              Math.round((e.supersawSpreadMax * (0 | t.spread)) / 100)
            ))
          : (this.supersawSpread = Math.ceil(e.supersawSpreadMax / 2)),
        null != t.shape
          ? (this.supersawShape = Z(
              0,
              e.supersawShapeMax + 1,
              Math.round((e.supersawShapeMax * (0 | t.shape)) / 100)
            ))
          : (this.supersawShape = 0),
        null != t.harmonics)
      ) {
        for (let n = 0; n < e.harmonicsControlPoints; n++)
          this.harmonicsWave.harmonics[n] = Math.max(
            0,
            Math.min(
              e.harmonicsMax,
              Math.round((e.harmonicsMax * +t.harmonics[n]) / 100)
            )
          );
        this.harmonicsWave.markCustomWaveDirty();
      } else this.harmonicsWave.reset();
      if (null != t.spectrum)
        for (let n = 0; n < e.spectrumControlPoints; n++)
          (this.spectrumWave.spectrum[n] = Math.max(
            0,
            Math.min(
              e.spectrumMax,
              Math.round((e.spectrumMax * +t.spectrum[n]) / 100)
            )
          )),
            this.spectrumWave.markCustomWaveDirty();
      else this.spectrumWave.reset(n);
      null != t.stringSustain
        ? (this.stringSustain = Z(
            0,
            e.stringSustainRange,
            Math.round(
              ((e.stringSustainRange - 1) * (0 | t.stringSustain)) / 100
            )
          ))
        : (this.stringSustain = 10),
        (this.stringSustainType = e.enableAcousticSustain
          ? e.sustainTypeNames.indexOf(t.stringSustainType)
          : 0),
        -1 == this.stringSustainType && (this.stringSustainType = 0),
        2 == this.type &&
          ((this.chipNoise = e.chipNoises.findIndex((e) => e.name == t.wave)),
          -1 == this.chipNoise && (this.chipNoise = 1));
      const p = {
          custom: "note size",
          steady: "none",
          "pluck 1": "twang 1",
          "pluck 2": "twang 2",
          "pluck 3": "twang 3",
        },
        d = (t) =>
          null != p[t]
            ? e.envelopes.dictionary[p[t]]
            : e.envelopes.dictionary[t];
      if (4 == this.type && null != t.drums)
        for (let n = 0; n < e.drumCount; n++) {
          const i = t.drums[n];
          if (null != i) {
            if (
              ((this.drumsetEnvelopes[n] =
                e.envelopes.dictionary["twang 2"].index),
              null != i.filterEnvelope)
            ) {
              const t = d(i.filterEnvelope);
              null != t && (this.drumsetEnvelopes[n] = t.index);
            }
            if (null != i.spectrum)
              for (let t = 0; t < e.spectrumControlPoints; t++)
                this.drumsetSpectrumWaves[n].spectrum[t] = Math.max(
                  0,
                  Math.min(
                    e.spectrumMax,
                    Math.round((e.spectrumMax * +i.spectrum[t]) / 100)
                  )
                );
          }
        }
      if (0 == this.type) {
        const n = {
          triangle: 1,
          square: 2,
          "pulse wide": 3,
          "pulse narrow": 4,
          sawtooth: 5,
          "double saw": 6,
          "double pulse": 7,
          spiky: 8,
          plateau: 0,
        };
        (this.chipWave =
          null != n[t.wave]
            ? n[t.wave]
            : e.chipWaves.findIndex((e) => e.name == t.wave)),
          -1 == this.chipWave && (this.chipWave = 1);
      }
      if (1 == this.type) {
        (this.algorithm = e.algorithms.findIndex((e) => e.name == t.algorithm)),
          -1 == this.algorithm && (this.algorithm = 0),
          (this.feedbackType = e.feedbacks.findIndex(
            (e) => e.name == t.feedbackType
          )),
          -1 == this.feedbackType && (this.feedbackType = 0),
          null != t.feedbackAmplitude
            ? (this.feedbackAmplitude = Z(
                0,
                e.operatorAmplitudeMax + 1,
                0 | t.feedbackAmplitude
              ))
            : (this.feedbackAmplitude = 0);
        for (let n = 0; n < e.operatorCount; n++) {
          const i = this.operators[n];
          let a;
          null != t.operators && (a = t.operators[n]),
            null == a && (a = {}),
            (i.frequency = e.operatorFrequencies.findIndex(
              (t) => t.name == a.frequency
            )),
            -1 == i.frequency && (i.frequency = 0),
            null != a.amplitude
              ? (i.amplitude = Z(
                  0,
                  e.operatorAmplitudeMax + 1,
                  0 | a.amplitude
                ))
              : (i.amplitude = 0),
            null != a.waveform
              ? ((i.waveform = e.operatorWaves.findIndex(
                  (t) => t.name == a.waveform
                )),
                -1 == i.waveform &&
                  ("square" == a.waveform
                    ? ((i.waveform =
                        e.operatorWaves.dictionary["pulse width"].index),
                      (i.pulseWidth = 5))
                    : (i.waveform = 0)))
              : (i.waveform = 0),
            null != a.pulseWidth
              ? (i.pulseWidth = 0 | a.pulseWidth)
              : (i.pulseWidth = 5);
        }
      } else if (9 == this.type) {
        if (t.customChipWave) {
          for (let e = 0; e < 64; e++)
            this.customChipWave[e] = t.customChipWave[e];
          let e = 0;
          for (let t = 0; t < this.customChipWave.length; t++)
            e += this.customChipWave[t];
          const n = e / this.customChipWave.length;
          let i = 0,
            a = 0;
          for (let t = 0; t < this.customChipWave.length; t++)
            (i += a),
              (a = this.customChipWave[t] - n),
              (this.customChipWaveIntegral[t] = i);
          this.customChipWaveIntegral[64] = 0;
        }
      } else if (10 == this.type && null != t.modChannels)
        for (let n = 0; n < e.modCount; n++)
          (this.modChannels[n] = t.modChannels[n]),
            (this.modInstruments[n] = t.modInstruments[n]),
            (this.modulators[n] = t.modSettings[n]),
            null != t.modFilterTypes &&
              (this.modFilterTypes[n] = t.modFilterTypes[n]);
      if (10 != this.type) {
        this.chord == e.chords.dictionary.arpeggio.index &&
        null != t.arpeggioSpeed
          ? (this.arpeggioSpeed = t.arpeggioSpeed)
          : (this.arpeggioSpeed = a ? 9 : 12),
          null != t.fastTwoNoteArp
            ? (this.fastTwoNoteArp = t.fastTwoNoteArp)
            : (this.fastTwoNoteArp = r),
          null != t.clicklessTransition
            ? (this.clicklessTransition = t.clicklessTransition)
            : (this.clicklessTransition = !1),
          null != t.aliases ? (this.aliases = t.aliases) : (this.aliases = !1),
          null != t.noteFilterType && (this.noteFilterType = t.noteFilterType),
          null != t.noteSimpleCut &&
            (this.noteFilterSimpleCut = t.noteSimpleCut),
          null != t.noteSimplePeak &&
            (this.noteFilterSimplePeak = t.noteSimplePeak),
          null != t.noteFilter
            ? this.noteFilter.fromJsonObject(t.noteFilter)
            : this.noteFilter.reset();
        for (let n = 0; n < e.filterMorphCount; n++)
          Array.isArray(t["noteSubFilters" + n]) &&
            ((this.noteSubFilters[n] = new ut()),
            this.noteSubFilters[n].fromJsonObject(t["noteSubFilters" + n]));
        if (
          (null != t.eqFilterType && (this.eqFilterType = t.eqFilterType),
          null != t.eqSimpleCut && (this.eqFilterSimpleCut = t.eqSimpleCut),
          null != t.eqSimplePeak && (this.eqFilterSimplePeak = t.eqSimplePeak),
          Array.isArray(t.eqFilter))
        )
          this.eqFilter.fromJsonObject(t.eqFilter);
        else {
          this.eqFilter.reset();
          const n = {},
            i = 8e3,
            a = 11,
            r = 8;
          if (
            (null != t.filterCutoffHz
              ? (n.filterCutoff = Z(
                  0,
                  a,
                  Math.round(
                    a -
                      1 +
                      (2 * Math.log((0 | t.filterCutoffHz) / i)) / Math.LN2
                  )
                ))
              : (n.filterCutoff = 0 == this.type ? 6 : 10),
            null != t.filterResonance
              ? (n.filterResonance = Z(
                  0,
                  r,
                  Math.round(((r - 1) * (0 | t.filterResonance)) / 100)
                ))
              : (n.filterResonance = 0),
            (n.filterEnvelope = d(t.filterEnvelope)),
            (n.pulseEnvelope = d(t.pulseEnvelope)),
            (n.feedbackEnvelope = d(t.feedbackEnvelope)),
            Array.isArray(t.operators))
          ) {
            n.operatorEnvelopes = [];
            for (let i = 0; i < e.operatorCount; i++) {
              let a;
              null != t.operators[i] && (a = d(t.operators[i].envelope)),
                (n.operatorEnvelopes[i] =
                  null != a ? a : e.envelopes.dictionary.none);
            }
          }
          if (null != t.filter) {
            const e = [10, 6, 3, 0, 8, 5, 2],
              i = [
                "none",
                "none",
                "none",
                "none",
                "decay 1",
                "decay 2",
                "decay 3",
              ],
              a = [
                "none",
                "bright",
                "medium",
                "soft",
                "decay bright",
                "decay medium",
                "decay soft",
              ],
              r = {
                "sustain sharp": 1,
                "sustain medium": 2,
                "sustain soft": 3,
                "decay sharp": 4,
              };
            let o = null != r[t.filter] ? r[t.filter] : a.indexOf(t.filter);
            -1 == o && (o = 0),
              (n.filterCutoff = e[o]),
              (n.filterEnvelope = d(i[o])),
              (n.filterResonance = 0);
          }
          this.convertLegacySettings(n, !0);
        }
        for (let n = 0; n < e.filterMorphCount; n++)
          Array.isArray(t["eqSubFilters" + n]) &&
            ((this.eqSubFilters[n] = new ut()),
            this.eqSubFilters[n].fromJsonObject(t["eqSubFilters" + n]));
        if (Array.isArray(t.envelopes)) {
          const n = t.envelopes;
          for (
            let t = 0;
            t < n.length && !(this.envelopeCount >= e.maxEnvelopeCount);
            t++
          ) {
            const e = new ft();
            e.fromJsonObject(n[t]),
              this.addEnvelope(e.target, e.index, e.envelope);
          }
        }
      }
    }
    getLargestControlPointCount(t) {
      let n;
      if (t) {
        n = this.noteFilter.controlPointCount;
        for (let t = 0; t < e.filterMorphCount; t++)
          null != this.noteSubFilters[t] &&
            this.noteSubFilters[t].controlPointCount > n &&
            (n = this.noteSubFilters[t].controlPointCount);
      } else {
        n = this.eqFilter.controlPointCount;
        for (let t = 0; t < e.filterMorphCount; t++)
          null != this.eqSubFilters[t] &&
            this.eqSubFilters[t].controlPointCount > n &&
            (n = this.eqSubFilters[t].controlPointCount);
      }
      return n;
    }
    static frequencyFromPitch(t) {
      return 440 * Math.pow(2, (t - 69) / 12);
    }
    addEnvelope(t, n, i) {
      let a = !1;
      if (
        (this.supportsEnvelopeTarget(t, n) || (a = !0),
        this.envelopeCount >= e.maxEnvelopeCount)
      )
        throw new Error();
      for (; this.envelopes.length <= this.envelopeCount; )
        this.envelopes[this.envelopes.length] = new ft();
      const r = this.envelopes[this.envelopeCount];
      (r.target = a ? e.instrumentAutomationTargets.dictionary.none.index : t),
        (r.index = a ? 0 : n),
        (r.envelope = i),
        this.envelopeCount++;
    }
    supportsEnvelopeTarget(t, n) {
      const i = e.instrumentAutomationTargets[t];
      if (null == i.computeIndex && "none" != i.name) return !1;
      if (n >= i.maxCount) return !1;
      if (
        null != i.compatibleInstruments &&
        -1 == i.compatibleInstruments.indexOf(this.type)
      )
        return !1;
      if (null != i.effect && !(this.effects & (1 << i.effect))) return !1;
      if (i.isFilter) {
        let t = this.noteFilter.controlPointCount;
        if ((this.noteFilterType && (t = 1), n >= t)) return !1;
      }
      return !0;
    }
    clearInvalidEnvelopeTargets() {
      for (let t = 0; t < this.envelopeCount; t++) {
        const n = this.envelopes[t].target,
          i = this.envelopes[t].index;
        this.supportsEnvelopeTarget(n, i) ||
          ((this.envelopes[t].target =
            e.instrumentAutomationTargets.dictionary.none.index),
          (this.envelopes[t].index = 0));
      }
    }
    getTransition() {
      return d(this.effects)
        ? e.transitions[this.transition]
        : 10 == this.type
        ? e.transitions.dictionary.interrupt
        : e.transitions.dictionary.normal;
    }
    getFadeInSeconds() {
      return 4 == this.type ? 0 : St.fadeInSettingToSeconds(this.fadeIn);
    }
    getFadeOutTicks() {
      return 4 == this.type
        ? e.drumsetFadeOutTicks
        : St.fadeOutSettingToTicks(this.fadeOut);
    }
    getChord() {
      return m(this.effects)
        ? e.chords[this.chord]
        : e.chords.dictionary.simultaneous;
    }
    getDrumsetEnvelope(t) {
      if (4 != this.type)
        throw new Error("Can't getDrumsetEnvelope() for non-drumset.");
      return e.envelopes[this.drumsetEnvelopes[t]];
    }
  }
  class bt {
    constructor() {
      (this.octave = 0),
        (this.instruments = []),
        (this.patterns = []),
        (this.bars = []),
        (this.muted = !1),
        (this.name = "");
    }
  }
  class gt {
    constructor(t) {
      (this.channels = []),
        (this.limitDecay = 4),
        (this.limitRise = 4e3),
        (this.compressionThreshold = 1),
        (this.limitThreshold = 1),
        (this.compressionRatio = 1),
        (this.limitRatio = 1),
        (this.masterGain = 1),
        (this.inVolumeCap = 0),
        (this.outVolumeCap = 0),
        (this.getNewNoteVolume = (t, n, i, a) => {
          if (t && null != n && null != i && null != a) {
            a = e.modCount - a - 1;
            let t =
                e.modulators[this.channels[n].instruments[i].modulators[a]]
                  .newNoteVol,
              r = e.modulators.dictionary.tempo.index;
            return (
              this.channels[n].instruments[i].modulators[a] == r &&
                (t = this.tempo - e.modulators[r].convertRealFactor),
              null != t ? t : 6
            );
          }
          return 6;
        }),
        (this.getVolumeCap = (t, n, i, a) => {
          if (t && null != n && null != i && null != a) {
            a = e.modCount - a - 1;
            let t = this.channels[n].instruments[i],
              r = e.modulators[t.modulators[a]],
              o = r.maxRawVol;
            return null != o
              ? (("eq filter" != r.name && "note filter" != r.name) ||
                  ((o = e.filterMorphCount - 1),
                  t.modFilterTypes[a] > 0 && t.modFilterTypes[a] % 2
                    ? (o = e.filterFreqRange)
                    : t.modFilterTypes[a] > 0 && (o = e.filterGainRange)),
                o)
              : 6;
          }
          return 6;
        }),
        (this.getVolumeCapForSetting = (t, n, i) => {
          if (t) {
            let t = e.modulators[n].maxRawVol;
            return null != t
              ? (null == i ||
                  ("eq filter" != e.modulators[n].name &&
                    "note filter" != e.modulators[n].name) ||
                  ((t = e.filterMorphCount - 1),
                  i > 0 && i % 2
                    ? (t = e.filterFreqRange)
                    : i > 0 && (t = e.filterGainRange)),
                t)
              : e.noteSizeMax;
          }
          return e.noteSizeMax;
        }),
        null != t ? this.fromBase64String(t) : this.initToDefault(!0);
    }
    getChannelCount() {
      return (
        this.pitchChannelCount + this.noiseChannelCount + this.modChannelCount
      );
    }
    getMaxInstrumentsPerChannel() {
      return Math.max(
        this.layeredInstruments
          ? e.layeredInstrumentCountMax
          : e.instrumentCountMin,
        this.patternInstruments
          ? e.patternInstrumentCountMax
          : e.instrumentCountMin
      );
    }
    getMaxInstrumentsPerPattern(t) {
      return this.getMaxInstrumentsPerPatternForChannel(this.channels[t]);
    }
    getMaxInstrumentsPerPatternForChannel(t) {
      return this.layeredInstruments
        ? Math.min(e.layeredInstrumentCountMax, t.instruments.length)
        : 1;
    }
    getChannelIsNoise(t) {
      return (
        t >= this.pitchChannelCount &&
        t < this.pitchChannelCount + this.noiseChannelCount
      );
    }
    getChannelIsMod(t) {
      return t >= this.pitchChannelCount + this.noiseChannelCount;
    }
    initToDefault(t = !0) {
      if (
        ((this.scale = 0),
        (this.key = 0),
        (this.loopStart = 0),
        (this.loopLength = 4),
        (this.tempo = 150),
        (this.reverb = 0),
        (this.beatsPerBar = 8),
        (this.barCount = 16),
        (this.patternsPerChannel = 8),
        (this.rhythm = 1),
        (this.layeredInstruments = !1),
        (this.patternInstruments = !1),
        (this.title = "Unnamed"),
        (document.title = $.versionDisplayName),
        t)
      ) {
        (this.pitchChannelCount = 3),
          (this.noiseChannelCount = 1),
          (this.modChannelCount = 0);
        for (let t = 0; t < this.getChannelCount(); t++) {
          const n =
              t >= this.pitchChannelCount &&
              t < this.pitchChannelCount + this.noiseChannelCount,
            i = t >= this.pitchChannelCount + this.noiseChannelCount;
          this.channels.length <= t && (this.channels[t] = new bt());
          const a = this.channels[t];
          a.octave = Math.max(3 - t, 0);
          for (let t = 0; t < this.patternsPerChannel; t++)
            a.patterns.length <= t
              ? (a.patterns[t] = new st())
              : a.patterns[t].reset();
          a.patterns.length = this.patternsPerChannel;
          for (let t = 0; t < e.instrumentCountMin; t++)
            a.instruments.length <= t && (a.instruments[t] = new yt(n, i)),
              a.instruments[t].setTypeAndReset(i ? 10 : n ? 2 : 0, n, i);
          a.instruments.length = e.instrumentCountMin;
          for (let t = 0; t < this.barCount; t++) a.bars[t] = t < 4 ? 1 : 0;
          a.bars.length = this.barCount;
        }
        this.channels.length = this.getChannelCount();
      }
    }
    toBase64String() {
      let t,
        n = [];
      n.push(gt.q), n.push(et[gt.O]), n.push(78);
      var i = encodeURIComponent(this.title);
      n.push(et[i.length >> 6], et[63 & i.length]);
      for (let t = 0; t < i.length; t++) n.push(i.charCodeAt(t));
      n.push(
        110,
        et[this.pitchChannelCount],
        et[this.noiseChannelCount],
        et[this.modChannelCount]
      ),
        n.push(115, et[this.scale]),
        n.push(107, et[this.key]),
        n.push(108, et[this.loopStart >> 6], et[63 & this.loopStart]),
        n.push(
          101,
          et[(this.loopLength - 1) >> 6],
          et[(this.loopLength - 1) & 63]
        ),
        n.push(116, et[this.tempo >> 6], et[63 & this.tempo]),
        n.push(97, et[this.beatsPerBar - 1]),
        n.push(103, et[(this.barCount - 1) >> 6], et[(this.barCount - 1) & 63]),
        n.push(
          106,
          et[(this.patternsPerChannel - 1) >> 6],
          et[(this.patternsPerChannel - 1) & 63]
        ),
        n.push(114, et[this.rhythm]),
        n.push(79),
        1 != this.compressionRatio ||
        1 != this.limitRatio ||
        4e3 != this.limitRise ||
        4 != this.limitDecay ||
        1 != this.limitThreshold ||
        1 != this.compressionThreshold ||
        1 != this.masterGain
          ? (n.push(
              et[
                Math.round(
                  this.compressionRatio < 1
                    ? 10 * this.compressionRatio
                    : 10 + 60 * (this.compressionRatio - 1)
                )
              ]
            ),
            n.push(
              et[
                Math.round(
                  this.limitRatio < 1
                    ? 10 * this.limitRatio
                    : 9 + this.limitRatio
                )
              ]
            ),
            n.push(et[this.limitDecay]),
            n.push(et[Math.round((this.limitRise - 2e3) / 250)]),
            n.push(et[Math.round(20 * this.compressionThreshold)]),
            n.push(et[Math.round(20 * this.limitThreshold)]),
            n.push(
              et[Math.round(50 * this.masterGain) >> 6],
              et[63 & Math.round(50 * this.masterGain)]
            ))
          : n.push(et[63]),
        n.push(85);
      for (let t = 0; t < this.getChannelCount(); t++) {
        var a = encodeURIComponent(this.channels[t].name);
        n.push(et[a.length >> 6], et[63 & a.length]);
        for (let t = 0; t < a.length; t++) n.push(a.charCodeAt(t));
      }
      if (
        (n.push(
          105,
          et[(this.layeredInstruments << 1) | this.patternInstruments]
        ),
        this.layeredInstruments || this.patternInstruments)
      )
        for (let t = 0; t < this.getChannelCount(); t++)
          n.push(
            et[this.channels[t].instruments.length - e.instrumentCountMin]
          );
      n.push(111);
      for (let t = 0; t < this.pitchChannelCount; t++)
        n.push(et[this.channels[t].octave]);
      for (let t = 0; t < this.getChannelCount(); t++)
        for (let i = 0; i < this.channels[t].instruments.length; i++) {
          const a = this.channels[t].instruments[i];
          if (
            (n.push(84, et[a.type]),
            n.push(
              118,
              et[(a.volume + e.volumeRange / 2) >> 6],
              et[(a.volume + e.volumeRange / 2) & 63]
            ),
            n.push(117, et[a.preset >> 6], et[63 & a.preset]),
            n.push(102),
            n.push(et[+a.eqFilterType]),
            a.eqFilterType)
          )
            n.push(et[a.eqFilterSimpleCut]), n.push(et[a.eqFilterSimplePeak]);
          else {
            if (null == a.eqFilter)
              n.push(et[0]),
                console.log(
                  "Null EQ filter settings detected in toBase64String for channelIndex " +
                    t +
                    ", instrumentIndex " +
                    i
                );
            else {
              n.push(et[a.eqFilter.controlPointCount]);
              for (let t = 0; t < a.eqFilter.controlPointCount; t++) {
                const e = a.eqFilter.controlPoints[t];
                n.push(
                  et[e.type],
                  et[Math.round(e.freq)],
                  et[Math.round(e.gain)]
                );
              }
            }
            let r = 0;
            for (let t = 0; t < e.filterMorphCount - 1; t++)
              r |= +(null != a.eqSubFilters[t + 1]) << t;
            n.push(et[r >> 6], et[63 & r]);
            for (let t = 0; t < e.filterMorphCount - 1; t++)
              if (r & (1 << t)) {
                n.push(et[a.eqSubFilters[t + 1].controlPointCount]);
                for (
                  let e = 0;
                  e < a.eqSubFilters[t + 1].controlPointCount;
                  e++
                ) {
                  const i = a.eqSubFilters[t + 1].controlPoints[e];
                  n.push(
                    et[i.type],
                    et[Math.round(i.freq)],
                    et[Math.round(i.gain)]
                  );
                }
              }
          }
          if (
            (n.push(113, et[a.effects >> 6], et[63 & a.effects]), b(a.effects))
          )
            if ((n.push(et[+a.noteFilterType]), a.noteFilterType))
              n.push(et[a.noteFilterSimpleCut]),
                n.push(et[a.noteFilterSimplePeak]);
            else {
              if (null == a.noteFilter)
                n.push(et[0]),
                  console.log(
                    "Null note filter settings detected in toBase64String for channelIndex " +
                      t +
                      ", instrumentIndex " +
                      i
                  );
              else {
                n.push(et[a.noteFilter.controlPointCount]);
                for (let t = 0; t < a.noteFilter.controlPointCount; t++) {
                  const e = a.noteFilter.controlPoints[t];
                  n.push(
                    et[e.type],
                    et[Math.round(e.freq)],
                    et[Math.round(e.gain)]
                  );
                }
              }
              let r = 0;
              for (let t = 0; t < e.filterMorphCount - 1; t++)
                r |= +(null != a.noteSubFilters[t + 1]) << t;
              n.push(et[r >> 6], et[63 & r]);
              for (let t = 0; t < e.filterMorphCount - 1; t++)
                if (r & (1 << t)) {
                  n.push(et[a.noteSubFilters[t + 1].controlPointCount]);
                  for (
                    let e = 0;
                    e < a.noteSubFilters[t + 1].controlPointCount;
                    e++
                  ) {
                    const i = a.noteSubFilters[t + 1].controlPoints[e];
                    n.push(
                      et[i.type],
                      et[Math.round(i.freq)],
                      et[Math.round(i.gain)]
                    );
                  }
                }
            }
          if (
            (d(a.effects) && n.push(et[a.transition]),
            m(a.effects) &&
              (n.push(et[a.chord]),
              a.chord == e.chords.dictionary.arpeggio.index &&
                (n.push(et[a.arpeggioSpeed]), n.push(et[+a.fastTwoNoteArp]))),
            u(a.effects) && n.push(et[a.pitchShift]),
            f(a.effects) &&
              n.push(
                et[(a.detune - e.detuneMin) >> 6],
                et[(a.detune - e.detuneMin) & 63]
              ),
            y(a.effects) &&
              (n.push(et[a.vibrato]),
              a.vibrato == e.vibratos.length &&
                (n.push(et[Math.round(25 * a.vibratoDepth)]),
                n.push(et[a.vibratoSpeed]),
                n.push(et[Math.round(a.vibratoDelay)]),
                n.push(et[a.vibratoType]))),
            g(a.effects) && (n.push(et[a.distortion]), n.push(et[+a.aliases])),
            v(a.effects) &&
              n.push(et[a.bitcrusherFreq], et[a.bitcrusherQuantization]),
            k(a.effects) &&
              (n.push(et[a.pan >> 6], et[63 & a.pan]), n.push(et[a.panDelay])),
            w(a.effects) && n.push(et[a.chorus]),
            M(a.effects) && n.push(et[a.echoSustain], et[a.echoDelay]),
            F(a.effects) && n.push(et[a.reverb]),
            4 != a.type &&
              (n.push(100, et[a.fadeIn], et[a.fadeOut]),
              n.push(et[+a.clicklessTransition])),
            5 == a.type || 7 == a.type)
          ) {
            n.push(72);
            const t = new at();
            for (let n = 0; n < e.harmonicsControlPoints; n++)
              t.write(
                e.harmonicsControlPointBits,
                a.harmonicsWave.harmonics[n]
              );
            t.encodeBase64(n);
          }
          if (0 == a.type)
            n.push(119, et[a.chipWave]), n.push(104, et[a.unison]);
          else if (1 == a.type) {
            n.push(65, et[a.algorithm]),
              n.push(70, et[a.feedbackType]),
              n.push(66, et[a.feedbackAmplitude]),
              n.push(81);
            for (let t = 0; t < e.operatorCount; t++)
              n.push(et[a.operators[t].frequency]);
            n.push(80);
            for (let t = 0; t < e.operatorCount; t++)
              n.push(et[a.operators[t].amplitude]);
            n.push(82);
            for (let t = 0; t < e.operatorCount; t++)
              n.push(et[a.operators[t].waveform]),
                3 == a.operators[t].waveform &&
                  n.push(et[a.operators[t].pulseWidth]);
          } else if (9 == a.type) {
            n.push(119, et[a.chipWave]), n.push(104, et[a.unison]), n.push(77);
            for (let t = 0; t < 64; t++) n.push(et[a.customChipWave[t] + 24]);
          } else if (2 == a.type) n.push(119, et[a.chipNoise]);
          else if (3 == a.type) {
            n.push(83);
            const t = new at();
            for (let n = 0; n < e.spectrumControlPoints; n++)
              t.write(e.spectrumControlPointBits, a.spectrumWave.spectrum[n]);
            t.encodeBase64(n);
          } else if (4 == a.type) {
            n.push(122);
            for (let t = 0; t < e.drumCount; t++)
              n.push(et[a.drumsetEnvelopes[t]]);
            n.push(83);
            const t = new at();
            for (let n = 0; n < e.drumCount; n++)
              for (let i = 0; i < e.spectrumControlPoints; i++)
                t.write(
                  e.spectrumControlPointBits,
                  a.drumsetSpectrumWaves[n].spectrum[i]
                );
            t.encodeBase64(n);
          } else if (5 == a.type) n.push(104, et[a.unison]);
          else if (6 == a.type) n.push(87, et[a.pulseWidth]);
          else if (8 == a.type)
            n.push(
              120,
              et[a.supersawDynamism],
              et[a.supersawSpread],
              et[a.supersawShape]
            ),
              n.push(87, et[a.pulseWidth]);
          else if (7 == a.type) {
            if (e.stringSustainRange > 32)
              throw new Error(
                "Not enough bits to represent sustain value and type in same base64 character."
              );
            n.push(104, et[a.unison]),
              n.push(73, et[a.stringSustain | (a.stringSustainType << 5)]);
          } else if (10 != a.type) throw new Error("Unknown instrument type.");
          n.push(69, et[a.envelopeCount]),
            n.push(et[a.envelopeSpeed]),
            n.push(et[+a.discreteEnvelope]);
          for (let t = 0; t < a.envelopeCount; t++)
            n.push(et[a.envelopes[t].target]),
              e.instrumentAutomationTargets[a.envelopes[t].target].maxCount >
                1 && n.push(et[a.envelopes[t].index]),
              n.push(et[a.envelopes[t].envelope]);
        }
      n.push(98), (t = new at());
      let r = 0;
      for (; 1 << r < this.patternsPerChannel + 1; ) r++;
      for (let e = 0; e < this.getChannelCount(); e++)
        for (let n = 0; n < this.barCount; n++)
          t.write(r, this.channels[e].bars[n]);
      t.encodeBase64(n), n.push(112), (t = new at());
      const o = new at(),
        s = gt.getNeededBits(e.noteSizeMax);
      for (let n = 0; n < this.getChannelCount(); n++) {
        const i = this.channels[n],
          a = this.getMaxInstrumentsPerPattern(n),
          r = this.getChannelIsNoise(n),
          l = this.getChannelIsMod(n),
          c = gt.getNeededBits(a - e.instrumentCountMin),
          h = gt.getNeededBits(i.instruments.length - 1);
        if (l) {
          const a = gt.getNeededBits(this.getMaxInstrumentsPerChannel() + 2);
          for (let r = 0; r < i.instruments.length; r++) {
            let i = this.channels[n].instruments[r];
            for (let n = 0; n < e.modCount; n++) {
              const r = i.modChannels[n],
                o = i.modInstruments[n],
                s = i.modulators[n],
                l = i.modFilterTypes[n];
              let c = e.modulators[s].forSong ? 2 : 0;
              s == e.modulators.dictionary.none.index && (c = 3),
                t.write(2, c),
                (0 != c && 1 != c) || (t.write(8, r), t.write(a, o)),
                3 != c && t.write(6, s),
                ("eq filter" != e.modulators[i.modulators[n]].name &&
                  "note filter" != e.modulators[i.modulators[n]].name) ||
                  t.write(6, l);
            }
          }
        }
        const p = r || l ? 0 : i.octave * e.pitchesPerOctave;
        let d = r ? 4 : p;
        const m = l
            ? [0, 1, 2, 3, 4, 5]
            : r
            ? [4, 6, 7, 2, 3, 8, 0, 10]
            : [0, 7, 12, 19, 24, -5, -12],
          u = [];
        for (let t = 0; t < m.length; t++) m[t] += p;
        for (const n of i.patterns) {
          if (this.patternInstruments) {
            const i = tt(e.instrumentCountMin, a, n.instruments.length);
            t.write(c, i - e.instrumentCountMin);
            for (let e = 0; e < i; e++) t.write(h, n.instruments[e]);
          }
          if (n.notes.length > 0) {
            t.write(1, 1);
            let i = 0;
            for (const e of n.notes) {
              e.start < i &&
                l &&
                (t.write(2, 0),
                t.write(1, 1),
                t.writePartDuration(i - e.start)),
                e.start > i &&
                  (t.write(2, 0),
                  l && t.write(1, 0),
                  t.writePartDuration(e.start - i)),
                o.clear(),
                1 == e.pitches.length
                  ? o.write(1, 0)
                  : (o.write(1, 1), o.write(3, e.pitches.length - 2)),
                o.writePinCount(e.pins.length - 1),
                l ? o.write(9, e.pins[0].size) : o.write(s, e.pins[0].size);
              let n = 0,
                a = e.pitches[0],
                r = a;
              const c = [];
              for (let t = 1; t < e.pins.length; t++) {
                const i = e.pins[t],
                  h = a + i.interval;
                r != h ? (o.write(1, 1), c.push(h), (r = h)) : o.write(1, 0),
                  o.writePartDuration(i.time - n),
                  (n = i.time),
                  l ? o.write(9, i.size) : o.write(s, i.size);
              }
              const h = String.fromCharCode.apply(null, o.encodeBase64([])),
                p = u.indexOf(h);
              -1 == p
                ? (t.write(2, 1), t.concat(o))
                : (t.write(1, 1), t.writeLongTail(0, 0, p), u.splice(p, 1)),
                u.unshift(h),
                u.length > 10 && u.pop();
              const f = e.pitches.concat(c);
              for (let n = 0; n < f.length; n++) {
                const i = f[n],
                  a = m.indexOf(i);
                if (-1 == a) {
                  let e = 0,
                    n = d;
                  if (n < i) for (; n != i; ) n++, -1 == m.indexOf(n) && e++;
                  else for (; n != i; ) n--, -1 == m.indexOf(n) && e--;
                  t.write(1, 0), t.writePitchInterval(e);
                } else t.write(1, 1), t.write(4, a), m.splice(a, 1);
                m.unshift(i),
                  m.length > 16 && m.pop(),
                  (d = n == e.pitches.length - 1 ? e.pitches[0] : i);
              }
              0 == e.start && t.write(1, e.continuesLastPattern ? 1 : 0),
                (i = e.end);
            }
            i < this.beatsPerBar * e.partsPerBeat + +l &&
              (t.write(2, 0),
              l && t.write(1, 0),
              t.writePartDuration(this.beatsPerBar * e.partsPerBeat + +l - i));
          } else t.write(1, 0);
        }
      }
      let l = t.lengthBase64(),
        c = [];
      for (; l > 0; ) c.unshift(et[63 & l]), (l >>= 6);
      n.push(et[c.length]), Array.prototype.push.apply(n, c), t.encodeBase64(n);
      const h = 64e3;
      if (n.length < h) return String.fromCharCode.apply(null, n);
      {
        let t = "";
        for (let e = 0; e < n.length; e += h)
          t += String.fromCharCode.apply(null, n.slice(e, e + h));
        return t;
      }
    }
    static R(t) {
      return (
        0 == t ? (t = 1) : 1 == t && (t = 0),
        e.envelopes[Z(0, e.envelopes.length, t)]
      );
    }
    fromBase64String(t) {
      if (null == t || "" == t) return void this.initToDefault(!0);
      let n = 0;
      for (; t.charCodeAt(n) <= 32; ) n++;
      if ((35 == t.charCodeAt(n) && n++, 123 == t.charCodeAt(n)))
        return void this.fromJsonObject(
          JSON.parse(0 == n ? t : t.substring(n))
        );
      let i, a;
      106 == t.charCodeAt(n) ? ((i = !1), (a = !0), n++) : ((i = !0), (a = !1));
      const r = nt[t.charCodeAt(n++)];
      if (i && (-1 == r || r > gt.N || r < gt.L)) return;
      if (a && (-1 == r || r > gt.O || r < gt.H)) return;
      const o = r < 2,
        s = r < 3,
        l = r < 4,
        c = r < 5,
        h = r < 6,
        p = r < 7,
        S = r < 8,
        x = r < 9;
      this.initToDefault((i && x) || (a && c));
      const I = (i && x) || (a && c);
      if (s && i) {
        for (const t of this.channels)
          (t.instruments[0].transition =
            e.transitions.dictionary.interrupt.index),
            (t.instruments[0].effects |= 1024);
        this.channels[3].instruments[0].chipNoise = 0;
      }
      let P = null;
      if ((i && x) || (a && c)) {
        P = [];
        for (let t = P.length; t < this.getChannelCount(); t++) {
          P[t] = [];
          for (let n = 0; n < e.instrumentCountMin; n++) P[t][n] = {};
        }
      }
      let A,
        T = 0,
        C = 0,
        D = -1,
        q = !1,
        E = !1;
      for (; n < t.length; )
        switch ((A = t.charCodeAt(n++))) {
          case 78:
            var O = (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)];
            (this.title = decodeURIComponent(t.substring(n, n + O))),
              (document.title = this.title + " - " + $.versionDisplayName),
              (n += O);
            break;
          case 110:
            (this.pitchChannelCount = nt[t.charCodeAt(n++)]),
              (this.noiseChannelCount = nt[t.charCodeAt(n++)]),
              (this.modChannelCount = i || o ? 0 : nt[t.charCodeAt(n++)]),
              (this.pitchChannelCount = tt(
                e.pitchChannelCountMin,
                e.pitchChannelCountMax,
                this.pitchChannelCount
              )),
              (this.noiseChannelCount = tt(
                e.noiseChannelCountMin,
                e.noiseChannelCountMax,
                this.noiseChannelCount
              )),
              (this.modChannelCount = tt(
                e.modChannelCountMin,
                e.modChannelCountMax,
                this.modChannelCount
              ));
            for (let t = this.channels.length; t < this.getChannelCount(); t++)
              this.channels[t] = new bt();
            if (
              ((this.channels.length = this.getChannelCount()),
              (i && x) || (a && c))
            )
              for (let t = P.length; t < this.getChannelCount(); t++) {
                P[t] = [];
                for (let n = 0; n < e.instrumentCountMin; n++) P[t][n] = {};
              }
            break;
          case 115:
            (this.scale = nt[t.charCodeAt(n++)]), i && (this.scale = 0);
            break;
          case 107:
            this.key = Z(
              0,
              e.keys.length,
              p && i ? 11 - nt[t.charCodeAt(n++)] : nt[t.charCodeAt(n++)]
            );
            break;
          case 108:
            this.loopStart =
              c && i
                ? nt[t.charCodeAt(n++)]
                : (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)];
            break;
          case 101:
            this.loopLength =
              c && i
                ? nt[t.charCodeAt(n++)]
                : (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)] + 1;
            break;
          case 116:
            (this.tempo =
              l && i
                ? [95, 120, 151, 190][nt[t.charCodeAt(n++)]]
                : p && i
                ? [
                    88, 95, 103, 111, 120, 130, 140, 151, 163, 176, 190, 206,
                    222, 240, 259,
                  ][nt[t.charCodeAt(n++)]]
                : (nt[t.charCodeAt(n++)] << 6) | nt[t.charCodeAt(n++)]),
              (this.tempo = Z(e.tempoMin, e.tempoMax + 1, this.tempo));
            break;
          case 109:
            x && i
              ? ((T = 12 * nt[t.charCodeAt(n++)]), (T = Z(0, e.reverbRange, T)))
              : c &&
                a &&
                ((T = nt[t.charCodeAt(n++)]), (T = Z(0, e.reverbRange, T)));
            break;
          case 97:
            (this.beatsPerBar =
              s && i
                ? [6, 7, 8, 9, 10][nt[t.charCodeAt(n++)]]
                : nt[t.charCodeAt(n++)] + 1),
              (this.beatsPerBar = Math.max(
                e.beatsPerBarMin,
                Math.min(e.beatsPerBarMax, this.beatsPerBar)
              ));
            break;
          case 103:
            {
              const i =
                (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)] + 1;
              this.barCount = tt(e.barCountMin, e.barCountMax, i);
              for (let t = 0; t < this.getChannelCount(); t++) {
                for (
                  let e = this.channels[t].bars.length;
                  e < this.barCount;
                  e++
                )
                  this.channels[t].bars[e] = e < 4 ? 1 : 0;
                this.channels[t].bars.length = this.barCount;
              }
            }
            break;
          case 106:
            {
              let a;
              (a =
                S && i
                  ? nt[t.charCodeAt(n++)] + 1
                  : (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)] + 1),
                (this.patternsPerChannel = tt(1, e.barCountMax, a));
              const r = this.getChannelCount();
              for (let t = 0; t < r; t++) {
                const e = this.channels[t].patterns;
                for (let t = e.length; t < this.patternsPerChannel; t++)
                  e[t] = new st();
                e.length = this.patternsPerChannel;
              }
            }
            break;
          case 105:
            if ((x && i) || (c && a)) {
              const a = tt(
                e.instrumentCountMin,
                e.patternInstrumentCountMax,
                nt[t.charCodeAt(n++)] + e.instrumentCountMin
              );
              (this.layeredInstruments = !1), (this.patternInstruments = a > 1);
              for (let t = 0; t < this.getChannelCount(); t++) {
                const e =
                    t >= this.pitchChannelCount &&
                    t < this.pitchChannelCount + this.noiseChannelCount,
                  n = t >= this.pitchChannelCount + this.noiseChannelCount;
                for (let i = this.channels[t].instruments.length; i < a; i++)
                  this.channels[t].instruments[i] = new yt(e, n);
                if (((this.channels[t].instruments.length = a), h && i))
                  for (let i = 0; i < a; i++)
                    this.channels[t].instruments[i].setTypeAndReset(
                      e ? 2 : 0,
                      e,
                      n
                    );
                for (let e = P[t].length; e < a; e++) P[t][e] = {};
              }
            } else {
              const i = nt[t.charCodeAt(n++)];
              (this.layeredInstruments = !!(2 & i)),
                (this.patternInstruments = !!(1 & i));
              for (let i = 0; i < this.getChannelCount(); i++) {
                let a = 1;
                (this.layeredInstruments || this.patternInstruments) &&
                  (a = tt(
                    e.instrumentCountMin,
                    this.getMaxInstrumentsPerChannel(),
                    nt[t.charCodeAt(n++)] + e.instrumentCountMin
                  ));
                const r = this.channels[i],
                  o = this.getChannelIsNoise(i),
                  s = this.getChannelIsMod(i);
                for (let t = r.instruments.length; t < a; t++)
                  r.instruments[t] = new yt(o, s);
                r.instruments.length = a;
              }
            }
            break;
          case 114:
            (this.rhythm = nt[t.charCodeAt(n++)]),
              ((a && s) || i) &&
                ((this.rhythm != e.rhythms.dictionary["÷3 (triplets)"].index &&
                  this.rhythm != e.rhythms.dictionary["÷6"].index) ||
                  (q = !0),
                this.rhythm >= e.rhythms.dictionary["÷6"].index && (E = !0));
            break;
          case 111:
            if (s && i) {
              const i = nt[t.charCodeAt(n++)];
              (this.channels[i].octave = Z(
                0,
                e.pitchOctaves,
                nt[t.charCodeAt(n++)] + 1
              )),
                i >= this.pitchChannelCount && (this.channels[i].octave = 0);
            } else if ((x && i) || (c && a))
              for (let i = 0; i < this.getChannelCount(); i++)
                (this.channels[i].octave = Z(
                  0,
                  e.pitchOctaves,
                  nt[t.charCodeAt(n++)] + 1
                )),
                  i >= this.pitchChannelCount && (this.channels[i].octave = 0);
            else {
              for (let i = 0; i < this.pitchChannelCount; i++)
                this.channels[i].octave = Z(
                  0,
                  e.pitchOctaves,
                  nt[t.charCodeAt(n++)]
                );
              for (
                let t = this.pitchChannelCount;
                t < this.getChannelCount();
                t++
              )
                this.channels[t].octave = 0;
            }
            break;
          case 84:
            {
              D++,
                D >= this.channels[C].instruments.length && (C++, (D = 0)),
                tt(0, this.channels.length - 1, C);
              const r = this.channels[C].instruments[D];
              let s = tt(0, 10, nt[t.charCodeAt(n++)]);
              a && c
                ? (7 != s && 8 != s) || (s += 2)
                : a && h && ((8 != s && 9 != s) || (s += 1)),
                r.setTypeAndReset(
                  s,
                  C >= this.pitchChannelCount &&
                    C < this.pitchChannelCount + this.noiseChannelCount,
                  C >= this.pitchChannelCount + this.noiseChannelCount
                ),
                !((p && i) || (o && a)) ||
                  (0 != s && 9 != s && 6 != s) ||
                  ((r.aliases = !0), (r.distortion = 0), (r.effects |= 8)),
                q && (r.arpeggioSpeed = 9),
                E && (r.fastTwoNoteArp = !0),
                p &&
                  i &&
                  ((r.effects = 0),
                  r.chord != e.chords.dictionary.simultaneous.index &&
                    (r.effects |= 2048));
            }
            break;
          case 117:
            {
              const e = (nt[t.charCodeAt(n++)] << 6) | nt[t.charCodeAt(n++)];
              (this.channels[C].instruments[D].preset = e),
                a && c
                  ? 7 == this.channels[C].instruments[D].preset &&
                    ((this.channels[C].instruments[D].preset = 9),
                    (this.channels[C].instruments[D].type = 9))
                  : a &&
                    h &&
                    8 == this.channels[C].instruments[D].preset &&
                    ((this.channels[C].instruments[D].preset = 9),
                    (this.channels[C].instruments[D].type = 9)),
                i &&
                  e == $.nameToPresetValue("grand piano 1") &&
                  (this.channels[C].instruments[D].preset =
                    $.nameToPresetValue("grand piano 3"));
            }
            break;
          case 119:
            if (s && i) {
              const i = [1, 2, 3, 4, 5, 6, 7, 8, 0],
                a = nt[t.charCodeAt(n++)],
                r = this.channels[a].instruments[0];
              (r.chipWave = Z(
                0,
                e.chipWaves.length,
                0 | i[nt[t.charCodeAt(n++)]]
              )),
                r.convertLegacySettings(P[a][0], I);
            } else if (h && i) {
              const i = [1, 2, 3, 4, 5, 6, 7, 8, 0];
              for (let a = 0; a < this.getChannelCount(); a++)
                for (const r of this.channels[a].instruments)
                  a >= this.pitchChannelCount
                    ? (r.chipNoise = Z(
                        0,
                        e.chipNoises.length,
                        nt[t.charCodeAt(n++)]
                      ))
                    : (r.chipWave = Z(
                        0,
                        e.chipWaves.length,
                        0 | i[nt[t.charCodeAt(n++)]]
                      ));
            } else if (p && i) {
              const i = [1, 2, 3, 4, 5, 6, 7, 8, 0];
              C >= this.pitchChannelCount
                ? (this.channels[C].instruments[D].chipNoise = Z(
                    0,
                    e.chipNoises.length,
                    nt[t.charCodeAt(n++)]
                  ))
                : (this.channels[C].instruments[D].chipWave = Z(
                    0,
                    e.chipWaves.length,
                    0 | i[nt[t.charCodeAt(n++)]]
                  ));
            } else
              C >= this.pitchChannelCount
                ? (this.channels[C].instruments[D].chipNoise = Z(
                    0,
                    e.chipNoises.length,
                    nt[t.charCodeAt(n++)]
                  ))
                : (this.channels[C].instruments[D].chipWave = Z(
                    0,
                    e.chipWaves.length,
                    nt[t.charCodeAt(n++)]
                  ));
            break;
          case 102:
            if ((x && i) || (c && a))
              if (p && i) {
                const a = [10, 6, 3, 0, 8, 5, 2],
                  r = [
                    "none",
                    "none",
                    "none",
                    "none",
                    "decay 1",
                    "decay 2",
                    "decay 3",
                  ];
                if (s && i) {
                  const i = nt[t.charCodeAt(n++)],
                    o = this.channels[i].instruments[0],
                    s = P[i][0],
                    l = [1, 3, 4, 5][Z(0, a.length, nt[t.charCodeAt(n++)])];
                  (s.filterCutoff = a[l]),
                    (s.filterResonance = 0),
                    (s.filterEnvelope = e.envelopes.dictionary[r[l]]),
                    o.convertLegacySettings(s, I);
                } else if (h && i)
                  for (let i = 0; i < this.getChannelCount(); i++)
                    for (
                      let o = 0;
                      o < this.channels[i].instruments.length;
                      o++
                    ) {
                      const s = this.channels[i].instruments[o],
                        l = P[i][o],
                        c = Z(0, a.length, nt[t.charCodeAt(n++)] + 1);
                      i < this.pitchChannelCount
                        ? ((l.filterCutoff = a[c]),
                          (l.filterResonance = 0),
                          (l.filterEnvelope = e.envelopes.dictionary[r[c]]))
                        : ((l.filterCutoff = 10),
                          (l.filterResonance = 0),
                          (l.filterEnvelope = e.envelopes.dictionary.none)),
                        s.convertLegacySettings(l, I);
                    }
                else {
                  const i = Z(0, a.length, nt[t.charCodeAt(n++)]),
                    o = this.channels[C].instruments[D],
                    s = P[C][D];
                  (s.filterCutoff = a[i]),
                    (s.filterResonance = 0),
                    (s.filterEnvelope = e.envelopes.dictionary[r[i]]),
                    o.convertLegacySettings(s, I);
                }
              } else {
                const e = 11,
                  i = this.channels[C].instruments[D],
                  a = P[C][D];
                (a.filterCutoff = Z(0, e, nt[t.charCodeAt(n++)])),
                  i.convertLegacySettings(a, I);
              }
            else {
              const r = this.channels[C].instruments[D];
              let o = nt[t.charCodeAt(n++)];
              if (i || 0 == o) {
                (r.eqFilterType = !1), a && (o = nt[t.charCodeAt(n++)]);
                const i = o;
                r.eqFilter.controlPointCount = Z(0, e.filterMaxPoints + 1, i);
                for (
                  let t = r.eqFilter.controlPoints.length;
                  t < r.eqFilter.controlPointCount;
                  t++
                )
                  r.eqFilter.controlPoints[t] = new mt();
                for (let i = 0; i < r.eqFilter.controlPointCount; i++) {
                  const a = r.eqFilter.controlPoints[i];
                  (a.type = Z(0, 3, nt[t.charCodeAt(n++)])),
                    (a.freq = Z(0, e.filterFreqRange, nt[t.charCodeAt(n++)])),
                    (a.gain = Z(0, e.filterGainRange, nt[t.charCodeAt(n++)]));
                }
                for (let t = r.eqFilter.controlPointCount; t < i; t++) n += 3;
                if (((r.eqSubFilters[0] = r.eqFilter), a && !c)) {
                  let i = (nt[t.charCodeAt(n++)] << 6) | nt[t.charCodeAt(n++)];
                  for (let a = 0; a < e.filterMorphCount - 1; a++)
                    if (i & (1 << a)) {
                      const i = nt[t.charCodeAt(n++)];
                      null == r.eqSubFilters[a + 1] &&
                        (r.eqSubFilters[a + 1] = new ut()),
                        (r.eqSubFilters[a + 1].controlPointCount = Z(
                          0,
                          e.filterMaxPoints + 1,
                          i
                        ));
                      for (
                        let t = r.eqSubFilters[a + 1].controlPoints.length;
                        t < r.eqSubFilters[a + 1].controlPointCount;
                        t++
                      )
                        r.eqSubFilters[a + 1].controlPoints[t] = new mt();
                      for (
                        let i = 0;
                        i < r.eqSubFilters[a + 1].controlPointCount;
                        i++
                      ) {
                        const o = r.eqSubFilters[a + 1].controlPoints[i];
                        (o.type = Z(0, 3, nt[t.charCodeAt(n++)])),
                          (o.freq = Z(
                            0,
                            e.filterFreqRange,
                            nt[t.charCodeAt(n++)]
                          )),
                          (o.gain = Z(
                            0,
                            e.filterGainRange,
                            nt[t.charCodeAt(n++)]
                          ));
                      }
                      for (
                        let t = r.eqSubFilters[a + 1].controlPointCount;
                        t < i;
                        t++
                      )
                        n += 3;
                    }
                }
              } else
                (r.eqFilterType = !0),
                  (r.eqFilterSimpleCut = Z(
                    0,
                    e.filterSimpleCutRange,
                    nt[t.charCodeAt(n++)]
                  )),
                  (r.eqFilterSimplePeak = Z(
                    0,
                    e.filterSimplePeakRange,
                    nt[t.charCodeAt(n++)]
                  ));
            }
            break;
          case 121:
            if ((x && i) || (c && a)) {
              const e = 8,
                i = this.channels[C].instruments[D],
                a = P[C][D];
              (a.filterResonance = Z(0, e, nt[t.charCodeAt(n++)])),
                i.convertLegacySettings(a, I);
            }
            break;
          case 122:
            {
              const r = this.channels[C].instruments[D];
              if ((x && i) || (c && a))
                if (4 == r.type)
                  for (let i = 0; i < e.drumCount; i++)
                    r.drumsetEnvelopes[i] = gt.R(nt[t.charCodeAt(n++)]).index;
                else {
                  const e = P[C][D];
                  (e.filterEnvelope = gt.R(nt[t.charCodeAt(n++)])),
                    r.convertLegacySettings(e, I);
                }
              else
                for (let i = 0; i < e.drumCount; i++)
                  r.drumsetEnvelopes[i] = Z(
                    0,
                    e.envelopes.length,
                    nt[t.charCodeAt(n++)]
                  );
            }
            break;
          case 87:
            {
              const r = this.channels[C].instruments[D];
              if (
                ((r.pulseWidth = Z(
                  0,
                  e.pulseWidthRange + +a,
                  nt[t.charCodeAt(n++)]
                )),
                i &&
                  (r.pulseWidth = Math.round(
                    Math.pow(0.5, (7 - r.pulseWidth) * e.pulseWidthStepPower) *
                      e.pulseWidthRange
                  )),
                (x && i) || (c && a))
              ) {
                const e = P[C][D];
                (e.pulseEnvelope = gt.R(nt[t.charCodeAt(n++)])),
                  r.convertLegacySettings(e, I);
              }
            }
            break;
          case 120:
            {
              const i = this.channels[C].instruments[D];
              (i.supersawDynamism = Z(
                0,
                e.supersawDynamismMax + 1,
                nt[t.charCodeAt(n++)]
              )),
                (i.supersawSpread = Z(
                  0,
                  e.supersawSpreadMax + 1,
                  nt[t.charCodeAt(n++)]
                )),
                (i.supersawShape = Z(
                  0,
                  e.supersawShapeMax + 1,
                  nt[t.charCodeAt(n++)]
                ));
            }
            break;
          case 73:
            {
              const i = this.channels[C].instruments[D],
                a = nt[t.charCodeAt(n++)];
              (i.stringSustain = Z(0, e.stringSustainRange, 31 & a)),
                (i.stringSustainType = e.enableAcousticSustain
                  ? Z(0, 2, a >> 5)
                  : 0);
            }
            break;
          case 100:
            if ((x && i) || (c && a)) {
              const a = [
                { transition: "interrupt", fadeInSeconds: 0, fadeOutTicks: -1 },
                { transition: "normal", fadeInSeconds: 0, fadeOutTicks: -3 },
                {
                  transition: "normal",
                  fadeInSeconds: 0.025,
                  fadeOutTicks: -3,
                },
                {
                  transition: "slide in pattern",
                  fadeInSeconds: 0.025,
                  fadeOutTicks: -3,
                },
                { transition: "normal", fadeInSeconds: 0.04, fadeOutTicks: 6 },
                { transition: "normal", fadeInSeconds: 0, fadeOutTicks: 48 },
                {
                  transition: "normal",
                  fadeInSeconds: 0.0125,
                  fadeOutTicks: 72,
                },
                { transition: "normal", fadeInSeconds: 0.06, fadeOutTicks: 96 },
              ];
              if (s && i) {
                const i = nt[t.charCodeAt(n++)],
                  r = a[Z(0, a.length, nt[t.charCodeAt(n++)])],
                  o = this.channels[i].instruments[0];
                (o.fadeIn = St.secondsToFadeInSetting(r.fadeInSeconds)),
                  (o.fadeOut = St.ticksToFadeOutSetting(r.fadeOutTicks)),
                  (o.transition = e.transitions.dictionary[r.transition].index),
                  o.transition != e.transitions.dictionary.normal.index &&
                    (o.effects |= 1024);
              } else if (h && i)
                for (let i = 0; i < this.getChannelCount(); i++)
                  for (const r of this.channels[i].instruments) {
                    const i = a[Z(0, a.length, nt[t.charCodeAt(n++)])];
                    (r.fadeIn = St.secondsToFadeInSetting(i.fadeInSeconds)),
                      (r.fadeOut = St.ticksToFadeOutSetting(i.fadeOutTicks)),
                      (r.transition =
                        e.transitions.dictionary[i.transition].index),
                      r.transition != e.transitions.dictionary.normal.index &&
                        (r.effects |= 1024);
                  }
              else if (l || i) {
                const i = a[Z(0, a.length, nt[t.charCodeAt(n++)])],
                  r = this.channels[C].instruments[D];
                (r.fadeIn = St.secondsToFadeInSetting(i.fadeInSeconds)),
                  (r.fadeOut = St.ticksToFadeOutSetting(i.fadeOutTicks)),
                  (r.transition = e.transitions.dictionary[i.transition].index),
                  r.transition != e.transitions.dictionary.normal.index &&
                    (r.effects |= 1024);
              } else {
                const i = a[Z(0, a.length, nt[t.charCodeAt(n++)])],
                  r = this.channels[C].instruments[D];
                (r.fadeIn = St.secondsToFadeInSetting(i.fadeInSeconds)),
                  (r.fadeOut = St.ticksToFadeOutSetting(i.fadeOutTicks)),
                  (r.transition = e.transitions.dictionary[i.transition].index),
                  nt[t.charCodeAt(n++)] > 0 && (r.legacyTieOver = !0),
                  (r.clicklessTransition = !!nt[t.charCodeAt(n++)]),
                  (r.transition != e.transitions.dictionary.normal.index ||
                    r.clicklessTransition) &&
                    (r.effects |= 1024);
              }
            } else {
              const i = this.channels[C].instruments[D];
              (i.fadeIn = Z(0, e.fadeInRange, nt[t.charCodeAt(n++)])),
                (i.fadeOut = Z(
                  0,
                  e.fadeOutTicks.length,
                  nt[t.charCodeAt(n++)]
                )),
                a && (i.clicklessTransition = !!nt[t.charCodeAt(n++)]);
            }
            break;
          case 99:
            if ((x && i) || (c && a))
              if (p && i)
                if (s && i) {
                  const i = [0, 3, 2, 0],
                    a = ["none", "none", "none", "tremolo2"],
                    r = nt[t.charCodeAt(n++)],
                    o = Z(0, i.length, nt[t.charCodeAt(n++)]),
                    s = this.channels[r].instruments[0],
                    l = P[r][0];
                  (s.vibrato = i[o]),
                    (null != l.filterEnvelope && 1 != l.filterEnvelope.type) ||
                      ((l.filterEnvelope = e.envelopes.dictionary[a[o]]),
                      s.convertLegacySettings(l, I)),
                    s.vibrato != e.vibratos.dictionary.none.index &&
                      (s.effects |= 512);
                } else if (h && i) {
                  const i = [0, 1, 2, 3, 0, 0],
                    r = [
                      "none",
                      "none",
                      "none",
                      "none",
                      "tremolo5",
                      "tremolo2",
                    ];
                  for (let o = 0; o < this.getChannelCount(); o++)
                    for (
                      let s = 0;
                      s < this.channels[o].instruments.length;
                      s++
                    ) {
                      const l = Z(0, i.length, nt[t.charCodeAt(n++)]),
                        h = this.channels[o].instruments[s],
                        p = P[o][s];
                      (h.vibrato = i[l]),
                        (null != p.filterEnvelope &&
                          1 != p.filterEnvelope.type) ||
                          ((p.filterEnvelope = e.envelopes.dictionary[r[l]]),
                          h.convertLegacySettings(p, I)),
                        h.vibrato != e.vibratos.dictionary.none.index &&
                          (h.effects |= 512),
                        (0 != T || (a && c)) &&
                          !this.getChannelIsNoise(o) &&
                          ((h.effects |= 1), (h.reverb = T));
                    }
                } else {
                  const i = [0, 1, 2, 3, 0, 0],
                    r = [
                      "none",
                      "none",
                      "none",
                      "none",
                      "tremolo5",
                      "tremolo2",
                    ],
                    o = Z(0, i.length, nt[t.charCodeAt(n++)]),
                    s = this.channels[C].instruments[D],
                    l = P[C][D];
                  (s.vibrato = i[o]),
                    (null != l.filterEnvelope && 1 != l.filterEnvelope.type) ||
                      ((l.filterEnvelope = e.envelopes.dictionary[r[o]]),
                      s.convertLegacySettings(l, I)),
                    s.vibrato != e.vibratos.dictionary.none.index &&
                      (s.effects |= 512),
                    (0 != T || (a && c)) && ((s.effects |= 1), (s.reverb = T));
                }
              else {
                const i = this.channels[C].instruments[D],
                  a = Z(0, e.vibratos.length + 1, nt[t.charCodeAt(n++)]);
                (i.vibrato = a),
                  i.vibrato != e.vibratos.dictionary.none.index &&
                    (i.effects |= 512),
                  a == e.vibratos.length
                    ? ((i.vibratoDepth =
                        Z(
                          0,
                          e.modulators.dictionary["vibrato depth"].maxRawVol +
                            1,
                          nt[t.charCodeAt(n++)]
                        ) / 50),
                      (i.vibratoSpeed = Z(
                        0,
                        e.modulators.dictionary["vibrato speed"].maxRawVol + 1,
                        nt[t.charCodeAt(n++)]
                      )),
                      (i.vibratoDelay =
                        Z(
                          0,
                          e.modulators.dictionary["vibrato delay"].maxRawVol +
                            1,
                          nt[t.charCodeAt(n++)]
                        ) / 2),
                      (i.vibratoType = Z(
                        0,
                        e.vibratoTypes.length,
                        nt[t.charCodeAt(n++)]
                      )),
                      (i.effects |= 512))
                    : ((i.vibratoDepth = e.vibratos[i.vibrato].amplitude),
                      (i.vibratoSpeed = 10),
                      (i.vibratoDelay = e.vibratos[i.vibrato].delayTicks / 2),
                      (i.vibratoType = e.vibratos[i.vibrato].type));
              }
            break;
          case 71:
            if (a && c) {
              const i = this.channels[C].instruments[D];
              (i.arpeggioSpeed = Z(
                0,
                e.modulators.dictionary["arp speed"].maxRawVol + 1,
                nt[t.charCodeAt(n++)]
              )),
                (i.fastTwoNoteArp = !!nt[t.charCodeAt(n++)]);
            }
            break;
          case 104:
            if (s && i) {
              const i = nt[t.charCodeAt(n++)];
              this.channels[i].instruments[0].unison = Z(
                0,
                e.unisons.length,
                nt[t.charCodeAt(n++)]
              );
            } else if (h && i)
              for (let i = 0; i < this.getChannelCount(); i++)
                for (const a of this.channels[i].instruments) {
                  const i = nt[t.charCodeAt(n++)];
                  let r = Z(0, e.unisons.length, i);
                  8 == i && ((r = 2), (a.chord = 3)), (a.unison = r);
                }
            else if (p && i) {
              const i = nt[t.charCodeAt(n++)];
              let a = Z(0, e.unisons.length, i);
              8 == i && ((a = 2), (this.channels[C].instruments[D].chord = 3)),
                (this.channels[C].instruments[D].unison = a);
            } else
              this.channels[C].instruments[D].unison = Z(
                0,
                e.unisons.length,
                nt[t.charCodeAt(n++)]
              );
            break;
          case 67:
            if ((x && i) || (c && a)) {
              const i = this.channels[C].instruments[D];
              (i.chord = Z(0, e.chords.length, nt[t.charCodeAt(n++)])),
                i.chord != e.chords.dictionary.simultaneous.index &&
                  (i.effects |= 2048);
            }
            break;
          case 113:
            {
              const r = this.channels[C].instruments[D];
              if ((x && i) || (c && a)) {
                (r.effects = 4095 & nt[t.charCodeAt(n++)]),
                  0 != T || (a && c)
                    ? F(r.effects) && (r.reverb = T)
                    : (r.effects &= -2),
                  (r.effects |= 4),
                  r.vibrato != e.vibratos.dictionary.none.index &&
                    (r.effects |= 512),
                  r.detune != e.detuneCenter && (r.effects |= 256),
                  r.aliases ? (r.effects |= 8) : (r.effects &= -9);
                const i = P[C][D];
                r.convertLegacySettings(i, I);
              } else {
                if (
                  ((r.effects =
                    (nt[t.charCodeAt(n++)] << 6) | nt[t.charCodeAt(n++)]),
                  b(r.effects))
                ) {
                  let o = nt[t.charCodeAt(n++)];
                  if (i || 0 == o) {
                    (r.noteFilterType = !1),
                      a && (o = nt[t.charCodeAt(n++)]),
                      (r.noteFilter.controlPointCount = Z(
                        0,
                        e.filterMaxPoints + 1,
                        o
                      ));
                    for (
                      let t = r.noteFilter.controlPoints.length;
                      t < r.noteFilter.controlPointCount;
                      t++
                    )
                      r.noteFilter.controlPoints[t] = new mt();
                    for (let i = 0; i < r.noteFilter.controlPointCount; i++) {
                      const a = r.noteFilter.controlPoints[i];
                      (a.type = Z(0, 3, nt[t.charCodeAt(n++)])),
                        (a.freq = Z(
                          0,
                          e.filterFreqRange,
                          nt[t.charCodeAt(n++)]
                        )),
                        (a.gain = Z(
                          0,
                          e.filterGainRange,
                          nt[t.charCodeAt(n++)]
                        ));
                    }
                    for (let t = r.noteFilter.controlPointCount; t < o; t++)
                      n += 3;
                    if (((r.noteSubFilters[0] = r.noteFilter), a && !c)) {
                      let i =
                        (nt[t.charCodeAt(n++)] << 6) | nt[t.charCodeAt(n++)];
                      for (let a = 0; a < e.filterMorphCount - 1; a++)
                        if (i & (1 << a)) {
                          const i = nt[t.charCodeAt(n++)];
                          null == r.noteSubFilters[a + 1] &&
                            (r.noteSubFilters[a + 1] = new ut()),
                            (r.noteSubFilters[a + 1].controlPointCount = Z(
                              0,
                              e.filterMaxPoints + 1,
                              i
                            ));
                          for (
                            let t =
                              r.noteSubFilters[a + 1].controlPoints.length;
                            t < r.noteSubFilters[a + 1].controlPointCount;
                            t++
                          )
                            r.noteSubFilters[a + 1].controlPoints[t] = new mt();
                          for (
                            let i = 0;
                            i < r.noteSubFilters[a + 1].controlPointCount;
                            i++
                          ) {
                            const o = r.noteSubFilters[a + 1].controlPoints[i];
                            (o.type = Z(0, 3, nt[t.charCodeAt(n++)])),
                              (o.freq = Z(
                                0,
                                e.filterFreqRange,
                                nt[t.charCodeAt(n++)]
                              )),
                              (o.gain = Z(
                                0,
                                e.filterGainRange,
                                nt[t.charCodeAt(n++)]
                              ));
                          }
                          for (
                            let t = r.noteSubFilters[a + 1].controlPointCount;
                            t < i;
                            t++
                          )
                            n += 3;
                        }
                    }
                  } else
                    (r.noteFilterType = !0),
                      r.noteFilter.reset(),
                      (r.noteFilterSimpleCut = Z(
                        0,
                        e.filterSimpleCutRange,
                        nt[t.charCodeAt(n++)]
                      )),
                      (r.noteFilterSimplePeak = Z(
                        0,
                        e.filterSimplePeakRange,
                        nt[t.charCodeAt(n++)]
                      ));
                }
                d(r.effects) &&
                  (r.transition = Z(
                    0,
                    e.transitions.length,
                    nt[t.charCodeAt(n++)]
                  )),
                  m(r.effects) &&
                    ((r.chord = Z(0, e.chords.length, nt[t.charCodeAt(n++)])),
                    r.chord == e.chords.dictionary.arpeggio.index &&
                      a &&
                      ((r.arpeggioSpeed = nt[t.charCodeAt(n++)]),
                      (r.fastTwoNoteArp = !!nt[t.charCodeAt(n++)]))),
                  u(r.effects) &&
                    (r.pitchShift = Z(
                      0,
                      e.pitchShiftRange,
                      nt[t.charCodeAt(n++)]
                    )),
                  f(r.effects) &&
                    (i
                      ? ((r.detune = Z(
                          e.detuneMin,
                          e.detuneMax + 1,
                          nt[t.charCodeAt(n++)]
                        )),
                        (r.detune = Math.round(
                          ((r.detune - 9) * (Math.abs(r.detune - 9) + 1)) / 2 +
                            e.detuneCenter
                        )))
                      : (r.detune = Z(
                          e.detuneMin,
                          e.detuneMax + 1,
                          (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)]
                        ))),
                  y(r.effects) &&
                    ((r.vibrato = Z(
                      0,
                      e.vibratos.length + 1,
                      nt[t.charCodeAt(n++)]
                    )),
                    r.vibrato == e.vibratos.length && a
                      ? ((r.vibratoDepth =
                          Z(
                            0,
                            e.modulators.dictionary["vibrato depth"].maxRawVol +
                              1,
                            nt[t.charCodeAt(n++)]
                          ) / 25),
                        (r.vibratoSpeed = Z(
                          0,
                          e.modulators.dictionary["vibrato speed"].maxRawVol +
                            1,
                          nt[t.charCodeAt(n++)]
                        )),
                        (r.vibratoDelay = Z(
                          0,
                          e.modulators.dictionary["vibrato delay"].maxRawVol +
                            1,
                          nt[t.charCodeAt(n++)]
                        )),
                        (r.vibratoType = Z(
                          0,
                          e.vibratoTypes.length,
                          nt[t.charCodeAt(n++)]
                        )))
                      : ((r.vibratoDepth = e.vibratos[r.vibrato].amplitude),
                        (r.vibratoSpeed = 10),
                        (r.vibratoDelay = e.vibratos[r.vibrato].delayTicks / 2),
                        (r.vibratoType = e.vibratos[r.vibrato].type))),
                  g(r.effects) &&
                    ((r.distortion = Z(
                      0,
                      e.distortionRange,
                      nt[t.charCodeAt(n++)]
                    )),
                    a && !c && (r.aliases = !!nt[t.charCodeAt(n++)])),
                  v(r.effects) &&
                    ((r.bitcrusherFreq = Z(
                      0,
                      e.bitcrusherFreqRange,
                      nt[t.charCodeAt(n++)]
                    )),
                    (r.bitcrusherQuantization = Z(
                      0,
                      e.bitcrusherQuantizationRange,
                      nt[t.charCodeAt(n++)]
                    ))),
                  k(r.effects) &&
                    ((r.pan = Z(
                      0,
                      e.panMax + 1,
                      i
                        ? Math.round(nt[t.charCodeAt(n++)] * (e.panMax / 8))
                        : (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)]
                    )),
                    a && !o && (r.panDelay = nt[t.charCodeAt(n++)])),
                  w(r.effects) &&
                    (r.chorus = i
                      ? 2 * Z(0, e.chorusRange / 2 + 1, nt[t.charCodeAt(n++)])
                      : Z(0, e.chorusRange, nt[t.charCodeAt(n++)])),
                  M(r.effects) &&
                    ((r.echoSustain = Z(
                      0,
                      e.echoSustainRange,
                      nt[t.charCodeAt(n++)]
                    )),
                    (r.echoDelay = Z(
                      0,
                      e.echoDelayRange,
                      nt[t.charCodeAt(n++)]
                    ))),
                  F(r.effects) &&
                    (r.reverb = Z(
                      0,
                      e.reverbRange,
                      i
                        ? Math.round(
                            (nt[t.charCodeAt(n++)] * e.reverbRange) / 3
                          )
                        : nt[t.charCodeAt(n++)]
                    ));
              }
              r.effects &= 4095;
            }
            break;
          case 118:
            if (s && i) {
              const i = nt[t.charCodeAt(n++)];
              this.channels[i].instruments[0].volume = Math.round(
                Z(-e.volumeRange / 2, 1, 5 * -nt[t.charCodeAt(n++)])
              );
            } else if (h && i)
              for (let i = 0; i < this.getChannelCount(); i++)
                for (const a of this.channels[i].instruments)
                  a.volume = Math.round(
                    Z(-e.volumeRange / 2, 1, 5 * -nt[t.charCodeAt(n++)])
                  );
            else if (p && i) {
              this.channels[C].instruments[D].volume = Math.round(
                Z(-e.volumeRange / 2, 1, 5 * -nt[t.charCodeAt(n++)])
              );
            } else if (i) {
              this.channels[C].instruments[D].volume = Math.round(
                Z(-e.volumeRange / 2, 1, (25 * -nt[t.charCodeAt(n++)]) / 7)
              );
            } else {
              this.channels[C].instruments[D].volume = Math.round(
                Z(
                  -e.volumeRange / 2,
                  e.volumeRange / 2 + 1,
                  ((nt[t.charCodeAt(n++)] << 6) | nt[t.charCodeAt(n++)]) -
                    e.volumeRange / 2
                )
              );
            }
            break;
          case 76:
            if (x && i) {
              this.channels[C].instruments[D].pan = Z(
                0,
                e.panMax + 1,
                nt[t.charCodeAt(n++)] * (e.panMax / 8)
              );
            } else if (c && a) {
              const i = this.channels[C].instruments[D];
              (i.pan = Z(
                0,
                e.panMax + 1,
                (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)]
              )),
                a && !s && (i.panDelay = nt[t.charCodeAt(n++)]);
            }
            break;
          case 68:
            {
              const i = this.channels[C].instruments[D];
              a &&
                c &&
                ((i.detune = Z(
                  e.detuneMin,
                  e.detuneMax + 1,
                  4 * ((nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)])
                )),
                (i.effects |= 256));
            }
            break;
          case 77:
            {
              let e = this.channels[C].instruments[D];
              for (let i = 0; i < 64; i++)
                e.customChipWave[i] = Z(-24, 25, nt[t.charCodeAt(n++)] - 24);
              let i = 0;
              for (let t = 0; t < e.customChipWave.length; t++)
                i += e.customChipWave[t];
              const a = i / e.customChipWave.length;
              let r = 0,
                o = 0;
              for (let t = 0; t < e.customChipWave.length; t++)
                (r += o),
                  (o = e.customChipWave[t] - a),
                  (e.customChipWaveIntegral[t] = r);
              e.customChipWaveIntegral[64] = 0;
            }
            break;
          case 79:
            {
              let e = nt[t.charCodeAt(n++)];
              63 == e
                ? this.restoreLimiterDefaults()
                : ((this.compressionRatio =
                    e < 10 ? e / 10 : 1 + (e - 10) / 60),
                  (e = nt[t.charCodeAt(n++)]),
                  (this.limitRatio = e < 10 ? e / 10 : e - 9),
                  (this.limitDecay = nt[t.charCodeAt(n++)]),
                  (this.limitRise = 250 * nt[t.charCodeAt(n++)] + 2e3),
                  (this.compressionThreshold = nt[t.charCodeAt(n++)] / 20),
                  (this.limitThreshold = nt[t.charCodeAt(n++)] / 20),
                  (this.masterGain =
                    ((nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)]) /
                    50));
            }
            break;
          case 85:
            for (let e = 0; e < this.getChannelCount(); e++) {
              var R;
              (R = l
                ? nt[t.charCodeAt(n++)]
                : (nt[t.charCodeAt(n++)] << 6) + nt[t.charCodeAt(n++)]),
                (this.channels[e].name = decodeURIComponent(
                  t.substring(n, n + R)
                )),
                (n += R);
            }
            break;
          case 65:
            {
              const r = this.channels[C].instruments[D];
              if (
                ((r.algorithm = Z(
                  0,
                  e.algorithms.length,
                  nt[t.charCodeAt(n++)]
                )),
                (x && i) || (c && a))
              ) {
                const t = P[C][D];
                r.convertLegacySettings(t, I);
              }
            }
            break;
          case 70:
            this.channels[C].instruments[D].feedbackType = Z(
              0,
              e.feedbacks.length,
              nt[t.charCodeAt(n++)]
            );
            break;
          case 66:
            this.channels[C].instruments[D].feedbackAmplitude = Z(
              0,
              e.operatorAmplitudeMax + 1,
              nt[t.charCodeAt(n++)]
            );
            break;
          case 86:
            if ((x && i) || (c && a)) {
              const e = this.channels[C].instruments[D],
                i = P[C][D];
              (i.feedbackEnvelope = gt.R(nt[t.charCodeAt(n++)])),
                e.convertLegacySettings(i, I);
            }
            break;
          case 81:
            for (let i = 0; i < e.operatorCount; i++)
              this.channels[C].instruments[D].operators[i].frequency = Z(
                0,
                e.operatorFrequencies.length,
                nt[t.charCodeAt(n++)]
              );
            break;
          case 80:
            for (let i = 0; i < e.operatorCount; i++)
              this.channels[C].instruments[D].operators[i].amplitude = Z(
                0,
                e.operatorAmplitudeMax + 1,
                nt[t.charCodeAt(n++)]
              );
            break;
          case 69:
            {
              const r = this.channels[C].instruments[D];
              if ((x && i) || (c && a)) {
                const i = P[C][D];
                i.operatorEnvelopes = [];
                for (let a = 0; a < e.operatorCount; a++)
                  i.operatorEnvelopes[a] = gt.R(nt[t.charCodeAt(n++)]);
                r.convertLegacySettings(i, I);
              } else {
                const i = Z(0, e.maxEnvelopeCount + 1, nt[t.charCodeAt(n++)]);
                a &&
                  !h &&
                  ((r.envelopeSpeed = Z(
                    0,
                    e.modulators.dictionary["envelope speed"].maxRawVol + 1,
                    nt[t.charCodeAt(n++)]
                  )),
                  (r.discreteEnvelope = !!nt[t.charCodeAt(n++)]));
                for (let a = 0; a < i; a++) {
                  const i = Z(
                    0,
                    e.instrumentAutomationTargets.length,
                    nt[t.charCodeAt(n++)]
                  );
                  let a = 0;
                  const o = e.instrumentAutomationTargets[i].maxCount;
                  o > 1 && (a = Z(0, o, nt[t.charCodeAt(n++)]));
                  const s = Z(0, e.envelopes.length, nt[t.charCodeAt(n++)]);
                  r.addEnvelope(i, a, s);
                }
              }
            }
            break;
          case 82:
            {
              const i = this.channels[C].instruments[D];
              for (let a = 0; a < e.operatorCount; a++)
                (i.operators[a].waveform = Z(
                  0,
                  e.operatorWaves.length,
                  nt[t.charCodeAt(n++)]
                )),
                  3 == i.operators[a].waveform &&
                    (i.operators[a].pulseWidth = Z(
                      0,
                      e.pwmOperatorWaves.length,
                      nt[t.charCodeAt(n++)]
                    ));
            }
            break;
          case 83:
            {
              const i = this.channels[C].instruments[D];
              if (3 == i.type) {
                const a = Math.ceil(
                    (e.spectrumControlPoints * e.spectrumControlPointBits) / 6
                  ),
                  r = new it(t, n, n + a);
                for (let t = 0; t < e.spectrumControlPoints; t++)
                  i.spectrumWave.spectrum[t] = r.read(
                    e.spectrumControlPointBits
                  );
                i.spectrumWave.markCustomWaveDirty(), (n += a);
              } else {
                if (4 != i.type)
                  throw new Error(
                    "Unhandled instrument type for spectrum song tag code."
                  );
                {
                  const a = Math.ceil(
                      (e.drumCount *
                        e.spectrumControlPoints *
                        e.spectrumControlPointBits) /
                        6
                    ),
                    r = new it(t, n, n + a);
                  for (let t = 0; t < e.drumCount; t++) {
                    for (let n = 0; n < e.spectrumControlPoints; n++)
                      i.drumsetSpectrumWaves[t].spectrum[n] = r.read(
                        e.spectrumControlPointBits
                      );
                    i.drumsetSpectrumWaves[t].markCustomWaveDirty();
                  }
                  n += a;
                }
              }
            }
            break;
          case 72:
            {
              const i = this.channels[C].instruments[D],
                a = Math.ceil(
                  (e.harmonicsControlPoints * e.harmonicsControlPointBits) / 6
                ),
                r = new it(t, n, n + a);
              for (let t = 0; t < e.harmonicsControlPoints; t++)
                i.harmonicsWave.harmonics[t] = r.read(
                  e.harmonicsControlPointBits
                );
              i.harmonicsWave.markCustomWaveDirty(), (n += a);
            }
            break;
          case 88:
            if (a && c) {
              const e = this.channels[C].instruments[D];
              (e.aliases = !!nt[t.charCodeAt(n++)]),
                e.aliases && ((e.distortion = 0), (e.effects |= 8));
            }
            break;
          case 98:
            {
              let e;
              if (s && i) {
                const i = nt[t.charCodeAt(n++)],
                  a = nt[t.charCodeAt(n++)];
                e = Math.ceil(0.5 * a);
                const r = new it(t, n, n + e);
                for (let t = 0; t < a; t++)
                  this.channels[i].bars[t] = r.read(3) + 1;
              } else if (c && i) {
                let i = 0;
                for (; 1 << i < this.patternsPerChannel; ) i++;
                e = Math.ceil((this.getChannelCount() * this.barCount * i) / 6);
                const a = new it(t, n, n + e);
                for (let t = 0; t < this.getChannelCount(); t++)
                  for (let e = 0; e < this.barCount; e++)
                    this.channels[t].bars[e] = a.read(i) + 1;
              } else {
                let i = 0;
                for (; 1 << i < this.patternsPerChannel + 1; ) i++;
                e = Math.ceil((this.getChannelCount() * this.barCount * i) / 6);
                const a = new it(t, n, n + e);
                for (let t = 0; t < this.getChannelCount(); t++)
                  for (let e = 0; e < this.barCount; e++)
                    this.channels[t].bars[e] = a.read(i);
              }
              n += e;
            }
            break;
          case 112:
            {
              let r,
                o = 0,
                h = !((l && a) || i),
                d = h ? 4 : 3,
                m = h ? 16 : 8;
              if (s && i)
                (r = nt[t.charCodeAt(n++)]),
                  n++,
                  (o = nt[t.charCodeAt(n++)]),
                  (o <<= 6),
                  (o += nt[t.charCodeAt(n++)]);
              else {
                r = 0;
                let e = tt(1, 4, nt[t.charCodeAt(n++)]);
                for (; e > 0; ) (o <<= 6), (o += nt[t.charCodeAt(n++)]), e--;
              }
              const u = new it(t, n, n + o);
              n += o;
              const f = gt.getNeededBits(e.noteSizeMax);
              let y = -1,
                g = -1,
                v = -1;
              for (;;) {
                const t = this.channels[r],
                  n = this.getChannelIsNoise(r),
                  o = this.getChannelIsMod(r),
                  k = this.getMaxInstrumentsPerPattern(r),
                  w = gt.getNeededBits(k - e.instrumentCountMin),
                  M = gt.getNeededBits(t.instruments.length - 1);
                if (o) {
                  const n = c
                    ? M
                    : gt.getNeededBits(this.getMaxInstrumentsPerChannel() + 2);
                  for (let i = 0; i < t.instruments.length; i++) {
                    let a = t.instruments[i];
                    for (let t = 0; t < e.modCount; t++) {
                      let o = u.read(2);
                      switch (o) {
                        case 0:
                          (a.modChannels[t] = Z(
                            0,
                            this.pitchChannelCount + this.noiseChannelCount + 1,
                            u.read(8)
                          )),
                            (a.modInstruments[t] = Z(
                              0,
                              this.channels[a.modChannels[t]].instruments
                                .length + 2,
                              u.read(n)
                            ));
                          break;
                        case 1:
                          (a.modChannels[t] =
                            this.pitchChannelCount +
                            Z(0, this.noiseChannelCount + 1, u.read(8))),
                            (a.modInstruments[t] = Z(
                              0,
                              this.channels[a.modChannels[t]].instruments
                                .length + 2,
                              u.read(M)
                            ));
                          break;
                        case 2:
                          a.modChannels[t] = -1;
                          break;
                        case 3:
                          a.modChannels[t] = -2;
                      }
                      if (
                        (3 != o && (a.modulators[t] = u.read(6)),
                        c ||
                          ("eq filter" != e.modulators[a.modulators[t]].name &&
                            "note filter" !=
                              e.modulators[a.modulators[t]].name) ||
                          (a.modFilterTypes[t] = u.read(6)),
                        c && a.modChannels[t] >= 0)
                      ) {
                        let n = b(
                          this.channels[a.modChannels[t]].instruments[
                            a.modInstruments[t]
                          ].effects
                        );
                        7 == a.modulators[t]
                          ? ((a.modulators[t] = n
                              ? e.modulators.dictionary["note filt cut"].index
                              : e.modulators.dictionary["eq filt cut"].index),
                            (a.modFilterTypes[t] = 1))
                          : 8 == a.modulators[t] &&
                            ((a.modulators[t] = n
                              ? e.modulators.dictionary["note filt peak"].index
                              : e.modulators.dictionary["eq filt peak"].index),
                            (a.modFilterTypes[t] = 2));
                      } else
                        c &&
                          a.modulators[t] ==
                            e.modulators.dictionary["song reverb"].index &&
                          ((y = r), (g = i), (v = t));
                      c &&
                        12 != e.modulators[a.modulators[t]].associatedEffect &&
                        (this.channels[a.modChannels[t]].instruments[
                          a.modInstruments[t]
                        ].effects |=
                          1 << e.modulators[a.modulators[t]].associatedEffect);
                    }
                  }
                }
                const F = [];
                for (let n = 0; n < t.instruments.length; n++) {
                  F[n] = [];
                  for (let i = 0; i < e.modCount; i++)
                    F[n][e.modCount - 1 - i] =
                      1 +
                      3 *
                        +(
                          c &&
                          a &&
                          o &&
                          t.instruments[n].modulators[i] ==
                            e.modulators.dictionary.detune.index
                        );
                }
                const S = n || o ? 0 : 12 * t.octave;
                let I = n || o ? 4 : S;
                const P = o
                    ? [0, 1, 2, 3, 4, 5]
                    : n
                    ? [4, 6, 7, 2, 3, 8, 0, 10]
                    : [0, 7, 12, 19, 24, -5, -12],
                  A = [];
                for (let t = 0; t < P.length; t++) P[t] += S;
                for (let n = 0; n < this.patternsPerChannel; n++) {
                  const r = t.patterns[n];
                  if ((x && i) || (c && a))
                    (r.instruments[0] = tt(
                      0,
                      t.instruments.length - 1,
                      u.read(M)
                    )),
                      (r.instruments.length = 1);
                  else if (this.patternInstruments) {
                    const n = tt(
                      e.instrumentCountMin,
                      k,
                      u.read(w) + e.instrumentCountMin
                    );
                    for (let e = 0; e < n; e++)
                      r.instruments[e] = tt(
                        0,
                        t.instruments.length - 1 + 2 * +o,
                        u.read(M)
                      );
                    r.instruments.length = n;
                  } else
                    (r.instruments[0] = 0),
                      (r.instruments.length = e.instrumentCountMin);
                  if (!((i && s) || 0 != u.read(1))) {
                    r.notes.length = 0;
                    continue;
                  }
                  let y = 0;
                  const b = r.notes;
                  let g = 0;
                  for (; y < this.beatsPerBar * e.partsPerBeat + +o; ) {
                    const n = 1 == u.read(1);
                    let s = !1,
                      v = 0;
                    if (
                      (n
                        ? (v = tt(0, A.length - 1, u.readLongTail(0, 0)))
                        : (s = 1 == u.read(1)),
                      n || s)
                    ) {
                      let s, k, w;
                      if (n) (s = A[v]), A.splice(v, 1);
                      else {
                        if (((s = {}), h))
                          1 == u.read(1)
                            ? (s.pitchCount = u.read(3) + 2)
                            : (s.pitchCount = 1);
                        else
                          for (
                            s.pitchCount = 1;
                            s.pitchCount < 4 && 1 == u.read(1);

                          )
                            s.pitchCount++;
                        (s.pinCount = u.readPinCount()),
                          (s.initialSize = i
                            ? 2 * u.read(2)
                            : o
                            ? u.read(9)
                            : u.read(f)),
                          (s.pins = []),
                          (s.length = 0),
                          (s.bendCount = 0);
                        for (let t = 0; t < s.pinCount; t++) {
                          let t = {};
                          (t.pitchBend = 1 == u.read(1)),
                            t.pitchBend && s.bendCount++,
                            (s.length +=
                              p && i
                                ? (u.readLegacyPartDuration() *
                                    e.partsPerBeat) /
                                  e.rhythms[this.rhythm].stepsPerBeat
                                : u.readPartDuration()),
                            (t.time = s.length),
                            (t.size = i
                              ? 2 * u.read(2)
                              : o
                              ? u.read(9)
                              : u.read(f)),
                            s.pins.push(t);
                        }
                      }
                      A.unshift(s),
                        A.length > 10 && A.pop(),
                        b.length <= g
                          ? ((k = new ot(0, y, y + s.length, s.initialSize)),
                            (b[g++] = k))
                          : ((k = b[g++]),
                            (k.start = y),
                            (k.end = y + s.length),
                            (k.pins[0].size = s.initialSize));
                      let M = 0;
                      const S = [];
                      for (let t = 0; t < s.pitchCount + s.bendCount; t++) {
                        if (1 == u.read(1)) {
                          const t = tt(0, P.length - 1, u.read(d));
                          (w = P[t]), P.splice(t, 1);
                        } else {
                          w = I;
                          let t = u.readPitchInterval();
                          for (; t > 0; ) {
                            for (w++; -1 != P.indexOf(w); ) w++;
                            t--;
                          }
                          for (; t < 0; ) {
                            for (w--; -1 != P.indexOf(w); ) w--;
                            t++;
                          }
                        }
                        P.unshift(w),
                          P.length > m && P.pop(),
                          t < s.pitchCount ? (k.pitches[M++] = w) : S.push(w),
                          (I = t == s.pitchCount - 1 ? k.pitches[0] : w);
                      }
                      (k.pitches.length = M),
                        S.unshift(k.pitches[0]),
                        o &&
                          (k.pins[0].size *= F[r.instruments[0]][k.pitches[0]]);
                      let T = 1;
                      for (const t of s.pins) {
                        t.pitchBend && S.shift();
                        const e = S[0] - k.pitches[0];
                        if (k.pins.length <= T)
                          k.pins[T++] = rt(
                            e,
                            t.time,
                            o
                              ? t.size * F[r.instruments[0]][k.pitches[0]]
                              : t.size
                          );
                        else {
                          const n = k.pins[T++];
                          (n.interval = e),
                            (n.time = t.time),
                            (n.size = o
                              ? t.size * F[r.instruments[0]][k.pitches[0]]
                              : t.size);
                        }
                      }
                      (k.pins.length = T),
                        0 == k.start &&
                          (k.continuesLastPattern =
                            (x && i) || (c && a)
                              ? !l &&
                                !i &&
                                t.instruments[r.instruments[0]].legacyTieOver
                              : 1 == u.read(1)),
                        (y = tt(0, this.beatsPerBar * e.partsPerBeat, k.end));
                    } else if (o) {
                      const t = 1 == u.read(1),
                        e = u.readPartDuration();
                      t ? (y -= e) : (y += e);
                    } else {
                      y +=
                        p && i
                          ? (u.readLegacyPartDuration() * e.partsPerBeat) /
                            e.rhythms[this.rhythm].stepsPerBeat
                          : u.readPartDuration();
                    }
                  }
                  b.length = g;
                }
                if (s && i) break;
                if ((r++, r >= this.getChannelCount())) break;
              }
              if (a && c && v >= 0)
                for (let t = 0; t < this.channels.length; t++)
                  for (
                    let n = 0;
                    n < this.channels[t].instruments.length;
                    n++
                  ) {
                    const i = this.channels[t].instruments[n];
                    if (
                      (F(i.effects) && (i.reverb = e.reverbRange - 1),
                      y == t && g == n)
                    ) {
                      const n = this.channels[t].bars[0];
                      if (n > 0) {
                        const i = this.channels[t].patterns[n - 1];
                        let a = 6;
                        for (const t of i.notes)
                          t.pitches[0] == e.modCount - 1 - v &&
                            (a = Math.min(a, t.start));
                        a > 0 &&
                          i.notes.push(new ot(e.modCount - 1 - v, 0, a, T));
                      } else if (
                        this.channels[t].patterns.length < e.barCountMax
                      ) {
                        const n = new st();
                        if (
                          (this.channels[t].patterns.push(n),
                          (this.channels[t].bars[0] =
                            this.channels[t].patterns.length),
                          this.channels[t].patterns.length >
                            this.patternsPerChannel)
                        ) {
                          for (let t = 0; t < this.channels.length; t++)
                            this.channels[t].patterns.length <=
                              this.patternsPerChannel &&
                              this.channels[t].patterns.push(new st());
                          this.patternsPerChannel++;
                        }
                        (n.instruments.length = 1),
                          (n.instruments[0] = g),
                          (n.notes.length = 0),
                          n.notes.push(new ot(e.modCount - 1 - v, 0, 6, T));
                      }
                    }
                  }
            }
            break;
          default:
            throw new Error(
              "Unrecognized song tag code " +
                String.fromCharCode(A) +
                " at index " +
                (n - 1)
            );
        }
    }
    toJsonObject(t = !0, n = 1, i = !0) {
      const a = [];
      for (let e = 0; e < this.getChannelCount(); e++) {
        const r = this.channels[e],
          o = [],
          s = this.getChannelIsNoise(e),
          l = this.getChannelIsMod(e);
        for (const t of r.instruments) o.push(t.toJsonObject());
        const c = [];
        for (const t of r.patterns) c.push(t.toJsonObject(this, r, l));
        const h = [];
        if (t) for (let t = 0; t < this.loopStart; t++) h.push(r.bars[t]);
        for (let t = 0; t < n; t++)
          for (
            let t = this.loopStart;
            t < this.loopStart + this.loopLength;
            t++
          )
            h.push(r.bars[t]);
        if (i)
          for (let t = this.loopStart + this.loopLength; t < this.barCount; t++)
            h.push(r.bars[t]);
        const p = {
          type: l ? "mod" : s ? "drum" : "pitch",
          name: r.name,
          instruments: o,
          patterns: c,
          sequence: h,
        };
        s || (p.octaveScrollBar = r.octave - 1), a.push(p);
      }
      return {
        name: this.title,
        format: gt.V,
        version: gt.O,
        scale: e.scales[this.scale].name,
        key: e.keys[this.key].name,
        introBars: this.loopStart,
        loopBars: this.loopLength,
        beatsPerBar: this.beatsPerBar,
        ticksPerBeat: e.rhythms[this.rhythm].stepsPerBeat,
        beatsPerMinute: this.tempo,
        reverb: this.reverb,
        masterGain: this.masterGain,
        compressionThreshold: this.compressionThreshold,
        limitThreshold: this.limitThreshold,
        limitDecay: this.limitDecay,
        limitRise: this.limitRise,
        limitRatio: this.limitRatio,
        compressionRatio: this.compressionRatio,
        layeredInstruments: this.layeredInstruments,
        patternInstruments: this.patternInstruments,
        channels: a,
      };
    }
    fromJsonObject(t) {
      if ((this.initToDefault(!0), !t)) return;
      if (
        (null != t.name && (this.title = t.name),
        (this.scale = 0),
        null != t.scale)
      ) {
        const n = {
            "romani :)": "double harmonic :)",
            "romani :(": "double harmonic :(",
            "dbl harmonic :)": "double harmonic :)",
            "dbl harmonic :(": "double harmonic :(",
            enigma: "strange",
          },
          i = null != n[t.scale] ? n[t.scale] : t.scale,
          a = e.scales.findIndex((t) => t.name == i);
        -1 != a && (this.scale = a);
      }
      if (null != t.key)
        if ("number" == typeof t.key)
          this.key = ((t.key + 1200) >>> 0) % e.keys.length;
        else if ("string" == typeof t.key) {
          const e = t.key,
            n = e.charAt(0).toUpperCase(),
            i = e.charAt(1).toLowerCase();
          let a = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[n];
          const r = { "#": 1, "♯": 1, b: -1, "♭": -1 }[i];
          null != a &&
            (null != r && (a += r),
            a < 0 && (a += 12),
            (a %= 12),
            (this.key = a));
        }
      null != t.beatsPerMinute &&
        (this.tempo = Z(e.tempoMin, e.tempoMax + 1, 0 | t.beatsPerMinute));
      let n = 0;
      null != t.reverb && (n = Z(0, 32, 0 | t.reverb)),
        null != t.beatsPerBar &&
          (this.beatsPerBar = Math.max(
            e.beatsPerBarMin,
            Math.min(e.beatsPerBarMax, 0 | t.beatsPerBar)
          ));
      let i = 4;
      null != t.ticksPerBeat &&
        ((i = 0 | t.ticksPerBeat || 4),
        (this.rhythm = e.rhythms.findIndex((t) => t.stepsPerBeat == i)),
        -1 == this.rhythm && (this.rhythm = 1)),
        null != t.masterGain
          ? (this.masterGain = Math.max(0, Math.min(5, t.masterGain || 0)))
          : (this.masterGain = 1),
        null != t.limitThreshold
          ? (this.limitThreshold = Math.max(
              0,
              Math.min(2, t.limitThreshold || 0)
            ))
          : (this.limitThreshold = 1),
        null != t.compressionThreshold
          ? (this.compressionThreshold = Math.max(
              0,
              Math.min(1.1, t.compressionThreshold || 0)
            ))
          : (this.compressionThreshold = 1),
        null != t.limitRise
          ? (this.limitRise = Math.max(2e3, Math.min(1e4, t.limitRise || 0)))
          : (this.limitRise = 4e3),
        null != t.limitDecay
          ? (this.limitDecay = Math.max(1, Math.min(30, t.limitDecay || 0)))
          : (this.limitDecay = 4),
        null != t.limitRatio
          ? (this.limitRatio = Math.max(0, Math.min(11, t.limitRatio || 0)))
          : (this.limitRatio = 1),
        null != t.compressionRatio
          ? (this.compressionRatio = Math.max(
              0,
              Math.min(1.168, t.compressionRatio || 0)
            ))
          : (this.compressionRatio = 1);
      let a = 1,
        r = 1,
        o = 1;
      if (null != t.channels)
        for (const e of t.channels)
          e.instruments && (a = Math.max(a, 0 | e.instruments.length)),
            e.patterns && (r = Math.max(r, 0 | e.patterns.length)),
            e.sequence && (o = Math.max(o, 0 | e.sequence.length));
      null != t.layeredInstruments
        ? (this.layeredInstruments = !!t.layeredInstruments)
        : (this.layeredInstruments = !1),
        null != t.patternInstruments
          ? (this.patternInstruments = !!t.patternInstruments)
          : (this.patternInstruments = a > 1),
        (this.patternsPerChannel = Math.min(r, e.barCountMax)),
        (this.barCount = Math.min(o, e.barCountMax)),
        null != t.introBars &&
          (this.loopStart = Z(0, this.barCount, 0 | t.introBars)),
        null != t.loopBars &&
          (this.loopLength = Z(
            1,
            this.barCount - this.loopStart + 1,
            0 | t.loopBars
          ));
      const s = [],
        l = [],
        c = [];
      if (null != t.channels)
        for (let a = 0; a < t.channels.length; a++) {
          let r = t.channels[a];
          const o = new bt();
          let h = !1,
            p = !1;
          if (
            (null != r.type
              ? ((h = "drum" == r.type), (p = "mod" == r.type))
              : (h = a >= 3),
            h ? l.push(o) : p ? c.push(o) : s.push(o),
            null != r.octaveScrollBar &&
              ((o.octave = Z(0, e.pitchOctaves, 1 + (0 | r.octaveScrollBar))),
              h && (o.octave = 0)),
            null != r.name ? (o.name = r.name) : (o.name = ""),
            Array.isArray(r.instruments))
          ) {
            const t = r.instruments;
            for (
              let e = 0;
              e < t.length && !(e >= this.getMaxInstrumentsPerChannel());
              e++
            ) {
              const i = new yt(h, p);
              (o.instruments[e] = i), i.fromJsonObject(t[e], h, p, !1, !1, n);
            }
          }
          for (let t = 0; t < this.patternsPerChannel; t++) {
            const e = new st();
            let n;
            (o.patterns[t] = e),
              r.patterns && (n = r.patterns[t]),
              null != n && e.fromJsonObject(n, this, o, i, h, p);
          }
          o.patterns.length = this.patternsPerChannel;
          for (let t = 0; t < this.barCount; t++)
            o.bars[t] =
              null != r.sequence
                ? Math.min(this.patternsPerChannel, r.sequence[t] >>> 0)
                : 0;
          o.bars.length = this.barCount;
        }
      s.length > e.pitchChannelCountMax && (s.length = e.pitchChannelCountMax),
        l.length > e.noiseChannelCountMax &&
          (l.length = e.noiseChannelCountMax),
        c.length > e.modChannelCountMax && (c.length = e.modChannelCountMax),
        (this.pitchChannelCount = s.length),
        (this.noiseChannelCount = l.length),
        (this.modChannelCount = c.length),
        (this.channels.length = 0),
        Array.prototype.push.apply(this.channels, s),
        Array.prototype.push.apply(this.channels, l),
        Array.prototype.push.apply(this.channels, c);
    }
    getPattern(t, e) {
      if (e < 0 || e >= this.barCount) return null;
      const n = this.channels[t].bars[e];
      return 0 == n ? null : this.channels[t].patterns[n - 1];
    }
    getBeatsPerMinute() {
      return this.tempo;
    }
    static getNeededBits(t) {
      return 32 - Math.clz32(Math.ceil(t + 1) - 1);
    }
    restoreLimiterDefaults() {
      (this.compressionRatio = 1),
        (this.limitRatio = 1),
        (this.limitRise = 4e3),
        (this.limitDecay = 4),
        (this.limitThreshold = 1),
        (this.compressionThreshold = 1),
        (this.masterGain = 1);
    }
  }
  (gt.V = "JummBox"),
    (gt.L = 2),
    (gt.N = 9),
    (gt.H = 1),
    (gt.O = 6),
    (gt.q = 106);
  class vt {
    constructor() {
      (this.delayLine = null),
        (this.allPassG = 0),
        (this.allPassGDelta = 0),
        (this.sustainFilterA1 = 0),
        (this.sustainFilterA1Delta = 0),
        (this.sustainFilterA2 = 0),
        (this.sustainFilterA2Delta = 0),
        (this.sustainFilterB0 = 0),
        (this.sustainFilterB0Delta = 0),
        (this.sustainFilterB1 = 0),
        (this.sustainFilterB1Delta = 0),
        (this.sustainFilterB2 = 0),
        (this.sustainFilterB2Delta = 0),
        this.reset();
    }
    reset() {
      (this.delayIndex = -1),
        (this.allPassSample = 0),
        (this.allPassPrevInput = 0),
        (this.sustainFilterSample = 0),
        (this.sustainFilterPrevOutput2 = 0),
        (this.sustainFilterPrevInput1 = 0),
        (this.sustainFilterPrevInput2 = 0),
        (this.fractionalDelaySample = 0),
        (this.prevDelayLength = -1),
        (this.delayResetOffset = 0);
    }
    update(t, n, i, a, r, o, s, l) {
      const c =
          (2 * Math.PI * e.pickedStringDispersionCenterFreq) /
          t.samplesPerSecond,
        h = this.prevDelayLength,
        p = i.phaseDeltas[a],
        d = i.phaseDeltaScales[a],
        m = p * Math.pow(d, r),
        u = 2 * Math.PI * p,
        f = 2 * Math.PI * m,
        y = 2 * u,
        b = 2 * f,
        g = Math.min(
          Math.PI,
          u *
            e.pickedStringDispersionFreqMult *
            Math.pow(c / u, e.pickedStringDispersionFreqScale)
        ),
        v = Math.min(
          Math.PI,
          f *
            e.pickedStringDispersionFreqMult *
            Math.pow(c / f, e.pickedStringDispersionFreqScale)
        ),
        k = (2 * Math.PI * e.pickedStringShelfHz) / t.samplesPerSecond,
        w = (Math.pow(100, o) - 1) / 99,
        M = (Math.pow(100, s) - 1) / 99,
        F = 1 == l ? 0.25 : 0,
        S = 15.6,
        x = (3 * t.samplesPerSecond) / 48e3,
        I = Math.pow(0.5, w * Math.pow(k / (u * S), 1 + 2 * F) * S),
        P = Math.pow(0.5, M * Math.pow(k / (f * S), 1 + 2 * F) * S),
        A = Math.pow(I, 0.002),
        T = Math.pow(P, 0.002);
      St.tempFilterStartCoefficients.allPass1stOrderInvertPhaseAbove(g),
        t.tempFrequencyResponse.analyze(St.tempFilterStartCoefficients, y);
      const C = St.tempFilterStartCoefficients.b[0],
        D = -t.tempFrequencyResponse.angle() / y;
      St.tempFilterEndCoefficients.allPass1stOrderInvertPhaseAbove(v),
        t.tempFrequencyResponse.analyze(St.tempFilterEndCoefficients, b);
      const q = St.tempFilterEndCoefficients.b[0],
        E = -t.tempFrequencyResponse.angle() / b,
        O = 0 == l ? 0 : 1;
      if (0 == O) {
        const t = Math.pow(I, e.stringDecayRate),
          n = Math.pow(P, e.stringDecayRate);
        St.tempFilterStartCoefficients.highShelf2ndOrder(k, t, 0.5),
          St.tempFilterEndCoefficients.highShelf2ndOrder(k, n, 0.5);
      } else {
        const e = Math.pow(1 == O ? 0 : 1, 0.25),
          n =
            Math.pow((x * x * u * 3.3 * 48e3) / t.samplesPerSecond, 0.5 + F) /
            x /
            Math.pow(w, 0.5),
          i =
            Math.pow((x * x * f * 3.3 * 48e3) / t.samplesPerSecond, 0.5 + F) /
            x /
            Math.pow(M, 0.5),
          a = n * Math.pow(2, 0.5 - 1.75 * (1 - Math.pow(1 - e, 0.85))),
          r = i * Math.pow(2, 0.5 - 1.75 * (1 - Math.pow(1 - e, 0.85))),
          o = Math.pow(2, -Math.pow(2, -Math.pow(e, 0.9))),
          s = Math.pow(2, -Math.pow(2, -Math.pow(e, 0.9)));
        St.tempFilterStartCoefficients.lowPass2ndOrderButterworth(Y(a), o),
          St.tempFilterEndCoefficients.lowPass2ndOrderButterworth(Y(r), s);
      }
      t.tempFrequencyResponse.analyze(St.tempFilterStartCoefficients, y);
      const R = St.tempFilterStartCoefficients.a[1],
        N = St.tempFilterStartCoefficients.a[2],
        z = St.tempFilterStartCoefficients.b[0] * A,
        L = St.tempFilterStartCoefficients.b[1] * A,
        H = St.tempFilterStartCoefficients.b[2] * A,
        B = -t.tempFrequencyResponse.angle() / y;
      t.tempFrequencyResponse.analyze(St.tempFilterEndCoefficients, b);
      const G = St.tempFilterEndCoefficients.a[1],
        V = St.tempFilterEndCoefficients.a[2],
        $ = St.tempFilterEndCoefficients.b[0] * T,
        W = St.tempFilterEndCoefficients.b[1] * T,
        j = St.tempFilterEndCoefficients.b[2] * T,
        U = -t.tempFrequencyResponse.angle() / b,
        Q = 1 / p,
        _ = 1 / m,
        J = Math.ceil(2 * Math.max(Q, _)),
        K = Q - D - B,
        X = _ - E - U;
      (this.prevDelayLength = K),
        (this.delayLengthDelta = (X - K) / r),
        (this.allPassG = C),
        (this.sustainFilterA1 = R),
        (this.sustainFilterA2 = N),
        (this.sustainFilterB0 = z),
        (this.sustainFilterB1 = L),
        (this.sustainFilterB2 = H),
        (this.allPassGDelta = (q - C) / r),
        (this.sustainFilterA1Delta = (G - R) / r),
        (this.sustainFilterA2Delta = (V - N) / r),
        (this.sustainFilterB0Delta = ($ - z) / r),
        (this.sustainFilterB1Delta = (W - L) / r),
        (this.sustainFilterB2Delta = (j - H) / r);
      const Z = Math.abs(Math.log2(K / h)) > 0.01,
        tt = -1 == this.delayIndex || Z;
      if (null == this.delayLine || this.delayLine.length <= J) {
        const e = Math.ceil(
            (2 * t.samplesPerSecond) / yt.frequencyFromPitch(12)
          ),
          n = new Float32Array(St.fittingPowerOfTwo(Math.max(e, J)));
        if (!tt && null != this.delayLine) {
          const t = (this.delayLine.length - 1) | 0,
            e = this.delayIndex + this.delayResetOffset;
          this.delayIndex = this.delayLine.length - this.delayResetOffset;
          for (let i = 0; i < this.delayLine.length; i++)
            n[i] = this.delayLine[(e + i) & t];
        }
        this.delayLine = n;
      }
      const et = this.delayLine,
        nt = (et.length - 1) | 0;
      if (tt) {
        (this.delayIndex = 0),
          (this.allPassSample = 0),
          (this.allPassPrevInput = 0),
          (this.sustainFilterSample = 0),
          (this.sustainFilterPrevOutput2 = 0),
          (this.sustainFilterPrevInput1 = 0),
          (this.sustainFilterPrevInput2 = 0),
          (this.fractionalDelaySample = 0);
        const e = -K,
          i = Math.floor(e - Q / 2),
          a = Math.ceil(i + 2 * Q);
        this.delayResetOffset = a;
        for (let t = i; t <= a; t++) et[t & nt] = 0;
        const r = n.wave,
          o = r.length - 1,
          s = o / Q,
          l = Math.min(0.2 * Q, 0.003 * t.samplesPerSecond),
          c = Math.ceil(e),
          h = e + Q + l,
          p = h;
        let d = (c - e) * s,
          m = 0;
        for (let t = c; t <= p; t++) {
          const n = 0 | d,
            i = n % o;
          let a = r[i];
          const c = d - n;
          a += (r[i + 1] - a) * c;
          const p = (a - m) / s,
            u = Math.min(1, (t - e) / l) * Math.min(1, (h - t) / l),
            f = u * u * (3 - 2 * u);
          (et[t & nt] += p * f), (m = a), (d += s);
        }
      }
    }
  }
  class kt {
    constructor() {
      (this.noteSecondsStart = 0),
        (this.noteSecondsEnd = 0),
        (this.noteTicksStart = 0),
        (this.noteTicksEnd = 0),
        (this.noteSizeStart = e.noteSizeMax),
        (this.noteSizeEnd = e.noteSizeMax),
        (this.prevNoteSize = e.noteSizeMax),
        (this.nextNoteSize = e.noteSizeMax),
        (this.$ = e.noteSizeMax),
        (this.prevNoteSecondsStart = 0),
        (this.prevNoteSecondsEnd = 0),
        (this.prevNoteTicksStart = 0),
        (this.prevNoteTicksEnd = 0),
        (this.W = e.noteSizeMax),
        (this.prevSlideStart = !1),
        (this.prevSlideEnd = !1),
        (this.nextSlideStart = !1),
        (this.nextSlideEnd = !1),
        (this.prevSlideRatioStart = 0),
        (this.prevSlideRatioEnd = 0),
        (this.nextSlideRatioStart = 0),
        (this.nextSlideRatioEnd = 0),
        (this.envelopeStarts = []),
        (this.envelopeEnds = []),
        (this.j = []),
        (this.U = 0),
        (this.lowpassCutoffDecayVolumeCompensation = 1);
      for (let t = 0; t < 36; t++)
        (this.envelopeStarts[t] = 1), (this.envelopeEnds[t] = 1);
      this.reset();
    }
    reset() {
      (this.noteSecondsEnd = 0),
        (this.noteTicksEnd = 0),
        (this.$ = e.noteSizeMax),
        (this.prevNoteSecondsEnd = 0),
        (this.prevNoteTicksEnd = 0),
        (this.W = e.noteSizeMax),
        (this.U = 0);
    }
    computeEnvelopes(t, n, i, a, r, o, s) {
      r *= s;
      const l = t.getTransition();
      null == o ||
        !o.atNoteStart ||
        l.continues ||
        o.forceContinueAtStart ||
        ((this.prevNoteSecondsEnd = this.noteSecondsEnd),
        (this.prevNoteTicksEnd = this.noteTicksEnd),
        (this.W = this.$),
        (this.noteSecondsEnd = 0),
        (this.noteTicksEnd = 0)),
        null != o &&
          (null != o.note
            ? (this.$ = o.note.pins[o.note.pins.length - 1].size)
            : (this.$ = e.noteSizeMax));
      const c = i + s,
        h = a + 1,
        p = this.noteSecondsEnd,
        d = p + r,
        m = this.noteTicksEnd,
        u = m + 1,
        f = this.prevNoteSecondsEnd,
        y = f + r,
        b = this.prevNoteTicksEnd,
        g = b + 1,
        v = 1 / (e.ticksPerPart * e.partsPerBeat),
        k = v * i,
        w = v * c;
      let M = this.$,
        F = this.$,
        S = this.W,
        x = 0,
        I = !1,
        P = !1,
        A = !1,
        T = !1,
        C = 0,
        D = 0,
        q = 0,
        E = 0;
      if (null != o && null != o.note && !o.passedEndOfNote) {
        const t = o.note.getEndPinIndex(n),
          i = o.note.pins[t - 1],
          r = o.note.pins[t],
          s = (o.note.start + i.time) * e.ticksPerPart,
          c = (o.note.start + r.time) * e.ticksPerPart,
          p = (a - s) / (c - s),
          d = (h - s) / (c - s);
        if (
          ((M = i.size + (r.size - i.size) * p),
          (F = i.size + (r.size - i.size) * d),
          l.slides)
        ) {
          const t = o.noteStartPart * e.ticksPerPart,
            n = o.noteEndPart * e.ticksPerPart,
            i = 0.5 * (n - t),
            r = Math.min(i, l.slideTicks);
          null == o.prevNote ||
            o.forceContinueAtStart ||
            (a - t < r && ((I = !0), (C = 0.5 * (1 - (a - t) / r))),
            h - t < r && ((P = !0), (D = 0.5 * (1 - (h - t) / r)))),
            null == o.nextNote ||
              o.forceContinueAtEnd ||
              ((x = o.nextNote.pins[0].size),
              n - a < r && ((A = !0), (q = 0.5 * (1 - (n - a) / r))),
              n - h < r && ((T = !0), (E = 0.5 * (1 - (n - h) / r))));
        }
      }
      let O = 1,
        R = !1;
      for (let n = 0; n <= t.envelopeCount; n++) {
        let i, a, r;
        if (n == t.envelopeCount) {
          if (R) break;
          (i = e.instrumentAutomationTargets.dictionary.noteVolume),
            (a = 0),
            (r = e.envelopes.dictionary["note size"]);
        } else {
          let o = t.envelopes[n];
          (i = e.instrumentAutomationTargets[o.target]),
            (a = o.index),
            (r = e.envelopes[o.envelope]),
            0 == r.type && (R = !0);
        }
        if (null != i.computeIndex) {
          const e = i.computeIndex + a;
          let n = kt.computeEnvelope(r, p, k, M);
          if (I) {
            n += (kt.computeEnvelope(r, f, k, S) - n) * C;
          }
          if (A) {
            n += (kt.computeEnvelope(r, 0, k, x) - n) * q;
          }
          let o = n;
          if (0 == t.discreteEnvelope) {
            if (((o = kt.computeEnvelope(r, d, w, F)), P)) {
              o += (kt.computeEnvelope(r, y, w, S) - o) * D;
            }
            if (T) {
              o += (kt.computeEnvelope(r, 0, w, x) - o) * E;
            }
          }
          if (
            ((this.envelopeStarts[e] *= n),
            (this.envelopeEnds[e] *= o),
            (this.j[this.U++] = e),
            i.isFilter)
          ) {
            const e =
              null != t.tmpNoteFilterStart
                ? t.tmpNoteFilterStart
                : t.noteFilter;
            e.controlPointCount > a &&
              0 == e.controlPoints[a].type &&
              (O = Math.max(O, kt.getLowpassCutoffDecayVolumeCompensation(r)));
          }
        }
      }
      (this.noteSecondsStart = p),
        (this.noteSecondsEnd = d),
        (this.noteTicksStart = m),
        (this.noteTicksEnd = u),
        (this.prevNoteSecondsStart = f),
        (this.prevNoteSecondsEnd = y),
        (this.prevNoteTicksStart = b),
        (this.prevNoteTicksEnd = g),
        (this.prevNoteSize = S),
        (this.nextNoteSize = x),
        (this.noteSizeStart = M),
        (this.noteSizeEnd = F),
        (this.prevSlideStart = I),
        (this.prevSlideEnd = P),
        (this.nextSlideStart = A),
        (this.nextSlideEnd = T),
        (this.prevSlideRatioStart = C),
        (this.prevSlideRatioEnd = D),
        (this.nextSlideRatioStart = q),
        (this.nextSlideRatioEnd = E),
        (this.lowpassCutoffDecayVolumeCompensation = O);
    }
    clearEnvelopes() {
      for (let t = 0; t < this.U; t++) {
        const e = this.j[t];
        (this.envelopeStarts[e] = 1), (this.envelopeEnds[e] = 1);
      }
      this.U = 0;
    }
    static computeEnvelope(t, e, n, i) {
      switch (t.type) {
        case 0:
          return St.noteSizeToVolumeMult(i);
        case 1:
          return 1;
        case 4:
          return 1 / (1 + e * t.speed);
        case 5:
          return 1 - 1 / (1 + e * t.speed);
        case 6:
          return 0.5 - 0.5 * Math.cos(2 * n * Math.PI * t.speed);
        case 7:
          return 0.75 - 0.25 * Math.cos(2 * n * Math.PI * t.speed);
        case 2:
          return Math.max(1, 2 - 10 * e);
        case 3:
          const a = 0.25 / Math.sqrt(t.speed);
          return e < a ? e / a : 1 / (1 + (e - a) * t.speed);
        case 8:
          return Math.pow(2, -t.speed * e);
        case 9:
          return 1 * +(e < 0.25 / Math.sqrt(t.speed));
        case 10:
          return t.speed;
        case 11:
          return Math.random();
        default:
          throw new Error("Unrecognized operator envelope type.");
      }
    }
    static getLowpassCutoffDecayVolumeCompensation(t) {
      return 8 == t.type
        ? 1.25 + 0.025 * t.speed
        : 4 == t.type
        ? 1 + 0.02 * t.speed
        : 1;
    }
  }
  class wt {
    constructor() {
      (this.pitches = Array(e.maxChordSize).fill(0)),
        (this.pitchCount = 0),
        (this.chordSize = 0),
        (this.drumsetPitch = null),
        (this.note = null),
        (this.prevNote = null),
        (this.nextNote = null),
        (this.prevNotePitchIndex = 0),
        (this.nextNotePitchIndex = 0),
        (this.freshlyAllocated = !0),
        (this.atNoteStart = !1),
        (this.isOnLastTick = !1),
        (this.passedEndOfNote = !1),
        (this.forceContinueAtStart = !1),
        (this.forceContinueAtEnd = !1),
        (this.noteStartPart = 0),
        (this.noteEndPart = 0),
        (this.ticksSinceReleased = 0),
        (this.liveInputSamplesHeld = 0),
        (this.lastInterval = 0),
        (this.noiseSample = 0),
        (this.stringSustainStart = 0),
        (this.stringSustainEnd = 0),
        (this.phases = []),
        (this.operatorWaves = []),
        (this.phaseDeltas = []),
        (this.phaseDeltaScales = []),
        (this.expression = 0),
        (this.expressionDelta = 0),
        (this.operatorExpressions = []),
        (this.operatorExpressionDeltas = []),
        (this.prevPitchExpressions = Array(e.maxPitchOrOperatorCount).fill(
          null
        )),
        (this.prevVibrato = null),
        (this.prevStringDecay = null),
        (this.pulseWidth = 0),
        (this.pulseWidthDelta = 0),
        (this.supersawDynamism = 0),
        (this.supersawDynamismDelta = 0),
        (this.supersawUnisonDetunes = []),
        (this.supersawShape = 0),
        (this.supersawShapeDelta = 0),
        (this.supersawDelayLength = 0),
        (this.supersawDelayLengthDelta = 0),
        (this.supersawDelayLine = null),
        (this.supersawDelayIndex = -1),
        (this.supersawPrevPhaseDelta = null),
        (this.pickedStrings = []),
        (this.noteFilters = []),
        (this.noteFilterCount = 0),
        (this.initialNoteFilterInput1 = 0),
        (this.initialNoteFilterInput2 = 0),
        (this.specialIntervalExpressionMult = 1),
        (this.feedbackOutputs = []),
        (this.feedbackMult = 0),
        (this.feedbackDelta = 0),
        (this.stereoVolumeLStart = 0),
        (this.stereoVolumeRStart = 0),
        (this.stereoVolumeLDelta = 0),
        (this.stereoVolumeRDelta = 0),
        (this.stereoDelayStart = 0),
        (this.stereoDelayEnd = 0),
        (this.stereoDelayDelta = 0),
        (this.customVolumeStart = 0),
        (this.customVolumeEnd = 0),
        (this.filterResonanceStart = 0),
        (this.filterResonanceDelta = 0),
        (this.isFirstOrder = !1),
        (this.envelopeComputer = new kt()),
        this.reset();
    }
    reset() {
      this.noiseSample = 0;
      for (let t = 0; t < e.maxPitchOrOperatorCount; t++)
        (this.phases[t] = 0),
          (this.operatorWaves[t] = e.operatorWaves[0]),
          (this.feedbackOutputs[t] = 0),
          (this.prevPitchExpressions[t] = null);
      for (let t = 0; t < this.noteFilterCount; t++)
        this.noteFilters[t].resetOutput();
      (this.noteFilterCount = 0),
        (this.initialNoteFilterInput1 = 0),
        (this.initialNoteFilterInput2 = 0),
        (this.liveInputSamplesHeld = 0),
        (this.supersawDelayIndex = -1);
      for (const t of this.pickedStrings) t.reset();
      this.envelopeComputer.reset(),
        (this.prevVibrato = null),
        (this.prevStringDecay = null),
        (this.supersawPrevPhaseDelta = null),
        (this.drumsetPitch = null);
    }
  }
  class Mt {
    constructor() {
      (this.awake = !1),
        (this.computed = !1),
        (this.tonesAddedInThisTick = !1),
        (this.flushingDelayLines = !1),
        (this.deactivateAfterThisTick = !1),
        (this.attentuationProgress = 0),
        (this.flushedSamples = 0),
        (this.activeTones = new Q()),
        (this.activeModTones = new Q()),
        (this.releasedTones = new Q()),
        (this.liveInputTones = new Q()),
        (this.type = 0),
        (this.synthesizer = null),
        (this.wave = null),
        (this.noisePitchFilterMult = 1),
        (this.unison = null),
        (this.chord = null),
        (this.effects = 0),
        (this.volumeScale = 0),
        (this.aliases = !1),
        (this.arpTime = 0),
        (this.vibratoTime = 0),
        (this.nextVibratoTime = 0),
        (this.envelopeTime = 0),
        (this.eqFilterVolume = 1),
        (this.eqFilterVolumeDelta = 0),
        (this.mixVolume = 1),
        (this.mixVolumeDelta = 0),
        (this.delayInputMult = 0),
        (this.delayInputMultDelta = 0),
        (this.distortion = 0),
        (this.distortionDelta = 0),
        (this.distortionDrive = 0),
        (this.distortionDriveDelta = 0),
        (this.distortionFractionalInput1 = 0),
        (this.distortionFractionalInput2 = 0),
        (this.distortionFractionalInput3 = 0),
        (this.distortionPrevInput = 0),
        (this.distortionNextOutput = 0),
        (this.bitcrusherPrevInput = 0),
        (this.bitcrusherCurrentOutput = 0),
        (this.bitcrusherPhase = 1),
        (this.bitcrusherPhaseDelta = 0),
        (this.bitcrusherPhaseDeltaScale = 1),
        (this.bitcrusherScale = 1),
        (this.bitcrusherScaleScale = 1),
        (this.bitcrusherFoldLevel = 1),
        (this.bitcrusherFoldLevelScale = 1),
        (this.eqFilters = []),
        (this.eqFilterCount = 0),
        (this.initialEqFilterInput1 = 0),
        (this.initialEqFilterInput2 = 0),
        (this.panningDelayLine = null),
        (this.panningDelayPos = 0),
        (this.panningVolumeL = 0),
        (this.panningVolumeR = 0),
        (this.panningVolumeDeltaL = 0),
        (this.panningVolumeDeltaR = 0),
        (this.panningOffsetL = 0),
        (this.panningOffsetR = 0),
        (this.panningOffsetDeltaL = 0),
        (this.panningOffsetDeltaR = 0),
        (this.chorusDelayLineL = null),
        (this.chorusDelayLineR = null),
        (this.chorusDelayLineDirty = !1),
        (this.chorusDelayPos = 0),
        (this.chorusPhase = 0),
        (this.chorusVoiceMult = 0),
        (this.chorusVoiceMultDelta = 0),
        (this.chorusCombinedMult = 0),
        (this.chorusCombinedMultDelta = 0),
        (this.echoDelayLineL = null),
        (this.echoDelayLineR = null),
        (this.echoDelayLineDirty = !1),
        (this.echoDelayPos = 0),
        (this.echoDelayOffsetStart = 0),
        (this.echoDelayOffsetEnd = null),
        (this.echoDelayOffsetRatio = 0),
        (this.echoDelayOffsetRatioDelta = 0),
        (this.echoMult = 0),
        (this.echoMultDelta = 0),
        (this.echoShelfA1 = 0),
        (this.echoShelfB0 = 0),
        (this.echoShelfB1 = 0),
        (this.echoShelfSampleL = 0),
        (this.echoShelfSampleR = 0),
        (this.echoShelfPrevInputL = 0),
        (this.echoShelfPrevInputR = 0),
        (this.reverbDelayLine = null),
        (this.reverbDelayLineDirty = !1),
        (this.reverbDelayPos = 0),
        (this.reverbMult = 0),
        (this.reverbMultDelta = 0),
        (this.reverbShelfA1 = 0),
        (this.reverbShelfB0 = 0),
        (this.reverbShelfB1 = 0),
        (this.reverbShelfSample0 = 0),
        (this.reverbShelfSample1 = 0),
        (this.reverbShelfSample2 = 0),
        (this.reverbShelfSample3 = 0),
        (this.reverbShelfPrevInput0 = 0),
        (this.reverbShelfPrevInput1 = 0),
        (this.reverbShelfPrevInput2 = 0),
        (this.reverbShelfPrevInput3 = 0),
        (this.spectrumWave = new ht()),
        (this.harmonicsWave = new dt()),
        (this.drumsetSpectrumWaves = []);
      for (let t = 0; t < e.drumCount; t++)
        this.drumsetSpectrumWaves[t] = new ht();
    }
    allocateNecessaryBuffers(t, n, i) {
      if (
        (k(n.effects) &&
          (null == this.panningDelayLine ||
            this.panningDelayLine.length < t.panningDelayBufferSize) &&
          (this.panningDelayLine = new Float32Array(t.panningDelayBufferSize)),
        w(n.effects) &&
          ((null == this.chorusDelayLineL ||
            this.chorusDelayLineL.length < t.chorusDelayBufferSize) &&
            (this.chorusDelayLineL = new Float32Array(t.chorusDelayBufferSize)),
          (null == this.chorusDelayLineR ||
            this.chorusDelayLineR.length < t.chorusDelayBufferSize) &&
            (this.chorusDelayLineR = new Float32Array(
              t.chorusDelayBufferSize
            ))),
        M(n.effects))
      ) {
        const t = Math.max(e.echoDelayRange >> 1, n.echoDelay + 1),
          a = 2 * St.fittingPowerOfTwo(t * e.echoDelayStepTicks * i);
        if (null == this.echoDelayLineL || null == this.echoDelayLineR)
          (this.echoDelayLineL = new Float32Array(a)),
            (this.echoDelayLineR = new Float32Array(a));
        else if (
          this.echoDelayLineL.length < a ||
          this.echoDelayLineR.length < a
        ) {
          const t = new Float32Array(a),
            e = new Float32Array(a),
            n = this.echoDelayLineL.length - 1;
          for (let i = 0; i < this.echoDelayLineL.length; i++)
            (t[i] = this.echoDelayLineL[(this.echoDelayPos + i) & n]),
              (e[i] = this.echoDelayLineL[(this.echoDelayPos + i) & n]);
          (this.echoDelayPos = this.echoDelayLineL.length),
            (this.echoDelayLineL = t),
            (this.echoDelayLineR = e);
        }
      }
      F(n.effects) &&
        null == this.reverbDelayLine &&
        (this.reverbDelayLine = new Float32Array(e.reverbDelayBufferSize));
    }
    deactivate() {
      (this.bitcrusherPrevInput = 0),
        (this.bitcrusherCurrentOutput = 0),
        (this.bitcrusherPhase = 1);
      for (let t = 0; t < this.eqFilterCount; t++)
        this.eqFilters[t].resetOutput();
      if (
        ((this.eqFilterCount = 0),
        (this.initialEqFilterInput1 = 0),
        (this.initialEqFilterInput2 = 0),
        (this.distortionFractionalInput1 = 0),
        (this.distortionFractionalInput2 = 0),
        (this.distortionFractionalInput3 = 0),
        (this.distortionPrevInput = 0),
        (this.distortionNextOutput = 0),
        (this.panningDelayPos = 0),
        null != this.panningDelayLine)
      )
        for (let t = 0; t < this.panningDelayLine.length; t++)
          this.panningDelayLine[t] = 0;
      (this.echoDelayOffsetEnd = null),
        (this.echoShelfSampleL = 0),
        (this.echoShelfSampleR = 0),
        (this.echoShelfPrevInputL = 0),
        (this.echoShelfPrevInputR = 0),
        (this.reverbShelfSample0 = 0),
        (this.reverbShelfSample1 = 0),
        (this.reverbShelfSample2 = 0),
        (this.reverbShelfSample3 = 0),
        (this.reverbShelfPrevInput0 = 0),
        (this.reverbShelfPrevInput1 = 0),
        (this.reverbShelfPrevInput2 = 0),
        (this.reverbShelfPrevInput3 = 0),
        (this.volumeScale = 1),
        (this.aliases = !1),
        (this.awake = !1),
        (this.flushingDelayLines = !1),
        (this.deactivateAfterThisTick = !1),
        (this.attentuationProgress = 0),
        (this.flushedSamples = 0);
    }
    resetAllEffects() {
      if (
        (this.deactivate(),
        (this.vibratoTime = 0),
        (this.nextVibratoTime = 0),
        (this.arpTime = 0),
        (this.envelopeTime = 0),
        this.chorusDelayLineDirty)
      ) {
        for (let t = 0; t < this.chorusDelayLineL.length; t++)
          this.chorusDelayLineL[t] = 0;
        for (let t = 0; t < this.chorusDelayLineR.length; t++)
          this.chorusDelayLineR[t] = 0;
      }
      if (this.echoDelayLineDirty) {
        for (let t = 0; t < this.echoDelayLineL.length; t++)
          this.echoDelayLineL[t] = 0;
        for (let t = 0; t < this.echoDelayLineR.length; t++)
          this.echoDelayLineR[t] = 0;
      }
      if (this.reverbDelayLineDirty)
        for (let t = 0; t < this.reverbDelayLine.length; t++)
          this.reverbDelayLine[t] = 0;
      this.chorusPhase = 0;
    }
    compute(t, n, i, a, r, o, s) {
      (this.computed = !0),
        (this.type = n.type),
        (this.synthesizer = St.getInstrumentSynthFunction(n)),
        (this.unison = e.unisons[n.unison]),
        (this.chord = n.getChord()),
        (this.noisePitchFilterMult = e.chipNoises[n.chipNoise].pitchFilterMult),
        (this.effects = n.effects),
        (this.aliases = n.aliases),
        (this.volumeScale = 1),
        this.allocateNecessaryBuffers(t, n, i);
      const l = t.samplesPerSecond;
      this.updateWaves(n, l);
      const c = g(this.effects),
        h = v(this.effects),
        p = k(this.effects),
        d = w(this.effects),
        m = M(this.effects),
        u = F(this.effects);
      if (c) {
        let i = n.distortion,
          r = n.distortion;
        t.isModActive(e.modulators.dictionary.distortion.index, o, s) &&
          ((i = t.getModValue(
            e.modulators.dictionary.distortion.index,
            o,
            s,
            !1
          )),
          (r = t.getModValue(
            e.modulators.dictionary.distortion.index,
            o,
            s,
            !0
          )));
        const l = Math.min(1, i / (e.distortionRange - 1)),
          c = Math.min(1, r / (e.distortionRange - 1)),
          h = Math.pow(1 - (0.895 * (Math.pow(20, l) - 1)) / 19, 2),
          p = Math.pow(1 - (0.895 * (Math.pow(20, c) - 1)) / 19, 2),
          d = (1 + 2 * l) / e.distortionBaseVolume,
          m = (1 + 2 * c) / e.distortionBaseVolume;
        (this.distortion = h),
          (this.distortionDelta = (p - h) / a),
          (this.distortionDrive = d),
          (this.distortionDriveDelta = (m - d) / a);
      }
      if (h) {
        let i = n.bitcrusherFreq,
          r = n.bitcrusherFreq;
        t.isModActive(e.modulators.dictionary["freq crush"].index, o, s) &&
          ((i = t.getModValue(
            e.modulators.dictionary["freq crush"].index,
            o,
            s,
            !1
          )),
          (r = t.getModValue(
            e.modulators.dictionary["freq crush"].index,
            o,
            s,
            !0
          )));
        let c = n.bitcrusherQuantization,
          h = n.bitcrusherQuantization;
        t.isModActive(e.modulators.dictionary["bit crush"].index, o, s) &&
          ((c = t.getModValue(
            e.modulators.dictionary["bit crush"].index,
            o,
            s,
            !1
          )),
          (h = t.getModValue(
            e.modulators.dictionary["bit crush"].index,
            o,
            s,
            !0
          )));
        const p = e.keys[t.song.key].basePitch,
          d =
            yt.frequencyFromPitch(p + 60) *
            Math.pow(
              2,
              (e.bitcrusherFreqRange - 1 - i) * e.bitcrusherOctaveStep
            ),
          m =
            yt.frequencyFromPitch(p + 60) *
            Math.pow(
              2,
              (e.bitcrusherFreqRange - 1 - r) * e.bitcrusherOctaveStep
            ),
          u = Math.min(1, d / l),
          f = Math.min(1, m / l);
        (this.bitcrusherPhaseDelta = u),
          (this.bitcrusherPhaseDeltaScale = Math.pow(f / u, 1 / a));
        const y =
            2 *
            e.bitcrusherBaseVolume *
            Math.pow(
              2,
              1 - Math.pow(2, 0.5 * (e.bitcrusherQuantizationRange - 1 - c))
            ),
          b =
            2 *
            e.bitcrusherBaseVolume *
            Math.pow(
              2,
              1 - Math.pow(2, 0.5 * (e.bitcrusherQuantizationRange - 1 - h))
            );
        (this.bitcrusherScale = y),
          (this.bitcrusherScaleScale = Math.pow(b / y, 1 / a));
        const g =
            2 *
            e.bitcrusherBaseVolume *
            Math.pow(1.5, e.bitcrusherQuantizationRange - 1 - c),
          v =
            2 *
            e.bitcrusherBaseVolume *
            Math.pow(1.5, e.bitcrusherQuantizationRange - 1 - h);
        (this.bitcrusherFoldLevel = g),
          (this.bitcrusherFoldLevelScale = Math.pow(v / g, 1 / a));
      }
      let f = 1;
      if (n.eqFilterType) {
        const i = n.eqFilter;
        null == n.eqSubFilters[1] && (n.eqSubFilters[1] = new ut());
        const r = n.eqSubFilters[1];
        let c,
          h = n.eqFilterSimpleCut,
          p = n.eqFilterSimplePeak,
          d = n.eqFilterSimpleCut,
          m = n.eqFilterSimplePeak,
          u = !1;
        if (
          (t.isModActive(e.modulators.dictionary["eq filt cut"].index, o, s) &&
            ((h = t.getModValue(
              e.modulators.dictionary["eq filt cut"].index,
              o,
              s,
              !1
            )),
            (d = t.getModValue(
              e.modulators.dictionary["eq filt cut"].index,
              o,
              s,
              !0
            )),
            (u = !0)),
          t.isModActive(e.modulators.dictionary["eq filt peak"].index, o, s) &&
            ((p = t.getModValue(
              e.modulators.dictionary["eq filt peak"].index,
              o,
              s,
              !1
            )),
            (m = t.getModValue(
              e.modulators.dictionary["eq filt peak"].index,
              o,
              s,
              !0
            )),
            (u = !0)),
          u)
        ) {
          i.convertLegacySettingsForSynth(h, p),
            r.convertLegacySettingsForSynth(d, m),
            (c = i.controlPoints[0]);
          let t = r.controlPoints[0];
          c.toCoefficients(St.tempFilterStartCoefficients, l, 1, 1),
            t.toCoefficients(St.tempFilterEndCoefficients, l, 1, 1),
            this.eqFilters.length < 1 && (this.eqFilters[0] = new K()),
            this.eqFilters[0].loadCoefficientsWithGradient(
              St.tempFilterStartCoefficients,
              St.tempFilterEndCoefficients,
              1 / a,
              0 == c.type
            );
        } else
          i.convertLegacySettingsForSynth(h, p, !0),
            (c = i.controlPoints[0]),
            c.toCoefficients(St.tempFilterStartCoefficients, l, 1, 1),
            this.eqFilters.length < 1 && (this.eqFilters[0] = new K()),
            this.eqFilters[0].loadCoefficientsWithGradient(
              St.tempFilterStartCoefficients,
              St.tempFilterStartCoefficients,
              1 / a,
              0 == c.type
            );
        (f *= c.getVolumeCompensationMult()),
          (this.eqFilterCount = 1),
          (f = Math.min(3, f));
      } else {
        const t = null != n.tmpEqFilterStart ? n.tmpEqFilterStart : n.eqFilter;
        for (let e = 0; e < t.controlPointCount; e++) {
          let i = t.controlPoints[e],
            r =
              null != n.tmpEqFilterEnd &&
              null != n.tmpEqFilterEnd.controlPoints[e]
                ? n.tmpEqFilterEnd.controlPoints[e]
                : t.controlPoints[e];
          i.type != r.type && (i = r),
            i.toCoefficients(St.tempFilterStartCoefficients, l, 1, 1),
            r.toCoefficients(St.tempFilterEndCoefficients, l, 1, 1),
            this.eqFilters.length <= e && (this.eqFilters[e] = new K()),
            this.eqFilters[e].loadCoefficientsWithGradient(
              St.tempFilterStartCoefficients,
              St.tempFilterEndCoefficients,
              1 / a,
              0 == i.type
            ),
            (f *= i.getVolumeCompensationMult());
        }
        (this.eqFilterCount = t.controlPointCount), (f = Math.min(3, f));
      }
      const y = St.instrumentVolumeToVolumeMult(n.volume);
      this.mixVolume = y;
      let b = y;
      if (t.isModActive(e.modulators.dictionary["mix volume"].index, o, s)) {
        const n = t.getModValue(
            e.modulators.dictionary["mix volume"].index,
            o,
            s,
            !1
          ),
          i = t.getModValue(
            e.modulators.dictionary["mix volume"].index,
            o,
            s,
            !0
          );
        (this.mixVolume *=
          n <= 0
            ? (n + e.volumeRange / 2) / (e.volumeRange / 2)
            : St.instrumentVolumeToVolumeMult(n)),
          (b *=
            i <= 0
              ? (i + e.volumeRange / 2) / (e.volumeRange / 2)
              : St.instrumentVolumeToVolumeMult(i));
      }
      t.isModActive(e.modulators.dictionary["song volume"].index) &&
        ((this.mixVolume *=
          t.getModValue(
            e.modulators.dictionary["song volume"].index,
            void 0,
            void 0,
            !1
          ) / 100),
        (b *=
          t.getModValue(
            e.modulators.dictionary["song volume"].index,
            void 0,
            void 0,
            !0
          ) / 100)),
        (this.mixVolumeDelta = (b - this.mixVolume) / a);
      let S = f,
        x = f,
        I = 1,
        P = 1;
      if (p) {
        let i = n.pan,
          r = n.pan;
        t.isModActive(e.modulators.dictionary.pan.index, o, s) &&
          ((i = t.getModValue(e.modulators.dictionary.pan.index, o, s, !1)),
          (r = t.getModValue(e.modulators.dictionary.pan.index, o, s, !0)));
        let c = Math.max(-1, Math.min(1, (i - e.panCenter) / e.panCenter)),
          h = Math.max(-1, Math.min(1, (r - e.panCenter) / e.panCenter));
        const p = 1.414 * Math.cos((1 + c) * Math.PI * 0.25),
          d = 1.414 * Math.cos((1 - c) * Math.PI * 0.25),
          m = 1.414 * Math.cos((1 + h) * Math.PI * 0.25),
          u = 1.414 * Math.cos((1 - h) * Math.PI * 0.25),
          f = l * e.panDelaySecondsMax;
        let y = n.panDelay,
          b = n.panDelay;
        t.isModActive(e.modulators.dictionary["pan delay"].index, o, s) &&
          ((y = t.getModValue(
            e.modulators.dictionary["pan delay"].index,
            o,
            s,
            !1
          )),
          (b = t.getModValue(
            e.modulators.dictionary["pan delay"].index,
            o,
            s,
            !0
          )));
        const g = (c * y * f) / 10,
          v = (h * b * f) / 10,
          k = Math.max(0, g),
          w = Math.max(0, -g),
          M = Math.max(0, v),
          F = Math.max(0, -v);
        (this.panningVolumeL = p),
          (this.panningVolumeR = d),
          (this.panningVolumeDeltaL = (m - p) / a),
          (this.panningVolumeDeltaR = (u - d) / a),
          (this.panningOffsetL =
            this.panningDelayPos - k + t.panningDelayBufferSize),
          (this.panningOffsetR =
            this.panningDelayPos - w + t.panningDelayBufferSize),
          (this.panningOffsetDeltaL = (M - k) / a),
          (this.panningOffsetDeltaR = (F - w) / a);
      }
      if (d) {
        let i = n.chorus,
          r = n.chorus;
        t.isModActive(e.modulators.dictionary.chorus.index, o, s) &&
          ((i = t.getModValue(e.modulators.dictionary.chorus.index, o, s, !1)),
          (r = t.getModValue(e.modulators.dictionary.chorus.index, o, s, !0)));
        let l = Math.min(1, i / (e.chorusRange - 1)),
          c = Math.min(1, r / (e.chorusRange - 1));
        (l = 0.6 * l + 0.4 * Math.pow(l, 6)),
          (c = 0.6 * c + 0.4 * Math.pow(c, 6));
        const h = 1 / Math.sqrt(3 * l * l + 1),
          p = 1 / Math.sqrt(3 * c * c + 1);
        (this.chorusVoiceMult = l),
          (this.chorusVoiceMultDelta = (c - l) / a),
          (this.chorusCombinedMult = h),
          (this.chorusCombinedMultDelta = (p - h) / a);
      }
      let A = 0,
        T = 0;
      if (m) {
        let r = n.echoSustain,
          c = n.echoSustain;
        t.isModActive(e.modulators.dictionary.echo.index, o, s) &&
          ((r = Math.max(
            0,
            t.getModValue(e.modulators.dictionary.echo.index, o, s, !1)
          )),
          (c = Math.max(
            0,
            t.getModValue(e.modulators.dictionary.echo.index, o, s, !0)
          )));
        const h = 0.9 * Math.min(1, Math.pow(r / e.echoSustainRange, 1.1)),
          p = 0.9 * Math.min(1, Math.pow(c / e.echoSustainRange, 1.1));
        (this.echoMult = h),
          (this.echoMultDelta = Math.max(0, (p - h) / a)),
          (A = Math.max(h, p));
        let d = n.echoDelay,
          m = n.echoDelay,
          u = !1;
        t.isModActive(e.modulators.dictionary["echo delay"].index, o, s) &&
          ((d = t.getModValue(
            e.modulators.dictionary["echo delay"].index,
            o,
            s,
            !1
          )),
          (m = t.getModValue(
            e.modulators.dictionary["echo delay"].index,
            o,
            s,
            !0
          )),
          (u = !0));
        const f = Math.round((d + 1) * e.echoDelayStepTicks * i),
          y = Math.round((m + 1) * e.echoDelayStepTicks * i);
        null == this.echoDelayOffsetEnd || u
          ? (this.echoDelayOffsetStart = f)
          : (this.echoDelayOffsetStart = this.echoDelayOffsetEnd),
          (this.echoDelayOffsetEnd = y),
          (T =
            (0.5 * (this.echoDelayOffsetStart + this.echoDelayOffsetEnd)) / l),
          (this.echoDelayOffsetRatio = 0),
          (this.echoDelayOffsetRatioDelta = 1 / a);
        const b = (2 * Math.PI * e.echoShelfHz) / t.samplesPerSecond;
        St.tempFilterStartCoefficients.highShelf1stOrder(b, e.echoShelfGain),
          (this.echoShelfA1 = St.tempFilterStartCoefficients.a[1]),
          (this.echoShelfB0 = St.tempFilterStartCoefficients.b[0]),
          (this.echoShelfB1 = St.tempFilterStartCoefficients.b[1]);
      }
      let C = 0;
      if (u) {
        let i = n.reverb,
          r = n.reverb;
        t.isModActive(e.modulators.dictionary.reverb.index, o, s) &&
          ((i = t.getModValue(e.modulators.dictionary.reverb.index, o, s, !1)),
          (r = t.getModValue(e.modulators.dictionary.reverb.index, o, s, !0))),
          t.isModActive(e.modulators.dictionary["song reverb"].index, o, s) &&
            ((i *=
              (t.getModValue(
                e.modulators.dictionary["song reverb"].index,
                void 0,
                void 0,
                !1
              ) -
                e.modulators.dictionary["song reverb"].convertRealFactor) /
              e.reverbRange),
            (r *=
              (t.getModValue(
                e.modulators.dictionary["song reverb"].index,
                void 0,
                void 0,
                !0
              ) -
                e.modulators.dictionary["song reverb"].convertRealFactor) /
              e.reverbRange));
        const l = 0.425 * Math.min(1, Math.pow(i / e.reverbRange, 0.667)),
          c = 0.425 * Math.min(1, Math.pow(r / e.reverbRange, 0.667));
        (this.reverbMult = l),
          (this.reverbMultDelta = (c - l) / a),
          (C = Math.max(l, c));
        const h = (2 * Math.PI * e.reverbShelfHz) / t.samplesPerSecond;
        St.tempFilterStartCoefficients.highShelf1stOrder(h, e.reverbShelfGain),
          (this.reverbShelfA1 = St.tempFilterStartCoefficients.a[1]),
          (this.reverbShelfB0 = St.tempFilterStartCoefficients.b[0]),
          (this.reverbShelfB1 = St.tempFilterStartCoefficients.b[1]);
      }
      if (this.tonesAddedInThisTick)
        (this.attentuationProgress = 0),
          (this.flushedSamples = 0),
          (this.flushingDelayLines = !1);
      else if (this.flushingDelayLines) {
        (S = 0), (x = 0), (I = 0), (P = 0);
        let n = 0;
        d && (n += t.chorusDelayBufferSize),
          m && (n += this.echoDelayLineL.length),
          u && (n += e.reverbDelayBufferSize),
          (this.flushedSamples += a),
          this.flushedSamples >= n && (this.deactivateAfterThisTick = !0);
      } else {
        0 == this.attentuationProgress || (S = 0), (x = 0);
        const t = 1 / 256,
          n = -Math.log2(t);
        let a = 0;
        if ((d && (a += e.chorusMaxDelay), m)) {
          const t = Math.pow(A, 1 / T);
          a += (-1 / Math.log2(t)) * n;
        }
        if (u) {
          const t = 2 * C,
            i = e.reverbDelayBufferSize / 4 / l,
            r = Math.pow(t, 1 / i);
          a += (-1 / Math.log2(r)) * n;
        }
        const r = i / l / a,
          o = this.attentuationProgress + r;
        o >= 1 && (P = 0),
          (this.attentuationProgress = o),
          this.attentuationProgress >= 1 && (this.flushingDelayLines = !0);
      }
      (this.eqFilterVolume = S),
        (this.eqFilterVolumeDelta = (x - S) / a),
        (this.delayInputMult = I),
        (this.delayInputMultDelta = (P - I) / a);
    }
    updateWaves(t, n) {
      if (((this.volumeScale = 1), 0 == t.type))
        this.wave = this.aliases
          ? e.rawChipWaves[t.chipWave].samples
          : e.chipWaves[t.chipWave].samples;
      else if (9 == t.type)
        (this.wave = this.aliases
          ? t.customChipWave
          : t.customChipWaveIntegral),
          (this.volumeScale = 0.05);
      else if (2 == t.type) this.wave = o(t.chipNoise, U, W);
      else if (5 == t.type)
        this.wave = this.harmonicsWave.getCustomWave(t.harmonicsWave, t.type);
      else if (7 == t.type)
        this.wave = this.harmonicsWave.getCustomWave(t.harmonicsWave, t.type);
      else if (3 == t.type)
        this.wave = this.spectrumWave.getCustomWave(t.spectrumWave, 8);
      else if (4 == t.type) {
        for (let n = 0; n < e.drumCount; n++)
          this.drumsetSpectrumWaves[n].getCustomWave(
            t.drumsetSpectrumWaves[n],
            Mt._(n)
          );
        this.wave = null;
      } else this.wave = null;
    }
    getDrumsetWave(t) {
      if (4 == this.type) return this.drumsetSpectrumWaves[t].wave;
      throw new Error("Unhandled instrument type in getDrumsetWave");
    }
    static drumsetIndexReferenceDelta(t) {
      return yt.frequencyFromPitch(e.spectrumBasePitch + 6 * t) / 44100;
    }
    static _(t) {
      return 15 + Math.log2(Mt.drumsetIndexReferenceDelta(t));
    }
  }
  class Ft {
    constructor() {
      (this.instruments = []),
        (this.muted = !1),
        (this.singleSeamlessInstrument = null);
    }
  }
  class St {
    syncSongState() {
      const t = this.song.getChannelCount();
      for (let e = this.channels.length; e < t; e++)
        this.channels[e] = new Ft();
      this.channels.length = t;
      for (let e = 0; e < t; e++) {
        const t = this.song.channels[e],
          n = this.channels[e];
        for (let e = n.instruments.length; e < t.instruments.length; e++)
          n.instruments[e] = new Mt();
        if (
          ((n.instruments.length = t.instruments.length),
          n.muted != t.muted && ((n.muted = t.muted), n.muted))
        )
          for (const t of n.instruments) t.resetAllEffects();
      }
    }
    initModFilters(t) {
      if (null != t)
        for (let e = 0; e < t.getChannelCount(); e++)
          for (let n = 0; n < t.channels[e].instruments.length; n++) {
            const i = t.channels[e].instruments[n];
            (i.tmpEqFilterStart = i.eqFilter),
              (i.tmpEqFilterEnd = null),
              (i.tmpNoteFilterStart = i.noteFilter),
              (i.tmpNoteFilterEnd = null);
          }
    }
    warmUpSynthesizer(t) {
      if (null != t) {
        this.syncSongState();
        const e = this.getSamplesPerTick();
        for (let n = 0; n < t.getChannelCount(); n++)
          for (let i = 0; i < t.channels[n].instruments.length; i++) {
            const a = t.channels[n].instruments[i],
              r = this.channels[n].instruments[i];
            St.getInstrumentSynthFunction(a),
              (r.vibratoTime = 0),
              (r.nextVibratoTime = 0),
              (r.envelopeTime = 0),
              (r.arpTime = 0),
              r.updateWaves(a, this.samplesPerSecond),
              r.allocateNecessaryBuffers(this, a, e);
          }
      }
      var e = new Float32Array(1);
      (this.isPlayingSong = !0),
        this.synthesize(e, e, 1, !0),
        (this.isPlayingSong = !1);
    }
    computeLatestModValues() {
      if (null != this.song && this.song.modChannelCount > 0) {
        let t = [],
          n = [];
        (this.modValues = []),
          (this.nextModValues = []),
          (this.modInsValues = []),
          (this.nextModInsValues = []),
          (this.heldMods = []);
        for (
          let t = 0;
          t < this.song.pitchChannelCount + this.song.noiseChannelCount;
          t++
        ) {
          (n[t] = []),
            (this.modInsValues[t] = []),
            (this.nextModInsValues[t] = []);
          for (let e = 0; e < this.song.channels[t].instruments.length; e++)
            (this.modInsValues[t][e] = []),
              (this.nextModInsValues[t][e] = []),
              (n[t][e] = []);
        }
        let i = this.beat * e.partsPerBeat + this.part;
        for (
          let a = this.song.pitchChannelCount + this.song.noiseChannelCount;
          a < this.song.getChannelCount();
          a++
        )
          if (!this.song.channels[a].muted) {
            let r;
            for (let o = this.bar; o >= 0; o--)
              if (((r = this.song.getPattern(a, o)), null != r)) {
                let s = r.instruments[0],
                  l = this.song.channels[a].instruments[s],
                  c = [],
                  h = [],
                  p = o == this.bar ? i : this.findPartsInBar(o);
                for (const t of r.notes)
                  if (
                    t.start <= p &&
                    (null == c[e.modCount - 1 - t.pitches[0]] ||
                      t.end > c[e.modCount - 1 - t.pitches[0]])
                  )
                    if (
                      (t.start == p &&
                        ((c[e.modCount - 1 - t.pitches[0]] = t.start),
                        (h[e.modCount - 1 - t.pitches[0]] = t.pins[0].size)),
                      t.end <= p)
                    )
                      (c[e.modCount - 1 - t.pitches[0]] = t.end),
                        (h[e.modCount - 1 - t.pitches[0]] =
                          t.pins[t.pins.length - 1].size);
                    else {
                      c[e.modCount - 1 - t.pitches[0]] = p;
                      for (let n = 0; n < t.pins.length; n++)
                        if (t.pins[n].time + t.start > p) {
                          const i = t.pins[n].time - t.pins[n - 1].time,
                            a = p - t.start - t.pins[n - 1].time,
                            r = t.pins[n].size - t.pins[n - 1].size;
                          (h[e.modCount - 1 - t.pitches[0]] = Math.round(
                            t.pins[n - 1].size + (r * a) / i
                          )),
                            (n = t.pins.length);
                        }
                    }
                for (let i = 0; i < e.modCount; i++)
                  if (null != c[i])
                    if (e.modulators[l.modulators[i]].forSong)
                      (null == t[l.modulators[i]] ||
                        o * e.partsPerBeat * this.song.beatsPerBar + c[i] >
                          t[l.modulators[i]]) &&
                        (this.setModValue(
                          h[i],
                          h[i],
                          l.modChannels[i],
                          l.modInstruments[i],
                          l.modulators[i]
                        ),
                        (t[l.modulators[i]] =
                          o * e.partsPerBeat * this.song.beatsPerBar + c[i]));
                    else {
                      let t = [];
                      if (
                        l.modInstruments[i] ==
                        this.song.channels[l.modChannels[i]].instruments.length
                      )
                        for (
                          let e = 0;
                          e <
                          this.song.channels[l.modChannels[i]].instruments
                            .length;
                          e++
                        )
                          t.push(e);
                      else if (
                        l.modInstruments[i] >
                        this.song.channels[l.modChannels[i]].instruments.length
                      ) {
                        const e = this.song.getPattern(l.modChannels[i], o);
                        null != e && (t = e.instruments);
                      } else t.push(l.modInstruments[i]);
                      for (let a = 0; a < t.length; a++) {
                        const r =
                            l.modulators[i] ==
                            e.modulators.dictionary["eq filter"].index,
                          s =
                            l.modulators[i] ==
                            e.modulators.dictionary["note filter"].index;
                        let p = l.modulators[i];
                        if (
                          (r
                            ? (p =
                                e.modulators.length + (0 | l.modFilterTypes[i]))
                            : s &&
                              (p =
                                e.modulators.length +
                                1 +
                                2 * e.filterMaxPoints +
                                (0 | l.modFilterTypes[i])),
                          null == n[l.modChannels[i]][t[a]][p] ||
                            o * e.partsPerBeat * this.song.beatsPerBar + c[i] >
                              n[l.modChannels[i]][t[a]][p])
                        ) {
                          if (r) {
                            let n =
                              this.song.channels[l.modChannels[i]].instruments[
                                t[a]
                              ];
                            if (0 == l.modFilterTypes[i])
                              n.tmpEqFilterStart = n.eqSubFilters[h[i]];
                            else {
                              for (let t = 0; t < e.filterMorphCount; t++)
                                null != n.tmpEqFilterStart &&
                                  n.tmpEqFilterStart == n.eqSubFilters[t] &&
                                  ((n.tmpEqFilterStart = new ut()),
                                  n.tmpEqFilterStart.fromJsonObject(
                                    n.eqSubFilters[t].toJsonObject()
                                  ),
                                  (t = e.filterMorphCount));
                              null != n.tmpEqFilterStart &&
                                Math.floor((l.modFilterTypes[i] - 1) / 2) <
                                  n.tmpEqFilterStart.controlPointCount &&
                                (l.modFilterTypes[i] % 2
                                  ? (n.tmpEqFilterStart.controlPoints[
                                      Math.floor((l.modFilterTypes[i] - 1) / 2)
                                    ].freq = h[i])
                                  : (n.tmpEqFilterStart.controlPoints[
                                      Math.floor((l.modFilterTypes[i] - 1) / 2)
                                    ].gain = h[i]));
                            }
                            n.tmpEqFilterEnd = n.tmpEqFilterStart;
                          } else if (s) {
                            let n =
                              this.song.channels[l.modChannels[i]].instruments[
                                t[a]
                              ];
                            if (0 == l.modFilterTypes[i])
                              n.tmpNoteFilterStart = n.noteSubFilters[h[i]];
                            else {
                              for (let t = 0; t < e.filterMorphCount; t++)
                                null != n.tmpNoteFilterStart &&
                                  n.tmpNoteFilterStart == n.noteSubFilters[t] &&
                                  ((n.tmpNoteFilterStart = new ut()),
                                  n.tmpNoteFilterStart.fromJsonObject(
                                    n.noteSubFilters[t].toJsonObject()
                                  ),
                                  (t = e.filterMorphCount));
                              null != n.tmpNoteFilterStart &&
                                Math.floor((l.modFilterTypes[i] - 1) / 2) <
                                  n.tmpNoteFilterStart.controlPointCount &&
                                (l.modFilterTypes[i] % 2
                                  ? (n.tmpNoteFilterStart.controlPoints[
                                      Math.floor((l.modFilterTypes[i] - 1) / 2)
                                    ].freq = h[i])
                                  : (n.tmpNoteFilterStart.controlPoints[
                                      Math.floor((l.modFilterTypes[i] - 1) / 2)
                                    ].gain = h[i]));
                            }
                            n.tmpNoteFilterEnd = n.tmpNoteFilterStart;
                          } else
                            this.setModValue(
                              h[i],
                              h[i],
                              l.modChannels[i],
                              t[a],
                              p
                            );
                          n[l.modChannels[i]][t[a]][p] =
                            o * e.partsPerBeat * this.song.beatsPerBar + c[i];
                        }
                      }
                    }
              }
          }
      }
    }
    determineInvalidModulators(t) {
      if (null != this.song)
        for (let n = 0; n < e.modCount; n++) {
          if (((t.invalidModulators[n] = !0), -1 == t.modChannels[n])) {
            0 != t.modulators[n] && (t.invalidModulators[n] = !1);
            continue;
          }
          const i = this.song.channels[t.modChannels[n]];
          if (null == i) continue;
          let a = [];
          a =
            t.modInstruments[n] >= i.instruments.length
              ? i.instruments
              : [i.instruments[t.modInstruments[n]]];
          for (let i = 0; i < a.length; i++) {
            const r = a[i];
            if (null == r) continue;
            const o = e.modulators[t.modulators[n]].name;
            (12 != e.modulators[t.modulators[n]].associatedEffect &&
              !(
                r.effects &
                (1 << e.modulators[t.modulators[n]].associatedEffect)
              )) ||
              (1 != r.type &&
                ("fm slider 1" == o ||
                  "fm slider 2" == o ||
                  "fm slider 3" == o ||
                  "fm slider 4" == o ||
                  "fm feedback" == o)) ||
              (6 != r.type && 8 != r.type && "pulse width" == o) ||
              (8 != r.type &&
                ("dynamism" == o || "spread" == o || "saw shape" == o)) ||
              (!r.getChord().arpeggiates &&
                ("arp speed" == o || "reset arp" == o)) ||
              (r.eqFilterType && "eq filter" == o) ||
              (!r.eqFilterType &&
                ("eq filt cut" == o || "eq filt peak" == o)) ||
              ("eq filter" == o &&
                Math.floor((t.modFilterTypes[n] + 1) / 2) >
                  r.getLargestControlPointCount(!1)) ||
              (r.noteFilterType && "note filter" == o) ||
              (!r.noteFilterType &&
                ("note filt cut" == o || "note filt peak" == o)) ||
              ("note filter" == o &&
                Math.floor((t.modFilterTypes[n] + 1) / 2) >
                  r.getLargestControlPointCount(!0)) ||
              ((t.invalidModulators[n] = !1), (i = a.length));
          }
        }
    }
    static operatorAmplitudeCurve(t) {
      return (Math.pow(16, t / 15) - 1) / 15;
    }
    get playing() {
      return this.isPlayingSong;
    }
    get recording() {
      return this.isRecording;
    }
    get playhead() {
      return this.playheadInternal;
    }
    set playhead(t) {
      if (null != this.song) {
        this.playheadInternal = Math.max(0, Math.min(this.song.barCount, t));
        let n = this.playheadInternal;
        (this.bar = Math.floor(n)),
          (n = this.song.beatsPerBar * (n - this.bar)),
          (this.beat = Math.floor(n)),
          (n = e.partsPerBeat * (n - this.beat)),
          (this.part = Math.floor(n)),
          (n = e.ticksPerPart * (n - this.part)),
          (this.tick = Math.floor(n)),
          (this.tickSampleCountdown = 0),
          (this.isAtStartOfTick = !0),
          (this.prevBar = null);
      }
    }
    getSamplesPerBar() {
      if (null == this.song) throw new Error();
      return (
        this.getSamplesPerTick() *
        e.ticksPerPart *
        e.partsPerBeat *
        this.song.beatsPerBar
      );
    }
    getTicksIntoBar() {
      return (
        (this.beat * e.partsPerBeat + this.part) * e.ticksPerPart + this.tick
      );
    }
    getCurrentPart() {
      return this.beat * e.partsPerBeat + this.part;
    }
    findPartsInBar(t) {
      if (null == this.song) return 0;
      let n = e.partsPerBeat * this.song.beatsPerBar;
      for (
        let i = this.song.pitchChannelCount + this.song.noiseChannelCount;
        i < this.song.getChannelCount();
        i++
      ) {
        let a = this.song.getPattern(i, t);
        if (null != a) {
          let t = this.song.channels[i].instruments[a.instruments[0]];
          for (let i = 0; i < e.modCount; i++)
            if (t.modulators[i] == e.modulators.dictionary["next bar"].index)
              for (const t of a.notes)
                t.pitches[0] == e.modCount - 1 - i &&
                  n > t.start &&
                  (n = t.start);
        }
      }
      return n;
    }
    getTotalSamples(t, n, i) {
      if (null == this.song) return -1;
      let a = t ? 0 : this.song.loopStart,
        r = n ? this.song.barCount : this.song.loopStart + this.song.loopLength,
        o = !1,
        s = !1,
        l = this.song.tempo;
      for (
        let t = this.song.getChannelCount() - 1;
        t >= this.song.pitchChannelCount + this.song.noiseChannelCount;
        t--
      )
        for (let n = a; n < r; n++) {
          let i = this.song.getPattern(t, n);
          if (null != i) {
            let n = this.song.channels[t].instruments[i.instruments[0]];
            for (let t = 0; t < e.modCount; t++)
              n.modulators[t] == e.modulators.dictionary.tempo.index &&
                (o = !0),
                n.modulators[t] == e.modulators.dictionary["next bar"].index &&
                  (s = !0);
          }
        }
      if (a > 0) {
        let t = null,
          n = 0;
        for (let i = a - 1; i >= 0; i--) {
          for (
            let a = this.song.getChannelCount() - 1;
            a >= this.song.pitchChannelCount + this.song.noiseChannelCount;
            a--
          ) {
            let r = this.song.getPattern(a, i);
            if (null != r) {
              let o = r.instruments[0],
                s = this.song.channels[a].instruments[o],
                l = this.findPartsInBar(i);
              for (const i of r.notes)
                if (
                  s.modulators[e.modCount - 1 - i.pitches[0]] ==
                    e.modulators.dictionary.tempo.index &&
                  i.start < l &&
                  (null == t || i.end > t)
                )
                  if (i.end <= l)
                    (t = i.end), (n = i.pins[i.pins.length - 1].size);
                  else {
                    t = l;
                    for (let t = 0; t < i.pins.length; t++)
                      if (i.pins[t].time + i.start > l) {
                        const e = i.pins[t].time - i.pins[t - 1].time,
                          a = l - i.start - i.pins[t - 1].time,
                          r = i.pins[t].size - i.pins[t - 1].size;
                        (n = Math.round(i.pins[t - 1].size + (r * a) / e)),
                          (t = i.pins.length);
                      }
                  }
            }
          }
          null != t &&
            ((l = n + e.modulators.dictionary.tempo.convertRealFactor),
            (i = -1));
        }
      }
      if (o || s) {
        let t = a,
          n = !1,
          c = 0;
        for (; !n; ) {
          let a = e.partsPerBeat * this.song.beatsPerBar,
            h = 0;
          if ((s && (a = this.findPartsInBar(t)), o)) {
            let n = !1;
            for (
              let i = this.song.getChannelCount() - 1;
              i >= this.song.pitchChannelCount + this.song.noiseChannelCount;
              i--
            )
              if (0 == n) {
                let r = this.song.getPattern(i, t);
                if (null != r) {
                  let t = this.song.channels[i].instruments[r.instruments[0]];
                  for (let i = 0; i < e.modCount; i++)
                    if (
                      0 == n &&
                      t.modulators[i] == e.modulators.dictionary.tempo.index &&
                      r.notes.find((t) => t.pitches[0] == e.modCount - 1 - i)
                    ) {
                      (n = !0),
                        r.notes.sort(function (t, e) {
                          return t.start == e.start
                            ? t.pitches[0] - e.pitches[0]
                            : t.start - e.start;
                        });
                      for (const t of r.notes)
                        if (
                          t.pitches[0] == e.modCount - 1 - i &&
                          ((c +=
                            Math.min(a - h, t.start - h) *
                            e.ticksPerPart *
                            this.getSamplesPerTickSpecificBPM(l)),
                          t.start < a)
                        )
                          for (let n = 1; n < t.pins.length; n++) {
                            if (t.pins[n - 1].time + t.start <= a) {
                              const i =
                                  e.ticksPerPart *
                                  Math.min(
                                    a - (t.start + t.pins[n - 1].time),
                                    t.pins[n].time - t.pins[n - 1].time
                                  ),
                                r =
                                  t.pins[n - 1].size +
                                  e.modulators.dictionary.tempo
                                    .convertRealFactor;
                              let o =
                                t.pins[n].size +
                                e.modulators.dictionary.tempo.convertRealFactor;
                              t.pins[n].time + t.start > a &&
                                (o =
                                  t.pins[n - 1].size +
                                  ((t.pins[n].size - t.pins[n - 1].size) *
                                    (a - (t.start + t.pins[n - 1].time))) /
                                    (t.pins[n].time - t.pins[n - 1].time) +
                                  e.modulators.dictionary.tempo
                                    .convertRealFactor);
                              let s = (e.partsPerBeat * e.ticksPerPart) / 60;
                              (c +=
                                o != r
                                  ? (-this.samplesPerSecond *
                                      i *
                                      (Math.log(s * o * i) -
                                        Math.log(s * r * i))) /
                                    (s * (r - o))
                                  : i * this.getSamplesPerTickSpecificBPM(o)),
                                (l = o);
                            }
                            h = Math.min(t.start + t.pins[n].time, a);
                          }
                    }
                }
              }
          }
          (c +=
            (a - h) * e.ticksPerPart * this.getSamplesPerTickSpecificBPM(l)),
            t++,
            0 != i &&
              t == this.song.loopStart + this.song.loopLength &&
              ((t = this.song.loopStart), i > 0 && i--),
            t >= r && (n = !0);
        }
        return Math.ceil(c);
      }
      return this.getSamplesPerBar() * this.getTotalBars(t, n, i);
    }
    getTotalBars(t, e, n = this.loopRepeatCount) {
      if (null == this.song) throw new Error();
      let i = this.song.loopLength * (n + 1);
      return (
        t && (i += this.song.loopStart),
        e &&
          (i +=
            this.song.barCount - (this.song.loopStart + this.song.loopLength)),
        i
      );
    }
    constructor(t = null) {
      (this.samplesPerSecond = 44100),
        (this.song = null),
        (this.preferLowerLatency = !1),
        (this.anticipatePoorPerformance = !1),
        (this.liveInputDuration = 0),
        (this.liveBassInputDuration = 0),
        (this.liveInputStarted = !1),
        (this.liveBassInputStarted = !1),
        (this.liveInputPitches = []),
        (this.liveBassInputPitches = []),
        (this.liveInputChannel = 0),
        (this.liveBassInputChannel = 0),
        (this.liveInputInstruments = []),
        (this.liveBassInputInstruments = []),
        (this.loopRepeatCount = -1),
        (this.volume = 1),
        (this.enableMetronome = !1),
        (this.countInMetronome = !1),
        (this.renderingSong = !1),
        (this.heldMods = []),
        (this.wantToSkip = !1),
        (this.playheadInternal = 0),
        (this.bar = 0),
        (this.prevBar = null),
        (this.nextBar = null),
        (this.beat = 0),
        (this.part = 0),
        (this.tick = 0),
        (this.isAtStartOfTick = !0),
        (this.isAtEndOfTick = !0),
        (this.tickSampleCountdown = 0),
        (this.modValues = []),
        (this.modInsValues = []),
        (this.nextModValues = []),
        (this.nextModInsValues = []),
        (this.isPlayingSong = !1),
        (this.isRecording = !1),
        (this.liveInputEndTime = 0),
        (this.browserAutomaticallyClearsAudioBuffer = !0),
        (this.tempDrumSetControlPoint = new mt()),
        (this.tempFrequencyResponse = new J()),
        (this.loopBarStart = -1),
        (this.loopBarEnd = -1),
        (this.channels = []),
        (this.tonePool = new Q()),
        (this.tempMatchedPitchTones = Array(e.maxChordSize).fill(null)),
        (this.startedMetronome = !1),
        (this.metronomeSamplesRemaining = -1),
        (this.metronomeAmplitude = 0),
        (this.metronomePrevAmplitude = 0),
        (this.metronomeFilter = 0),
        (this.limit = 0),
        (this.tempMonoInstrumentSampleBuffer = null),
        (this.audioCtx = null),
        (this.scriptNode = null),
        (this.audioProcessCallback = (t) => {
          const e = t.outputBuffer,
            n = e.getChannelData(0),
            i = e.getChannelData(1);
          if (
            (!this.browserAutomaticallyClearsAudioBuffer ||
              (0 == n[0] &&
                0 == i[0] &&
                0 == n[e.length - 1] &&
                0 == i[e.length - 1]) ||
              (this.browserAutomaticallyClearsAudioBuffer = !1),
            !this.browserAutomaticallyClearsAudioBuffer)
          ) {
            const t = e.length;
            for (let e = 0; e < t; e++) (n[e] = 0), (i[e] = 0);
          }
          !this.isPlayingSong && performance.now() >= this.liveInputEndTime
            ? this.deactivateAudio()
            : this.synthesize(n, i, e.length, this.isPlayingSong);
        }),
        this.computeDelayBufferSizes(),
        null != t && this.setSong(t);
    }
    setSong(t) {
      "string" == typeof t
        ? (this.song = new gt(t))
        : t instanceof gt && (this.song = t),
        (this.prevBar = null);
    }
    computeDelayBufferSizes() {
      (this.panningDelayBufferSize = St.fittingPowerOfTwo(
        this.samplesPerSecond * e.panDelaySecondsMax
      )),
        (this.panningDelayBufferMask = this.panningDelayBufferSize - 1),
        (this.chorusDelayBufferSize = St.fittingPowerOfTwo(
          this.samplesPerSecond * e.chorusMaxDelay
        )),
        (this.chorusDelayBufferMask = this.chorusDelayBufferSize - 1);
    }
    activateAudio() {
      const t = this.anticipatePoorPerformance
        ? this.preferLowerLatency
          ? 2048
          : 4096
        : this.preferLowerLatency
        ? 512
        : 2048;
      if (
        null == this.audioCtx ||
        null == this.scriptNode ||
        this.scriptNode.bufferSize != t
      ) {
        null != this.scriptNode && this.deactivateAudio();
        const e = this.anticipatePoorPerformance
          ? this.preferLowerLatency
            ? "balanced"
            : "playback"
          : this.preferLowerLatency
          ? "interactive"
          : "balanced";
        (this.audioCtx =
          this.audioCtx ||
          new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: e,
          })),
          (this.samplesPerSecond = this.audioCtx.sampleRate),
          (this.scriptNode = this.audioCtx.createScriptProcessor
            ? this.audioCtx.createScriptProcessor(t, 0, 2)
            : this.audioCtx.createJavaScriptNode(t, 0, 2)),
          (this.scriptNode.onaudioprocess = this.audioProcessCallback),
          (this.scriptNode.channelCountMode = "explicit"),
          (this.scriptNode.channelInterpretation = "speakers"),
          this.scriptNode.connect(this.audioCtx.destination),
          this.computeDelayBufferSizes();
      }
      this.audioCtx.resume();
    }
    deactivateAudio() {
      null != this.audioCtx &&
        null != this.scriptNode &&
        (this.scriptNode.disconnect(this.audioCtx.destination),
        (this.scriptNode = null),
        this.audioCtx.close && this.audioCtx.close(),
        (this.audioCtx = null));
    }
    maintainLiveInput() {
      this.activateAudio(), (this.liveInputEndTime = performance.now() + 1e4);
    }
    play() {
      this.isPlayingSong ||
        (this.initModFilters(this.song),
        this.computeLatestModValues(),
        this.activateAudio(),
        this.warmUpSynthesizer(this.song),
        (this.isPlayingSong = !0));
    }
    pause() {
      if (
        this.isPlayingSong &&
        ((this.isPlayingSong = !1),
        (this.isRecording = !1),
        (this.modValues = []),
        (this.nextModValues = []),
        (this.heldMods = []),
        null != this.song)
      ) {
        (this.song.inVolumeCap = 0), (this.song.outVolumeCap = 0);
        for (
          let t = 0;
          t < this.song.pitchChannelCount + this.song.noiseChannelCount;
          t++
        )
          (this.modInsValues[t] = []), (this.nextModInsValues[t] = []);
      }
    }
    startRecording() {
      (this.preferLowerLatency = !0), (this.isRecording = !0), this.play();
    }
    resetEffects() {
      if (((this.limit = 0), this.freeAllTones(), null != this.song))
        for (const t of this.channels)
          for (const e of t.instruments) e.resetAllEffects();
    }
    setModValue(t, n, i, a, r) {
      let o = t + e.modulators[r].convertRealFactor,
        s = n + e.modulators[r].convertRealFactor;
      return (
        e.modulators[r].forSong
          ? (null != this.modValues[r] &&
              this.modValues[r] == o &&
              this.nextModValues[r] == s) ||
            ((this.modValues[r] = o), (this.nextModValues[r] = s))
          : (null != this.modInsValues[i][a][r] &&
              this.modInsValues[i][a][r] == o &&
              this.nextModInsValues[i][a][r] == s) ||
            ((this.modInsValues[i][a][r] = o),
            (this.nextModInsValues[i][a][r] = s)),
        o
      );
    }
    getModValue(t, n, i, a) {
      if (e.modulators[t].forSong) {
        if (null != this.modValues[t] && null != this.nextModValues[t])
          return a ? this.nextModValues[t] : this.modValues[t];
      } else if (
        null != n &&
        null != i &&
        null != this.modInsValues[n][i][t] &&
        null != this.nextModInsValues[n][i][t]
      )
        return a ? this.nextModInsValues[n][i][t] : this.modInsValues[n][i][t];
      return -1;
    }
    isAnyModActive(t, n) {
      for (let i = 0; i < e.modulators.length; i++)
        if (
          (null != this.modValues && null != this.modValues[i]) ||
          (null != this.modInsValues &&
            null != this.modInsValues[t] &&
            null != this.modInsValues[t][n] &&
            null != this.modInsValues[t][n][i])
        )
          return !0;
      return !1;
    }
    unsetMod(t, e, n) {
      if (
        this.isModActive(t) ||
        (null != e && null != n && this.isModActive(t, e, n))
      ) {
        (this.modValues[t] = null), (this.nextModValues[t] = null);
        for (let i = 0; i < this.heldMods.length; i++)
          null != e && null != n
            ? this.heldMods[i].channelIndex == e &&
              this.heldMods[i].instrumentIndex == n &&
              this.heldMods[i].setting == t &&
              this.heldMods.splice(i, 1)
            : this.heldMods[i].setting == t && this.heldMods.splice(i, 1);
        null != e &&
          null != n &&
          ((this.modInsValues[e][n][t] = null),
          (this.nextModInsValues[e][n][t] = null));
      }
    }
    isFilterModActive(t, e, n) {
      const i = this.song.channels[e].instruments[n];
      if (t) {
        if (i.noteFilterType) return !1;
        if (null != i.tmpNoteFilterEnd) return !0;
      } else {
        if (i.eqFilterType) return !1;
        if (null != i.tmpEqFilterEnd) return !0;
      }
      return !1;
    }
    isModActive(t, n, i) {
      return e.modulators[t].forSong
        ? null != this.modValues && null != this.modValues[t]
        : null != n &&
            null != i &&
            null != this.modInsValues &&
            null != this.modInsValues[n] &&
            null != this.modInsValues[n][i] &&
            null != this.modInsValues[n][i][t];
    }
    forceHoldMods(t, e, n, i) {
      let a = !1;
      for (let r = 0; r < this.heldMods.length; r++)
        this.heldMods[r].channelIndex == e &&
          this.heldMods[r].instrumentIndex == n &&
          this.heldMods[r].setting == i &&
          ((this.heldMods[r].volume = t),
          (this.heldMods[r].holdFor = 24),
          (a = !0));
      a ||
        this.heldMods.push({
          volume: t,
          channelIndex: e,
          instrumentIndex: n,
          setting: i,
          holdFor: 24,
        });
    }
    snapToStart() {
      (this.bar = 0), this.resetEffects(), this.snapToBar();
    }
    goToBar(t) {
      (this.bar = t), this.resetEffects(), (this.playheadInternal = this.bar);
    }
    snapToBar() {
      (this.playheadInternal = this.bar),
        (this.beat = 0),
        (this.part = 0),
        (this.tick = 0),
        (this.tickSampleCountdown = 0);
    }
    jumpIntoLoop() {
      if (
        this.song &&
        (this.bar < this.song.loopStart ||
          this.bar >= this.song.loopStart + this.song.loopLength)
      ) {
        const t = this.bar;
        (this.bar = this.song.loopStart),
          (this.playheadInternal += this.bar - t),
          this.playing && this.computeLatestModValues();
      }
    }
    goToNextBar() {
      if (!this.song) return;
      this.prevBar = this.bar;
      const t = this.bar;
      this.bar++,
        this.bar >= this.song.barCount && (this.bar = 0),
        (this.playheadInternal += this.bar - t),
        this.playing && this.computeLatestModValues();
    }
    goToPrevBar() {
      if (!this.song) return;
      this.prevBar = null;
      const t = this.bar;
      this.bar--,
        (this.bar < 0 || this.bar >= this.song.barCount) &&
          (this.bar = this.song.barCount - 1),
        (this.playheadInternal += this.bar - t),
        this.playing && this.computeLatestModValues();
    }
    getNextBar() {
      let t = this.bar + 1;
      return (
        this.isRecording
          ? t >= this.song.barCount && (t = this.song.barCount - 1)
          : this.bar != this.loopBarEnd || this.renderingSong
          ? 0 != this.loopRepeatCount &&
            t ==
              Math.max(
                this.loopBarEnd + 1,
                this.song.loopStart + this.song.loopLength
              ) &&
            (t = this.song.loopStart)
          : (t = this.loopBarStart),
        t
      );
    }
    skipBar() {
      if (!this.song) return;
      const t = this.getSamplesPerTick();
      this.loopBarEnd != this.bar ? this.bar++ : (this.bar = this.loopBarStart),
        (this.beat = 0),
        (this.part = 0),
        (this.tick = 0),
        (this.tickSampleCountdown = t),
        (this.isAtStartOfTick = !0),
        0 != this.loopRepeatCount &&
          this.bar ==
            Math.max(
              this.song.loopStart + this.song.loopLength,
              this.loopBarEnd
            ) &&
          ((this.bar = this.song.loopStart),
          -1 != this.loopBarStart && (this.bar = this.loopBarStart),
          this.loopRepeatCount > 0 && this.loopRepeatCount--);
    }
    synthesize(t, n, i, a = !0) {
      if (null == this.song) {
        for (let e = 0; e < i; e++) (t[e] = 0), (n[e] = 0);
        return void this.deactivateAudio();
      }
      const r = this.song;
      (this.song.inVolumeCap = 0), (this.song.outVolumeCap = 0);
      let o = this.getSamplesPerTick(),
        s = !1;
      (this.tickSampleCountdown <= 0 || this.tickSampleCountdown > o) &&
        ((this.tickSampleCountdown = o), (this.isAtStartOfTick = !0)),
        a &&
          (this.beat >= r.beatsPerBar &&
            ((this.beat = 0),
            (this.part = 0),
            (this.tick = 0),
            (this.tickSampleCountdown = o),
            (this.isAtStartOfTick = !0),
            (this.prevBar = this.bar),
            (this.bar = this.getNextBar()),
            this.bar <= this.prevBar &&
              this.loopRepeatCount > 0 &&
              this.loopRepeatCount--),
          this.bar >= r.barCount &&
            ((this.bar = 0),
            -1 != this.loopRepeatCount && ((s = !0), this.pause()))),
        this.syncSongState(),
        (null == this.tempMonoInstrumentSampleBuffer ||
          this.tempMonoInstrumentSampleBuffer.length < i) &&
          (this.tempMonoInstrumentSampleBuffer = new Float32Array(i));
      const l = +this.volume,
        c = 1 - Math.pow(0.5, this.song.limitDecay / this.samplesPerSecond),
        h = 1 - Math.pow(0.5, this.song.limitRise / this.samplesPerSecond);
      let p = +this.limit,
        d = [],
        m = -1,
        u = 0;
      for (; u < i && !s; ) {
        (this.nextBar = this.getNextBar()),
          this.nextBar >= r.barCount && (this.nextBar = null);
        const f = i - u,
          y = Math.ceil(this.tickSampleCountdown),
          b = Math.min(y, f),
          g = u + b;
        if (this.isPlayingSong || this.renderingSong) {
          for (
            let t = r.pitchChannelCount + r.noiseChannelCount;
            t < r.getChannelCount();
            t++
          ) {
            const n = r.channels[t],
              i = this.channels[t];
            this.determineCurrentActiveTones(r, t, o, a);
            for (let a = 0; a < n.instruments.length; a++) {
              const n = i.instruments[a];
              for (let i = 0; i < n.activeModTones.count(); i++) {
                const a = n.activeModTones.get(i),
                  s = r.channels[t].instruments[a.instrumentIndex];
                let l = e.modCount - 1 - a.pitches[0];
                ((s.modulators[l] ==
                  e.modulators.dictionary["note filter"].index ||
                  s.modulators[l] ==
                    e.modulators.dictionary["eq filter"].index) &&
                  null != s.modFilterTypes[l] &&
                  s.modFilterTypes[l] > 0) ||
                  this.playModTone(r, t, o, u, b, a, !1, !1);
              }
            }
          }
          for (
            let t = r.pitchChannelCount + r.noiseChannelCount;
            t < r.getChannelCount();
            t++
          ) {
            const n = r.channels[t],
              i = this.channels[t];
            for (let a = 0; a < n.instruments.length; a++) {
              const n = i.instruments[a];
              for (let i = 0; i < n.activeModTones.count(); i++) {
                const a = n.activeModTones.get(i),
                  s = r.channels[t].instruments[a.instrumentIndex];
                let l = e.modCount - 1 - a.pitches[0];
                (s.modulators[l] ==
                  e.modulators.dictionary["note filter"].index ||
                  s.modulators[l] ==
                    e.modulators.dictionary["eq filter"].index) &&
                  null != s.modFilterTypes[l] &&
                  s.modFilterTypes[l] > 0 &&
                  this.playModTone(r, t, o, u, b, a, !1, !1);
              }
            }
          }
        }
        if (this.wantToSkip) {
          let t = d.includes(this.bar);
          if (t && u == m) return void this.pause();
          -1 == m && (m = u),
            t || d.push(this.bar),
            (this.wantToSkip = !1),
            this.skipBar();
        } else {
          for (let i = 0; i < r.pitchChannelCount + r.noiseChannelCount; i++) {
            const s = r.channels[i],
              l = this.channels[i];
            this.isAtStartOfTick &&
              (this.determineCurrentActiveTones(
                r,
                i,
                o,
                a && !this.countInMetronome
              ),
              this.determineLiveInputTones(r, i, o));
            for (let a = 0; a < s.instruments.length; a++) {
              const c = s.instruments[a],
                h = l.instruments[a];
              if (this.isAtStartOfTick) {
                let t = h.activeTones.count() + h.liveInputTones.count();
                for (let n = 0; n < h.releasedTones.count(); n++) {
                  const a = h.releasedTones.get(n);
                  if (a.ticksSinceReleased >= Math.abs(c.getFadeOutTicks())) {
                    this.freeReleasedTone(h, n), n--;
                    continue;
                  }
                  const s = t >= e.maximumTonesPerChannel;
                  this.computeTone(r, i, o, a, !0, s), t++;
                }
                h.awake &&
                  (h.computed ||
                    h.compute(this, c, o, Math.ceil(o), null, i, a),
                  (h.computed = !1));
              }
              for (let t = 0; t < h.activeTones.count(); t++) {
                const e = h.activeTones.get(t);
                this.playTone(i, u, b, e);
              }
              for (let t = 0; t < h.liveInputTones.count(); t++) {
                const e = h.liveInputTones.get(t);
                this.playTone(i, u, b, e);
              }
              for (let t = 0; t < h.releasedTones.count(); t++) {
                const e = h.releasedTones.get(t);
                this.playTone(i, u, b, e);
              }
              h.awake && St.effectsSynth(this, t, n, u, b, h);
              const p = this.tickSampleCountdown,
                d = 1 - p / o,
                m = 1 - (p - b) / o,
                f =
                  (this.beat * e.partsPerBeat + this.part) * e.ticksPerPart +
                  this.tick,
                y = f / e.ticksPerPart,
                g = (f + 1) / e.ticksPerPart,
                v = y + (g - y) * d,
                k = y + (g - y) * m;
              let w = c.vibratoSpeed;
              (h.vibratoTime = h.nextVibratoTime),
                this.isModActive(
                  e.modulators.dictionary["vibrato speed"].index,
                  i,
                  a
                ) &&
                  (w = this.getModValue(
                    e.modulators.dictionary["vibrato speed"].index,
                    i,
                    a
                  )),
                0 == w
                  ? ((h.vibratoTime = 0), (h.nextVibratoTime = 0))
                  : (h.nextVibratoTime += 0.1 * w * (k - v));
            }
          }
          if (this.enableMetronome || this.countInMetronome)
            if (0 == this.part) {
              if (!this.startedMetronome) {
                const t =
                    r.beatsPerBar > 4 &&
                    r.beatsPerBar % 2 == 0 &&
                    this.beat == r.beatsPerBar / 2,
                  e = 0 == this.beat ? 8 : t ? 6 : 4,
                  n = 0 == this.beat ? 1600 : t ? 1200 : 800,
                  i = 0 == this.beat ? 0.06 : t ? 0.05 : 0.04,
                  a = this.samplesPerSecond / n,
                  o = (2 * Math.PI) / a;
                (this.metronomeSamplesRemaining = Math.floor(a * e)),
                  (this.metronomeFilter = 2 * Math.cos(o)),
                  (this.metronomeAmplitude = i * Math.sin(o)),
                  (this.metronomePrevAmplitude = 0),
                  (this.startedMetronome = !0);
              }
              if (this.metronomeSamplesRemaining > 0) {
                const e = Math.min(g, u + this.metronomeSamplesRemaining);
                this.metronomeSamplesRemaining -= e - u;
                for (let i = u; i < e; i++) {
                  (t[i] += this.metronomeAmplitude),
                    (n[i] += this.metronomeAmplitude);
                  const e =
                    this.metronomeFilter * this.metronomeAmplitude -
                    this.metronomePrevAmplitude;
                  (this.metronomePrevAmplitude = this.metronomeAmplitude),
                    (this.metronomeAmplitude = e);
                }
              }
            } else this.startedMetronome = !1;
          for (let e = u; e < g; e++) {
            const i = t[e] * r.masterGain * r.masterGain,
              a = n[e] * r.masterGain * r.masterGain,
              o = i < 0 ? -i : i,
              s = a < 0 ? -a : a,
              d = o > s ? o : s;
            this.song.inVolumeCap =
              this.song.inVolumeCap > d ? this.song.inVolumeCap : d;
            const m = +(d > r.compressionThreshold) + +(d > r.limitThreshold),
              u =
                +(0 == m) *
                  ((0.8 * (d + 1 - r.compressionThreshold) + 0.25) *
                    r.compressionRatio +
                    1.05 * (1 - r.compressionRatio)) +
                1.05 * +(1 == m) +
                +(2 == m) *
                  (1.05 *
                    ((d + 1 - r.limitThreshold) * r.limitRatio +
                      (1 - r.limitThreshold)));
            p += (u - p) * (p < u ? h : c);
            const f = l / (p >= 1 ? 1.05 * p : 0.8 * p + 0.25);
            (t[e] = i * f),
              (n[e] = a * f),
              (this.song.outVolumeCap =
                this.song.outVolumeCap > d * f
                  ? this.song.outVolumeCap
                  : d * f);
          }
          if (
            ((u += b),
            (this.isAtStartOfTick = !1),
            (this.tickSampleCountdown -= b),
            this.tickSampleCountdown <= 0)
          ) {
            this.isAtStartOfTick = !0;
            for (const t of this.channels)
              for (const e of t.instruments) {
                for (let t = 0; t < e.releasedTones.count(); t++) {
                  const n = e.releasedTones.get(t);
                  n.isOnLastTick
                    ? (this.freeReleasedTone(e, t), t--)
                    : n.ticksSinceReleased++;
                }
                e.deactivateAfterThisTick && e.deactivate(),
                  (e.tonesAddedInThisTick = !1);
              }
            for (
              let t = 0;
              t < this.song.pitchChannelCount + this.song.noiseChannelCount;
              t++
            )
              for (
                let n = 0;
                n < this.song.channels[t].instruments.length;
                n++
              ) {
                let i = this.song.channels[t].instruments[n],
                  a = this.channels[t].instruments[n],
                  r = i.arpeggioSpeed;
                this.isModActive(
                  e.modulators.dictionary["arp speed"].index,
                  t,
                  n
                )
                  ? ((r = Math.max(
                      0,
                      Math.min(
                        e.arpSpeedScale.length - 1,
                        this.getModValue(
                          e.modulators.dictionary["arp speed"].index,
                          t,
                          n,
                          !1
                        )
                      )
                    )),
                    Number.isInteger(r)
                      ? (a.arpTime += e.arpSpeedScale[r])
                      : (a.arpTime +=
                          (1 - (r % 1)) * e.arpSpeedScale[Math.floor(r)] +
                          (r % 1) * e.arpSpeedScale[Math.ceil(r)]))
                  : (a.arpTime += e.arpSpeedScale[r]);
                let o = i.envelopeSpeed;
                this.isModActive(
                  e.modulators.dictionary["envelope speed"].index,
                  t,
                  n
                )
                  ? ((o = Math.max(
                      0,
                      Math.min(
                        e.arpSpeedScale.length - 1,
                        this.getModValue(
                          e.modulators.dictionary["envelope speed"].index,
                          t,
                          n,
                          !1
                        )
                      )
                    )),
                    Number.isInteger(o)
                      ? (a.envelopeTime += e.arpSpeedScale[o])
                      : (a.envelopeTime +=
                          (1 - (o % 1)) * e.arpSpeedScale[Math.floor(o)] +
                          (o % 1) * e.arpSpeedScale[Math.ceil(o)]))
                  : (a.envelopeTime += e.arpSpeedScale[o]);
              }
            for (
              let t = 0;
              t < this.song.pitchChannelCount + this.song.noiseChannelCount;
              t++
            )
              for (
                let e = 0;
                e < this.song.channels[t].instruments.length;
                e++
              ) {
                let n = this.song.channels[t].instruments[e];
                null != n.tmpEqFilterEnd
                  ? (n.tmpEqFilterStart = n.tmpEqFilterEnd)
                  : (n.tmpEqFilterStart = n.eqFilter),
                  null != n.tmpNoteFilterEnd
                    ? (n.tmpNoteFilterStart = n.tmpNoteFilterEnd)
                    : (n.tmpNoteFilterStart = n.noteFilter);
              }
            if (
              (this.tick++,
              (this.tickSampleCountdown += o),
              this.tick == e.ticksPerPart)
            ) {
              (this.tick = 0),
                this.part++,
                this.liveInputDuration--,
                this.liveBassInputDuration--;
              for (let t = 0; t < this.heldMods.length; t++)
                this.heldMods[t].holdFor--,
                  this.heldMods[t].holdFor <= 0 && this.heldMods.splice(t, 1);
              this.part == e.partsPerBeat &&
                ((this.part = 0),
                a &&
                  (this.beat++,
                  this.beat == r.beatsPerBar &&
                    ((this.beat = 0),
                    this.countInMetronome
                      ? (this.countInMetronome = !1)
                      : ((this.prevBar = this.bar),
                        (this.bar = this.getNextBar()),
                        this.bar <= this.prevBar &&
                          this.loopRepeatCount > 0 &&
                          this.loopRepeatCount--,
                        this.bar >= r.barCount &&
                          ((this.bar = 0),
                          -1 != this.loopRepeatCount &&
                            ((s = !0), this.resetEffects(), this.pause()))))));
            }
          }
          for (let t = 0; t < e.modulators.length; t++)
            null != this.nextModValues &&
              null != this.nextModValues[t] &&
              (this.modValues[t] = this.nextModValues[t]);
          this.isModActive(e.modulators.dictionary.tempo.index) &&
            ((o = this.getSamplesPerTick()),
            (this.tickSampleCountdown = Math.min(this.tickSampleCountdown, o)));
          for (
            let t = 0;
            t < this.song.pitchChannelCount + this.song.noiseChannelCount;
            t++
          )
            for (let n = 0; n < this.channels[t].instruments.length; n++) {
              const i = this.channels[t].instruments[n],
                a = this.song.channels[t].instruments[n];
              (i.nextVibratoTime =
                i.nextVibratoTime %
                (e.vibratoTypes[a.vibratoType].period /
                  ((e.ticksPerPart * o) / this.samplesPerSecond))),
                (i.arpTime = i.arpTime % (2520 * e.ticksPerArpeggio)),
                (i.envelopeTime =
                  i.envelopeTime %
                  (e.partsPerBeat * e.ticksPerPart * this.song.beatsPerBar));
            }
          for (let t = 0; t < e.modulators.length; t++)
            for (
              let e = 0;
              e < this.song.pitchChannelCount + this.song.noiseChannelCount;
              e++
            )
              for (let n = 0; n < this.song.getMaxInstrumentsPerChannel(); n++)
                null != this.nextModInsValues &&
                  null != this.nextModInsValues[e] &&
                  null != this.nextModInsValues[e][n] &&
                  null != this.nextModInsValues[e][n][t] &&
                  (this.modInsValues[e][n][t] = this.nextModInsValues[e][n][t]);
        }
      }
      (!Number.isFinite(p) || Math.abs(p) < X) && (p = 0),
        (this.limit = p),
        a &&
          !this.countInMetronome &&
          (this.playheadInternal =
            (((this.tick + 1 - this.tickSampleCountdown / o) / 2 + this.part) /
              e.partsPerBeat +
              this.beat) /
              r.beatsPerBar +
            this.bar);
    }
    freeTone(t) {
      this.tonePool.pushBack(t);
    }
    newTone() {
      if (this.tonePool.count() > 0) {
        const t = this.tonePool.popBack();
        return (t.freshlyAllocated = !0), t;
      }
      return new wt();
    }
    releaseTone(t, e) {
      t.releasedTones.pushFront(e),
        (e.atNoteStart = !1),
        (e.passedEndOfNote = !0);
    }
    freeReleasedTone(t, e) {
      this.freeTone(t.releasedTones.get(e)), t.releasedTones.remove(e);
    }
    freeAllTones() {
      for (const t of this.channels)
        for (const e of t.instruments) {
          for (; e.activeTones.count() > 0; )
            this.freeTone(e.activeTones.popBack());
          for (; e.activeModTones.count() > 0; )
            this.freeTone(e.activeModTones.popBack());
          for (; e.releasedTones.count() > 0; )
            this.freeTone(e.releasedTones.popBack());
          for (; e.liveInputTones.count() > 0; )
            this.freeTone(e.liveInputTones.popBack());
        }
    }
    determineLiveInputTones(t, e, n) {
      const i = t.channels[e],
        a = this.channels[e],
        r = this.liveInputPitches,
        o = this.liveBassInputPitches;
      for (let s = 0; s < i.instruments.length; s++) {
        const l = a.instruments[s],
          c = l.liveInputTones;
        let h = 0;
        if (
          this.liveInputDuration > 0 &&
          e == this.liveInputChannel &&
          r.length > 0 &&
          -1 != this.liveInputInstruments.indexOf(s)
        ) {
          const a = i.instruments[s];
          if (a.getChord().singleTone) {
            let i;
            c.count() <= h
              ? ((i = this.newTone()), c.pushBack(i))
              : !a.getTransition().isSeamless && this.liveInputStarted
              ? (this.releaseTone(l, c.get(h)),
                (i = this.newTone()),
                c.set(h, i))
              : (i = c.get(h)),
              h++;
            for (let t = 0; t < r.length; t++) i.pitches[t] = r[t];
            (i.pitchCount = r.length),
              (i.chordSize = 1),
              (i.instrumentIndex = s),
              (i.note = i.prevNote = i.nextNote = null),
              (i.atNoteStart = this.liveInputStarted),
              (i.forceContinueAtStart = !1),
              (i.forceContinueAtEnd = !1),
              this.computeTone(t, e, n, i, !1, !1);
          } else {
            this.moveTonesIntoOrderedTempMatchedList(c, r);
            for (let i = 0; i < r.length; i++) {
              let a;
              null != this.tempMatchedPitchTones[h]
                ? ((a = this.tempMatchedPitchTones[h]),
                  (this.tempMatchedPitchTones[h] = null),
                  (1 == a.pitchCount && a.pitches[0] == r[i]) ||
                    (this.releaseTone(l, a), (a = this.newTone())),
                  c.pushBack(a))
                : ((a = this.newTone()), c.pushBack(a)),
                h++,
                (a.pitches[0] = r[i]),
                (a.pitchCount = 1),
                (a.chordSize = r.length),
                (a.instrumentIndex = s),
                (a.note = a.prevNote = a.nextNote = null),
                (a.atNoteStart = this.liveInputStarted),
                (a.forceContinueAtStart = !1),
                (a.forceContinueAtEnd = !1),
                this.computeTone(t, e, n, a, !1, !1);
            }
          }
        }
        if (
          this.liveBassInputDuration > 0 &&
          e == this.liveBassInputChannel &&
          o.length > 0 &&
          -1 != this.liveBassInputInstruments.indexOf(s)
        ) {
          const a = i.instruments[s];
          if (a.getChord().singleTone) {
            let i;
            c.count() <= h
              ? ((i = this.newTone()), c.pushBack(i))
              : !a.getTransition().isSeamless && this.liveInputStarted
              ? (this.releaseTone(l, c.get(h)),
                (i = this.newTone()),
                c.set(h, i))
              : (i = c.get(h)),
              h++;
            for (let t = 0; t < o.length; t++) i.pitches[t] = o[t];
            (i.pitchCount = o.length),
              (i.chordSize = 1),
              (i.instrumentIndex = s),
              (i.note = i.prevNote = i.nextNote = null),
              (i.atNoteStart = this.liveBassInputStarted),
              (i.forceContinueAtStart = !1),
              (i.forceContinueAtEnd = !1),
              this.computeTone(t, e, n, i, !1, !1);
          } else {
            this.moveTonesIntoOrderedTempMatchedList(c, o);
            for (let i = 0; i < o.length; i++) {
              let a;
              null != this.tempMatchedPitchTones[h]
                ? ((a = this.tempMatchedPitchTones[h]),
                  (this.tempMatchedPitchTones[h] = null),
                  (1 == a.pitchCount && a.pitches[0] == o[i]) ||
                    (this.releaseTone(l, a), (a = this.newTone())),
                  c.pushBack(a))
                : ((a = this.newTone()), c.pushBack(a)),
                h++,
                (a.pitches[0] = o[i]),
                (a.pitchCount = 1),
                (a.chordSize = o.length),
                (a.instrumentIndex = s),
                (a.note = a.prevNote = a.nextNote = null),
                (a.atNoteStart = this.liveBassInputStarted),
                (a.forceContinueAtStart = !1),
                (a.forceContinueAtEnd = !1),
                this.computeTone(t, e, n, a, !1, !1);
            }
          }
        }
        for (; c.count() > h; ) this.releaseTone(l, c.popBack());
        this.clearTempMatchedPitchTones(h, l);
      }
      (this.liveInputStarted = !1), (this.liveBassInputStarted = !1);
    }
    adjacentPatternHasCompatibleInstrumentTransition(
      t,
      e,
      n,
      i,
      a,
      r,
      o,
      s,
      l,
      c
    ) {
      if (t.patternInstruments && -1 == i.instruments.indexOf(a)) {
        if (n.instruments.length > 1 || i.instruments.length > 1) return null;
        const t = e.instruments[i.instruments[0]];
        if (c) return t.getChord();
        const a = t.getTransition();
        return r.includeAdjacentPatterns &&
          a.includeAdjacentPatterns &&
          a.slides == r.slides
          ? t.getChord()
          : null;
      }
      return c || r.includeAdjacentPatterns ? o : null;
    }
    static adjacentNotesHaveMatchingPitches(t, e) {
      if (t.pitches.length != e.pitches.length) return !1;
      const n = t.pins[t.pins.length - 1].interval;
      for (const i of t.pitches) if (-1 == e.pitches.indexOf(i + n)) return !1;
      return !0;
    }
    moveTonesIntoOrderedTempMatchedList(t, e) {
      for (let n = 0; n < t.count(); n++) {
        const i = t.get(n),
          a = i.pitches[0] + i.lastInterval;
        for (let r = 0; r < e.length; r++)
          if (e[r] == a) {
            (this.tempMatchedPitchTones[r] = i), t.remove(n), n--;
            break;
          }
      }
      for (; t.count() > 0; ) {
        const e = t.popFront();
        for (let t = 0; t < this.tempMatchedPitchTones.length; t++)
          if (null == this.tempMatchedPitchTones[t]) {
            this.tempMatchedPitchTones[t] = e;
            break;
          }
      }
    }
    determineCurrentActiveTones(t, n, i, a) {
      const r = t.channels[n],
        o = this.channels[n],
        s = t.getPattern(n, this.bar),
        l = this.getCurrentPart(),
        c = this.tick + e.ticksPerPart * l;
      if (a && t.getChannelIsMod(n)) {
        let i = [],
          a = [],
          h = [],
          p = e.modCount;
        for (; p--; ) i.push(null), a.push(null), h.push(null);
        if (null != s && !r.muted)
          for (let t = 0; t < s.notes.length; t++)
            s.notes[t].end <= l
              ? (null == a[s.notes[t].pitches[0]] ||
                  s.notes[t].end > a[s.notes[t].pitches[0]].start) &&
                (a[s.notes[t].pitches[0]] = s.notes[t])
              : s.notes[t].start <= l && s.notes[t].end > l
              ? (i[s.notes[t].pitches[0]] = s.notes[t])
              : s.notes[t].start > l &&
                (null == h[s.notes[t].pitches[0]] ||
                  s.notes[t].start < h[s.notes[t].pitches[0]].start) &&
                (h[s.notes[t].pitches[0]] = s.notes[t]);
        let d = 0;
        const m = t.patternInstruments && null != s ? s.instruments[0] : 0,
          u = o.instruments[m],
          f = u.activeModTones;
        for (let t = 0; t < e.modCount; t++) {
          if (
            (null != i[t] &&
              (null != a[t] && a[t].end != i[t].start && (a[t] = null),
              null != h[t] && h[t].start != i[t].end && (h[t] = null)),
            null != o.singleSeamlessInstrument &&
              o.singleSeamlessInstrument != m &&
              o.singleSeamlessInstrument < o.instruments.length)
          ) {
            const t = o.instruments[o.singleSeamlessInstrument],
              e = o.instruments[m];
            for (; t.activeModTones.count() > 0; )
              e.activeModTones.pushFront(t.activeModTones.popBack());
          }
          if (((o.singleSeamlessInstrument = m), null != i[t])) {
            let n = a[t],
              r = h[t],
              o = !1,
              s = !1;
            const l = e.ticksPerPart * i[t].start == c && this.isAtStartOfTick;
            let p;
            if (f.count() <= d) (p = this.newTone()), f.pushBack(p);
            else if (l && null == n) {
              const t = f.get(d);
              t.isOnLastTick ? this.freeTone(t) : this.releaseTone(u, t),
                (p = this.newTone()),
                f.set(d, p);
            } else p = f.get(d);
            d++;
            for (let e = 0; e < i[t].pitches.length; e++)
              p.pitches[e] = i[t].pitches[e];
            (p.pitchCount = i[t].pitches.length),
              (p.chordSize = 1),
              (p.instrumentIndex = m),
              (p.note = i[t]),
              (p.noteStartPart = i[t].start),
              (p.noteEndPart = i[t].end),
              (p.prevNote = n),
              (p.nextNote = r),
              (p.prevNotePitchIndex = 0),
              (p.nextNotePitchIndex = 0),
              (p.atNoteStart = l),
              (p.passedEndOfNote = !1),
              (p.forceContinueAtStart = o),
              (p.forceContinueAtEnd = s);
          }
        }
        for (; f.count() > d; ) {
          const e = f.popBack(),
            i = t.channels[n];
          if (e.instrumentIndex < i.instruments.length && !e.isOnLastTick) {
            const t = this.channels[n].instruments[e.instrumentIndex];
            this.releaseTone(t, e);
          } else this.freeTone(e);
        }
      } else if (!t.getChannelIsMod(n)) {
        let h = null,
          p = null,
          d = null;
        if (
          a &&
          null != s &&
          !r.muted &&
          (!this.isRecording || this.liveInputChannel != n)
        ) {
          for (let t = 0; t < s.notes.length; t++)
            if (s.notes[t].end <= l) p = s.notes[t];
            else if (s.notes[t].start <= l && s.notes[t].end > l)
              h = s.notes[t];
            else if (s.notes[t].start > l) {
              d = s.notes[t];
              break;
            }
          null != h &&
            (null != p && p.end != h.start && (p = null),
            null != d && d.start != h.end && (d = null));
        }
        if (
          null != s &&
          (!t.layeredInstruments ||
            1 == r.instruments.length ||
            (t.patternInstruments && 1 == s.instruments.length))
        ) {
          const e = t.patternInstruments ? s.instruments[0] : 0;
          if (
            null != o.singleSeamlessInstrument &&
            o.singleSeamlessInstrument != e &&
            o.singleSeamlessInstrument < o.instruments.length
          ) {
            const t = o.instruments[o.singleSeamlessInstrument],
              n = o.instruments[e];
            for (; t.activeTones.count() > 0; )
              n.activeTones.pushFront(t.activeTones.popBack());
          }
          o.singleSeamlessInstrument = e;
        } else o.singleSeamlessInstrument = null;
        for (let a = 0; a < r.instruments.length; a++) {
          const m = o.instruments[a],
            u = m.activeTones;
          let f = 0;
          if (
            null != h &&
            (!t.patternInstruments || -1 != s.instruments.indexOf(a))
          ) {
            const o = r.instruments[a];
            let y = p,
              b = d;
            const g = e.partsPerBeat * t.beatsPerBar,
              v = o.getTransition(),
              k = o.getChord();
            let w = !1,
              M = !1,
              F = 0,
              S = 0;
            if (0 == h.start) {
              let e =
                null == this.prevBar ? null : t.getPattern(n, this.prevBar);
              if (null != e) {
                const n =
                  e.notes.length <= 0 ? null : e.notes[e.notes.length - 1];
                if (null != n && n.end == g) {
                  const i =
                      h.continuesLastPattern &&
                      St.adjacentNotesHaveMatchingPitches(n, h),
                    o = this.adjacentPatternHasCompatibleInstrumentTransition(
                      t,
                      r,
                      s,
                      e,
                      a,
                      v,
                      k,
                      h,
                      n,
                      i
                    );
                  null != o &&
                    ((y = n),
                    (F = o.singleTone ? 1 : y.pitches.length),
                    (w = i));
                }
              }
            } else null != y && (F = k.singleTone ? 1 : y.pitches.length);
            if (h.end == g) {
              let e =
                null == this.nextBar ? null : t.getPattern(n, this.nextBar);
              if (null != e) {
                const n = e.notes.length <= 0 ? null : e.notes[0];
                if (null != n && 0 == n.start) {
                  const i =
                      n.continuesLastPattern &&
                      St.adjacentNotesHaveMatchingPitches(h, n),
                    o = this.adjacentPatternHasCompatibleInstrumentTransition(
                      t,
                      r,
                      s,
                      e,
                      a,
                      v,
                      k,
                      h,
                      n,
                      i
                    );
                  null != o &&
                    ((b = n),
                    (S = o.singleTone ? 1 : b.pitches.length),
                    (M = i));
                }
              }
            } else null != b && (S = k.singleTone ? 1 : b.pitches.length);
            if (k.singleTone) {
              const r = e.ticksPerPart * h.start == c;
              let s;
              if (u.count() <= f) (s = this.newTone()), u.pushBack(s);
              else if (
                !r ||
                ((v.isSeamless || o.clicklessTransition || w) && null != y)
              )
                s = u.get(f);
              else {
                const t = u.get(f);
                t.isOnLastTick ? this.freeTone(t) : this.releaseTone(m, t),
                  (s = this.newTone()),
                  u.set(f, s);
              }
              f++;
              for (let t = 0; t < h.pitches.length; t++)
                s.pitches[t] = h.pitches[t];
              (s.pitchCount = h.pitches.length),
                (s.chordSize = 1),
                (s.instrumentIndex = a),
                (s.note = h),
                (s.noteStartPart = h.start),
                (s.noteEndPart = h.end),
                (s.prevNote = y),
                (s.nextNote = b),
                (s.prevNotePitchIndex = 0),
                (s.nextNotePitchIndex = 0),
                (s.atNoteStart = r),
                (s.passedEndOfNote = !1),
                (s.forceContinueAtStart = w),
                (s.forceContinueAtEnd = M),
                this.computeTone(t, n, i, s, !1, !1);
            } else {
              const r = o.getTransition();
              ((r.isSeamless && !r.slides && 0 == k.strumParts) || w) &&
                e.ticksPerPart * h.start == c &&
                null != y &&
                this.moveTonesIntoOrderedTempMatchedList(u, h.pitches);
              let s = 0;
              for (let o = 0; o < h.pitches.length; o++) {
                let p = F > o ? y : null,
                  d = h,
                  g = S > o ? b : null,
                  v = d.start + s,
                  x = !1;
                if (v > l) {
                  if (!(u.count() > o && (r.isSeamless || w) && null != p))
                    break;
                  (g = d), (d = p), (p = null), (v = d.start + s), (x = !0);
                }
                let I = d.end;
                (r.isSeamless || w) &&
                  null != g &&
                  (I = Math.min(e.partsPerBeat * this.song.beatsPerBar, I + s)),
                  ((r.continues || w) && null != p) || (s += k.strumParts);
                const P = e.ticksPerPart * v == c;
                let A;
                if (null != this.tempMatchedPitchTones[f])
                  (A = this.tempMatchedPitchTones[f]),
                    (this.tempMatchedPitchTones[f] = null),
                    u.pushBack(A);
                else if (u.count() <= f) (A = this.newTone()), u.pushBack(A);
                else if (!P || ((r.isSeamless || w) && null != p)) A = u.get(f);
                else {
                  const t = u.get(f);
                  t.isOnLastTick ? this.freeTone(t) : this.releaseTone(m, t),
                    (A = this.newTone()),
                    u.set(f, A);
                }
                f++,
                  (A.pitches[0] = d.pitches[o]),
                  (A.pitchCount = 1),
                  (A.chordSize = d.pitches.length),
                  (A.instrumentIndex = a),
                  (A.note = d),
                  (A.noteStartPart = v),
                  (A.noteEndPart = I),
                  (A.prevNote = p),
                  (A.nextNote = g),
                  (A.prevNotePitchIndex = o),
                  (A.nextNotePitchIndex = o),
                  (A.atNoteStart = P),
                  (A.passedEndOfNote = x),
                  (A.forceContinueAtStart = w && null != p),
                  (A.forceContinueAtEnd = M && null != g),
                  this.computeTone(t, n, i, A, !1, !1);
              }
            }
          }
          for (; u.count() > f; ) {
            const e = u.popBack(),
              i = t.channels[n];
            if (e.instrumentIndex < i.instruments.length && !e.isOnLastTick) {
              const t = o.instruments[e.instrumentIndex];
              this.releaseTone(t, e);
            } else this.freeTone(e);
          }
          this.clearTempMatchedPitchTones(f, m);
        }
      }
    }
    clearTempMatchedPitchTones(t, e) {
      for (let n = t; n < this.tempMatchedPitchTones.length; n++) {
        const t = this.tempMatchedPitchTones[n];
        null != t &&
          (t.isOnLastTick ? this.freeTone(t) : this.releaseTone(e, t),
          (this.tempMatchedPitchTones[n] = null));
      }
    }
    playTone(t, e, n, i) {
      const a = this.channels[t].instruments[i.instrumentIndex];
      null != a.synthesizer && a.synthesizer(this, e, n, i, a),
        i.envelopeComputer.clearEnvelopes();
    }
    playModTone(t, n, i, a, r, o, s, l) {
      const c = t.channels[n].instruments[o.instrumentIndex];
      if (null != o.note) {
        const t = this.getTicksIntoBar(),
          n = t / e.ticksPerPart,
          s = (t + 1) / e.ticksPerPart,
          l = this.tickSampleCountdown,
          h = n + (s - n) * (1 - l / i),
          p = n + (s - n) * (1 - (l - r) / i),
          d = e.ticksPerPart * h,
          m = e.ticksPerPart * p,
          u = o.note.getEndPinIndex(this.getCurrentPart()),
          f = o.note.pins[u - 1],
          y = o.note.pins[u],
          b = (o.note.start + f.time) * e.ticksPerPart,
          g = (o.note.start + y.time) * e.ticksPerPart,
          v = (d - b) / (g - b),
          k = (m - b) / (g - b);
        (o.expression = f.size + (y.size - f.size) * v),
          (o.expressionDelta = f.size + (y.size - f.size) * k - o.expression),
          St.modSynth(this, a, r, o, c);
      }
    }
    static computeChordExpression(t) {
      return 1 / (0.25 * (t - 1) + 1);
    }
    computeTone(t, n, i, a, o, s) {
      const l = Math.ceil(i),
        c = t.channels[n],
        p = this.channels[n],
        d = c.instruments[a.instrumentIndex],
        m = p.instruments[a.instrumentIndex];
      (m.awake = !0),
        (m.tonesAddedInThisTick = !0),
        m.computed || m.compute(this, d, i, l, a, n, a.instrumentIndex);
      const g = d.getTransition(),
        v = d.getChord(),
        k = v.singleTone ? 1 : St.computeChordExpression(a.chordSize),
        w = t.getChannelIsNoise(n),
        M = w ? e.noiseInterval : 1,
        F = (e.ticksPerPart * i) / this.samplesPerSecond,
        S = 1 / this.samplesPerSecond,
        x = 1 / e.partsPerBeat,
        I = this.getTicksIntoBar(),
        P = I / e.ticksPerPart,
        A = (I + 1) / e.ticksPerPart,
        T = this.getCurrentPart();
      let C = 1;
      a.specialIntervalExpressionMult = 1;
      let D = s,
        q = 0,
        E = 0,
        O = 1,
        R = 1,
        N = k,
        z = k,
        L = 16,
        H = e.keys[t.key].basePitch,
        B = 1,
        G = 48;
      if (3 == d.type)
        (B = e.spectrumBaseExpression),
          w && ((H = e.spectrumBasePitch), (B *= 2)),
          (L = e.spectrumBasePitch),
          (G = 28);
      else if (4 == d.type)
        (H = e.spectrumBasePitch), (B = e.drumsetBaseExpression), (L = H);
      else if (2 == d.type)
        (H = e.chipNoises[d.chipNoise].basePitch),
          (B = e.noiseBaseExpression),
          (L = H),
          (G = e.chipNoises[d.chipNoise].isSoft ? 24 : 60);
      else if (1 == d.type) B = e.fmBaseExpression;
      else if (0 == d.type || 9 == d.type) B = e.chipBaseExpression;
      else if (5 == d.type) B = e.harmonicsBaseExpression;
      else if (6 == d.type) B = e.pwmBaseExpression;
      else if (8 == d.type) B = e.supersawBaseExpression;
      else if (7 == d.type) B = e.pickedStringBaseExpression;
      else {
        if (10 != d.type)
          throw new Error("Unknown instrument type in computeTone.");
        (B = 1), (L = 0), (G = 1), (H = 0);
      }
      ((a.atNoteStart && !g.isSeamless && !a.forceContinueAtStart) ||
        a.freshlyAllocated) &&
        a.reset(),
        (a.freshlyAllocated = !1);
      for (let t = 0; t < e.maxPitchOrOperatorCount; t++)
        (a.phaseDeltas[t] = 0),
          (a.phaseDeltaScales[t] = 0),
          (a.operatorExpressions[t] = 0),
          (a.operatorExpressionDeltas[t] = 0);
      (a.expression = 0), (a.expressionDelta = 0);
      for (let t = 0; t < e.operatorCount; t++)
        a.operatorWaves[t] = St.getOperatorWave(
          d.operators[t].waveform,
          d.operators[t].pulseWidth
        );
      if (o) {
        const t = a.ticksSinceReleased,
          n = a.ticksSinceReleased + 1;
        q = E = a.lastInterval;
        const i = Math.abs(d.getFadeOutTicks());
        (O = St.noteSizeToVolumeMult((1 - t / i) * e.noteSizeMax)),
          (R = St.noteSizeToVolumeMult((1 - n / i) * e.noteSizeMax)),
          s && (R = 0),
          a.ticksSinceReleased + 1 >= i && (D = !0);
      } else if (null == a.note)
        (O = R = 1),
          (a.lastInterval = 0),
          (a.ticksSinceReleased = 0),
          (a.liveInputSamplesHeld += l);
      else {
        const t = a.note,
          n = a.nextNote,
          i = a.noteStartPart,
          r = a.noteEndPart,
          o = t.getEndPinIndex(T),
          s = t.pins[o - 1],
          l = t.pins[o],
          c = i * e.ticksPerPart,
          h = r * e.ticksPerPart,
          p = (t.start + s.time) * e.ticksPerPart,
          m = (t.start + l.time) * e.ticksPerPart;
        a.ticksSinceReleased = 0;
        const u = T * e.ticksPerPart + this.tick,
          f = u + 1,
          y = u - c,
          b = f - c,
          v = Math.min(1, (u - p) / (m - p)),
          k = Math.min(1, (f - p) / (m - p));
        if (
          ((O = 1),
          (R = 1),
          (q = s.interval + (l.interval - s.interval) * v),
          (E = s.interval + (l.interval - s.interval) * k),
          (a.lastInterval = E),
          (!g.isSeamless && !a.forceContinueAtEnd) || null == n)
        ) {
          const t = -d.getFadeOutTicks();
          if (t > 0) {
            const e = h - c;
            (O *= Math.min(1, (e - y) / t)),
              (R *= Math.min(1, (e - b) / t)),
              f >= c + e && (D = !0);
          }
        }
      }
      a.isOnLastTick = D;
      let V,
        $,
        W = d.noteFilter;
      if (d.noteFilterType) {
        const t = d.noteFilter;
        null == d.noteSubFilters[1] && (d.noteSubFilters[1] = new ut());
        const i = d.noteSubFilters[1];
        let r = d.noteFilterSimpleCut,
          o = d.noteFilterSimplePeak,
          s = d.noteFilterSimpleCut,
          l = d.noteFilterSimplePeak,
          c = !1;
        this.isModActive(
          e.modulators.dictionary["note filt cut"].index,
          n,
          a.instrumentIndex
        ) &&
          ((r = this.getModValue(
            e.modulators.dictionary["note filt cut"].index,
            n,
            a.instrumentIndex,
            !1
          )),
          (s = this.getModValue(
            e.modulators.dictionary["note filt cut"].index,
            n,
            a.instrumentIndex,
            !0
          )),
          (c = !0)),
          this.isModActive(
            e.modulators.dictionary["note filt peak"].index,
            n,
            a.instrumentIndex
          ) &&
            ((o = this.getModValue(
              e.modulators.dictionary["note filt peak"].index,
              n,
              a.instrumentIndex,
              !1
            )),
            (l = this.getModValue(
              e.modulators.dictionary["note filt peak"].index,
              n,
              a.instrumentIndex,
              !0
            )),
            (c = !0)),
          t.convertLegacySettingsForSynth(r, o, !c),
          i.convertLegacySettingsForSynth(s, l, !c),
          (V = t.controlPoints[0]),
          ($ = i.controlPoints[0]),
          (d.noteFilter = t),
          (d.tmpNoteFilterStart = t);
      }
      const j = a.envelopeComputer;
      let U = e.arpSpeedScale[d.envelopeSpeed];
      this.isModActive(
        e.modulators.dictionary["envelope speed"].index,
        n,
        a.instrumentIndex
      ) &&
        ((U = Math.max(
          0,
          Math.min(
            e.arpSpeedScale.length - 1,
            this.getModValue(
              e.modulators.dictionary["envelope speed"].index,
              n,
              a.instrumentIndex,
              !1
            )
          )
        )),
        (U = Number.isInteger(U)
          ? e.arpSpeedScale[U]
          : (1 - (U % 1)) * e.arpSpeedScale[Math.floor(U)] +
            (U % 1) * e.arpSpeedScale[Math.ceil(U)])),
        j.computeEnvelopes(
          d,
          T,
          m.envelopeTime,
          e.ticksPerPart * P,
          i / this.samplesPerSecond,
          a,
          U
        );
      const Q = a.envelopeComputer.envelopeStarts,
        _ = a.envelopeComputer.envelopeEnds;
      if (((d.noteFilter = W), null != a.note && g.slides)) {
        const t = a.prevNote,
          e = a.nextNote;
        if (null != t) {
          const e =
            t.pitches[a.prevNotePitchIndex] +
            t.pins[t.pins.length - 1].interval -
            a.pitches[0];
          if (
            (j.prevSlideStart && (q += e * j.prevSlideRatioStart),
            j.prevSlideEnd && (E += e * j.prevSlideRatioEnd),
            !v.singleTone)
          ) {
            const e = t.pitches.length - a.chordSize;
            j.prevSlideStart &&
              (N = St.computeChordExpression(
                a.chordSize + e * j.prevSlideRatioStart
              )),
              j.prevSlideEnd &&
                (z = St.computeChordExpression(
                  a.chordSize + e * j.prevSlideRatioEnd
                ));
          }
        }
        if (null != e) {
          const t =
            e.pitches[a.nextNotePitchIndex] -
            (a.pitches[0] + a.note.pins[a.note.pins.length - 1].interval);
          if (
            (j.nextSlideStart && (q += t * j.nextSlideRatioStart),
            j.nextSlideEnd && (E += t * j.nextSlideRatioEnd),
            !v.singleTone)
          ) {
            const t = e.pitches.length - a.chordSize;
            j.nextSlideStart &&
              (N = St.computeChordExpression(
                a.chordSize + t * j.nextSlideRatioStart
              )),
              j.nextSlideEnd &&
                (z = St.computeChordExpression(
                  a.chordSize + t * j.nextSlideRatioEnd
                ));
          }
        }
      }
      if (u(d.effects)) {
        let t = e.justIntonationSemitones[d.pitchShift] / M,
          i = 1,
          r = 1;
        this.isModActive(
          e.modulators.dictionary["pitch shift"].index,
          n,
          a.instrumentIndex
        ) &&
          ((t =
            e.justIntonationSemitones[e.justIntonationSemitones.length - 1]),
          (i =
            this.getModValue(
              e.modulators.dictionary["pitch shift"].index,
              n,
              a.instrumentIndex,
              !1
            ) / e.pitchShiftCenter),
          (r =
            this.getModValue(
              e.modulators.dictionary["pitch shift"].index,
              n,
              a.instrumentIndex,
              !0
            ) / e.pitchShiftCenter));
        (q += t * Q[14] * i), (E += t * _[14] * r);
      }
      if (
        f(d.effects) ||
        this.isModActive(
          e.modulators.dictionary["song detune"].index,
          n,
          a.instrumentIndex
        )
      ) {
        const t = Q[15],
          i = _[15];
        let r = d.detune,
          o = d.detune;
        this.isModActive(
          e.modulators.dictionary.detune.index,
          n,
          a.instrumentIndex
        ) &&
          ((r =
            this.getModValue(
              e.modulators.dictionary.detune.index,
              n,
              a.instrumentIndex,
              !1
            ) + e.detuneCenter),
          (o =
            this.getModValue(
              e.modulators.dictionary.detune.index,
              n,
              a.instrumentIndex,
              !0
            ) + e.detuneCenter)),
          this.isModActive(
            e.modulators.dictionary["song detune"].index,
            n,
            a.instrumentIndex
          ) &&
            ((r +=
              4 *
              this.getModValue(
                e.modulators.dictionary["song detune"].index,
                n,
                a.instrumentIndex,
                !1
              )),
            (o +=
              4 *
              this.getModValue(
                e.modulators.dictionary["song detune"].index,
                n,
                a.instrumentIndex,
                !0
              ))),
          (q += (St.detuneToCents(r) * t * e.pitchesPerOctave) / 1200),
          (E += (St.detuneToCents(o) * i * e.pitchesPerOctave) / 1200);
      }
      if (y(d.effects)) {
        let t, i, r, o;
        if (
          (d.vibrato == e.vibratos.length
            ? ((t = 2 * d.vibratoDelay),
              d.vibratoDelay ==
                e.modulators.dictionary["vibrato delay"].maxRawVol &&
                (t = Number.POSITIVE_INFINITY),
              (i = d.vibratoDepth),
              (r = i))
            : ((t = e.vibratos[d.vibrato].delayTicks),
              (i = e.vibratos[d.vibrato].amplitude),
              (r = i)),
          this.isModActive(
            e.modulators.dictionary["vibrato delay"].index,
            n,
            a.instrumentIndex
          ) &&
            ((t =
              2 *
              this.getModValue(
                e.modulators.dictionary["vibrato delay"].index,
                n,
                a.instrumentIndex,
                !1
              )),
            t == 2 * e.modulators.dictionary["vibrato delay"].maxRawVol &&
              (t = Number.POSITIVE_INFINITY)),
          this.isModActive(
            e.modulators.dictionary["vibrato depth"].index,
            n,
            a.instrumentIndex
          ) &&
            ((i =
              this.getModValue(
                e.modulators.dictionary["vibrato depth"].index,
                n,
                a.instrumentIndex,
                !1
              ) / 25),
            (r =
              this.getModValue(
                e.modulators.dictionary["vibrato depth"].index,
                n,
                a.instrumentIndex,
                !0
              ) / 25)),
          null != a.prevVibrato)
        )
          o = a.prevVibrato;
        else {
          if (
            ((o = i * St.getLFOAmplitude(d, F * m.vibratoTime) * Q[16]), t > 0)
          ) {
            const e = t - j.noteTicksStart;
            o *= Math.max(0, Math.min(1, 1 - e / 2));
          }
        }
        let s = St.getLFOAmplitude(d, F * m.nextVibratoTime);
        const l = _[16];
        if (10 != d.type) {
          let e = r * s * l;
          if (t > 0) {
            const n = t - j.noteTicksEnd;
            e *= Math.max(0, Math.min(1, 1 - n / 2));
          }
          (a.prevVibrato = e), (q += o), (E += e);
        }
      }
      if ((!g.isSeamless && !a.forceContinueAtStart) || null == a.prevNote) {
        const t = d.getFadeInSeconds();
        t > 0 &&
          ((O *= Math.min(1, j.noteSecondsStart / t)),
          (R *= Math.min(1, j.noteSecondsEnd / t)));
      }
      4 == d.type &&
        null == a.drumsetPitch &&
        ((a.drumsetPitch = a.pitches[0]),
        null != a.note && (a.drumsetPitch += a.note.pickMainInterval()),
        (a.drumsetPitch = Math.max(
          0,
          Math.min(e.drumCount - 1, a.drumsetPitch)
        )));
      let J = j.lowpassCutoffDecayVolumeCompensation;
      if (b(d.effects)) {
        const t = Q[1],
          e = _[1];
        if (d.noteFilterType) {
          const n = Q[17],
            i = _[17],
            r = Q[25],
            o = _[25];
          V.toCoefficients(
            St.tempFilterStartCoefficients,
            this.samplesPerSecond,
            t * n,
            r
          ),
            $.toCoefficients(
              St.tempFilterEndCoefficients,
              this.samplesPerSecond,
              e * i,
              o
            ),
            a.noteFilters.length < 1 && (a.noteFilters[0] = new K()),
            a.noteFilters[0].loadCoefficientsWithGradient(
              St.tempFilterStartCoefficients,
              St.tempFilterEndCoefficients,
              1 / l,
              0 == V.type
            ),
            (J *= V.getVolumeCompensationMult()),
            (a.noteFilterCount = 1);
        } else {
          const n =
            null != d.tmpNoteFilterStart ? d.tmpNoteFilterStart : d.noteFilter;
          for (let i = 0; i < n.controlPointCount; i++) {
            const r = Q[17 + i],
              o = _[17 + i],
              s = Q[25 + i],
              c = _[25 + i];
            let h = n.controlPoints[i];
            const p =
              null != d.tmpNoteFilterEnd &&
              null != d.tmpNoteFilterEnd.controlPoints[i]
                ? d.tmpNoteFilterEnd.controlPoints[i]
                : n.controlPoints[i];
            h.type != p.type && (h = p),
              h.toCoefficients(
                St.tempFilterStartCoefficients,
                this.samplesPerSecond,
                t * r,
                s
              ),
              p.toCoefficients(
                St.tempFilterEndCoefficients,
                this.samplesPerSecond,
                e * o,
                c
              ),
              a.noteFilters.length <= i && (a.noteFilters[i] = new K()),
              a.noteFilters[i].loadCoefficientsWithGradient(
                St.tempFilterStartCoefficients,
                St.tempFilterEndCoefficients,
                1 / l,
                0 == h.type
              ),
              (J *= h.getVolumeCompensationMult());
          }
          a.noteFilterCount = n.controlPointCount;
        }
      } else a.noteFilterCount = 0;
      if (4 == d.type) {
        const t = d.getDrumsetEnvelope(a.drumsetPitch);
        J *= kt.getLowpassCutoffDecayVolumeCompensation(t);
        let e = kt.computeEnvelope(
          t,
          j.noteSecondsStart,
          x * P,
          j.noteSizeStart
        );
        if (j.prevSlideStart) {
          e +=
            (kt.computeEnvelope(
              t,
              j.prevNoteSecondsStart,
              x * P,
              j.prevNoteSize
            ) -
              e) *
            j.prevSlideRatioStart;
        }
        if (j.nextSlideStart) {
          e +=
            (kt.computeEnvelope(t, 0, x * P, j.nextNoteSize) - e) *
            j.nextSlideRatioStart;
        }
        let n = e;
        if (0 == d.discreteEnvelope) {
          if (
            ((n = kt.computeEnvelope(
              t,
              j.noteSecondsEnd,
              x * A,
              j.noteSizeEnd
            )),
            j.prevSlideEnd)
          ) {
            n +=
              (kt.computeEnvelope(
                t,
                j.prevNoteSecondsEnd,
                x * A,
                j.prevNoteSize
              ) -
                n) *
              j.prevSlideRatioEnd;
          }
          if (j.nextSlideEnd) {
            n +=
              (kt.computeEnvelope(t, 0, x * A, j.nextNoteSize) - n) *
              j.nextSlideRatioEnd;
          }
        }
        const i = this.tempDrumSetControlPoint;
        (i.type = 0),
          (i.gain = mt.getRoundedSettingValueFromLinearGain(0.5)),
          (i.freq = mt.getRoundedSettingValueFromHz(8e3)),
          i.toCoefficients(
            St.tempFilterStartCoefficients,
            this.samplesPerSecond,
            e * (1 + e),
            1
          ),
          i.toCoefficients(
            St.tempFilterEndCoefficients,
            this.samplesPerSecond,
            n * (1 + n),
            1
          ),
          a.noteFilters.length == a.noteFilterCount &&
            (a.noteFilters[a.noteFilterCount] = new K()),
          a.noteFilters[a.noteFilterCount].loadCoefficientsWithGradient(
            St.tempFilterStartCoefficients,
            St.tempFilterEndCoefficients,
            1 / l,
            !0
          ),
          a.noteFilterCount++;
      }
      if (((J = Math.min(3, J)), 1 == d.type)) {
        let t = 1,
          i = 0,
          r = 0;
        const o = v.arpeggiates;
        if (a.pitchCount > 1 && o) {
          const t = Math.floor(m.arpTime / e.ticksPerArpeggio);
          r = a.pitches[h(a.pitchCount, d.fastTwoNoteArp, t)] - a.pitches[0];
        }
        const s = e.algorithms[d.algorithm].carrierCount;
        for (let c = 0; c < e.operatorCount; c++) {
          const h = e.algorithms[d.algorithm].associatedCarrier[c] - 1,
            p =
              a.pitches[
                o ? 0 : c < a.pitchCount ? c : h < a.pitchCount ? h : 0
              ],
            m = e.operatorFrequencies[d.operators[c].frequency].mult,
            u = e.operatorCarrierInterval[h] + r,
            f = H + (p + q) * M + u,
            y = H + (p + E) * M + u,
            b = yt.frequencyFromPitch(f),
            g = yt.frequencyFromPitch(y),
            v = e.operatorFrequencies[d.operators[c].frequency].hzOffset,
            k = m * b + v,
            w = m * g + v,
            F = Q[5 + c],
            x = _[5 + c];
          let I, P;
          1 != F || 1 != x
            ? ((I = Math.pow(2, Math.log2(k / b) * F) * b),
              (P = Math.pow(2, Math.log2(w / g) * x) * g))
            : ((I = k), (P = w)),
            (a.phaseDeltas[c] = I * S),
            (a.phaseDeltaScales[c] = Math.pow(P / I, 1 / l));
          let A = d.operators[c].amplitude,
            T = d.operators[c].amplitude;
          this.isModActive(
            e.modulators.dictionary["fm slider 1"].index + c,
            n,
            a.instrumentIndex
          ) &&
            ((A *=
              this.getModValue(
                e.modulators.dictionary["fm slider 1"].index + c,
                n,
                a.instrumentIndex,
                !1
              ) / 15),
            (T *=
              this.getModValue(
                e.modulators.dictionary["fm slider 1"].index + c,
                n,
                a.instrumentIndex,
                !0
              ) / 15));
          const C = St.operatorAmplitudeCurve(A),
            D = St.operatorAmplitudeCurve(T);
          let O =
              C * e.operatorFrequencies[d.operators[c].frequency].amplitudeSign,
            R =
              D * e.operatorFrequencies[d.operators[c].frequency].amplitudeSign;
          if (c < s) {
            let t;
            t =
              null != a.prevPitchExpressions[c]
                ? a.prevPitchExpressions[c]
                : Math.pow(2, -(f - L) / G);
            const e = Math.pow(2, -(y - L) / G);
            (a.prevPitchExpressions[c] = e), (O *= t), (R *= e), (i += D);
          } else
            (O *= 1.5 * e.sineWaveLength),
              (R *= 1.5 * e.sineWaveLength),
              (t *= 1 - Math.min(1, d.operators[c].amplitude / 15));
          if (
            ((O *= Q[9 + c]),
            (R *= _[9 + c]),
            this.isModActive(
              e.modulators.dictionary["note volume"].index,
              n,
              a.instrumentIndex
            ))
          ) {
            const t = this.getModValue(
                e.modulators.dictionary["note volume"].index,
                n,
                a.instrumentIndex,
                !1
              ),
              i = this.getModValue(
                e.modulators.dictionary["note volume"].index,
                n,
                a.instrumentIndex,
                !0
              );
            (O *=
              t <= 0
                ? (t + e.volumeRange / 2) / (e.volumeRange / 2)
                : St.instrumentVolumeToVolumeMult(t)),
              (R *=
                i <= 0
                  ? (i + e.volumeRange / 2) / (e.volumeRange / 2)
                  : St.instrumentVolumeToVolumeMult(i));
          }
          (a.operatorExpressions[c] = O),
            (a.operatorExpressionDeltas[c] = (R - O) / l);
        }
        (t *= (Math.pow(2, 2 - (1.4 * d.feedbackAmplitude) / 15) - 1) / 3),
          (t *= 1 - Math.min(1, Math.max(0, i - 1) / 2)),
          (t = 1 + 3 * t);
        const c = B * t * J * O * N * Q[0],
          p = B * t * J * R * z * _[0];
        (a.expression = c), (a.expressionDelta = (p - c) / l);
        let u = d.feedbackAmplitude,
          f = d.feedbackAmplitude;
        this.isModActive(
          e.modulators.dictionary["fm feedback"].index,
          n,
          a.instrumentIndex
        ) &&
          ((u *=
            this.getModValue(
              e.modulators.dictionary["fm feedback"].index,
              n,
              a.instrumentIndex,
              !1
            ) / 15),
          (f *=
            this.getModValue(
              e.modulators.dictionary["fm feedback"].index,
              n,
              a.instrumentIndex,
              !0
            ) / 15));
        let y = (0.3 * e.sineWaveLength * u) / 15;
        const b = (0.3 * e.sineWaveLength * f) / 15;
        let g = y * Q[13],
          k = b * _[13];
        (a.feedbackMult = g), (a.feedbackDelta = (k - g) / l);
      } else {
        const t = Math.pow(2, ((E - q) * M) / 12),
          i = Math.pow(t, 1 / l);
        let o = a.pitches[0];
        if (a.pitchCount > 1 && (v.arpeggiates || v.customInterval)) {
          const t = Math.floor(m.arpTime / e.ticksPerArpeggio);
          if (v.customInterval) {
            const e =
              a.pitches[1 + h(a.pitchCount - 1, d.fastTwoNoteArp, t)] -
              a.pitches[0];
            (C = Math.pow(2, e / 12)),
              (a.specialIntervalExpressionMult = Math.pow(2, -e / G));
          } else o = a.pitches[h(a.pitchCount, d.fastTwoNoteArp, t)];
        }
        const s = H + (o + q) * M,
          c = H + (o + E) * M;
        let p;
        p =
          null != a.prevPitchExpressions[0]
            ? a.prevPitchExpressions[0]
            : Math.pow(2, -(s - L) / G);
        const u = Math.pow(2, -(c - L) / G);
        a.prevPitchExpressions[0] = u;
        let f = B * J;
        if (
          (2 == d.type && (f *= e.chipNoises[d.chipNoise].expression),
          0 == d.type && (f *= e.chipWaves[d.chipWave].expression),
          6 == d.type)
        ) {
          const t = r(d.pulseWidth);
          let i = t,
            o = t;
          this.isModActive(
            e.modulators.dictionary["pulse width"].index,
            n,
            a.instrumentIndex
          ) &&
            ((i =
              this.getModValue(
                e.modulators.dictionary["pulse width"].index,
                n,
                a.instrumentIndex,
                !1
              ) /
              (2 * e.pulseWidthRange)),
            (o =
              this.getModValue(
                e.modulators.dictionary["pulse width"].index,
                n,
                a.instrumentIndex,
                !0
              ) /
              (2 * e.pulseWidthRange)));
          const s = i * Q[2],
            c = o * _[2];
          (a.pulseWidth = s), (a.pulseWidthDelta = (c - s) / l);
        }
        if (7 == d.type) {
          let t = d.stringSustain,
            i = d.stringSustain;
          this.isModActive(
            e.modulators.dictionary.sustain.index,
            n,
            a.instrumentIndex
          ) &&
            ((t = this.getModValue(
              e.modulators.dictionary.sustain.index,
              n,
              a.instrumentIndex,
              !1
            )),
            (i = this.getModValue(
              e.modulators.dictionary.sustain.index,
              n,
              a.instrumentIndex,
              !0
            ))),
            (a.stringSustainStart = t),
            (a.stringSustainEnd = i),
            (f *= Math.pow(2, 0.7 * (1 - t / (e.stringSustainRange - 1))));
        }
        const y = yt.frequencyFromPitch(s);
        if (0 == d.type || 9 == d.type || 5 == d.type || 7 == d.type) {
          const t = e.unisons[d.unison],
            n = 7 == d.type ? 1 : t.voices / 2;
          f *= t.expression * n;
          const r = Q[4],
            o = _[4],
            s = Math.pow(2, ((t.offset + t.spread) * r) / 12),
            c = Math.pow(2, ((t.offset + t.spread) * o) / 12),
            h = Math.pow(2, ((t.offset - t.spread) * r) / 12) * C,
            p = Math.pow(2, ((t.offset - t.spread) * o) / 12) * C;
          (a.phaseDeltas[0] = y * S * s),
            (a.phaseDeltas[1] = y * S * h),
            (a.phaseDeltaScales[0] = i * Math.pow(c / s, 1 / l)),
            (a.phaseDeltaScales[1] = i * Math.pow(p / h, 1 / l));
        } else (a.phaseDeltas[0] = y * S), (a.phaseDeltaScales[0] = i);
        let b = 1,
          k = 1;
        if (8 == d.type) {
          const i = 1 / Math.sqrt(e.supersawVoiceCount);
          let o = d.supersawDynamism / e.supersawDynamismMax,
            s = d.supersawDynamism / e.supersawDynamismMax;
          this.isModActive(
            e.modulators.dictionary.dynamism.index,
            n,
            a.instrumentIndex
          ) &&
            ((o =
              this.getModValue(
                e.modulators.dictionary.dynamism.index,
                n,
                a.instrumentIndex,
                !1
              ) / e.supersawDynamismMax),
            (s =
              this.getModValue(
                e.modulators.dictionary.dynamism.index,
                n,
                a.instrumentIndex,
                !0
              ) / e.supersawDynamismMax));
          const c = 1 - Math.pow(Math.max(0, 1 - o * Q[33]), 0.2),
            h = 1 - Math.pow(Math.max(0, 1 - s * _[33]), 0.2),
            p = Math.pow(2, Math.log2(i) * c),
            m = Math.pow(2, Math.log2(i) * h),
            u = Math.sqrt(
              (1 / Math.pow(p, 2) - 1) / (e.supersawVoiceCount - 1)
            ),
            f = Math.sqrt(
              (1 / Math.pow(m, 2) - 1) / (e.supersawVoiceCount - 1)
            );
          (a.supersawDynamism = u), (a.supersawDynamismDelta = (f - u) / l);
          const g = -1 == a.supersawDelayIndex;
          if (g) {
            let t = 0;
            for (let n = 0; n < e.supersawVoiceCount; n++)
              (a.phases[n] = t), (t += -Math.log(Math.random()));
            const n = 1 + (e.supersawVoiceCount - 1) * u;
            let i = 0;
            for (let n = 0; n < e.supersawVoiceCount; n++) {
              const e = 0 == n ? 1 : u,
                r = a.phases[n] / t;
              (a.phases[n] = r), (i += (r - 0.5) * e);
            }
            let r = 1,
              o = 0;
            for (let t = e.supersawVoiceCount - 1; t >= 0; t--) {
              const e = 1 - a.phases[t],
                s = e - o;
              if (i < 0) {
                const t = -i / n;
                if (t < s) {
                  r = o + t;
                  break;
                }
              }
              (i += s * n - (0 == t ? 1 : u)), (o = e);
            }
            for (let t = 0; t < e.supersawVoiceCount; t++) a.phases[t] += r;
            for (let t = 1; t < e.supersawVoiceCount - 1; t++) {
              const n =
                  t + Math.floor(Math.random() * (e.supersawVoiceCount - t)),
                i = a.phases[t];
              (a.phases[t] = a.phases[n]), (a.phases[n] = i);
            }
          }
          const v = d.supersawSpread / e.supersawSpreadMax;
          let w = v,
            M = v;
          this.isModActive(
            e.modulators.dictionary.spread.index,
            n,
            a.instrumentIndex
          ) &&
            ((w =
              this.getModValue(
                e.modulators.dictionary.spread.index,
                n,
                a.instrumentIndex,
                !1
              ) / e.supersawSpreadMax),
            (M =
              this.getModValue(
                e.modulators.dictionary.spread.index,
                n,
                a.instrumentIndex,
                !0
              ) / e.supersawSpreadMax));
          const F = 0.5 * (w * Q[34] + M * _[34]),
            x = Math.pow(1 - Math.sqrt(Math.max(0, 1 - F)), 1.75);
          for (let t = 0; t < e.supersawVoiceCount; t++) {
            const n =
              0 == t
                ? 0
                : Math.pow(
                    (((t + 1) >> 1) - 0.5 + 0.025 * ((2 & t) - 1)) /
                      (e.supersawVoiceCount >> 1),
                    1.1
                  ) *
                  (2 * (1 & t) - 1);
            a.supersawUnisonDetunes[t] = Math.pow(2, (x * n) / 12);
          }
          const I = d.supersawShape / e.supersawShapeMax;
          let P = I * Q[35],
            A = I * _[35];
          this.isModActive(
            e.modulators.dictionary["saw shape"].index,
            n,
            a.instrumentIndex
          ) &&
            ((P =
              this.getModValue(
                e.modulators.dictionary["saw shape"].index,
                n,
                a.instrumentIndex,
                !1
              ) / e.supersawShapeMax),
            (A =
              this.getModValue(
                e.modulators.dictionary["saw shape"].index,
                n,
                a.instrumentIndex,
                !0
              ) / e.supersawShapeMax));
          const T = P * Q[35],
            C = A * _[35];
          (a.supersawShape = T), (a.supersawShapeDelta = (C - T) / l);
          const D = r(d.pulseWidth);
          let q = D,
            E = D;
          this.isModActive(
            e.modulators.dictionary["pulse width"].index,
            n,
            a.instrumentIndex
          ) &&
            ((q =
              this.getModValue(
                e.modulators.dictionary["pulse width"].index,
                n,
                a.instrumentIndex,
                !1
              ) /
              (2 * e.pulseWidthRange)),
            (E =
              this.getModValue(
                e.modulators.dictionary["pulse width"].index,
                n,
                a.instrumentIndex,
                !0
              ) /
              (2 * e.pulseWidthRange)));
          const O = q * Q[2],
            R = E * _[2],
            N =
              null != a.supersawPrevPhaseDelta
                ? a.supersawPrevPhaseDelta
                : y * S,
            z = y * S * t;
          a.supersawPrevPhaseDelta = z;
          const L = O / N,
            H = R / z;
          (a.supersawDelayLength = L),
            (a.supersawDelayLengthDelta = (H - L) / l);
          const B = Math.ceil(Math.max(L, H)) + 2;
          if (null == a.supersawDelayLine || a.supersawDelayLine.length <= B) {
            const t = Math.ceil(
                (0.5 * this.samplesPerSecond) / yt.frequencyFromPitch(24)
              ),
              e = new Float32Array(St.fittingPowerOfTwo(Math.max(t, B)));
            if (!g && null != a.supersawDelayLine) {
              const t = (a.supersawDelayLine.length - 1) | 0,
                n = a.supersawDelayIndex;
              for (let i = 0; i < a.supersawDelayLine.length; i++)
                e[i] = a.supersawDelayLine[(n + i) & t];
            }
            (a.supersawDelayLine = e),
              (a.supersawDelayIndex = a.supersawDelayLine.length);
          } else
            g &&
              (a.supersawDelayLine.fill(0),
              (a.supersawDelayIndex = a.supersawDelayLine.length));
          const G = e.pwmBaseExpression / e.supersawBaseExpression;
          (b *=
            (1 + (G - 1) * T) /
            Math.sqrt(1 + (e.supersawVoiceCount - 1) * u * u)),
            (k *=
              (1 + (G - 1) * C) /
              Math.sqrt(1 + (e.supersawVoiceCount - 1) * f * f));
        }
        let w = f * O * N * p * Q[0] * b,
          F = f * R * z * u * _[0] * k;
        if (
          this.isModActive(
            e.modulators.dictionary["note volume"].index,
            n,
            a.instrumentIndex
          )
        ) {
          const t = this.getModValue(
              e.modulators.dictionary["note volume"].index,
              n,
              a.instrumentIndex,
              !1
            ),
            i = this.getModValue(
              e.modulators.dictionary["note volume"].index,
              n,
              a.instrumentIndex,
              !0
            );
          (w *=
            t <= 0
              ? (t + e.volumeRange / 2) / (e.volumeRange / 2)
              : St.instrumentVolumeToVolumeMult(t)),
            (F *=
              i <= 0
                ? (i + e.volumeRange / 2) / (e.volumeRange / 2)
                : St.instrumentVolumeToVolumeMult(i));
        }
        if (
          ((a.expression = w), (a.expressionDelta = (F - w) / l), 7 == d.type)
        ) {
          let t;
          if (null != a.prevStringDecay) t = a.prevStringDecay;
          else {
            const n = a.envelopeComputer.envelopeStarts[3];
            t =
              1 -
              Math.min(
                1,
                (n * a.stringSustainStart) / (e.stringSustainRange - 1)
              );
          }
          const n = a.envelopeComputer.envelopeEnds[3];
          let i =
            1 -
            Math.min(1, (n * a.stringSustainEnd) / (e.stringSustainRange - 1));
          a.prevStringDecay = i;
          const r = e.unisons[d.unison];
          for (let t = a.pickedStrings.length; t < r.voices; t++)
            a.pickedStrings[t] = new vt();
          if (a.atNoteStart && !g.continues && !a.forceContinueAtStart)
            for (const t of a.pickedStrings) t.delayIndex = -1;
          for (let e = 0; e < r.voices; e++)
            a.pickedStrings[e].update(
              this,
              m,
              a,
              e,
              l,
              t,
              i,
              d.stringSustainType
            );
        }
      }
    }
    static getLFOAmplitude(t, n) {
      let i = 0;
      for (const a of e.vibratoTypes[t.vibratoType].periodsSeconds)
        i += Math.sin((2 * Math.PI * n) / a);
      return i;
    }
    static getInstrumentSynthFunction(t) {
      if (1 == t.type) {
        const n = t.algorithm + "_" + t.feedbackType;
        if (null == St.fmSynthFunctionCache[n]) {
          const i = [];
          for (const n of St.fmSourceTemplate)
            if (-1 != n.indexOf("// CARRIER OUTPUTS")) {
              const a = [];
              for (let n = 0; n < e.algorithms[t.algorithm].carrierCount; n++)
                a.push("operator" + n + "Scaled");
              i.push(n.replace("/*operator#Scaled*/", a.join(" + ")));
            } else if (-1 != n.indexOf("// INSERT OPERATOR COMPUTATION HERE"))
              for (let n = e.operatorCount - 1; n >= 0; n--)
                for (const a of St.operatorSourceTemplate)
                  if (-1 != a.indexOf("/* + operator@Scaled*/")) {
                    let r = "";
                    for (const i of e.algorithms[t.algorithm].modulatedBy[n])
                      r += " + operator" + (i - 1) + "Scaled";
                    const o = e.feedbacks[t.feedbackType].indices[n];
                    if (o.length > 0) {
                      r += " + feedbackMult * (";
                      const t = [];
                      for (const e of o)
                        t.push("operator" + (e - 1) + "Output");
                      r += t.join(" + ") + ")";
                    }
                    i.push(
                      a
                        .replace(/\#/g, n + "")
                        .replace("/* + operator@Scaled*/", r)
                    );
                  } else i.push(a.replace(/\#/g, n + ""));
            else if (-1 != n.indexOf("#"))
              for (let t = 0; t < e.operatorCount; t++)
                i.push(n.replace(/\#/g, t + ""));
            else i.push(n);
          const a =
            "return (synth, bufferIndex, roundedSamplesPerTick, tone, instrument) => {" +
            i.join("\n") +
            "}";
          St.fmSynthFunctionCache[n] = new Function("Config", "Synth", a)(
            e,
            St
          );
        }
        return St.fmSynthFunctionCache[n];
      }
      if (0 == t.type) return St.chipSynth;
      if (9 == t.type) return St.chipSynth;
      if (5 == t.type) return St.harmonicsSynth;
      if (6 == t.type) return St.pulseWidthSynth;
      if (8 == t.type) return St.supersawSynth;
      if (7 == t.type) return St.pickedStringSynth;
      if (2 == t.type) return St.noiseSynth;
      if (3 == t.type) return St.spectrumSynth;
      if (4 == t.type) return St.drumsetSynth;
      if (10 == t.type) return St.modSynth;
      throw new Error("Unrecognized instrument type: " + t.type);
    }
    static chipSynth(t, e, n, i, a) {
      const r = g(a.effects) && a.aliases,
        o = t.tempMonoInstrumentSampleBuffer,
        s = a.wave,
        l = a.volumeScale,
        c = r && 9 == a.type ? s.length : s.length - 1,
        h = i.specialIntervalExpressionMult * a.unison.sign;
      1 != a.unison.voices ||
        a.chord.customInterval ||
        (i.phases[1] = i.phases[0]);
      let p = i.phaseDeltas[0] * c,
        d = i.phaseDeltas[1] * c;
      const m = +i.phaseDeltaScales[0],
        u = +i.phaseDeltaScales[1];
      let f = +i.expression;
      const y = +i.expressionDelta;
      let b = (i.phases[0] % 1) * c,
        v = (i.phases[1] % 1) * c;
      const k = i.noteFilters,
        w = 0 | i.noteFilterCount;
      let M = +i.initialNoteFilterInput1,
        F = +i.initialNoteFilterInput2;
      const S = St.applyFilters;
      let x = 0,
        I = 0;
      if (!r) {
        const t = 0 | b,
          e = 0 | v,
          n = t % c,
          i = e % c,
          a = b - t,
          r = v - e;
        (x = +s[n]),
          (I = +s[i]),
          (x += (s[n + 1] - x) * a),
          (I += (s[i + 1] - I) * r);
      }
      const P = e + n;
      for (let t = e; t < P; t++) {
        let e, n, i;
        if (((b += p), (v += d), r))
          (e = s[(0 | b) % c]), (n = s[(0 | v) % c]), (i = e + n);
        else {
          const t = 0 | b,
            a = 0 | v,
            r = t % c,
            o = a % c;
          let l = s[r],
            m = s[o];
          const u = b - t,
            f = v - a;
          (l += (s[r + 1] - l) * u),
            (m += (s[o + 1] - m) * f),
            (e = (l - x) / p),
            (n = (m - I) / d),
            (x = l),
            (I = m),
            (i = e + n * h);
        }
        const a = S(i * l, M, F, w, k);
        (F = M), (M = i * l), (p *= m), (d *= u);
        const g = a * f;
        (f += y), (o[t] += g);
      }
      (i.phases[0] = b / c),
        (i.phases[1] = v / c),
        (i.phaseDeltas[0] = p / c),
        (i.phaseDeltas[1] = d / c),
        (i.expression = f),
        t.sanitizeFilters(k),
        (i.initialNoteFilterInput1 = M),
        (i.initialNoteFilterInput2 = F);
    }
    static harmonicsSynth(t, e, n, i, a) {
      const r = t.tempMonoInstrumentSampleBuffer,
        o = a.wave,
        s = o.length - 1,
        l = i.specialIntervalExpressionMult * a.unison.sign;
      1 != a.unison.voices ||
        a.chord.customInterval ||
        (i.phases[1] = i.phases[0]);
      let c = i.phaseDeltas[0] * s,
        h = i.phaseDeltas[1] * s;
      const p = +i.phaseDeltaScales[0],
        d = +i.phaseDeltaScales[1];
      let m = +i.expression;
      const u = +i.expressionDelta;
      let f = (i.phases[0] % 1) * s,
        y = (i.phases[1] % 1) * s;
      const b = i.noteFilters,
        g = 0 | i.noteFilterCount;
      let v = +i.initialNoteFilterInput1,
        k = +i.initialNoteFilterInput2;
      const w = St.applyFilters,
        M = 0 | f,
        F = 0 | y,
        S = M % s,
        x = F % s,
        I = f - M,
        P = y - F;
      let A = +o[S],
        T = +o[x];
      (A += (o[S + 1] - A) * I), (T += (o[x + 1] - T) * P);
      const C = e + n;
      for (let t = e; t < C; t++) {
        (f += c), (y += h);
        const e = 0 | f,
          n = 0 | y,
          i = e % s,
          a = n % s;
        let M = o[i],
          F = o[a];
        const S = f - e,
          x = y - n;
        (M += (o[i + 1] - M) * S), (F += (o[a + 1] - F) * x);
        const I = (M - A) / c,
          P = (F - T) / h;
        (A = M), (T = F);
        const C = I + P * l,
          D = w(C, v, k, g, b);
        (k = v), (v = C), (c *= p), (h *= d);
        const q = D * m;
        (m += u), (r[t] += q);
      }
      (i.phases[0] = f / s),
        (i.phases[1] = y / s),
        (i.phaseDeltas[0] = c / s),
        (i.phaseDeltas[1] = h / s),
        (i.expression = m),
        t.sanitizeFilters(b),
        (i.initialNoteFilterInput1 = v),
        (i.initialNoteFilterInput2 = k);
    }
    static pickedStringSynth(t, n, i, a, r) {
      const o = r.unison.voices;
      let s = St.pickedStringFunctionCache[o];
      if (null == s) {
        let t =
          "return (synth, bufferIndex, runLength, tone, instrumentState) => {";
        t +=
          "\n\t\t\t\tconst Config = beepbox.Config;\n\t\t\t\tconst Synth = beepbox.Synth;\n\t\t\t\tconst data = synth.tempMonoInstrumentSampleBuffer;\n\t\t\t\t\n\t\t\t\tlet pickedString# = tone.pickedStrings[#];\n\t\t\t\tlet allPassSample# = +pickedString#.allPassSample;\n\t\t\t\tlet allPassPrevInput# = +pickedString#.allPassPrevInput;\n\t\t\t\tlet sustainFilterSample# = +pickedString#.sustainFilterSample;\n\t\t\t\tlet sustainFilterPrevOutput2# = +pickedString#.sustainFilterPrevOutput2;\n\t\t\t\tlet sustainFilterPrevInput1# = +pickedString#.sustainFilterPrevInput1;\n\t\t\t\tlet sustainFilterPrevInput2# = +pickedString#.sustainFilterPrevInput2;\n\t\t\t\tlet fractionalDelaySample# = +pickedString#.fractionalDelaySample;\n\t\t\t\tconst delayLine# = pickedString#.delayLine;\n\t\t\t\tconst delayBufferMask# = (delayLine#.length - 1) >> 0;\n\t\t\t\tlet delayIndex# = pickedString#.delayIndex|0;\n\t\t\t\tdelayIndex# = (delayIndex# & delayBufferMask#) + delayLine#.length;\n\t\t\t\tlet delayLength# = +pickedString#.prevDelayLength;\n\t\t\t\tconst delayLengthDelta# = +pickedString#.delayLengthDelta;\n\t\t\t\tlet allPassG# = +pickedString#.allPassG;\n\t\t\t\tlet sustainFilterA1# = +pickedString#.sustainFilterA1;\n\t\t\t\tlet sustainFilterA2# = +pickedString#.sustainFilterA2;\n\t\t\t\tlet sustainFilterB0# = +pickedString#.sustainFilterB0;\n\t\t\t\tlet sustainFilterB1# = +pickedString#.sustainFilterB1;\n\t\t\t\tlet sustainFilterB2# = +pickedString#.sustainFilterB2;\n\t\t\t\tconst allPassGDelta# = +pickedString#.allPassGDelta;\n\t\t\t\tconst sustainFilterA1Delta# = +pickedString#.sustainFilterA1Delta;\n\t\t\t\tconst sustainFilterA2Delta# = +pickedString#.sustainFilterA2Delta;\n\t\t\t\tconst sustainFilterB0Delta# = +pickedString#.sustainFilterB0Delta;\n\t\t\t\tconst sustainFilterB1Delta# = +pickedString#.sustainFilterB1Delta;\n\t\t\t\tconst sustainFilterB2Delta# = +pickedString#.sustainFilterB2Delta;\n\t\t\t\t\n\t\t\t\tlet expression = +tone.expression;\n\t\t\t\tconst expressionDelta = +tone.expressionDelta;\n\t\t\t\t\n\t\t\t\tconst unisonSign = tone.specialIntervalExpressionMult * instrumentState.unison.sign;\n\t\t\t\tconst delayResetOffset# = pickedString#.delayResetOffset|0;\n\t\t\t\t\n\t\t\t\tconst filters = tone.noteFilters;\n\t\t\t\tconst filterCount = tone.noteFilterCount|0;\n\t\t\t\tlet initialFilterInput1 = +tone.initialNoteFilterInput1;\n\t\t\t\tlet initialFilterInput2 = +tone.initialNoteFilterInput2;\n\t\t\t\tconst applyFilters = Synth.applyFilters;\n\t\t\t\t\n\t\t\t\tconst stopIndex = bufferIndex + runLength;\n\t\t\t\tfor (let sampleIndex = bufferIndex; sampleIndex < stopIndex; sampleIndex++) {\n\t\t\t\t\tconst targetSampleTime# = delayIndex# - delayLength#;\n\t\t\t\t\tconst lowerIndex# = (targetSampleTime# + 0.125) | 0; // Offset to improve stability of all-pass filter.\n\t\t\t\t\tconst upperIndex# = lowerIndex# + 1;\n\t\t\t\t\tconst fractionalDelay# = upperIndex# - targetSampleTime#;\n\t\t\t\t\tconst fractionalDelayG# = (1.0 - fractionalDelay#) / (1.0 + fractionalDelay#); // Inlined version of FilterCoefficients.prototype.allPass1stOrderFractionalDelay\n\t\t\t\t\tconst prevInput# = delayLine#[lowerIndex# & delayBufferMask#];\n\t\t\t\t\tconst input# = delayLine#[upperIndex# & delayBufferMask#];\n\t\t\t\t\tfractionalDelaySample# = fractionalDelayG# * input# + prevInput# - fractionalDelayG# * fractionalDelaySample#;\n\t\t\t\t\t\n\t\t\t\t\tallPassSample# = fractionalDelaySample# * allPassG# + allPassPrevInput# - allPassG# * allPassSample#;\n\t\t\t\t\tallPassPrevInput# = fractionalDelaySample#;\n\t\t\t\t\t\n\t\t\t\t\tconst sustainFilterPrevOutput1# = sustainFilterSample#;\n\t\t\t\t\tsustainFilterSample# = sustainFilterB0# * allPassSample# + sustainFilterB1# * sustainFilterPrevInput1# + sustainFilterB2# * sustainFilterPrevInput2# - sustainFilterA1# * sustainFilterSample# - sustainFilterA2# * sustainFilterPrevOutput2#;\n\t\t\t\t\tsustainFilterPrevOutput2# = sustainFilterPrevOutput1#;\n\t\t\t\t\tsustainFilterPrevInput2# = sustainFilterPrevInput1#;\n\t\t\t\t\tsustainFilterPrevInput1# = allPassSample#;\n\t\t\t\t\t\n\t\t\t\t\tdelayLine#[delayIndex# & delayBufferMask#] += sustainFilterSample#;\n\t\t\t\t\tdelayLine#[(delayIndex# + delayResetOffset#) & delayBufferMask#] = 0.0;\n\t\t\t\t\tdelayIndex#++;\n\t\t\t\t\t\n\t\t\t\t\tconst inputSample = (";
        const n = [];
        for (let t = 0; t < o; t++)
          n.push("fractionalDelaySample" + t + (1 == t ? " * unisonSign" : ""));
        (t += n.join(" + ")),
          (t +=
            ") * expression;\n\t\t\t\t\tconst sample = applyFilters(inputSample, initialFilterInput1, initialFilterInput2, filterCount, filters);\n\t\t\t\t\tinitialFilterInput2 = initialFilterInput1;\n\t\t\t\t\tinitialFilterInput1 = inputSample;\n\t\t\t\t\tdata[sampleIndex] += sample;\n\t\t\t\t\t\n\t\t\t\t\texpression += expressionDelta;\n\t\t\t\t\tdelayLength# += delayLengthDelta#;\n\t\t\t\t\tallPassG# += allPassGDelta#;\n\t\t\t\t\tsustainFilterA1# += sustainFilterA1Delta#;\n\t\t\t\t\tsustainFilterA2# += sustainFilterA2Delta#;\n\t\t\t\t\tsustainFilterB0# += sustainFilterB0Delta#;\n\t\t\t\t\tsustainFilterB1# += sustainFilterB1Delta#;\n\t\t\t\t\tsustainFilterB2# += sustainFilterB2Delta#;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t// Avoid persistent denormal or NaN values in the delay buffers and filter history.\n\t\t\t\tconst epsilon = (1.0e-24);\n\t\t\t\tif (!Number.isFinite(allPassSample#) || Math.abs(allPassSample#) < epsilon) allPassSample# = 0.0;\n\t\t\t\tif (!Number.isFinite(allPassPrevInput#) || Math.abs(allPassPrevInput#) < epsilon) allPassPrevInput# = 0.0;\n\t\t\t\tif (!Number.isFinite(sustainFilterSample#) || Math.abs(sustainFilterSample#) < epsilon) sustainFilterSample# = 0.0;\n\t\t\t\tif (!Number.isFinite(sustainFilterPrevOutput2#) || Math.abs(sustainFilterPrevOutput2#) < epsilon) sustainFilterPrevOutput2# = 0.0;\n\t\t\t\tif (!Number.isFinite(sustainFilterPrevInput1#) || Math.abs(sustainFilterPrevInput1#) < epsilon) sustainFilterPrevInput1# = 0.0;\n\t\t\t\tif (!Number.isFinite(sustainFilterPrevInput2#) || Math.abs(sustainFilterPrevInput2#) < epsilon) sustainFilterPrevInput2# = 0.0;\n\t\t\t\tif (!Number.isFinite(fractionalDelaySample#) || Math.abs(fractionalDelaySample#) < epsilon) fractionalDelaySample# = 0.0;\n\t\t\t\tpickedString#.allPassSample = allPassSample#;\n\t\t\t\tpickedString#.allPassPrevInput = allPassPrevInput#;\n\t\t\t\tpickedString#.sustainFilterSample = sustainFilterSample#;\n\t\t\t\tpickedString#.sustainFilterPrevOutput2 = sustainFilterPrevOutput2#;\n\t\t\t\tpickedString#.sustainFilterPrevInput1 = sustainFilterPrevInput1#;\n\t\t\t\tpickedString#.sustainFilterPrevInput2 = sustainFilterPrevInput2#;\n\t\t\t\tpickedString#.fractionalDelaySample = fractionalDelaySample#;\n\t\t\t\tpickedString#.delayIndex = delayIndex#;\n\t\t\t\tpickedString#.prevDelayLength = delayLength#;\n\t\t\t\tpickedString#.allPassG = allPassG#;\n\t\t\t\tpickedString#.sustainFilterA1 = sustainFilterA1#;\n\t\t\t\tpickedString#.sustainFilterA2 = sustainFilterA2#;\n\t\t\t\tpickedString#.sustainFilterB0 = sustainFilterB0#;\n\t\t\t\tpickedString#.sustainFilterB1 = sustainFilterB1#;\n\t\t\t\tpickedString#.sustainFilterB2 = sustainFilterB2#;\n\t\t\t\t\n\t\t\t\ttone.expression = expression;\n\t\t\t\t\n\t\t\t\tsynth.sanitizeFilters(filters);\n\t\t\t\ttone.initialNoteFilterInput1 = initialFilterInput1;\n\t\t\t\ttone.initialNoteFilterInput2 = initialFilterInput2;\n\t\t\t}"),
          (t = t.replace(/^.*\#.*$/gm, (t) => {
            const e = [];
            for (let n = 0; n < o; n++) e.push(t.replace(/\#/g, String(n)));
            return e.join("\n");
          })),
          (s = new Function("Config", "Synth", t)(e, St)),
          (St.pickedStringFunctionCache[o] = s);
      }
      s(t, n, i, a, r);
    }
    static effectsSynth(t, n, i, a, r, o) {
      const s = g(o.effects),
        l = v(o.effects),
        c = o.eqFilterCount > 0,
        h = k(o.effects),
        p = w(o.effects),
        d = M(o.effects),
        m = F(o.effects);
      let u = 0;
      s && (u |= 1),
        (u <<= 1),
        l && (u |= 1),
        (u <<= 1),
        c && (u |= 1),
        (u <<= 1),
        h && (u |= 1),
        (u <<= 1),
        p && (u |= 1),
        (u <<= 1),
        d && (u |= 1),
        (u <<= 1),
        m && (u |= 1);
      let f = St.effectsFunctionCache[u];
      if (null == f) {
        let t =
          "return (synth, outputDataL, outputDataR, bufferIndex, runLength, instrumentState) => {";
        const n = p || m || d;
        (t +=
          "\n\t\t\t\tconst tempMonoInstrumentSampleBuffer = synth.tempMonoInstrumentSampleBuffer;\n\t\t\t\t\n\t\t\t\tlet mixVolume = +instrumentState.mixVolume;\n\t\t\t\tconst mixVolumeDelta = +instrumentState.mixVolumeDelta;"),
          n &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tlet delayInputMult = +instrumentState.delayInputMult;\n\t\t\t\tconst delayInputMultDelta = +instrumentState.delayInputMultDelta;"),
          s &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tconst distortionBaseVolume = +Config.distortionBaseVolume;\n\t\t\t\tlet distortion = instrumentState.distortion;\n\t\t\t\tconst distortionDelta = instrumentState.distortionDelta;\n\t\t\t\tlet distortionDrive = instrumentState.distortionDrive;\n\t\t\t\tconst distortionDriveDelta = instrumentState.distortionDriveDelta;\n\t\t\t\tconst distortionFractionalResolution = 4.0;\n\t\t\t\tconst distortionOversampleCompensation = distortionBaseVolume / distortionFractionalResolution;\n\t\t\t\tconst distortionFractionalDelay1 = 1.0 / distortionFractionalResolution;\n\t\t\t\tconst distortionFractionalDelay2 = 2.0 / distortionFractionalResolution;\n\t\t\t\tconst distortionFractionalDelay3 = 3.0 / distortionFractionalResolution;\n\t\t\t\tconst distortionFractionalDelayG1 = (1.0 - distortionFractionalDelay1) / (1.0 + distortionFractionalDelay1); // Inlined version of FilterCoefficients.prototype.allPass1stOrderFractionalDelay\n\t\t\t\tconst distortionFractionalDelayG2 = (1.0 - distortionFractionalDelay2) / (1.0 + distortionFractionalDelay2); // Inlined version of FilterCoefficients.prototype.allPass1stOrderFractionalDelay\n\t\t\t\tconst distortionFractionalDelayG3 = (1.0 - distortionFractionalDelay3) / (1.0 + distortionFractionalDelay3); // Inlined version of FilterCoefficients.prototype.allPass1stOrderFractionalDelay\n\t\t\t\tconst distortionNextOutputWeight1 = Math.cos(Math.PI * distortionFractionalDelay1) * 0.5 + 0.5;\n\t\t\t\tconst distortionNextOutputWeight2 = Math.cos(Math.PI * distortionFractionalDelay2) * 0.5 + 0.5;\n\t\t\t\tconst distortionNextOutputWeight3 = Math.cos(Math.PI * distortionFractionalDelay3) * 0.5 + 0.5;\n\t\t\t\tconst distortionPrevOutputWeight1 = 1.0 - distortionNextOutputWeight1;\n\t\t\t\tconst distortionPrevOutputWeight2 = 1.0 - distortionNextOutputWeight2;\n\t\t\t\tconst distortionPrevOutputWeight3 = 1.0 - distortionNextOutputWeight3;\n\t\t\t\t\n\t\t\t\tlet distortionFractionalInput1 = +instrumentState.distortionFractionalInput1;\n\t\t\t\tlet distortionFractionalInput2 = +instrumentState.distortionFractionalInput2;\n\t\t\t\tlet distortionFractionalInput3 = +instrumentState.distortionFractionalInput3;\n\t\t\t\tlet distortionPrevInput = +instrumentState.distortionPrevInput;\n\t\t\t\tlet distortionNextOutput = +instrumentState.distortionNextOutput;"),
          l &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tlet bitcrusherPrevInput = +instrumentState.bitcrusherPrevInput;\n\t\t\t\tlet bitcrusherCurrentOutput = +instrumentState.bitcrusherCurrentOutput;\n\t\t\t\tlet bitcrusherPhase = +instrumentState.bitcrusherPhase;\n\t\t\t\tlet bitcrusherPhaseDelta = +instrumentState.bitcrusherPhaseDelta;\n\t\t\t\tconst bitcrusherPhaseDeltaScale = +instrumentState.bitcrusherPhaseDeltaScale;\n\t\t\t\tlet bitcrusherScale = +instrumentState.bitcrusherScale;\n\t\t\t\tconst bitcrusherScaleScale = +instrumentState.bitcrusherScaleScale;\n\t\t\t\tlet bitcrusherFoldLevel = +instrumentState.bitcrusherFoldLevel;\n\t\t\t\tconst bitcrusherFoldLevelScale = +instrumentState.bitcrusherFoldLevelScale;"),
          c &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tlet filters = instrumentState.eqFilters;\n\t\t\t\tconst filterCount = instrumentState.eqFilterCount|0;\n\t\t\t\tlet initialFilterInput1 = +instrumentState.initialEqFilterInput1;\n\t\t\t\tlet initialFilterInput2 = +instrumentState.initialEqFilterInput2;\n\t\t\t\tconst applyFilters = Synth.applyFilters;"),
          (t +=
            "\n\t\t\t\t\n\t\t\t\tlet eqFilterVolume = +instrumentState.eqFilterVolume;\n\t\t\t\tconst eqFilterVolumeDelta = +instrumentState.eqFilterVolumeDelta;"),
          h &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tconst panningMask = synth.panningDelayBufferMask >>> 0;\n\t\t\t\tconst panningDelayLine = instrumentState.panningDelayLine;\n\t\t\t\tlet panningDelayPos = instrumentState.panningDelayPos & panningMask;\n\t\t\t\tlet   panningVolumeL      = +instrumentState.panningVolumeL;\n\t\t\t\tlet   panningVolumeR      = +instrumentState.panningVolumeR;\n\t\t\t\tconst panningVolumeDeltaL = +instrumentState.panningVolumeDeltaL;\n\t\t\t\tconst panningVolumeDeltaR = +instrumentState.panningVolumeDeltaR;\n\t\t\t\tlet   panningOffsetL      = +instrumentState.panningOffsetL;\n\t\t\t\tlet   panningOffsetR      = +instrumentState.panningOffsetR;\n\t\t\t\tconst panningOffsetDeltaL = 1.0 - instrumentState.panningOffsetDeltaL;\n\t\t\t\tconst panningOffsetDeltaR = 1.0 - instrumentState.panningOffsetDeltaR;"),
          p &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tconst chorusMask = synth.chorusDelayBufferMask >>> 0;\n\t\t\t\tconst chorusDelayLineL = instrumentState.chorusDelayLineL;\n\t\t\t\tconst chorusDelayLineR = instrumentState.chorusDelayLineR;\n\t\t\t\tinstrumentState.chorusDelayLineDirty = true;\n\t\t\t\tlet chorusDelayPos = instrumentState.chorusDelayPos & chorusMask;\n\t\t\t\t\n\t\t\t\tlet chorusVoiceMult = +instrumentState.chorusVoiceMult;\n\t\t\t\tconst chorusVoiceMultDelta = +instrumentState.chorusVoiceMultDelta;\n\t\t\t\tlet chorusCombinedMult = +instrumentState.chorusCombinedMult;\n\t\t\t\tconst chorusCombinedMultDelta = +instrumentState.chorusCombinedMultDelta;\n\t\t\t\t\n\t\t\t\tconst chorusDuration = +beepbox.Config.chorusPeriodSeconds;\n\t\t\t\tconst chorusAngle = Math.PI * 2.0 / (chorusDuration * synth.samplesPerSecond);\n\t\t\t\tconst chorusRange = synth.samplesPerSecond * beepbox.Config.chorusDelayRange;\n\t\t\t\tconst chorusOffset0 = synth.chorusDelayBufferSize - beepbox.Config.chorusDelayOffsets[0][0] * chorusRange;\n\t\t\t\tconst chorusOffset1 = synth.chorusDelayBufferSize - beepbox.Config.chorusDelayOffsets[0][1] * chorusRange;\n\t\t\t\tconst chorusOffset2 = synth.chorusDelayBufferSize - beepbox.Config.chorusDelayOffsets[0][2] * chorusRange;\n\t\t\t\tconst chorusOffset3 = synth.chorusDelayBufferSize - beepbox.Config.chorusDelayOffsets[1][0] * chorusRange;\n\t\t\t\tconst chorusOffset4 = synth.chorusDelayBufferSize - beepbox.Config.chorusDelayOffsets[1][1] * chorusRange;\n\t\t\t\tconst chorusOffset5 = synth.chorusDelayBufferSize - beepbox.Config.chorusDelayOffsets[1][2] * chorusRange;\n\t\t\t\tlet chorusPhase = instrumentState.chorusPhase % (Math.PI * 2.0);\n\t\t\t\tlet chorusTap0Index = chorusDelayPos + chorusOffset0 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[0][0]);\n\t\t\t\tlet chorusTap1Index = chorusDelayPos + chorusOffset1 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[0][1]);\n\t\t\t\tlet chorusTap2Index = chorusDelayPos + chorusOffset2 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[0][2]);\n\t\t\t\tlet chorusTap3Index = chorusDelayPos + chorusOffset3 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[1][0]);\n\t\t\t\tlet chorusTap4Index = chorusDelayPos + chorusOffset4 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[1][1]);\n\t\t\t\tlet chorusTap5Index = chorusDelayPos + chorusOffset5 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[1][2]);\n\t\t\t\tchorusPhase += chorusAngle * runLength;\n\t\t\t\tconst chorusTap0End = chorusDelayPos + chorusOffset0 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[0][0]) + runLength;\n\t\t\t\tconst chorusTap1End = chorusDelayPos + chorusOffset1 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[0][1]) + runLength;\n\t\t\t\tconst chorusTap2End = chorusDelayPos + chorusOffset2 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[0][2]) + runLength;\n\t\t\t\tconst chorusTap3End = chorusDelayPos + chorusOffset3 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[1][0]) + runLength;\n\t\t\t\tconst chorusTap4End = chorusDelayPos + chorusOffset4 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[1][1]) + runLength;\n\t\t\t\tconst chorusTap5End = chorusDelayPos + chorusOffset5 - chorusRange * Math.sin(chorusPhase + beepbox.Config.chorusPhaseOffsets[1][2]) + runLength;\n\t\t\t\tconst chorusTap0Delta = (chorusTap0End - chorusTap0Index) / runLength;\n\t\t\t\tconst chorusTap1Delta = (chorusTap1End - chorusTap1Index) / runLength;\n\t\t\t\tconst chorusTap2Delta = (chorusTap2End - chorusTap2Index) / runLength;\n\t\t\t\tconst chorusTap3Delta = (chorusTap3End - chorusTap3Index) / runLength;\n\t\t\t\tconst chorusTap4Delta = (chorusTap4End - chorusTap4Index) / runLength;\n\t\t\t\tconst chorusTap5Delta = (chorusTap5End - chorusTap5Index) / runLength;"),
          d &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tlet echoMult = +instrumentState.echoMult;\n\t\t\t\tconst echoMultDelta = +instrumentState.echoMultDelta;\n\t\t\t\t\n\t\t\t\tconst echoDelayLineL = instrumentState.echoDelayLineL;\n\t\t\t\tconst echoDelayLineR = instrumentState.echoDelayLineR;\n\t\t\t\tconst echoMask = (echoDelayLineL.length - 1) >>> 0;\n\t\t\t\tinstrumentState.echoDelayLineDirty = true;\n\t\t\t\t\n\t\t\t\tlet echoDelayPos = instrumentState.echoDelayPos & echoMask;\n\t\t\t\tconst echoDelayOffsetStart = (echoDelayLineL.length - instrumentState.echoDelayOffsetStart) & echoMask;\n\t\t\t\tconst echoDelayOffsetEnd   = (echoDelayLineL.length - instrumentState.echoDelayOffsetEnd) & echoMask;\n\t\t\t\tlet echoDelayOffsetRatio = +instrumentState.echoDelayOffsetRatio;\n\t\t\t\tconst echoDelayOffsetRatioDelta = +instrumentState.echoDelayOffsetRatioDelta;\n\t\t\t\t\n\t\t\t\tconst echoShelfA1 = +instrumentState.echoShelfA1;\n\t\t\t\tconst echoShelfB0 = +instrumentState.echoShelfB0;\n\t\t\t\tconst echoShelfB1 = +instrumentState.echoShelfB1;\n\t\t\t\tlet echoShelfSampleL = +instrumentState.echoShelfSampleL;\n\t\t\t\tlet echoShelfSampleR = +instrumentState.echoShelfSampleR;\n\t\t\t\tlet echoShelfPrevInputL = +instrumentState.echoShelfPrevInputL;\n\t\t\t\tlet echoShelfPrevInputR = +instrumentState.echoShelfPrevInputR;"),
          m &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tconst reverbMask = Config.reverbDelayBufferMask >>> 0; //TODO: Dynamic reverb buffer size.\n\t\t\t\tconst reverbDelayLine = instrumentState.reverbDelayLine;\n\t\t\t\tinstrumentState.reverbDelayLineDirty = true;\n\t\t\t\tlet reverbDelayPos = instrumentState.reverbDelayPos & reverbMask;\n\t\t\t\t\n\t\t\t\tlet reverb = +instrumentState.reverbMult;\n\t\t\t\tconst reverbDelta = +instrumentState.reverbMultDelta;\n\t\t\t\t\n\t\t\t\tconst reverbShelfA1 = +instrumentState.reverbShelfA1;\n\t\t\t\tconst reverbShelfB0 = +instrumentState.reverbShelfB0;\n\t\t\t\tconst reverbShelfB1 = +instrumentState.reverbShelfB1;\n\t\t\t\tlet reverbShelfSample0 = +instrumentState.reverbShelfSample0;\n\t\t\t\tlet reverbShelfSample1 = +instrumentState.reverbShelfSample1;\n\t\t\t\tlet reverbShelfSample2 = +instrumentState.reverbShelfSample2;\n\t\t\t\tlet reverbShelfSample3 = +instrumentState.reverbShelfSample3;\n\t\t\t\tlet reverbShelfPrevInput0 = +instrumentState.reverbShelfPrevInput0;\n\t\t\t\tlet reverbShelfPrevInput1 = +instrumentState.reverbShelfPrevInput1;\n\t\t\t\tlet reverbShelfPrevInput2 = +instrumentState.reverbShelfPrevInput2;\n\t\t\t\tlet reverbShelfPrevInput3 = +instrumentState.reverbShelfPrevInput3;"),
          (t +=
            "\n\t\t\t\t\n\t\t\t\tconst stopIndex = bufferIndex + runLength;\n\t\t\t\tfor (let sampleIndex = bufferIndex; sampleIndex < stopIndex; sampleIndex++) {\n\t\t\t\t\tlet sample = tempMonoInstrumentSampleBuffer[sampleIndex];\n\t\t\t\t\ttempMonoInstrumentSampleBuffer[sampleIndex] = 0.0;"),
          s &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\t\tconst distortionReverse = 1.0 - distortion;\n\t\t\t\t\tconst distortionNextInput = sample * distortionDrive;\n\t\t\t\t\tsample = distortionNextOutput;\n\t\t\t\t\tdistortionNextOutput = distortionNextInput / (distortionReverse * Math.abs(distortionNextInput) + distortion);\n\t\t\t\t\tdistortionFractionalInput1 = distortionFractionalDelayG1 * distortionNextInput + distortionPrevInput - distortionFractionalDelayG1 * distortionFractionalInput1;\n\t\t\t\t\tdistortionFractionalInput2 = distortionFractionalDelayG2 * distortionNextInput + distortionPrevInput - distortionFractionalDelayG2 * distortionFractionalInput2;\n\t\t\t\t\tdistortionFractionalInput3 = distortionFractionalDelayG3 * distortionNextInput + distortionPrevInput - distortionFractionalDelayG3 * distortionFractionalInput3;\n\t\t\t\t\tconst distortionOutput1 = distortionFractionalInput1 / (distortionReverse * Math.abs(distortionFractionalInput1) + distortion);\n\t\t\t\t\tconst distortionOutput2 = distortionFractionalInput2 / (distortionReverse * Math.abs(distortionFractionalInput2) + distortion);\n\t\t\t\t\tconst distortionOutput3 = distortionFractionalInput3 / (distortionReverse * Math.abs(distortionFractionalInput3) + distortion);\n\t\t\t\t\tdistortionNextOutput += distortionOutput1 * distortionNextOutputWeight1 + distortionOutput2 * distortionNextOutputWeight2 + distortionOutput3 * distortionNextOutputWeight3;\n\t\t\t\t\tsample += distortionOutput1 * distortionPrevOutputWeight1 + distortionOutput2 * distortionPrevOutputWeight2 + distortionOutput3 * distortionPrevOutputWeight3;\n\t\t\t\t\tsample *= distortionOversampleCompensation;\n\t\t\t\t\tdistortionPrevInput = distortionNextInput;\n\t\t\t\t\tdistortion += distortionDelta;\n\t\t\t\t\tdistortionDrive += distortionDriveDelta;"),
          l &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\t\tbitcrusherPhase += bitcrusherPhaseDelta;\n\t\t\t\t\tif (bitcrusherPhase < 1.0) {\n\t\t\t\t\t\tbitcrusherPrevInput = sample;\n\t\t\t\t\t\tsample = bitcrusherCurrentOutput;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tbitcrusherPhase = bitcrusherPhase % 1.0;\n\t\t\t\t\t\tconst ratio = bitcrusherPhase / bitcrusherPhaseDelta;\n\t\t\t\t\t\t\n\t\t\t\t\t\tconst lerpedInput = sample + (bitcrusherPrevInput - sample) * ratio;\n\t\t\t\t\t\tbitcrusherPrevInput = sample;\n\t\t\t\t\t\t\n\t\t\t\t\t\tconst bitcrusherWrapLevel = bitcrusherFoldLevel * 4.0;\n\t\t\t\t\t\tconst wrappedSample = (((lerpedInput + bitcrusherFoldLevel) % bitcrusherWrapLevel) + bitcrusherWrapLevel) % bitcrusherWrapLevel;\n\t\t\t\t\t\tconst foldedSample = bitcrusherFoldLevel - Math.abs(bitcrusherFoldLevel * 2.0 - wrappedSample);\n\t\t\t\t\t\tconst scaledSample = foldedSample / bitcrusherScale;\n\t\t\t\t\t\tconst oldValue = bitcrusherCurrentOutput;\n\t\t\t\t\t\tconst newValue = (((scaledSample > 0 ? scaledSample + 1 : scaledSample)|0)-.5) * bitcrusherScale;\n\t\t\t\t\t\t\n\t\t\t\t\t\tsample = oldValue + (newValue - oldValue) * ratio;\n\t\t\t\t\t\tbitcrusherCurrentOutput = newValue;\n\t\t\t\t\t}\n\t\t\t\t\tbitcrusherPhaseDelta *= bitcrusherPhaseDeltaScale;\n\t\t\t\t\tbitcrusherScale *= bitcrusherScaleScale;\n\t\t\t\t\tbitcrusherFoldLevel *= bitcrusherFoldLevelScale;"),
          c &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\t\tconst inputSample = sample;\n\t\t\t\t\tsample = applyFilters(inputSample, initialFilterInput1, initialFilterInput2, filterCount, filters);\n\t\t\t\t\tinitialFilterInput2 = initialFilterInput1;\n\t\t\t\t\tinitialFilterInput1 = inputSample;"),
          (t +=
            "\n\t\t\t\t\t\n\t\t\t\t\tsample *= eqFilterVolume;\n\t\t\t\t\teqFilterVolume += eqFilterVolumeDelta;"),
          (t += h
            ? "\n\t\t\t\t\t\n\t\t\t\t\tpanningDelayLine[panningDelayPos] = sample;\n\t\t\t\t\tconst panningRatioL  = panningOffsetL % 1;\n\t\t\t\t\tconst panningRatioR  = panningOffsetR % 1;\n\t\t\t\t\tconst panningTapLA   = panningDelayLine[(panningOffsetL) & panningMask];\n\t\t\t\t\tconst panningTapLB   = panningDelayLine[(panningOffsetL + 1) & panningMask];\n\t\t\t\t\tconst panningTapRA   = panningDelayLine[(panningOffsetR) & panningMask];\n\t\t\t\t\tconst panningTapRB   = panningDelayLine[(panningOffsetR + 1) & panningMask];\n\t\t\t\t\tconst panningTapL    = panningTapLA + (panningTapLB - panningTapLA) * panningRatioL;\n\t\t\t\t\tconst panningTapR    = panningTapRA + (panningTapRB - panningTapRA) * panningRatioR;\n\t\t\t\t\tlet sampleL = panningTapL * panningVolumeL;\n\t\t\t\t\tlet sampleR = panningTapR * panningVolumeR;\n\t\t\t\t\tpanningDelayPos = (panningDelayPos + 1) & panningMask;\n\t\t\t\t\tpanningVolumeL += panningVolumeDeltaL;\n\t\t\t\t\tpanningVolumeR += panningVolumeDeltaR;\n\t\t\t\t\tpanningOffsetL += panningOffsetDeltaL;\n\t\t\t\t\tpanningOffsetR += panningOffsetDeltaR;"
            : "\n\t\t\t\t\t\n\t\t\t\t\tlet sampleL = sample;\n\t\t\t\t\tlet sampleR = sample;"),
          p &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\t\tconst chorusTap0Ratio = chorusTap0Index % 1;\n\t\t\t\t\tconst chorusTap1Ratio = chorusTap1Index % 1;\n\t\t\t\t\tconst chorusTap2Ratio = chorusTap2Index % 1;\n\t\t\t\t\tconst chorusTap3Ratio = chorusTap3Index % 1;\n\t\t\t\t\tconst chorusTap4Ratio = chorusTap4Index % 1;\n\t\t\t\t\tconst chorusTap5Ratio = chorusTap5Index % 1;\n\t\t\t\t\tconst chorusTap0A = chorusDelayLineL[(chorusTap0Index) & chorusMask];\n\t\t\t\t\tconst chorusTap0B = chorusDelayLineL[(chorusTap0Index + 1) & chorusMask];\n\t\t\t\t\tconst chorusTap1A = chorusDelayLineL[(chorusTap1Index) & chorusMask];\n\t\t\t\t\tconst chorusTap1B = chorusDelayLineL[(chorusTap1Index + 1) & chorusMask];\n\t\t\t\t\tconst chorusTap2A = chorusDelayLineL[(chorusTap2Index) & chorusMask];\n\t\t\t\t\tconst chorusTap2B = chorusDelayLineL[(chorusTap2Index + 1) & chorusMask];\n\t\t\t\t\tconst chorusTap3A = chorusDelayLineR[(chorusTap3Index) & chorusMask];\n\t\t\t\t\tconst chorusTap3B = chorusDelayLineR[(chorusTap3Index + 1) & chorusMask];\n\t\t\t\t\tconst chorusTap4A = chorusDelayLineR[(chorusTap4Index) & chorusMask];\n\t\t\t\t\tconst chorusTap4B = chorusDelayLineR[(chorusTap4Index + 1) & chorusMask];\n\t\t\t\t\tconst chorusTap5A = chorusDelayLineR[(chorusTap5Index) & chorusMask];\n\t\t\t\t\tconst chorusTap5B = chorusDelayLineR[(chorusTap5Index + 1) & chorusMask];\n\t\t\t\t\tconst chorusTap0 = chorusTap0A + (chorusTap0B - chorusTap0A) * chorusTap0Ratio;\n\t\t\t\t\tconst chorusTap1 = chorusTap1A + (chorusTap1B - chorusTap1A) * chorusTap1Ratio;\n\t\t\t\t\tconst chorusTap2 = chorusTap2A + (chorusTap2B - chorusTap2A) * chorusTap2Ratio;\n\t\t\t\t\tconst chorusTap3 = chorusTap3A + (chorusTap3B - chorusTap3A) * chorusTap3Ratio;\n\t\t\t\t\tconst chorusTap4 = chorusTap4A + (chorusTap4B - chorusTap4A) * chorusTap4Ratio;\n\t\t\t\t\tconst chorusTap5 = chorusTap5A + (chorusTap5B - chorusTap5A) * chorusTap5Ratio;\n\t\t\t\t\tchorusDelayLineL[chorusDelayPos] = sampleL * delayInputMult;\n\t\t\t\t\tchorusDelayLineR[chorusDelayPos] = sampleR * delayInputMult;\n\t\t\t\t\tsampleL = chorusCombinedMult * (sampleL + chorusVoiceMult * (chorusTap1 - chorusTap0 - chorusTap2));\n\t\t\t\t\tsampleR = chorusCombinedMult * (sampleR + chorusVoiceMult * (chorusTap4 - chorusTap3 - chorusTap5));\n\t\t\t\t\tchorusDelayPos = (chorusDelayPos + 1) & chorusMask;\n\t\t\t\t\tchorusTap0Index += chorusTap0Delta;\n\t\t\t\t\tchorusTap1Index += chorusTap1Delta;\n\t\t\t\t\tchorusTap2Index += chorusTap2Delta;\n\t\t\t\t\tchorusTap3Index += chorusTap3Delta;\n\t\t\t\t\tchorusTap4Index += chorusTap4Delta;\n\t\t\t\t\tchorusTap5Index += chorusTap5Delta;\n\t\t\t\t\tchorusVoiceMult += chorusVoiceMultDelta;\n\t\t\t\t\tchorusCombinedMult += chorusCombinedMultDelta;"),
          d &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\t\tconst echoTapStartIndex = (echoDelayPos + echoDelayOffsetStart) & echoMask;\n\t\t\t\t\tconst echoTapEndIndex   = (echoDelayPos + echoDelayOffsetEnd  ) & echoMask;\n\t\t\t\t\tconst echoTapStartL = echoDelayLineL[echoTapStartIndex];\n\t\t\t\t\tconst echoTapEndL   = echoDelayLineL[echoTapEndIndex];\n\t\t\t\t\tconst echoTapStartR = echoDelayLineR[echoTapStartIndex];\n\t\t\t\t\tconst echoTapEndR   = echoDelayLineR[echoTapEndIndex];\n\t\t\t\t\tconst echoTapL = (echoTapStartL + (echoTapEndL - echoTapStartL) * echoDelayOffsetRatio) * echoMult;\n\t\t\t\t\tconst echoTapR = (echoTapStartR + (echoTapEndR - echoTapStartR) * echoDelayOffsetRatio) * echoMult;\n\t\t\t\t\t\n\t\t\t\t\techoShelfSampleL = echoShelfB0 * echoTapL + echoShelfB1 * echoShelfPrevInputL - echoShelfA1 * echoShelfSampleL;\n\t\t\t\t\techoShelfSampleR = echoShelfB0 * echoTapR + echoShelfB1 * echoShelfPrevInputR - echoShelfA1 * echoShelfSampleR;\n\t\t\t\t\techoShelfPrevInputL = echoTapL;\n\t\t\t\t\techoShelfPrevInputR = echoTapR;\n\t\t\t\t\tsampleL += echoShelfSampleL;\n\t\t\t\t\tsampleR += echoShelfSampleR;\n\t\t\t\t\t\n\t\t\t\t\techoDelayLineL[echoDelayPos] = sampleL * delayInputMult;\n\t\t\t\t\techoDelayLineR[echoDelayPos] = sampleR * delayInputMult;\n\t\t\t\t\techoDelayPos = (echoDelayPos + 1) & echoMask;\n\t\t\t\t\techoDelayOffsetRatio += echoDelayOffsetRatioDelta;\n\t\t\t\t\techoMult += echoMultDelta;\n                    "),
          m &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\t\t// Reverb, implemented using a feedback delay network with a Hadamard matrix and lowpass filters.\n\t\t\t\t\t// good ratios:    0.555235 + 0.618033 + 0.818 +   1.0 = 2.991268\n\t\t\t\t\t// Delay lengths:  3041     + 3385     + 4481  +  5477 = 16384 = 2^14\n\t\t\t\t\t// Buffer offsets: 3041    -> 6426   -> 10907 -> 16384\n\t\t\t\t\tconst reverbDelayPos1 = (reverbDelayPos +  3041) & reverbMask;\n\t\t\t\t\tconst reverbDelayPos2 = (reverbDelayPos +  6426) & reverbMask;\n\t\t\t\t\tconst reverbDelayPos3 = (reverbDelayPos + 10907) & reverbMask;\n\t\t\t\t\tconst reverbSample0 = (reverbDelayLine[reverbDelayPos]);\n\t\t\t\t\tconst reverbSample1 = reverbDelayLine[reverbDelayPos1];\n\t\t\t\t\tconst reverbSample2 = reverbDelayLine[reverbDelayPos2];\n\t\t\t\t\tconst reverbSample3 = reverbDelayLine[reverbDelayPos3];\n\t\t\t\t\tconst reverbTemp0 = -(reverbSample0 + sampleL) + reverbSample1;\n\t\t\t\t\tconst reverbTemp1 = -(reverbSample0 + sampleR) - reverbSample1;\n\t\t\t\t\tconst reverbTemp2 = -reverbSample2 + reverbSample3;\n\t\t\t\t\tconst reverbTemp3 = -reverbSample2 - reverbSample3;\n\t\t\t\t\tconst reverbShelfInput0 = (reverbTemp0 + reverbTemp2) * reverb;\n\t\t\t\t\tconst reverbShelfInput1 = (reverbTemp1 + reverbTemp3) * reverb;\n\t\t\t\t\tconst reverbShelfInput2 = (reverbTemp0 - reverbTemp2) * reverb;\n\t\t\t\t\tconst reverbShelfInput3 = (reverbTemp1 - reverbTemp3) * reverb;\n\t\t\t\t\treverbShelfSample0 = reverbShelfB0 * reverbShelfInput0 + reverbShelfB1 * reverbShelfPrevInput0 - reverbShelfA1 * reverbShelfSample0;\n\t\t\t\t\treverbShelfSample1 = reverbShelfB0 * reverbShelfInput1 + reverbShelfB1 * reverbShelfPrevInput1 - reverbShelfA1 * reverbShelfSample1;\n\t\t\t\t\treverbShelfSample2 = reverbShelfB0 * reverbShelfInput2 + reverbShelfB1 * reverbShelfPrevInput2 - reverbShelfA1 * reverbShelfSample2;\n\t\t\t\t\treverbShelfSample3 = reverbShelfB0 * reverbShelfInput3 + reverbShelfB1 * reverbShelfPrevInput3 - reverbShelfA1 * reverbShelfSample3;\n\t\t\t\t\treverbShelfPrevInput0 = reverbShelfInput0;\n\t\t\t\t\treverbShelfPrevInput1 = reverbShelfInput1;\n\t\t\t\t\treverbShelfPrevInput2 = reverbShelfInput2;\n\t\t\t\t\treverbShelfPrevInput3 = reverbShelfInput3;\n\t\t\t\t\treverbDelayLine[reverbDelayPos1] = reverbShelfSample0 * delayInputMult;\n\t\t\t\t\treverbDelayLine[reverbDelayPos2] = reverbShelfSample1 * delayInputMult;\n\t\t\t\t\treverbDelayLine[reverbDelayPos3] = reverbShelfSample2 * delayInputMult;\n\t\t\t\t\treverbDelayLine[reverbDelayPos ] = reverbShelfSample3 * delayInputMult;\n\t\t\t\t\treverbDelayPos = (reverbDelayPos + 1) & reverbMask;\n\t\t\t\t\tsampleL += reverbSample1 + reverbSample2 + reverbSample3;\n\t\t\t\t\tsampleR += reverbSample0 + reverbSample2 - reverbSample3;\n\t\t\t\t\treverb += reverbDelta;"),
          (t +=
            "\n\t\t\t\t\t\n\t\t\t\t\toutputDataL[sampleIndex] += sampleL * mixVolume;\n\t\t\t\t\toutputDataR[sampleIndex] += sampleR * mixVolume;\n\t\t\t\t\tmixVolume += mixVolumeDelta;"),
          n &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\t\tdelayInputMult += delayInputMultDelta;"),
          (t +=
            "\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\tinstrumentState.mixVolume = mixVolume;\n\t\t\t\tinstrumentState.eqFilterVolume = eqFilterVolume;\n\t\t\t\t\n\t\t\t\t// Avoid persistent denormal or NaN values in the delay buffers and filter history.\n\t\t\t\tconst epsilon = (1.0e-24);"),
          n &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tinstrumentState.delayInputMult = delayInputMult;"),
          s &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tinstrumentState.distortion = distortion;\n\t\t\t\tinstrumentState.distortionDrive = distortionDrive;\n\t\t\t\t\n\t\t\t\tif (!Number.isFinite(distortionFractionalInput1) || Math.abs(distortionFractionalInput1) < epsilon) distortionFractionalInput1 = 0.0;\n\t\t\t\tif (!Number.isFinite(distortionFractionalInput2) || Math.abs(distortionFractionalInput2) < epsilon) distortionFractionalInput2 = 0.0;\n\t\t\t\tif (!Number.isFinite(distortionFractionalInput3) || Math.abs(distortionFractionalInput3) < epsilon) distortionFractionalInput3 = 0.0;\n\t\t\t\tif (!Number.isFinite(distortionPrevInput) || Math.abs(distortionPrevInput) < epsilon) distortionPrevInput = 0.0;\n\t\t\t\tif (!Number.isFinite(distortionNextOutput) || Math.abs(distortionNextOutput) < epsilon) distortionNextOutput = 0.0;\n\t\t\t\t\n\t\t\t\tinstrumentState.distortionFractionalInput1 = distortionFractionalInput1;\n\t\t\t\tinstrumentState.distortionFractionalInput2 = distortionFractionalInput2;\n\t\t\t\tinstrumentState.distortionFractionalInput3 = distortionFractionalInput3;\n\t\t\t\tinstrumentState.distortionPrevInput = distortionPrevInput;\n\t\t\t\tinstrumentState.distortionNextOutput = distortionNextOutput;"),
          l &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\tif (Math.abs(bitcrusherPrevInput) < epsilon) bitcrusherPrevInput = 0.0;\n\t\t\t\tif (Math.abs(bitcrusherCurrentOutput) < epsilon) bitcrusherCurrentOutput = 0.0;\n\t\t\t\tinstrumentState.bitcrusherPrevInput = bitcrusherPrevInput;\n\t\t\t\tinstrumentState.bitcrusherCurrentOutput = bitcrusherCurrentOutput;\n\t\t\t\tinstrumentState.bitcrusherPhase = bitcrusherPhase;\n\t\t\t\tinstrumentState.bitcrusherPhaseDelta = bitcrusherPhaseDelta;\n\t\t\t\tinstrumentState.bitcrusherScale = bitcrusherScale;\n\t\t\t\tinstrumentState.bitcrusherFoldLevel = bitcrusherFoldLevel;"),
          c &&
            (t +=
              "\n\t\t\t\t\t\n\t\t\t\tsynth.sanitizeFilters(filters);\n\t\t\t\t// The filter input here is downstream from another filter so we\n\t\t\t\t// better make sure it's safe too.\n\t\t\t\tif (!(initialFilterInput1 < 100) || !(initialFilterInput2 < 100)) {\n\t\t\t\t\tinitialFilterInput1 = 0.0;\n\t\t\t\t\tinitialFilterInput2 = 0.0;\n\t\t\t\t}\n\t\t\t\tif (Math.abs(initialFilterInput1) < epsilon) initialFilterInput1 = 0.0;\n\t\t\t\tif (Math.abs(initialFilterInput2) < epsilon) initialFilterInput2 = 0.0;\n\t\t\t\tinstrumentState.initialEqFilterInput1 = initialFilterInput1;\n\t\t\t\tinstrumentState.initialEqFilterInput2 = initialFilterInput2;"),
          h &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tSynth.sanitizeDelayLine(panningDelayLine, panningDelayPos, panningMask);\n\t\t\t\tinstrumentState.panningDelayPos = panningDelayPos;\n\t\t\t\tinstrumentState.panningVolumeL = panningVolumeL;\n\t\t\t\tinstrumentState.panningVolumeR = panningVolumeR;\n\t\t\t\tinstrumentState.panningOffsetL = panningOffsetL;\n\t\t\t\tinstrumentState.panningOffsetR = panningOffsetR;"),
          p &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tSynth.sanitizeDelayLine(chorusDelayLineL, chorusDelayPos, chorusMask);\n\t\t\t\tSynth.sanitizeDelayLine(chorusDelayLineR, chorusDelayPos, chorusMask);\n\t\t\t\tinstrumentState.chorusPhase = chorusPhase;\n\t\t\t\tinstrumentState.chorusDelayPos = chorusDelayPos;\n\t\t\t\tinstrumentState.chorusVoiceMult = chorusVoiceMult;\n\t\t\t\tinstrumentState.chorusCombinedMult = chorusCombinedMult;"),
          d &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tSynth.sanitizeDelayLine(echoDelayLineL, echoDelayPos, echoMask);\n\t\t\t\tSynth.sanitizeDelayLine(echoDelayLineR, echoDelayPos, echoMask);\n\t\t\t\tinstrumentState.echoDelayPos = echoDelayPos;\n\t\t\t\tinstrumentState.echoMult = echoMult;\n\t\t\t\tinstrumentState.echoDelayOffsetRatio = echoDelayOffsetRatio;\n\t\t\t\t\n\t\t\t\tif (!Number.isFinite(echoShelfSampleL) || Math.abs(echoShelfSampleL) < epsilon) echoShelfSampleL = 0.0;\n\t\t\t\tif (!Number.isFinite(echoShelfSampleR) || Math.abs(echoShelfSampleR) < epsilon) echoShelfSampleR = 0.0;\n\t\t\t\tif (!Number.isFinite(echoShelfPrevInputL) || Math.abs(echoShelfPrevInputL) < epsilon) echoShelfPrevInputL = 0.0;\n\t\t\t\tif (!Number.isFinite(echoShelfPrevInputR) || Math.abs(echoShelfPrevInputR) < epsilon) echoShelfPrevInputR = 0.0;\n\t\t\t\tinstrumentState.echoShelfSampleL = echoShelfSampleL;\n\t\t\t\tinstrumentState.echoShelfSampleR = echoShelfSampleR;\n\t\t\t\tinstrumentState.echoShelfPrevInputL = echoShelfPrevInputL;\n\t\t\t\tinstrumentState.echoShelfPrevInputR = echoShelfPrevInputR;"),
          m &&
            (t +=
              "\n\t\t\t\t\n\t\t\t\tSynth.sanitizeDelayLine(reverbDelayLine, reverbDelayPos        , reverbMask);\n\t\t\t\tSynth.sanitizeDelayLine(reverbDelayLine, reverbDelayPos +  3041, reverbMask);\n\t\t\t\tSynth.sanitizeDelayLine(reverbDelayLine, reverbDelayPos +  6426, reverbMask);\n\t\t\t\tSynth.sanitizeDelayLine(reverbDelayLine, reverbDelayPos + 10907, reverbMask);\n\t\t\t\tinstrumentState.reverbDelayPos = reverbDelayPos;\n\t\t\t\tinstrumentState.reverbMult = reverb;\n\t\t\t\t\n\t\t\t\tif (!Number.isFinite(reverbShelfSample0) || Math.abs(reverbShelfSample0) < epsilon) reverbShelfSample0 = 0.0;\n\t\t\t\tif (!Number.isFinite(reverbShelfSample1) || Math.abs(reverbShelfSample1) < epsilon) reverbShelfSample1 = 0.0;\n\t\t\t\tif (!Number.isFinite(reverbShelfSample2) || Math.abs(reverbShelfSample2) < epsilon) reverbShelfSample2 = 0.0;\n\t\t\t\tif (!Number.isFinite(reverbShelfSample3) || Math.abs(reverbShelfSample3) < epsilon) reverbShelfSample3 = 0.0;\n\t\t\t\tif (!Number.isFinite(reverbShelfPrevInput0) || Math.abs(reverbShelfPrevInput0) < epsilon) reverbShelfPrevInput0 = 0.0;\n\t\t\t\tif (!Number.isFinite(reverbShelfPrevInput1) || Math.abs(reverbShelfPrevInput1) < epsilon) reverbShelfPrevInput1 = 0.0;\n\t\t\t\tif (!Number.isFinite(reverbShelfPrevInput2) || Math.abs(reverbShelfPrevInput2) < epsilon) reverbShelfPrevInput2 = 0.0;\n\t\t\t\tif (!Number.isFinite(reverbShelfPrevInput3) || Math.abs(reverbShelfPrevInput3) < epsilon) reverbShelfPrevInput3 = 0.0;\n\t\t\t\tinstrumentState.reverbShelfSample0 = reverbShelfSample0;\n\t\t\t\tinstrumentState.reverbShelfSample1 = reverbShelfSample1;\n\t\t\t\tinstrumentState.reverbShelfSample2 = reverbShelfSample2;\n\t\t\t\tinstrumentState.reverbShelfSample3 = reverbShelfSample3;\n\t\t\t\tinstrumentState.reverbShelfPrevInput0 = reverbShelfPrevInput0;\n\t\t\t\tinstrumentState.reverbShelfPrevInput1 = reverbShelfPrevInput1;\n\t\t\t\tinstrumentState.reverbShelfPrevInput2 = reverbShelfPrevInput2;\n\t\t\t\tinstrumentState.reverbShelfPrevInput3 = reverbShelfPrevInput3;"),
          (t += "}"),
          (f = new Function("Config", "Synth", t)(e, St)),
          (St.effectsFunctionCache[u] = f);
      }
      f(t, n, i, a, r, o);
    }
    static pulseWidthSynth(t, e, n, i, a) {
      const r = t.tempMonoInstrumentSampleBuffer;
      let o = i.phaseDeltas[0];
      const s = +i.phaseDeltaScales[0];
      let l = +i.expression;
      const c = +i.expressionDelta;
      let h = i.phases[0] % 1,
        p = i.pulseWidth;
      const d = i.pulseWidthDelta,
        m = i.noteFilters,
        u = 0 | i.noteFilterCount;
      let f = +i.initialNoteFilterInput1,
        y = +i.initialNoteFilterInput2;
      const b = St.applyFilters,
        g = e + n;
      for (let t = e; t < g; t++) {
        const e = h % 1,
          n = (h + p) % 1;
        let i = n - e;
        if (!a.aliases) {
          if (e < o) i += 0.5 * ((v = e / o) + v - v * v - 1);
          else if (e > 1 - o) {
            i += 0.5 * ((v = (e - 1) / o) + v + v * v + 1);
          }
          if (n < o) i -= 0.5 * ((v = n / o) + v - v * v - 1);
          else if (n > 1 - o) {
            var v;
            i -= 0.5 * ((v = (n - 1) / o) + v + v * v + 1);
          }
        }
        const g = i,
          k = b(g, f, y, u, m);
        (y = f), (f = g), (h += o), (o *= s), (p += d);
        const w = k * l;
        (l += c), (r[t] += w);
      }
      (i.phases[0] = h),
        (i.phaseDeltas[0] = o),
        (i.expression = l),
        (i.pulseWidth = p),
        t.sanitizeFilters(m),
        (i.initialNoteFilterInput1 = f),
        (i.initialNoteFilterInput2 = y);
    }
    static supersawSynth(t, n, i, a, r) {
      const o = t.tempMonoInstrumentSampleBuffer,
        s = 0 | e.supersawVoiceCount;
      let l = a.phaseDeltas[0];
      const c = +a.phaseDeltaScales[0];
      let h = +a.expression;
      const p = +a.expressionDelta;
      let d = a.phases,
        m = +a.supersawDynamism;
      const u = +a.supersawDynamismDelta,
        f = a.supersawUnisonDetunes;
      let y = +a.supersawShape;
      const b = +a.supersawShapeDelta;
      let g = +a.supersawDelayLength;
      const v = +a.supersawDelayLengthDelta,
        k = a.supersawDelayLine,
        w = (k.length - 1) | 0;
      let M = 0 | a.supersawDelayIndex;
      M = (M & w) + k.length;
      const F = a.noteFilters,
        S = 0 | a.noteFilterCount;
      let x = +a.initialNoteFilterInput1,
        I = +a.initialNoteFilterInput2;
      const P = St.applyFilters,
        A = n + i;
      for (let t = n; t < A; t++) {
        let e = (d[0] + l) % 1,
          n = e - 0.5 * (1 + (s - 1) * m);
        if (!r.aliases)
          if (e < l) n -= 0.5 * ((T = e / l) + T - T * T - 1);
          else if (e > 1 - l) {
            var T;
            n -= 0.5 * ((T = (e - 1) / l) + T + T * T + 1);
          }
        d[0] = e;
        for (let t = 1; t < s; t++) {
          const e = l * f[t];
          let i = (d[t] + e) % 1;
          if (((n += i * m), !r.aliases))
            if (i < e) {
              const t = i / e;
              n -= 0.5 * (t + t - t * t - 1) * m;
            } else if (i > 1 - e) {
              const t = (i - 1) / e;
              n -= 0.5 * (t + t + t * t + 1) * m;
            }
          d[t] = i;
        }
        k[M & w] = n;
        const i = M - g,
          a = 0 | i,
          A = a + 1,
          C = i - a,
          D = k[a & w];
        M++;
        const q = n - (D + (k[A & w] - D) * C) * y,
          E = P(q, x, I, S, F);
        (I = x), (x = q), (l *= c), (m += u), (y += b), (g += v);
        const O = E * h;
        (h += p), (o[t] += O);
      }
      (a.phaseDeltas[0] = l),
        (a.expression = h),
        (a.supersawDynamism = m),
        (a.supersawShape = y),
        (a.supersawDelayLength = g),
        (a.supersawDelayIndex = M),
        t.sanitizeFilters(F),
        (a.initialNoteFilterInput1 = x),
        (a.initialNoteFilterInput2 = I);
    }
    static noiseSynth(t, n, i, a, r) {
      const o = t.tempMonoInstrumentSampleBuffer,
        s = r.wave;
      let l = +a.phaseDeltas[0];
      const c = +a.phaseDeltaScales[0];
      let h = +a.expression;
      const p = +a.expressionDelta;
      let d = (a.phases[0] % 1) * e.chipNoiseLength;
      0 == a.phases[0] && (d = Math.random() * e.chipNoiseLength);
      const m = e.chipNoiseLength - 1;
      let u = +a.noiseSample;
      const f = a.noteFilters,
        y = 0 | a.noteFilterCount;
      let b = +a.initialNoteFilterInput1,
        g = +a.initialNoteFilterInput2;
      const v = St.applyFilters,
        k = Math.min(1, l * r.noisePitchFilterMult),
        w = n + i;
      for (let t = n; t < w; t++) {
        u += (s[d & m] - u) * k;
        const e = u,
          n = v(e, b, g, y, f);
        (g = b), (b = e), (d += l), (l *= c);
        const i = n * h;
        (h += p), (o[t] += i);
      }
      (a.phases[0] = d / e.chipNoiseLength),
        (a.phaseDeltas[0] = l),
        (a.expression = h),
        (a.noiseSample = u),
        t.sanitizeFilters(f),
        (a.initialNoteFilterInput1 = b),
        (a.initialNoteFilterInput2 = g);
    }
    static spectrumSynth(t, n, i, a, r) {
      const o = t.tempMonoInstrumentSampleBuffer,
        s = r.wave;
      let l = 128 * a.phaseDeltas[0];
      const c = +a.phaseDeltaScales[0];
      let h = +a.expression;
      const p = +a.expressionDelta;
      let d = +a.noiseSample;
      const m = a.noteFilters,
        u = 0 | a.noteFilterCount;
      let f = +a.initialNoteFilterInput1,
        y = +a.initialNoteFilterInput2;
      const b = St.applyFilters;
      let g = (a.phases[0] % 1) * e.spectrumNoiseLength;
      0 == a.phases[0] &&
        (g = St.findRandomZeroCrossing(s, e.spectrumNoiseLength) + l);
      const v = e.spectrumNoiseLength - 1,
        k = Math.min(1, l),
        w = n + i;
      for (let t = n; t < w; t++) {
        const e = 0 | g,
          n = e & v;
        let i = s[n];
        const a = g - e;
        (i += (s[n + 1] - i) * a), (d += (i - d) * k);
        const r = d,
          w = b(r, f, y, u, m);
        (y = f), (f = r), (g += l), (l *= c);
        const M = w * h;
        (h += p), (o[t] += M);
      }
      (a.phases[0] = g / e.spectrumNoiseLength),
        (a.phaseDeltas[0] = l / 128),
        (a.expression = h),
        (a.noiseSample = d),
        t.sanitizeFilters(m),
        (a.initialNoteFilterInput1 = f),
        (a.initialNoteFilterInput2 = y);
    }
    static drumsetSynth(t, n, i, a, r) {
      const o = t.tempMonoInstrumentSampleBuffer;
      let s = r.getDrumsetWave(a.drumsetPitch);
      const l = Mt.drumsetIndexReferenceDelta(a.drumsetPitch);
      let c = a.phaseDeltas[0] / l;
      const h = +a.phaseDeltaScales[0];
      let p = +a.expression;
      const d = +a.expressionDelta,
        m = a.noteFilters,
        u = 0 | a.noteFilterCount;
      let f = +a.initialNoteFilterInput1,
        y = +a.initialNoteFilterInput2;
      const b = St.applyFilters;
      let g = (a.phases[0] % 1) * e.spectrumNoiseLength;
      0 == a.phases[0] &&
        (g = St.findRandomZeroCrossing(s, e.spectrumNoiseLength) + c);
      const v = e.spectrumNoiseLength - 1,
        k = n + i;
      for (let t = n; t < k; t++) {
        const e = 0 | g,
          n = e & v;
        let i = s[n];
        const a = g - e;
        i += (s[n + 1] - i) * a;
        const r = i,
          l = b(r, f, y, u, m);
        (y = f), (f = r), (g += c), (c *= h);
        const k = l * p;
        (p += d), (o[t] += k);
      }
      (a.phases[0] = g / e.spectrumNoiseLength),
        (a.phaseDeltas[0] = c * l),
        (a.expression = p),
        t.sanitizeFilters(m),
        (a.initialNoteFilterInput1 = f),
        (a.initialNoteFilterInput2 = y);
    }
    static modSynth(t, n, i, a, r) {
      if (!t.song) return;
      let o = e.modCount - 1 - a.pitches[0];
      if (r.invalidModulators[o]) return;
      let s = r.modulators[o],
        l = [];
      if (e.modulators[r.modulators[o]].forSong) l.push(0);
      else if (
        r.modInstruments[o] ==
        t.song.channels[r.modChannels[o]].instruments.length
      )
        for (
          let e = 0;
          e < t.song.channels[r.modChannels[o]].instruments.length;
          e++
        )
          l.push(e);
      else
        r.modInstruments[o] >
        t.song.channels[r.modChannels[o]].instruments.length
          ? null != t.song.getPattern(r.modChannels[o], t.bar) &&
            (l = t.song.getPattern(r.modChannels[o], t.bar).instruments)
          : l.push(r.modInstruments[o]);
      for (let n = 0; n < l.length; n++) {
        t.setModValue(
          a.expression,
          a.expression + a.expressionDelta,
          r.modChannels[o],
          l[n],
          s
        );
        for (let i = 0; i < t.heldMods.length; i++)
          e.modulators[r.modulators[o]].forSong
            ? t.heldMods[i].setting == s &&
              t.setModValue(
                t.heldMods[i].volume,
                t.heldMods[i].volume,
                r.modChannels[o],
                l[n],
                s
              )
            : t.heldMods[i].channelIndex == r.modChannels[o] &&
              t.heldMods[i].instrumentIndex == l[n] &&
              t.heldMods[i].setting == s &&
              t.setModValue(
                t.heldMods[i].volume,
                t.heldMods[i].volume,
                r.modChannels[o],
                l[n],
                s
              );
        if (
          s == e.modulators.dictionary["reset arp"].index &&
          0 == t.tick &&
          a.noteStartPart == t.beat * e.partsPerBeat + t.part
        )
          t.channels[r.modChannels[o]].instruments[l[n]].arpTime = 0;
        else if (s == e.modulators.dictionary["next bar"].index)
          t.wantToSkip = !0;
        else if (s == e.modulators.dictionary["eq filter"].index) {
          const s = t.song.channels[r.modChannels[o]].instruments[l[n]];
          if (!s.eqFilterType) {
            let n = 0 | r.modFilterTypes[o];
            if (0 == n) {
              let n = 0;
              const r = t.getTicksIntoBar() / e.ticksPerPart;
              for (; a.note.start + a.note.pins[n].time <= r; ) n++;
              let o =
                (r -
                  a.note.start +
                  (i / (t.getSamplesPerTick() * e.ticksPerPart)) *
                    e.ticksPerPart -
                  a.note.pins[n - 1].time) /
                (a.note.pins[n].time - a.note.pins[n - 1].time);
              null != s.eqSubFilters[a.note.pins[n - 1].size] ||
              null != s.eqSubFilters[a.note.pins[n].size]
                ? (s.tmpEqFilterEnd = ut.lerpFilters(
                    s.eqSubFilters[a.note.pins[n - 1].size],
                    s.eqSubFilters[a.note.pins[n].size],
                    o
                  ))
                : (s.tmpEqFilterEnd = s.eqFilter);
            } else {
              for (let t = 0; t < e.filterMorphCount; t++)
                s.tmpEqFilterEnd == s.eqSubFilters[t] &&
                  null != s.tmpEqFilterEnd &&
                  ((s.tmpEqFilterEnd = new ut()),
                  s.tmpEqFilterEnd.fromJsonObject(
                    s.eqSubFilters[t].toJsonObject()
                  ));
              null == s.tmpEqFilterEnd &&
                ((s.tmpEqFilterEnd = new ut()),
                s.tmpEqFilterEnd.fromJsonObject(s.eqFilter.toJsonObject())),
                s.tmpEqFilterEnd.controlPointCount > Math.floor((n - 1) / 2) &&
                  (n % 2
                    ? (s.tmpEqFilterEnd.controlPoints[
                        Math.floor((n - 1) / 2)
                      ].freq = a.expression + a.expressionDelta)
                    : (s.tmpEqFilterEnd.controlPoints[
                        Math.floor((n - 1) / 2)
                      ].gain = a.expression + a.expressionDelta));
            }
          }
        } else if (s == e.modulators.dictionary["note filter"].index) {
          const s = t.song.channels[r.modChannels[o]].instruments[l[n]];
          if (!s.noteFilterType) {
            let n = 0 | r.modFilterTypes[o];
            if (0 == n) {
              let n = 0;
              const r = t.getTicksIntoBar() / e.ticksPerPart;
              for (; a.note.start + a.note.pins[n].time <= r; ) n++;
              let o =
                (r -
                  a.note.start +
                  (i / (t.getSamplesPerTick() * e.ticksPerPart)) *
                    e.ticksPerPart -
                  a.note.pins[n - 1].time) /
                (a.note.pins[n].time - a.note.pins[n - 1].time);
              null != s.noteSubFilters[a.note.pins[n - 1].size] ||
              null != s.noteSubFilters[a.note.pins[n].size]
                ? (s.tmpNoteFilterEnd = ut.lerpFilters(
                    s.noteSubFilters[a.note.pins[n - 1].size],
                    s.noteSubFilters[a.note.pins[n].size],
                    o
                  ))
                : (s.tmpNoteFilterEnd = s.noteFilter);
            } else {
              for (let t = 0; t < e.filterMorphCount; t++)
                s.tmpNoteFilterEnd == s.noteSubFilters[t] &&
                  null != s.tmpNoteFilterEnd &&
                  ((s.tmpNoteFilterEnd = new ut()),
                  s.tmpNoteFilterEnd.fromJsonObject(
                    s.noteSubFilters[t].toJsonObject()
                  ));
              null == s.tmpNoteFilterEnd &&
                ((s.tmpNoteFilterEnd = new ut()),
                s.tmpNoteFilterEnd.fromJsonObject(s.noteFilter.toJsonObject())),
                s.tmpNoteFilterEnd.controlPointCount >
                  Math.floor((n - 1) / 2) &&
                  (n % 2
                    ? (s.tmpNoteFilterEnd.controlPoints[
                        Math.floor((n - 1) / 2)
                      ].freq = a.expression + a.expressionDelta)
                    : (s.tmpNoteFilterEnd.controlPoints[
                        Math.floor((n - 1) / 2)
                      ].gain = a.expression + a.expressionDelta));
            }
          }
        }
      }
    }
    static findRandomZeroCrossing(t, e) {
      let n = Math.random() * e;
      const i = e - 1;
      let a = n & i,
        r = t[a];
      for (let o = 128; o > 0; o--) {
        const o = (a + 16) & i,
          s = t[o];
        if (r * s <= 0) {
          for (let o = 0; o < 16; o++) {
            const o = (a + 1) & i,
              s = t[o];
            if (r * s <= 0) {
              const t = s - r;
              (n = a),
                Math.abs(t) > 1e-8 && (n += -r / t),
                (n = Math.max(0, n) % e);
              break;
            }
            (a = o), (r = s);
          }
          break;
        }
        (a = o), (r = s);
      }
      return n;
    }
    static instrumentVolumeToVolumeMult(t) {
      return t == -e.volumeRange / 2 ? 0 : Math.pow(2, e.volumeLogScale * t);
    }
    static volumeMultToInstrumentVolume(t) {
      return t <= 0
        ? -e.volumeRange / 2
        : Math.min(e.volumeRange, Math.log(t) / Math.LN2 / e.volumeLogScale);
    }
    static noteSizeToVolumeMult(t) {
      return Math.pow(Math.max(0, t) / e.noteSizeMax, 1.5);
    }
    static volumeMultToNoteSize(t) {
      return Math.pow(Math.max(0, t), 1 / 1.5) * e.noteSizeMax;
    }
    static fadeInSettingToSeconds(t) {
      return 0.0125 * (0.95 * t + 0.05 * t * t);
    }
    static secondsToFadeInSetting(t) {
      return Z(
        0,
        e.fadeInRange,
        Math.round((-0.95 + Math.sqrt(0.9025 + (0.2 * t) / 0.0125)) / 0.1)
      );
    }
    static fadeOutSettingToTicks(t) {
      return e.fadeOutTicks[t];
    }
    static ticksToFadeOutSetting(t) {
      let n = e.fadeOutTicks[0];
      if (t <= n) return 0;
      for (let i = 1; i < e.fadeOutTicks.length; i++) {
        let a = e.fadeOutTicks[i];
        if (t <= a) return t < (n + a) / 2 ? i - 1 : i;
        n = a;
      }
      return e.fadeOutTicks.length - 1;
    }
    static detuneToCents(t) {
      return t - e.detuneCenter;
    }
    static centsToDetune(t) {
      return t + e.detuneCenter;
    }
    static getOperatorWave(t, n) {
      return 3 != t ? e.operatorWaves[t] : e.pwmOperatorWaves[n];
    }
    getSamplesPerTick() {
      if (null == this.song) return 0;
      let t = this.song.getBeatsPerMinute();
      return (
        this.isModActive(e.modulators.dictionary.tempo.index) &&
          (t = this.getModValue(e.modulators.dictionary.tempo.index)),
        this.getSamplesPerTickSpecificBPM(t)
      );
    }
    getSamplesPerTickSpecificBPM(t) {
      const n = t / 60,
        i = e.partsPerBeat * n,
        a = e.ticksPerPart * i;
      return this.samplesPerSecond / a;
    }
    static fittingPowerOfTwo(t) {
      return 1 << (32 - Math.clz32(Math.ceil(t) - 1));
    }
    sanitizeFilters(t) {
      let e = !1;
      for (const n of t) {
        const t = Math.abs(n.output1),
          i = Math.abs(n.output2);
        if (!(t < 100 && i < 100)) {
          e = !0;
          break;
        }
        t < X && (n.output1 = 0), i < X && (n.output2 = 0);
      }
      if (e) for (const e of t) (e.output1 = 0), (e.output2 = 0);
    }
    static sanitizeDelayLine(t, e, n) {
      for (;;) {
        const i = --e & n,
          a = Math.abs(t[i]);
        if (Number.isFinite(a) && (0 == a || a >= X)) break;
        t[i] = 0;
      }
    }
    static applyFilters(t, e, n, i, a) {
      for (let r = 0; r < i; r++) {
        const i = a[r],
          o = i.output1,
          s = i.output2,
          l = i.a1,
          c = i.a2,
          h = i.b0,
          p = i.b1,
          d = i.b2;
        (t = h * t + p * e + d * n - l * o - c * s),
          (i.a1 = l + i.a1Delta),
          (i.a2 = c + i.a2Delta),
          i.useMultiplicativeInputCoefficients
            ? ((i.b0 = h * i.b0Delta),
              (i.b1 = p * i.b1Delta),
              (i.b2 = d * i.b2Delta))
            : ((i.b0 = h + i.b0Delta),
              (i.b1 = p + i.b1Delta),
              (i.b2 = d + i.b2Delta)),
          (i.output2 = o),
          (i.output1 = t),
          (n = s),
          (e = o);
      }
      return t;
    }
  }
  (St.tempFilterStartCoefficients = new _()),
    (St.tempFilterEndCoefficients = new _()),
    (St.fmSynthFunctionCache = {}),
    (St.effectsFunctionCache = Array(128).fill(void 0)),
    (St.pickedStringFunctionCache = Array(3).fill(void 0)),
    (St.fmSourceTemplate = (
      "\n\t\tconst data = synth.tempMonoInstrumentSampleBuffer;\n\t\tconst sineWave = Config.sineWave;\n\t\t\t\n\t\t// I'm adding 1000 to the phase to ensure that it's never negative even when modulated by other waves because negative numbers don't work with the modulus operator very well.\n\t\tlet operator#Phase       = +((tone.phases[#] % 1) + 1000) * " +
      e.sineWaveLength +
      ";\n\t\tlet operator#PhaseDelta  = +tone.phaseDeltas[#] * " +
      e.sineWaveLength +
      ";\n\t\tlet operator#PhaseDeltaScale = +tone.phaseDeltaScales[#];\n\t\tlet operator#OutputMult  = +tone.operatorExpressions[#];\n\t\tconst operator#OutputDelta = +tone.operatorExpressionDeltas[#];\n\t\tlet operator#Output      = +tone.feedbackOutputs[#];\n        const operator#Wave      = tone.operatorWaves[#].samples;\n\t\tlet feedbackMult         = +tone.feedbackMult;\n\t\tconst feedbackDelta        = +tone.feedbackDelta;\n        let expression = +tone.expression;\n\t\tconst expressionDelta = +tone.expressionDelta;\n\t\t\n\t\tconst filters = tone.noteFilters;\n\t\tconst filterCount = tone.noteFilterCount|0;\n\t\tlet initialFilterInput1 = +tone.initialNoteFilterInput1;\n\t\tlet initialFilterInput2 = +tone.initialNoteFilterInput2;\n\t\tconst applyFilters = Synth.applyFilters;\n\t\t\n\t\tconst stopIndex = bufferIndex + roundedSamplesPerTick;\n\t\tfor (let sampleIndex = bufferIndex; sampleIndex < stopIndex; sampleIndex++) {\n\t\t\t\t// INSERT OPERATOR COMPUTATION HERE\n\t\t\t\tconst fmOutput = (/*operator#Scaled*/); // CARRIER OUTPUTS\n\t\t\t\t\n\t\t\tconst inputSample = fmOutput;\n\t\t\tconst sample = applyFilters(inputSample, initialFilterInput1, initialFilterInput2, filterCount, filters);\n\t\t\tinitialFilterInput2 = initialFilterInput1;\n\t\t\tinitialFilterInput1 = inputSample;\n\t\t\t\t\n\t\t\t\tfeedbackMult += feedbackDelta;\n\t\t\t\toperator#OutputMult += operator#OutputDelta;\n\t\t\t\toperator#Phase += operator#PhaseDelta;\n\t\t\toperator#PhaseDelta *= operator#PhaseDeltaScale;\n\t\t\t\n\t\t\tconst output = sample * expression;\n\t\t\texpression += expressionDelta;\n\n\t\t\tdata[sampleIndex] += output;\n\t\t\t}\n\t\t\t\n\t\t\ttone.phases[#] = operator#Phase / " +
      e.sineWaveLength +
      ";\n\t\t\ttone.phaseDeltas[#] = operator#PhaseDelta / " +
      e.sineWaveLength +
      ";\n\t\t\ttone.operatorExpressions[#] = operator#OutputMult;\n\t\t    tone.feedbackOutputs[#] = operator#Output;\n\t\t    tone.feedbackMult = feedbackMult;\n\t\t    tone.expression = expression;\n\t\t\t\n\t\tsynth.sanitizeFilters(filters);\n\t\ttone.initialNoteFilterInput1 = initialFilterInput1;\n\t\ttone.initialNoteFilterInput2 = initialFilterInput2;\n\t\t"
    ).split("\n")),
    (St.operatorSourceTemplate = (
      "\n\t\t\t\tconst operator#PhaseMix = operator#Phase/* + operator@Scaled*/;\n\t\t\t\tconst operator#PhaseInt = operator#PhaseMix|0;\n\t\t\t\tconst operator#Index    = operator#PhaseInt & " +
      e.sineWaveMask +
      ";\n                const operator#Sample   = operator#Wave[operator#Index];\n                operator#Output         = operator#Sample + (operator#Wave[operator#Index + 1] - operator#Sample) * (operator#PhaseMix - operator#PhaseInt);\n\t\t\t\tconst operator#Scaled   = operator#OutputMult * operator#Output;\n\t\t"
    ).split("\n"));
  const { a: xt, button: It, div: Pt, h1: At, input: Tt } = O,
    { svg: Ct, circle: Dt, rect: qt, path: Et } = R;
  document.head.appendChild(
    O.style(
      { type: "text/css" },
      `\n\tbody {\n\t\tcolor: ${V.primaryText};\n\t\tbackground: ${V.editorBackground};\n\t}\n\th1 {\n\t\tfont-weight: bold;\n\t\tfont-size: 14px;\n\t\tline-height: 22px;\n\t\ttext-align: initial;\n\t\tmargin: 0;\n\t}\n\ta {\n\t\tfont-weight: bold;\n\t\tfont-size: 12px;\n\t\tline-height: 22px;\n\t\twhite-space: nowrap;\n\t\tcolor: ${V.linkAccent};\n\t}\n\tbutton {\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t\tposition: relative;\n\t\tborder: none;\n\t\tborder-radius: 5px;\n\t\tbackground: ${V.uiWidgetBackground};\n\t\tcolor: ${V.primaryText};\n\t\tcursor: pointer;\n\t\tfont-size: 14px;\n\t\tfont-family: inherit;\n\t}\n\tbutton:hover, button:focus {\n\t\tbackground: ${V.uiWidgetFocus};\n\t}\n\t.playButton, .pauseButton {\n\t\tpadding-left: 24px;\n\t\tpadding-right: 6px;\n\t}\n\t.playButton::before {\n\t\tcontent: "";\n\t\tposition: absolute;\n\t\tleft: 6px;\n\t\ttop: 50%;\n\t\tmargin-top: -6px;\n\t\twidth: 12px;\n\t\theight: 12px;\n\t\tpointer-events: none;\n\t\tbackground: ${V.primaryText};\n\t\t-webkit-mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-6 -6 12 12"><path d="M 6 0 L -5 6 L -5 -6 z" fill="gray"/></svg>');\n\t\t-webkit-mask-repeat: no-repeat;\n\t\t-webkit-mask-position: center;\n\t\tmask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-6 -6 12 12"><path d="M 6 0 L -5 6 L -5 -6 z" fill="gray"/></svg>');\n\t\tmask-repeat: no-repeat;\n\t\tmask-position: center;\n\t}\n\t.pauseButton::before {\n\t\tcontent: "";\n\t\tposition: absolute;\n\t\tleft: 6px;\n\t\ttop: 50%;\n\t\tmargin-top: -6px;\n\t\twidth: 12px;\n\t\theight: 12px;\n\t\tpointer-events: none;\n\t\tbackground: ${V.primaryText};\n\t\t-webkit-mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-6 -6 12 12"><rect x="-5" y="-6" width="3" height="12" fill="gray"/><rect x="2"  y="-6" width="3" height="12" fill="gray"/></svg>');\n\t\t-webkit-mask-repeat: no-repeat;\n\t\t-webkit-mask-position: center;\n\t\tmask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="-6 -6 12 12"><rect x="-5" y="-6" width="3" height="12" fill="gray"/><rect x="2"  y="-6" width="3" height="12" fill="gray"/></svg>');\n\t\tmask-repeat: no-repeat;\n\t\tmask-position: center;\n\t}\n\t\n\tinput[type=range] {\n\t\t-webkit-appearance: none;\n\t\tappearance: none;\n\t\theight: 16px;\n\t\tmargin: 0;\n\t\tcursor: pointer;\n\t\tbackground-color: ${V.editorBackground};\n\t\ttouch-action: pan-y;\n\t}\n\tinput[type=range]:focus {\n\t\toutline: none;\n\t}\n\tinput[type=range]::-webkit-slider-runnable-track {\n\t\twidth: 100%;\n\t\theight: 4px;\n\t\tcursor: pointer;\n\t\tbackground: ${V.uiWidgetBackground};\n\t}\n\tinput[type=range]::-webkit-slider-thumb {\n\t\theight: 16px;\n\t\twidth: 4px;\n\t\tborder-radius: 2px;\n\t\tbackground: ${V.primaryText};\n\t\tcursor: pointer;\n\t\t-webkit-appearance: none;\n\t\tmargin-top: -6px;\n\t}\n\tinput[type=range]:focus::-webkit-slider-runnable-track, input[type=range]:hover::-webkit-slider-runnable-track {\n\t\tbackground: ${V.uiWidgetFocus};\n\t}\n\tinput[type=range]::-moz-range-track {\n\t\twidth: 100%;\n\t\theight: 4px;\n\t\tcursor: pointer;\n\t\tbackground: ${V.uiWidgetBackground};\n\t}\n\tinput[type=range]:focus::-moz-range-track, input[type=range]:hover::-moz-range-track  {\n\t\tbackground: ${V.uiWidgetFocus};\n\t}\n\tinput[type=range]::-moz-range-thumb {\n\t\theight: 16px;\n\t\twidth: 4px;\n\t\tborder-radius: 2px;\n\t\tborder: none;\n\t\tbackground: ${V.primaryText};\n\t\tcursor: pointer;\n\t}\n\tinput[type=range]::-ms-track {\n\t\twidth: 100%;\n\t\theight: 4px;\n\t\tcursor: pointer;\n\t\tbackground: ${V.uiWidgetBackground};\n\t\tborder-color: transparent;\n\t}\n\tinput[type=range]:focus::-ms-track, input[type=range]:hover::-ms-track {\n\t\tbackground: ${V.uiWidgetFocus};\n\t}\n\tinput[type=range]::-ms-thumb {\n\t\theight: 16px;\n\t\twidth: 4px;\n\t\tborder-radius: 2px;\n\t\tbackground: ${V.primaryText};\n\t\tcursor: pointer;\n\t}\n`
    )
  ),
    V.setTheme(window.localStorage.getItem("colorTheme") || "jummbox classic");
  let Ot,
    Rt = null,
    Nt = ((4294967295 * Math.random()) >>> 0).toString(16),
    zt = !1,
    Lt = !1,
    Ht = 1,
    Bt = 0,
    Gt = 0;
  const Vt = new St();
  let $t = At(
      {
        style:
          "flex-grow: 1; margin: 0 1px; margin-left: 10px; overflow: hidden;",
      },
      ""
    ),
    Wt = xt({ target: "_top", style: "margin: 0 4px;" }, "✎ Edit"),
    jt = xt(
      { href: "javascript:void(0)", style: "margin: 0 4px;" },
      "⎘ Copy URL"
    ),
    Ut = xt({ href: "javascript:void(0)", style: "margin: 0 4px;" }, "⤳ Share"),
    Qt = xt({ target: "_top", style: "margin: 0 4px;" }, "⇱ Fullscreen"),
    _t = !1;
  const Jt = It({ style: "width: 100%; height: 100%; max-height: 50px;" }),
    Kt = Pt(
      {
        style:
          "flex-shrink: 0; display: flex; padding: 2px; width: 80px; height: 100%; box-sizing: border-box; align-items: center;",
      },
      Jt
    ),
    Yt = Et({
      d: "M 4 2 L 4 0 L 7 3 L 4 6 L 4 4 Q 2 4 2 6 Q 2 8 4 8 L 4 10 Q 0 10 0 6 Q 0 2 4 2 M 8 10 L 8 12 L 5 9 L 8 6 L 8 8 Q 10 8 10 6 Q 10 4 8 4 L 8 2 Q 12 2 12 6 Q 12 10 8 10 z",
    }),
    Xt = It(
      {
        title: "loop",
        style:
          "background: none; flex: 0 0 12px; margin: 0 3px; width: 12px; height: 12px; display: flex;",
      },
      Ct({ width: 12, height: 12, viewBox: "0 0 12 12" }, Yt)
    ),
    Zt = Ct(
      {
        style: "flex: 0 0 12px; margin: 0 1px; width: 12px; height: 12px;",
        viewBox: "0 0 12 12",
      },
      Et({
        fill: V.uiWidgetBackground,
        d: "M 1 9 L 1 3 L 4 3 L 7 0 L 7 12 L 4 9 L 1 9 M 9 3 Q 12 6 9 9 L 8 8 Q 10.5 6 8 4 L 9 3 z",
      })
    ),
    te = Tt({
      title: "volume",
      type: "range",
      value: 75,
      min: 0,
      max: 75,
      step: 1,
      style: "width: 12vw; max-width: 100px; margin: 0 1px;",
    }),
    ee = Ct(
      { width: 12, height: 12, viewBox: "0 0 12 12" },
      Dt({
        cx: "5",
        cy: "5",
        r: "4.5",
        "stroke-width": "1",
        stroke: "currentColor",
        fill: "none",
      }),
      Et({
        stroke: "currentColor",
        "stroke-width": "2",
        d: "M 8 8 L 11 11 M 5 2 L 5 8 M 2 5 L 8 5",
        fill: "none",
      })
    ),
    ne = It(
      {
        title: "zoom",
        style:
          "background: none; flex: 0 0 12px; margin: 0 3px; width: 12px; height: 12px; display: flex;",
      },
      ee
    ),
    ie = Ct({
      style: "min-width: 0; min-height: 0; touch-action: pan-y pinch-zoom;",
    }),
    ae = Pt({
      style: `position: absolute; left: 0; top: 0; width: 2px; height: 100%; background: ${V.playhead}; pointer-events: none;`,
    }),
    re = Pt(
      {
        style:
          "display: flex; flex-grow: 1; flex-shrink: 1; position: relative;",
      },
      ie,
      ae
    ),
    oe = Pt(
      {
        style:
          "display: flex; flex-grow: 1; flex-shrink: 1; height: 0; position: relative; align-items: center; overflow: hidden;",
      },
      re
    ),
    se = R.rect({
      "pointer-events": "none",
      width: "90%",
      height: "50%",
      x: "5%",
      y: "25%",
      fill: V.uiWidgetBackground,
    }),
    le = R.rect({
      "pointer-events": "none",
      height: "50%",
      width: "0%",
      x: "5%",
      y: "25%",
      fill: "url('#volumeGrad2')",
    }),
    ce = R.rect({
      "pointer-events": "none",
      width: "2px",
      height: "50%",
      x: "5%",
      y: "25%",
      fill: V.uiWidgetFocus,
    }),
    he = R.stop({ "stop-color": "lime", offset: "60%" }),
    pe = R.stop({ "stop-color": "orange", offset: "90%" }),
    de = R.stop({ "stop-color": "red", offset: "100%" }),
    me = R.linearGradient(
      { id: "volumeGrad2", gradientUnits: "userSpaceOnUse" },
      he,
      pe,
      de
    ),
    ue = R.defs({}, me),
    fe = R.svg(
      {
        style: "touch-action: none; overflow: hidden; margin: auto;",
        width: "160px",
        height: "10px",
        preserveAspectRatio: "none",
      },
      ue,
      se,
      le,
      ce
    );
  function ye(t, e) {
    try {
      localStorage.setItem(t, e);
    } catch (t) {}
  }
  function be(t) {
    try {
      return localStorage.getItem(t);
    } catch (t) {
      return null;
    }
  }
  function ge(t, e) {
    Vt.setSong(t), Vt.snapToStart();
    const n = Vt.song.toBase64String();
    Wt.href = "../#" + n;
  }
  function ve() {
    let t = location.hash;
    if (Rt != t && "" != t) {
      (Rt = t),
        "#" == t.charAt(0) && (t = t.substring(1)),
        (Qt.href = location.href);
      for (const e of t.split("&")) {
        let n = e.indexOf("=");
        if (-1 != n) {
          let t = e.substring(0, n),
            i = e.substring(n + 1);
          switch (t) {
            case "song":
              ge(i), Vt.song && ($t.textContent = Vt.song.title);
              break;
            case "loop":
              (Vt.loopRepeatCount = "1" != i ? 0 : -1), Oe();
          }
        } else ge(t);
      }
      De();
    }
  }
  document.body.appendChild(oe),
    document.body.appendChild(
      Pt(
        {
          style:
            "flex-shrink: 0; height: 20vh; min-height: 22px; max-height: 70px; display: flex; align-items: center;",
        },
        Kt,
        Xt,
        Zt,
        te,
        ne,
        fe,
        $t,
        Wt,
        jt,
        Ut,
        Qt
      )
    );
  let ke = null;
  function we() {
    if (!Vt.playing) return void clearInterval(ke);
    const t = be("playerId");
    null != t && t != Nt && (Se(), Ce(), clearInterval(ke));
  }
  function Me() {
    Vt.playing && ((Ot = requestAnimationFrame(Me)), Ce(), Fe()),
      zt != Vt.playing && Ee();
  }
  function Fe() {
    if (null == Vt.song)
      return ce.setAttribute("x", "5%"), void le.setAttribute("width", "0%");
    var t, e;
    Bt--,
      Bt <= 0 && (Gt -= 0.03),
      Vt.song.outVolumeCap > Gt && ((Gt = Vt.song.outVolumeCap), (Bt = 50)),
      (t = Vt.song.outVolumeCap),
      (e = Gt),
      le.setAttribute("width", "" + Math.min(144, 144 * t)),
      ce.setAttribute("x", "" + (8 + Math.min(144, 144 * e))),
      Vt.playing ||
        (ce.setAttribute("x", "5%"), le.setAttribute("width", "0%"));
  }
  function Se() {
    null != Vt.song &&
      (null != Ot && cancelAnimationFrame(Ot),
      (Ot = null),
      Vt.playing
        ? (Vt.pause(), Fe())
        : (Vt.play(),
          ye("playerId", Nt),
          Me(),
          clearInterval(ke),
          (ke = setInterval(we, 100)))),
      Ee();
  }
  function xe(t) {
    _t && (t.preventDefault(), Pe(t.clientX || t.pageX));
  }
  function Ie(t) {
    Pe(t.touches[0].clientX);
  }
  function Pe(t) {
    if (_t && null != Vt.song) {
      const e = oe.getBoundingClientRect();
      (Vt.playhead = (Vt.song.barCount * (t - e.left)) / (e.right - e.left)),
        Vt.computeLatestModValues(),
        Ce();
    }
  }
  function Ae() {
    _t = !1;
  }
  function Te() {
    const t = +te.value;
    Vt.volume = Math.min(1, Math.pow(t / 50, 0.5)) * Math.pow(2, (t - 75) / 25);
  }
  function Ce() {
    if (null != Vt.song) {
      let t = Vt.playhead / Vt.song.barCount;
      ae.style.left = Ht * t + "px";
      const e = oe.getBoundingClientRect();
      oe.scrollLeft = t * (Ht - e.width);
    }
  }
  function De() {
    if (((ie.innerHTML = ""), null == Vt.song)) return;
    const t = oe.getBoundingClientRect();
    let n, i, a;
    if (Lt) {
      (n = t.height),
        (i = Math.max(1, Math.min(e.pitchOctaves, Math.round(n / 24)))),
        (a = 12 * i + 1);
      const r = (n - 1) / a,
        o = Math.max(8, 4 * r);
      Ht = Math.max(t.width, o * Vt.song.barCount * Vt.song.beatsPerBar);
    } else {
      Ht = t.width;
      const r = Math.max(1, Ht / (Vt.song.barCount * Vt.song.beatsPerBar) / 6);
      (n = Math.min(t.height, r * (e.maxPitch + 1) + 1)),
        (i = Math.max(3, Math.min(e.pitchOctaves, Math.round(n / (12 * r))))),
        (a = 12 * i + 1);
    }
    (re.style.width = Ht + "px"),
      (re.style.height = n + "px"),
      (ie.style.width = Ht + "px"),
      (ie.style.height = n + "px");
    const r = Ht / Vt.song.barCount,
      o = r / (Vt.song.beatsPerBar * e.partsPerBeat),
      s = (n - 1) / a,
      l = (n - 1) / e.drumCount;
    for (let t = 0; t < Vt.song.barCount + 1; t++) {
      const e =
        t == Vt.song.loopStart || t == Vt.song.loopStart + Vt.song.loopLength
          ? V.loopAccent
          : V.uiWidgetBackground;
      ie.appendChild(qt({ x: t * r - 1, y: 0, width: 2, height: n, fill: e }));
    }
    for (let t = 0; t <= i; t++)
      ie.appendChild(
        qt({
          x: 0,
          y: 12 * t * s,
          width: Ht,
          height: s + 1,
          fill: V.tonic,
          opacity: 0.75,
        })
      );
    for (
      let t = Vt.song.channels.length - 1 - Vt.song.modChannelCount;
      t >= 0;
      t--
    ) {
      const a = Vt.song.getChannelIsNoise(t),
        c = a ? l : s,
        h = Vt.song.channels[t].octave,
        p =
          Math.max(0, Math.min(e.pitchOctaves - i, Math.ceil(h - 0.5 * i))) *
            c *
            12 +
          n -
          0.5 * c -
          0.5;
      for (let e = 0; e < Vt.song.barCount; e++) {
        const n = Vt.song.getPattern(t, e);
        if (null == n) continue;
        const i = e * r;
        for (let e = 0; e < n.notes.length; e++) {
          const r = n.notes[e];
          for (const e of r.pitches) {
            const n = qe(e, r.start, r.pins, (c + 1) / 2, i, p, o, c),
              s = Et({
                d: n,
                fill: V.getChannelColor(Vt.song, t).primaryChannel,
              });
            a && (s.style.opacity = String(0.6)), ie.appendChild(s);
          }
        }
      }
    }
    Ce();
  }
  function qe(t, n, i, a, r, o, s, l) {
    let c = `M ${r + s * (n + i[0].time)} ${
      o - t * l + a * (i[0].size / e.noteSizeMax)
    } `;
    for (let h = 0; h < i.length; h++) {
      const p = i[h];
      c += `L ${r + s * (n + p.time)} ${
        o - l * (t + p.interval) - a * (p.size / e.noteSizeMax)
      } `;
    }
    for (let h = i.length - 1; h >= 0; h--) {
      const p = i[h];
      c += `L ${r + s * (n + p.time)} ${
        o - l * (t + p.interval) + a * (p.size / e.noteSizeMax)
      } `;
    }
    return c;
  }
  function Ee() {
    Vt.playing
      ? (Jt.classList.remove("playButton"),
        Jt.classList.add("pauseButton"),
        (Jt.title = "Pause (Space)"),
        (Jt.textContent = "Pause"))
      : (Jt.classList.remove("pauseButton"),
        Jt.classList.add("playButton"),
        (Jt.title = "Play (Space)"),
        (Jt.textContent = "Play")),
      (zt = Vt.playing);
  }
  function Oe() {
    Yt.setAttribute(
      "fill",
      -1 == Vt.loopRepeatCount ? V.linkAccent : V.uiWidgetBackground
    );
  }
  function Re() {
    ee.style.color = Lt ? V.linkAccent : V.uiWidgetBackground;
  }
  return (
    top !== self
      ? ((jt.style.display = "none"), (Ut.style.display = "none"))
      : ((Qt.style.display = "none"),
        "share" in navigator || (Ut.style.display = "none")),
    null != be("volume") && (te.value = be("volume")),
    Te(),
    window.addEventListener("resize", function () {
      De();
    }),
    window.addEventListener("keydown", function (t) {
      switch (t.keyCode) {
        case 70:
          (Vt.playhead = 0),
            Vt.computeLatestModValues(),
            Ce(),
            t.preventDefault();
          break;
        case 32:
          Se(), Vt.computeLatestModValues(), t.preventDefault();
          break;
        case 219:
          Vt.goToPrevBar(),
            Vt.computeLatestModValues(),
            Ce(),
            t.preventDefault();
          break;
        case 221:
          Vt.goToNextBar(),
            Vt.computeLatestModValues(),
            Ce(),
            t.preventDefault();
      }
    }),
    ie.addEventListener("mousedown", function (t) {
      (_t = !0), xe(t);
    }),
    window.addEventListener("mousemove", xe),
    window.addEventListener("mouseup", Ae),
    ie.addEventListener("touchstart", function (t) {
      (_t = !0), Ie(t);
    }),
    ie.addEventListener("touchmove", Ie),
    ie.addEventListener("touchend", Ae),
    ie.addEventListener("touchcancel", Ae),
    Jt.addEventListener("click", Se),
    Xt.addEventListener("click", function () {
      -1 == Vt.loopRepeatCount
        ? (Vt.loopRepeatCount = 0)
        : (Vt.loopRepeatCount = -1),
        Oe();
    }),
    te.addEventListener("input", function () {
      ye("volume", te.value), Te();
    }),
    ne.addEventListener("click", function () {
      (Lt = !Lt), Re(), De();
    }),
    jt.addEventListener("click", function () {
      let t;
      if (((t = navigator), t.clipboard && t.clipboard.writeText))
        return void t.clipboard.writeText(location.href).catch(() => {
          window.prompt("Copy to clipboard:", location.href);
        });
      const e = document.createElement("textarea");
      (e.textContent = location.href), document.body.appendChild(e), e.select();
      const n = document.execCommand("copy");
      e.remove(), n || window.prompt("Copy this:", location.href);
    }),
    Ut.addEventListener("click", function () {
      navigator.share({ url: location.href });
    }),
    window.addEventListener("hashchange", ve),
    ve(),
    Oe(),
    Re(),
    Ee(),
    (t.Channel = bt),
    (t.Config = e),
    (t.Instrument = yt),
    (t.Note = ot),
    (t.Pattern = st),
    (t.Synth = St),
    (t.edit = Wt),
    (t.main = Vt),
    (t.startPlaying = Se),
    Object.defineProperty(t, "J", { value: !0 }),
    t
  );
})({});
//# sourceMappingURL=beepbox_player.min.js.map
