const s = 530/30
let foods = []
let walls = []
let agent
function setup() {
    createCanvas(700, 530+(2*s))
    frameRate(50)
    for(let i = 0; i < 32; i++){
        walls.push({x: i, y: 0})
        walls.push({x: i, y: 31})
    }
    for(let i = 0; i < 32; i++){
        walls.push({x: 0, y: i})
        walls.push({x: 31, y: i})
    }

    for(let i = 0; i < 400; i++)
        foods[i] = new Comida(Math.floor(Math.random() * 30)+1,
        Math.floor(Math.random() * 30)+1,
        s)
    agent = new Agent(16, 20, s, 100)
}

function draw() {
    background(200)
    angleMode(DEGREES)
    fill(150)
    rect(s, s, 530, 530)
    for(let i = 0; i < foods.length; i++)
        foods[i].draw()

    // sensorDisplay()
    gridDisplay()

    // if(agent.energy > 0){
        agent.action(foods, walls)
        agent.sensorDisplay()
    // }
    fill(10)
    textSize(16)
    text('Energy: '+agent.energy, 590, 200);
    text('Dir: '+agent.internal_state.direction, 590, 230);
    text('Last action: '+agent.internal_state.last_action, 590, 260);
    agent.draw()


    translate(0, 0)

}

function gridDisplay(){
    for(let i = 1; i <= 30; i++){
        fill(100)
        line(s, i*s, 530+s, i*s)
        line(i*s, s, i*s, 530+s)
    }

    for(let i = 0; i<walls.length; i++){
        fill(10, 200, 23)
        rect(walls[i].x*s, walls[i].y*s, s, s)
    }
}