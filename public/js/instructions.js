$(document).ready(function () {
    $('.footer-template').load("./html/footer.html");
});

// collapse nav bar when selection made
$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});


var gUserId = '';
var gUserName = '';
var gUserEmail = '';

// Get User Information
var getUserInformation = function (userId) {
    $.get('/userInformation', { userId: userId }, function (dataFromServer) {
        console.log("dataFromServer : ", dataFromServer);
        localStorage._id = dataFromServer._id;
        buildProfileInput(dataFromServer);
    })
}

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
        setElements(false);
    }
}
// Pull in UserName, UserId and Email from FB
function testAPI() {
    FB.api('/me?fields=name,email', function (response) {
        if (response && !response.error) {
            console.log("RESPONSE", response)
            gUserName = response.name
            gUserId = response.id
            gUserEmail = response.email
            getUserInformation(response.id);
        }
    })
}

function buildProfileInput(dataFromUserCall) {
    console.log("dataFromUserCall", dataFromUserCall.uiName)
    // if all data fields in dataFromUserCall are populated create a welcome message with links to activity and food entry pages
    if (
        (dataFromUserCall !== "") &&
        (dataFromUserCall.userId !== "") &&
        (dataFromUserCall.uiName !== "") &&
        (dataFromUserCall.uiEmail !== "")
    ) {
    } else {
        console.log("DATA FUC", dataFromUserCall)
        let userInputForm = `
  <form id="uiForm">
  <div class="form-group">
      <h2>Thank you for logging in, ${gUserName}.</h2>
      <input id="userId" class="form-control hidden" value="${gUserId}">
      <input id="uiName" class="form-control hidden" value="${gUserName}">
      <input id="uiEmail" class="form-control hidden" value="${gUserEmail}">
      <button type="submit" id="build" class="form-control btn btn-primary">
          Create New User
      </button>
  </div>
  </form>
  `;
        document.getElementById('user-input-area').innerHTML = userInputForm;
    }
}
$(document).on('click', '#build', function (evt) {
    evt.preventDefault();
    // Create User Information Doc
    $.post('/user_information/create', {
        userId: $('#userId').val(),
        uiName: $('#uiName').val(),
        uiEmail: $('#uiEmail').val(),
        uiBio: $('#uiBio').val()
    }, function (dataFromServer) {
        console.log("dataFromServer : ", dataFromServer)
        localStorage._id = dataFromServer._id;
        buildProfileInput(dataFromServer)
    })
    let userInputForm = `
      <form id="uiForm">
      <div class="form-group">
          <h2>New User Created</h2>
      </div>
      </form>
      `;
    document.getElementById('user-input-area').innerHTML = userInputForm;
    setTimeout(location.reload.bind(location), 2000);
});

// Build the Login Prompt
function buildLoginPrompt() {
    alert(`You are now logged out.`);
    window.location.href = "https://www.curatingme.com";
    location.reload();
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
logout = function () {
    FB.logout(function (response) {
        buildLoginPrompt();
        setElements(false);
        setTimeout(window.location.href = "https://curatingme.com",5000);
    });
}

// onclick event is assigned to the #button element.
document.getElementById("logout").onclick = function () {
    logout();
};