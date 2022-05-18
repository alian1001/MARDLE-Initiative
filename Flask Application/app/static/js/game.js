const NUMBER_OF_GUESSES=6;
let guesses_remaining=NUMBER_OF_GUESSES;
let current_box=0;
let current_guess=[];

function init_board(){
    let board=document.getElementById("wordle_board");
    let boxes=document.createElement("table");
    for(let i=0; i<6; i++){
        let row=document.createElement("tr");
        row.className="letters_row";
        for(let j=0; j<6; j++){
            let box=document.createElement("td");
            box.innerHTML="&nbsp;&nbsp;&nbsp";
            box.className="letter_box";
            row.appendChild(box);
        }
        boxes.appendChild(row);
    }
    board.appendChild(boxes);
}

function get_timeleft(){
    const xhttp=new XMLHttpRequest();
    xhttp.open("GET",url ,true)
    xhttp.onload=function(e){
        
    }
}

function insert_letter(pressedKey){
    if(current_box==6){
        return
    }
    let row=document.getElementsByClassName("letters_row")[6-guesses_remaining];
    let box=row.children[current_box];
    box.innerHTML=pressedKey;
    box.classList.add("filled_box");
    current_guess.push(pressedKey);
    current_box++;
}

function delete_letter(){
    current_box--;
    let row=document.getElementsByClassName("letters_row")[6-guesses_remaining];
    let box=row.children[current_box];
    box.innerHTML="&nbsp;&nbsp;&nbsp";
    box.classList.remove("filled_box");
    current_guess.pop();
}

document.addEventListener("keydown", (e) => {
    if(guesses_remaining==0){
        return
    }

    let pressedKey=String(e.key);

    if(pressedKey=="Backspace" && current_cell!=0){
        delete_letter()
        return
    }

    let alphabet=pressedKey.match(/[a-z]/gi);

    if(!alphabet || alphabet.length>1){
        return
    }
    else{
        insert_letter(pressedKey);
    }

    if(pressedKey=="Enter" && current_box==6){
        let guess="";
        for(let i=0; i<6; i++){
            guess+=current_guess[i];
        }
        const xhttp=new XMLHttpRequest();

        xhttp.open("GET", url, true);
        xhttp.onload=function(e){
            let row=document.getElementsByClassName("letters_row")[6-guesses_remaining];
            let result=JSON.parse(xhttp.responseText).outcome;
            let sum=0;
            for(let i=0; i<6; i++){
                if(result[i]==2){
                    sum+=result[i];
                    row.children[i].classList.add("correct");
                }
                if(result[i]==1){
                    sum+result[i];
                    row.children[i].classList.add("wrong_position");
                }
            }
            guesses_remaining--;
            if(sum==10){
                document.getElementById("congrats").innerHTML="You solved the wordle!";
            }
            else{
                current_box=0;
                if(guesses_remaining==0){
                    document.getElementById("congrats").innerHTML="Out of guesses!";
                }
            }
        }
        xhttp.send();

    }
})