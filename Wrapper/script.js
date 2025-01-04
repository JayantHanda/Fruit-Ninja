const audio = new Audio("sound/source_sound_menu.mp3");
audio.loop = true;

const audiotoggle = document.getElementById("checkboxInput");
audiotoggle.addEventListener("change",function () {
    if (audiotoggle.checked) {
        audio.play();
    } else {
        audio.pause();
    }
})