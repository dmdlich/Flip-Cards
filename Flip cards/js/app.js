//Variables needed to run this project.
const time = document.querySelector('.timer');
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card');
const restart = document.querySelector('.restart');
const moveCount = document.querySelector('.moves');
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName("close")[0];

let cardFlipped = false;
let cardOne, cardTwo;
let boardLock = false;
let counter = 0;
let matchCounter = 0;
let timerStarted = false;
let secs = 0;
let myInterval;
//modal window click, reset game and window disappear function
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function cancel(){
  modal.style.display = "none";
}

span.onclick = cancel;

function call() {
  resetGame();
  cancel();
}

//Shuffle function.
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//Check for click event and add an event listener.
cards.forEach(card => card.addEventListener('click', flipCard));

//Function to start timer when first card is clicked and add class to the card clicked.
function flipCard(){
  if(!timerStarted){
    myInterval =  setInterval(function(){
       secs++;
       time.innerHTML = `${secs} "`;
     }, 1000);
     timerStarted = true;
  }

  if(boardLock) return;
  if(this === cardOne) return;

  this.classList.add('open', 'show');

  if(!cardFlipped) {
    cardFlipped = true;
    cardOne = this;
    return;
  }
//what to do when second card is clicked. Move counter is kept in check and updated to the page.
    cardTwo = this;
    counter++;
    moveCount.innerHTML = counter;
    checkForMatch();
}
//function to check for match. If matched, go to disableCards function. Else, go to unflipCards function.
function checkForMatch(){
  let isMatch = cardOne.childNodes[1].className === cardTwo.childNodes[1].className;
  isMatch ? disableCards() : unflipCards();
}
//disables click on the matched cards by removing click event listner and adding match class, resets board.
function disableCards (){
  cardOne.removeEventListener('click', flipCard);
  cardOne.classList.add('match');
  cardTwo.removeEventListener('click', flipCard);
  cardTwo.classList.add('match');
  matchCounter++;
  resetBoard();
}
//when two flipped cards don't match, lock the board and remove open and show class after 0.9 seconds, resets board.
function unflipCards (){
  boardLock = true;
  setTimeout(() => {
    cardOne.classList.remove('open', 'show');
    cardTwo.classList.remove('open', 'show');
    resetBoard();
  }, 900 );
}
//resetBoard function. Sets cardFlipped and boardLock back to false, cardOne cardTwo to null.
function resetBoard() {
  [cardFlipped, boardLock] = [false, false];
  [cardOne, cardTwo] = [null, null];

  pstar = document.getElementsByClassName('fa fa-star');
//After 12th move, remove a star every two moves. Two clicks are counted as one move.
  if(pstar.length > 1 && (24 - (pstar.length * 2) == counter)) {
    pstar[0].remove();
  }

//when are cards are matched
  if(matchCounter === 8) {
    clearInterval(myInterval);
    setTimeout(() => {
      modal.style.display = "block";
      pstar = document.getElementsByClassName('fa fa-star');
      document.querySelector('p').innerHTML = `Congratulations!!! Eat Chicken for Dinner!! You made it in ${counter} moves and ${secs} seconds!! Your rating is ${pstar.length} stars!!`;
    }, 500);
  }
}
//restart button click event listener
restart.addEventListener('click', resetGame);
//Pretty much sets everything back to square one and displays star by adding innerHTML to the document.
function resetGame() {
  cards.forEach(card => card.classList.remove('open', 'show', 'match'));
  cards.forEach(card => card.addEventListener('click', flipCard));
  matchCounter = 0;
  moveCount.innerHTML = '0';
  time.innerHTML = '0"';
  timerStarted = false;
  secs = 0;
  clearInterval(myInterval);
  counter = 0;
  const cardsArr = Array.from(cards);
  const shuffledCardsArr = shuffle(cardsArr);
  deck.innerHTML = "";
  shuffledCardsArr.forEach(card => deck.appendChild(card));
  starsUL = document.querySelector('.stars');
  starsUL.innerHTML = "";
  for (var i = 0; i < 5; i++) {
    starsUL.innerHTML += '<li><i class="fa fa-star"></i></li>';
  }
  resetBoard();
}
