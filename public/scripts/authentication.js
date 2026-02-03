const cancelLogin = document.getElementById("cancel-btn");
cancelLogin.addEventListener("click", () => {
  window.location.href = "/jobTracker";
});

const page = document.body.dataset.page;

//signup
if (page == "signup") {
  const sinupAction = document.getElementById("signup");
  sinupAction.addEventListener("submit", async (el) => {
    el.preventDefault();
    //check if passwords are matching
    let password = el.target.password.value;
    let confirmPassword = el.target.confirmPassword.value;
    if (password == confirmPassword) {
      //then hit the server api
      let userObject = {
        name: el.target.name.value,
        username: el.target.username.value,
        password: el.target.password.value,
      };
      try {
        const response = await fetch("/signup", {
          method: "POST",
          credentials:"include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(userObject),
        });
        if (!response.ok) {
          //server error
          throw new Error("HTTP error! status: " + response.status);
        }
        const result = await response.json();
       if(result.notify){
        //email already exists notify user try loggin in
       }
       else if(result.redirect){
        //redirect the page successfully signed in
        window.location.href = result.redirect;
       }
      } catch (err) {
        console.log(err);
      }
    } else {
      //notify the user that passwords don't match
      document
        .querySelector(".confirm-password-message")
        .classList.add("confirm-password-message-active");
      setTimeout(() => {
        document
          .querySelector(".confirm-password-message")
          .classList.remove("confirm-password-message-active");
      }, 2000);
      el.target.confirmPassword.value = "";
      el.target.confirmPassword.focus();
    }
  });
}
else if(page =="login"){
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit",async (el)=>{
    el.preventDefault();
    let obj = {
      username: el.target.username.value,
      password: el.target.password.value
    }
    try{
       const result = await fetch("/login",{
      method:"POST",
      headers:{
        "content-type": "application/json"
      },
      body: JSON.stringify(obj)
    });
    if(!result.ok){
      throw new Error("Http error! status: "+result.status);
    }
    const notify = await result.json();
    console.log(notify);
    if(notify.message){
      if(notify.message == "login success"){
        window.location.href = "/jobTracker"
      }
      else if(notify.message == "incorrect password" || "invalid email"){
        let message = notify.message;
        document.querySelector(".login-message").textContent = message;
        document.querySelector(".login-message").classList.add("login-message-active");
      }
    }
    }catch(err){
      console.log(err);
    }
   
  });
}
