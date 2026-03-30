# gvibe

A landing page for all my public repository links, hosted on [GitHub Pages](https://galvinradleyngo.github.io/gvibe/).

## Adding or removing links

All links are stored in [`links.json`](links.json). Open that file and edit the `links` array:

```jsonc
{
  "title": "My Projects",
  "description": "A collection of my public repositories and links.",
  "links": [
    {
      "name":        "Display name shown on the card",
      "url":         "https://example.com",
      "description": "Optional short description shown beneath the name"
    }
  ]
}
```

* **Add** a link → append a new object to the `links` array.
* **Remove** a link → delete the corresponding object from the array.
* **Reorder** links → rearrange the objects; they are rendered in the order they appear.

Commit and push your changes. GitHub Pages will rebuild the site automatically.

## Enabling GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Under *Source*, select the branch (e.g. `main`) and folder (`/ (root)`).
3. Click **Save**. The site will be live at `https://<your-username>.github.io/gvibe/`.

## Local preview

Open `index.html` via a local HTTP server (required so that `fetch("links.json")` works):

```bash
# Python 3
python -m http.server 8080
# then open http://localhost:8080 in your browser
```