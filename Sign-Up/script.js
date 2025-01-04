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

    const particlecolor =[
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
    ]
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

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

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

const submit = document.getElementById('submit');
submit.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    window.location.href = "/Home-Screen/index.html"
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
});