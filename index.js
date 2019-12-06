var canvas = document.getElementById("game")
var context = canvas.getContext("2d")

var score = 0
var gravity = -0.1
var mouseX = 0
var mouseY = 0
var click = false

var title = true
var playerJustDied = true

var questionBeingAsked = ""
var timeLeftToAnswer = 0
var playerBeingAsked = ""
var correctAnswer = ""

var questions = [
  {
    question: "Who was the daughter of Agamemnon who was sacrificed for fair winds?",
    choices: ["Ifigenia", "Aulis", "Electra"],
    correctAnswer: "A"
  },
  {
    question: "Who possessed the 'face that launched a thousand ships?'",
    choices: ["Helen", "Procris", "Ifigenia"],
    correctAnswer: "A"
  },
  {
    question: "Who were the kings/leaders for either side of the trojan war?",
    choices: ["Greek: Automedon; Trojan: Priam", "Greek: Agamemnon; Trojan: Priam", "Greek: Agamemnon; Trojan: Aeneas"],
    correctAnswer: "B"
  },
  {
    question: "What was the mythological reason for the Trojan War?",
    choices: ["Troy had unjustly seized land which belonged to the Greek city-state of Mycenae.",
      "One of the princes of Troy abducted the Queen of Sparta.",
      "The King of Troy had offended Zeus, who then ordered the Greeks to destroy the city."],
    correctAnswer: "B"
  },
  {
    question: "What item could be said to be the root cause of the Trojan war?",
    choices: ["The crown of the King of Sparta.", "One of Hercules’ poisoned arrows.", "An apple."],
    correctAnswer: "C"
  },
  {
    question: "How many years did the Trojan War last?",
    choices: ["10", "12", "15"],
    correctAnswer: "A"
  },
  {
    question: "Who killed Achilles?",
    choices: ["Hector", "Paris", "Priam"],
    correctAnswer: "B"
  },
  {
    question: "What city did Helenus found after the Trojan war, which he ruled with Andromache?",
    choices: ["Buthrotum", "Antium", "Nova Troia"],
    correctAnswer: "A"
  },
  {
    question: "Who was the fiercest of the Trojans?",
    choices: ["Hector", "Paris", "Achilles"],
    correctAnswer: "A"
  },
  {
    question: "Who was the primary Greek soothsayer at Troy?",
    choices: ["Mopsus", "Helenus", "Calchas"],
    correctAnswer: "C"
  },
  {
    question: "Who convinced the Trojan warriors that the Greeks had abandoned the war and given them the Trojan Horse as a gift?",
    choices: ["Odysseus", "Athena, disguised as Agamemnon", "Sinon"],
    correctAnswer: "C"
  },
  {
    question: "Where is believed to be the modern-day location of Troy?",
    choices: ["Near the south of the Greek archipelago", "In western Turkey", "Where modern-day Istanbul is"],
    correctAnswer: "B"
  },
  
]

var redBeams = [], blueBeams = []

var winner = ""

var player1 = //arrow keys - right
{
  color: "skyblue",
  width: 8,
  height: 22,
  position: 
  {
    x: 900,
    y: 300,
  },
  directionMoving: [0, 0, 0, 0], //up down left right
  speed: 5,
  image: new Image(20, 5),
  lives: 3,
  shootCooldown: 0,
  shootSpeed: 60,
  score: 0,
  powerUp: {
    name: "",
    timeLeft: 0,
  }
}

player1.image.src = "player2.png"

var player2 = //wasd - left
{
  color: "skyblue",
  width: 8,
  height: 22,
  position: 
  {
    x: 300,
    y: 300,
  },
  directionMoving: [0, 0, 0, 0], //up down left right
  speed: 5,
  image: new Image(20, 5),
  lives: 3,
  shootCooldown: 0,
  shootSpeed: 60,
  score: 0,
  powerUp: {
    name: "",
    timeLeft: 0
  }
}

player2.image.src = "player1.png"

var redBeamImage = new Image(10, 2) //p2
redBeamImage.src = "redBeam.png"

var blueBeamImage = new Image(10, 2) //p1
blueBeamImage.src = "blueBeam.png"

var extraLifePowerUpImage = new Image(8, 8)
extraLifePowerUpImage.src = "extraLifePowerUp.png"

var quickMovementPowerUpImage = new Image(8, 8)
quickMovementPowerUpImage.src = "quickMovementPowerUp.png"

var rapidFirePowerUpImage = new Image(8, 8)
rapidFirePowerUpImage.src = "rapidFirePowerUp.png"

var slowDownPowerDownImage = new Image(8, 8)
slowDownPowerDownImage.src = "slowDownPowerDown.png"

var disableShootingPowerDownImage = new Image(8, 8)
disableShootingPowerDownImage.src = "disableShootingPowerDown.png"

var stars = []
for (var i = 0; i < 500; i++)
{
  stars[i] = 
  {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.sqrt(Math.random() * 4),
    alpha: 1.0,
    decreasing: true,
    color: getRandomColor()
  }
}

var powerUps = [] // rapid fire, quick movement, extra life, slow down, no shooting for 5 seconds

// arnav
function spawnPowerUps()
{
  var random = Math.random() * 300
  if (random <= 1)
  {
    var r = Math.floor((Math.random() * 5 + 1))
    switch(r)
    {
      case 1:
        var rapidFirePowerUp = {
          x: Math.floor(Math.random() * (canvas.width - 100)),
          y: Math.floor(Math.random() * (canvas.height - 100)),
          despawnTime: 180,
          image: rapidFirePowerUpImage,
          name: "Rapid Fire",
        }
        powerUps.push(rapidFirePowerUp)
        break

      case 2:
        var quickMovementPowerUp = {
          x: Math.floor(Math.random() * (canvas.width - 100)),
          y: Math.floor(Math.random() * (canvas.height - 100)),
          despawnTime: 180,
          image: quickMovementPowerUpImage,
          name: "Speed+",
        }
        powerUps.push(quickMovementPowerUp)
        break

      case 3:
        var extraLifePowerUp = {
          x: Math.floor(Math.random() * (canvas.width - 100)),
          y: Math.floor(Math.random() * (canvas.height - 100)),
          despawnTime: 180,
          image: extraLifePowerUpImage,
          name: "Life+",
        }
        powerUps.push(extraLifePowerUp)
        break

      case 4:
        var slowDownPowerDown = {
          x: Math.floor(Math.random() * (canvas.width - 100)),
          y: Math.floor(Math.random() * (canvas.height - 100)),
          despawnTime: 180,
          image: slowDownPowerDownImage,
          name: "Speed-"
        }
        powerUps.push(slowDownPowerDown)
        break

      case 5:
        var disableShootingPowerDown = {
          x: Math.floor(Math.random() * (canvas.width - 100)),
          y: Math.floor(Math.random() * (canvas.height - 100)),
          despawnTime: 180,
          image: disableShootingPowerDownImage,
          name: "Unarmed"
        }
        powerUps.push(disableShootingPowerDown)
        break
    }
  }
}

// arnav
function drawPowerUps()
{
  context.save()
  for (var i = 0; i < powerUps.length; i++)
  {
    context.drawImage(powerUps[i].image, powerUps[i].x, powerUps[i].y)
    powerUps[i].despawnTime--
    if (powerUps[i].despawnTime <= 0)
    {
      powerUps.splice(i, 1)
    }
  }
  context.restore()
}

// shaham
function checkPowerUpCollisionsWithPlayer()
{
  for (var i = 0; i < powerUps.length; i++)
  {
    if (
      powerUps[i].x < player1.position.x + 200 && powerUps[i].x + 60 > player1.position.x &&
      powerUps[i].y < player1.position.y + 200 && powerUps[i].y + 60 > player1.position.y)
      {
        player1.powerUp = {
          name: powerUps[i].name,
          timeLeft: 240
        }
        powerUps.splice(i, 1)
        return
      }
    if (
      powerUps[i].x < player2.position.x + 200 && powerUps[i].x + 60 > player2.position.x &&
      powerUps[i].y < player2.position.y + 200 && powerUps[i].y + 60 > player2.position.y)
      {
        player2.powerUp = {
          name: powerUps[i].name,
          timeLeft: 240
        }
        powerUps.splice(i, 1)
      }
  }
}

// arnav
function applyPowerUpsToPlayers()
{
  player2.powerUp.timeLeft--
  if (player2.powerUp.timeLeft <= 0)
  {
    player2.powerUp.name = ""
    player2.speed = 5
    player2.shootSpeed = 60
  }
  if (player2.powerUp.name == "Life+")
  {
    player2.lives++
    player2.powerUp.timeLeft = 0
  }
  if (player2.powerUp.name == "Speed+")
  {
    player2.speed = 10
  }
  if (player2.powerUp.name == "Speed-")
  {
    player2.speed = 3
  }
  if (player2.powerUp.name == "Unarmed")
  {
    player2.shootCooldown = 5
  }
  if (player2.powerUp.name == "Rapid Fire")
  {
    player2.shootSpeed = 30
  }

  player1.powerUp.timeLeft--
  if (player1.powerUp.timeLeft <= 0)
  {
    player1.powerUp.name = ""
    player1.speed = 5
    player1.shootSpeed = 60
  }
  if (player1.powerUp.name == "Life+")
  {
    player1.lives++
    player1.powerUp.timeLeft = 0
  }
  if (player1.powerUp.name == "Speed+")
  {
    player1.speed = 10
  }
  if (player1.powerUp.name == "Speed-")
  {
    player1.speed = 3
  }
  if (player1.powerUp.name == "Unarmed")
  {
    player1.shootCooldown = 300
  }
  if (player1.powerUp.name == "Rapid Fire")
  {
    player1.shootSpeed = 30
  }
}

// shaham
function resetVariables()
{
  player1.lives = 3
  player2.lives = 3
  player1.position = 
  {
    x: 900,
    y: 300,
  }
  player2.position = 
  {
    x: 300,
    y: 300,
  }
  player1.directionMoving = [0, 0, 0, 0]
  player2.directionMoving = [0, 0, 0, 0]
  player1.shootCooldown = 0
  player2.shootCooldown = 0
  redBeams = []
  blueBeams = []
  player1.powerUp = {
    name: "",
    timeLeft: 0
  }
  player2.powerUp = {
    name: "",
    timeLeft: 0
  }
}

// shaham
function drawStars() 
{
  context.save()
  context.fillStyle = "black"
  context.fillRect(0, 0, canvas.width, canvas.height)
  for (var i = 0; i < stars.length; i++) 
  {
    var star = stars[i]
    context.beginPath()
    context.arc(star.x, star.y, star.radius, 0, 2*Math.PI)
    context.closePath()
    context.fillStyle = star.color + star.alpha + ")"
    if (star.decreasing == true)
    {
      star.alpha -= Math.random() * 0.05
      if (star.alpha < 0.1)
      { star.decreasing = false }
    }
    else
    {
      star.alpha += Math.random() * 0.05
      if (star.alpha > 0.95)
      { star.decreasing = true }
    }
    
    context.fill()
  }
  context.restore()
}

// shaham
function drawPlayers() 
{
  movePlayer1()
  movePlayer2()
  context.drawImage(player1.image, player1.position.x, player1.position.y)
  context.drawImage(player2.image, player2.position.x, player2.position.y)
  player1.shootCooldown--
  player2.shootCooldown--
}

// shaham
function shootRedBeam()
{
  if (player2.shootCooldown >= 0)
  {
    return
  }
 var beam = 
 {
   x: player2.position.x + 100,
   y: player2.position.y + 40,
 }
 redBeams.push(beam)
 player2.shootCooldown = player2.shootSpeed
}

// shaham
function shootBlueBeam()
{
  if (player1.shootCooldown >= 0)
  {
    return
  }
  var beam = 
  {
    x: player1.position.x - 20,
    y: player1.position.y + 35,
  }
  blueBeams.push(beam)
  player1.shootCooldown = player1.shootSpeed
}

// shaham
function updateBeams()
{
  for(var i = 0; i < redBeams.length; i++)
  {
    redBeams[i].x += 10
  }
  for(var i = 0; i < blueBeams.length; i++)
  {
    blueBeams[i].x -= 10
  }
}

// shaham
function drawBeams()
{
  context.save()
  for(var i = 0; i < redBeams.length; i++)
  {
    context.drawImage(redBeamImage, redBeams[i].x, redBeams[i].y)
  }
  for(var i = 0; i < blueBeams.length; i++)
  {
    context.drawImage(blueBeamImage, blueBeams[i].x, blueBeams[i].y)
  }
  context.restore()
}

// arnav
function printLives()
{
  context.beginPath()
  context.fillStyle = "#E74C3C"
  context.font = "normal 40px Lato"
  context.fillText("Lives: " + player2.lives, 10, 50)
  context.fillText("Lives: " + player1.lives, 1270, 50)
  context.closePath()
}

// arnav
function printScore()
{
  context.beginPath()
  context.fillStyle = "white"
  context.font = "normal 40px Lato"
  context.fillText("WINS: " + player2.score, 550, 50)
  context.fillText("WINS: " + player1.score, 740, 50)
  context.closePath()
}

// arnav
function printCurrentPowerUp()
{
  context.beginPath()
  context.fillStyle = "#85C1E9"
  context.font = "normal 40px Lato"
  context.fillText("Power-Up: " + player2.powerUp.name, 150, 50)
  context.fillText("Power-Up: " + player1.powerUp.name, 900, 50)
  context.closePath()
}

// shaham
function checkBeamCollisionsWithPlayers()
{
  for(var i = 0; i < blueBeams.length; i++)
  {
    var beam = blueBeams[i]
    if(beam.x > player2.position.x && beam.x < player2.position.x + 200 && beam.y - 15 > player2.position.y && beam.y < player2.position.y + 200) 
    {
      questionBeingAsked = questions[Math.floor(Math.random() * questions.length)]
      timeLeftToAnswer = 840
      playerBeingAsked = "player1"
      // player2.lives--
      blueBeams.splice(i, 1)
    }
  }
  for(var i = 0; i < redBeams.length; i++)
  {
    var beam = redBeams[i]
    if(beam.x > player1.position.x && beam.x < player1.position.x + 200 && beam.y - 15 > player1.position.y && beam.y < player1.position.y + 200) 
    {
      // player1.lives--
      questionBeingAsked = questions[Math.floor(Math.random() * questions.length)]
      timeLeftToAnswer = 840
      playerBeingAsked = "player2"
      redBeams.splice(i, 1)
    }
  }
}


// arnav
function askQuestion()
{
  timeLeftToAnswer--
  context.save()
  context.beginPath()
  context.fillStyle = "white"
  context.font = "normal 20px Lato"
  context.fillText("Time Left: " + Math.floor(timeLeftToAnswer / 120), 10, 30)
  context.fillStyle = "#85C1E9"
  context.font = "normal 30px Lato"
  context.fillText(questionBeingAsked.question, 0, 100)
  context.font = "normal 25px Lato"
  context.fillText(playerBeingAsked == "player1" ? "J. " : "1. ", 10, 300)
  context.fillText(playerBeingAsked == "player1" ? "K. " : "2. ", 10, 450)
  context.fillText(playerBeingAsked == "player1" ? "L. " : "3. ", 10, 600)
  context.fillText(questionBeingAsked.choices[0], 60, 300)
  context.fillText(questionBeingAsked.choices[1], 60, 450)
  context.fillText(questionBeingAsked.choices[2], 60, 600)
  context.closePath()
  context.restore()
}

// shaham
function getRandomColor()
{
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',';
}

// arnav
function movePlayer1()
{
  if (player1.directionMoving[0])
  {
    player1.position.y -= player1.speed
  }
  if (player1.directionMoving[1])
  {
    player1.position.y += player1.speed
  }
  if (player1.directionMoving[2])
  {
    player1.position.x -= player1.speed
  }
  if (player1.directionMoving[3])
  {
    player1.position.x += player1.speed
  }
}

// arnav
function movePlayer2()
{
  if (player2.directionMoving[0])
  {
    player2.position.y -= player2.speed
  }
  if (player2.directionMoving[1])
  {
    player2.position.y += player2.speed
  }
  if (player2.directionMoving[2])
  {
    player2.position.x -= player2.speed
  }
  if (player2.directionMoving[3])
  {
    player2.position.x += player2.speed
  }
}

// arnav
function checkPlayerCollisions() 
{
  if(player1.position.x >= 1240)
  {
    player1.position.x = 1230
  }
  if(player1.position.x <= 710)
  {
    player1.position.x = 720
  }
  if(player1.position.y >= 600)
  {
    player1.position.y = 590
  }
  if(player1.position.y <= -10)
  {
    player1.position.y = 0
  }

  if(player2.position.x >= 520)
  {
    player2.position.x = 510
  }
  if(player2.position.x <= -10)
  {
    player2.position.x = 0
  }
  if(player2.position.y >= 590)
  {
    player2.position.y = 580
  }
  if(player2.position.y <= -20)
  {
    player2.position.y = -15
  }
}

// shaham
function keyLetGo(event)
{
    switch(event.keyCode)
    {
        case 37:
            // Left Arrow key
            player1.directionMoving[2] = 0
            break;
        case 39:
            // Right Arrow key
            player1.directionMoving[3] = 0
            break;
        case 38:
            // Up Arrow key
            player1.directionMoving[0] = 0
            break;
        case 40:
            // Down Arrow Key
            player1.directionMoving[1] = 0
            break;

        case 87:
            // W Arrow key
            player2.directionMoving[0] = 0
            break;
        case 65:
            // A Arrow key
            player2.directionMoving[2] = 0
            break;
        case 83:
            // S Arrow key
            player2.directionMoving[1] = 0
            break;
        case 68:
            // D Arrow Key
            player2.directionMoving[3] = 0
            break;

        case 70:
            shootRedBeam()
            break
        case 188:
            shootBlueBeam()
            break
        
        case 49:
          console.log("J")
          if (playerBeingAsked == "player2" && questionBeingAsked.correctAnswer == "A")
          {
            player1.lives--
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          else if (playerBeingAsked == "player2" && questionBeingAsked.correctAnswer != "A")
          {
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          break
        
        case 50:
          if (playerBeingAsked == "player2" && questionBeingAsked.correctAnswer == "B")
          {
            player1.lives--
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          else if (playerBeingAsked == "player2" && questionBeingAsked.correctAnswer != "B")
          {
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          break

        case 51:
          if (playerBeingAsked == "player2" && questionBeingAsked.correctAnswer == "C")
          {
            player1.lives--
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          else if (playerBeingAsked == "player2" && questionBeingAsked.correctAnswer != "C")
          {
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          break
        
        case 74:
          if (playerBeingAsked == "player1" && questionBeingAsked.correctAnswer == "A")
          {
            player2.lives--
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          else if (playerBeingAsked == "player1" && questionBeingAsked.correctAnswer != "A")
          {
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          break
        
        case 75:
          if (playerBeingAsked == "player1" && questionBeingAsked.correctAnswer == "B")
          {
            player2.lives--
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          else if (playerBeingAsked == "player1" && questionBeingAsked.correctAnswer != "B")
          {
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          break

        case 76:
          if (playerBeingAsked == "player1" && questionBeingAsked.correctAnswer == "B")
          {
            player2.lives--
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          else if (playerBeingAsked == "player1" && questionBeingAsked.correctAnswer != "B")
          {
            timeLeftToAnswer = 0
            playerBeingAsked = ""
            questionBeingAsked = ""
          }
          break
    }
}

document.addEventListener('keyup', keyLetGo)

function keyPressed(event)
{
    switch(event.keyCode)
    {
      case 37:
          // Left Arrow key
          player1.directionMoving[2] = 1
          break;
      case 39:
          // Right Arrow key
          player1.directionMoving[3] = 1
          break;
      case 38:
          // Up Arrow key
          player1.directionMoving[0] = 1
          break;
      case 40:
          // Down Arrow Key
          player1.directionMoving[1] = 1
          break;

      case 87:
            // W Arrow key
            player2.directionMoving[0] = 1
            break;
      case 65:
            // A Arrow key
            player2.directionMoving[2] = 1
            break;
      case 83:
            // S Arrow key
            player2.directionMoving[1] = 1
            break;
      case 68:
            // D Arrow Key
            player2.directionMoving[3] = 1
            break;
    }
}

document.addEventListener('keydown', keyPressed)

canvas.addEventListener('click', function(evt) 
{  
  click = true
})

// arnav
function setMouseXY(event)
{
  mouseX = event.clientX
  mouseY = event.clientY
}

// arnav
function displayWinner()
{
  context.beginPath()
  context.fillStyle = "#3498DB"
  context.font = "normal 50px Lato"
  if (winner == "Player 1")
  {
    context.fillText("WINNER!!!", 1000, 100)
    context.fillText("LOSER...", 200, 100)
  }
  if (winner == "Player 2")
  {
    context.fillText("LOSER...", 1000, 100)
    context.fillText("WINNER!!!", 200, 100)
  }
  context.font = "normal 25px Lato"
  context.fillStyle = "#34495E"
  if (mouseX > 400 && mouseX < 600 && mouseY > 620 && mouseY < 670)
  {
    context.fillStyle = "#5D6D7E"
    if (click)
    {
      click = false
      playerJustDied = true
      resetVariables()      
    }
  }
  context.rect(400, 620, 200, 50)
  context.fill()
  context.closePath()
  context.beginPath()
  context.fillStyle = "#34495E"
  if (mouseX > 800 && mouseX < 1000 && mouseY > 620 && mouseY < 670)
  {
    context.fillStyle = "#5D6D7E"
    if (click)
    {
      playerJustDied = true
      title = true
      click = false
      player1.score = player2.score = 0
      resetVariables()
      titleScreen()
    }
  }
  context.rect(800, 620, 200, 50)
  context.fill()
  context.fillStyle = "white"
  context.fillText("Play Again", 445, 655)
  context.fillText("Title", 870, 655)
  context.closePath()
}

// arnav
function titleScreen()
{
  context.clearRect(0, 0, canvas.width, canvas.height)
  spawnPowerUps()
  drawStars()
  context.beginPath()
  context.fillStyle = "#2C3E50"
  context.font = "normal 70px Lato"
  context.fillText("Latin Hist Trivia 1v1!", 390, 100)
  context.fillStyle = "#3498DB"
  if (mouseX > 450 && mouseX < 950 && mouseY > 380 && mouseY < 480)
  {
    context.fillStyle = "#5DADE2"
    if (click)
    {
      title = false
      click = false
      game()
    }
    else 
    {
      requestAnimationFrame(titleScreen)
    }
  }
  else
  {
    requestAnimationFrame(titleScreen)
  }
  context.rect(450, 380, 500, 100)
  context.fill()
  context.closePath()
  context.beginPath()
  context.font = "normal 45px Lato"
  context.fillStyle = "white"
  context.fillText("LET'S GAME!!!", 550, 450)
  context.closePath()
  click = false
}

// arnav
function game()
{
  context.clearRect(0, 0, canvas.width, canvas.height)
  drawStars()
  console.log("lmao")
  if (timeLeftToAnswer > 0)
  {
    askQuestion()
    requestAnimationFrame(askQuestion)
  }
  else
  {
    context.beginPath()
    context.fillStyle = "gray"
    context.fillRect(710, 0, 20, 760)
    context.closePath()
    updateBeams()
    drawBeams()
    checkPlayerCollisions()
    checkBeamCollisionsWithPlayers()
    drawPlayers()
    if ((player1.lives <= 0 || player2.lives <= 0) && !playerJustDied)
    {
      displayWinner()
      requestAnimationFrame(displayWinner)
    }
    else if (player1.lives <= 0)
    {
      player1.shootCooldown = 10000
      player2.shootCooldown = 10000
      redBeams, blueBeams = []
      winner = "Player 2"
      player2.score++
      playerJustDied = false
    }
    else if (player2.lives <= 0) 
    {
      player1.shootCooldown = 10000
      player2.shootCooldown = 10000
      redBeams, blueBeams = []
      winner = "Player 1"
      player1.score++
      playerJustDied = false
    }
    else {
      printLives()
      spawnPowerUps()
      drawPowerUps()
      printCurrentPowerUp()
      checkPowerUpCollisionsWithPlayer()
      applyPowerUpsToPlayers()
    }
    printScore()
  }
    if (!title)
    {
      requestAnimationFrame(game)
    }
    click = false
}

titleScreen()