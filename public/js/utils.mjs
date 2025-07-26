export function togglePasswordView(toggleButton, password) {
  toggleButton.addEventListener("click", () => {
    if (password.value !== "") {
      const type = password.getAttribute("type");
      if (type == "password") {
        password.setAttribute("type", "text");
        toggleButton.textContent = "Hide password";
      } else {
        password.setAttribute("type", "password");
        toggleButton.textContent = "show password";
      }
    }
  });
}

export function validatePassword(
  pwdLength,
  uppercase,
  digit,
  specialCase,
  list,
  password
) {
  password.addEventListener("input", () => {
    let value = password.value;
    if (value !== "") {
      if (value.length >= 12) {
        pwdLength.classList.remove("invalid");
        pwdLength.classList.add("valid");
      } else {
        pwdLength.classList.add("invalid");
        pwdLength.classList.remove("valid");
      }
      if (/[A-Z]/.test(value)) {
        uppercase.classList.remove("invalid");
        uppercase.classList.add("valid");
      } else {
        uppercase.classList.add("invalid");
        uppercase.classList.remove("valid");
      }
      if (/\d+/.test(value)) {
        digit.classList.remove("invalid");
        digit.classList.add("valid");
      } else {
        digit.classList.add("invalid");
        digit.classList.remove("valid");
      }
      if (/[^A-Za-z0-9]/.test(value)) {
        specialCase.classList.remove("invalid");
        specialCase.classList.add("valid");
      } else {
        specialCase.classList.add("invalid");
        specialCase.classList.remove("valid");
      }
    } else {
      list.forEach((li) => {
        li.classList.remove("valid");
        li.classList.add("invalid");
      });
    }
  });
}
