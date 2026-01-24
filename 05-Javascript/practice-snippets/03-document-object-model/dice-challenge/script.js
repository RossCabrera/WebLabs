var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;
// console.log(diceRollPlayer1)
function diceRollPlayer1(randomNumber1) {
   document.querySelector(".img1").setAttribute("src", `./images/dice${randomNumber1}.png`);   
}

function diceRollPlayer2(randomNumber2) {
   document.querySelector(".img2").setAttribute("src", `./images/dice${randomNumber2}.png`);   
}

function whoWon(randomNumber1, randomNumber2){
    if (randomNumber1 === randomNumber2){
        document.querySelector("h1").innerHTML = "Draw!"
    }else if (randomNumber1 < randomNumber2){
        document.querySelector("h1").innerHTML = "Player 2 Wins!"
    }else{
        document.querySelector("h1").innerHTML = "Player 1 Wins!"
    }
}


diceRollPlayer1(randomNumber1);
diceRollPlayer2(randomNumber2);
whoWon(randomNumber1, randomNumber2);