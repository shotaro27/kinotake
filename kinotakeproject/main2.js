enchant();
var remote = io.connect('http://localhost:2929');
function readCookie(key) {
	var dim = document.cookie.split(';'), dimvalue;
	for (var i = 0; i < dim.length; i++) {
		dimvalue = dim[i].split('=');
		if (dimvalue[0].trim() == key) {
			return dimvalue[1].trim();
		}
	}
}
window.onload = function () {
	remote.on('emit_from_server', function (data) {
		if (data == 'Initialized') {
			console.log('Initialized');
			console.log('hello ' + enchant.ENV.BROWSER);
			console.log('enchantjsのバージョン：' + enchant.ENV.VERSION);
			var kpoint = readCookie('KPOINT'), tpoint = readCookie('TPOINT');
			var core = new Core(window.innerWidth, window.innerHeight);
			core.fps = 24;
			core.preload(
				'kino.png', 'take.png', 'star.png',
				'kinotama.png', 'taketama.png', 'kinoback.png',
				'takeback.png', 'kinotake.png', 'back01.png',
				'back02.png', 'kino-ru.png', 'take-ru.png',
				'kinochoko.png', 'takechoko.png','kinocook.png',
				'takecook.png', 'kinoenemy.png', 'congratulation.png',
				'takeenemy.png', 'hikari.png', 'nice.png',
				'good.png', 'great.png', 'score.png',
				'hukidasi.png', 'start.png', "modoru.png"
			);
			core.onload = function () {
				var game, start, clear, timeup,
					kinoko = [], takenoko = [], i = 0,
					CharaTop = Class.create(Sprite, {
						initialize: function (x, y, kt, w, h) {
							Sprite.call(this, w, h);
							this.x = x;
							this.y = y;
							this.image = core.assets[kt + '.png'];
							start.addChild(this);
						}
					}),
					StartText = Class.create(Label, {
						initialize: function (x, y, c, t, p, a) {
							Label.call(this);
							this.x = x;
							this.y = y;
							this.color = c;
							this.font = p + 'px Hiragino Maru Gothic Pro';
							this.text = t;
							this.textAlign　= a;
							start.addChild(this);
						}
					}),
					startback, moji, ktokuten, ttokuten, kino_ru, take_ru, ktsw,
					k = [], t = [], sentaku, kttoggle = false, ok = false, kita,
					gamescene, kttama, kttr1, kttr2, nobi, ktenemy, hikari = [],
					kinotake = [], kintak = 0, l, kiotae, score, h, modoru,
					song = function (audioname, type) {
						return enchant.DOMSound.load(audioname + "." + type, "audio/" + type, function(){}, function(){});
					},
					startv = song("konekone", "mp3"),
					gamev = song("cake5toubun", "mp3"),
					tamav = song("decision22", "mp3"),
					tobidasiv = song("extend1", "mp3"),
					clearv = song("syourinouta", "mp3"),
					greatv = song("fairy", "mp3"),
					goodv = song("nazonazo", "mp3"),
					kurov = song("bu", "m4a"),
					countv = song("321", 'm4a'),
					gstartv = song("start", "mp3");
				function gameinit(kt) {
					game = new Scene();
					var Chara = Class.create(Sprite, {
							initialize: function (x, y, kt, w, h, f) {
								Sprite.call(this, w, h);
								this.x = x;
								this.y = y;
								this.image = core.assets[kt + '.png'];
								this.frame = f;
								game.addChild(this);
							}
						}),
						Text = Class.create(Label, {
							initialize: function (y, c, t) {
								Label.call(this);
								this.x = 1000;
								this.y = y + 10;
								this.color = c;
								this.font = '40px Hiragino Maru Gothic Pro';
								this.text = t;
								this.width = 400;
								this.height = 100;
								this.textAlign = "right";
								game.addChild(this);
							}
						});
					if (kt) {
						console.log("kinoko");
						gamescene = new Chara(0, 0, "kinoback", 1440, 900, 0);
						kttr1 = new Chara(420, 440, "kinocook", 600, 800, 0);
						kttr2 = new Chara(420, 430, "kinochoko", 600, 800, 0);
						ktenemy = new Chara(core.width, core.height, "takeenemy", 100, 150, 0);
						score = new Chara(core.width - 300, 20, "score", 280, 140, 1);
						kita = new Chara(50, 50, "kino", 200, 280, 0);
						kttama = "kinotama";
					} else {
						console.log("takenoko");
						gamescene = new Chara(0, 0, "takeback", 1440, 900, 0);
						kttr1 = new Chara(420, 440, "takecook", 600, 800, 0);
						kttr2 = new Chara(420, 430, "takechoko", 600, 800, 0);
						ktenemy = new Chara(core.width, core.height, "kinoenemy", 100, 150, 0);
						score = new Chara(core.width - 300, 20, "score", 280, 140, 0);
						kita = new Chara(50, 50, "take", 200, 280, 0);
						kttama = "taketama";
					}
					var icon = [], n = 1, sw = true;
					function tama (data) {
						if (core.currentScene == game) {
							switch (data) {
							case 'on':
								kita.frame = 1;
								kita.tl
								.delay(20)
								.then(function(){
									kita.frame = 0;
								});
								icon[n] = new Chara(250, kita.y + 70, kttama, 70, 50, 54);
								icon[n].tl
								.moveX(core.width + 10, (core.width + 10) / core.fps / 3);
								n++;
								break;
							default:
								if (data != "enter") {
									if (data >= 10 && data <= 30) {
										kita.y = core.height - 280 -
										(Math.floor(data) - 10) * ((core.height - 280) / 20);
									} else {
										if (data < 10) {
											kita.y = core.height - 280;
										} else {
											kita.y = 0;
										}
									}
								}
								break;
							}
						}
					}
					remote.on('emit_from_server', tama);
					icon[0] = new Chara(core.width + 10, 0, kttama, 16, 16, 54);
					var count = new Chara(120, 200, "start", 1200, 500, 0);
					kttr1.scaleX = 0.1;
					kttr2.scaleX = 0.1;
					kttr1.scaleY = 0.1;
					kttr2.scaleY = 0.1;
					count.tl.cue({
						0: function () {
							countv.play();
						},
						24: function () {
							count.frame = 1;
							countv.stop();
							countv.play();
						},
						48: function () {
							count.frame = 2;
							countv.stop();
							countv.play();
						},
						72: function () {
							count.frame = 3;
							countv.stop();
							gstartv.play();
						},
						96: function () {
							game.removeChild(count);
							gstartv.stop();
							var point = 0,
								label2 = new Text(35, 'royalblue', 60),
								label3 = new Text(95, 'royalblue', 0);
							hikari[0] = new Chara(420, 0, "hikari", 600, 600, 0);
							hikari[1] = new Chara(420, 0, "hikari", 600, 600, 1);
							hikari[2] = new Chara(420, 0, "hikari", 600, 600, 2);
							game.removeChild(hikari[0]);
							game.removeChild(hikari[1]);
							game.removeChild(hikari[2]);
							gamev.play();
							var time = 60, ssf = core.frame;
							label2.on('enterframe',
								function () {
									time = (60 - ((core.frame - ssf) / core.fps)).toFixed(2);
									this.text = time;
									if (Math.floor(time) === 0) {
										remote.removeEventListener('emit_from_server', tama);
										gamev.stop();
										timeupinit(kt, point);
									}
								}
							);
							var ex = rand(10) + 10, r = 5, d = 0, ey = rand(10) + 10;
							ktenemy.on('enterframe', function () {
								this.x += ex;
								if (this.x <= -300 || this.x >= core.width + 500) {
									ex *= -1;
								}
								this.y += ey;
								if (this.y <= -500 || this.y >= core.height + 500) {
									ey *= -1;
								}
							});
							game.addChild(kita);
							game.addChild(label2);
							game.addChild(label3);
							function add() {
								kinotake[kintak] = new Chara(rand(core.width - 500) + 200,
								rand(core.height - kita.height), "star", 120, 120, rand(2));
								var h = true;
								var fr = kinotake[kintak].frame;
								kinotake[kintak].scaleX=0.75;
								kinotake[kintak].scaleY=0.75;
								var f = 0;
								var wi = 70;
								for (l = 0; l < kinotake.length - 1; l++) {
									while (kinotake[kintak].within(kinotake[l], wi)) {
										if (f <= 100) {
											kinotake[kintak].x = rand(core.width - 200) + 200;
											kinotake[kintak].y = rand(core.height - kita.height);
											l = 0;
											f++;
										} else {
											f=0;
											wi--;
										}
									}
								}
								kinotake[kintak].on('enterframe',
								function () {
									for (var j = 0; j <= n; j++) {
										if (this.intersect(icon[j]) && h){
											if (this.frame == 3) {
												point -= 10;
												label3.text = point;
												icon[j].x = core.width + 10;
												game.removeChild(icon[j]);
												icon[j] = 0;
												this.frame = 7;
												h = false;
												nobi = 0.01;
												kurov.stop();
												kurov.play();
												kttr1.tl
												.scaleTo(kttr1.scaleX - nobi, kttr1.scaleY - nobi, 4)
												.and()
												.moveY(kttr1.y + 400 * nobi, 4);
												kttr2.tl
												.scaleTo(kttr2.scaleX - nobi, kttr2.scaleY - nobi, 4)
												.and()
												.moveY(kttr2.y + 400 * nobi, 4);
											} else {
												point += 10;
												label3.text = point;
												icon[j].x = core.width + 10;
												this.frame += 4;
												h = false;
												if (point >= 1000) {
													remote.removeEventListener('emit_from_server', tama);
													gamev.stop();
													clearinit(kt, parseInt(time));
													point = 0;
												}
												nobi = 0.01;
												tamav.stop();
												tamav.play();
												kttr1.tl
												.scaleTo(kttr1.scaleX + nobi, kttr1.scaleY + nobi, 4)
												.and()
												.moveY(kttr1.y - 400 * nobi, 4);
												kttr2.tl
												.scaleTo(kttr2.scaleX + nobi, kttr2.scaleY + nobi, 4)
												.and()
												.moveY(kttr2.y - 400 * nobi, 4);
												game.addChild(hikari[fr]);
												hikari[fr].y = kttr1.y * 1.1;
												hikari[fr].scaleX = kttr2.scaleX;
												hikari[fr].scaleY = kttr2.scaleY;
												hikari[fr].tl
												.fadeTo(0.5, 15)
												.fadeOut(15)
												.removeFromScene();
											}
											this.scale(0, 0);
											this.opacity = 0.7;
											this.tl
											.fadeOut(8)
											.and()
											.scaleTo(2, 2, 8)
											.moveY(core.height + 50, 0);
										}
									}
									if (this.intersect(ktenemy)){
										this.frame = 3;
										this.tl
										.delay(200)
										.then(function () {
											this.frame = fr;
										});
									}
									this.rotate(1);
								});
							}
							icon[0].tl
							.then(add)
							.then(function () {
								kintak++;
							})
							.delay(12)
							.loop();
						}
					});
					core.replaceScene(game);
				}
				function startinit(kp, tp) {
					remote.emit("emit_from_client", "go");
					try {
						start.removeChild(startback);
						start.removeChild(moji);
						start.removeChild(kinoko[i - 1]);
						start.removeChild(takenoko[i - 1]);
						start.removeChild(kino_ru);
						start.removeChild(take_ru);
						start.removeChild(ktokuten);
						start.removeChild(ttokuten);
					}
					catch (e) {
						console.log(e);
					} finally {}
					start = new Scene();
					startback = new CharaTop(-780, 0, 'back01', 3000, 900);
					moji = new CharaTop(0, 0, 'back02', 1440, 900);
					ktokuten = new StartText(395, 755, '#cff', kp, 70, 'center');
					ttokuten = new StartText(740, 755, '#cff', tp, 70, 'center');
					sentaku = false;
					kttoggle = false;
					ok = false;
					kino_ru = new CharaTop(0, 0, 'kino-ru', 1440, 900);
					take_ru = new CharaTop(0, 0, 'take-ru', 1440, 900);
					kinoko[i] = new CharaTop(-90, 250, 'kinotake', 600, 700);
					takenoko[i] = new CharaTop(920, 250, 'kinotake', 600, 700);
					startv.play();
					start.removeChild(kino_ru);
					start.removeChild(take_ru);
					if (kpoint - tpoint > 5000) {
						k = [3, 4];
						t = [5, 6];
					}else if (tpoint - kpoint > 5000) {
						k = [5, 6];
						t = [3, 4];
					}else {
						k = [1, 2];
						t = [2, 1];
					}
					function moveimage (kt, kt1, kt2) {
						var ktkttoggle = kt + kttoggle;
						switch (ktkttoggle) {
							case "kinokofalse":
								kinoko[i].frame = kt1;
								break;
							case "kinokotrue":
								kinoko[i].frame = kt2;
								break;
							case "takenokofalse":
								takenoko[i].frame = kt1 + 7;
								break;
							case "takenokotrue":
								takenoko[i].frame = kt2 + 7;
								break;
						}
						kttoggle = !kttoggle;
					}
					function movek() {
						moveimage("kinoko", k[0], k[1]);
					}
					function movet() {
						moveimage("takenoko", t[0], t[1]);
					}
					takenoko[i].frame = 7;
					kinoko[i].scale(0.9, 0.9);
					takenoko[i].scale(0.9, 0.9);
					kinoko[i].tl
					.delay(16)
					.then(movek)
					.loop();
					takenoko[i].tl
					.delay(8)
					.then(movet)
					.loop();
					ktsw = true;
					sentaku = false;
					function gogame(data) {
						if (core.currentScene == start) {
							if (data == 'on') {
								if (ktsw) {
									startback.tl.moveX(0, 15);
									ktsw = false;
									sentaku = true;
									start.removeChild(takenoko[i]);
									start.removeChild(moji);
									start.addChild(kinoko[i]);
									kinoko[i].tl.moveX(100, 15);
									start.removeChild(take_ru);
									start.addChild(kino_ru);
									start.removeChild(ktokuten);
									start.removeChild(ttokuten);
								} else {
									startback.tl.moveX(-1560, 15);
									ktsw = true;
									sentaku = true;
									start.removeChild(kinoko[i]);
									start.removeChild(moji);
									start.addChild(takenoko[i]);
									takenoko[i].tl.moveX(720, 15);
									start.removeChild(kino_ru);
									start.addChild(take_ru);
									start.removeChild(ktokuten);
									start.removeChild(ttokuten);
								}
							} else if (data == 'enter' && sentaku) {
								remote.emit("emit_from_client", "start");
								i++;
								remote.removeEventListener("emit_from_server", gogame);
								startv.stop();
								gameinit(!ktsw);
							}
						}
					}
					start.tl.delay(2448).then(function () {
						startv.stop();
						startv.play();
					}).loop();
					remote.on('emit_from_server', gogame);
					core.replaceScene(start);
				}
				function clearinit(kt, ctime) {
					clear = new Scene();
					console.log(ctime);
					var CharaClear = Class.create(Sprite, {
							initialize: function (x, y, kt, w, h, f) {
								Sprite.call(this, w, h);
								this.x = x;
								this.y = y;
								this.frame = f;
								this.image = core.assets[kt + '.png'];
								clear.addChild(this);
							}
						}),
						ClearText = Class.create(Label, {
							initialize: function (x, y, co, te, fs, al, w, h) {
								Label.call(this);
								this.x = x;
								this.y = y;
								this.color = co;
								this.font = fs + 'px Hiragino Maru Gothic Pro';
								this.text = te;
								this.textAlign = al;
								if (w !== void 0 && h !== void 0) {
									this.width = w;
									this.height = h;
								}
								clear.addChild(this);
							}
						});
					if (kt) {
						gamescene = new CharaClear(0, 0, "kinoback", 1440, 900, 0);
						kttr1.tl
						.moveY(kttr1.y - 1000, 96, enchant.Easing.BOUNCE_EASEIN)
						.and()
						.moveX(kttr1.x - 500, 96, enchant.Easing.BACK_EASEOUT)
						.and()
						.rotateTo(60, 96, enchant.Easing.SWING)
						.removeFromScene();
						kttr2.tl
						.moveY(kttr2.y - 1000, 96, enchant.Easing.BOUNCE_EASEIN)
						.and()
						.moveX(kttr2.x - 500, 96, enchant.Easing.BACK_EASEOUT)
						.and()
						.rotateTo(60, 96, enchant.Easing.SWING)
						.removeFromScene();
					} else {
						gamescene = new CharaClear(0, 0, "takeback", 1440, 900, 0);
						kttr1.tl
						.moveY(kttr1.y - 1000, 96, enchant.Easing.BOUNCE_EASEIN)
						.and()
						.moveX(kttr1.x + 500, 96, enchant.Easing.BACK_EASEOUT)
						.and()
						.rotateTo(-60, 96, enchant.Easing.SWING)
						.removeFromScene();
						kttr2.tl
						.moveY(kttr2.y - 1000, 96, enchant.Easing.BOUNCE_EASEIN)
						.and()
						.moveX(kttr2.x + 500, 96, enchant.Easing.BACK_EASEOUT)
						.and()
						.rotateTo(-60, 96, enchant.Easing.SWING)
						.removeFromScene();
					}
					var kttoggle = false;
					clear.tl
					.delay(60)
					.then(function () {
						tobidasiv.play();
						if (kt) {
							remote.emit('emit_from_client', 'knyoki');
						} else {
							remote.emit('emit_from_client', 'tnyoki');
						}
					});
					gamescene.tl.delay(96).then(function () {
						tobidasiv.stop();
						var clearscene = new CharaClear(0, 0, "congratulation", 1440, 900, 0),
							s = new ClearText(850, 400, "#cff", "SCORE:", 40, "left"),
							t = new ClearText(850, 500, "#cff", "TIME BONUS:", 40, "left"),
							score = new ClearText(1000, 370, "#cff", 0, 90, "right"),
							timebonus = new ClearText(1000, 470, "#cff", 0, 90, "right"),
							poi = 0,
							tokuten = new ClearText(1000, 590, "#cff", 0, 90, "right"),
							wepoint, theypoint, ktpoint;
						if (kt) {
							kiotae = new CharaClear(100, -700, "kinotake", 600, 700, 0);
						} else {
							kiotae = new CharaClear(100, -700, "kinotake", 600, 700, 7);
						}
						clearv.play();
						kiotae.tl.moveY(150, 24, enchant.Easing.BOUNCE_EASEOUT);
						kiotae.tl
						.then(function() {
							if (kt) {
								if (kttoggle) {
									kiotae.frame = 3;
								} else {
									kiotae.frame = 4;
								}
							} else {
								if (kttoggle) {
									kiotae.frame = 10;
								} else {
									kiotae.frame = 11;
								}
							}
							kttoggle = !kttoggle;
						})
						.loop();
						if (kt) {
							wepoint = new ClearText(810.35, 758, "#cff", kpoint, 60, "center", 240, 104);
							theypoint = new ClearText(1086.484, 758, "#cff", tpoint, 60, "center", 240, 104);
						} else {
							wepoint = new ClearText(1086.484, 758, "#cff", tpoint, 60, "center", 240, 104);
							theypoint = new ClearText(810.35, 758, "#cff", kpoint, 60, "center", 240, 104);
						}
						clear.removeChild(tokuten);
						score.on("enterframe", function () {
							if (poi === 0) {
								if (this.text != 1000) {
									this.text = parseInt(this.text) + 8;
								} else {
									poi = 1;
								}
							}
						});
						var c = 0;
						timebonus.on("enterframe", function () {
							if (poi == 1) {
								if (c != ctime * 3 && ctime != 1) {
									c = (parseFloat(c) + ctime / 100 * 3).toFixed(1);
									this.text = Math.floor(c);
								} else {
									if (ctime == 1) {
										this.text = 3;
										tokuten.text = 1003;
									} else {
										this.text = ctime * 3;
										tokuten.text = 1000 + ctime * 3;
									}
									clear.addChild(tokuten);
									poi = 2;
									this.tl.delay(96).then(function () {
										poi = 3;
									});
								}
							}
						});
						ktpoint = parseInt(wepoint.text);
						var a = ktpoint, b = parseInt(tokuten.text);
						c = 0;
						wepoint.on("enterframe", function () {
							if (poi == 3) {
								if (c != 100) {
									a += (1000 + ctime * 3) / 100;
									c++;
									this.text = Math.floor(a);
								} else {
									this.text = ktpoint + 1000 + ctime * 3;
									poi = 4;
									modoru = new CharaClear(0, 680, "modoru", 220, 220, 7);
								}
							}
						});
						function gostart(data) {
							if (data == 'enter' && core.currentScene == clear && poi == 4) {
								if (kt) {
									kpoint = parseInt(wepoint.text);
								} else {
									tpoint = parseInt(wepoint.text);
								}
								clearv.stop();
								console.log("きのこ:" + kpoint + "点");
								console.log("たけのこ:" + tpoint + "点");
								document.cookie = "KPOINT=" + kpoint;
								document.cookie = "TPOINT=" + tpoint;
								remote.removeEventListener('emit_from_server', gostart);
								startinit(kpoint, tpoint);
							}
						}
						remote.addEventListener('emit_from_server', gostart);
					});
					clear.addChild(kttr1);
					clear.addChild(kttr2);
					core.replaceScene(clear);
				}
				function timeupinit(kt, p) {
					timeup = new Scene();
					var CharaTimeUp = Class.create(Sprite, {
							initialize: function (x, y, kt, w, h, f) {
								Sprite.call(this, w, h);
								this.moveTo(x, y);
								this.frame = f;
								this.image = core.assets[kt + '.png'];
								timeup.addChild(this);
							}
						}),
						TimeUpText = Class.create(Label, {
							initialize: function (x, y, co, te, fs, al, w, h) {
								Label.call(this);
								this.x = x;
								this.y = y;
								this.color = co;
								this.font = fs + 'px Hiragino Maru Gothic Pro';
								this.text = te;
								this.textAlign = al;
								if (w !== void 0 && h !== void 0) {
									this.width = w;
									this.height = h;
								}
								timeup.addChild(this);
							}
						});
					if (kt) {
						gamescene = new CharaTimeUp(0, 0, "kinoback", 1440, 900, 0);
					} else {
						gamescene = new CharaTimeUp(0, 0, "takeback", 1440, 900, 0);
					}
					remote.emit('emit_from_client', 'timeup');
					kttr1.tl.moveX(-600, 96, enchant.Easing.SWING);
					kttr2.tl.moveX(-600, 96, enchant.Easing.SWING);
					timeup.addChild(kttr1);
					timeup.addChild(kttr2);
					if (kt) {
						kiotae = new CharaTimeUp(100, -700, "kinotake", 600, 700, 0);
					} else {
						kiotae = new CharaTimeUp(100, -700, "kinotake", 600, 700, 7);
					}
					var timeupscene,
						moveimage = function(kt1, kt2) {
							if (kt) {
								if (kttoggle) {
									kiotae.frame = kt1;
								} else {
									kiotae.frame = kt2;
								}
							} else {
								if (kttoggle) {
									kiotae.frame = kt1 + 7;
								} else {
									kiotae.frame = kt2 + 7;
								}
							}
							kttoggle = !kttoggle;
						};
					if (p < 500) {
						timeupscene = new CharaTimeUp(0, 0, "good", 1440, 900);
						kntk = 1;
						ioae = 2;
						h = 1;
						goodv.play();
					} else if (p < 800) {
						timeupscene = new CharaTimeUp(0, 0, "nice", 1440, 900);
						kntk = 1;
						ioae = 2;
						h = 2;
						goodv.play();
					} else {
						timeupscene = new CharaTimeUp(0, 0, "great", 1440, 900);
						kntk = 3;
						ioae = 4;
						h = 3;
						greatv.play();
					}
					var poi = 0,
						tokuten = new TimeUpText(1000, 590, "#cff", 0, 90, "right"),
						wepoint, theypoint, ktpoint;
						if (kt) {
							wepoint = new TimeUpText(810.35, 758, "#cff", kpoint, 60, "center", 240, 104);
							theypoint = new TimeUpText(1086.484, 758, "#cff", tpoint, 60, "center", 240, 104);
						} else {
							wepoint = new TimeUpText(1086.484, 758, "#cff", tpoint, 60, "center", 240, 104);
							theypoint = new TimeUpText(810.35, 758, "#cff", kpoint, 60, "center", 240, 104);
						}
					timeupscene.tl.cue({
						96: function () {
							kiotae.tl.moveY(150, 24, enchant.Easing.BOUNCE_EASEOUT)
							.then(function () {
								moveimage(kntk, ioae);
							}).loop();
							tokuten.text = p;
						},
						120: function () {
							var hukidasi = new CharaTimeUp(700, 200, "hukidasi", 500, 300, h);
						},
						192: function () {
							var a = parseInt(wepoint.text);
							ktpoint = a;
							wepoint.on("enterframe", function () {
								if (poi === 0) {
									if (ktpoint + p != a) {
										a += p / 80;
										this.text = Math.floor(a);
									} else {
										this.text = ktpoint + p;
										poi = 1;
										modoru = new CharaTimeUp(0, 680, "modoru", 220, 220, 7);
									}
								}
							});
							function gostart(data) {
								if (data == 'enter' && core.currentScene == timeup && poi == 1) {
									if (kt) {
										kpoint = parseInt(wepoint.text);
									} else {
										tpoint = parseInt(wepoint.text);
									}
									console.log(wepoint.text);
									console.log("きのこ:" + kpoint + "点");
									console.log("たけのこ:" + tpoint + "点");
									document.cookie = "KPOINT=" + kpoint;
									document.cookie = "TPOINT=" + tpoint;
									greatv.stop();
									goodv.stop();
									remote.removeEventListener('emit_from_server', gostart);
									startinit(kpoint, tpoint);
								}
							}
							remote.addEventListener('emit_from_server', gostart);
						}
					});
					core.replaceScene(timeup);
				}
				startinit(kpoint, tpoint);
				function sec(s) {
					return s * core.fps;
				}
			};
			core.start();
		}
	});
};

function rand(n) {
	return Math.floor(Math.random() * (n + 1));
}
