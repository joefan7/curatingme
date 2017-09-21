$(document).ready(function () {
    $('.footer-template').load("./html/footer.html");
    console.log("Local Storage _id:", localStorage._id);

    var renderLinks = function () {
        $('#links-list').empty();
        for (var i = 0; i < linkList.length; i++) {
            $('#links-list').append
                (`
                <div class="checkbox">
                    <label>
                        <input type="checkbox" name="links[]" value="${linkList[i].linkName} - ${linkList[i].linkUrl}">${linkList[i].linkName} - ${linkList[i].linkUrl}
                    </label>
                </div>
            `);
        }
    };
    var renderLists = function () {
        console.log("listList: ", listList);
        // clear out lists-list and lists-list-links
        $('#lists-list').empty();
        $('#lists-list-links').empty();
        $('input:checkbox').removeAttr('checked');    
        for (var i = 0; i < listList.length; i++) {
            $('#lists-list').append
                (`
                <li id="${listList[i]._id}" class="list">
                <button btn-list-number="${listList[i]._id}" class="listButton">Delete</button>
                ${listList[i]['listName']}
                <br>
                ${listList[i]['listLinks']}
                <br>
                </li>
                `);
        }
    };

    var getFreshData = function () {
        // get list of links for check box group
        $.get('/list/linkList', function (linkData) {
            linkList = linkData;
            renderLinks();
        });
        // get list of lists and lookup links from link collection
        $.get('/listList', function (listData) {
            listList = listData;
            renderLists();
        });
    };

    // collapse nav bar when selection made
    $('.navbar-nav>li>a').on('click', function () {
        $('.navbar-collapse').collapse('hide');
    });

    var linkList = [];
    var listList = [];
    var checkedArr = [];
    getFreshData();

    $('body').on('click', '.listButton', function (event) {
        event.stopPropagation();
        event.preventDefault();
        var btnListNumber = $(event.target).attr('btn-list-number');
        var btnItem = document.getElementById(btnListNumber);
        console.log("Button Clicked", btnListNumber, btnItem);
        $.post('/listList/delete', $(this).serialize() + '_id=' + btnListNumber, function (listData) {
            getFreshData();
        });
    });

    $('#manage-lists-section').on('submit', function (event) {
        event.preventDefault();
        $('input[type=checkbox]:checked').each(function () {
            checkedArr.push($(this).val());
        });
        if (checkedArr.length === 0) {
            alert("You must check at least one link.")
        } else {
            console.log("Checked items array", checkedArr);
            console.log("objId of user", localStorage._id);
            console.log("List name", $('#listName').val());
            $.post('/listList', {
                objId: localStorage._id,
                listName: $('#listName').val(),
                listLinks: checkedArr.join()
            });
            document.getElementById('listName').value = '';
            checkedArr = [];
            getFreshData();
        };
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
        setElements(true);
        // statusChangeCallback(response);
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
        document.getElementById('manage-lists-section').style.display = 'block';
        document.getElementById('nav-dash').style.display = 'block';
        document.getElementById('nav-links').style.display = 'block';
        document.getElementById('nav-lists').style.display = 'block';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
    } else {
        document.getElementById('manage-lists-section').style.display = 'none';
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
        setTimeout(window.location.href = "https://curatingme.com", 5000);
    });
}

// onclick event is assigned to the #button element.
document.getElementById("logout").onclick = function () {
    logout();
};