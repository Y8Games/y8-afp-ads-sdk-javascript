let y8Sdk = null;
let embeddedLB = null;
let userName = "Guest";
let embeddedAch = null;

let gameState = {
    score: 1500,
    level: 3,
    coins: 200
};


function initY8() {

    window.addEventListener("y8sdk.ready", function () {

        y8Sdk = y8.sdk();

        let appConfig = {
            appId: "5ea39283d559303d5320eef4",
            autoLogin: true
        };

        let adConfig = {
            gameId: "249093",
            test: true,
            preloadAdBreaks: "auto",
            sound: "on",
            onReady: () => console.log("Ads ready")
        };

        y8Sdk.init(appConfig, adConfig);

        y8Sdk.onAuth((user, error) => {

            if (error) {
                console.log("Auth error", error);
                return;
            }
            console.log("User", user);
            if (!user) {
                // 🔴 logout case
                userName = "Guest";
                document.getElementById("welcomeText").value = userName;
                console.log("User logged out");
                return;
            }
            userName = user.nickname || "Guest";
            document.getElementById("welcomeText").value = userName;
        });

    }, {once: true});

    if (window.y8 && window.y8.emitReadyEvent) {
        window.y8.emitReadyEvent();
    }

}



function login() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.login()
}


function logout() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.logout();
}


function getUser() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    let user = y8Sdk.getUser();

    console.log(user);

}


function reloadUser() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.reloadUser()
            .then((user) => {
                console.log("Reloaded user", user);
            })

            .catch((error) => {
                console.log(error);
            });

}



function getToken() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    let token = y8Sdk.getToken();

    console.log("Token:", token);

}



function refreshToken() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.refreshToken()

            .then((token) => {
                console.log("New token", token);
            })

            .catch((error) => {
                console.log(error);
            });

}



function showAd() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.showAd({

        type: "start",
        name: "start-game",

        beforeAd: () => console.log("beforeAd"),

        afterAd: () => console.log("afterAd"),

        beforeReward: (showAdFn) => showAdFn(),

        adDismissed: () => console.log("adDismissed"),

        adViewed: () => console.log("adViewed"),

        adBreakDone: (info) => console.log("adBreakDone", info)

    })

            .catch((e) => console.log("Ad error", e));

}

function showRewardAd() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }

    y8Sdk.showAd({

        type: "reward",
        name: "reward-ad",

        beforeReward: function (showAdFn) {
            console.log("Reward ad starting");
            showAdFn();
        },

        adViewed: function () {
            console.log("Reward completed");
            giveReward();
        },

        adDismissed: function () {
            console.log("Reward ad skipped");
        },

        adBreakDone: function (info) {

            console.log("Ad break finished", info);

        }

    }).catch(function (e) {

        console.log("Ad error:", e);

    });

}


function giveReward() {
    console.log("Give coins to player");
}



function getLeaderboards() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.getLeaderboards()
            .then((tables) => {

                console.log("Tables:", tables);

            })

            .catch((error) => {

                console.log("Error", error);

            });

}



function getScores() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.getLeaderboardScores({

        table: "level_1",
        page: 1,
        perPage: 10,
        mode: "alltime",
        highest: true

    })
        .then((scores) => {

            console.log("Scores", scores);

        })

        .catch((error) => {

            console.log(error);

        })

}



function saveScore() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.saveLeaderboardScore({

        table: "Leaderboard",
        points: gameState.score,
        allowDuplicates: false,
        highest: true

    })
        .then(() => {

            console.log("Score saved");

        })

        .catch((error) => {

            console.log(error);

        });

}



function showLeaderboard() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.showLeaderboard({

        table: "level_1",
        mode: "alltime",
        highest: true

    })
        .then(() => {

            console.log("Leaderboard closed");

        });

}



function embedLeaderboard() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    embeddedLB = y8Sdk.embedLeaderboard({

        target: "#leaderboard-panel",
        table: "level_1",
        mode: "alltime",
        highest: true

    });

}



function destroyLeaderboard() {

    if (embeddedLB) {
        embeddedLB.destroy();
    }

}

function getAchievements() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.getAchievements()
        .then((achievements) => {
            console.log("Achievements:", achievements);
        })
        .catch((error) => {
            console.error("Failed to load achievements:", error.message);
        });

}

function awardAchievement() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    
    let user = y8Sdk.getUser();

    if (!user) {
        console.log("User not logged in");
        return;
    }
    y8Sdk.awardAchievement({
        achievement: "Test",   // must match dashboard EXACTLY
        achievementKey: "4a0b8931b09968995429",   // must match dashboard key
        overwrite: false,
        allowDuplicates: false
    })
    .then(() => {
        console.log("Achievement awarded");
    })
    .catch((error) => {
        console.error("Failed to award achievement:", error.message);
    });

}

function showAchievements() {
    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    y8Sdk.showAchievements()
        .then(() => {
            console.log("Achievements modal closed");
        });

}

function embedAchievements() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    embeddedAch = y8Sdk.embedAchievements({
        target: "#achievements-panel"
    });

}

function destroyAchievements() {

    if (embeddedAch) {
        embeddedAch.destroy();
    }

}

function saveData() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    let user = y8Sdk.getUser();

    if (!user) {
        console.log("User not logged in");
        return;
    }
    y8Sdk.saveData({
        key: "save",
        value: JSON.stringify(gameState),
        retries: true
    })
    .then(() => {
        console.log("Data saved successfully");
    })
    .catch((error) => {
        console.error("Failed to save:", error.message);
    });

}

function loadData() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    let user = y8Sdk.getUser();

    if (!user) {
        console.log("User not logged in");
        return;
    }
    y8Sdk.loadData({ key: "save" })
    .then((value) => {

        if (value) {
            gameState = JSON.parse(value);
            console.log("Loaded Data:", gameState);

            updateUI(); // ✅ update UI after load
        } else {
            console.log("No save data found");
        }

    })
    .catch((error) => {
        console.error("Failed to load:", error.message);
    });

}

function removeData() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }
    let user = y8Sdk.getUser();

    if (!user) {
        console.log("User not logged in");
        return;
    }
    y8Sdk.removeData({ key: "save" })
    .then(() => {
        console.log("Data removed");
    })
    .catch((error) => {
        console.error("Failed to remove:", error.message);
    });

}

function updateUI() {
    document.getElementById("scoreText").innerText = gameState.score;
    document.getElementById("coinsText").innerText = gameState.coins;
}

function addScore() {
    gameState.score += 10;
    updateUI();
}

function addCoins() {
    gameState.coins += 5;
    updateUI();
}

function submitImage() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }

    let user = y8Sdk.getUser();
    if (!user) {
        console.log("Login required");
        return;
    }

    let canvas = document.getElementById("previewCanvas");
    let picture = canvas.toDataURL("image/png");

    y8Sdk.submitImage({ picture })
        .then((url) => {
            console.log("Image posted:", url);
        })
        .catch((err) => {
            console.log("Error:", err);
        });

}

function openProfile() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }

    let user = y8Sdk.getUser();

    if (!user) {
        console.log("User not logged in");
        return;
    }

    y8Sdk.openProfile()
        .then(() => {
            console.log("Profile opened");
        })
        .catch((error) => {
            console.error("Failed to open profile:", error);
        });

}

function randomizeCanvas() {

    let canvas = document.getElementById("previewCanvas");
    let ctx = canvas.getContext("2d");

    // Gradient background
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, getRandomColor());
    gradient.addColorStop(1, getRandomColor());

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw random circles
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 80 + 30,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = getRandomColor();
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

function getLocale() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }

    y8Sdk.getPlatformLocale()
        .then((locale) => {

            console.log("Platform locale:", locale);

            document.getElementById("localeText").innerText = locale;

        })
        .catch((error) => {
            console.error("Failed:", error.message);
        });

}


function checkBlacklist() {

    if (!y8Sdk) {
        console.log("SDK not ready");
        return;
    }

    y8Sdk.isBlacklisted()
        .then((blacklisted) => {

            console.log("Blacklisted:", blacklisted);

            let text = blacklisted ? "Blocked ❌" : "Safe ✅";

            document.getElementById("blacklistText").innerText = text;

            if (blacklisted) {
                alert("This domain is not allowed. Please play on Y8.");
            }

        })
        .catch((error) => {
            console.error("Failed:", error.message);
        });

}