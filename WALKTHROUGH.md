# Step by step: fork, open in Cursor, publish

Your live site will be:

**`https://YOUR-USERNAME.github.io`**

That only works if the GitHub repository is named exactly `YOUR-USERNAME.github.io`.

**Starter:** [github.com/alissarivero/personal-website-template](https://github.com/alissarivero/personal-website-template)

You need a [GitHub](https://github.com) account and [Cursor](https://cursor.com). Nothing else to install.

---

## 1. Make your own copy — name it `YOUR-USERNAME.github.io`

1. Sign in at [github.com](https://github.com).
2. Open [github.com/alissarivero/personal-website-template](https://github.com/alissarivero/personal-website-template).
3. Click **Use this template** → **Create a new repository**.
   - If you do not see that, click **Fork**.
4. Owner: your account.
5. **Repository name:** `YOUR-USERNAME.github.io`  
   Use your real GitHub username. Example: if you are `jane`, the name is `jane.github.io`.
6. Visibility: **Public**.
7. Click **Create repository**.

You should now be on `https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io`.

If GitHub says that name is taken, you already have a user site. Clone that existing repo and copy these files into it instead of creating a second one.

**Check:** the repo name is `YOUR-USERNAME.github.io`, not `personal-website-template`.

---

## 2. Open it in Cursor

### Option A — clone from Cursor

1. Open Cursor.
2. **File → Clone Repo** → **Clone from GitHub**.
3. Select `YOUR-USERNAME/YOUR-USERNAME.github.io`.
4. Choose a folder, then **Open**.

### Option B — terminal

```bash
cd ~/Desktop
git clone https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
```

Then **File → Open Folder…** and select `YOUR-USERNAME.github.io`.

**Check:** the sidebar shows `index.html`, `site-config.js`, `WALKTHROUGH.md`, `gallery`, and `templates`.

---

## 3. Preview

In Cursor: **Terminal → New Terminal**.

```bash
python3 -m http.server 8080
```

If that fails, try `python -m http.server 8080`.

Open [http://localhost:8080](http://localhost:8080). You should see every template.

---

## 4. Pick a look for the homepage

The site opens on the picker. To put a look on the homepage, run one of these in the terminal:

```bash
./use-template.sh editorial
./use-template.sh midnight
./use-template.sh scholar
./use-template.sh studio
./use-template.sh letter
./use-template.sh atlas
./use-template.sh frame
./use-template.sh newsprint
./use-template.sh blueprint
./use-template.sh quartz
./use-template.sh ledger
./use-template.sh nova
./use-template.sh archive
./use-template.sh workbench
./use-template.sh summit
```

Refresh [http://localhost:8080](http://localhost:8080).

If you get a permission error, run `chmod +x use-template.sh` once, then try again.

---

## 5. Set your public URL

Open **`site-config.js`** and set:

```js
siteUrl: "https://YOUR-USERNAME.github.io",
template: "editorial"
```

Use your username and the template you just chose. Save.

---

## 6. Put your content on the homepage

Open the **root** `index.html` (not a file inside `templates/` unless you are only previewing).

Search (**Cmd + Shift + F** / **Ctrl + Shift + F**) for `TODO` and `Your Name`.

Change:

- Name, title, and intro
- About
- Projects
- Experience
- Email, GitHub, LinkedIn
- Initials in `assets/images/favicon.svg`

Save and refresh localhost.

---

## 7. Push from Cursor

1. **Source Control** (branch icon).
2. Stage all changes (**+**).
3. Message: `Add my site content`
4. **Commit**, then **Sync Changes**.

Or:

```bash
git add -A
git commit -m "Add my site content"
git push
```

---

## 8. Turn on GitHub Pages

1. Open `https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io`.
2. **Settings → Pages**.
3. **Source:** Deploy from a branch.
4. Branch: `main`, folder: `/ (root)`.
5. **Save**.

GitHub often publishes `USERNAME.github.io` repos automatically. Wait 1–2 minutes, then open:

**https://YOUR-USERNAME.github.io**

If you see a 404, wait another minute and hard-refresh (**Cmd + Shift + R** / **Ctrl + Shift + R**).

---

## You are done when

- [ ] The repo is named `YOUR-USERNAME.github.io`
- [ ] The project is open as a folder in Cursor
- [ ] `site-config.js` says `https://YOUR-USERNAME.github.io`
- [ ] The root `index.html` has your name and work
- [ ] **https://YOUR-USERNAME.github.io** loads

Share that URL. It should not include `/personal-website-template/` or `/templates/`.

---

## If something breaks

| What you see | What to do |
|---|---|
| Repo is still `personal-website-template` | GitHub → repo **Settings** → rename it to `YOUR-USERNAME.github.io`. |
| Name is taken | You already have a user site. Put these files in that repo. |
| Cursor cloned `alissarivero/...` | Clone your copy: `YOUR-USERNAME/YOUR-USERNAME.github.io`. |
| Homepage is still the old look | Run `./use-template.sh midnight` (or another name), then refresh. |
| You edited a file under `templates/` | Copy it to the homepage with `./use-template.sh NAME`, or edit root `index.html`. |
| Pages 404 | Confirm the repo name, Pages source is `main` / `/ (root)`, wait 2 minutes. |
