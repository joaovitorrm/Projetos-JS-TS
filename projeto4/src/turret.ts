export default class Turret {

    private canvas : HTMLCanvasElement;
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    private type: string;
    private turret_sprites: {[key: string]: string} = {"default": "./images/tank.png"};
    private current_sprite : HTMLImageElement;

    private target: {id: number | null; x: number, y: number, width: number, height : number, radius: number} = {id: null, x: 0, y: 0, width: 0, height: 0, radius: 0};
    private hits : number = 0;

    private angle: number = 0;
    private shots : {x: number, y: number, angle: number, radius: number, color: string}[] = [];
    private shotSpeed : number = 20;
    private cooldown : number = 10;
    private maxCooldown : number = 20;
    private damage : number = 5;
    
    constructor (canvas: HTMLCanvasElement, x : number, y: number, width: number, height: number, type: string) {
        this.canvas = canvas;
        this.x = x;        
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;

        this.current_sprite = new Image();
        this.current_sprite.src = this.turret_sprites[type];
    }

    public draw(ctx : CanvasRenderingContext2D) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(this.current_sprite, 0, 32, 32, 32, this.x, this.y, this.width, this.height);

        this.shots.forEach(s => {
            ctx.beginPath();
            ctx.fillStyle = s.color;
            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        })

        ctx.save();
        ctx.translate(this.x + (this.width / 2), this.y + (this.height / 2));
        ctx.rotate(this.angle - (90*Math.PI/180));
        ctx.drawImage(this.current_sprite, 0, 0, 32, 32, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();

    }

    public update() {
        const newAngle = Math.atan2((this.y + (this.height / 2) - this.target.y), (this.x + (this.width / 2) - this.target.x));
        if (this.angle < newAngle + 0.02) {
            this.angle += 0.02;
        } else {
            this.angle -= 0.02;
        }
        

        if (this.target.id != null) {
            this.cooldown--;
            if (this.cooldown <= 0) {
                this.cooldown = this.maxCooldown;
                this.shots.push({x: this.x + this.width / 2, y: this.y + this.height / 2, angle: this.angle, radius: 10, color: "white"});
            }
        }

        this.hits = 0;
        this.shots.forEach(s => {
            s.x -= Math.cos(s.angle) * this.shotSpeed;
            s.y -= Math.sin(s.angle) * this.shotSpeed;
        
            if (s.x > this.canvas.width || s.x < 0 || s.y > this.canvas.height || s.y < 0) {
                this.shots.splice(this.shots.indexOf(s), 1);
            };

            if (this.target.radius > 0) {                
                if (this.checkShotSphereCollision({x: s.x, y: s.y, radius: s.radius}, this.target)) {
                    this.shots.splice(this.shots.indexOf(s), 1);
                    this.hits++;
                }
            }

        })

    }

    public setTarget(id: number, x: number, y: number) {
        this.target.id = id;
        this.target.x = x;
        this.target.y = y;
    }

    public setSphereTarget(id: number, x: number, y: number, radius: number) {
        this.target.id = id;
        this.target.x = x;
        this.target.y = y;
        this.target.radius = radius;
    }

    public setRectTarget(id: number, x: number, y: number, width: number, height: number) {
        this.target.id = id;
        this.target.x = x;
        this.target.y = y;
        this.target.width = width;
        this.target.height = height;
    }

    public clearTarget() {
        this.target.id = null;
        this.target.radius = 0;
        this.target.width = 0;
        this.target.height = 0;
    }

    private checkShotSphereCollision(p1 : {x : number, y: number, radius: number}, p2 : {x : number, y: number, radius: number}) : boolean  {
        if (Math.hypot(p1.x - p2.x, p1.y - p2.y) <= p1.radius + p2.radius) {
            return true;
        }
        return false;
    }

    public getHits() : number {
        return this.hits;
    }

    public getDamage() : number {
        return this.damage;
    }

    public getTargetId() : number | null {
        return this.target.id;
    }

}