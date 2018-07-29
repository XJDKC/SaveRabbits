

/* global gEngine, Scene, MyScene, vec2, gManager */

function NewPlayerLevel() {
    this.kSpaceShipXML = "assets/SpaceShip.xml";
    this.kMapXML = "assets/Map.xml";
    this.mapBackground = "assets/mapRigidTexture.png";
    this.mapRigidtexture = "assets/mapRigidTexture.png";
    this.cheattexture = "assets/wingMan1.png";
    this.kParticle = "assets/jetpack.png";
    this.kPropellerTexture = "assets/Propeller.png";
    this.kPropellerFireTexture = "assets/Propeller_fire.png";
    this.kDefenderTexture = "assets/defender.png";
    this.rabTexture1 = "assets/bunny1_stand.png";
    this.rabTexture2 = "assets/bunny2_stand.png";
    this.kCircleTexture = "assets/ball.png";
    this.kStairsTexture = "assets/stairs.png";
    this.kAdvanceControllerTexture = "assets/advance_controller.png";
    this.kDefendControllerTexture = "assets/defend_controller.png";
    this.kLeftAttackControllerTexture = "assets/left_attack_controller.png";
    this.kRightAttackControllerTexture = "assets/right_attack_controller.png";
    this.kGunBarrelTexture = "assets/gun_barrel.png";
    this.kGunBaseTexture = "assets/gun_base.png";
    this.kTips1Texture = "assets/Tip1.png";
    this.kTips2Texture = "assets/Tip2.png";
    this.kTips3Texture = "assets/Tip3.png";
    this.kTip4Texture = "assets/Tip4.png";
    this.mAllParticles = new ParticleGameObjectSet();
    this.kTipsTexture =[this.kTips1Texture,this.kTips2Texture,this.kTips3Texture,this.kTip4Texture];
    
    this.showTip =1;
    this.mCamera = null;
    this.mMiniCamera = null;
    this.mBarCamera = null;
    this.CoinCamera = null;
    this.bloodBar = null;
    this.Cheat = null;
    this.SpaceShip = null;
    this.mRabbit1 = null;
    this.mRabbit2 = null;
    this.mTips = null;
    this.mBgTexture = null;
    this.map = null;
    //场景切换
    this.Menu =false;
    

 
}

gEngine.Core.inheritPrototype(NewPlayerLevel, Scene);

NewPlayerLevel.prototype.initialize = function () {
    Scene.prototype.initialize.call(this);
    var sceneParser = new SceneFileParser(this.kMapXML);
    //this.mCamera = sceneParser.parseCamera();
    [this.mCamera, this.mMiniCamera, this.mBarCamera, this.CoinCamera] = sceneParser.parseCamera();
    
    this.mCamera = new Camera(
        vec2.fromValues(100, 400), // position of the camera
        140,                        // width of camera
        [0, 0, 1280, 720],         // viewport (orgX, orgY, width, height)
    );
    this.mMiniCamera = new Camera(
        vec2.fromValues(100, 400), // position of the camera
        240,                        // width of camera
        [19.2,19.2, 121.6, 121.6],         // viewport (orgX, orgY, width, height)
    );
    this.mMiniCamera.setBackgroundColor([0.5, 0.5, 0.5, 1]);
    
    
    this.Cheat = new Cheatobject(80, 500, this.kCircleTexture, 32, 32);
    this.map = sceneParser.parseMapBackground(this.mapBackground);
    sceneParser = new SceneFileParser(this.kSpaceShipXML);
    this.SpaceShip = new SpaceShip(100,400,this.Cheat,this.kPropellerTexture,this.kPropellerFireTexture,this.kDefenderTexture,this.kStairsTexture,
                                    this.kAdvanceControllerTexture,this.kDefendControllerTexture,this.kLeftAttackControllerTexture
                                            ,this.kRightAttackControllerTexture,this.kGunBarrelTexture,this.kGunBaseTexture);
          
    this.SpaceShip.SpaceShipMap = sceneParser.parseSpaceShipMap();
    this.mRabbit1 = new Rabbit(this.SpaceShip, this.rabTexture1, -1, 0);
    this.mRabbit2 = new Rabbit(this.SpaceShip, this.rabTexture2, 1, 0);
    [this.mRabbit1.Control, this.mRabbit2.Control] = sceneParser.parseRabbits();
  
    var shipPos = this.Cheat.getXform().getPosition();
    this.mTips1Texture = new Tips(this.kTipsTexture[0],shipPos);
    this.mTips2Texture = new Tips(this.kTipsTexture[1],shipPos);
    shipPos = [shipPos[0]-60,shipPos[1]];
    this.mTips3Texture = new Tips(this.kTipsTexture[2],shipPos);
    this.mTips4Texture = new Tips(this.kTipsTexture[3],shipPos);
    
    this.mTips = new FontRenderable("Hello");
    this.mTips.setColor([0, 0, 0, 1]);
    this.mTips.getXform().setSize(40,20);
    this.mTips.getXform().setPosition(105, 430);
    this.mTips.setTextHeight(2);

};
NewPlayerLevel.prototype.loadScene = function () {
    // Load scene
    gEngine.TextFileLoader.loadTextFile(this.kMapXML, gEngine.TextFileLoader.eTextFileType.eXMLFile);
    gEngine.TextFileLoader.loadTextFile(this.kSpaceShipXML, gEngine.TextFileLoader.eTextFileType.eXMLFile);
    gEngine.Textures.loadTexture(this.rabTexture1);
    gEngine.Textures.loadTexture(this.rabTexture2);
    gEngine.Textures.loadTexture(this.kCircleTexture);
    gEngine.Textures.loadTexture(this.mapBackground);
    gEngine.Textures.loadTexture(this.cheattexture);
    gEngine.Textures.loadTexture(this.kParticle);
    gEngine.Textures.loadTexture(this.kPropellerTexture);
    gEngine.Textures.loadTexture(this.kPropellerFireTexture);
    gEngine.Textures.loadTexture(this.kDefenderTexture);
    gEngine.Textures.loadTexture(this.kStairsTexture);
    gEngine.Textures.loadTexture(this.kAdvanceControllerTexture);
    gEngine.Textures.loadTexture(this.kDefendControllerTexture);
    gEngine.Textures.loadTexture(this.kLeftAttackControllerTexture);
    gEngine.Textures.loadTexture(this.kRightAttackControllerTexture);
    gEngine.Textures.loadTexture(this.kGunBarrelTexture);
    gEngine.Textures.loadTexture(this.kGunBaseTexture);
    gEngine.Textures.loadTexture(this.kTipsTexture[0]);
    gEngine.Textures.loadTexture(this.kTipsTexture[1]);
    gEngine.Textures.loadTexture(this.kTipsTexture[2]);
    gEngine.Textures.loadTexture(this.kTipsTexture[3]);
  
    //gEngine.Textures.loadTexture(this.mapRigidtexture);

};

NewPlayerLevel.prototype.unloadScene = function () {
    // 卸载场景
    gEngine.LayerManager.cleanUp();
    gEngine.TextFileLoader.unloadTextFile(this.kSpaceShipXML);
    gEngine.TextFileLoader.unloadTextFile(this.kMapXML);
    gEngine.Textures.unloadTexture(this.rabTexture1);
    gEngine.Textures.unloadTexture(this.rabTexture2);
    gEngine.Textures.unloadTexture(this.kCircleTexture);
    gEngine.Textures.unloadTexture(this.mapBackground);
    gEngine.Textures.unloadTexture(this.cheattexture);
    gEngine.Textures.unloadTexture(this.kParticle);
    gEngine.Textures.unloadTexture(this.kPropellerTexture);
    gEngine.Textures.unloadTexture(this.kPropellerFireTexture);
    gEngine.Textures.unloadTexture(this.kDefenderTexture);
    gEngine.Textures.unloadTexture(this.kStairsTexture);
    gEngine.Textures.unloadTexture(this.kAdvanceControllerTexture);
    gEngine.Textures.unloadTexture(this.kDefendControllerTexture);
    gEngine.Textures.unloadTexture(this.kLeftAttackControllerTexture);
    gEngine.Textures.unloadTexture(this.kRightAttackControllerTexture);
    gEngine.Textures.unloadTexture(this.kGunBarrelTexture);
    gEngine.Textures.unloadTexture(this.kGunBaseTexture);
    gEngine.Textures.unloadTexture(this.kTipsTexture[0]);
    gEngine.Textures.unloadTexture(this.kTipsTexture[1]);
    gEngine.Textures.unloadTexture(this.kTipsTexture[2]);
    gEngine.Textures.unloadTexture(this.kTipsTexture[3]);
    if(this.Menu === true){
        var nextLevel = new MenuLevel();
        gEngine.Core.startScene(nextLevel);
    }
};

NewPlayerLevel.prototype.update = function () {

    this.mCamera.update();
    this.mMiniCamera.update();
    Scene.prototype.update.call(this);
    //gEngine.Physics.processObjSet(this.SpaceShip, this.mAllWalls);
    this.SpaceShip.update(this.mRabbit1, this.mRabbit2, this.Cheat);
    var shipPos = this.Cheat.getXform().getPosition();
//     this.mTips1Texture.update(shipPos);
    this.mRabbit1.update();
    this.mRabbit2.update();
    //next tip
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Enter)){
        if(this.showTip<8)
        this.showTip++;
    }
    if(gEngine.Input.isKeyClicked((gEngine.Input.keys.Q))){
        this.Menu = true;
        gEngine.GameLoop.stop();
    }
    this.shipPos = this.Cheat.getXform().getPosition();
    this.mCamera.setWCCenter(this.shipPos[0], this.shipPos[1]);
    this.showTipsTexture(this.showTip,'update');
    this.mMiniCamera.setWCCenter(this.shipPos[0], this.shipPos[1]);
};

NewPlayerLevel.prototype.draw = function () {
    //Scene.prototype.draw.call(this);
    gEngine.Core.clearCanvas([0, 0, 0, 1]);
   
    this.mCamera.setupViewProjection();
    this.mAllParticles.draw(this.mCamera);
    this.SpaceShip.draw(this.mCamera, this.Cheat);
    this.mRabbit1.draw(this.mCamera);
    this.mRabbit2.draw(this.mCamera);
    this.showTipsTexture(this.showTip,'draw');
    this.showTips(this.showTip);
    // gEngine.LayerManager.drawAllLayers(this.mCamera);
    this.mMiniCamera.setupViewProjection();
    this.mAllParticles.draw(this.mMiniCamera);
    this.SpaceShip.draw(this.mMiniCamera, this.Cheat);
    this.mRabbit1.draw(this.mMiniCamera);
    this.mRabbit2.draw(this.mMiniCamera);
    gEngine.LayerManager.drawAllLayers(this.mMiniCamera);
};

NewPlayerLevel.prototype.setText = function (text,posX,posY){
    this.mTips.setText(text);
    this.mTips.getXform().setPosition(posX, posY);
    this.mTips.draw(this.mCamera);
};
NewPlayerLevel.prototype.showTipsTexture = function(showTips,op){
    if(op==="draw"){
        switch(showTips){
            case 1:
            case 2:
                 this.mTips1Texture.draw(this.mCamera);
                 break;
            case 3:
            case 4:
                 this.mTips2Texture.draw(this.mCamera);
                 break;
            case 5:
            case 6:
                 this.mTips3Texture.draw(this.mCamera);
                 break;
            case 7:
            case 8:
                 this.mTips4Texture.draw(this.mCamera);
                 break;
        }
    }
    else{
        switch(showTips){
            case 1:
            case 2:
                 this.mTips1Texture.getXform().setPosition(this.shipPos[0]+45, this.shipPos[1]+25);
                 break;
            case 3:
            case 4:
                 this.mTips2Texture.getXform().setPosition(this.shipPos[0]+45, this.shipPos[1]+25);
                 break;
            case 5:
            case 6:
                 this.mTips3Texture.getXform().setPosition(this.shipPos[0]-40, this.shipPos[1]+25);
                 break;
            case 7:
            case 8:
                 this.mTips4Texture.getXform().setPosition(this.shipPos[0]-45, this.shipPos[1]+25);
                 break;
        }
    }
}

NewPlayerLevel.prototype.showTips = function (showTips){
    switch(showTips){
        case 1: 
            this.setText("Hello, welcome to the game,'Save",this.shipPos[0]+25,this.shipPos[1]+33);
            this.setText("Rabbits', I'm Dr.Rabbit. let me",this.shipPos[0]+25,this.shipPos[1]+30);
            this.setText("show you how to play the game!",this.shipPos[0]+25,this.shipPos[1]+27);
            this.setText("Press [ENTER] to continue...",this.shipPos[0]+25,this.shipPos[1]+24);
            break;
        case 2:
            this.setText("At first, try to move your rabbit",this.shipPos[0]+25,this.shipPos[1]+33);
            this.setText("with [WASD] for player 1 and [Up,",this.shipPos[0]+25,this.shipPos[1]+30);
            this.setText("Left,Down,Right] for player 2.",this.shipPos[0]+25,this.shipPos[1]+27);
            this.setText("If you are ready,press",this.shipPos[0]+25,this.shipPos[1]+24);
            this.setText("[ENTER] to continue...",this.shipPos[0]+25,this.shipPos[1]+21);
            break;
        case 3:
            this.setText("There are three major controllers in",this.shipPos[0]+25,this.shipPos[1]+33);
            this.setText("our space ship, let's begin with ",this.shipPos[0]+25,this.shipPos[1]+30);
            this.setText("the weapon, it can help you to",this.shipPos[0]+25,this.shipPos[1]+27);
            this.setText("eliminate your enemies. ",this.shipPos[0]+25,this.shipPos[1]+24);
            this.setText("Press [ENTER] to ",this.shipPos[0]+25,this.shipPos[1]+21);
             this.setText("continue..",this.shipPos[0]+25,this.shipPos[1]+18);
            break;
        case 4:
            
            this.setText("Frist, you have to move to the ",this.shipPos[0]+25,this.shipPos[1]+33);
            this.setText("position of the controller, press",this.shipPos[0]+25,this.shipPos[1]+30);
            this.setText("[G](for P1,) or [.](for P2)",this.shipPos[0]+25,this.shipPos[1]+27);
            this.setText("to gain contorl.  ",this.shipPos[0]+25,this.shipPos[1]+24);
            this.setText("Press [ENTER] to ",this.shipPos[0]+25,this.shipPos[1]+21);
            this.setText("continue..",this.shipPos[0]+25,this.shipPos[1]+18);
            
            break;
        case 5:
            this.setText("Try [A,D](for P1)[Left,Right]",this.shipPos[0]-60,this.shipPos[1]+33);
            this.setText("(for P2)to rotate the weapon.",this.shipPos[0]-60,this.shipPos[1]+30);
            this.setText("      Press [F](for P1) or [,](for",this.shipPos[0]-60,this.shipPos[1]+27);
            this.setText("          P2)to fire, click [G] or  " ,this.shipPos[0]-60,this.shipPos[1]+24);
            this.setText("         [.] to leave. Press ",this.shipPos[0]-60,this.shipPos[1]+21);
            this.setText("          [ENTER] to continue..",this.shipPos[0]-60,this.shipPos[1]+18);
            break;
        case 6:
            this.setText("Try to do the same operation ",this.shipPos[0]-60,this.shipPos[1]+33);
            this.setText("to other controllers, and get",this.shipPos[0]-60,this.shipPos[1]+30);
            this.setText("     used to this kind of module ",this.shipPos[0]-60,this.shipPos[1]+27);
            this.setText("        as soon as possible. " ,this.shipPos[0]-60,this.shipPos[1]+24);
            this.setText("        Press [ENTER] to continue..",this.shipPos[0]-60,this.shipPos[1]+21);
            break;
        case 7:
            this.setText("Great! You have done a really",this.shipPos[0]-65,this.shipPos[1]+35);
            this.setText("goodjob. Besides, remember your",this.shipPos[0]-65,this.shipPos[1]+32);
            this.setText("final goal is collecting the coins",this.shipPos[0]-65,this.shipPos[1]+29);
            this.setText("and protect yourslef from death." ,this.shipPos[0]-65,this.shipPos[1]+26);
            this.setText("Press     [ENTER] to continue..",this.shipPos[0]-65,this.shipPos[1]+23);
            break;
        case 8:
            this.setText("Excellent! Now you have known all",this.shipPos[0]-65,this.shipPos[1]+35);
            this.setText("the rules. If you are ready, just",this.shipPos[0]-65,this.shipPos[1]+32);
            this.setText("press [q] to back to the main",this.shipPos[0]-65,this.shipPos[1]+29);
            this.setText(" interface and enjoy our game!!!" ,this.shipPos[0]-65,this.shipPos[1]+26);
            this.setText("I'm       sure you will love it!!!",this.shipPos[0]-65,this.shipPos[1]+23);
            break;
    }
}
