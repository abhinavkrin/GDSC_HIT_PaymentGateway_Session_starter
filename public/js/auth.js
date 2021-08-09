function onLoginSubmit(e){
    e.preventDefault();
    var email = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;
    firebase.auth().signInWithEmailAndPassword(email,password)
        .then(function(user){
            console.log(user);
        })
        .catch(function(err){
            console.error(err);
            alert("Login Failed: "+err.code)
        })
}
var onUserSignInCallback = null;
var onAuthStateChangeCallback = null;

function onUserSignIn(callback){
    onUserSignInCallback = callback;
}
function onAuthStateChange(callback){
    onAuthStateChangeCallback = callback;
}
function logout(e){
    e.preventDefault();
    firebase.auth().signOut().then(window.location.reload);
}
firebase.auth().onAuthStateChanged(function(user){
    if(onAuthStateChangeCallback)
        onAuthStateChangeCallback();
    if(user){
        //user logged in
        document.getElementById("app").style = "display: block;";
        document.getElementById("auth-container").innerHTML="";
        document.getElementById("logout-button").style ="display: inline-block;"
        if(onUserSignInCallback)
            onUserSignInCallback(user);
    } else {
        //user logged out
        document.getElementById("app").style="display: none;";
        document.getElementById("auth-container").innerHTML = `
        <div class="auth-form">
            <form onsubmit="onLoginSubmit(event);">
                <div class="form-control">
                    <input type="text" name="email" placeholder="email" id="login-email"/>
                </div>
                <div class="form-control">
                    <input type="password" name="password" placeholder="pamssword" id="login-password"/>
                </div>
                <div class="form-control">
                    <button type="submit">Lomg in</button>
                </div>
                <hr/>
                <div class="form-control" style="text-align: center">
                    <a href="/sign-up.html">
                        <strong>Creamte Account</strong>
                    </a>
                </div>
            </form>
        </div>
        `;
        document.getElementById("logout-button").style ="display: none;"
    }
})