const cancelLogin = document.getElementById("cancel-btn");
cancelLogin.addEventListener("click", () => {
  window.location.href = "/jobTracker";
});

const page = document.body.dataset.page;

//signup
console.log(page);
if (page == "signup") {
  const sinupAction = document.getElementById("signup");
  sinupAction.addEventListener("submit", (el) => {
    el.preventDefault();
    //check if passwords are matching
    let password = el.target.password.value;
    let confirmPassword = el.target.confirmPassword.value;
    if(password ==  confirmPassword){
        //then hit the server api
        console.log("matched");
    }else{
        //notify the user
        console.log("not matching");
        document.querySelector(".confirm-password-message").classList.add("confirm-password-message-active");
        setTimeout(()=>{
            document.querySelector(".confirm-password-message").classList.remove("confirm-password-message-active");
        },2000);
        el.target.confirmPassword.value = "";
        el.target.confirmPassword.focus();
    }
    
  });
}
