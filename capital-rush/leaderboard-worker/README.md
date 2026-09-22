# Globalny Hall of Fame — Cloudflare Worker + D1

GitHub Pages jest hostingiem statycznym, więc nie zapisze wyniku do pliku w repozytorium. Ten mały Worker udostępnia API `GET/POST /scores`, a D1 przechowuje wspólny ranking.

## 1. Zaloguj Wrangler

```bash
cd leaderboard-worker
npx wrangler@latest login
```

## 2. Utwórz bazę D1 w jurysdykcji UE

```bash
npx wrangler@latest d1 create capital-rush-leaderboard --jurisdiction=eu
```

Skopiuj `database_id` z wyniku i wklej go do `wrangler.toml`.

## 3. Utwórz tabelę

```bash
npx wrangler@latest d1 execute capital-rush-leaderboard --remote --file=./schema.sql
```

## 4. Wdróż Worker

```bash
npx wrangler@latest deploy
```

Wrangler poda adres podobny do:

```text
https://capital-rush-leaderboard.TWOJ-SUBDOMAIN.workers.dev
```

## 5. Podłącz grę

W `capital-rush.html` znajdź:

```html
<meta name="capital-rush-leaderboard-api" content="">
```

i wpisz URL Workera:

```html
<meta name="capital-rush-leaderboard-api" content="https://capital-rush-leaderboard.TWOJ-SUBDOMAIN.workers.dev">
```

Po ponownym wdrożeniu GitHub Pages Hall of Fame stanie się globalny. Jeśli backend chwilowo nie odpowiada, aplikacja zachowa wynik lokalnie i pokaże lokalny ranking awaryjny.

## Bezpieczeństwo

To ranking gry casualowej. Worker waliduje format i zakres wyniku, ale nie może udowodnić, że rozgrywka naprawdę odbyła się w przeglądarce — zmodyfikowany klient może próbować wysłać sztuczny wynik. Jeśli ranking ma być odporny na oszustwa, kolejnym krokiem jest Turnstile/rate limiting albo serwerowa walidacja przebiegu gry.
