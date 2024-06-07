/*----------------------------------------

    Project Name
    
    CSS INDEX
    ===================
    00. Variables
    01. Pseudo code
    02. Events
    03. Functions
    04. 
    05. 
    06. 
    07. 
    08. 
    09. 
    10. 
    11. 

----------------------------------------*/

/*----------------------------------------
  00. Variables
----------------------------------------*/
const bookmarksContainer = document.querySelector("#bookmarksContainer");
const form = document.querySelector("form");
const siteNameInput = document.getElementById("siteName");
const siteURLInput = document.getElementById("siteURL");
const bothInputs = document.querySelectorAll("input");

const submitBtn = document.querySelector(".submit-btn");

const errorLayout = document.querySelector(".invalid-input-layer");
const errorTitle = document.querySelector("#errorTitle");
const closeErrorBtn = document.querySelector(".close-btn");
const errorList = document.querySelector("#errorList");

const siteNameRegex = /^[a-zA-Z0-9_ ]{3,}$/;
const siteURLRegex =
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/[^\s]*)?$/;

const bookmarksList = JSON.parse(localStorage.getItem("bookmarksList")) || [];
updateUIList();

/*----------------------------------------
  01. Pseudo code
----------------------------------------*/

/**
 * User clicks "submit" to add a bookmark
 * submit click listener checks for valid inputs
 * if not valid ==> report the error
 * if   valid   ==> add a new row
 */

/*----------------------------------------
  02. Events
----------------------------------------*/

form.addEventListener("submit", (e) => e.preventDefault());

submitBtn.addEventListener("click", handleSubmit);

closeErrorBtn.addEventListener("click", hideErrorLayout);
errorLayout.addEventListener("click", (e) => {
  // if (e.target == errorLayout) hideErrorLayout();
  e.target == errorLayout && hideErrorLayout();
});

bothInputs.forEach((el) =>
  el.addEventListener("input", (e) => liveValidation(e))
);

bookmarksContainer.addEventListener(
  "click",
  (e) => e.target.classList.contains("delete-btn") && deleteBookmark(e)
);

/*----------------------------------------
  03. Functions
----------------------------------------*/

function deleteBookmark(e) {
  const deletingIndex = e.target.dataset.bookmarkId;
  bookmarksList.splice(deletingIndex, 1);
  updateLocalStorage();
  updateUIList();
}

function isValidName(input) {
  return siteNameRegex.test(input.trim());
}
function isValidURL(input) {
  return siteURLRegex.test(input.trim());
}

function clearValidationClasses(target) {
  target.classList.remove("is-valid", "is-invalid");
}

function hideErrorLayout() {
  errorLayout.classList.replace("d-flex", "d-none");
}

function liveValidation(e) {
  const input = e.target;

  if (input == siteNameInput) {
    clearValidationClasses(siteNameInput);
    isValidName(input.value)
      ? siteNameInput.classList.add("is-valid")
      : siteNameInput.classList.add("is-invalid");
  } else if (input == siteURLInput) {
    clearValidationClasses(siteURLInput);
    isValidURL(input.value)
      ? siteURLInput.classList.add("is-valid")
      : siteURLInput.classList.add("is-invalid");
  } else console.error("None of the inputs is the target!");
}

function handleSubmit() {
  // ! Validation
  errorList.innerHTML = "";
  if (!isValidName(siteNameInput.value)) {
    const input = siteNameInput.value.trim();
    reportError("Site Name");

    input[0] == " " &&
      generateErrorMessage("The name can't start with a space character.");

    input.length < 3 &&
      generateErrorMessage("The name must be at least 3 characters.");

    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(input) &&
      generateErrorMessage("The name can't contain any special characters.");

    return;
  } else if (!isValidURL(siteURLInput.value)) {
    reportError("Site URL");
    generateErrorMessage("The URL must be a valid URL.");
    return;
  }

  // ! If values are valid
  const newBookmark = {
    websiteName: siteNameInput.value,
    websiteURL: siteURLInput.value,
  };
  bookmarksList.push(newBookmark);
  updateLocalStorage();
  updateUIList();
  emptyInputs();
  clearValidationClasses(siteNameInput);
  clearValidationClasses(siteURLInput);
}

function emptyInputs() {
  (siteNameInput.value = ""), (siteURLInput.value = "");
}

function updateUIList() {
  bookmarksContainer.innerHTML = "";
  bookmarksList.forEach((bookmark) => {
    bookmarksContainer.innerHTML += generateNewBookmarkRow(bookmark);
  });
}

function generateNewBookmarkRow(bookmark) {
  const bookmarkIndex = bookmarksList.indexOf(bookmark);
  return `<div class="row align-items-center">
          <div class="col-3 col-lg-2">
            <div class="inner">${bookmarkIndex + 1}</div>
          </div>
          <div class="col-3 col-lg-6">
            <div class="inner name-width">${bookmark.websiteName}</div>
          </div>
          <div class="col-3 col-lg-2">
            <div class="inner">
              <button class="btn visit-btn" onclick="window.open('${
                bookmark.websiteURL
              }','_blank')"  >
                <i class="fa-solid fa-eye"></i> Visit
              </button>
            </div>
          </div>
          <div class="col-3 col-lg-2">
            <div class="inner">
              <button class="btn delete-btn" data-bookmark-id=${bookmarkIndex}  >
                <i class="fa-solid fa-trash-can"></i> Delete
              </button>
            </div>
          </div>
        </div>`;
}

function updateLocalStorage() {
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
}

// ! Report Error
function reportError(input) {
  errorLayout.classList.replace("d-none", "d-flex");
  errorTitle.textContent = `${input} is invalid for the following reasons:`;
}

// ! Generate error message
function generateErrorMessage(msg) {
  const errorListItem = `<li>
              <i class="fa-regular fa-circle-right"></i>
              <span>${msg}</span>
            </li>`;
  errorList.innerHTML += errorListItem;
}

// !!! Extraaa !!!
// async function isValidURL(input) {
// try {
//   const response = await fetch(input, { method: "HEAD" });
//   return response.ok;
// } catch (error) {
//   console.error("Error validating URL:", error);
//   reportError("Invalid URL", error);
//   return false;
// }
// }
