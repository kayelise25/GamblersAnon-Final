const tableCards = document.querySelector(".table-cards")
const playerCards = document.querySelector(".player-cards")
const playerCards2 = document.querySelector(".player-cardsSPLT")
const startMenu = document.querySelector(".menu-start")
const playerMenu = document.querySelector(".menu")
const playerMenu2 = document.querySelector(".menu2")
const newBetBtn = document.querySelector("#dropbtn2")

const closeBtn = document.getElementById("close2")
const betBtn = document.getElementById("bet")
const hitBtn = document.getElementById("hit")
const hitBtn2 = document.getElementById("hit2")
const stdBtn = document.getElementById("stand")
const stdBtn2 = document.getElementById("stand2")
const sptBtn = document.getElementById("split")
const dblBtn = document.getElementById("double")
const dblBtn2 = document.getElementById("double2")
const closePopUpBtn = document.getElementById("closePopUp")
const betInput = document.getElementById("bet_amount")
const Deck_Size = document.getElementById("deckSize")

const overlay = document.getElementById("overlay")
const messageDiv = document.querySelector(".message-div")
const messageContent = document.querySelector(".message-content")
const peter = new Audio("audio/peter1.mp3")
const giggity = new Audio("audio/GIGGITY.mp3")
const sike = new Audio("audio/sike.mp3")
const twenty1 = new Audio("audio/21 .mp3")
let strategyPopup = document.getElementById("strategy-popup")

let totalFunds = 500
let idDeck
let decksize = " "
let deckapi
let tableScore = 0
let playerScore = 0
let playerScore2 = 0
let betAmount = 0.0
let betAmount2 = 0.0
let pokerchip
let pokerid
let pokerchip2 = 0
let stratDecision = "..."
let key

let alreadySplit = false
let spltDecision = false
let bothstand = false
let bothstand2 = false

let gameOver = false

let won = "Winner!! \n You win: "
let won21 = "21 BLACKJACK!!! \nYou win: "
let wonDBust = "Dealer has Bust!! \nYou win: "
let loser = "Hold Dat L! \nYou lost: "
let lostBust = "That's a Bust!!! \n You lost:  "
let Tied = "Tied \nNeither Win nor Lose:  "
let dollarSign = "$"

let decision = "The correct decision for your hand was "

function close() {
  window.location.href = "/index.html"
}

function preRestart() {
  document.getElementById("myDropdown").classList.toggle("show")
  tableCards.innerHTML = ""
  playerCards.innerHTML = ""
  playerCards2.innerHTML = ""
  playerScore = 0
  tableScore = 0
}

function Total_Funds() {
  document.getElementById("totalFund_p").innerHTML = "$" + totalFunds
}

function showPlayerScore() {
  document.getElementById("playerScore_p").innerHTML = playerScore
}

function display_Decision() {
  document.getElementById("stratDecision").innerHTML = stratDecision
}

function openStrategyPopup() {
  getapi()
  display_Decision()
  strategyPopup.classList.add("open-Strategy-Popup")
  gameOver = false
}
function openStrategyPopup2() {
  getapi2()
  display_Decision()
  strategyPopup.classList.add("open-Strategy-Popup")
  gameOver = false
}
function closeStrategyPopup() {
  strategyPopup.classList.remove("open-Strategy-Popup")
  if (gameOver)
    setTimeout(function () {
      showMessage()
    }, 1000)
}


//Poker Chip Onclick Function
function pokerChip(n) {
  pokerid = n
  pokerchip = parseInt(document.getElementById("poker" + pokerid).value)
  document.getElementById("poker" + pokerid).style.backgroundColor = "Red"
}

//Poker Chip Onclick Function
function pokerChip2(n) {
  pokerid = n
  pokerchip2 = parseInt(document.getElementById("poker" + pokerid).value)
  document.getElementById("poker" + pokerid).style.backgroundColor = "Red"
  restartGame()
}

function placeNewBet() {
  newBetBtn.style.display = "none"
}

//Get Bet amount from input
function getBetAmount() {
  if (!betInput.value) {
    betAmount = pokerchip
  } else {
    betAmount = parseFloat(betInput.value)
  }
}

function updateBetAmount() {
  betAmount = pokerchip2
}

function setDeckSize() {
  let parsed = parseInt(Deck_Size.value)
  if (!Deck_Size.value || isNaN(parsed)) {
    decksize = 4
    alert("Deck Size: \nDidnt put proper value so it defaulted to 4")
  } else {
    decksize = Deck_Size.value
  }
  deckapi =
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=" + decksize
}

// Create Card Image from Photos
function createCardImageElement(imageSource) {
  const img = document.createElement("img")
  img.className = "card__image"
  img.src = imageSource
  return img
}

// Creates an element that houses the number/suit of the card
function createCustomElement(element, className) {
  const e = document.createElement(element)
  e.className = className
  return e
}

function showMessage() {
  overlay.className = "active"
  messageDiv.classList.add("active")
}

// Verifies that the player has Won or Bust (First Hand)
const playerVerify = () => {
  if (playerScore < 21 && playerScore > 0) {
    getapi()
    //display_Decision()
    //gameOver = true
  } else if (playerScore > 21) {
    getapi()
    //display_Decision()
    setMessage(lostBust + dollarSign + betAmount, "/visuals/lost.gif")
    showMessage()
    totalFunds -= betAmount
    Total_Funds()
    //gameOver = true
  } else if (playerScore === 21 && playerCards.children.length == 2) {
    getapi()
    //display_Decision()
    setMessage(won21 + dollarSign + betAmount * 1.5, "/visuals/21-savage.gif")
    showMessage()
    totalFunds += 1.5 * betAmount
    Total_Funds()
    //gameOver = true
  }
}

// Sum or score of the table or of the player, depending on the parameter
const score = (card) => {
  let isAce = false
  return Array.from(card.children).reduce((total, face) => {
    let denomination = 0
    let aceCounter = 0
    if (
      face.firstChild.className === "JACK" ||
      face.firstChild.className === "QUEEN" ||
      face.firstChild.className === "KING"
    ) {
      denomination = 10
    } else if (face.firstChild.className === "ACE") {
      denomination = 11
      isAce = true
      aceCounter++
    } else denomination = parseInt(face.firstChild.className)
    total += denomination
    if (total > 21 && isAce && aceCounter >= 1) {
      total -= 10
      aceCounter--
    }
    return total
  }, 0)
}

// Show on the screen a message, gif and audio of victory or defeat
const setMessage = (message, gif) => {
  const img = document.createElement("img")
  const h2 = document.createElement("h3")
  h2.innerText = message
  img.className = "msg__img"
  img.src = gif
  messageContent.appendChild(img)
  messageContent.appendChild(h2)
}

// Show on the screen a message, gif and audio of victory or defeat (Split)
const showMessage2 = (message, message2, gif) => {
  overlay.className = "active"
  messageDiv.classList.add("active")
  const img = document.createElement("img")
  const img2 = document.createElement("img")
  const h2 = document.createElement("h3")
  const h22 = document.createElement("h3")
  h2.innerText = message
  h22.innerText = message2
  img.className = "msg__img"
  img.src = gif
  messageContent.appendChild(img)
  messageContent.appendChild(h2)
  messageContent.appendChild(h22)
}

//translate player cards to key for database access
const access = (card) => {
  index = 0
  key = ""
  if (card.children.length === 1 && ifSplit == true) {
    if (score(card) > 17) {
      key = 17
    } else if (score(card) < 8) {
      key = 8
    } else {
      key = score(card)
    }
  } else if (card.children.length === 2) {
    //checking for split instances
    if (
      (card.children[index].firstChild.className === "JACK" &&
        card.children[index + 1].firstChild.className === "JACK") ||
      (card.children[index].firstChild.className === "QUEEN" &&
        card.children[index + 1].firstChild.className === "QUEEN") ||
      (card.children[index].firstChild.className === "KING" &&
        card.children[index + 1].firstChild.className === "KING")
    ) {
      key = "10,10"
    } else if (
      card.children[index].firstChild.className === "ACE" &&
      card.children[index + 1].firstChild.className === "ACE"
    ) {
      key = "A,A"
    } else if (
      parseInt(card.children[index].firstChild.className) ===
      parseInt(card.children[index + 1].firstChild.className)
    ) {
      key =
        parseInt(card.children[index].firstChild.className) +
        "," +
        parseInt(card.children[index].firstChild.className)
    } else if (
      parseInt(card.children[index].firstChild.className) === "ACE" &&
      parseInt(card.children[index + 1].firstChild.className) != "ACE"
    ) {
      //check for double down instances
      key = "A, " + parseInt(card.children[index + 1].firstChild.className)
    } else if (
      parseInt(card.children[index].firstChild.className) != "ACE" &&
      parseInt(card.children[index + 1].firstChild.className) === "ACE"
    ) {
      key = "A, " + parseInt(card.children[index].firstChild.className)
    } else {
      if (score(card) > 17) {
        key = 17
      } else if (score(card) < 8) {
        key = 8
      } else {
        key = score(card)
      }
    }
  } else {
    //default to value of player hands
    if (score(card) > 17) {
      key = 17
    } else if (score(card) < 8) {
      key = 8
    } else {
      key = score(card)
    }
  }
  return key
}

//call to db to get strategy card information
async function getapi() {
  let playerValue = access(playerCards)
  prevTableHand = score(tableCards)
  /* if(ifSplit==true){
    playerValue = access(playerCards2)
  }*/
  const fetchCard = await fetch(`http://localhost:3000/get-data/${playerValue}`)
  const data = await fetchCard.json()
  hint = data[0].Decisions[prevTableHand-2]
  if (hint == "H") {
    stratDecision = "HIT"
  } else if (hint == "S") {
    stratDecision = "STAND"
  } else if (hint == "P") {
    stratDecision = "SPLIT"
  } else if (hint == "D") {
    stratDecision = "DOUBLE DOWN"
  } else {
    stratDecision = "..."
  }
  console.log(data)
  console.log(stratDecision)
  return data
}

// start a new game, with the same deck
const restartGame = async () => {
  updateBetAmount()
  playerMenu2.style.display = "none"
  newBetBtn.style.display = "block"
  document.getElementById("poker" + pokerid).style.backgroundColor =
    "transparent"
  document.getElementById("myDropdown").classList.remove("show")
  messageContent.innerHTML = ""
  betBtn.disabled = true
  hitBtn.disabled = false
  stdBtn.disabled = false
  dblBtn.disabled = false

  await table(1)
  await player(2)

  spltDecision = false
  gameOver = false
  sptBtn.disabled = !ifSplit(playerCards)

  playerScore = score(playerCards)
  tableScore = score(tableCards)
  showPlayerScore()
  playerVerify()
}

// When you click on the screen, call the function to reset the game
overlay.addEventListener("click", () => {
  overlay.classList.remove("active")
  messageDiv.classList.remove("active")
  preRestart()
  placeNewBet()
})

// Verify the game (Second Hand)
const compare = () => {
  if (playerScore > 21) {
    gameOver = true
    setTimeout(function () {
      getapi()
      display_Decision()
      totalFunds -= betAmount
      Total_Funds()
    }, 2000)
    setMessage(lostBust + dollarSign + betAmount, "/visuals/lost.gif")
  } else if (tableScore > 21) {
    gameOver = true

    setTimeout(function () {
      getapi()
      display_Decision()
      totalFunds += betAmount
      Total_Funds()
    }, 2000)
    setMessage(wonDBust + dollarSign + betAmount, "/visuals/griddy.gif")
  } else if (playerScore > tableScore) {
    gameOver = true
    setTimeout(function () {
      getapi()
      display_Decision()
      totalFunds += betAmount
      Total_Funds()
    }, 2000)
    setMessage(won + dollarSign + betAmount, "/visuals/griddy.gif")
  } else if (playerScore === tableScore) {
    gameOver = true

    setTimeout(function () {
      getapi()
      display_Decision()
    }, 2000)
    setMessage(Tied + dollarSign + betAmount, "/visuals/tied.gif")
  } else if (tableScore > playerScore && tableScore <= 21) {
    gameOver = true
    setTimeout(function () {
      getapi()
      display_Decision()
      totalFunds -= betAmount
      Total_Funds()
    }, 2000)
    setMessage(loser + dollarSign + betAmount, "/visuals/lost.gif")
  }
}

// Call the functions to raise the card and show the table
function createCards({ code, image, suit, value }) {
  const section = document.createElement("section")
  section.className = `card-${code}`
  section.appendChild(createCustomElement("span", value))
  section.appendChild(createCustomElement("span", suit))
  section.appendChild(createCardImageElement(image))

  return section
}

// Paste a certain number of cards from the deck that has the ID that was pasted by the deckDraw function
const deckGet = async (deckid, count) => {
  const fetchDeck = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckid}/draw/?count=${count}`
  )
  const deck = await fetchDeck.json()
  return deck.cards.map(({ code, image, suit, value }) => {
    return createCards({
      code,
      image,
      suit,
      value,
    })
  })
}

//------------------SPLIT FUNCTIONS-------------------------------------------
function getBetAmount2() {
  betAmount2 = betAmount
}

//Function to see if split is possible at start of game
function ifSplit(card) {
  var result
  index = 0

  if (alreadySplit) result = false
  else if (card.children.length != 2) result = false
  else if (
    (card.children[index].firstChild.className === "JACK" &&
      card.children[index + 1].firstChild.className === "JACK") ||
    (card.children[index].firstChild.className === "QUEEN" &&
      card.children[index + 1].firstChild.className === "QUEEN") ||
    (card.children[index].firstChild.className === "KING" &&
      card.children[index + 1].firstChild.className === "KING") ||
    (card.children[index].firstChild.className === "ACE" &&
      card.children[index + 1].firstChild.className === "ACE")
  ) {
    result = true
  } else if (
    parseInt(card.children[index].firstChild.className) ===
    parseInt(card.children[index + 1].firstChild.className)
  ) {
    result = true
  } else if (
    card.children[index].firstChild.className !==
    card.children[index + 1].firstChild.className
  )
    result = false
  return result
}

// Call the function to hit a certain amount of cards for the player and add them to the cloth
const player2 = async (n) => {
  const cardTb = await deckGet(idDeck, n)
  return cardTb.forEach((card) => {
    playerCards2.appendChild(card)
    TweenMax.staggerTo(
      ".player-cardsSPLT",
      1,
      {
        rotation: 360,
        y: 0,
      },
      0.5
    )
  })
}

// Verify the game (Second Hand)
const compare2 = () => {
  var resultMeg1
  var resultMeg2

  if (playerScore > 21) {
    getapi2()
    display_Decision()
    resultMeg1 = "Hand 1: \n" + lostBust + dollarSign + betAmount
    totalFunds -= betAmount
    Total_Funds()
  } else if (playerScore === 21) {
    getapi2()
    display_Decision()
    resultMeg1 = "Hand 1: \n" + won21 + dollarSign + 1.5 * betAmount
    totalFunds += 1.5 * betAmount
    Total_Funds()
  } else if (playerScore > tableScore) {
    getapi2()
    display_Decision()
    resultMeg1 = "Hand 1: \n" + won + dollarSign + betAmount
    totalFunds += betAmount
    Total_Funds()
  } else if (playerScore === tableScore) {
    getapi2()
    display_Decision()
    resultMeg1 = "Hand 1: \n" + Tied + dollarSign + betAmount
    totalFunds -= betAmount
    Total_Funds()
  } else if (tableScore > 21) {
    getapi2()
    display_Decision()
    resultMeg1 = "Hand 1: \n" + wonDBust + dollarSign + betAmount
    totalFunds += betAmount + betAmount
    Total_Funds()
  } else {
    getapi2()
    display_Decision()
    resultMeg1 = "Hand 1: \n" + loser + dollarSign + betAmount
    totalFunds -= betAmount
    Total_Funds()
  }

  if (playerScore2 > 21) {
    getapi2()
    display_Decision()
    resultMeg2 = "Hand 2: \n" + lostBust + dollarSign + betAmount2
    totalFunds -= betAmount2
    Total_Funds()
  } else if (playerScore2 === 21) {
    getapi2()
    display_Decision()
    resultMeg2 = "Hand 2: \n" + won21 + dollarSign + 1.5 * betAmount2
    totalFunds += 1.5 * betAmount2
    Total_Funds()
  } else if (playerScore2 > tableScore) {
    getapi2()
    display_Decision()
    resultMeg2 = "Hand 2: \n" + won + dollarSign + betAmount2
    totalFunds += betAmount2
    Total_Funds()
  } else if (playerScore2 === tableScore) {
    getapi2()
    display_Decision()
    resultMeg2 = "Hand 2: \n" + Tied + dollarSign + betAmount2
    totalFunds -= betAmount
    Total_Funds()
  } else if (tableScore > 21) {
    getapi2()
    display_Decision()
    resultMeg2 = "Hand 2: \n" + wonDBust + dollarSign + betAmount2
    totalFunds += betAmount + betAmount
    Total_Funds()
  } else {
    getapi2()
    display_Decision()
    resultMeg2 = "Hand 2: \n" + loser + dollarSign + betAmount2
    totalFunds -= betAmount
    Total_Funds()
  }
  setTimeout(function () {
    showMessage2(resultMeg1, resultMeg2, "/visuals/spiderman.gif")
  }, 5000)
}

//call to db to get strategy card information
async function getapi2() {
  let playerValue = access(playerCards2)
  prevTableHand = score(tableCards)
  /* if(ifSplit==true){
    playerValue = access(playerCards2)
  }*/
  const fetchCard = await fetch(`http://localhost:3000/get-data/${playerValue}`)
  const data = await fetchCard.json()
  hint = data[0].Decisions[prevTableHand-2]
  if (hint == "H") {
    stratDecision = "Hand 2: HIT"
  } else if (hint == "S") {
    stratDecision = "Hand 2: STAND"
  } else if (hint == "P") {
    stratDecision = "Hand 2: SPLIT"
  } else if (hint == "D") {
    stratDecision = "Hand 2: DOUBLE DOWN"
  } else {
    stratDecision = "..."
  }
  console.log(data)
  console.log(stratDecision)
  return data
}

//--------------------------------------------------------

// Call the function to paste a certain amount of cards to the table and add them to the cloth
const table = async (n) => {
  const cardTb = await deckGet(idDeck, n)
  cardTb.forEach((card) => {
    tableCards.appendChild(card)
  })
}

// Call the function to hit a certain amount of cards for the player and add them to the cloth
const player = async (n) => {
  const cardTb = await deckGet(idDeck, n)
  return cardTb.forEach((card) => {
    playerCards.appendChild(card)
    TweenMax.staggerTo(
      ".player-cards",
      1,
      {
        rotation: 360,
        y: 100,
      },
      0.5
    )
  })
}

// Stand Function
const tableLogic = async () => {
  while (tableScore < 17 && !spltDecision) {
    await table(1)
    tableScore = score(tableCards)
  }
  if (!spltDecision) compare()
  else if (spltDecision) {
    bothstand = true
    stdBtn.disabled = true
    bothStand()
  }

  hitBtn.disabled = true
  dblBtn.disabled = true
}

// Stand2 Function (Split Function)
const tableLogic2 = async () => {
  while (tableScore < 17) {
    // requires a conditional for player stand;
    await table(1)
    tableScore = score(tableCards)
  }

  bothstand2 = true
  stdBtn2.disabled = true
  bothStand()

  hitBtn2.disabled = true
  dblBtn2.disabled = true
}

const bothStand = async () => {
  if (bothstand == bothstand2) compare2()
}

// Hit Function
const cardDrawPlayer = async () => {
  await player(1)
  playerScore = score(playerCards)

  showPlayerScore()
  if (playerScore > 21) {
    if (!spltDecision) compare()
    hitBtn.disabled = true
    dblBtn.disabled = true
  }
  sptBtn.disabled = !ifSplit(playerCards)
}

// Hit2 Function (Split Function)
const cardDrawPlayer2 = async () => {
  await player2(1)
  playerScore2 = score(playerCards2)

  if (playerScore2 > 21) {
    hitBtn2.disabled = true
    dblBtn2.disabled = true
  }
}

// Split Function
const cardDrawPlayerSPLT = async () => {
  playerMenu2.style.display = "flex"
  let oldcard = playerCards.lastChild
  let newcard = playerCards.removeChild(oldcard)
  playerCards2.appendChild(newcard)

  TweenMax.staggerTo(
    ".player-cardsSPLT",
    1,
    {
      rotation: 360,
      y: 0,
    },
    0.5
  )

  playerScore = score(playerCards)
  playerScore2 = score(playerCards2)

  getBetAmount2()

  alreadySplit = true
  spltDecision = true
  hitBtn2.disabled = false
  stdBtn2.disabled = false
  dblBtn2.disabled = false
  sptBtn.disabled = true
}

// Double Down Function
const cardDrawPlayerDBL = async () => {
  await player(1)
  playerScore = score(playerCards)
  betAmount *= 2

  hitBtn.disabled = true
  dblBtn.disabled = true
  sptBtn.disabled = !ifSplit(playerCards)
}

// Double Down2 Function (Split Decision)
const cardDrawPlayerDBL2 = async () => {
  await player2(1)
  playerScore2 = score(playerCards2)
  betAmount2 *= 2

  hitBtn.disabled = true
  dblBtn2.disabled = true
}

// Function that makes the request, in the deckOfCards API, of a new deck and returns the ID to it
const deckDraw = async () => {
  setDeckSize()
  const fetchDeck = await fetch(deckapi)
  const deckData = await fetchDeck.json()
  const deckid = deckData.deck_id
  idDeck = deckid
  betBtn.disabled = true
  hitBtn.disabled = false
  stdBtn.disabled = false
  dblBtn.disabled = false

  startMenu.style.display = "none"
  playerMenu2.style.display = "none"
  playerMenu.style.display = "flex"
  newBetBtn.style.display = "block"
  document.getElementById("poker" + pokerid).style.backgroundColor =
    "transparent"
  getBetAmount()

  await table(1)
  await player(2)

  sptBtn.disabled = !ifSplit(playerCards)

  tableScore = score(tableCards)
  playerScore = score(playerCards)
  showPlayerScore()
  playerVerify()
}

// Event runners
window.addEventListener("load", Total_Funds, showPlayerScore)
window.addEventListener("load", display_Decision)
betBtn.addEventListener("click", deckDraw)
closePopUpBtn.addEventListener("click", closeStrategyPopup)

closeBtn.addEventListener("click", close)
stdBtn.addEventListener("click", tableLogic, display_Decision)
sptBtn.addEventListener("click", cardDrawPlayerSPLT, display_Decision)
hitBtn.addEventListener("click", cardDrawPlayer, display_Decision)
dblBtn.addEventListener("click", cardDrawPlayerDBL, display_Decision)

stdBtn2.addEventListener("click", tableLogic2)
hitBtn2.addEventListener("click", cardDrawPlayer2, getapi2)
dblBtn2.addEventListener("click", cardDrawPlayerDBL2, getapi2)
