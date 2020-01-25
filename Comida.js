class Comida{
    constructor(ini_x, ini_y, l){
        this.x = ini_x
        this.y = ini_y
        this.l = l
    }

    draw(){
        fill(235, 213, 52)
        ellipse(this.x*this.l+this.l/2, this.y*this.l+this.l/2, this.l, this.l)
    }
}