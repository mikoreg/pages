# Publikacja na GitHub Pages

Aktualny publiczny adres gry:

```text
https://mikoreg.github.io/pages/capital-rush/capital-rush.html
```

To sugeruje repozytorium `mikoreg/pages` oraz katalog `capital-rush`.

## 1. Skopiuj pliki frontendu

Jeśli lokalny checkout repozytorium ma katalog `capital-rush`, rozpakuj do niego pliki z głównego poziomu ZIP-a. Folder `leaderboard-worker` jest backendem i nie musi być publikowany przez Pages.

Przykład:

```bash
cd /work/projects/github.com/mikoreg/pages
cp capital-rush/capital-rush.html capital-rush/capital-rush.html.bak
unzip -o ~/Downloads/capital-rush-pwa-v2.zip -d /tmp/capital-rush-release
cp -a /tmp/capital-rush-release/. capital-rush/
```

Jeśli nadal rozwijasz grę w starym checkoutcie:

```text
/work/projects/github.com/mikoreg/sandbox/capitalRush
```

możesz najpierw przetestować tam pliki, a potem skopiować frontend do repozytorium `pages`.

## 2. Test lokalny

```bash
cd /work/projects/github.com/mikoreg/pages
python3 -m http.server 8080
```

Otwórz:

```text
http://localhost:8080/capital-rush/
```

## 3. Commit i push

```bash
git status
git add capital-rush
git commit -m "Update Capital Rush PWA and responsive layout"
git push
```

## 4. GitHub Pages

Jeżeli adres `https://mikoreg.github.io/pages/...` już działa, Pages jest już skonfigurowane. Po pushu poczekaj na nowe wdrożenie i odśwież stronę. Przy zmianie Service Workera czasem pomaga twarde odświeżenie lub ponowne otwarcie aplikacji.

## 5. Globalny Hall of Fame

GitHub Pages jest hostingiem statycznym i nie zapisuje danych użytkowników do plików repozytorium. Do wspólnego rankingu użyj opcjonalnego backendu `leaderboard-worker/`.

Po wdrożeniu Workera wpisz jego URL w `capital-rush.html`:

```html
<meta name="capital-rush-leaderboard-api" content="https://capital-rush-leaderboard.TWOJ-SUBDOMAIN.workers.dev">
```

i wykonaj kolejny commit/push frontendu.
