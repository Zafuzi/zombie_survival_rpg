let _time, _quit, _menu,
    game_time = [9,0,0]; // game starts at 9AM

let running = false;

addEventListener("DOMContentLoaded", dcl => {
    _time = document.querySelector("#time");

    render_time();
    setInterval(tick, 1000);
});

addEventListener("resize", () => {
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
    game_time[2] += 1;
    render_time();
}
