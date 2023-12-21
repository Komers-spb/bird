
		// Переменные 
		let canvas = document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		canvas.width = window.innerWidth * 0.4;
		canvas.height = window.innerHeight * 0.4;
		let paused = false;
		let score = 0;
		let passedPipes = [];
		let bird = {
			x: 50,
			y: canvas.height / 2 - 10,
			width: 20,
			height: 20,
			speed: 0,
			gravity: 0.7,
			jumpForce: 10,
			draw: function() {
				ctx.fillStyle = "yellow";
				ctx.fillRect(this.x, this.y, this.width, this.height);
			},
			update: function() {
				this.speed += this.gravity;
				this.y += this.speed;
				if (this.y + this.height > canvas.height) {
					this.y = canvas.height - this.height;
					this.speed = 0;
				}
			},
			flap: function() {
				this.speed = -this.jumpForce;
			},
		};
		let pipes = {
			position: [],
			topPipeHeight: 150,
			bottomPipeHeight: 150,
			gap: 150,
			width: 50,
			speed: 3,
			draw: function() {
				for (let i = 0; i < this.position.length; i++) {
					let p = this.position[i];
					ctx.fillStyle = "green";
					ctx.fillRect(p.x, 0, this.width, p.top);
					ctx.fillRect(p.x, canvas.height - p.bottom, this.width, p.bottom);
				}
			},
			update: function() {
				for (let i = 0; i < this.position.length; i++) {
					let p = this.position[i];
					p.x -= this.speed;
					if (p.x + this.width < 0) {
						this.position.shift();
					}
				}
				if (this.position.length == 0) {
					let top = Math.floor(
						Math.random() * (canvas.height - this.gap - this.topPipeHeight)
					);
					this.position.push({
						x: canvas.width,
						top: top,
						bottom: canvas.height - top - this.gap,
					});
				} else {
					let lastPipe = this.position[this.position.length - 1];
					if (lastPipe.x < canvas.width - 200) {
						let top = Math.floor(
							Math.random() * (canvas.height - this.gap - this.topPipeHeight)
						);
						this.position.push({
							x: canvas.width,
							top: top,
							bottom: canvas.height - top - this.gap,
						});
					}
				}
			},
			collision: function() {
				for (let i = 0; i < this.position.length; i++) {
					let p = this.position[i];
					if (
						bird.x < p.x + this.width &&
						bird.x + bird.width > p.x &&
						(bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)
					) {
						return true;
					}
				}
				return false;
			},
		};

		function boost() {
			if (pipes.speed < 3.5) {
				pipes.speed = pipes.speed + 0.1;
			} else if (pipes.speed > 3.5 && pipes.speed < 4) {
				pipes.speed = pipes.speed + 0.15;
			} else if (pipes.speed > 4 && pipes.speed < 4.5) {
				pipes.speed = pipes.speed + 0.17;
			}
		}
		// Игровой цикл 
		function loop() {
			if (!paused) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				bird.draw();
				bird.update();
				pipes.draw();
				pipes.update();
				//вывод счетчика 
				ctx.font = "20px Arial";
				ctx.fillStyle = "black";
				ctx.fillText("Score: " + score, 10, 30);
				//работа счетчика 
				for (let i = 0; i < pipes.position.length; i++) {
					let p = pipes.position[i];
					if (p.x + pipes.width < bird.x && !passedPipes.includes(p)) {
						passedPipes.push(p);
						score++;
						boost();
					}
				}
				//реализация проигрыша 
				if (pipes.collision()) {
					alert("Game Over!");
					document.removeEventListener("keydown", handleKeyDown);
					location.reload();
					return;
				}
			}
			requestAnimationFrame(loop);
		}

		function handleKeyDown(event) {
			if (event.keyCode === 32) {
				bird.flap();
			} else if (event.keyCode === 80) {
				paused = !paused;
			} else if (event.keyCode === 82) {
				document.removeEventListener("keydown", handleKeyDown);
				location.reload();
				return;
				loop();
			}
		}

		function handleMouseDown(event) {
			bird.flap();
		}
		document.addEventListener("mousedown", handleMouseDown);
		// Обработчики событий 
		document.addEventListener("keydown", handleKeyDown); // добавление обработчика событий 
		// Запуск игры 
		loop();
