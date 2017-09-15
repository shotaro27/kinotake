var urlParser = require('url'),
	handler = function(req, res) {
		var urlParsed = urlParser.parse(req.url),
			filepath = "/../kinotakeproject/";
		console.log(urlParsed.pathname);
		switch (urlParsed.pathname) {
		case "/enchant.js":
			filepath += "enchant.js";
			break;
		case "/main2.js":
			filepath += "main2.js";
			break;
		case "/favicon.ico":
			filepath += "favicon.ico";
			break;
		case "/back01.png":
			filepath += "back01.png";
			break;
		case "/back02.png":
			filepath += "back02.png";
			break;
		case "/congratulation.png":
			filepath += "congratulation.png";
			break;
		case "/good.png":
			filepath += "good.png";
			break;
		case "/great.png":
			filepath += "great.png";
			break;
		case "/hikari.png":
			filepath += "hikari.png";
			break;
		case "/hukidasi.png":
			filepath += "hukidasi.png";
			break;
		case "/kino-ru.png":
			filepath += "kino-ru.png";
			break;
		case "/kino.png":
			filepath += "kino.png";
			break;
		case "/kinoback.png":
			filepath += "kinoback.png";
			break;
		case "/kinochoko.png":
			filepath += "kinochoko.png";
			break;
		case "/kinocook.png":
			filepath += "kinocook.png";
			break;
		case "/kinoenemy.png":
			filepath += "kinoenemy.png";
			break;
		case "/kinotake.png":
			filepath += "kinotake.png";
			break;
		case "/kinotama.png":
			filepath += "kinotama.png";
			break;
		case "/kirakira.png":
			filepath += "kirakira.png";
			break;
		case "/modoru.png":
			filepath += "modoru.png";
			break;
		case "/nice.png":
			filepath += "nice.png";
			break;
		case "/score.png":
			filepath += "score.png";
			break;
		case "/star.png":
			filepath += "star.png";
			break;
		case "/start.png":
			filepath += "start.png";
			break;
		case "/take-ru.png":
			filepath += "take-ru.png";
			break;
		case "/take.png":
			filepath += "take.png";
			break;
		case "/takeback.png":
			filepath += "takeback.png";
			break;
		case "/takechoko.png":
			filepath += "takechoko.png";
			break;
		case "/takecook.png":
			filepath += "takecook.png";
			break;
		case "/takeenemy.png":
			filepath += "takeenemy.png";
			break;
		case "/taketama.png":
			filepath += "taketama.png";
			break;
		case "/321.m4a":
			filepath += "321.m4a";
			break;
		case "/bu.m4a":
			filepath += "bu.m4a";
			break;
		case "/cake5toubun.mp3":
			filepath += "cake5toubun.mp3";
			break;
		case "/decision22.mp3":
			filepath += "decision22.mp3";
			break;
		case "/extend1.mp3":
			filepath += "extend1.mp3";
			break;
		case "/fairy.mp3":
			filepath += "fairy.mp3";
			break;
		case "/konekone.mp3":
			filepath += "konekone.mp3";
			break;
		case "/nazonazo.mp3":
			filepath += "nazonazo.mp3";
			break;
		case "/start.mp3":
			filepath += "start.mp3";
			break;
		case "/syourinouta.mp3":
			filepath += "syourinouta.mp3";
			break;
		default:
			filepath += "kinoko1.html";
			break;
		}
		fs.readFile(__dirname + filepath,
			function (err, data) {
				if (err) {
					console.log(err);
					res.writeHead(500);
					return res.end("Error");
				}
				res.writeHead(200);
				res.write(data);
				res.end();
			}
		);
	},
	app = require("http").createServer(handler),
	fs = require("fs"),
	io = require("socket.io").listen(app),
	j5 = require('johnny-five'),
	arduino = new j5.Board();
app.listen(2929);
io.set("log level", 1);
arduino.on('ready', function () {
	var ktbutton = new j5.Button({
			pin: 2,
			holdtime: 100
		}),
		sbutton = new j5.Button({
			pin: 3,
			holdtime: 100
		}),
		sensor = new j5.Proximity ({
			controller:  'GP2Y0A21YK',
			pin: 14,
			freq: 100
		}),
		led =new j5.Led(13),
		m = new j5.Servo({
			pin: 5,
			range: [20, 160]
		}),
		game = false, clear = false;
	led.strobe(1000);
	io.on('connection', function(socket) {
			socket.emit('emit_from_server', 'Initialized');
			ktbutton.on('down', function () {
				//console.log('on');
				socket.emit('emit_from_server', 'on');
			});
			sensor.on('change', function(){
				if (game) {
					//console.log('sensor: ' + sensor.cm + 'cm');
					socket.emit('emit_from_server', sensor.cm);
				}
			});
			ktbutton.on('hold', function () {
				//console.log('sensor: ' + sensor.cm + 'cm');
				socket.emit('emit_from_server', sensor.cm);
			});
			sbutton.on('down', function () {
				//console.log('enter');
				socket.emit('emit_from_server', 'enter');
			});
			sbutton.on('up', function () {
				//console.log('enter');
				socket.emit('emit_from_server', 'enter');
			});
			m.center();
			socket.on('emit_from_client', function(data) {
				switch (data) {
					case "knyoki":
						m.max(1000);
						game = false;
						break;
					case "tnyoki":
						m.min(1000);
						game = false;
						break;
					case 'start':
						game = true;
						break;
					case 'go':
						m.center();
						break;
					case "timeup":
						game = false;
						break;
				}
			});
		}
	);
});
