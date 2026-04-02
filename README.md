# Y8 AFP Ads SDK (JavaScript)

Official JavaScript SDK for integrating Y8 AFP Ads into HTML5 and web games.

**Revenue Share Models**

Y8 offers two types of revenue share models:

- AFP (AdSense for Platforms) — You get paid directly by Google through your own AdSense account.

- Manual Revenue Share — You send Y8 invoices, and the payment is handled manually.

**To apply for AFP:**

- Create a Studio: https://www.y8.com/studios

- Once your studio is approved, you’ll be able to apply for AFP directly from your studio page.

**Setup Ads**

**Add Script**
<head>
    <script src="https://cdn.y8.com/minimal-sdk/2-0/y8.min.js" async></script>
</head>

**Initialize SDK**
let y8Sdk = null;

function initY8() {
    window.addEventListener("y8sdk.ready", function () {
        y8Sdk = y8.sdk();

        let appConfig = {
            appId: "YOUR_APP_ID",
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

window.onload = initY8;

**App ID Setup**

- Update your App ID in the line appId = 'YOUR_APP_ID';
- You can create or find your App ID by registering a new application here: https://account.y8.com/applications/

**Game ID Setup**

- You can get the Game ID from the Y8 team once your game is approved.
- gameId = '249093'; (Replace this with your assigned Game ID before going live)

**Authentication**
**Log In**
y8Sdk.login()
**Log Out**
y8Sdk.logout();
**Get User**
y8Sdk.getUser();

**Ads**
**Interstitial Ad**
	y8Sdk.showAd({
        type: "start",
        name: "start-game",
        beforeAd: () => console.log("beforeAd"),
        afterAd: () => console.log("afterAd"),
        beforeReward: (showAdFn) => showAdFn(),
        adDismissed: () => console.log("adDismissed"),
        adViewed: () => console.log("adViewed"),
        adBreakDone: (info) => console.log("adBreakDone", info)

    }).catch((e) => console.log("Ad error", e));

**Rewarded Ad**
	y8Sdk.showAd({
        type: "reward",
        name: "reward-ad",
        beforeReward: function (showAdFn) {
            console.log("Reward ad starting");
            showAdFn();
        },
        adViewed: function () {
            console.log("Reward completed");
			//Give reward to player
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

**Leaderboards**
**Submit Score**
	y8Sdk.saveLeaderboardScore({
        table: "Leaderboard",
        points: gameState.score,
        allowDuplicates: false,
        highest: true
    }).then(() => {
            console.log("Score saved");
        }).catch((error) => {
            console.log(error);
        });
		
**Show Modal**
	y8Sdk.showLeaderboard({
        table: "level_1",
        mode: "alltime",
        highest: true

    }).then(() => {
        console.log("Leaderboard closed");
        });

**Achievements**
**Award Achievement**
	y8Sdk.awardAchievement({
        achievement: "Achievment Name",   // must match dashboard EXACTLY
        achievementKey: "Achievment Key",   // must match dashboard key
        overwrite: false,
        allowDuplicates: false
    })
    .then(() => {
        console.log("Achievement awarded");
    })
    .catch((error) => {
        console.error("Failed to award achievement:", error.message);
    });
**Show Modal**
	y8Sdk.showAchievements()
        .then(() => {
            console.log("Achievements modal closed");
        });

**Save / Load Data**

let gameState = {
    score: 1500,
    level: 3,
    coins: 200
};
**Save**
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
**Load**
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

**Submit Image**
	let canvas = document.getElementById("previewCanvas");
	let picture = canvas.toDataURL("image/png");
	y8Sdk.submitImage({ picture })
        .then((url) => {
            console.log("Image posted:", url);
        })
        .catch((err) => {
            console.log("Error:", err);
        });

**Profile**
	y8Sdk.openProfile();

**Locale**
	y8Sdk.getPlatformLocale()
        .then(console.log);

**Blacklist Check**
	y8Sdk.isBlacklisted()
        .then((blocked) => {
            console.log("Blocked:", blocked);
        });
