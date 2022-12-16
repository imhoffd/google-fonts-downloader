# @imhoff/google-fonts-downloader

Download Google fonts by providing the URL. Useful if you want to host your
fonts on your own server.

This tool creates a directory with the downloaded fonts and then generates a
font face file for you in either CSS or
[Vanilla Extract](https://vanilla-extract.style) format.

## Usage

```
npx @imhoff/google-fonts-downloader --help
npx @imhoff/google-fonts-downloader <url> [options]
```

## Example

```
npx @imhoff/google-fonts-downloader \
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" \
  --output vanilla-extract \
  --url-prefix "/public/fonts/"
```
