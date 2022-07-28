class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  
  }
  update(state) {
    database.ref("/").update({
      gameState: state
      //aaaaaaaaaaaaaaaaaaaaaaaaaaaaartsvdgbhjkl
  
    });
  }
  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  start() {
    player = new Player();
    playerCount = player.getCount();
    form = new Form();
    form.display();
   
    bohrio = createSprite(width/2 - 50, 700)
    bohrio.addImage("bohrio", car1_img);
    bohrio.scale = 0.45
    radio = createSprite(width/2 + 100, 700)
    radio.addImage("radio", car2_img);
    radio.scale=0.45
    cars = [bohrio, radio] 

    alimentation = new Group();
    muedas = new Group();
    trumk = new Group();

    var obstaclesPositions = [

      { x: 4888, y:  700, image: pedra },
      { x: 2400, y:  700, image: juli },
      { x: 1900, y:  700, image: pedra },
      { x: 2900, y:  700, image: juli },
      { x: 3600, y:  700, image: pedra },
      { x: 5400, y:  770, image: pedra },
      { x: 7900, y:  720, image: juli },
      { x: 4500, y:  779, image: pedra },
      { x: 7346, y:  735, image: juli },
      { x: 8800, y:  790, image: pedra },
      { x: 6800, y:  700, image: pedra },
      { x: 5900, y:  750, image: juli }

    ];

    this.addSprites(alimentation, 4, alimentationImg, 0.2);

        // Adicionar sprite de moeda no jogo
    this.addSprites(muedas, 18, coin, 0.1);

    this.addSprites(trumk,obstaclesPositions.length,pedra,0.4,obstaclesPositions);




  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(height * 4.5, height - 400);
        y = random(width / 2 + 150, width / 2 - 250);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd()
    if (allPlayers !== undefined) {
      image(track, -20, height-350, width*6, height*1.2);

      this.showLeaderboard();

      //índice da matriz
      var index = 0;
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          //alterar a posição da câmera na direção y
          camera.position.y = cars[index - 1].position.y;
          camera.position.x = cars[index - 1].position.x;

          const finshLine = width/2+300;

          if(player.positionY > finshLine){
            gameState: 2;
            player.rank+=1;
            Player.updateCarsAtEnd(player.rank);
            player.update();
            this.showRank()
    
          }
        }
      }
      
      // manipulando eventos de teclado
      this.handlePlayerControls();

  
      drawSprites();
    }
  }


  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW)) {
      player.positionX -= 15;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW)) {
      player.positionX += 5;
      player.update();
    }

    if (keyIsDown(DOWN_ARROW)) {
      player.positionY -= 5;
      player.update();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd:0
      });
      window.location.reload();
    });
  }

    showRank() {
      swal({
        title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
        text: "Você alcançou a linha de chegada com sucesso!",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
    }
  
    gameOver() {
      swal({
        title: `Fim de Jogo`,
        text: "Oops você perdeu a corrida!",
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize: "100x100",
        confirmButtonText: "Obrigado por jogar"
      });
    }
  
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }
















}
//pablo gfcdgrfgyvcrzxrsfgvnyhfb trgyhjbgcvthjnvbybtvjhfnbvfgjngkmhgjhvgvfc