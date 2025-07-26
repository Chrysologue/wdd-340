import { togglePasswordView, validatePassword } from "./utils.mjs";

const toggleButton = document.querySelector("#showpwd");
const password = document.querySelector("#user-password");

togglePasswordView(toggleButton, password);

const pwdLength = document.querySelector(".length");
const uppercase = document.querySelector(".uppercase");
const digit = document.querySelector(".digit");
const specialCase = document.querySelector(".specialCase");
const list = document.querySelectorAll(".pwd-criteria ul li");

validatePassword(pwdLength, uppercase, digit, specialCase, list, password)