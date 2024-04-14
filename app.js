const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let boxX = 50;
let boxY = 50;
let boxVX = 2;
let boxVY = 2;
let MapWidth = 5;

const boxWidth = 50
const boxHeight = 50

let deleteflag = true
let score = 0;

let score_display = document.getElementById('score');

/* 
 * todo
 * 落下中は最後まで落下しきるまで同色で隣接しても消去しない
 * 3つ以上の連鎖で消去する
 * 縦連鎖でも消去する
 * 得点つける
 */

class Block{
    constructor(x, y, width, height, color, strokeColor, isExist) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.strokeColor = strokeColor;
        this.isExist = isExist;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 枠線
        ctx.strokeStyle = this.strokeColor;
        //ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    logicDelete(){
        this.isExist = false;
        this.color = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.strokeColor = "white"
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        //console.log("【delete】")
    }
}

let color = ["red", "blue", "green", "yellow", "pink"]
let blocks = [];
function spawnBlock(i){
    /*
    const x = Math.random() * (canvas.width - boxWidth);
    const y = Math.random() * (canvas.height - boxHeight);
    */

    const x = i * boxWidth;
    const y = canvas.height - boxHeight * 2;

    //console.log("x:y", x,y);

    let idx = Math.floor(Math.random() * (color.length - 1));
    //console.log(idx);
    const block = new Block(x, y, boxWidth, boxHeight, color[idx], "black", true)
    blocks.push(block);
    console.log(block.color);
    //blocks = [block].concat(blocks);
}


function SpawnUnderRowBlock(){
    for (let i = 0; i < 5;i++){
        if (blocks.length >= 51 && blocks[blocks.length-55+i].isExist){
            return
        }
    }
    // ブロック全体を上にあげる
    blocks.forEach(block => block.y -= boxHeight);
    // 5個ブロックを最下層に作る

    console.log("spawn開始")
    for (let i = 0; i < 5; i++) {
        spawnBlock(i);
    }
    console.log("spawn終了")
}

function checkFloatBlock(){
    //console.log("checkFloatBlock start")
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].color == "white")
        {
            //blocks[i].isExist = false;
            blocks[i].logicDelete();
        }
    }

    for (let i = blocks.length - 1; i > 4; i--) {
        /*
        try{
            console.log("checkFloatBlock")
            blocks[i+5].isExist = true;
            blocks[i+5].color = blocks[i].color;
            blocks[i+5].strokeColor = "black";
            blocks[i].isExist = false;
            blocks[i].color = "white"
            blocks[i].strokeColor = "white"    
        }catch(e){
            console.log("checkFloatBlock error", e)
        }
        */
       //console.log("blocks[",i,"]: ", blocks[i])
        //if (blocks[i] && blocks[i].isExist == false)
        if (blocks[i] && blocks[i].isExist == false && blocks[i-5] && blocks[i-5].isExist == true)
        {
            //console.log("_checkFloatBlock")
            blocks[i].isExist = true;
            blocks[i].color = blocks[i - 5].color;
            blocks[i].strokeColor = "black";
            blocks[i-5].isExist = false;
            blocks[i-5].color = "white"
            blocks[i-5].strokeColor = "white"
        }
    }
}


function handleClick(event){
    deleteflag = false;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top
    /*
    console.log("x:", x);
    console.log("event.clientX:", event.clientX);
    */
    let clickedBlock = blocks.find(block => {
        return (
            //block.isExist == true &&
            x >= block.x &&
            x <= block.x + block.width &&
            y >= block.y &&
            y <= block.y + block.height 
        );
    });

    if (clickedBlock){
        swapBlocks(clickedBlock);
    }
    deleteflag = true;
}

function swapBlockTwoThings(index, attribute)
{
    let temp = blocks[index].attribute;
    blocks[index].attribute = blocks[index+1].attribute;
    blocks[index+1].attribute = temp;
}


function swapBlocks(clickedBlock) {
    let index = blocks.indexOf(clickedBlock);
    //let rightBlock = blocks[index + 1];
    /*
    console.log("index:" , index)
    console.log("clickedBlock:" , clickedBlock)
    */
    // 右隣にブロックがあれば位置を交換
    if ((index) % 5 < (index + 1) % 5) {
        //swapBlockTwoThings(index, clickedBlock.color)
        
        temp = blocks[index].color;
        blocks[index].color = blocks[index+1].color;
        blocks[index+1].color = temp;
        //swapBlockTwoThings(index, clickedBlock.isExist)

        //swapTwoThings(blocks[index].isExist, blocks[index+1].isExist)
        
        temp = blocks[index].isExist;
        blocks[index].isExist = blocks[index+1].isExist;
        blocks[index+1].isExist = temp;
        blocks.forEach(block => console.log(block.color));
    }
    // 
}


function deleteBlock()
{
    for (var i=0; i<blocks.length; i++) 
    {
        if (i % 5 == 3 || i % 5 == 4) continue;
        if (blocks[i].color !="white" && blocks[i].color == blocks[i+1].color && blocks[i+1].color == blocks[i+2].color){
            blocks[i].logicDelete();
            blocks[i+1].logicDelete();
            blocks[i+2].logicDelete();

            score += 10;
            /*
            if (blocks.length >= 6){
                deleteField[i%5] = 1;
                deleteField[(i%5)+1] = 1;                
            }
            */
        }
    }
    
    for (let i=0; i<5; i++){
        // 列ごとの処理
        let firstDelPosi = i;
        let lastDelPosi = i+5;
        let delflag = false;
        for (let j=1; j< blocks.length/5; j++) {
            // 行ごとの処理
            /*
            console.log("firstDelPosi", firstDelPosi);
            console.log("lastDelPosi", lastDelPosi);
            */
            // ホワイトなら無視
            if (blocks[firstDelPosi].color == "white"){
                firstDelPosi += 5;
                lastDelPosi += 5;
                continue;
            }
            // 色が続く限り続ける　途切れたらそこを起点に再開する
            if (blocks[firstDelPosi].color == blocks[lastDelPosi].color){
                lastDelPosi += 5;
                // 3つ以上続いていたら削除対象
                if ((lastDelPosi - firstDelPosi)/5 >= 3) delflag = true;
            }else{
                firstDelPosi = lastDelPosi;
                lastDelPosi += 5
            }
            //if (delflag || lastDelPosi >= blocks.length-5){
            if (delflag){
                console.log("deleteBlock開始")
                for (; firstDelPosi<lastDelPosi ; firstDelPosi+=5) {
                    
                    console.log(blocks[firstDelPosi].color)
                    console.log("削除")
                    blocks[firstDelPosi].logicDelete();
                    score += 10;
                }        
                delflag = false;
                console.log("deleteBlock終了")

            }
        }
    }   
}

ctx.fillStyle = "gold";
function gameloop(){
    // 画面の消去
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // スコア表示
    score_display.innerText = score;

    // ブロックを消す関数
    deleteBlock()
    /* 浮いてるブロックあれば落下させる検査関数 */
    checkFloatBlock();
   // ブロックをクリックしたらスワップする
    addEventListener("click", handleClick)

    /*
    for (i = blocks.length - 1; i >= 0; i--) {
        //console.log("blocks.length:", blocks.length);
        if (i >= (blocks.length - 5)){
            continue;
        }
        //console.log("i:", i);
        if (deleteField[i % 5] == 1){
            try{
                blocks[i+5].color = blocks[i].color;
                blocks[i+5].strokeColor = "black";
                blocks[i+5].isExist = true;
                blocks[i].logicDelete();    
            }catch(e){
                console.log("hoge");
                console.error(e);
            }
        }
    }
    */
    //ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    blocks.forEach(block => {
        block.draw()
        /*
        if (block.isExist){
            block.draw()
        }*/
    });
    //console.log("giger");
    //blocks.forEach(block => console.log(block.color));    
    requestAnimationFrame(gameloop);

}

SpawnUnderRowBlock()
setInterval(SpawnUnderRowBlock, 2000);


requestAnimationFrame(gameloop);

alert('1');

