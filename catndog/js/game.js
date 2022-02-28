var playerDog;
var playerCat;
var treats;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var SceneA = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function SceneA ()
    {
        Phaser.Scene.call(this, {key: 'sceneA'});
    },

    preload: function() {
        this.load.image('park', 'assets/park.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('treat', 'assets/treat.png');
        this.load.spritesheet('dog', 'assets/mydog.png', { frameWidth: 64, frameHeight: 64 });
    },

    create: function() {
        //  background, ledges, ground
        this.add.image(250, 150, 'park');
        platforms = this.physics.add.staticGroup();
        ground = this.physics.add.staticGroup();
        ground.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(400, 400, 'ground').setScale(0.5).refreshBody();
        platforms.create(100, 325, 'ground').setScale(0.5).refreshBody();
        platforms.create(700, 325, 'ground').setScale(0.5).refreshBody();

        // sprite and properties
        playerDog = this.physics.add.sprite(400, 500, 'dog');
        playerDog.setBounce(0.2);
        playerDog.setCollideWorldBounds(true);

        //  sprite animations
        this.anims.create({
            key: 'dogTurn',
            frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'dogStraight',
            frames: [ { key: 'dog', frame: 0 } ],
            frameRate: 20
        });

        //  arrow key inputs
        cursors = this.input.keyboard.createCursorKeys();

        //  drop treats
        treats = this.physics.add.group({
            key: 'treat',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        //  score and text
        this.add.text(16, 64, "Click mouse when done to go to lvl2...", { fontSize: '28px', fill: '#000' });
        scoreText = this.add.text(16, 16, 'Treats Eaten: 0', { fontSize: '32px', fill: '#000' });
        this.add.text(16, 100, "Please reload (and avoid scrolling) if inputs not working,", { fontSize: '20px', fill: '#000' });
        this.add.text(16, 120, "sometimes itch gets fussy", { fontSize: '20px', fill: '#000' });

        //  collisions
        this.physics.add.collider(playerDog, platforms);
        this.physics.add.collider(playerDog, ground);
        this.physics.add.collider(treats, platforms);
        this.physics.add.collider(treats, ground);

        //  pick up treats
        this.physics.add.overlap(playerDog, treats, collectTreatPractice, null, this);

        // next level
        this.input.on('pointerdown', function() {
            if (score == 12) {
                this.scene.start('sceneB');
            }
        }, this);
    },

    update: function() {
        // sprite movement
        if (cursors.left.isDown)
        {
            playerDog.setVelocityX(-160);
            playerDog.anims.play('dogTurn', true);
        }
        else if (cursors.right.isDown)
        {
            playerDog.setVelocityX(160);
            playerDog.anims.play('dogTurn', true);
        }
        else
        {
            playerDog.setVelocityX(0);
            playerDog.anims.play('dogStraight');
        }

        if (cursors.up.isDown && playerDog.body.touching.down)
        {
            playerDog.setVelocityY(-330);
        }
    }
})

var SceneB = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function SceneB ()
    {
        Phaser.Scene.call(this, {key: 'sceneB'});
    },

    preload: function() {
        this.load.image('tower', 'assets/cattower.png');
        this.load.image('scratch', 'assets/scratch.png')
        this.load.image('gameover', 'assets/gameover.png')
        this.load.image('ground', 'assets/platform.png');
        this.load.image('treat', 'assets/treat.png');
        this.load.spritesheet('dog', 'assets/mydog.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cat', 'assets/mycat.png', { frameWidth: 64, frameHeight: 64 });
    },

    create: function() {
        //  background, ledges, ground
        this.add.image(250, 150, 'tower');
        platforms = this.physics.add.staticGroup();
        ground = this.physics.add.staticGroup();
        ground.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(400, 400, 'ground').setScale(0.5).refreshBody();
        platforms.create(100, 325, 'ground').setScale(0.5).refreshBody();
        platforms.create(700, 325, 'ground').setScale(0.5).refreshBody();

        // player and properties
        playerDog = this.physics.add.sprite(400, 335, 'dog');
        playerCat = this.physics.add.sprite(700, 505, 'cat');
        playerDog.setBounce(0.2);
        playerDog.setCollideWorldBounds(true);
        playerCat.setBounce(1);
        playerCat.setCollideWorldBounds(true);
        playerCat.setVelocityX(-180);

        //  sprite animations
        this.anims.create({
            key: 'dogTurn',
            frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'dogStraight',
            frames: [ { key: 'dog', frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'catTurn',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'catStraight',
            frames: [ { key: 'cat', frame: 0 } ],
            frameRate: 20
        });

        //  arrow key inputs
        cursors = this.input.keyboard.createCursorKeys();

        //  drop treats
        treats = this.physics.add.group({
            key: 'treat',
            repeat: 11,
            setXY: { x: 12, y: 520, stepX: 70 }
        });

        //  score and text
        this.add.text(16, 64, "Surprise! Avoid the cat and eat forever :)", { fontSize: '28px', fill: '#000' });
        scoreText = this.add.text(16, 16, 'Treats Eaten: ' + score, { fontSize: '32px', fill: '#000' });

        //  collisions
        this.physics.add.collider(playerDog, platforms);
        this.physics.add.collider(playerDog, ground);
        this.physics.add.collider(playerCat, platforms);
        this.physics.add.collider(playerCat, ground);
        this.physics.add.collider(treats, ground);

        //  pick up treats
        this.physics.add.overlap(playerDog, treats, collectTreat, null, this);

        // collide w enemy
        this.physics.add.collider(playerDog, playerCat, hitCat, null, this);
    },

    update: function() {
        // sprite movements
        if (gameOver)
        {
            return;
        }

        if (cursors.left.isDown)
        {
            playerDog.setVelocityX(-160);
            playerDog.anims.play('dogTurn', true);

            playerCat.anims.play('catTurn', true)
        }
        else if (cursors.right.isDown)
        {
            playerDog.setVelocityX(160);
            playerDog.anims.play('dogTurn', true);

            playerCat.anims.play('catTurn', true)
        }
        else
        {
            playerDog.setVelocityX(0);
            playerDog.anims.play('dogStraight');

            playerCat.anims.play('catStraight')
        }

        if (cursors.up.isDown && playerDog.body.touching.down)
        {
            playerDog.setVelocityY(-330);
        }
    }
})

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [SceneA, SceneB]
};

var game = new Phaser.Game(config);

function collectTreatPractice (player, treat)
{
    treat.disableBody(true, true);

    //  update score
    score += 1;
    scoreText.setText('Treats Eaten: ' + score);

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

}

function collectTreat (player, treat)
{
    treat.disableBody(true, true);

    //  update score
    score += 1;
    scoreText.setText('Treats Eaten: ' + score);

    if (treats.countActive(true) === 0)
    {
        //  drop more treats
        treats.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    }
}

function hitCat (playerDog, playerCat)
{
    // end game screen
    this.add.image(400, 250, 'scratch').setScale(1.5);
    this.add.image(400, 300, 'gameover');

    gameOver = true;
}