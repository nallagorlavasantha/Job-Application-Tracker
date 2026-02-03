const addAJobBtn = document.getElementById("add-job-btn");
const formContainer = document.querySelector(".form-container");
const overlay = document.querySelector(".overlay");
addAJobBtn.addEventListener("click",()=>{
    console.log("form activated");
    // document.querySelector("body").style.opacity = 0.5;
    
    const overlay = document.querySelector(".overlay");
    overlay.classList.add("overlay-active");
    formContainer.classList.add("form-container-display");
})

//candel add a jon form
const cancelForm = document.getElementById("cancel-btn");
cancelForm.addEventListener("click",()=>{
    formContainer.classList.remove("form-container-display");
    overlay.classList.remove("overlay-active");
})

console.log(user);