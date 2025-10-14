let _appId = 'Add Your App ID Here';
let _gameId = '249093'; // Replace your game Id with this Number. This is the test ID.
var _testAds = true; // set to false when the game is ready for live.

let y8MinimalSdk = null;
let adsReadyMinimalSdk = false;
let adInFlight = false;
let pausedByAd = false;

window.initMinimalSdk = function () {
    if (window.y8 && typeof y8.sdk === 'function') {
        console.log("Y8 Minimal SDK initialized successfully.");
        y8MinimalSdk = y8.sdk()
        window.y8MinimalSdkReference = y8MinimalSdk;
        var appConfig = {
            appId: _appId, autoLogin: false
        }
        var adConfig = {
            gameId: _gameId,
            test: _testAds,
            preloadAdBreaks: 'on',
            sound: 'on',
            onReady: () => {
                adsReadyMinimalSdk = true;
                console.log('onReady for ADS (minimal SDK)')
            }
        }
        y8MinimalSdk.init(appConfig, adConfig)
    } else {
        console.error("Y8 Minimal SDK did not load as expected.");
    }
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.onload = initMinimalSdk;
    js.src = "https://account.y8.com/minimal-sdk/1-0/y8.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'minimal-y8-jssdk'));

function ensureReady() {
    if (!adsReadyMinimalSdk || !window.y8MinimalSdkReference || typeof window.y8MinimalSdkReference.showAd !== 'function') {
        console.warn("Y8 SDK not ready yet. Wait for onReady before showing ads.");
        return false;
    }
    return true;
}

function ensureNoAdsRequestAlready() {
    if (adInFlight) {
        console.warn("Ad request ignored: another ad is in flight.");
        return true;   // means "stop now"
    }
    return false;      // ok to proceed
}

function showGameAd(opts = {}) {
    const type = (opts.type === 'reward') ? 'reward' : 'interstitial';
    const name = opts.name || (type === 'reward' ? 'rewarded Ad' : 'interstitial Ad');

    if (!ensureReady())
        return;
    if (ensureNoAdsRequestAlready())
        return;

    adInFlight = true;
    pausedByAd = false;
    const pauseGameOnce = (from) => {
        pausedByAd = true;
        console.log("pauseGame() called from:", from);
        pauseGame();
    };

    let resumed = false;
    const resumeOnce = (from) => {
        if (resumed)
            return;
        resumed = true;
        adInFlight = false;
        console.log("resumeGame() called from:", from);
        if (pausedByAd)
        {
            pausedByAd = false;
            resumeGame();
        }
    };

    const beforeAd = () => {
        console.log(`beforeAd (minimalSDK) - ${type}`);
        pauseGameOnce("beforeAd");
    };

    const afterAd = () => {
        console.log(`afterAd (minimalSDK) - ${type}`);
        resumeOnce("afterAd");
    };

    const adBreakDone = (info) => {
        console.log(`adBreakDone (minimalSDK) - ${type}`);
        console.log(info);

        if (type === 'reward') {
            const status = info && info.breakStatus;
            if (status === "frequencyCapped" || status === "noAdPreloaded" || status === "other") {
                noRewardedAdsTryLater();
            }
        }
        // Fallback if afterAd didn't fire
        resumeOnce("adBreakDone");
    };

    // Reward-only hooks
    const beforeReward = (showAdFn) => {
        if (type !== 'reward')
            return;
        console.log("beforeReward (minimalSDK)");
        showAdFn();
    };

    const adDismissed = () => {
        if (type !== 'reward')
            return;
        console.log("adDismissed (minimalSDK)");
        rewardAdsCanceled();
    };

    const adViewed = () => {
        if (type !== 'reward')
            return;
        console.log("adViewed (minimalSDK)");
        rewardAdsCompleted();
    };

    // Build the payload conditionally
    const payload = {
        beforeAd,
        afterAd,
        adBreakDone
    };

    if (type === 'reward') {
        payload.type = 'reward';
        payload.name = name;
        payload.beforeReward = beforeReward;
        payload.adDismissed = adDismissed;
        payload.adViewed = adViewed;
    }

    window.y8MinimalSdkReference.showAd(payload)
            .catch((e) => {
                console.log(`showGameAd(${type}) - MINIMAL_SDK showAd error:`, e);
                if (type === 'reward')
                    noRewardedAdsTryLater();
                resumeOnce("catch");
            });
}

function nextAds()
{
    showGameAd({type: 'interstitial'});
}

function showReward()
{
    showGameAd({type: 'reward'});
}

function pauseGame()
{
    //Pause Game Code
    console.log("Pause Game");
}

function resumeGame()
{
    //Resume Game Code
    console.log("Resume Game");
}

function rewardAdsCompleted()
{
    console.log("rewardAdsCompleted");
    console.log("Function triggered when the ad is watched completely. Rewards should be given here.");
}

function noRewardedAdsTryLater()
{
    console.log("noRewardedAdsTryLater");
    console.log("No rewarded ad available right now. Ask user to try later.");
}

function rewardAdsCanceled()
{
    console.log("rewardAdsCanceled");
     console.log("User dismissed/canceled the ad before completion.");
}