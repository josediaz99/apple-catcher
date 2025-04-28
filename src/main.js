

//--------------------------
const sizes = {
  width: 500,
  height:500
}
const speedDown = 300

const StartDiv = document.querySelector("#gameStartDiv")
const EndDiv = document.querySelector("#gameEndDiv")
const StartBtn = document.querySelector("#gameStartBtn")
const WinLostSpan = document.querySelector("#gameWinLoseSpan")
const ScoreSpan = document.querySelector("#gameScoreSpan")

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game");
    this.player;
    this.curson;
    this.playerSpeed = speedDown + 50;
    this.points = 0;
    this.target;
    this.textScore;
    this.textTime;
    this.timeEvent;
    this.remainingTime;
    this.emiter;
  }
  preload(){
    this.load.image("bg", "public/assets/bg.png");
    this.load.image("basket","public/assets/basket.png");
    this.load.image("apple", "public/assets/apple.png");
    this.load.audio("bgMusic", "public/assets/bgMusic.mp3");
    this.load.audio("coin", "public/assets/coin.mp3");
    this.load.image("money", "public/assets/money.png")

  }
  create(){
    this.scene.pause("scene-game");

    this.coinMusic = this.sound.add("coin");
    this.backGroundMusic = this.sound.add("bgMusic");


    this.add.image(0,0,"bg").setOrigin(0,0);
    this.player = this.physics.add.image(0,sizes.height-100,"basket").setOrigin(0,0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    //this.player.setSize(80,15).setOffset(10,70)
    this.player.setSize(this.player.width-this.width/4, this.player.height/6).setOffset(this.player.width/10,this.player.height-this.player.height/10);

    this.target = this.physics.add.image(0,0,"apple").setOrigin(0,0);
    this.target.setMaxVelocity(0,speedDown);

    this.physics.add.overlap(this.target,this.player,this.targetHit,null,this);
    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120,10,"Score: 0",{
      font: "25px Arial",
      fill:"#000000",
    });

    this.textTime = this.add.text(10,10,"Remaining time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.emiter = this.add.particles(0,0,"money",{
      speed:100,
      gravity:speedDown-200,
      scale:0.04,
      duration:100,
      emitting:false
    })
    this.emiter.startFollow(this.player,this.player.width/2, this.player.height/2,true);
    this.timeEvent = this.time.delayedCall(30000,this.gameOver,[],this)
  }
  update(){
    this.remainingTime = this.timeEvent.getRemainingSeconds()
    this.textTime.setText(`remaining Time: ${Math.round(this.remainingTime).toString()}`)

    if (this.target.y >= sizes.height){
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const {left,right} = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    }else if(right.isDown){
      this.player.setVelocityX(this.playerSpeed);
    }else{
      this.player.setVelocity(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 480);
  }

  targetHit(){
    this.emiter.start();
    this.coinMusic.play();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);
  }

  gameOver(){
    this.sys.game.destroy(true)
    ScoreSpan.textContent = this.points
    if(this.points >= 10){
      WinLostSpan.textContent = "Win!!!"
    }else{
      WinLostSpan.textContent = "lose!!!"
    }
    EndDiv.style.display = "flex";
    
  }
}

const config = {
  type:Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,
  physics:{
    default:"arcade",
    arcade:{
      gravity:{y:speedDown},
      debug:true
  }
},
scene:[GameScene]
}

const game = new Phaser.Game(config)

StartBtn.addEventListener("click", ()=> {
  StartDiv.style.display = "none"
  game.scene.resume("scene-game")
})