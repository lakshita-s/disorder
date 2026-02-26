class Letter {
  constructor(x, y) {
    this.alphabets = ["d","i","s","o","r","d","e","r"];
    this.letter = random(this.alphabets);
    this.x = x;
    this.y = y;
    this.homeX = x;
    this.homeY = y;
    this.angle = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.spin = 0;
    this.col = color(255);
    this.size = 85;
    this.baseSize = 85;
    this.hitWall = false;
    this.wallHitCount = 0;
  }

  // push letter away from mouse position, calculate direction from mouse to letter, apply small force
  repel(mx, my) {
    let dx = this.x - mx;
    let dy = this.y - my;
    let force = 5;
    this.speedX += dx * force * 0.05;
    this.speedY += dy * force * 0.05;
  }

  // pulse = letter stays at home position, size grows with volume
  pulse(vol) {
    this.size = this.baseSize + vol * 250;
    this.x = this.homeX;
    this.y = this.homeY;
  }

  update() {
    // move by velocity
    this.x += this.speedX;
    this.y += this.speedY;

    //rotate by spin amount
    this.angle += this.spin;

    //bounce off walls (flips vertical and horizontal speed)
    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
      this.onHitWall();
    }
    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
      this.onHitWall();
    }
  }

  onHitWall() {
    this.wallHitCount++;
    // only trigger effects on the third wall hit
    if (this.wallHitCount === 3) {
      this.hitWall = true;
    //   this.col = color(random(100, 255), random(100, 255), random(100, 255));
    // this.col = color(random(255), random(255), random(255));
    // pick from a set of punchy colors:
// let palette = [
//   color(255, 0, 100),   // hot pink
//   color(0, 255, 180),   // cyan green
//   color(255, 200, 0),   // electric yellow
//   color(100, 0, 255),   // deep purple
//   color(255, 80, 0),    // orange
//   color(0, 200, 255),   // sky blue
// ];
// this.col = random(palette);

colorMode(HSB, 360, 100, 100);
this.col = color(random(360), 90, 100);

      this.spin = random(-5, 5);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    textFont(font);
    textSize(this.size);
    textAlign(CENTER, CENTER);
    fill(this.col);
    noStroke();
    text(this.letter, 0, 0);
    pop();
  }
}