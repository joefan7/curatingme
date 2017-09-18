var gUserId = '';
var gUserName = '';
var gUserEmail = '';

// Get User Information
var getUserInformation = function (userId) {
    $.get('/userInformation', { userId: userId }, function (dataFromServer) {
        console.log("dataFromServer : ", dataFromServer)
        buildProfileInput(dataFromServer)
    })
}

// FB Login Initialization
window.fbAsyncInit = function () {
    console.log("fbAsyncInit");
    FB.init({
        appId: '1526244437434268',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
    FB.AppEvents.logPageView();
};
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Check status and run appropriate
function statusChangeCallback(response) {
    if (response.status === 'connected') {
        console.log('Logged in and authenticated', response.status);
        setElements(true);
        testAPI();
    } else {
        console.log('Not authenticated', response.status);
        buildLoginPrompt();
        setElements(false);
    }
}

// Pull in UserName, UserId and 
function testAPI() {
    FB.api('/me?fields=name,email', function (response) {
        if (response && !response.error) {
            console.log("RESPONSE", response)
            gUserName = response.name
            gUserId = response.id
            getUserInformation(response.id);
        }
    })
}

// Build the Login Prompt
function buildLoginPrompt() {
    let loginPrompt = `
    <h2>Please login...</h2>
  `;
    document.getElementById('user-input-area').innerHTML = loginPrompt;
}

// Check FB Login State
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

// Toggle visibility of screen elements if logged in
function setElements(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('logout').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
    } else {
        document.getElementById('logout').style.display = 'none';
        document.getElementById('fb-btn').style.display = 'block';
    }
}

// Logout application out of FB
function logout() {
    FB.logout(function (response) {
        buildLoginPrompt();
        setElements(false);
    });
}