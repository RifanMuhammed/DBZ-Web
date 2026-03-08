// 1. Setup Audio
const audio = new Audio("/thisisbeatkitchen-beatkitchen-i-will-fight-you-147-bpm-377762.mp3");
audio.loop = true;

// 2. Load saved states
const isPlaying = sessionStorage.getItem("musicPlaying") === "true";
const isMuted = sessionStorage.getItem("musicMuted") === "true";
const savedTime = sessionStorage.getItem("musicTime");

// 3. Update button icon and style
function updateButtonUI() {
    const btn = document.getElementById("mute-btn");
    const icon = document.getElementById("mute-icon");

    if (!btn || !icon) return;

    const shouldShowMuted = !sessionStorage.getItem("musicPlaying") || 
                           sessionStorage.getItem("musicMuted") === "true";

    if (shouldShowMuted) {
        icon.innerText = "🔇";
        btn.classList.add("muted");
    } else {
        icon.innerText = "🔊";
        btn.classList.remove("muted");
    }
}

// 4. Start music and handle volume fade
function startMusicFlow() {
    if (savedTime) audio.currentTime = parseFloat(savedTime);
    
    audio.volume = 0; 

    audio.play()
        .then(() => {
            if (sessionStorage.getItem("musicMuted") !== "true") {
                let fade = setInterval(() => {
                    if (audio.volume < 0.3) {
                        audio.volume = Math.min(0.3, audio.volume + 0.02);
                    } else {
                        clearInterval(fade);
                    }
                }, 50);
            }
            updateButtonUI();
        })
        .catch(() => console.log("User interaction needed to play audio"));
}

// 5. Mute toggle click handler
document.addEventListener("click", (event) => {
    const btn = event.target.closest("#mute-btn");

    if (btn) {
        if (audio.volume > 0) {
            audio.volume = 0;
            sessionStorage.setItem("musicMuted", "true");
        } else {
            audio.volume = 0.3;
            sessionStorage.setItem("musicMuted", "false");
        }
        updateButtonUI();
    }
});

// 6. Resume on load or wait for first click
if (isPlaying) {
    startMusicFlow();
} else {
    window.addEventListener("click", () => {
        sessionStorage.setItem("musicPlaying", "true");
        startMusicFlow();
    }, { once: true });
}

// 7. Save timestamp before leaving page
window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("musicTime", audio.currentTime);
});

// 8. Run UI sync on load
updateButtonUI();