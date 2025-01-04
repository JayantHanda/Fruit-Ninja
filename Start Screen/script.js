var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

function Circle(x, y, dx, dy, r) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;

    particlecolor = [
        "#007f5f",
        "#2b9348",
        "#55a630",
        "#80b918",
        "#aacc00",
        "#bfd200",
        "#d4d700",
        "#dddf00",
        "#eeef20",
        "#ffff3f",
        "#004b23",
        "#006400",
        "#007200",
        "#008000",
        "#38b000",
        "#70e000",
        "#9ef01a",
        "#ccff33",
    ];

    var number = Math.floor(Math.random()*particlecolor.length);
    this.draw = function() {
        c.beginPath();
        c.fillStyle = particlecolor[number];
        c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
        c.fill(); 
    }

    this.update = function() {
        if (this.x+this.r > innerWidth || this.x-this.r < 0) {
            this.dx = -this.dx
        }
    
        if (this.y+this.r > innerHeight || this.y-this.r < 0) {
            this.dy = -this.dy
        }
    
        this.x += this.dx
        this.y += this.dy

        this.draw();
    }
}



var circlearray = [];

for ( var i = 0; i < 400; i++ ) {
    var r = Math.random()*4;
    var x = Math.random()*(innerWidth - r*2) + r;
    var y = Math.random()*(innerHeight -r*2) + r;
    var dx =(Math.random()-0.5);
    var dy =(Math.random()-0.5);
    circlearray.push(new Circle(x, y, dx, dy, r));
}

function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0,0,window.innerWidth,window.innerHeight);

    for (var i = 0; i < circlearray.length; i++) {
        circlearray[i].update();
    }

    // c.beginPath();
    // c.moveTo(innerWidth/2, innerHeight);
    // c.lineTo(innerWidth/2, 0);
    // c.stroke();
}

animate();

var buttonclick = document.getElementById('presstostart')

buttonclick.addEventListener("click",function(){
    window.location.href = '../Sign-Up/index.html';
})