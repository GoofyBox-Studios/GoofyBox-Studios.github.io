/* global GravitySensor Gyroscope mousedown mouseup mousemove JSZip */

var Input;
var Sprite;
var MultiSoundEffect;
var SoundEffect;
var SpritesFromZip;
var Sound;
var AudioNode;

(function() {
	var hasActionOccurred = false;
	var canUseJSZIP = false;

	const events = {
		imagesloaded: [],
		pointerlockchange: [],
	};

	const MULTI_SOUND_COUNT = 20;

	const validKeys = [
		"Backspace",
		"Tab",
		"Enter",
		"ShiftLeft",
		"ShiftRight",
		"ControlLeft",
		"ControlRight",
		"AltLeft",
		"AltRight",
		"Pause",
		"CapsLock",
		"Escape",
		"Space",
		"PageUp",
		"PageDown",
		"End",
		"Home",
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"PrintScreen",
		"Insert",
		"Delete",
		"Digit0",
		"Digit1",
		"Digit2",
		"Digit3",
		"Digit4",
		"Digit5",
		"Digit6",
		"Digit7",
		"Digit8",
		"Digit9",
		"KeyA",
		"KeyB",
		"KeyC",
		"KeyD",
		"KeyE",
		"KeyF",
		"KeyG",
		"KeyH",
		"KeyI",
		"KeyJ",
		"KeyL",
		"KeyM",
		"KeyN",
		"KeyO",
		"KeyP",
		"KeyQ",
		"KeyR",
		"KeyS",
		"KeyT",
		"KeyU",
		"KeyV",
		"KeyW",
		"KeyX",
		"KeyY",
		"KeyZ",
		"MetaLeft",
		"MetaRight",
		"ContextMenu",
		"Numpad0",
		"Numpad1",
		"Numpad2",
		"Numpad3",
		"Numpad4",
		"Numpad5",
		"Numpad6",
		"Numpad7",
		"Numpad8",
		"Numpad9",
		"NumpadMultiply",
		"NumpadAdd",
		"NumpadSubtract",
		"NumpadDecimal",
		"NumpadDivide",
		"F1",
		"F2",
		"F3",
		"F4",
		"F5",
		"F6",
		"F7",
		"F8",
		"F9",
		"F10",
		"F11",
		"F12",
		"NumLock",
		"ScrollLock",
		"Semicolon",
		"Equal",
		"Comma",
		"Minus",
		"Period",
		"Slash",
		"Backquote",
		"BracketLeft",
		"BracketRight",
		"Backslash",
		"Quote",
	];
	Object.freeze(validKeys);

	class Action {
		constructor() {
			this.keys = [];
			this.buttons = [];
			this.axes = [];

			for (let arg of arguments) {
				if (typeof arg == "string") {
					this.keys.push(arg);
				} else {
					this.addButton(arg);
				}
			}

			this._callbacksPress = [];
			this._callbacksRelease = [];

			this.isAction = true;
		}

		addButtons() {
			for (let b of arguments) {
				this.addButton(b);
			}
		}

		addButton(id) {
			this.buttons.push({
				id: id,
				player: 0
			});
			this.buttons.push({
				id: id,
				player: 1
			});
			this.buttons.push({
				id: id,
				player: 2
			});
			this.buttons.push({
				id: id,
				player: 3
			});
		}

		removeButton(id) {
			let ret = false;
			for (let idx in this.buttons) {
				if (this.buttons[idx].id == id) {
					ret = this.buttons.splice(idx, 1);
				}
			}
			return ret;
		}

		addAxes() {
			for (let a of arguments) {
				this.addAxis(a);
			}
		}

		addAxis(id) {
			this.axes.push({
				id: id,
				player: 0,
				deadzone: 0.5
			});
			this.axes.push({
				id: id,
				player: 1,
				deadzone: 0.5
			});
			this.axes.push({
				id: id,
				player: 2,
				deadzone: 0.5
			});
			this.axes.push({
				id: id,
				player: 3,
				deadzone: 0.5
			});
		}

		removeAxis(id) {
			let ret = false;
			for (let idx in this.axes) {
				if (this.axes[idx].id == id) {
					ret = this.axes.splice(idx, 1);
				}
			}
			return ret;
		}

		addKey(key = "") {
			if (key) {
				this.keys.push(key);
			}
		}

		removeKey(key = "") {
			if (this.hasKey(key)) {
				return this.keys.splice(this.keys.indexOf(key), 1);
			}
			return false;
		}

		hasKey(key = "") {
			return this.keys.includes(key);
		}

		hasButton(buttonId = -1) {
			for (let button of this.buttons) {
				if (button.id == buttonId) return true;
			}

			return false;
		}

		getName() {
			for (let actionId in Input.actions) {
				if (Input.actions[actionId] == this) {
					return actionId;
				}
			}

			return "";
		}

		is_pressed() {
			const name = this.getName();

			return Input.is_action_pressed(name);
		}

		is_just_pressed() {
			const name = this.getName();

			return Input.is_action_just_pressed(name);
		}

		is_just_released() {
			const name = this.getName();

			return Input.is_action_just_released(name);
		}

		onPress(callback) {
			this._callbacksPress.push(callback);

			return this;
		}

		onRelease(callback) {
			this._callbacksRelease.push(callback);

			return this;
		}

		_activateCallbacks(pressed) {
			if (pressed) {
				for (let callback of this._callbacksPress) {
					callback();
				}
			} else {
				for (let callback of this._callbacksRelease) {
					callback();
				}
			}
		}
	}

	const __Input = {
		debug: false,
		
		
		
		
		_lockPointer: false,
		_lockPointerElements: [],
		_preventKeys: ["MetaLeft", "CtrlLeft", "MetaRight", "CtrlRight"],
		_erroredActions: [],

		_gravity: {
			x: 0,
			y: 0,
			z: 0
		},
		_gravity_sensor: null,
		_gyroscope: null,
		_angular_velocity: {
			x: 0,
			y: 0,
			z: 0
		},
		_is_motion_allowed: false,

		pointerLocked: false,
		keys: {},

		buttons: [{},
			{},
			{},
			{}
		],
		axes: [{},
			{},
			{},
			{}
		],

		gamepads: [],
		frame: 0,

		_mousePosition: {
			x: 0,
			y: 0
		},

		// BUTTONS
		BUTTON_MOUSE_LEFT: 40,
		BUTTON_MOUSE_RIGHT: 41,
		BUTTON_MOUSE_MIDDLE: 42,
		BUTTON_MOUSE_BACK: 43,
		BUTTON_MOUSE_FORWARD: 44,

		BUTTON_GAMEPAD_DUALSHOCK_CROSS: 0,
		BUTTON_GAMEPAD_DUALSHOCK_CIRCLE: 1,
		BUTTON_GAMEPAD_DUALSHOCK_SQUARE: 2,
		BUTTON_GAMEPAD_DUALSHOCK_TRIANGLE: 3,
		BUTTON_GAMEPAD_DUALSHOCK_PS: 16,
		BUTTON_GAMEPAD_DUALSHOCK_MICROPHONE: 17,
		BUTTON_GAMEPAD_DUALSHOCK_TOUCHPAD: 22,

		BUTTON_GAMEPAD_XBOX_A: 0,
		BUTTON_GAMEPAD_XBOX_B: 1,
		BUTTON_GAMEPAD_XBOX_X: 2,
		BUTTON_GAMEPAD_XBOX_Y: 3,
		BUTTON_GAMEPAD_XBOX_SHARE: 17,
		BUTTON_GAMEPAD_XBOX_PADDLE_1: 18,
		BUTTON_GAMEPAD_XBOX_PADDLE_2: 19,
		BUTTON_GAMEPAD_XBOX_PADDLE_3: 20,
		BUTTON_GAMEPAD_XBOX_PADDLE_4: 21,

		BUTTON_GAMEPAD_NINTENDO_DUAL_B: 0,
		BUTTON_GAMEPAD_NINTENDO_DUAL_A: 1,
		BUTTON_GAMEPAD_NINTENDO_DUAL_Y: 2,
		BUTTON_GAMEPAD_NINTENDO_DUAL_X: 3,
		BUTTON_GAMEPAD_NINTENDO_DUAL_HOME: 16,
		BUTTON_GAMEPAD_NINTENDO_DUAL_CAPTURE: 17,
		BUTTON_GAMEPAD_NINTENDO_DUAL_LEFT: 10,
		BUTTON_GAMEPAD_NINTENDO_DUAL_RIGHT: 11,
		BUTTON_GAMEPAD_NINTENDO_DUAL_MINUS: 8,
		BUTTON_GAMEPAD_NINTENDO_DUAL_PLUS: 9,
		BUTTON_GAMEPAD_NINTENDO_DUAL_RIGHT_SL: 20,
		BUTTON_GAMEPAD_NINTENDO_DUAL_RIGHT_SR: 21,
		BUTTON_GAMEPAD_NINTENDO_DUAL_LEFT_SL: 18,
		BUTTON_GAMEPAD_NINTENDO_DUAL_LEFT_SR: 19,
		
		BUTTON_GAMEPAD_NINTENDO_B: 0,
		BUTTON_GAMEPAD_NINTENDO_A: 1,
		BUTTON_GAMEPAD_NINTENDO_Y: 2,
		BUTTON_GAMEPAD_NINTENDO_X: 3,
		BUTTON_GAMEPAD_NINTENDO_HOME: 16,
		BUTTON_GAMEPAD_NINTENDO_SL: 4,
		BUTTON_GAMEPAD_NINTENDO_SR: 5,
		BUTTON_GAMEPAD_NINTENDO_PLUS: 9,
		BUTTON_GAMEPAD_NINTENDO_JOY: 10,
		BUTTON_GAMEPAD_NINTENDO_L2: 7,
		BUTTON_GAMEPAD_NINTENDO_L1: 8,

		BUTTON_GAMEPAD_L1: 4,
		BUTTON_GAMEPAD_R1: 5,
		BUTTON_GAMEPAD_L2: 6,
		BUTTON_GAMEPAD_R2: 7,
		BUTTON_GAMEPAD_L3: 8,
		BUTTON_GAMEPAD_R3: 9,

		BUTTON_GAMEPAD_START: 10,
		BUTTON_GAMEPAD_SELECT: 11,

		BUTTON_GAMEPAD_DPAD_UP: 12,
		BUTTON_GAMEPAD_DPAD_DOWN: 13,
		BUTTON_GAMEPAD_DPAD_LEFT: 14,
		BUTTON_GAMEPAD_DPAD_RIGHT: 15,

		BUTTON_GAMEPAD_HOME: 16,
		
		// AXES
		// AXIS_GAMEPAD_NINTENDO_LEFT: 80,
		// AXIS_GAMEPAD_NINTENDO_RIGHT: 82,

		AXIS_GAMEPAD_LEFT_STICK_LEFT: 80,
		AXIS_GAMEPAD_LEFT_STICK_RIGHT: 81,
		AXIS_GAMEPAD_LEFT_STICK_UP: 82,
		AXIS_GAMEPAD_LEFT_STICK_DOWN: 83,
		AXIS_GAMEPAD_RIGHT_STICK_LEFT: 84,
		AXIS_GAMEPAD_RIGHT_STICK_RIGHT: 85,
		AXIS_GAMEPAD_RIGHT_STICK_UP: 86,
		AXIS_GAMEPAD_RIGHT_STICK_DOWN: 87,
		
		AXIS_GAMEPAD_LEFT_STICK: 88,
		AXIS_GAMEPAD_RIGHT_STICK: 89,

		// CURSORS
		CURSOR_ALIAS: "alias",
		CURSOR_ALL_SCROLL: "all-scroll",
		CURSOR_AUTO: "auto",
		CURSOR_CELL: "cell",
		CURSOR_CONTEXT_MENU: "context-menu",
		CURSOR_COL_RESIZE: "col-resize",
		CURSOR_COPY: "copy",
		CURSOR_CROSSHAIR: "crosshair",
		CURSOR_DEFAULT: "default",
		CURSOR_E_RESIZE: "e-resize",
		CURSOR_EW_RESIZE: "ew-resize",
		CURSOR_WE_RESIZE: "ew-resize",
		CURSOR_HELP: "help",
		CURSOR_MOVE: "move",
		CURSOR_N: "n-resize",
		CURSOR_NE: "ne-resize",
		CURSOR_EN: "ne-resize",
		CURSOR_NESW: "nesw-resize",
		CURSOR_NEWS: "nesw-resize",
		CURSOR_ENSW: "nesw-resize",
		CURSOR_ENWS: "nesw-resize",
		CURSOR_SWNE: "nesw-resize",
		CURSOR_SWEN: "nesw-resize",
		CURSOR_WSNE: "nesw-resize",
		CURSOR_WSEN: "nesw-resize",
		CURSOR_NS_RESIZE: "ns-resize",
		CURSOR_SN_RESIZE: "ns-resize",
		CURSOR_NW_RESIZE: "nw-resize",
		CURSOR_WN_RESIZE: "nw-resize",
		CURSOR_NWSE: "nwse-resize",
		CURSOR_NWES: "nwse-resize",
		CURSOR_ESNW: "nwse-resize",
		CURSOR_SENW: "nwse-resize",
		CURSOR_ESWN: "nwse-resize",
		CURSOR_SEWN: "nwse-resize",
		CURSOR_WNES: "nwse-resize",
		CURSOR_WNSE: "nwse-resize",
		CURSOR_NO_DROP: "no-drop",
		CURSOR_NONE: "none",
		CURSOR_NOT_ALLOWED: "not-allowed",
		CURSOR_POINTER: "pointer",
		CURSOR_PROGRESS: "progress",
		CURSOR_ROW_RESIZE: "row-resize",
		CURSOR_S_RESIZE: "s-resize",
		CURSOR_SE_RESIZE: "se-resize",
		CURSOR_ES_RESIZE: "se-resize",
		CURSOR_SW_RESIZE: "sw-resize",
		CURSOR_WS_RESIZE: "sw-resize",
		CURSOR_TEXT: "text",
		CURSOR_VERTICAL_TEXT: "vertical-text",
		CURSOR_W_RESIZE: "w-resize",
		CURSOR_WAIT: "wait",
		CURSOR_ZOOM_IN: "zoom-in",
		CURSOR_ZOOM_OUT: "zoom-out",

		// _isActionJustPressedCalls: 0,
		// _hasBeenUpdated: false,
		// _hasErrored: false,

		validKeys: function() {
			return validKeys;
		},

		actions: {},

		inputEvents: {},

		get_gravity: function() {
			return {
				x: Input._gravity.x,
				y: Input._gravity.y,
				z: Input._gravity.z
			};
		},

		get_gyroscope: function() {
			return {
				x: Input._angular_velocity.x,
				y: Input._angular_velocity.y,
				z: Input._angular_velocity.z,
			};
		},

		//   get_axis: function (index) {
		//     let x = Input.axes[0][index    ]?.value ?? 0;
		//     let y = Input.axes[0][index + 1]?.value ?? 0;

		//     if (Math.abs(x) + Math.abs(y) < 0.1) {
		//       return {x: 0, y: 0};
		//     }
		//     return {
		//       x,
		//       y,
		//     }
		//   },

		add_action: function(action = "", codes) {
			if (action) {
				let newCodes = [];
				let buttons = [];
				let axes = [];
				for (let code of (codes ?? [])) {
					if (typeof code == "string") {
						newCodes.push(code);
					} else if (typeof code == "number") {
						if (code < 80) {
							buttons.push(code);
						} else {
							axes.push(code);
						}
					}
				}
				Input.actions[action] = new Action(...newCodes);
				Input.actions[action].addButtons(...buttons);
				Input.actions[action].addAxes(...axes);
			}
		},

		remove_action: function(action = "") {
			if (action && Input.actions[action]) {
				Input.actions[action] = undefined;
			}
		},

		add_button_to_action: function(action = "", button = -1) {
			if (Input.actions[action] && button > -1) {
				Input.actions[action].addButton(button);
			}
		},

		add_key_to_action: function(action = "", key = "") {
			if (Input.actions[action] && key) {
				Input.actions[action].addKey(key);
			}
		},

		is_action_just_released: function(action = "") {
			if (action) {
				let a = Input.actions[action];
				if (!a) {
					if (!Input._erroredActions.includes(action)) {
						console.warn('Unknown action: "' + action + '"');
					}
					Input._erroredActions.push(action);
					return false;
				}

				for (let key of a.keys) {
					if (
						Input.keys[key] &&
						!Input.keys[key].down &&
						Input.keys[key].frame == Input.frame - 1
					) {
						return true;
					}
				}

				// for (let button of a.buttons) {
				//   if (Input.buttons[button.player][button.id] && Input.buttons[button.player][button.id].frame == Input.frame - 1) {
				//     return true;
				//   }
				// }
			}
			return false;
		},

		is_action_just_pressed: function(action = "") {
			if (action) {
				let a = Input.actions[action];
				if (!a) {
					if (!Input._erroredActions.includes(action)) {
						console.warn('Unknown action: "' + action + '"');
					}
					Input._erroredActions.push(action);
					return false;
				}

				for (let key of a.keys) {
					if (
						Input.keys[key]?.down &&
						Input.keys[key].frame == Input.frame - 1
					) {
						return true;
					}
				}

				for (let button of a.buttons) {
					if (
						Input.buttons[button.player][button.id] &&
						Input.buttons[button.player][button.id].frame == Input.frame - 1
					) {
						return true;
					}
				}

				for (let axis of a.axes) {
					if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_LEFT) {
						const v = Input.axes[axis.player][0];
						if (
							v &&
							v.value < -axis.deadzone &&
							v.lastValue >= -axis.deadzone &&
							v.frame == Input.frame - 1
						) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_RIGHT) {
						const v = Input.axes[axis.player][0];
						if (
							v &&
							v.value > axis.deadzone &&
							v.lastValue <= axis.deadzone &&
							v.frame == Input.frame - 1
						) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_UP) {
						const v = Input.axes[axis.player][1];
						if (
							v &&
							v.value < -axis.deadzone &&
							v.lastValue >= -axis.deadzone &&
							v.frame == Input.frame - 1
						) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_DOWN) {
						const v = Input.axes[axis.player][1];
						if (
							v &&
							v.value > axis.deadzone &&
							v.lastValue <= axis.deadzone &&
							v.frame == Input.frame - 1
						) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_LEFT) {
						const v = Input.axes[axis.player][2];
						if (
							v &&
							v.value < -axis.deadzone &&
							v.lastValue >= -axis.deadzone &&
							v.frame == Input.frame - 1
						) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_RIGHT) {
						const v = Input.axes[axis.player][2];
						if (
							v &&
							v.value > axis.deadzone &&
							v.lastValue <= axis.deadzone &&
							v.frame == Input.frame - 1
						) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_UP) {
						const v = Input.axes[axis.player][3];
						if (
							v &&
							v.value < -axis.deadzone &&
							v.lastValue >= -axis.deadzone &&
							v.frame == Input.frame - 1
						) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_DOWN) {
						const v = Input.axes[axis.player][3];
						if (
							v &&
							v.value > axis.deadzone &&
							v.lastValue <= axis.deadzone &&
							v.frame == Input.frame - 1
						) {
							return true;
						}
					}
				}
			}
			return false;
		},

		is_action_pressed: function(action = "") {
			if (action) {
				let a = Input.actions[action];
				if (!a) {
					if (!Input._erroredActions.includes(action)) {
						console.warn('Unknown action: "' + action + '"');
					}
					Input._erroredActions.push(action);
					return false;
				}

				for (let key of a.keys) {
					if (Input.keys[key]?.down) {
						return true;
					}
				}

				for (let button of a.buttons) {
					if (Input.buttons[button.player][button.id]) {
						return true;
					}
				}

				for (let axis of a.axes) {
					if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_LEFT) {
						const v = Input.axes[axis.player][0];
						if (v && v.value < -axis.deadzone) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_RIGHT) {
						const v = Input.axes[axis.player][0];
						if (v && v.value > axis.deadzone) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_UP) {
						const v = Input.axes[axis.player][1];
						if (v && v.value < -axis.deadzone) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_DOWN) {
						const v = Input.axes[axis.player][1];
						if (v && v.value > axis.deadzone) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_LEFT) {
						const v = Input.axes[axis.player][2];
						if (v && v.value < -axis.deadzone) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_RIGHT) {
						const v = Input.axes[axis.player][2];
						if (v && v.value > axis.deadzone) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_UP) {
						const v = Input.axes[axis.player][3];
						if (v && v.value < -axis.deadzone) {
							return true;
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_DOWN) {
						const v = Input.axes[axis.player][3];
						if (v && v.value > axis.deadzone) {
							return true;
						}
					}
				}
			}
			return false;
		},

		get_connected_joypads: function() {
			const out = [];
			for (let gamepad of Input.gamepads) {
				if (gamepad) {
					out.push(gamepad.id);
				}
			}
			return out;
		},

		get_joy_axis: function(device, axis) {
			const DEFAULT_AXIS = {x: 0, y: 0};
			if (!Input.axes[device]) return DEFAULT_AXIS;
			
			switch (axis) {
				case Input.AXIS_GAMEPAD_LEFT_STICK:
					return {x: Input.axes[device][0]?.value ?? 0, y: Input.axes[device][1]?.value ?? 0};
				case Input.AXIS_GAMEPAD_RIGHT_STICK:
					return {x: Input.axes[device][2]?.value ?? 0, y: Input.axes[device][3]?.value ?? 0};
			}
			
			return DEFAULT_AXIS;
		},

		get_action_raw_strength: function(action = "") {
			if (action) {
				let a = Input.actions[action];
				if (!a) {
					if (!Input._erroredActions.includes(action)) {
						console.warn('Unknown action: "' + action + '"');
					}
					Input._erroredActions.push(action);
					return false;
				}

				let strength = 0;

				for (let key of a.keys) {
					if (Input.keys[key]?.down) {
						strength = 1;
						break;
					}
				}

				for (let button of a.buttons) {
					if (Input.buttons[button.player][button.id]) {
						strength = Math.max(
							strength,
							Input.buttons[button.player][button.id].value
						);
					}
				}

				for (let axis of a.axes) {
					if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_LEFT) {
						const v = Input.axes[axis.player][0];
						if (v && v.value < 0) {
							strength = Math.max(strength, Math.abs(v.value));
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_RIGHT) {
						const v = Input.axes[axis.player][0];
						if (v && v.value > 0) {
							strength = Math.max(strength, v.value);
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_UP) {
						const v = Input.axes[axis.player][1];
						if (v && v.value < -0) {
							strength = Math.max(strength, Math.abs(v.value));
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_DOWN) {
						const v = Input.axes[axis.player][1];
						if (v && v.value > 0) {
							strength = Math.max(strength, v.value);
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_LEFT) {
						const v = Input.axes[axis.player][2];
						if (v && v.value < 0) {
							strength = Math.max(strength, Math.abs(v.value));
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_RIGHT) {
						const v = Input.axes[axis.player][2];
						if (v && v.value > 0) {
							strength = Math.max(strength, v.value);
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_UP) {
						const v = Input.axes[axis.player][3];
						if (v && v.value < -0) {
							strength = Math.max(strength, Math.abs(v.value));
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_DOWN) {
						const v = Input.axes[axis.player][3];
						if (v && v.value > 0) {
							strength = Math.max(strength, v.value);
						}
					}
				}

				return strength;
			}
			return false;
		},

		get_action_strength: function(action = "") {
			if (action) {
				let a = Input.actions[action];
				if (!a) {
					if (!Input._erroredActions.includes(action)) {
						console.warn('Unknown action: "' + action + '"');
					}
					Input._erroredActions.push(action);
					return false;
				}

				let strength = 0;

				for (let key of a.keys) {
					if (Input.keys[key]?.down) {
						strength = 1;
						break;
					}
				}

				for (let button of a.buttons) {
					if (Input.buttons[button.player][button.id]) {
						strength = Math.max(
							strength,
							Input.buttons[button.player][button.id].value
						);
					}
				}

				for (let axis of a.axes) {
					if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_LEFT) {
						const v = Input.axes[axis.player][0];
						if (v && v.value < -axis.deadzone) {
							strength = Math.max(strength, Math.abs(v.value));
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_RIGHT) {
						const v = Input.axes[axis.player][0];
						if (v && v.value > axis.deadzone) {
							strength = Math.max(strength, v.value);
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_UP) {
						const v = Input.axes[axis.player][1];
						if (v && v.value < -axis.deadzone) {
							strength = Math.max(strength, Math.abs(v.value));
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_LEFT_STICK_DOWN) {
						const v = Input.axes[axis.player][1];
						if (v && v.value > axis.deadzone) {
							strength = Math.max(strength, v.value);
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_LEFT) {
						const v = Input.axes[axis.player][2];
						if (v && v.value < 0) {
							strength = Math.max(strength, Math.abs(v.value));
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_RIGHT) {
						const v = Input.axes[axis.player][2];
						if (v && v.value > 0) {
							strength = Math.max(strength, v.value);
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_UP) {
						const v = Input.axes[axis.player][3];
						if (v && v.value < -0) {
							strength = Math.max(strength, Math.abs(v.value));
						}
					} else if (axis.id == Input.AXIS_GAMEPAD_RIGHT_STICK_DOWN) {
						const v = Input.axes[axis.player][3];
						if (v && v.value > 0) {
							strength = Math.max(strength, v.value);
						}
					}
				}

				return strength;
			}
			return false;
		},

		is_joy_button_pressed: function(device, button) {
			return Input.buttons[device]?.[button]?.value ?? false;
		},

		is_gamepad_known: function(device) {
			return !!Input.gamepads[device];
		},

		set_cursor: function(cursor) {
			document.body.style.cursor = cursor;
		},

		is_mouse_button_pressed: function(button) {
			if (
				button == Input.BUTTON_MOUSE_LEFT ||
				button == Input.BUTTON_MOUSE_RIGHT ||
				button == Input.BUTTON_MOUSE_MIDDLE ||
				button == Input.BUTTON_MOUSE_BACK ||
				button == Input.BUTTON_MOUSE_FORWARD
			) {
				return !!Input.buttons[0][button];
			}
		},

		get_mouse_position: function() {
			return {
				x: this._mousePosition.x,
				y: this._mousePosition.y
			};
		},

		start_joy_vibration: function (device, magnitude, duration) {
			const actuator = Input.gamepads[device]?.vibrationActuator;
			
			if (!actuator) return;
			
			if (actuator.pulse) {
				actuator.pulse(magnitude, duration);
			} else {
				actuator.playEffect("dual-rumble", {
					startDelay: 0,
					duration,
					weakMagnitude: magnitude,
					strongMagnitude: magnitude,
				});
			}
		},

		get_axis: function(negative_action, positive_action) {
			return (
				Input.get_action_strength(positive_action) -
				Input.get_action_strength(negative_action)
			);
		},

		get_vector: function (negative_x, positive_x, negative_y, positive_y, deadzone = -1.0) {
			return {
				x: Input._apply_deadzone(
						Input.get_action_raw_strength(positive_x),
						deadzone
					) -
					Input._apply_deadzone(
						Input.get_action_raw_strength(negative_x),
						deadzone
					),
				y: Input._apply_deadzone(
						Input.get_action_raw_strength(positive_y),
						deadzone
					) -
					Input._apply_deadzone(
						Input.get_action_raw_strength(negative_y),
						deadzone
					),
			};
		},

		_apply_deadzone: function (value, deadzone) {
			if (value < deadzone) {
				return 0;
			}
			return value;
		},

		preventKey: function (code) {
			if (!Input._preventKeys.includes(code)) {
				Input._preventKeys.push(code);
			}
		},

		lockPointerOnClick: function (element) {
			Input._lockPointer = true;
			
			if (element) {
				Input._lockPointerElements.push(element);
			}
		},

		_init: function() {
			Input.add_action("ui_up", [
				"ArrowUp",
				Input.BUTTON_GAMEPAD_DPAD_UP
			]);
			Input.add_action("ui_down", [
				"ArrowDown",
				Input.BUTTON_GAMEPAD_DPAD_DOWN,
			]);
			Input.add_action("ui_left", [
				"ArrowLeft",
				Input.BUTTON_GAMEPAD_DPAD_LEFT,
			]);
			Input.add_action("ui_right", [
				"ArrowRight",
				Input.BUTTON_GAMEPAD_DPAD_RIGHT,
			]);

			Input._is_motion_allowed = true;
			try {
				Input._gravity_sensor = new GravitySensor({
					frequency: 60
				});
				Input._gyroscope = new Gyroscope({
					frequency: 60
				});
				Input._gravity_sensor.addEventListener("reading", (e) => {
					Input._gravity.x = Input._gravity_sensor.x;
					Input._gravity.y = Input._gravity_sensor.y;
					Input._gravity.z = Input._gravity_sensor.z;
				});
				Input._gravity_sensor.start();

				Input._gyroscope.addEventListener("reading", (e) => {
					Input._angularVelocity.x = Input._gyroscope.x;
					Input._angularVelocity.y = Input._gyroscope.y;
					Input._angularVelocity.z = Input._gyroscope.z;
				});
				Input._gyroscope.start();
			} catch (e) {
				Input._is_motion_allowed = false;
				console.warn("Engine.js: Motion Controls are not enabled");
			}

			Input._update();
		},

		_update: function() {
			Input.frame++;

			Input.gamepads = navigator.getGamepads();
			if (Input.gamepads.length > 0) {
				for (let padIdx in Input.gamepads) {
					let pad = Input.gamepads[padIdx];
					if (pad && !isNaN(+padIdx)) {
						for (let idx in pad.buttons) {
							let button = pad.buttons[idx];
							let p = button.pressed;
							if (p != !!Input.buttons[padIdx][idx]) {
								if (p) {
									Input.buttons[padIdx][idx] = {
										frame: Input.frame - 1,
										value: button.value,
										lastValue: Input.buttons[padIdx][idx]?.value,
									};
								} else {
									Input.buttons[padIdx][idx] = undefined;
								}
							}
						}

						for (let idx in pad.axes) {
							if (!isNaN(+idx)) {
								let axis = pad.axes[idx];
								Input.axes[padIdx][idx] = {
									frame: Input.frame - 1,
									value: axis,
									lastValue: Input.axes[padIdx][idx]?.value,
								};
							}
						}
					}
				}
			}

			requestAnimationFrame(Input._update);
		},

		_updateEvents: function(newEvent) {
			if (newEvent.type == "onkeydown") {
				for (let actionName in this.actions) {
					const action = this.actions[actionName];

					if (action.hasKey(newEvent.code)) {
						action._activateCallbacks(true);
					}
				}
			} else if (newEvent.type == "onkeyup") {
				for (let actionName in this.actions) {
					const action = this.actions[actionName];

					if (action.hasKey(newEvent.code)) {
						action._activateCallbacks(false);
					}
				}
			} else if (newEvent.type == "onmousedown") {
				for (let actionName in this.actions) {
					const action = this.actions[actionName];

					if (action.hasButton(newEvent.inputButton)) {
						action._activateCallbacks(true);
					}
				}
			} else if (newEvent.type == "onmouseup") {
				for (let actionName in this.actions) {
					const action = this.actions[actionName];

					if (action.hasButton(newEvent.inputButton)) {
						action._activateCallbacks(false);
					}
				}
			}
		},

		Action: function(actionName) {
			if (actionName == "") return null;
			if (!this.actions[actionName]) return null;

			const action = this.actions[actionName];
			return action;
		},

		Key: function(key) {
			if (!validKeys.includes(key)) return false;
		},
	};

	document.addEventListener("visibilitychange", function(e) {
		if (document.visibilityState == "hidden") {
			Input.keys = {};
		}
	});

	document.body.addEventListener("keydown", function(e) {
		hasActionOccurred = true;
		if (!e.repeat) {
			Input.keys[e.code] = {
				down: true,
				frame: Input.frame
			};

			Input._updateEvents({
				type: "onkeydown",
				code: e.code
			});
		}
		if (Input._preventKeys.includes(e.code)) {
			e.preventDefault();
		}
	});

	document.body.addEventListener("keyup", function(e) {
		Input.keys[e.code] = {
			down: false,
			frame: Input.frame
		};

		Input._updateEvents({
			type: "onkeyup",
			code: e.code
		});

		if (Input._preventKeys.includes(e.code)) {
			e.preventDefault();
		}
	});

	document.addEventListener("pointerlockchange", function(e) {
		if (document.pointerLockElement == document.body) {
			Input.pointerLocked = true;
			
			const event = { locked: true };
			
			if (typeof Input.onpointerlockchange == "function") {
				Input.onpointerlockchange(event);
			}
			for (let listener of events.pointerlockchange) {
				listener(event);
			}
		} else {
			Input.pointerLocked = false;
			
			const event = { locked: false };
			
			if (typeof Input.onpointerlockchange == "function") {
				Input.onpointerlockchange(event);
			}
			for (let listener of events.pointerlockchange) {
				listener(event);
			}
		}
	});

	function lockPointer() {
		document.body.requestPointerLock();
	}

	document.body.addEventListener("mouseleave", function(e) {
		Input.buttons[0][Input.BUTTON_MOUSE_LEFT] = undefined;
		Input.buttons[0][Input.BUTTON_MOUSE_RIGHT] = undefined;
		Input.buttons[0][Input.BUTTON_MOUSE_MIDDLE] = undefined;
		Input.buttons[0][Input.BUTTON_MOUSE_BACK] = undefined;
		Input.buttons[0][Input.BUTTON_MOUSE_FORWARD] = undefined;
	});

	document.body.addEventListener("contextmenu", function(e) {
		hasActionOccurred = true;
		e.preventDefault();
	});

	document.body.addEventListener("mousedown", function (e) {
		if (typeof mousedown != "undefined") {
			let ev = {};
			ev.x = e.clientX;
			ev.y = e.clientY;
			ev.button = e.button;
			ev.leftClick = e.button == 0;
			ev.rightClick = e.button == 2;
			ev.middleClick = e.button == 1;
			ev.force = 1.0;
			ev.data = e;
			
			if (mousedown(ev)) return;
		}
		
		hasActionOccurred = true;
		if (e.button == 0) {
			Input.buttons[0][Input.BUTTON_MOUSE_LEFT] = {
				frame: Input.frame
			};
			Input._updateEvents({
				type: "onmousedown",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_LEFT,
			});
			if (Input._lockPointer) {
				if (Input._lockPointerElements.length == 0) {
					lockPointer();
				} else {
					if (Input._lockPointerElements.includes(e.target)) {
						lockPointer();
					}
				}
			}
		} else if (e.button == 2) {
			Input.buttons[0][Input.BUTTON_MOUSE_RIGHT] = {
				frame: Input.frame
			};
			Input._updateEvents({
				type: "onmousedown",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_RIGHT,
			});
		} else if (e.button == 1) {
			Input.buttons[0][Input.BUTTON_MOUSE_MIDDLE] = {
				frame: Input.frame
			};
			Input._updateEvents({
				type: "onmousedown",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_MIDDLE,
			});
		} else if (e.button == 3) {
			Input.buttons[0][Input.BUTTON_MOUSE_BACK] = {
				frame: Input.frame
			};
			Input._updateEvents({
				type: "onmousedown",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_BACK,
			});
		} else if (e.button == 4) {
			Input.buttons[0][Input.BUTTON_MOUSE_FORWARD] = {
				frame: Input.frame
			};
			Input._updateEvents({
				type: "onmousedown",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_FORWARD,
			});
		}

		AudioNode.init();

		__Input._mousePosition.x = e.clientX;
		__Input._mousePosition.y = e.clientY;
	});

	document.body.addEventListener("mouseup", function(e) {
		if (e.button == 0) {
			Input.buttons[0][Input.BUTTON_MOUSE_LEFT] = undefined;
			Input._updateEvents({
				type: "onmouseup",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_LEFT,
			});
		} else if (e.button == 2) {
			Input.buttons[0][Input.BUTTON_MOUSE_RIGHT] = undefined;
			Input._updateEvents({
				type: "onmouseup",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_RIGHT,
			});
		} else if (e.button == 1) {
			Input.buttons[0][Input.BUTTON_MOUSE_MIDDLE] = undefined;
			Input._updateEvents({
				type: "onmouseup",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_MIDDLE,
			});
		} else if (e.button == 3) {
			Input.buttons[0][Input.BUTTON_MOUSE_BACK] = undefined;
			Input._updateEvents({
				type: "onmouseup",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_BACK,
			});
		} else if (e.button == 4) {
			Input.buttons[0][Input.BUTTON_MOUSE_FORWARD] = undefined;
			Input._updateEvents({
				type: "onmouseup",
				button: e.button,
				inputButton: Input.BUTTON_MOUSE_FORWARD,
			});
		}

		if (typeof mouseup != "undefined") {
			let ev = {};
			mouseup(ev);
		}

		__Input._mousePosition.x = e.clientX;
		__Input._mousePosition.y = e.clientY;
	});

	document.body.addEventListener("mousemove", function(e) {
		if (typeof mousemove != "undefined") {
			let ev = {};
			ev.position = {
				x: e.clientX,
				y: e.clientY
			};
			ev.movement = {
				x: e.movementX,
				y: e.movementY
			};
			ev.x = e.clientX;
			ev.y = e.clientY;
			if (Input.pointerLocked) {
				ev.relative = {
					x: e.movementX,
					y: e.movementY
				};
			} else {
				ev.relative = {
					x: 0,
					y: 0
				};
			}
			ev.force = 1.0;

			mousemove(ev);
		}

		__Input._mousePosition.x = e.clientX;
		__Input._mousePosition.y = e.clientY;
	});

	/* Touch Mouse */
	var touchMouseIdentifier = -1;
	var touchMouseLast = {
		x: 0,
		y: 0
	};

	document.body.addEventListener("touchstart", function(e) {
		if (touchMouseIdentifier != -1) return;

		touchMouseIdentifier = e.changedTouches[0].identifier;
		touchMouseDown(e.changedTouches[0], e);
	});

	document.body.addEventListener("touchend", function(e) {
		for (let touch of e.changedTouches) {
			if (touch.identifier == touchMouseIdentifier) {
				touchMouseUp(touch);
				touchMouseIdentifier = -1;
			}
		}
	});

	document.body.addEventListener("touchmove", function(e) {
		for (let touch of e.changedTouches) {
			if (touch.identifier == touchMouseIdentifier) {
				touchMouseMoved(touch);
			}
		}
	});

	function touchMouseDown(touch, data) {
		if (typeof mousedown != "undefined") {
			let ev = {};
			ev.x = touch.clientX;
			ev.y = touch.clientY;
			ev.force = touch.force;
			ev.data = data;

			if (mousedown(ev)) {
				touchMouseIdentifier = -1;
				return;
			}
		}
		
		hasActionOccurred = true;
		Input.buttons[0][Input.BUTTON_MOUSE_LEFT] = {
			frame: Input.frame
		};

		__Input._mousePosition.x = touch.clientX;
		__Input._mousePosition.y = touch.clientY;

		touchMouseLast.x = touch.clientX;
		touchMouseLast.y = touch.clientY;
	}

	function touchMouseUp(touch) {
		Input.buttons[0][Input.BUTTON_MOUSE_LEFT] = undefined;

		__Input._mousePosition.x = touch.clientX;
		__Input._mousePosition.y = touch.clientY;

		if (typeof mouseup != "undefined") {
			let ev = {};
			mouseup(ev);
		}

		touchMouseLast.x = touch.clientX;
		touchMouseLast.y = touch.clientY;
	}

	function touchMouseMoved(touch) {
		__Input._mousePosition.x = touch.clientX;
		__Input._mousePosition.y = touch.clientY;

		if (typeof mousemove != "undefined") {
			const movementX = touch.clientX - touchMouseLast.x;
			const movementY = touch.clientY - touchMouseLast.y;

			const ev = {};
			ev.position = {
				x: touch.clientX,
				y: touch.clientY
			};
			ev.movement = {
				x: movementX,
				y: movementY
			};
			ev.x = touch.clientX;
			ev.y = touch.clientY;
			ev.relative = {
				x: movementX,
				y: movementY
			};
			ev.force = touch.force;

			mousemove(ev);
		}

		touchMouseLast.x = touch.clientX;
		touchMouseLast.y = touch.clientY;
	}

	window.addEventListener("gamepadconnected", function(e) {
		if (Input.debug) {
			console.log("Gamepad Connected", e.gamepad);
		}
	});

	window.addEventListener("gamepaddisconnected", function(e) {
		if (Input.debug) {
			console.log("Gamepad Disconnected", e.gamepad);
		}
	});

	class EchoNode {
		constructor(audioContext) {
			//create the nodes we'll use
			this.input = new GainNode(audioContext);
			(this.output = new GainNode(audioContext)),
			(this.delay = new DelayNode(audioContext)),
			(this.feedback = new GainNode(audioContext)),
			//set some decent values
			(this.delay.delayTime.value = 0.5); //500 ms delay
			this.feedback.gain.value = 0.02;

			//set up the routing
			this.input.connect(this.delay);
			this.input.connect(this.output);
			this.delay.connect(this.feedback);
			this.delay.connect(this.output);
			this.feedback.connect(this.delay);

			this.connect = function(target) {
				this.output.connect(target);
			};
		}

		setEcho(value) {
			this.feedback.gain.value = value;
		}
	}

	const __AudioNode = {
		initialized: false,
		contex: null,
		gainNode: null,
		echoNode: null,
		panNode: null,

		init: function() {
			if (!this.initialized) {
				this.initialized = true;
				this.initialize();
			}
		},

		initialize: function() {
			this.context = new AudioContext();
			// this.gainNode = new GainNode(this.context);
			// this.gainNode.gain.value = 1.0;
			// this.panNode = new PannerNode(this.context);
			// this.panNode.pan.value = -0.5;
			// this.echoNode = new EchoNode(this.context);
			// this.gainNode.connect(this.context.destination);
			// this.panNode.connect(this.context.destination);
			// this.echoNode.connect(this.context.destination);
		},

		setVolume: function(value) {
			this.init();
			// this.gainNode.gain.value = value;
		},

		setFreq: function(value) {
			// this.oscNode.frequency.value = value;
		},

		playTone: function(freq, time = 200) {
			this.init();

			let oscNode = new OscillatorNode(this.context);
			let gain = new GainNode(this.context);
			oscNode.connect(gain);
			gain.connect(this.context.destination);
			gain.gain.value = 1.0;
			oscNode.frequency.value = freq;
			oscNode.start();

			gain.gain.linearRampToValueAtTime(
				0.0001,
				this.context.currentTime + time / 1000
			);

			setTimeout(function() {
				oscNode.stop();
			}, time);
			
			return oscNode;
		},
	};
	// AudioNode.init();

	class __MultiSoundEffect {
		constructor(src, count = MULTI_SOUND_COUNT) {
			this.src = src;

			this.sounds = [];
			for (let i = 0; i < count; i++) {
				this.sounds.push(new SoundEffect(src));
			}

			this.volume = 1;
		}

		setVolume(value) {
			for (let s of this.sounds) {
				s.volume = value;
			}
		}

		play(time) {
			for (let s of this.sounds) {
				if (s.playIfStopped(time)) {
					break;
				}
			}
		}
	}

	class __SoundEffect {
		constructor(src) {
			this.src = src;

			this.element = new Audio();
			this.element.crossOrigin = "Test";
			this.element.src = this.src;

			const scope = this;
			this.element.onended = function(e) {
				scope.playing = false;
				if (scope.ended) {
					scope.ended(e);
				}
			};

			this.playing = false;

			this.volume = 1;

			this._initialized = false;
		}

		_init() {
			if (!this._initialized) {
				if (AudioNode.context) {
					this._initialized = true;
					this.node = new MediaElementAudioSourceNode(AudioNode.context, {
						mediaElement: this.element,
					});
					this.node.connect(AudioNode.context.destination);
				}
			}
		}

		toMultiSound() {
			let snd = new MultiSoundEffect(this.src);
			snd.setVolume(this.volume);
			return snd;
		}

		// ended(e) {
		// }

		setVolume(value) {
			this.volume = value;
		}

		pitchRandom(min, max) {
			this.element.playbackSpeed = Math.random() * (max - min) + min;
		}

		setLoop(value) {
			this.element.loop = value;
		}

		stop() {
			this.playing = false;
			this.element.pause();
		}

		play(time) {
			this._init();

			this.playing = true;
			if (time) {
				this.element.currentTime = time;
			}
			this.element.volume = this.volume;
			this.element.play();
		}

		playIfStopped(time) {
			if (this.playing) {
				return false;
			}

			this.play(time);
			return true;
		}
	}

	const __Sound = {
		fromURL: function(url) {
			return new SoundEffect(url);
		},
	};

	var loadedImages = 0;
	var imagesToLoad = 0;
	var zipsToLoad = 0;
	var started = false;

	function __Sprite(src) {
		imagesToLoad++;

		const image = new Image();

		image.src = src;
		image.addEventListener("load", function() {
			image.isLoaded = true;

			imageLoaded();
		});
		image.crossOrigin = "none";
		image.isLoaded = false;

		return image;
	}

	function imageLoaded() {
		loadedImages++;
		Input.loadedImages = loadedImages;
		if (loadedImages == imagesToLoad && !started && zipsToLoad == 0) {
			if (typeof Input.onimagesloaded == "function") {
				Input.onimagesloaded({
					count: loadedImages,
				});
			}
			for (let listener of events.imagesloaded) {
				listener({
					count: loadedImages
				});
			}
			started = true;
		}
	}

	__Input.addEventListener = function(type, listener) {
		if (type == "imagesloaded") {
			events.imagesLoaded.push(listener);
		}
	};

	var zip;
	if (typeof JSZip != "undefined") {
		canUseJSZIP = true;
		zip = new JSZip();
	}

	function __SpritesFromZip(href, storeInto, order) {
		if (!canUseJSZIP) {
			console.warn("JSZip not included, so you can't use SpritesFromZip. Try installing JSZip.");
			return;
		}

		zipsToLoad++;
		var length = 0;
		fetch(href).then(function(content) {
			content.blob().then(function(blob) {
				zip.loadAsync(blob).then(function(zip) {
					zipsToLoad--;
					length = Object.keys(zip.files).length;
					imagesToLoad += length;
					let filenames = [];
					for (let fileName in zip.files) {
						filenames.push(fileName);
					}
					filenames.sort();
					for (let fileName in zip.files) {
						zip.files[fileName].async("base64").then(function(dataURI) {
							const index = filenames.indexOf(fileName);
							const image = Sprite("data:image/png;base64," + dataURI);
							storeInto[index] = image;
							imageLoaded();
							if (order) {
								order[index] = fileName;
							}
						});
					}
				});
			});
		});
	}

	Sound = __Sound;
	Sprite = __Sprite;
	Input = __Input;
	Input._init();
	MultiSoundEffect = __MultiSoundEffect;
	SoundEffect = __SoundEffect;
	SpritesFromZip = __SpritesFromZip;
	AudioNode = __AudioNode;
	
	for (let eventName in events) {
		Input["on" + eventName] = null;
	}
	
	Input.loadedImages = -1;
})();