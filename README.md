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

## Screenshots

Each card automatically shows a screenshot of the tool when one is available.
Screenshots are stored in the [`screenshots/`](screenshots/) folder as
`<name>.jpg`, where `<name>` matches the `name` field in `links.json`.

The **Capture Screenshots** GitHub Actions workflow (`.github/workflows/screenshots.yml`)
runs every Sunday at 03:00 UTC and can also be triggered manually from the
[Actions tab](../../actions/workflows/screenshots.yml). It visits every URL in
`links.json` with a headless Chromium browser and saves a fresh JPEG thumbnail
for each tool.

To regenerate screenshots manually, trigger the workflow from the Actions tab
(**Run workflow** → **Run workflow**). New screenshots are committed automatically.

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