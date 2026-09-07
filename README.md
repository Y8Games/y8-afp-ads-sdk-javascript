# Y8 SDK (JavaScript)

Official JavaScript SDK for integrating Y8 AFP Ads into HTML5 and web games.

## Quick Links

- Example Project → `examples/basic-demo/`
- Full Documentation → [docs.y8.com](https://docs.y8.com/)
- Getting Started → [docs.y8.com/sdk/intro](https://docs.y8.com/sdk/intro/)
- PDF Guide → [readme.pdf](https://storage.y8.com/gintaras/html5/cmp_sdk_game/readme.pdf?v=2-11-0)

## Setup Ads

**Add Script**
```html
<head>
    <script src="https://cdn.y8.com/minimal-sdk/2-0/y8.min.js" async></script>
</head>
```

**Initialize SDK**
```javascript
	let y8Sdk = null;
	window.addEventListener("y8sdk.ready", function () {
        y8Sdk = y8.sdk();

        let appConfig = {
            appId: "YOUR_APP_ID",
            autoLogin: true
        };

        let adConfig = {
            gameId: "249093",
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
```
**App ID Setup**

- Update your App ID in the line appId = 'YOUR_APP_ID';
- You can create or find your App ID by registering a new application here: https://account.y8.com/applications/

**Game ID Setup**

- You can get the Game ID from the Y8 team once your game is approved.
- gameId = '249093'; (Replace this with your assigned Game ID before going live)

## Authentication

**Log In**

```javascript
y8Sdk.login()
```
**Log Out**

```javascript
y8Sdk.logout();
```
**Get User**
```javascript
y8Sdk.getUser();
```
## Ads

**Interstitial Ad**
```javascript
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
```
**Rewarded Ad**
```javascript
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
```
## Leaderboards

**Submit Score**
```javascript
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
```		
**Show Modal**
```javascript
	y8Sdk.showLeaderboard({
        table: "level_1",
        mode: "alltime",
        highest: true

    }).then(() => {
        console.log("Leaderboard closed");
        });
```
## Achievements

**Award Achievement**
```javascript
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
```	
**Show Modal**
```javascript
	y8Sdk.showAchievements()
        .then(() => {
            console.log("Achievements modal closed");
        });
```
## Analytics

**Track a Custom Event**
```javascript
	// The event happened once, with nothing to measure
	y8Sdk.trackCustomEvent("level_complete");

	// The event happened once and measured 48135
	y8Sdk.trackCustomEvent("shipment_collected", 48135);

	// The event happened 3 times
	y8Sdk.trackCustomEvent("enemy_defeated", null, 3);
```

**`value` is what you measured, `amount` is how many times it happened**

`amount` repeats the event into that many identical entries. It does not record
a number, so passing a measurement there multiplies your writes by whatever you
meant to record and stores nothing you can read back.

```javascript
	// WRONG - creates 48,135 identical entries and records no number
	y8Sdk.trackCustomEvent("shipment_collected", null, 48135);

	// RIGHT - creates one entry recording the number 48,135
	y8Sdk.trackCustomEvent("shipment_collected", 48135);
```

`amount` defaults to 1 and is capped at 100. Anything above the cap is recorded
as a single occurrence. Full details: [docs.y8.com/sdk/analytics](https://docs.y8.com/sdk/analytics/).

## Save / Load Data
```javascript
let gameState = {
    score: 1500,
    level: 3,
    coins: 200
};
```
**Save**
```javascript
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
```	
**Load**
```javascript
	y8Sdk.loadData({ key: "save" })
    .then((value) => {
        if (value) {
            gameState = JSON.parse(value);
            console.log("Loaded Data:", gameState);
        } else {
            console.log("No save data found");
        }
    })
    .catch((error) => {
        console.error("Failed to load:", error.message);
    });
```
## AppImage
**Submit Image**
```javascript
	let canvas = document.getElementById("previewCanvas");
	let picture = canvas.toDataURL("image/png");
	y8Sdk.submitImage({ picture })
        .then((url) => {
            console.log("Image posted:", url);
        })
        .catch((err) => {
            console.log("Error:", err);
        });
```
**Profile**
```javascript
	y8Sdk.openProfile();
```
## Locale
```javascript
	y8Sdk.getPlatformLocale()
        .then(console.log);
```
## Blacklist Check
```javascript
	y8Sdk.isBlacklisted()
        .then((blocked) => {
            console.log("Blocked:", blocked);
        });
```

## Full Documentation

This README covers the calls this example makes. The complete reference —
every option, the platform-specific guides, and the developer portal setup —
lives at:

👉 **[docs.y8.com](https://docs.y8.com/)**

The same material is kept as a PDF as well:
[Y8 SDK Documentation](https://storage.y8.com/gintaras/html5/cmp_sdk_game/readme.pdf?v=2-11-0).

Both are current. The site is updated first, so when the two disagree, follow
the site. The `?v=` on the PDF link is a cache-buster - the file is served with
a two-week `max-age`, so bump it whenever the PDF is replaced or readers keep
being handed the copy they already have.

---

This repository provides a simplified and developer-friendly version of the SDK usage.


