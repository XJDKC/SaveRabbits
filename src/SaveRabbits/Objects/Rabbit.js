
/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, SpriteRenderable, RigidCircle, RigidRectangle, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
function Rabbit(SpaceShip,TEXTURE,atX,atY) {
    this.SpaceShip = SpaceShip;
    this.Cheat = this.SpaceShip.Cheat;

    this.RelaPos = [atX,atY];

    this.mState = Rabbit.eHeroState.eMove;

    this.curdirect = null;
    this.predirect = null;

    this.squareSize = 1;
    this.step = 0.1;
    this.accel = 0;
    this.curLateral = 0;

    this.Control = null;

    var pos = this.Cheat.getXform().getPosition();
    var radius = this.Cheat.getRigidBody().getRadius();
    var Rabbit1 = new SpriteAnimateRenderable(TEXTURE);
    Rabbit1.getXform().setSize(radius * 1.5 / 16, radius  * 3 / 16);
    Rabbit1.getXform().setRotationInDegree(0);
    Rabbit1.setColor([1,1,1,0]);
    Rabbit1.getXform().setPosition(pos[0] * this.SpaceShip.mapSize,pos[1] * this.SpaceShip.mapSize);
    GameObject.call(this,Rabbit1);
}

gEngine.Core.inheritPrototype(Rabbit, GameObject);

Rabbit.eHeroState = Object.freeze({
    eMove: 1,
    eClimb: 2,
    eAttack: 3,
    eAdvance: 4,
    eDefend: 5,
    eFallDown: 6,
    eFaceLeft: 7,
    eFaceRight: 8
});

Rabbit.eDirect = Object.freeze({
    eLeft:1,
    eRight:2,
    eUp:3,
    eDown:4

});

Rabbit.prototype.set

Rabbit.prototype.getType = function (x,y) {
    var i,j;
    i=32-Math.ceil(y+16);
    j=Math.floor(x+16);
    return this.SpaceShip.SpaceShipMap[i][j];
};

Rabbit.prototype.draw = function (aCamera){

    var Pos = this.Cheat.getRigidBody().getCenter();
    var scale = this.SpaceShip.mapSize;
    this.mRenderComponent.getXform().setPosition(this.RelaPos[0] * scale +Pos[0]- 0.2,this.RelaPos[1] * scale+Pos[1] + 0.1 );
    GameObject.prototype.draw.call(this,aCamera);
};
Rabbit.prototype.update = function () {
    this.FSM();
};

Rabbit.prototype.transToMat = function(pos) {
    var radius = this.Cheat.getRigidBody().getRadius();
    var i = 32-Math.ceil((pos[1]+radius)/this.squareSize);
    var j = Math.floor((pos[0]+radius)/this.squareSize);
    return [i,j];
}


Rabbit.prototype.FSM = function(){
    var temp = null;
    var radius = this.Cheat.getRigidBody().getRadius();
    switch (this.mState) {
        case Rabbit.eHeroState.eMove:
            if (gEngine.Input.isKeyPressed(this.Control.Left)) {
                this.curdirect = Rabbit.eDirect.eLeft;
                this.predirect = this.Control.Left;
                this.RelaPos[0] -= this.step;
                this.collisionTest();
            }
            if (gEngine.Input.isKeyPressed(this.Control.Right)) {
                this.curdirect = Rabbit.eDirect.eRight;
                this.predirect = this.Control.Right;
                this.RelaPos[0] += this.step;
                this.collisionTest();
            }
            if (gEngine.Input.isKeyPressed(this.Control.Up)) {
                this.curdirect = Rabbit.eDirect.eUp;
                if (this.getType(this.RelaPos[0],this.RelaPos[1]) == 2)
                {
                    this.RelaPos[0] = -radius + this.squareSize/2 + Math.floor(radius+this.RelaPos[0]);
                    this.mState = Rabbit.eHeroState.eClimb;
                }
            }
            if (gEngine.Input.isKeyPressed(this.Control.Down )){
                this.curdirect = Rabbit.eDirect.eDown;
                if (this.getType(this.RelaPos[0],this.RelaPos[1]) == 2)
                {
                    this.RelaPos[0] = -radius + this.squareSize/2 + Math.floor(radius+this.RelaPos[0]);
                    this.mState = Rabbit.eHeroState.eClimb;
                }
            }
            if (gEngine.Input.isKeyClicked(this.Control.Leave)) {
                if ((temp=this.getType(this.RelaPos[0],this.RelaPos[1]))>2)
                    this.mState = temp;
            }

            this.curdirect = Rabbit.eDirect.eDown;
            this.RelaPos[1] -= this.step;
            if (!this.collisionTest())
            {
                this.RelaPos[1] +=this.step;
                if (this.getType(this.RelaPos[0],this.RelaPos[1]) != 2)
                    this.mState = Rabbit.eHeroState.eFallDown;
            }
            break;
        case Rabbit.eHeroState.eClimb:
            if (gEngine.Input.isKeyPressed(this.Control.Up)) {
                this.accel += 1;
                if (this.getType(this.RelaPos[0],this.RelaPos[1] + this.step/2) == 2) {
                    this.RelaPos[1] += this.step;
                }
            }
            if (gEngine.Input.isKeyPressed(this.Control.Down )) {
                this.curdirect = Rabbit.eDirect.eDown;
                this.RelaPos[1] -= this.step;
                this.accel += 1;
                this.collisionTest();
            }
            if (gEngine.Input.isKeyClicked(this.Control.Left)) {

                this.curdirect = Rabbit.eDirect.eLeft;
                this.RelaPos[0] -= this.step;
                if (!this.collisionTest())
                {
                    this.mState = Rabbit.eHeroState.eFallDown;
                    this.predirect = this.Control.Left;
                }
            }
            if (gEngine.Input.isKeyClicked(this.Control.Right))  {
                this.curdirect = Rabbit.eDirect.eRight;
                this.RelaPos[0] += this.step;
                if (!this.collisionTest())
                {
                    this.mState = Rabbit.eHeroState.eFallDown;
                    this.predirect = this.Control.Right;
                }
            }
            console.log(this.accel);
            if (this.accel > 15)
            {
                if (gEngine.Input.isKeyPressed(this.Control.Left)) {
                    this.curdirect = Rabbit.eDirect.eLeft;
                    this.RelaPos[0] -= this.step;
                    if (!this.collisionTest())
                    {
                        this.accel = 0;
                        this.mState = Rabbit.eHeroState.eFallDown;
                        this.predirect = this.Control.Left;
                    }
                }
                if (gEngine.Input.isKeyPressed(this.Control.Right))  {
                    this.curdirect = Rabbit.eDirect.eRight;
                    this.RelaPos[0] += this.step;
                    if (!this.collisionTest())
                    {
                        this.accel = 0;
                        this.mState = Rabbit.eHeroState.eFallDown;
                        this.predirect = this.Control.Right;
                    }
                }
            }
            break;
        case Rabbit.eHeroState.eFallDown:
            var flag = false;
            this.curdirect = Rabbit.eDirect.eDown;
            this.RelaPos[1] -= this.step;
            flag = this.collisionTest();
            if (this.predirect === this.Control.Left)
                this.RelaPos[0] -= this.step;
            else
                this.RelaPos[0] += this.step;
            this.curLateral ++;
            if (this.curLateral >= 5 && flag) {
                this.mState = Rabbit.eHeroState.eMove;
                this.curLateral = 0;
            }
            break;
        case Rabbit.eHeroState.eAttack:
            if (gEngine.Input.isKeyClicked(this.Control.Leave))
                this.mState = Rabbit.eHeroState.eMove;
            break;
        case Rabbit.eHeroState.eDefend:
            if (gEngine.Input.isKeyClicked(this.Control.Leave))
                this.mState = Rabbit.eHeroState.eMove;
            break;
        case Rabbit.eHeroState.eAdvance:
            if (gEngine.Input.isKeyClicked(this.Control.Leave))
                this.mState = Rabbit.eHeroState.eMove;
            break;
    }
};


Rabbit.prototype.test = function(i,j){
    if (this.curdirect == Rabbit.eDirect.eLeft)
    {
        if (this.SpaceShip.SpaceShipMap[i][j-1] > 0 )
            return false;
    }
    else if (this.curdirect == Rabbit.eDirect.eRight)
    {
        if (this.SpaceShip.SpaceShipMap[i][j+1] > 0 )
            return false;
    }
    else if (this.curdirect == Rabbit.eDirect.eUp)
    {
        if (this.SpaceShip.SpaceShipMap[i-1][j] > 0 )
            return false;
    }
    else if (this.curdirect == Rabbit.eDirect.eDown)
    {
        if (this.SpaceShip.SpaceShipMap[i+1][j] > 0 )
            return false;
    }
    return true;
};

Rabbit.prototype.singleTest = function(pos){

    var i1, j1, i2, j2, i3 ,j3;
    var deltax = this.squareSize/2 + this.step/2;
    var deltay = this.squareSize/2 - this.step/2;

    if (this.curdirect == Rabbit.eDirect.eLeft)
    {
        [i1,j1] = this.transToMat([pos[0] + deltax,pos[1]]);
        [i2,j2] = this.transToMat([pos[0] + deltax,pos[1] + deltay]);
        [i3,j3] = this.transToMat([pos[0] + deltax,pos[1] - deltay]);
        if (this.test(i1,j1)||this.test(i2,j2)||this.test(i3,j3)) {
            this.RelaPos[0] += this.step;
            return true;
        }
    }
    else if (this.curdirect == Rabbit.eDirect.eRight)
    {
        [i1,j1] = this.transToMat([pos[0] - deltax,pos[1]]);
        [i2,j2] = this.transToMat([pos[0] - deltax,pos[1] + deltay]);
        [i3,j3] = this.transToMat([pos[0] - deltax,pos[1] - deltay]);
        if (this.test(i1,j1)||this.test(i2,j2)||this.test(i3,j3)){
            this.RelaPos[0] -= this.step;
            return true;
        }
    }
    else if (this.curdirect == Rabbit.eDirect.eUp)
    {
        [i1,j1] = this.transToMat([pos[0],pos[1] - deltax]);
        [i2,j2] = this.transToMat([pos[0] + deltay,pos[1] - deltax]);
        [i3,j3] = this.transToMat([pos[0] - deltay,pos[1] - deltax]);
        if (this.test(i1,j1)||this.test(i2,j2)||this.test(i3,j3)) {
            this.RelaPos[1] -= this.step;
            return true;
        }
    }
    else if (this.curdirect == Rabbit.eDirect.eDown)
    {
        [i1,j1] = this.transToMat([pos[0],pos[1] + deltax]);
        [i2,j2] = this.transToMat([pos[0] + deltay,pos[1] + deltax]);
        [i3,j3] = this.transToMat([pos[0] - deltay,pos[1] + deltax]);
        if (this.test(i1,j1)||this.test(i2,j2)||this.test(i3,j3)) {
            this.RelaPos[1] += this.step;
            return true;
        }
    }
    return false;
}

Rabbit.prototype.collisionTest = function(){
    if (this.singleTest([this.RelaPos[0],this.RelaPos[1]+this.squareSize/2]))
        return true;
    if (this.singleTest([this.RelaPos[0],this.RelaPos[1]-this.squareSize/2]))
        return true;
    return false;
};