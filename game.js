class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.gameLoop = null;
        this.speed = 150;
        this.setupEventListeners();
        this.isPlaying = false;
    }

    generateFood() {
        const maxX = (this.canvas.width / this.gridSize) - 1;
        const maxY = (this.canvas.height / this.gridSize) - 1;
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = '#e6f9f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar serpiente
        this.ctx.fillStyle = '#43b97f';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Dibujar comida
        this.ctx.fillStyle = '#a8e6cf';
        this.ctx.beginPath();
        this.ctx.arc(
            (this.food.x * this.gridSize) + (this.gridSize / 2),
            (this.food.y * this.gridSize) + (this.gridSize / 2),
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    move() {
        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Verificar colisión con paredes
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver();
            return;
        }

        // Verificar colisión con la serpiente
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Verificar si comió la comida
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            this.food = this.generateFood();
            // Aumentar velocidad
            if (this.speed > 50) {
                this.speed -= 5;
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.move(), this.speed);
            }
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    setupEventListeners() {
        // Prevenir el desplazamiento de la página con las flechas
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                if (!this.isPlaying) return;
                
                switch(e.key) {
                    case 'ArrowUp':
                        if (this.direction !== 'down') this.direction = 'up';
                        break;
                    case 'ArrowDown':
                        if (this.direction !== 'up') this.direction = 'down';
                        break;
                    case 'ArrowLeft':
                        if (this.direction !== 'right') this.direction = 'left';
                        break;
                    case 'ArrowRight':
                        if (this.direction !== 'left') this.direction = 'right';
                        break;
                }
            }
        });

        // Configurar botones táctiles
        const buttons = {
            'upBtn': 'up',
            'downBtn': 'down',
            'leftBtn': 'left',
            'rightBtn': 'right'
        };

        Object.entries(buttons).forEach(([btnId, dir]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                // Manejar tanto click como touch
                ['click', 'touchstart'].forEach(eventType => {
                    btn.addEventListener(eventType, (e) => {
                        e.preventDefault();
                        if (!this.isPlaying) return;
                        
                        const opposites = {
                            'up': 'down',
                            'down': 'up',
                            'left': 'right',
                            'right': 'left'
                        };
                        
                        if (this.direction !== opposites[dir]) {
                            this.direction = dir;
                        }
                    });
                });
            }
        });
    }

    gameOver() {
        this.isPlaying = false;
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
        document.getElementById('startGame').textContent = 'Reiniciar Juego';
    }

    start() {
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.score = 0;
        this.isPlaying = true;
        document.getElementById('score').textContent = '0';
        document.getElementById('startGame').textContent = 'Reiniciar Juego';
        this.food = this.generateFood();
        this.speed = 150;
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.move(), this.speed);
        this.draw();
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snakeCanvas');
    const game = new Snake(canvas);
    
    document.getElementById('startGame').addEventListener('click', () => {
        game.start();
    });
}); 