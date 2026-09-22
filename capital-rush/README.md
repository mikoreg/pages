# Wyścig Stolic — PWA 1.1

Gra PWA o stolicach Europy. Frontend jest statyczny i nadaje się do GitHub Pages. Mapa i routing wymagają Internetu.

## Co zawiera wersja 1.1

- responsywny layout: panel boczny na ekranie poziomym, pełnoszeroki panel pod mapą w pionie,
- poprawka układu portrait — elementy nie są już wypychane przez dwukolumnowy grid,
- instalacja jako PWA w Chrome,
- samochód jako inline SVG,
- Hall of Fame z nickiem, punktami i czasem,
- lokalny ranking jako fallback,
- opcjonalny **globalny Hall of Fame** przez `leaderboard-worker/` (Cloudflare Worker + D1).

## Pliki frontendu

- `capital-rush.html` — gra,
- `index.html` — wejście dla GitHub Pages,
- `manifest.webmanifest` — manifest PWA,
- `sw.js` — service worker / cache,
- `icon.svg`, `icons/*` — ikony,
- `.nojekyll` — wyłącza Jekyll.

## Hall of Fame

Bez backendu wyniki są przechowywane w `localStorage` przeglądarki. Rekord zawiera nick, punkty i czas, a TOP 10 sortuje się po punktach malejąco i po czasie rosnąco.

Jeśli skonfigurujesz URL API w:

```html
<meta name="capital-rush-leaderboard-api" content="https://...workers.dev">
```

ranking staje się globalny. Gdy serwer jest chwilowo niedostępny, wynik zostaje zachowany lokalnie.

Instrukcja backendu: `leaderboard-worker/README.md`.


## Wersja 1.2.0 — poprawka portrait

Układ `bottom` jest zawsze jednokolumnowy. Dzięki temu panel pytania nie może wypchnąć interfejsu poza ekran na telefonach o nietypowej gęstości pikseli lub szerokości CSS. Service Worker ma nową wersję cache i pobiera dokument nawigacyjny z `cache: no-store`.

Jeśli po wdrożeniu nadal widać starą wersję, otwórz `capital-rush.html?v=1.2.0` albo usuń dane witryny/PWA i uruchom stronę ponownie. Numer wersji `v1.2.0` jest widoczny na ekranie startowym.
