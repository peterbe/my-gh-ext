# <img src="public/icons/icon_48.png" width="45" align="left"> My GitHub Extensions

My GitHub Extension

## Features

- Expands the list of checks on a pull request to be as tall as it needs to be

- Injects buttons to press on a Dependabot PR to avoid having to copy-n-paste the
  commands that it suggests (e.g. `@dependabot rebase`)

- When looking at the Actions if there's more to show in the left-hand side
  bar, that "Show more workflows..." button is automatically clicked.

## Quick demo video

![Basic video demo](demo/my-gh-ext.mp4)

## Install (in Chrome)

1. First run `npm install && npm run build` (this should create the `./build` directory)
1. Go to [chrome://extensions](chrome://extensions)
1. Check the **Developer mode** checkbox
1. Click on the **Load unpacked extension** button
1. Select the folder `my-gh-ext/build`

## To develop (in Chrome)

Same steps as install but instead of `npm run build` use `npm run watch`.
Now, on [chrome://extensions](chrome://extensions) a refresh button should
appear for the extension. Press that any time you changed the code.
Then refresh the browser page.

## Contribution

Suggestions and pull requests are welcomed!.

---

This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)
