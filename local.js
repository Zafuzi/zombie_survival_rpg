// _<el> is a document element
let _time, _quit, _menu, _main, _canvas, ctx,
    game_time = [9,0,0]; // game starts at 9AM

let running = true, t = 0;

addEventListener("DOMContentLoaded", dcl => {
    _time = document.querySelector("#time");
    _main = document.querySelector("main");
    _canvas = document.querySelector("canvas");
    _canvas.width = _main.getBoundingClientRect().width;
    _canvas.height = _main.getBoundingClientRect().height;

    ctx = _canvas.getContext("2d");

    render_time();
    requestAnimationFrame(tick);
});

addEventListener("resize", () => {
    _canvas.width = _main.getBoundingClientRect().width;
    _canvas.height = _main.getBoundingClientRect().height;
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
    ctx.fillRect(0, 0, _canvas.width, _canvas.height);
    if(t % 100 == 0) {
        game_time[2] += 1;
        render_time();
    }
    requestAnimationFrame(tick);
}
