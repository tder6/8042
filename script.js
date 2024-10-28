let size = 4;
let tile = Array.from(Array(size), () => new Array(size));
let container = document.getElementById("container");
let button = document.getElementById("restart");
let box = document.getElementById("score");
let unlock = 0;
let score = 0;
let ingame = 0;
init();
function save(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}
function get(key) {
	const value = localStorage.getItem(key);
	return value ? JSON.parse(value) : null;
}
function init() {
	for(let i = 0; i < size; i++) for(let j = 0; j < size; j++) 
		if(i * size + j + 1 <= Math.max(1, log(get("maxunlock")))) tile[i][j] = pow(i * size + j + 1);
		else tile[i][j] = '?';
	print();
	show(); console.log("maxscore", get("maxscore"));
	update(); console.log("maxunlock", get("maxunlock"));
	// restart();
}
button.addEventListener('click', function() {
	restart();
});
function print() {
	let html = "";
	for(let i = 0; i < size; i++) {
		for(let j = 0; j < size; j++) 
			if(tile[i][j] == 0) html += "<div class=\"tile\"></div>";
			else html += "<div class=\"tile tile-" + String(tile[i][j]) + "\">" + String(tile[i][j]) + "</div>";
		// html += "<br>";
	}
	container.innerHTML = html;
}
function pow(a) {
	let r = 1;
	while(a--) r *= 2;
	return r;
}
function log(a) {
	let r = 1;
	while(a = Math.floor(a / 2)) r++;
	return r;
}
function restart() {
	ingame = 1;
	score = 0; show();
	unlock = 0;
	for(let i = 0; i < size; i++) for(let j = 0; j < size; j++) tile[i][j] = 0;
	add(); add();
}
function add() {
	let empty = [];
	for(let i = 0; i < size; i++) for(let j = 0; j < size; j++) 
		if(tile[i][j] == 0) empty.push([i, j]);
	let random = Math.floor(Math.random() * empty.length);
	let x = empty[random][0];
	let y = empty[random][1];
	update();
	tile[x][y] = pow((Math.floor(Math.random() * Math.max(log(unlock) - 6, 1))) + 1);
	update();
	print();
}
function update() {
	unlock = 0;
	for(let i = 0; i < size; i++) for(let j = 0; j < size; j++) 
		if(typeof(tile[i][j]) == "number") unlock = Math.max(unlock, tile[i][j]);
		else unlock = 0;
	save("maxunlock", Math.max(get("maxunlock"), unlock));
}
function show() {
	box.innerHTML = score;
	save("maxscore", Math.max(get("maxscore"), score));
}
document.onkeydown = function(event) {
    if(ingame == 0) return;
	let keyCode = event.keyCode || event.which;
	let ok = 0;
    switch(keyCode) {
        case 38: 
			ok = up();
            break;
        case 40:
			ok = down();
            break;
        case 37:
            ok = left();
            break;
        case 39:
            ok = right();
            break;
        default:
            break;
    }
	print();
	if(ok) add(), show();
};
function overrow(j) {
	for(let i = 1; i < size; i++) 
		if(tile[i][j] != 0 && tile[i][j] == tile[i - 1][j]) return 1;
	return 0;
}
function overline(i) {
	for(let j = 1; j < size; j++) 
		if(tile[i][j] != 0 && tile[i][j] == tile[i][j - 1]) return 1;
	return 0;
}
function up() {
	let ok = 0;
	for(let j = 0; j < size; j++) {
		for(let i = 1; i < size; i++) {
			let k = i;
			while(k > 0 && tile[k - 1][j] == 0) 
				tile[k - 1][j] = tile[k][j], tile[k][j] = 0, k--, ok = 1;
		}
		for(let i = 1; i < size; i++) 
			if(tile[i][j] != 0 && tile[i][j] == tile[i - 1][j]) 
				tile[i - 1][j] *= 2, tile[i][j] = 0, ok = 1, score += tile[i - 1][j];
		for(let i = 1; i < size; i++) {
			let k = i;
			while(k > 0 && tile[k - 1][j] == 0) 
				tile[k - 1][j] = tile[k][j], tile[k][j] = 0, k--, ok = 1;
		}
	}
	return ok;
}
function down() {
	let ok = 0;
	for(let j = 0; j < size; j++) {
		for(let i = size - 2; i >= 0; i--) {
			let k = i;
			while(k < size - 1 && tile[k + 1][j] == 0) 
				tile[k + 1][j] = tile[k][j], tile[k][j] = 0, k++, ok = 1;
		}
		for(let i = size - 2; i >= 0; i--) 
			if(tile[i][j] != 0 && tile[i][j] == tile[i + 1][j]) 
				tile[i + 1][j] *= 2, tile[i][j] = 0, ok = 1, score += tile[i + 1][j];
		for(let i = size - 2; i >= 0; i--) {
			let k = i;
			while(k < size - 1 && tile[k + 1][j] == 0) 
				tile[k + 1][j] = tile[k][j], tile[k][j] = 0, k++, ok = 1;
		}
	}
	return ok;
}
function left() {
	let ok = 0;
	for(let i = 0; i < size; i++) {
		for(let j = 1; j < size; j++) {
			let k = j;
			while(k > 0 && tile[i][k - 1] == 0) 
				tile[i][k - 1] = tile[i][k], tile[i][k] = 0, k--, ok = 1;
		}
		for(let j = 1; j < size; j++) 
			if(tile[i][j] != 0 && tile[i][j] == tile[i][j - 1]) 
				tile[i][j - 1] *= 2, tile[i][j] = 0, ok = 1, score += tile[i][j - 1];
		for(let j = 1; j < size; j++) {
			let k = j;
			while(k > 0 && tile[i][k - 1] == 0) 
				tile[i][k - 1] = tile[i][k], tile[i][k] = 0, k--, ok = 1;
		}
	}
	return ok;
}
function right() {
	for(let i = 0; i < size; i++) {
		for(let j = size - 2; j >= 0; j--) {
			let k = j;
			while(k < size - 1 && tile[i][k + 1] == 0) 
				tile[i][k + 1] = tile[i][k], tile[i][k] = 0, k++, ok = 1;
		}
		for(let j = size - 2; j >= 0; j--) 
			if(tile[i][j] != 0 && tile[i][j] == tile[i][j + 1]) 
				tile[i][j + 1] *= 2, tile[i][j] = 0, ok = 1, score += tile[i][j + 1];
		for(let j = size - 2; j >= 0; j--) {
			let k = j;
			while(k < size - 1 && tile[i][k + 1] == 0) 
				tile[i][k + 1] = tile[i][k], tile[i][k] = 0, k++, ok = 1;
		}
	}
	return ok;
}