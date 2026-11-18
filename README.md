# veemax.be

Source of [www.veemax.be](https://www.veemax.be), the site of VeeMax, Maxime
Vincent's embedded systems consultancy, and his technical writing.

It is a plain [Jekyll](https://jekyllrb.com/) 4 site with its own small theme
(no theme gem, no Sass, no JavaScript framework).

## Run it locally

Needs Ruby (3.x) and Bundler.

```sh
./install.sh   # bundle install (gems go into vendor/bundle)
./serve.sh     # http://localhost:4000 with live reload
```

`bundle exec jekyll build` writes the static site to `_site/`.

## Where things live

| Path | What |
| --- | --- |
| `_data/home.yml` | Homepage copy: headline, intro, status note, call to action, About and Contact text |
| `_data/expertise.yml` | The eight "pins": Table 1 and the chip in Figure 1 |
| `_data/projects.yml` | The project table; `post_slug` links a project to its write-up |
| `_data/navigation.yml` | Main menu |
| `_posts/` | Published posts, URL `/:categories/:title/` (e.g. `/blog/...`) |
| `_drafts/` | Unpublished drafts (preview with `bundle exec jekyll serve --drafts`) |
| `_pages/` | About, archives (`/posts/`, `/tags/`, `/categories/`) and 404 |
| `_layouts/`, `_includes/` | Templates |
| `assets/css/style.css` | The whole stylesheet, light and dark palette at the top |
| `assets/fonts/` | Self-hosted Archivo and IBM Plex Mono (SIL Open Font License) |

Post front matter: `title`, `categories: [Blog]`, `tags`, optional `excerpt`
(shown as the abstract), `image` (social preview) and `link`.

## Deploy

Pushing to the `gh-pages` branch builds and publishes the site with GitHub
Actions (`.github/workflows/pages.yml`).
