// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { initializeFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5VxGQ0ALUQ_iEJpMaKHSRFGAZzFlUZGg",
  authDomain: "fruit-ninja-woc.firebaseapp.com",
  projectId: "fruit-ninja-woc",
  storageBucket: "fruit-ninja-woc.firebasestorage.app",
  messagingSenderId: "270078288967",
  appId: "1:270078288967:web:f0846dd8a3e57960abfd62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });

var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

var gravity = 0.3; // Previous value 0.1

var score = 0;

var lives = 3;

var sliceaudio = new Audio("sound/source_sound_splatter.mp3")
var spawnaudio = new Audio("sound/source_sound_throw.mp3")
var boomaudio = new Audio("sound/source_sound_boom.mp3")

var mousepress = false;

var mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("mousedown", function (event) {
    mousepress = true;
    canvas.style.cursor = "none";
});

window.addEventListener("mouseup", function (event) {
    mousepress = false;
    canvas.style.cursor = "auto";
})

var cursorimage = new Image();
cursorimage.src = "images/specialsword.png";

var fruitImages = [
    "images/apple.png",
    "images/orange.png",
    "images/watermelon.png",
    "images/strawberry.png",
    "images/peach.png"
];

var fruitradius = [
    50,
    50,
    100,
    40,
    30
]

function Fruit(x, y, dx, dy, r, image, number2, tophalf = true, whole = true) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.image = image;
    this.rotate = 0;
    this.screencheck = false;
    this.number2 = number2
    this.tophalf = tophalf;
    this.whole = whole;

    this.draw = function () {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotate);
        if (this.whole) {
            c.drawImage(this.image, -this.r, -this.r, this.r * 2, this.r * 2)
        } else if (this.tophalf) {
            c.drawImage(this.image, 0, 0, this.image.width, this.image.height/2, -this.r, -this.r, this.r * 2, this.r)
        } else {
            c.drawImage(this.image, 0, this.image.height/2,this.image.width, this.image.height/2, -this.r, -this.r, this.r * 2, this.r)
        }
        c.restore();
    };

    this.update = function () {
        this.dy += gravity;

        this.x += this.dx;
        this.y += this.dy;

        if (dx > 0) {
            this.rotate += 0.05;
        } else {
            this.rotate += -0.05;
        }
        
        var dist = Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2));

        if (dist <= this.r && mousepress === true && this.whole) {
            this.split();
            this.r = 0;
            this.whole = false;
            if (number2 === 0 || number2 === 1) {
                score += 4;
            } else if (number2 === 2) {
                score += 2;
            } else if (number2 === 3) {
                score += 6;
            } else if (number2 === 4) {
                score += 8;
            }
            sliceaudio.play();

        }

        if (this.r > 0) {
            this.draw();
        }

        if (this.y - this.r < window.innerHeight) {
            this.screencheck = true;
        }

        if (this.screencheck === true && (this.x - this.r > window.innerWidth || this.x + this.r < 0 || this.y - this.r > window.innerHeight || this.y + this.r < 0) && this.whole) {
            lives -= 1
            this.screencheck = false
        }
    };

    this.split = function() {
        const topHalf = new Fruit(this.x, this.y, this.dx - 1, this.dy - 2, this.r, this.image, this.number2, true, false);
        const bottomHalf = new Fruit(this.x, this.y, this.dx + 1, this.dy + 2, this.r, this.image, this.number2, false, false);
        fruitarray.push(topHalf, bottomHalf);
    }
}

function Bomb(x, y, dx, dy, r, image) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.image = image;
    this.rotate = 0;

    this.draw = function () {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotate);
        c.drawImage(this.image, -this.r, -this.r, this.r * 2, this.r * 2);
        c.restore();
    };

    this.update = function () {
        this.dy += gravity;

        this.x += this.dx;
        this.y += this.dy;

        this.rotate += 0.05;

        var dist = Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2));

        if (dist <= this.r && mousepress === true) {
            // boomaudio.play();
            lives = 0
        }

        if (this.r > 0) {
            this.draw();
        }
    };
}

var fruitarray = [];

function spawnFruit() {
    var number1 = (Math.floor(Math.random() * 3)) + 1; 
    for (var i = 0; i < number1; i++) {
        var number2 = Math.floor(Math.random() * fruitImages.length);
        var r = fruitradius[number2];
        var x = Math.random() * (innerWidth - r * 2) + r;
        var y = 1.1 * innerHeight;
        var dx;
        if (x > innerWidth / 2) {
            dx = -(Math.random() * 3 + 4);
        } else {
            dx = Math.random() * 3 + 4;
        }
        var dy = -(Math.random() * 2 + 20); 
        // Previous value: 20->8
        // var dy;
        // if ( y === 1.1 * innerHeight) {
        //     dy = -(Math.random() * 2 + 20);
        // }
        // if ( y === innerHeight * 0.6 ) {
        //     dy = Math.random()*5
        // }
        var image = new Image();
        image.src = fruitImages[number2];
        fruitarray.push(new Fruit(x, y, dx, dy, r, image, number2));
    }
}

function fruitFinal() {
    spawnFruit();
    spawnaudio.play()
}

setInterval(fruitFinal, 3000);


var bombarray = [];

function spawnBomb() { 
    for (var i = 0; i < 1; i++) {
        var number2 = Math.floor(Math.random() * fruitImages.length);
        var r = 80;
        var x = Math.random() * (innerWidth - r * 2) + r;
        var y = 1.1 * innerHeight;
        var dx;
        if (x > innerWidth / 2) {
            dx = -(Math.random() * 3 + 2);
        } else {
            dx = Math.random() * 3 + 2;
        }
        var dy = -(Math.random() * 2 + 20); 
        // Previous value: 20->8
        var image = new Image();
        image.src = "images/bomb.png";
        bombarray.push(new Bomb(x, y, dx, dy, r, image));
    }
}

function bombFinal() {
    spawnBomb();
    spawnaudio.play();
}

setInterval(bombFinal, 8000);

let emailPrefix = ""; 

auth.onAuthStateChanged((user) => {
    if (user) {
        const email = user.email;
        emailPrefix = email.split('@')[0];
        console.log(`Hello ${emailPrefix}`);
    } else {
        console.log("Error");
    }
});

let isUploaded = false;

async function uploadConstants() {
    if (emailPrefix) {
        const collectionRef = collection(db, "leaderboard");
        await addDoc(collectionRef, { emailPrefix, score });
        console.log("Document uploaded successfully");
    } else {
        console.error("Error");
    }
}

async function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = 0; i < fruitarray.length; i++) {
        if (fruitarray[i].r > 0) {
            fruitarray[i].update();
        } else {
            
            document.getElementById("score").innerHTML = score;
            fruitarray.splice(i, 1);
            i--;
        }
    }

    for (var i = 0; i < bombarray.length; i++) {
        bombarray[i].update();
    }

    document.getElementById("lives").innerHTML = lives;

    if ( mousepress === true) {
        c.drawImage(cursorimage, mouse.x - 25, mouse.y - 25, 50, 50)
    }

    if (lives === 2) {
        document.getElementById("lifegone3").style.display = "inline";
        document.getElementById("life3").style.display = "none";
    } else if (lives === 1) {
        document.getElementById("lifegone2").style.display = "inline";
        document.getElementById("life2").style.display = "none";
    } else if (lives === 0) {
        document.getElementById('loadingscreen').style.display = "inline";
        document.getElementById('loading').style.display = "inline";
        isUploaded = true;
        await uploadConstants();
        document.getElementById("lifegone1").style.display = "inline";
        document.getElementById("life1").style.display = "none";
        location.replace("../Game-Over/index.html");
    }
}

animate();