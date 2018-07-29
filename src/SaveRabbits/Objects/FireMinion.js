"use strict";

function FireMinion(atX, atY,  texture, w, h,Cheat) {
    this.kOffset = 4.7;
    this.kShootTimer = 180;
    this.mNumCycles = 0;
    this.Cheat = Cheat;
    this.mRange = 54;
    this.mStopRange = 32;
    Minion.call(this, atX, atY, texture, w, h);
}
gEngine.Core.inheritPrototype(FireMinion,Minion);



FireMinion.prototype.update = function () {
    Minion.prototype.update.call(this);
    var b;
    var Pos1 = this.Cheat.getXform().getPosition();
    var Pos2 = this.getXform().getPosition();
    var direct = [(Pos1[0] - Pos2[0]),(Pos1[1]-Pos2[1])]; 
    var rot = 360*Math.atan(direct[1]/direct[0])/(2*Math.PI);
    if (direct[0]*direct[0]+direct[1]*direct[1]<=this.mRange*this.mRange)
    {
        this.mNumCycles++;
        if(this.mNumCycles > this.kShootTimer){
            this.mNumCycles = 0;
            b = new Bullets(this.getXform().getXPos(), this.getXform().getYPos(), direct, rot);
            this.mProjectiles.addToSet(b);
        }
        this.setCurrentFrontDir(direct);
        if (direct[0]*direct[0]+direct[1]*direct[1]<=this.mStopRange*this.mStopRange)
            this.setVelocity(0);
        else
            this.setVelocity(5);
    }
    else 
        this.mNumCycles = 0;
};