$(document).ready(function () {
    $('.footer-template').load("./html/footer.html");
});

// FB Login Initialization
window.fbAsyncInit = function () {
    console.log("fbAsyncInit");
    FB.init({
        appId: '954902444648707',
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

// Check FB Login State
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

// Toggle visibility of screen elements if logged in
function setElements(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('nav-dash').style.display = 'block';
        document.getElementById('nav-links').style.display = 'block';
        document.getElementById('nav-lists').style.display = 'block';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
        document.getElementById('heading').style.display = 'none';
    } else {
        document.getElementById('nav-dash').style.display = 'none';
        document.getElementById('nav-links').style.display = 'none';
        document.getElementById('nav-lists').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('fb-btn').style.display = 'block';
        document.getElementById('heading').style.display = 'block';
    }
}

// Logout application out of FB
function logout() {
    FB.logout(function (response) {
        buildLoginPrompt();
        setElements(false);
    });
}