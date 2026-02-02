# Instagram Carousel Plan v2: JAW-DROPPING Design

## Research Findings

### What Makes Content STOP THE SCROLL
Sources: [TrueFuture Media](https://www.truefuturemedia.com/articles/instagram-carousel-strategy-2026), [Kittl Design Trends](https://www.kittl.com/blogs/graphic-design-trends-2026/), [Digital Synopsis](https://digitalsynopsis.com/design/graphic-design-trends-2026/)

1. **0.5 seconds** - That's all the time you have. Users decide in HALF A SECOND whether to engage.
2. **80% of engagement** comes from the FIRST SLIDE. It carries almost all the weight.
3. **12 words MAX** per slide - if it takes longer than 0.7 seconds to read, they're gone.
4. **Bold, maximalist typography** - Oversized, heavy, attention-grabbing. Think "letters that feel performative."
5. **Neon-noir style** - Bright saturated colors against dark backgrounds, glow effects, high contrast
6. **One idea per slide** - Flashcard, not blog paragraph

### 2026 Visual Trends That Pop
- **Type Collage**: Multiple fonts, sizes blending = instant visual energy
- **Monochrome Maximalism**: Push ONE color to extremes (electric blue, deep crimson)
- **Neon Coral + Electric Blue**: Making a comeback in social media
- **3D sculptural elements**: Spheres, warped shapes that demand attention
- **Gradient blur backgrounds**: Amorphous, dynamic, cinematic depth

### Color Psychology for ACTION
Source: [Color Psychology Marketing](https://www.colorcured.com/blog/the-power-of-color-psychology-in-marketing-how-to-harness-the-science-and-emotional-impact-of-color)

- **Red/Coral**: URGENCY + ACTION. Reduces analytical thinking, speeds up reactions. Netflix uses red "Watch Instantly" buttons deliberately.
- **Orange**: Enthusiasm without red's starkness. Creates urgency + warmth.
- **90 seconds**: People make up their minds in 90 seconds, and 62-90% of that is COLOR.

---

## What Was Wrong Before

| Problem | Why It Failed |
|---------|---------------|
| Font-weight 700-800 | TOO THIN. Need 900 or even heavier custom weights |
| Navy gradient background | BORING. Needs vibrancy, energy, LIFE |
| "Together KC + VOTE YES" | Wrong focus. Together KC is the org, not the hook |
| 160-180px headlines | Still too small. Need 200-300px+ for impact |
| Subtle glow effects | Not enough pop. Need INTENSE neon glow |
| 8-10 words on slide 1 | Still too many. Need 3-5 MAX |

---

## New Design Philosophy

### SLIDE 1 HOOK: The "Pattern Interrupt"
The first slide must be a PATTERN INTERRUPT. Something unexpected that FORCES them to stop.

**Hook Options (pick one):**
1. **"47% OF KC"** - Giant number, makes them curious "47% of what?"
2. **"YOUR VOTE. YOUR CITY."** - Personal ownership, bold declaration
3. **"RENEW IT OR LOSE IT"** - Urgency, stakes are clear
4. **"$330 MILLION"** - Money talks. Annual revenue at stake.
5. **"APRIL 7"** - Date as urgency + curiosity "what's happening?"

**Winner: "47% OF KC"** - It's a number (pattern interrupt), creates curiosity, leads perfectly into slide 2.

### Visual Style: NEON-NOIR ENERGY
- **Background**: Deep navy (#0d1f35) with ELECTRIC gradient bursts
- **Primary pop**: Neon coral (#ff4040) with intense glow
- **Secondary**: Electric blue (#00aaff) accents
- **Accent**: Hot golden (#ffcc00) for emphasis
- **Text**: Pure white with glow/shadow for punch

### Typography Revolution
- **Headlines**: font-weight 900, size 250-400px
- **Body**: font-weight 800, size 60-80px
- **Labels**: font-weight 700, size 40-50px
- **All text**: Compressed tracking (-0.02em) for tighter, punchier look

---

## Revised 8-Slide Structure

### Slide 1: THE HOOK (Pattern Interrupt)
- **Text**: "47%" (MASSIVE, 400px, coral with intense glow) + "OF KC" (white, 150px)
- **Visual**: Dark dramatic background, coral glow orb behind number
- **Goal**: Curiosity. "47% of what??" SWIPE TO FIND OUT
- **Words**: 3

### Slide 2: THE REVEAL
- **Text**: "DEPENDS ON" (small label) + "THE E-TAX" (massive, electric blue glow)
- **Visual**: Continue dark aesthetic, blue glow transition
- **Goal**: Reveal what the 47% means. Now they're invested.
- **Words**: 4

### Slide 3: WHAT'S FUNDED (Grid)
- **Text**: 2x3 icon grid - FIRE | POLICE | EMS | ROADS | TRASH | SNOW
- **Visual**: Each service in a glowing card, vibrant colors
- **Goal**: Tangible value. These are YOUR services.
- **Words**: 6 service names

### Slide 4: THE COST (Shock Value)
- **Text**: "$330M" (massive golden) + "EVERY YEAR" (white)
- **Visual**: Golden glow, money emphasis
- **Goal**: Staggering scale. This is BIG.
- **Words**: 4

### Slide 5: THE TRUTH (Myth Bust)
- **Text**: "NOT NEW" → "SINCE 1963" | "ONLY 1%" | "50% FROM VISITORS"
- **Visual**: Stacked facts, checklist format (saveable)
- **Goal**: Address objections. Make it saveable.
- **Words**: ~15 total across 3 facts

### Slide 6: WITHOUT IT (Fear/Urgency)
- **Text**: "WITHOUT IT:" + emoji list of consequences
- **Visual**: Red-shifted urgent background, warning style
- **Goal**: Stakes. What happens if NO.
- **Words**: 8-10

### Slide 7: THE ASK (CTA)
- **Text**: "APRIL 7" (calendar visual) + "VOTE YES" (MASSIVE coral)
- **Visual**: Return to confident, energetic design
- **Goal**: Clear action. One date. One ask.
- **Words**: 4

### Slide 8: SHARE CTA
- **Text**: "SHARE WITH A KC VOTER" + website
- **Visual**: Share icon, button, social prompt
- **Goal**: Virality. Algorithm boost.
- **Words**: 6

---

## Technical Specifications

### Canvas
- **Size**: 1080 x 1350px (4:5 Instagram portrait)
- **Safe zone**: 60px padding from all edges

### Colors (Intensified)
```
Deep Navy:    #0a1929 (darker base)
Navy:         #1e3a5f
Neon Coral:   #ff4040 (brighter than #e53935)
Electric Blue: #00aaff
Hot Golden:   #ffcc00
Pure White:   #ffffff
```

### Glow Effects
- **Coral glow**: 40px blur, 80% opacity
- **Blue glow**: 30px blur, 60% opacity
- **Text shadow**: 0 0 60px [color] for neon effect
- **Drop shadow on all text**: 0 4px 20px rgba(0,0,0,0.5)

### Background Treatment
- Base: Linear gradient from deep navy to navy
- Orbs: MUCH larger (80% of canvas width), more saturated
- Add subtle noise texture for depth
- Consider mesh gradient effect for slide variety

### Typography
| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| Giant numbers | Geist | 900 | 350-400px | -0.03em |
| Headlines | Geist | 900 | 200-280px | -0.02em |
| Body | Geist | 800 | 60-80px | -0.01em |
| Labels | Geist | 700 | 40-50px | 0.1em (spaced) |

---

## Implementation Notes

### Generator Changes Required
1. New color palette (neon-noir)
2. Much larger font sizes
3. Font-weight 900 (black) instead of 700-800
4. Stronger glow filters (2x intensity)
5. Darker base gradient
6. Larger, more saturated orbs
7. Tighter letter-spacing
8. Better drop shadows on all text

### Slide-by-Slide SVG Structure
Each slide should have:
1. Dark gradient background
2. 1-2 large gradient orbs (positioned per slide)
3. Optional subtle grid/noise texture
4. Main text element(s) with glow filter
5. Drop shadow on all text
6. Slide indicator dots (bottom)

---

## Success Metrics

After generation, verify:
- [ ] Slide 1 makes you STOP and look
- [ ] Text is readable from arm's length on phone
- [ ] Colors POP against dark background
- [ ] Each slide has ONE clear idea
- [ ] Glow effects create "neon sign" vibe
- [ ] Flow tells a clear story (curiosity → reveal → value → urgency → action)
- [ ] Final slide drives shares/saves

---

## Example Visual Reference

Slide 1 should feel like:
```
┌─────────────────────────────┐
│                             │
│    ████████  ████████       │
│    ██    ██  ██    ██       │
│    ██    ██  ██    ██       │
│    ████████  █████████      │  ← "47" in MASSIVE neon coral
│        ██        ██         │     with intense glow effect
│        ██        ██         │
│    ████████      ██         │
│         %                   │
│                             │
│       OF KC                 │  ← Clean white, smaller
│                             │
│      ● ○ ○ ○ ○ ○ ○ ○        │  ← Slide indicators
└─────────────────────────────┘
```

The number should GLOW. It should feel like a neon sign in a dark room. THAT'S the energy we need.
