class Agent{
    constructor(ini_x,ini_y, l, ini_energy){
        this.x = ini_x
        this.y = ini_y
        this.l = l
        this.angle = 0
        this.energy = ini_energy
        this.internal_state = {
            direction: 1,
            last_action: 'mf', // mf, rl, rr
            n_steps_after_last_food: 0
        }
        this.max_n_steps = Math.round(Math.random() * (30-6))+6
        this.sensors = [
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null}
        ]
    }

    draw(){
        translate(this.x*this.l+this.l/2, this.y*this.l+this.l/2)
        rotate(this.angle)
        fill(235, 70, 52)
        triangle(-this.l/2, this.l/2, 0, -this.l/2, this.l/2,this.l/2)
    }

    perception(food, walls){
        let new_perception = [
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null},
            {state: false, pos: null, type: null}
        ]

        for(let i = 0; i<food.length; i++){
            const pos_dif = {
                x: food[i].x-this.x,
                y: food[i].y-this.y
            }

            if(pos_dif.x === -1){
                switch(pos_dif.y){
                    case -1:
                        new_perception[0].state = true
                        new_perception[0].pos = i
                        new_perception[0].type = 'food'
                        console.log("=> ", i)
                        return new_perception
                    case 0:
                        new_perception[7].state = true
                        new_perception[7].pos = i
                        new_perception[7].type = 'food'
                        console.log("=> ", i)
                        return new_perception
                    case 1:
                        new_perception[6].state = true
                        new_perception[6].pos = i
                        new_perception[6].type = 'food'
                        console.log("=> ", i)
                        return new_perception
                }
            }else if(pos_dif.x === 1){
                switch(pos_dif.y){
                    case -1:
                        new_perception[2].state = true
                        new_perception[2].pos = i
                        new_perception[2].type = 'food'
                        console.log("=> ", i)
                        return new_perception
                    case 0:
                        new_perception[3].state = true
                        new_perception[3].pos = i
                        new_perception[3].type = 'food'
                        console.log("=> ", i)
                        return new_perception
                    case 1:
                        new_perception[4].state = true
                        new_perception[4].pos = i
                        new_perception[4].type = 'food'
                        console.log("=> ", i)
                        return new_perception
                }
            }else if(pos_dif.x === 0){
                switch(pos_dif.y){
                    case -1:
                        new_perception[1].state = true
                        new_perception[1].pos = i
                        new_perception[1].type = 'food'
                        console.log("=> ", i)
                        return new_perception
                    case 1:
                        new_perception[5].state = true
                        new_perception[5].pos = i
                        new_perception[5].type = 'food'
                        console.log("=> ", i)
                        return new_perception
                }
            }
        }

        for(let i = 0; i<walls.length; i++){
            const pos_dif = {
                x: walls[i].x-this.x,
                y: walls[i].y-this.y
            }

            if(pos_dif.x === -1){
                switch(pos_dif.y){
                    case -1:
                        new_perception[0].state = true
                        new_perception[0].type = 'wall'
                        break
                    case 0:
                        new_perception[7].state = true
                        new_perception[7].type = 'wall'
                        break
                    case 1:
                        new_perception[6].state = true
                        new_perception[6].type = 'wall'
                        break
                }
            }else if(pos_dif.x === 1){
                switch(pos_dif.y){
                    case -1:
                        new_perception[2].state = true
                        new_perception[2].type = 'wall'
                        break
                    case 0:
                        new_perception[3].state = true
                        new_perception[3].type = 'wall'
                        break
                    case 1:
                        new_perception[4].state = true
                        new_perception[4].type = 'wall'
                        break
                }
            }else if(pos_dif.x === 0){
                switch(pos_dif.y){
                    case -1:
                        new_perception[1].state = true
                        new_perception[1].type = 'wall'
                        break
                    case 1:
                        new_perception[5].state = true
                        new_perception[5].type = 'wall'
                        break
                }
            }
        }

        return new_perception
    }

    action(food, walls){
        this.sensors = this.perception(food, walls)

        if(this.sensors[this.internal_state.direction].type === 'wall'){
            if(this.sensors[this.internal_state.direction].state){
                const left_sensors_sum = this.sensors[this.calcSensorPos(this.internal_state.direction, -1)].state + this.sensors[this.calcSensorPos(this.internal_state.direction, -2)].state
                const right_sensors_sum = this.sensors[this.calcSensorPos(this.internal_state.direction, 1)].state + this.sensors[this.calcSensorPos(this.internal_state.direction, 2)].state
                const sensors_dif = left_sensors_sum - right_sensors_sum
                switch(sensors_dif){
                    case 0:
                    case -1:
                    case -2:
                        this.rotate_left()
                        break
                    case 1:
                    case 2:
                        this.rotate_right()
                        break
                }
            }
        }else{
                if(this.sensors[this.internal_state.direction].state
                    && this.sensors[this.internal_state.direction].type === 'food'){
                    this.move_forward()
                    this.eat(this.sensors[this.internal_state.direction].pos, food)
                }else if(this.sensors[this.calcSensorPos(this.internal_state.direction, -1)].state
                    && this.sensors[this.calcSensorPos(this.internal_state.direction, -1)].type === 'food'){
                    this.rotate_left()
                }else if(this.sensors[this.calcSensorPos(this.internal_state.direction, 1)].state
                    && this.sensors[this.calcSensorPos(this.internal_state.direction, 1)].type === 'food'){
                    this.rotate_right()
                }else if(this.sensors[this.calcSensorPos(this.internal_state.direction, -2)].state
                    && this.sensors[this.calcSensorPos(this.internal_state.direction, -2)].type === 'food'){
                    this.rotate_left()
                }else if(this.sensors[this.calcSensorPos(this.internal_state.direction, 2)].state
                    && this.sensors[this.calcSensorPos(this.internal_state.direction, 2)].type === 'food'){
                    this.rotate_right()
                }else if(this.sensors[this.calcSensorPos(this.internal_state.direction, -3)].state
                    && this.sensors[this.calcSensorPos(this.internal_state.direction, -3)].type === 'food'){
                    this.rotate_left()
                }else if(this.sensors[this.calcSensorPos(this.internal_state.direction, 3)].state
                    && this.sensors[this.calcSensorPos(this.internal_state.direction, 3)].type === 'food'){
                    this.rotate_right()
                }else if(this.sensors[this.calcSensorPos(this.internal_state.direction, 4)].state
                    && this.sensors[this.calcSensorPos(this.internal_state.direction, 4)].type === 'food'){
                    if(this.internal_state.last_action === 'rl')
                        this.rotate_left()
                    else
                        this.rotate_right()
                }else{
                    console.log("SENSORS => ",(this.sensors[this.internal_state.direction].state
                            && this.sensors[this.internal_state.direction].type === 'food'),
                        (this.sensors[this.calcSensorPos(this.internal_state.direction, -1)].state
                            && this.sensors[this.calcSensorPos(this.internal_state.direction, -1)].type === 'food'),
                        (this.sensors[this.calcSensorPos(this.internal_state.direction, 1)].state
                            && this.sensors[this.calcSensorPos(this.internal_state.direction, 1)].type === 'food'),
                        (this.sensors[this.calcSensorPos(this.internal_state.direction, -2)].state
                            && this.sensors[this.calcSensorPos(this.internal_state.direction, -2)].type === 'food'),
                        (this.sensors[this.calcSensorPos(this.internal_state.direction, 2)].state
                            && this.sensors[this.calcSensorPos(this.internal_state.direction, 2)].type === 'food'),
                        (this.sensors[this.calcSensorPos(this.internal_state.direction, -3)].state
                            && this.sensors[this.calcSensorPos(this.internal_state.direction, -3)].type === 'food'),
                        (this.sensors[this.calcSensorPos(this.internal_state.direction, 3)].state
                            && this.sensors[this.calcSensorPos(this.internal_state.direction, 3)].type === 'food'),
                        (this.sensors[this.calcSensorPos(this.internal_state.direction, 4)].state
                            && this.sensors[this.calcSensorPos(this.internal_state.direction, 4)].type === 'food')
                        
                    )
                    if(this.internal_state.n_steps_after_last_food < this.max_n_steps){
                        this.move_forward()
                    }else{
                        if(this.sensors[this.calcSensorPos(this.internal_state.direction, 2)].state){
                            this.rotate_left()
                        }else if(this.sensors[this.calcSensorPos(this.internal_state.direction, -2)].state){
                            this.rotate_right()
                        }else{
                            this.rotate_left()
                        }
                        this.internal_state.n_steps_after_last_food = 0
                    }
                }
        }
    }

    rotate_left(){
        if(this.angle === -180)
            this.angle = 180

        if(this.angle === -135)
            this.angle = 180
        else
            this.angle -= 45

        if(this.internal_state.direction === 0)
            this.internal_state.direction = 7
        else this.internal_state.direction--

        this.energy--
        this.internal_state.last_action = 'rl'
        this.max_n_steps = Math.round(Math.random() * (30-6))+6
    }

    rotate_right(){
        if(this.angle === 180)
            this.angle = -180

        if(this.angle === 135)
            this.angle = -180
        else
            this.angle += 45

        if(this.internal_state.direction === 7)
            this.internal_state.direction = 0
        else this.internal_state.direction++

        this.energy--
        this.internal_state.last_action = 'rr'
        this.max_n_steps = Math.round(Math.random() * (30-6))+6
    }

    move_forward(){
        switch(this.angle){
            case 0:
                this.y--
                break
            case 45:
                this.y--
                this.x++
                break
            case -45:
                this.y--
                this.x--
                break
            case 90:
                this.x++
                break
            case -90:
                this.x--
                break
            case 135:
                this.y++
                this.x++
                break
            case -135:
                this.y++
                this.x--
                break
            case -180:
            case 180:
                this.y++
                break
        }

        this.energy--
        this.internal_state.n_steps_after_last_food++
        this.internal_state.last_action = 'mf'
    }

    eat(pos, food){
        let b = food.length
        food.splice(pos, 1)
        this.energy++
        this.internal_state.n_steps_after_last_food = 0
        console.log("EATEN ", b, food.length)
    }

    calcSensorPos(pos, offset){
        if(Math.abs(offset) > pos && pos+offset < 0 && offset < 0)
            return 8+(pos+offset)
        else if(pos+offset > 7 && pos-offset >= 0)
            return (pos+offset)-8
        else return pos+offset
    }


    sensorDisplay(){
        this.getSensorColor(0)
        rect(590, 100, 20, 20)
        this.getSensorColor(1)
        rect(620, 100, 20, 20)
        this.getSensorColor(2)
        rect(650, 100, 20, 20)

        this.getSensorColor(7)
        rect(590, 130, 20, 20)
        this.getSensorColor(3)
        rect(650, 130, 20, 20)

        this.getSensorColor(6)
        rect(590, 160, 20, 20)
        this.getSensorColor(5)
        rect(620, 160, 20, 20)
        this.getSensorColor(4)
        rect(650, 160, 20, 20)
    }

    getSensorColor(sensor){
        if(this.sensors[sensor].state){
            if(this.sensors[sensor].type === 'food')
                fill(44, 143, 219)
            else if(this.sensors[sensor].type === 'wall')
                fill(132, 209, 69)
        }else
            fill(186, 49, 34)

    }

}