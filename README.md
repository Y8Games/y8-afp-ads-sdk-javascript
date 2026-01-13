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

Download the gameBreakBeta.js file from this repository and place it in your project folder.
Then, Add the following line to your index.html file:
<script src="gameBreakBeta.js"></script>

**App ID Setup**

Update your App ID in the line let _appId = 'YOUR_APP_ID';
You can create or find your App ID by registering a new application here: https://account.y8.com/applications/

**Game ID Setup**

- You can get the Game ID from the Y8 team once your game is approved.

- In your main.js file, replace the placeholder Game ID with your assigned one:

- let _gameId = '249093'; (Replace this with your assigned Game ID before going live)

**Display Ads**
- nextAds(); - Show interstitial ads
- showReward(); - Show Rewarded Ads
- pauseGame(); - Pause the game
- resumeGame(); - Resume the game
- rewardAdsCompleted(); - Trigger rewards after completing an ad
- noRewardedAdsTryLater(); - Call if no rewarded ads are available
- rewardAdsCanceled(); - Trigger if the user cancels the rewarded ad

**Testing**
- var testAdsOn = true; (Set _testAds to false when the game is ready to go live)

**Example**

- Call nextAds() when you want to display ads, such as between game stages.

- Remember to pause the game (including sounds) by using pauseGame() before displaying ads, and use resumeGame() to continue gameplay afterward.
