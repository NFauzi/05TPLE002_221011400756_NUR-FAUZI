// Class utama game Snake
class SnakeGame {

    constructor() {
        // Mengambil elemen canvas
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");

        // Ukuran kotak
        this.size = 20;

        // Posisi awal ular
        this.snake = [
            { x: 10, y: 10 }
        ];

        // Arah gerak awal
        this.dx = 1;
        this.dy = 0;

        // Posisi makanan pertama
        this.food = this.randomFood();

        // Skor
        this.score = 0;

        // Event keyboard
        document.addEventListener("keydown", (e) => this.changeDirection(e));

        // Memulai game
        setInterval(() => this.update(), 150);
    }

    // Membuat posisi makanan secara acak
    randomFood() {
        return {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
        };
    }

    // Mengubah arah ular
    changeDirection(event) {
        if (event.key === "ArrowUp" && this.dy === 0) {
            this.dx = 0;
            this.dy = -1;
        }
        if (event.key === "ArrowDown" && this.dy === 0) {
            this.dx = 0;
            this.dy = 1;
        }
        if (event.key === "ArrowLeft" && this.dx === 0) {
            this.dx = -1;
            this.dy = 0;
        }
        if (event.key === "ArrowRight" && this.dx === 0) {
            this.dx = 1;
            this.dy = 0;
        }
    }

    // Menggambar semua objek
    draw() {

        // Membersihkan canvas
        this.ctx.clearRect(0, 0, 400, 400);

        // Menggambar makanan
        this.ctx.beginPath();
        this.ctx.fillStyle = "#ff4d4d";
        this.ctx.shadowColor = "#ff4d4d";
        this.ctx.shadowBlur = 15;
        this.ctx.arc(
            this.food.x * this.size + 10,
            this.food.y * this.size + 10,
            8,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Reset shadow
        this.ctx.shadowBlur = 0;

        // Menggambar ular
        for (let part of this.snake) {
            this.ctx.fillStyle = "#22c55e";
            this.ctx.fillRect(
                part.x * this.size + 1,
                part.y * this.size + 1,
                this.size - 2,
                this.size - 2
            );

            // Pinggiran ular
            this.ctx.strokeStyle = "#86efac";
            this.ctx.strokeRect(
                part.x * this.size + 1,
                part.y * this.size + 1,
                this.size - 2,
                this.size - 2
            );
        }
    }

    // Update posisi game
    update() {

        // Posisi kepala baru
        const head = {
            x: this.snake[0].x + this.dx,
            y: this.snake[0].y + this.dy
        };

        // Tembus dinding (wrap around)
        if (head.x < 0) head.x = 19;
        if (head.x > 19) head.x = 0;
        if (head.y < 0) head.y = 19;
        if (head.y > 19) head.y = 0;

        // Menambahkan kepala baru
        this.snake.unshift(head);

        // Jika makanan dimakan
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            document.getElementById("score").textContent = this.score;
            this.food = this.randomFood();
        } else {
            // Menghapus ekor jika tidak makan
            this.snake.pop();
        }

        // Cek tabrakan dengan badan sendiri
        for (let i = 1; i < this.snake.length; i++) {
            if (
                head.x === this.snake[i].x &&
                head.y === this.snake[i].y
            ) {
                alert("Game Over!\nScore: " + this.score);
                location.reload();
            }
        }

        // Menggambar ulang
        this.draw();
    }
}

// Membuat objek game
const game = new SnakeGame();