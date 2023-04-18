const tableCards = document.querySelector(".table-cards")
const playerCards = document.querySelector(".player-cards")
const playerCards2 = document.querySelector(".player-cardsSPLT")
const startMenu = document.querySelector(".menu-start")
const playerMenu = document.querySelector(".menu")
const playerMenu2 = document.querySelector(".menu2")

const betBtn = document.getElementById("bet")
const hitBtn = document.getElementById("hit")
const hitBtn2 = document.getElementById("hit2")
const stdBtn = document.getElementById("stand")
const stdBtn2 = document.getElementById("stand2")
const sptBtn = document.getElementById("split")
const dblBtn = document.getElementById("double")
const dblBtn2 = document.getElementById("double2")
const betInput = document.getElementById("bet_amount")
const Deck_Size = document.getElementById("deckSize")

const overlay = document.getElementById("overlay")
const messageDiv = document.querySelector(".message-div")
const messageContent = document.querySelector(".message-content")
const peter = new Audio("audio/peter1.mp3")
const giggity = new Audio("audio/GIGGITY.mp3")
const sike = new Audio("audio/sike.mp3")
const twenty1 = new Audio("audio/21 .mp3")

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

let spltDecision = false
let bothstand = false
let bothstand2 = false

let won = "Winner!! \n You win: "
let won21 = "21 BLACKJACK!!! \nYou win: "
let wonDBust = "Dealer has Bust!! \nYou win: "
let loser = "Hold Dat L! \nYou lost: "
let lostBust = "That's a Bust!!! \n You lost:  "
let Tied = "Tied \nNeither Win nor Lose:  "
let dollarSign = "$"

function Total_Funds() {
  document.getElementById("totalFund_p").innerHTML = "$" + totalFunds
}

function showPlayerScore() {
  document.getElementById("playerScore_p").innerHTML = playerScore
}

//Poker Chip Onclick Function
function pokerChip(n) {
  pokerchip = parseInt(document.getElementById("poker" + n).value)
  document.getElementById("poker" + n).style.backgroundColor = "Red"
}

function placeNewBet() {
  document.getElementById("dropdown2").classList.toggle("show")
}

//Get Bet amount from input
function getBetAmount() {
  if (!betInput.value) {
    betAmount = pokerchip
  } else {
    betAmount = parseFloat(betInput.value)
  }
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

// Verifies that the player has Won or Bust (First Hand)
const playerVerify = () => {
  //If player's score is over 21 they bust
  if (playerScore > 21) {
    setTimeout(function () {
      showMessage(lostBust + dollarSign + betAmount, sike, "/visuals/lost.gif")
      totalFunds -= betAmount
      Total_Funds()
    }, 2000)
  }

  //If player's score is 21 they get blackjack
  else if (playerScore === 21 && playerCards.children.length == 2) {
    setTimeout(function () {
      showMessage(
        won21 + dollarSign + betAmount * 1.5,
        twenty1,
        "/visuals/21-savage.gif"
      )
      totalFunds += 1.5 * betAmount
      Total_Funds()
    }, 1000)
  }
}

// Sum or score of the table or of the player, depending on the parameter
const score = (card) => {
  let isAce = false
  return Array.from(card.children).reduce((total, face) => {
    let denomination = 0
    if (
      face.firstChild.className === "JACK" ||
      face.firstChild.className === "QUEEN" ||
      face.firstChild.className === "KING"
    ) {
      denomination = 10
    } else if (face.firstChild.className === "ACE") {
      denomination = 11
      isAce = true
      if (total > 21) denomination = 1
    } else {
      denomination = parseInt(face.firstChild.className)
    }
    total += denomination
    if (total > 21 && isAce) total -= 10
    return total
  }, 0)
}

// Show on the screen a message, gif and audio of victory or defeat
const showMessage = (message, audio, gif) => {
  overlay.className = "active"
  messageDiv.classList.add("active")
  const img = document.createElement("img")
  const h2 = document.createElement("h3")
  h2.innerText = message
  img.className = "msg__img"
  img.src = gif
  messageContent.appendChild(img)
  messageContent.appendChild(h2)
  audio.play()
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

// Restart Bet after each game
const restartBet = () => {
  let newBet = prompt(
    "Place New Bet: \nCancel to Return to Main Menu",
    betAmount
  )
  if (newBet == null || newBet == "") {
    window.location.href = "/index.html"
  } else {
    betInput.value = newBet
    getBetAmount()
  }
  playerMenu2.style.display = "none"
}

// start a new game, with the same deck
const restartGame = async () => {
  restartBet()
  //placeNewBet()
  playerMenu2.style.display = "none"
  tableCards.innerHTML = ""
  playerCards.innerHTML = ""
  playerCards2.innerHTML = ""
  messageContent.innerHTML = ""
  betBtn.disabled = true
  hitBtn.disabled = false
  stdBtn.disabled = false
  dblBtn.disabled = false

  await table(1)
  await player(2)

  spltDecision = false
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
  restartGame()
})

// Verify the game (Second Hand)
const compare = () => {
  if (playerScore > 21) {
    setTimeout(function () {
      showMessage(lostBust + dollarSign + betAmount, sike, "/visuals/lost.gif")
      totalFunds -= betAmount
      Total_Funds()
    }, 2000)
  } else if (tableScore > 21) {
    setTimeout(function () {
      showMessage(
        wonDBust + dollarSign + betAmount,
        giggity,
        "/visuals/griddy.gif"
      )
      totalFunds += betAmount
      Total_Funds()
    }, 1000)
  } else if (playerScore > tableScore) {
    setTimeout(function () {
      showMessage(won + dollarSign + betAmount, giggity, "/visuals/griddy.gif")
      totalFunds += betAmount
      Total_Funds()
    }, 1000)
  } else if (playerScore === tableScore) {
    setTimeout(function () {
      showMessage(Tied + dollarSign + betAmount, sike, "/visuals/lost.gif")
    }, 1000)
  } else if (tableScore > playerScore && tableScore <= 21) {
    setTimeout(function () {
      showMessage(loser + dollarSign + betAmount, peter, "/visuals/lost.gif")
      totalFunds -= betAmount
      Total_Funds()
    }, 1000)
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
  let denomination = 0
  if (
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
    resultMeg1 = "Hand 1: \n" + lostBust + dollarSign + betAmount
    totalFunds -= betAmount
    Total_Funds()
  } else if (playerScore === 21) {
    if (playerCards2.children.length == 2) betAmount *= 1.5
    resultMeg1 = "Hand 1: \n" + won21 + dollarSign + betAmount
    totalFunds += 1.5 * betAmount
    Total_Funds()
  } else if (playerScore > tableScore) {
    resultMeg1 = "Hand 1: \n" + won + dollarSign + betAmount
    totalFunds += betAmount
    Total_Funds()
  } else if (playerScore === tableScore) {
    resultMeg1 = "Hand 1: \n" + Tied + dollarSign + betAmount
  } else if (tableScore > 21) {
    resultMeg1 = "Hand 1: \n" + wonDBust + dollarSign + betAmount
    totalFunds += betAmount + betAmount
    Total_Funds()
  } else {
    resultMeg1 = "Hand 1: \n" + loser + dollarSign + betAmount
    totalFunds -= betAmount
    Total_Funds()
  }

  if (playerScore2 > 21) {
    resultMeg2 = "Hand 2: \n" + lostBust + dollarSign + betAmount2
    totalFunds -= betAmount2
    Total_Funds()
  } else if (playerScore2 === 21) {
    resultMeg2 = "Hand 2: \n" + won21 + dollarSign + 1.5 * betAmount2
    totalFunds += 1.5 * betAmount2
    Total_Funds()
  } else if (playerScore2 > tableScore) {
    resultMeg2 = "Hand 2: \n" + won + dollarSign + betAmount2
    totalFunds += betAmount2
    Total_Funds()
  } else if (playerScore2 === tableScore) {
    resultMeg2 = "Hand 2: \n" + Tied + dollarSign + betAmount2
  } else if (tableScore > 21) {
    resultMeg2 = "Hand 2: \n" + wonDBust + dollarSign + betAmount2
    totalFunds += betAmount + betAmount
    Total_Funds()
  } else {
    resultMeg2 = "Hand 2: \n" + loser + dollarSign + betAmount2
    totalFunds -= betAmount
    Total_Funds()
  }
  setTimeout(function () {
    showMessage2(resultMeg1, resultMeg2, "/visuals/spiderman.gif")
  }, 1000)
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
  while (
    (tableScore < 17 || tableScore < playerScore) &&
    !(tableScore >= 21) &&
    !spltDecision
  ) {
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
  while (
    tableScore < 17 ||
    (tableScore < playerScore2 && !(tableScore >= 21))
  ) {
    // requires a conditional for player stand;
    await table(1)
    tableScore = score(tableCards)
  }
  bothstand2 = true
  bothStand()

  stdBtn2.disabled = true
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
  if (playerScore >= 21) {
    if (!spltDecision) compare()
    hitBtn.disabled = true
    dblBtn.disabled = true
  }
}

// Hit2 Function (Split Function)
const cardDrawPlayer2 = async () => {
  await player2(1)
  playerScore2 = score(playerCards2)

  if (playerScore2 >= 21) {
    hitBtn2.disabled = true
    dblBtn2.disabled = true
  }
}

// Split Function
const cardDrawPlayerSPLT = async () => {
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

  spltDecision = true
  playerMenu2.style.display = "flex"
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
betBtn.addEventListener("click", deckDraw)

stdBtn.addEventListener("click", tableLogic)
hitBtn.addEventListener("click", cardDrawPlayer)
dblBtn.addEventListener("click", cardDrawPlayerDBL)
sptBtn.addEventListener("click", cardDrawPlayerSPLT)

stdBtn2.addEventListener("click", tableLogic2)
hitBtn2.addEventListener("click", cardDrawPlayer2)
dblBtn2.addEventListener("click", cardDrawPlayerDBL2)
