$(document).ready(function () {
    $('.footer-template').load("./html/footer.html");

    console.log("Session Storage _id:", sessionStorage._id);

    var render = function () {
        $('#manage-links-list').empty();
        for (var i = 0; i < linkList.length; i++) {
            $('#manage-links-list').append(`<li id="${linkList[i]._id}" class="link"><button btn-link-number="${linkList[i]._id}" class="linkButton">Delete</button> ${linkList[i]['linkName']}</li>`);
        }
    };

    var getFreshData = function () {
        $.get('/linkList', { userId: userId }, function (linkData) {
            linkList = linkData;
            render();
        });
    };

    // collapse nav bar when selection made
    $('.navbar-nav>li>a').on('click', function () {
        $('.navbar-collapse').collapse('hide');
    });

    var linkList = [];

    $('body').on('click', '.linkButton', function (event) {
        event.stopPropagation();
        event.preventDefault();
        var btnLinkNumber = $(event.target).attr('btn-link-number');
        var btnItem = document.getElementById(btnLinkNumber);
        console.log("Button Clicked", btnLinkNumber, btnItem);
        $.post('/linkList/delete', $(this).serialize() + '_id=' + btnLinkNumber, function (linkData) {
            getFreshData();
        });
    });

    $('#manage-links-section').on('submit', function (event) {
        $.post('/linkList', {
            objId: sessionStorage._id,
            linkName: $('#linkName').val(),
            linkUrl: $('#linkUrl').val()
        });
    });
});


var gUserId = '';
var gUserName = '';
var gUserEmail = '';
// Get User Information
var getUserInformation = function (userId) {
    $.get('/userInformation', { userId: userId }, function (dataFromServer) {
        buildProfileInput(dataFromServer);
    });
};

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
            console.log("RESPONSE", response);
            gUserName = response.name;
            gUserId = response.id;
            gUserEmail = response.email;
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
        setElements(false);
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
        uiEmail: $('#uiEmail').val()
    }, function (dataFromServer) {
        console.log("dataFromServer : ", dataFromServer)
        buildProfileInput(dataFromServer);
    })
    let userInputForm = `
          <form id="uiForm">
          <div class="form-group">
              <h2>New User Created</h2>
          </div>
          </form>
          `;
    document.getElementById('user-input-area').innerHTML = userInputForm;
    setElements(true);
    setTimeout(location.reload.bind(location), 2000);
});

// Build the Login Prompt
function buildLoginPrompt() {
    alert(`${gUserName}, you are now logged out.`);
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
        document.getElementById('manage-links-section').style.display = 'block';
        document.getElementById('nav-dash').style.display = 'block';
        document.getElementById('nav-links').style.display = 'block';
        document.getElementById('nav-lists').style.display = 'block';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
    } else {
        document.getElementById('manage-links-section').style.display = 'none';
        document.getElementById('nav-dash').style.display = 'none';
        document.getElementById('nav-links').style.display = 'none';
        document.getElementById('nav-lists').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('fb-btn').style.display = 'block';
    }
}

logout = function () {
    FB.logout(function (response) {
        buildLoginPrompt();
        setElements(false);
    });
}

// onclick event is assigned to the #button element.
document.getElementById("logout").onclick = function () {
    logout();
    window.location.href = "https://curatingme.com";
};