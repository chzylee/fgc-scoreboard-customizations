# FGC Scoreboard
FGC Scoreboard is an html and css scoreboard for fighting game tournament streams. It uses absolutely no images (except for tournament/company logos which I've included a generic PSD for) and absolutely no webm files for animations.

The original [fgc-scoreboard](https://github.com/WASD-Gaming/fgc-scoreboard) was created by Tarik of WASD Gaming, and this package includes minor customization additions by enpicie.

## How FGC Scoreboard Works
To get started with FGC Scoreboard just open your streaming platform of choice, add a **broswer source**, and then navigate to wherever you saved the **scoreboard.html** file.

> **OBS browser source size:** set the source to **Width 1920, Height 1080**. Every overlay page (the full board and the standalone pages below) draws onto a transparent 1920x1080 canvas, so the source must be 1920x1080 for everything to land in the right spot. Once added, you can move/scale the source freely in OBS.

The scoreboard is built to work with StreamControl (included in the repo). All of your data entry should happen through that app including:
```
* Player Names
* Team Names
* Round
* Score
* Game
```

To change any of the colors, the font, the opacity, etc. just open the scss file and tweak the variables at the top. There's no need to jump into the rest of the styling unless you want to change something more drastic.

#### Using Your Own Font
The scoreboard ships with the included **Valorant** font by default. If you want a different font — including a "personal use" font you can't redistribute — you can swap it in **without editing (or committing) the shared stylesheet**, using a local override file:

1. Drop your font file into `_overlays/fonts/` (that folder is gitignored, so the font won't be committed; the bundled `ValorantFont.ttf` is the one exception that stays in the repo).
2. Copy `_overlays/css/style.local.css.example` to `_overlays/css/style.local.css` in the same folder.
3. Edit the `@font-face` `src` and `font-family` in your new `style.local.css` to point at your font, and set `--scoreboard-font` to that font's name:
   ```css
   @font-face {
     src: url("../fonts/YOUR-FONT-FILE.otf");
     font-family: "YourFontName";
   }
   :root {
     --scoreboard-font: "YourFontName";
   }
   ```

Every overlay page loads `style.local.css` **after** `style.css`, so your override wins. `style.local.css` is **gitignored** and is never committed, so your personal font stays out of the repo — and if the file is absent (e.g. a fresh clone), the pages simply fall back to the default Valorant font. The font is wired to the `--scoreboard-font` CSS variable, so the override file is the only thing you ever need to touch.

Finally, when you select a game (and hit save) the layout will adjust so that the scores and logos don't cover important guages.
#### Supported Games
```
* BBCF
* BBTAG
* DBFZ
* GGXRD
* KOFXIV
* MVCI
* SFVCE
* TEKKEN7
* UMVC3
* UNICLR
* USF4
* MBAACC
* GBVSR
```

#### Customization Updates
In StreamControl, there is a Customizations tab where you can reconfigure the following:
- **Main Color** for the scoreboard
- **Team Text Color** for the team tag text
- **Toggle Logo** — Show or Hide the logo image at the bottom (default logo shows Reddit Tour image)
- **Hide Score #s** — Show or Hide just the score numbers (names/teams stay visible)
- **Hide Background** — Show or Hide the shapes drawn behind the text, so the text can be composited over a custom overlay image instead of the built-in background
- **Push Names Out / Push Scores Out / Push Pronouns Out** — 0–10 dropdowns that nudge each element symmetrically away from center (P1 left, P2 right) in small steps, to line the text up with a custom overlay

### Standalone Overlay Pages (for custom overlay images)
The full `scoreboard.html` is unchanged and works as before. In addition, there are standalone pages that emit **one element each** so you can place them independently in OBS — handy when you have your own overlay artwork and want to drop the text into specific slots. They are all driven by the **same StreamControl flow** (same data, same Customizations tab):

| Page | Shows | Offset control |
| --- | --- | --- |
| `scoreboard-names.html` | Both players' team + name | Push Names Out |
| `scoreboard-scores.html` | Both scores (respects Hide Score #s) | Push Scores Out |
| `scoreboard-round.html` | Round text (stays centered) | — |
| `scoreboard-pronouns.html` | Both players' pronouns | Push Pronouns Out |

**How to use them:**
1. Set **Hide Background** to **Hide** on the full board (or just use the standalone pages), and add your overlay image as its own OBS source.
2. Add each standalone page you want as a separate **browser source at 1920 x 1080**.
3. Drag/scale each source in OBS to sit over the matching slot in your overlay.
4. Use the **Push ... Out** dropdowns for fine, repeatable left/right nudges that stay symmetric between the two players.

> Pronouns are a standalone-only element — they read the existing P1/P2 Pronouns fields from the Match Info tab and are not shown on the full board.

## Drop Me a Line
If you found this at all useful, or have some suggestions, please let me know! You can drop me a line on twitter ([@tarikfayad](https://twitter.com/tarikfayad)), find me on Twitch ([ImpurestClub](https://www.twitch.tv/impurestclub/)), or ping me on my Discord server ([Link](https://discord.gg/ykj8tsN)).

Also, feel free to check out a much bigger project I've been working on called **WASD**. It's a search enginge for teammates/sparring partners along with a pretty comprehensive tournament calendar. You can find it here: https://wasdgaming.gg

If you've really found this useful, feel free to <br>
<a href="https://www.buymeacoffee.com/tarik" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Thank Yous
Massive thank you to TheSassageKing for making the initial [4 hour YouTube tutorial this is based on](https://www.youtube.com/watch?v=qqyFknxaVWo). The general look of the board and a good chunk of the code's skeleton comes from following that video.

Also, thank you to [u/Brylark](https://www.reddit.com/r/VALORANT/comments/g0747t/valorant_font/) over on Reddit for making the VALORANT font that I've included in the repo and plan to use myself for the time being.

## Screenshots
<p align="center">
  <img src="screenshots/dbfz.png" alt="FGC Scoreboard on DBFZ." width="75%">
  <img src="screenshots/uniclr.png" alt="FGC Scoreboard on UNICLR." width="75%">
</p>

## Todo
- [X] Add lower thirds for commentators
- [X] Create GIFs to show case animations
- [X] Explore Smash/Challonge/Toornament integration

Pull requests are more than welcomed!

## License
Usage is provided under the [MIT License](http://http//opensource.org/licenses/mit-license.php). See LICENSE for the full details.
