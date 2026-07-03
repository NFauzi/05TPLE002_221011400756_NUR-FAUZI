class TetrisGame {

    constructor() {
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");

        this.blockSize = 20;
        this.cols = 12;
        this.rows = 20;

        this.score = 0;

        // Arena permainan
        this.board = Array.from(
            {length:this.rows},
            () => Array(this.cols).fill(0)
        );

        // Bentuk balok (hanya 4 jenis agar sederhana)
        this.shapes = [
            [[1,1],[1,1]],            // O
            [[1,1,1,1]],              // I
            [[1,1,1],[0,1,0]],        // T
            [[1,1,0],[0,1,1]]         // Z
        ];

        this.colors = [
            "#facc15",
            "#06b6d4",
            "#a855f7",
            "#ef4444"
        ];

        this.newPiece();

        document.addEventListener(
            "keydown",
            (e)=>this.control(e)
        );

        setInterval(()=>this.update(),400);
    }

    // Membuat balok baru
    newPiece(){
        const index = Math.floor(
            Math.random() * this.shapes.length
        );

        this.shape = this.shapes[index];
        this.color = this.colors[index];

        this.x = 4;
        this.y = 0;
    }

    // Menggambar papan
    draw(){
        this.ctx.clearRect(
            0,0,
            this.canvas.width,
            this.canvas.height
        );

        // Balok yang sudah menempel
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                if(this.board[y][x]){
                    this.drawBlock(
                        x,
                        y,
                        this.board[y][x]
                    );
                }
            }
        }

        // Balok aktif
        for(let y=0;y<this.shape.length;y++){
            for(let x=0;x<this.shape[y].length;x++){
                if(this.shape[y][x]){
                    this.drawBlock(
                        this.x+x,
                        this.y+y,
                        this.color
                    );
                }
            }
        }
    }

    // Menggambar satu kotak
    drawBlock(x,y,color){
        this.ctx.fillStyle=color;
        this.ctx.fillRect(
            x*this.blockSize,
            y*this.blockSize,
            this.blockSize-1,
            this.blockSize-1
        );
    }

    // Cek tabrakan
    collision(nx=this.x, ny=this.y, shape=this.shape){
        for(let y=0;y<shape.length;y++){
            for(let x=0;x<shape[y].length;x++){
                if(shape[y][x]){
                    let px=nx+x;
                    let py=ny+y;

                    if(
                        px<0 ||
                        px>=this.cols ||
                        py>=this.rows
                    ){
                        return true;
                    }

                    if(
                        py>=0 &&
                        this.board[py][px]
                    ){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Menempelkan balok ke arena
    merge(){
        for(let y=0;y<this.shape.length;y++){
            for(let x=0;x<this.shape[y].length;x++){
                if(this.shape[y][x]){
                    this.board[
                        this.y+y
                    ][
                        this.x+x
                    ] = this.color;
                }
            }
        }
    }

    // Menghapus baris penuh
    clearLines(){
        for(let y=this.rows-1;y>=0;y--){
            if(this.board[y].every(cell=>cell!==0)){
                this.board.splice(y,1);
                this.board.unshift(
                    Array(this.cols).fill(0)
                );
                this.score += 10;
                document.getElementById(
                    "score"
                ).textContent=this.score;
                y++;
            }
        }
    }

    // Rotasi balok
    rotate(){
        let rotated = this.shape[0].map(
            (_,i)=>
            this.shape.map(
                row=>row[i]
            ).reverse()
        );

        if(!this.collision(
            this.x,
            this.y,
            rotated
        )){
            this.shape=rotated;
        }
    }

    // Kontrol keyboard
    control(e){
        if(
            e.key==="ArrowLeft" &&
            !this.collision(this.x-1,this.y)
        ){
            this.x--;
        }

        if(
            e.key==="ArrowRight" &&
            !this.collision(this.x+1,this.y)
        ){
            this.x++;
        }

        if(
            e.key==="ArrowDown" &&
            !this.collision(this.x,this.y+1)
        ){
            this.y++;
        }

        if(e.key==="ArrowUp"){
            this.rotate();
        }

        this.draw();
    }

    // Update game
    update(){

        if(
            !this.collision(
                this.x,
                this.y+1
            )
        ){
            this.y++;
        }else{
            this.merge();
            this.clearLines();
            this.newPiece();

            if(
                this.collision(
                    this.x,
                    this.y
                )
            ){
                alert(
                    "Game Over!\nScore : "
                    + this.score
                );
                location.reload();
            }
        }

        this.draw();
    }
}

// Membuat objek game
const game = new TetrisGame();