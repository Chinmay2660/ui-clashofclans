# Clash of Clans Fonts

## Supercell Magic Font

Download the official Supercell Magic font from the [Supercell Fan Kit](https://fankit.supercell.com/d/vkEdmkUCngKw/game-assets).

### Instructions:

1. Visit https://fankit.supercell.com/d/vkEdmkUCngKw/game-assets
2. Download the **Supercell Magic** font
3. Place the font file(s) in this folder:
   - `Supercell-Magic.woff2` (preferred for web)
   - `Supercell-Magic.ttf` (fallback)

### File naming:
The CSS expects these exact filenames:
- `Supercell-Magic.woff2`
- `Supercell-Magic.ttf`

If your downloaded files have different names, rename them accordingly.

### Converting TTF to WOFF2:
If you only have TTF, you can convert it to WOFF2 for better performance:
- Use https://cloudconvert.com/ttf-to-woff2
- Or use the `woff2` npm package

### Font Usage in Code:

```css
/* Headlines and titles */
.game-title {
  font-family: 'Supercell-Magic', 'Lilita One', sans-serif;
}
```

```jsx
{/* In Tailwind */}
<h1 className="font-clash">Clash of Clans</h1>
<h2 className="font-display">Game Title</h2>
```

## Fallback Fonts

If the Supercell Magic font is not available, the site will use:
1. **Lilita One** - A bold, playful font similar to Supercell Magic (loaded from Google Fonts)
2. **Nunito** - Clean, rounded font for body text (loaded from Google Fonts)

## Legal Notice

The Supercell Magic font is provided by Supercell for fan use. Make sure to follow Supercell's Fan Content Policy:
https://supercell.com/en/fan-content-policy/

