let arrObjWord = [];
let XYLettCell = [[], []];
let exceptions = [];

//Canvas letter
let width_cl = 400;
let height_cl = 400;
let crop_x = 0, crop_y = 0;

let boostOn = false;

function random(min, max) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('in0').innerText = 'кроссворд;головоломка;слова;буквы;горизонтальный;вертикальный;поиск;решение;сетка;ячейка;навык;игра;загадка;вопрос;колонка;строка;символ;разгадка;подсказка;комбинация'
    /*
        let canvas = document.getElementById("canva");
        let ctx = canvas.getContext("2d");
        let 
        canvas.width = window.innerWidth;
        
        ctx.fillStyle = "rgb(0,0,0)";
    
    
            ctx.fillRect(i * 20, 0, 2, 1000);
        */

});


function createObj() {
    startTimer();
    let str = document.getElementById('in0').value.toUpperCase();
    let word = [];
    arrObjWord = [];
    //alert(str);
    word = str.split(document.getElementById('in1').value);

    if (boostOn) word = sortingArr(word);
    console.log(word)

    for (let i = 0; i < word.length; i++) {
        if (i == 0) {
            arrObjWord.push({
                text: word[i],
                x: 1000,
                y: 1000,
                rate: 0 //random(0, 1)
            });
        } else {
            arrObjWord.push({
                text: word[i],
                x: -1,
                y: -1,
                rate: -1
            });
        }
    }

    ranking();
    cropMap();
    drawCrossword();

    console.log('Done.\nTime spent: ' + getTime() + 'ms');
    console.log('Exception numbers: ' + exceptions);

}

function ranking() {
    for (let i = 0; i < arrObjWord.length; i++) {
        //console.log(arrObjWord[i].text)
        for (let j = 0; j < arrObjWord[i].text.length; j++) {
            //console.log(arrObjWord[i].text[j])
            for (let ii = 0; ii < arrObjWord.length; ii++) {
                if (arrObjWord[i].x + arrObjWord[i].y > 0 && arrObjWord[ii].x + arrObjWord[ii].y < 0 && ii != i) {
                    // arrObjWord[ii].x + arrObjWord[ii].y > 0 && 
                    for (let jj = 0; jj < arrObjWord[ii].text.length; jj++) {
                        if (arrObjWord[i].text[j] == arrObjWord[ii].text[jj]) {
                            let answerCheck = checkFreeCell(i, ii, j, jj);
                            if (answerCheck != -1) {
                                arrObjWord[ii].x = answerCheck[0];
                                arrObjWord[ii].y = answerCheck[1];
                                arrObjWord[ii].rate = Number(!Boolean(arrObjWord[i].rate));
                            }

                            //console.log(answerCheck);


                        }
                    }
                }
            }

        }
    }

}



function checkFreeCell(numObj0, numObj1, numLett0, numLett1) {
    let full_size = [[], [], []];
    let full_size_extended = [[], [], []];

    //let char = arrObjWord[numObj0].text[numLett0];



    if (arrObjWord[numObj0].rate) {
        for (let i = 0; i < arrObjWord[numObj1].text.length; i++) {
            full_size[1].push(arrObjWord[numObj0].y + numLett0);
            full_size[0].push(arrObjWord[numObj0].x + i - numLett1);
            full_size[2].push(arrObjWord[numObj1].text[i]);

        }
    } else {
        for (let i = 0; i < arrObjWord[numObj1].text.length; i++) {
            full_size[0].push(arrObjWord[numObj0].x + numLett0);
            full_size[1].push(arrObjWord[numObj0].y + i - numLett1);
            full_size[2].push(arrObjWord[numObj1].text[i]);
        }
    }

    full_size_extended = full_size;

    if (arrObjWord[numObj0].rate) {

        full_size[0].push(full_size[0][0] - 1);
        full_size[1].push(full_size[1][0]);
        full_size[0].push(full_size[0][full_size[0].length - 1] + 1);
        full_size[1].push(full_size[1][full_size[1].length - 1]);

        for (let i = 0; i < arrObjWord[numObj1].text.length; i++) {
            full_size[1].push(arrObjWord[numObj0].y + numLett0 + 1);
            full_size[0].push(arrObjWord[numObj0].x + i - numLett1);
            full_size[1].push(arrObjWord[numObj0].y + numLett0 - 1);
            full_size[0].push(arrObjWord[numObj0].x + i - numLett1);

        }

    } else {

        full_size[0].push(full_size[0][0]);
        full_size[1].push(full_size[1][0] - 1);
        full_size[0].push(full_size[0][full_size[0].length - 1]);
        full_size[1].push(full_size[1][full_size[1].length - 1] + 1);


        for (let i = 0; i < arrObjWord[numObj1].text.length; i++) {
            full_size[0].push(arrObjWord[numObj0].x + numLett0 + 1);
            full_size[1].push(arrObjWord[numObj0].y + i - numLett1);
            full_size[0].push(arrObjWord[numObj0].x + numLett0 - 1);
            full_size[1].push(arrObjWord[numObj0].y + i - numLett1);

        }
    }

    let resul = [full_size[0][0], full_size[1][0]];




    for (let i = 0; i < arrObjWord.length; i++) {
        if (arrObjWord[i].x + arrObjWord[i].y < 0 || i == numObj1) continue;
        for (let j = 0; j < arrObjWord[i].text.length; j++) {
            let x = -1, y = -1;
            if (!arrObjWord[i].rate) {
                x = arrObjWord[i].x + j;
                y = arrObjWord[i].y;
            } else {
                x = arrObjWord[i].x;
                y = arrObjWord[i].y + j;
            }

            for (let l = 0; l < full_size[2].length; l++) {

                //console.log((full_size[0][l] + ':' + x) + ' ' + (full_size[1][l] + ':' + y) + ' ' + (full_size[2][l] + ':' + arrObjWord[i].text[j]));

                if (full_size[0][l] == x && full_size[1][l] == y && full_size[2][l] != arrObjWord[i].text[j]) {
                    resul = -1;
                    //return -1;
                } else {
                    if (!arrObjWord[numObj0].rate == arrObjWord[i].rate) {
                        for (let ll = 0; ll < full_size_extended[0].length; ll++) {
                            if (full_size_extended[0][ll] == x && full_size_extended[1][ll] == y) {
                                resul = -1;
                                //return -1;
                            }

                        }
                    }

                }
            }


        }
    }

    //console.log(numLett1);
    //console.log(full_size);

    return resul;

}


function cropMap() {
    let x_max = 0, x_min = arrObjWord[0].x;
    let y_max = 0, y_min = arrObjWord[0].y;

    for (let i = 0; i < arrObjWord.length; i++) {
        if (arrObjWord[i].x + arrObjWord[i].y < 0) continue;

        if (arrObjWord[i].x < x_min) x_min = arrObjWord[i].x;
        if (arrObjWord[i].y < y_min) y_min = arrObjWord[i].y;

        if (!arrObjWord[i].rate) {
            if (arrObjWord[i].x + arrObjWord[i].text.length > x_max) x_max = arrObjWord[i].x + arrObjWord[i].text.length;
            if (arrObjWord[i].y > y_max) y_max = arrObjWord[i].y;
        } else {
            if (arrObjWord[i].x > x_max) x_max = arrObjWord[i].x
            if (arrObjWord[i].y + arrObjWord[i].text.length > y_max) y_max = arrObjWord[i].y + arrObjWord[i].text.length;
        }

    }



    x_max -= x_min;
    y_max -= y_min;

    width_cl = x_max;
    height_cl = y_max;

    crop_x = x_min;
    crop_y = y_min;


}



let timertime = new Date();

function startTimer() {
    timertime = new Date();
}

function getTime() {
    return new Date() - timertime;
}



function drawCrossword() {

    exceptions = [];

    let worldcentX = 0, worldcentY = 0;
    let cellSize = 40;
    let cellColor = "white";
    let cellBorder = "black";
    let textColor = "black";
    let arrowColor = "black";
    let fontSize = 16;
    let fontName = "Arial";


    let canvas = document.getElementById("canva");
    canvas.width = width_cl * cellSize;
    canvas.style.maxWidth = width_cl * cellSize + 'px';
    canvas.height = height_cl * cellSize;

    let ctx = canvas.getContext("2d");



    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,0,0,0.3)";
    ctx.fillRect(0, 0, cellSize/2, cellSize/2);
    ctx.fillStyle = "rgba(0,255,0,0.3)";
    ctx.fillRect(cellSize/2/3, cellSize/2/3, cellSize/2, cellSize/2);
    ctx.fillStyle = "rgba(0,0,255,0.3)";
    ctx.fillRect(cellSize/2/3*2, cellSize/2/3*2, cellSize/2, cellSize/2);
    ctx.fillStyle = "rgba(0,0,0)";
    
    for (let i = 0; i < arrObjWord.length; i++) {

        if (arrObjWord[i].x + arrObjWord[i].y < 0) {
            //console.log(arrObjWord[i].text);
            exceptions.push(i);
            continue;
        }

        let x = arrObjWord[i].x - crop_x;
        let y = arrObjWord[i].y - crop_y;
        let text = arrObjWord[i].text;
        let rate = arrObjWord[i].rate;

        //console.log(x + ' ' + y);

        for (let j = 0; j < text.length; j++) {

            let px = 0;
            let py = 0;

            ctx.fillStyle = cellColor;
            ctx.strokeStyle = cellBorder;

            if (rate == 0) {
                px = (x + j - worldcentX) * cellSize + worldcentX;
                py = (y - worldcentY) * cellSize + worldcentY;
            } else {
                px = (x - worldcentX) * cellSize + worldcentX;
                py = (y + j - worldcentY) * cellSize + worldcentY;
            }


            ctx.fillRect(px, py, cellSize, cellSize);
            ctx.strokeRect(px, py, cellSize, cellSize);


            ctx.fillStyle = textColor;
            ctx.font = fontSize + "px " + fontName;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text[j], px + cellSize / 2, py + cellSize / 2);

        }
    }


    for (let i = 0; i < arrObjWord.length; i++) {
        if (arrObjWord[i].x + arrObjWord[i].y < 0) continue;

        let x = arrObjWord[i].x - crop_x;
        let y = arrObjWord[i].y - crop_y;
        let rate = arrObjWord[i].rate;
        let px = 0;
        let py = 0;


        if (rate == 0) {
            px = (x - worldcentX) * cellSize + worldcentX;
            py = (y - worldcentY) * cellSize + worldcentY;
        } else {
            px = (x - worldcentX) * cellSize + worldcentX;
            py = (y - worldcentY) * cellSize + worldcentY;
        }


        ctx.strokeStyle = arrowColor;
        if (!rate) {
            arrow(ctx, px + cellSize / 6, py + cellSize / 6, px + cellSize / 2, py + cellSize / 6);
            ctx.fillStyle = textColor;
            ctx.font = fontSize/1.5 + "px " + fontName;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(i, px + cellSize/4*3, py + cellSize / 6);
        } else {
            arrow(ctx, px + cellSize / 6, py + cellSize / 6, px + cellSize / 6, py + cellSize / 2);
            ctx.fillStyle = textColor;
            ctx.font = fontSize/1.5 + "px " + fontName;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(i, px + cellSize / 6, py + cellSize/4*3);
        }


    }

}



function arrow(ctx, fromx, fromy, tox, toy) {
    let headlen = 4; // length of head in pixels
    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}



function sortingArr(arrIn) {
    arrIn.sort((a, b) => {
        return b.length - a.length;
    });
    return arrIn;
}

let commAndAct = [];
commAndAct.push({
    command: 'boost',
    func: boostOnFun,
    LSAddr: 0,
    varName: 'boostOn'
});

function setConf() {
    for (let i = 0; i < commAndAct.length; i++) {
        if (commAndAct[i].LSAddr > -1 && typeof(localStorage[commAndAct[i].LSAddr]) == 'string') {
            eval(commAndAct[i].varName + ' = ' + localStorage[commAndAct[i].LSAddr]);
        }

    }
}
setConf()

function setPrama() {
    let comm = prompt('Write command: ');
    for (let i = 0; i < commAndAct.length; i++) {
        if (commAndAct[i].command == comm) {
            alert(commAndAct[i].func());
        }

    }

}



function boostOnFun() {
    boostOn = !boostOn;
    localStorage[0] = boostOn;
    return boostOn;
}
