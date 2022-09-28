"use strict"

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
// const pageTitle = document.head.getElementsByTagName("title")[0].innerHTML;
// console.log(
//   `xPage title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
// );

const fixPullRequestChecksList = () => {
  const el = document.querySelector(
    ".branch-action-item.open>.merge-status-list"
  )
  if (el) {
    const countMergeItems = el.querySelectorAll(".merge-status-item").length
    if (countMergeItems > 6) {
      el.style.maxHeight = `${40 * countMergeItems}px`
    }
    return true
  }
}

const addButtonsToDependabotPRs = () => {
  if (document.querySelector('a.author[href="/apps/dependabot"]')) {
    // DEPENDABOT PR!
    const el = document.querySelector("div.edit-comment-hide")
    if (document.querySelector("#_comment_rebase")) return true
    if (el) {
      const b1 = document.createElement("button")
      b1.id = "_comment_rebase"
      b1.classList.add("btn")
      b1.textContent = "Comment: Rebase"
      b1.onclick = () => {
        const txt = document.querySelector("textarea#new_comment_field")
        if (txt) {
          txt.value = "@dependabot rebase"
          const b = document.querySelector(
            'form.js-new-comment-form button[type="submit"].btn-primary'
          )

          if (b) {
            b.disabled = false
            b.click()
            // setTimeout(() => {
            //   // After reload
            //   addButtonsToDependabotPRs();
            // }, 2000);
          }
        }
      }
      el.appendChild(b1)

      const b2 = document.createElement("button")
      b2.classList.add("btn")
      b2.textContent = "Comment: Squash and merge"
      b2.onclick = () => {
        const txt = document.querySelector("textarea#new_comment_field")
        if (txt) {
          txt.value = "@dependabot squash and merge"
          const b = document.querySelector(
            'form.js-new-comment-form button[type="submit"].btn-primary'
          )
          if (b) {
            b.disabled = false
            b.click()
          }
        }
      }
      el.appendChild(b2)

      return true
    }
  }
}

const showMoreWorkflows = (iterations = 0) => {
  const clickables = document.querySelectorAll("lazy-load-section li a")
  for (const clickable of [...clickables]) {
    let containsText = false

    const texts = clickable.querySelectorAll("span")
    for (const text of [...texts]) {
      if (
        text.textContent &&
        text.textContent.includes("Show more workflows")
      ) {
        containsText = true
        break
      }
    }

    if (containsText) {
      clickable.click()
      if (iterations < 6) {
        setTimeout(() => {
          showMoreWorkflows(iterations + 1)
        }, 500)
      }
      break
    }
  }
  // console.log("Can no longer find it. And that's fine.")
  return true
}

function waitForIt(
  cb,
  { interval = 500 + Math.random() * 10, maxAttempts = 5 } = {}
) {
  let attempts = 0
  const watch = setInterval(() => {
    if (cb() || attempts > maxAttempts) {
      clearInterval(watch)
    }
    attempts++
  }, interval)
}

function dbg(...args) {
  console.debug("my-gh-ext:", ...args)
}

;(function () {
  const { origin, pathname } = document.location

  let ghInterval

  if (origin === "https://github.com") {
    var previousState = window.history.state
    ghInterval = setInterval(function () {
      if (previousState !== window.history.state) {
        const { pathname } = document.location
        if (pathname.endsWith("/actions")) {
          dbg("Start showMoreWorkflows", pathname)
          waitForIt(showMoreWorkflows)
        } else if (/\/pull\/\d/.test(pathname)) {
          dbg("On a PR", pathname)
          dbg("Start fixPullRequestChecksList")
          waitForIt(fixPullRequestChecksList)
          dbg("Start addButtonsToDependabotPRs")
          waitForIt(addButtonsToDependabotPRs, {
            interval: 1000,
            maxAttempts: 3,
          })
        }
        previousState = window.history.state
      }
    }, 1000)
  }
})()

// // Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   response => {
//     console.log(response.message);
//   }
// );

// // Listen for message
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'COUNT') {
//     console.log(`Current count is ${request.payload.count}`);
//   }

//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });
