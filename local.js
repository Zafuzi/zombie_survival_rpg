// _<el> is a document element
let _time, _title, _quit, _menu, _main, _canvas, ctx,
    game_time = [9,0,0]; // game starts at 9AM

let running = true, t = 0;

let player, map;

let keys = []; // array for key input

addEventListener("DOMContentLoaded", dcl => {
	_time = document.querySelector("#time");
    _title = document.querySelector("#room_title");
    _main = document.querySelector("main");
    _canvas = document.querySelector("canvas");
    _canvas.width = _main.getBoundingClientRect().width;
    _canvas.height = _main.getBoundingClientRect().height;

    ctx = _canvas.getContext("2d");

	player = Player();
	player.x = _canvas.width * 0.5 - player.w;
	player.y = _canvas.height * 0.5 - player.h;

	map = MakeMap();
	_title.innerHTML = map.local[player.global_position].title;

    render_time();
    requestAnimationFrame(tick);
});

addEventListener("resize", () => {
    _canvas.width = _main.getBoundingClientRect().width;
    _canvas.height = _main.getBoundingClientRect().height;
});

addEventListener("keydown", e => {
	if(keys.indexOf(e.key) == -1) {
		keys.push(e.key);
	}
});

addEventListener("keyup", e => {
	if(keys.indexOf(e.key) != -1) {
		keys.splice(keys.indexOf(e.key), 1);
	}
});

addEventListener("mouseout", e => {
	keys = [];
});

function render_time() {
    if(game_time[2] == 60) {
        game_time[1] += 1;
        game_time[2] = 0;
    }
    if(game_time[1] == 60) {
        game_time[0] += 1;
        game_time[1] = 0;
    }
    if(game_time[0] == 24) {
        game_time[0] = 0;
    }

    let hours = game_time[0];
    let minutes = game_time[1];
    let seconds = game_time[2];
    if(game_time[0] < 10) {
        hours = "0" + game_time[0];    
    }
    if(game_time[1] < 10) {
        minutes = "0" + game_time[1];    
    }
    if(game_time[2] < 10) {
        seconds = "0" + game_time[2];    
    }
    _time.innerHTML = `${hours}:${minutes}:${seconds}`;
}

let tick = function() {
    if(!running) return;
    t++
    ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    if(t % 100 == 0) {
        game_time[2] += 1;
        render_time();
    }

	let loc = map.local[player.global_position];
	_title.innerHTML = loc.title;
	ctx.globalAlpha = .1;
	fillRect(0, 0, _canvas.width, _canvas.height, loc.color);
	ctx.globalAlpha = 1;

	player.handle_input();
	player.tick();
	player.draw();

    requestAnimationFrame(tick);
}

//	-------------------- 
//	HELPERS
//	--------------------		

let fillRect = function(x = 0, y = 0, w = 10, h = 10, color = "#fff") {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
	ctx.closePath();
}

// Obtient une interpolation linéaire entre 2 valeurs
Math.lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};


//	-------------------- 
//	GAME OBJECTS
//	--------------------		


//	-------------------- 
//	PLAYER
//	--------------------		
let Player = function() {
	let o = {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		w: 20,
		h: 20,
		speed: 5,
		facing: 0,
		global_position: "lake",
		handle_input : function() {
			let self = this;
			let moved = false;
			keys.forEach(key => {
				switch(key) {
					case "w":
					case "W":
						self.vy = -self.speed;
						self.facing = 0;
						moved = true;
						break;
					case "s":
					case "S":
						self.vy = self.speed;
						self.facing = 180;
						moved = true;
						break;
					case "d":
					case "D":
						self.vx = self.speed;
						self.facing = 90;
						moved = true;
						break;
					case "a":
					case "A":
						self.vx = -self.speed;
						self.facing = 270;
						moved = true;
						break;
				}
			});

			if(keys.indexOf("w") != -1 || keys.indexOf("W") != -1) {
				if(keys.indexOf("d") != -1 || keys.indexOf("D") != -1) {
					self.facing = 45;
				}
				if(keys.indexOf("a") != -1 || keys.indexOf("A") != -1) {
					self.facing = 315;
				}
			} else {

				if(keys.indexOf("s") != -1 || keys.indexOf("S") != -1) {
					if(keys.indexOf("d") != -1 || keys.indexOf("D") != -1) {
						self.facing = 135;
					}
					if(keys.indexOf("a") != -1 || keys.indexOf("A") != -1) {
						self.facing = 225;
					}
				}

			}

			if(!moved) {
				self.facing = -1;
			}
		},
		check_move: function(dir) {
			let self = this;
			// first try and move to a new location if we can
			let current = self.global_position, next;
			for(let i = 0; i < map.global.length; i++) {
				let l = map.global[i];
				let k = l.indexOf(current);
				if( k != -1 ) {
					// found us now find the place we want to go to
					current = l[k];
					switch(dir) {
						case 0:
							if(map.global[i-1]) {
								l = map.global[i-1];
								k = l[k];
								k = l.indexOf(k);
								if( k != -1 && l[k] != "blocked" ) {
									next = l[k];
								}
							}
							break;
						case 90:
							if( k + 1 <= l.length && l[k+1] != "blocked" ) {
								next = l[k + 1];
							}
							break;
						case 180:
							if(map.global[i+1]) {
								l = map.global[i+1];
								k = l[k];
								k = l.indexOf(k);
								if( k != -1 && l[k] != "blocked" ) {
									next = l[k];
								}
							}
							break;
						case 270:
							if( k - 1 >= 0 && l[k - 1] != "blocked") {
								next = l[k - 1];
							}
							break;
					}
				}
			}
			return next;
		},
		tick : function() {
			let self = this;
			self.x += self.vx;
			self.y += self.vy;

			self.vx = Math.lerp(self.vx, 0, 0.1);
			self.vy = Math.lerp(self.vy, 0, 0.1);


			// screen wrap
			if( self.x + self.vx > _canvas.width - self.w ) {
				let next = self.check_move(90);
				if( next ) {
					self.global_position = next;
					self.x = 0 + self.vx;
				} else {
					self.x = _canvas.width - self.w;
				}
			}

			if( self.x - self.vx < 0 ) {
				let next = self.check_move(270);
				if( next ) {
					self.global_position = next;
					self.x = _canvas.width - self.w - self.vx;
				} else {
					self.x = 0;
				}
			}

			if( self.y + self.vy > _canvas.height - self.h ) {
				let next = self.check_move(180);
				if( next ) {
					self.global_position = next;
					self.y = self.vy;
				} else {
					self.y = _canvas.height - self.h - self.vy;
				}
			}

			if( self.y - self.vy < 0 ) {
				let next = self.check_move(0);
				if( next ) {
					self.global_position = next;
					self.y = _canvas.height - self.h - self.vy;
				} else {
					self.y = 0;
				}
			}
		},
		draw : function() {
			let self = this;
			fillRect(self.x, self.y, self.w, self.h, "salmon");	
			let dir_cube = {
				x: self.x,
				y: self.y,
				w: self.w * 0.5,
				h: self.h * 0.5
			}
			switch(self.facing) {
				case -1:
					dir_cube.x += self.w * 0.25;
					dir_cube.y += self.h * 0.25;
					break;
				case 0:
					dir_cube.x += self.w * 0.25;
					break;
				case 45:
					dir_cube.x += self.w * 0.5;
					break;
				case 90:
					dir_cube.x += self.w * 0.5;
					dir_cube.y += self.h * 0.25;
					break;
				case 135:
					dir_cube.x += self.w * 0.5;
					dir_cube.y += self.h * 0.5;
					break;
				case 180:
					dir_cube.x += self.w * 0.25;
					dir_cube.y += self.h * 0.5;
					break;
				case 225:
					dir_cube.y += self.h * 0.5;
					break;
				case 270:
					dir_cube.y += self.h * 0.25;
					break;
				case 315:
					break;
			}
			fillRect(dir_cube.x, dir_cube.y, dir_cube.w, dir_cube.h, "slateblue");
		}
	}
	return o;
}


let MakeMap = function() {
	let o = {
		global: [
			["blocked", "north_lake", "blocked"],
			["dock", "lake", "hills"],
			["blocked", "south_lake", "blocked"],
		],
		local: {
			north_lake: {
				title: "North Lake",
				color: "#00F",
				items: [],
				mobs: []
			},
			south_lake: {
				title: "South Lake",
				color: "#00F",
				items: [],
				mobs: []
			},
			dock: {
				title: "Dock by the lake",
				color: "#D2691E",
				items: [],
				mobs: []
			},
			lake: {
				title: "Lake",
				color: "#00F",
				items: [],
				mobs: []
			}, 
			hills: {
				title: "East Hills",
				color: "#0F0",
				items: [],
				mobs: []
			}
		}
	}
	return o;
}









