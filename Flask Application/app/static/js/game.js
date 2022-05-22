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
        for(let j=0; j<5; j++){
            let box=document.createElement("td");
            box.innerHTML="&nbsp;&nbsp;&nbsp";
            box.className="letter_box";
            row.appendChild(box);
        }
        boxes.appendChild(row);
    }
    board.appendChild(boxes);
    guesses_remaining=NUMBER_OF_GUESSES;
    current_box=0;
    current_guess=[];
    time_elapsed();
}


function time_elapsed(){
    let elapsed_time=0;
    let timer=setInterval(
        function(){
            document.getElementById("time_elapsed").innerHTML=elapsed_time++;
            if(guesses_remaining==0 || current_box==1000){
                clearInterval(timer);
            }
        }, 1000);
}

function insert_letter(pressedKey){
    if(current_box==5){
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

    if(pressedKey=="Backspace" && current_box!=0 && current_box!=1000){
        delete_letter()
        return
    }

    if(pressedKey=="Enter" && current_box==5){
        let guess="";
        for(let i=0; i<5; i++){
            guess+=current_guess[i];
        }
        
        current_guess=[];
        const xhttp=new XMLHttpRequest();

        xhttp.open("GET", "/guess_wordle?guess="+guess, true);
        xhttp.onload=function(e){
            let row=document.getElementsByClassName("letters_row")[6-guesses_remaining];
            let result=JSON.parse(xhttp.responseText).output;
            let sum=0;
            for(let i=0; i<5; i++){
                if(result[i]==2){
                    sum+=result[i];
                    row.children[i].classList.add("correct");
                }
                if(result[i]==1){
                    sum+result[i];
                    row.children[i].classList.add("wrong_position");
                }
                if(result[i]==0){
                    sum+=result[i];
                    row.children[i].classList.add("wrong_letter");
                }
            }
            guesses_remaining--;

            if(sum==10){
                current_box=1000;
                document.getElementById("congrats").innerHTML="You solved the wordle!";
                document.getElementById("play_again").style.display="block";
            }
            else{
                current_box=0;
                if(guesses_remaining==0){
                    document.getElementById("congrats").innerHTML="Out of guesses!";
                    document.getElementById("exit").style.display="block";
                }
            }
        }
        xhttp.send();
        

    }

    let alphabet=pressedKey.match(/[a-z]/gi);

    if(!alphabet || alphabet.length>1){
        return
    }
    else{
        insert_letter(pressedKey);
    }


    
})
