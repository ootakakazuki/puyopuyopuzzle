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
        //ctx.fillStyle = this.black;
        //this.color = "rgba(255,255,255,0)";
        this.color = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //ctx.fillStyle = "rgba(255,255,255,0)";
        //this.strokeColor = "rgba(255,255,255,0)"
        this.strokeColor = "white"
        //ctx.strokeStyle = "rgba(255,255,255,0)";
        
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        console.log("【delete】")
    }
}

let deleteField = [0, 0, 0, 0, 0];
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
    for (let i = 0; i < blocks.length;i++){
        if (blocks.length >= 51 && blocks[i].isExist){
            return
        }
    }

    // ブロック全体を上にあげる
    blocks.forEach(block => block.y -= boxHeight);
    // 5個ブロックを最下層に作る
    for (let i = 0; i < 5; i++) {
        spawnBlock(i);
    }
}

function checkFloatBlock(){
    console.log("checkFloatBlock start")
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].color == "white")
        {
            blocks[i].isExist = false;
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
            console.log("checkFloatBlock")
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
    console.log("x:", x);
    console.log("event.clientX:", event.clientX);

    let clickedBlock = blocks.find(block => {
        console.log(block)
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
    console.log("index:" , index)
    console.log("clickedBlock:" , clickedBlock)

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
        if (i % 5 == 4) continue;
        if (blocks[i].color !="white" && blocks[i].color == blocks[i+1].color){
            blocks[i].logicDelete();
            blocks[i+1].logicDelete();
            score += 10;
            if (blocks.length >= 6){
                deleteField[i%5] = 1;
                deleteField[(i%5)+1] = 1;
                
                console.log("dddd", deleteField);  
            }
        }
    }
    /*
    for (let i=0; i<5; i++){
        let firstDelPosi = i;
        let lastDelPosi = i;
        let delflag = false;
        for (let j=1; j< blocks.length/5; j++) {
            if (blocks[firstDelPosi].color == "white") continue;
            if (blocks[firstDelPosi].color == blocks[lastDelPosi].color){
                lastDelPosi += 5;
                if ((lastDelPosi - firstDelPosi)/5 >= 2) delflag = true;
            }else{
                firstDelPosi = i + j * 5;
            }
            if (delflag || lastDelPosi == blocks.length-5){
                for (; firstDelPosi<lastDelPosi ; firstDelPosi+=5) {
                    blocks[firstDelPosi].logicDelete();
                }        
                delflag = false;
            }

        }
    }
    */
}

ctx.fillStyle = "gold";
function gameloop(){
    // 画面の消去
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    score_display.innerText = score;

    deleteBlock()
    /* 浮いてるブロックあれば落下させる検査関数 */
    checkFloatBlock();
    /*
    for (let i = 0; i < 55; i++) {
        
    }
    */
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
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    blocks.forEach(block => {
        block.draw()
        /*
        if (block.isExist){
            block.draw()
        }*/
    });
    //console.log("giger");
    deleteField = [0, 0, 0, 0, 0];
    //blocks.forEach(block => console.log(block.color));    
    requestAnimationFrame(gameloop);

}

SpawnUnderRowBlock()
setInterval(SpawnUnderRowBlock, 2000);


requestAnimationFrame(gameloop);

alert('1');


/*
fillRect

x
矩形の開始位置の X 座標です。

y
矩形の開始位置の Y 座標です。

width
矩形の幅です。正の数であれば右方向、負の数であれば左方向です。

height
矩形の高さです。正の数であれば下方向、負の数であれば上方向です。
*/ 

/*
ctx.lineWidth = 10;

// 壁
ctx.strokeRect(75, 140, 150, 110);

// ドア
ctx.fillRect(130, 190, 40, 60);

// 屋根
ctx.beginPath();
ctx.moveTo(50, 140);
ctx.lineTo(150, 60);
ctx.lineTo(250, 140);
ctx.closePath();
ctx.stroke();

*/