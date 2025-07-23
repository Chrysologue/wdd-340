const togglePwd = document.querySelector("#showpwd");
const password = document.querySelector("#user-password");

togglePwd.addEventListener('click', () => {
    if(password.value !== "")
    {
        const type = password.getAttribute("type");
        if(type == "password"){
            password.setAttribute("type", "text");
            togglePwd.textContent = "Hide password"
        }
        else {
            password.setAttribute("type", "password");
            togglePwd.textContent = "show password"
    }
    }
})
