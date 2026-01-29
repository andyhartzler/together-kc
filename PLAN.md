# Donate Page Full Redesign Plan

## Current Problems (from screenshots)
1. **Navbar invisible** - Light gray background makes white nav links disappear
2. **Iframe looks embedded** - Visible border/box around form, "Donate to Together KC" header visible
3. **Cheap/simple design** - Doesn't match the rich, dynamic feel of other pages
4. **No compelling content** - Just a form floating in space
5. **Layout issues** - Form centered instead of two-column desktop layout

## Design Goals
- Match the visual language of Home/Endorsements pages (navy gradient hero)
- Two-column layout: compelling content LEFT, donation form RIGHT (desktop)
- Make iframe **completely invisible** as an embed (no borders, hide Numero header)
- Rich animations consistent with site
- Seamless transitions between sections

---

## Section 1: Hero Section

### Background
- Navy gradient matching other pages: `bg-gradient-to-br from-navy via-navy/95 to-sky/80`
- Animated gradient orbs (coral, sky, golden) like Home hero
- Subtle grid pattern overlay
- Bottom fade to white section below

### Content (centered)
- Animated red checkmark icon (draw-in animation)
- "Support" with word-by-word blur-in animation
- "Together KC" in coral with glow effect and underline sweep
- Subtitle: "Your contribution powers our campaign to inform voters"
- Fade to next section

### Spacing
- `pt-44 sm:pt-52 pb-16 sm:pb-24` to account for fixed navbar

---

## Section 2: Main Content (Two-Column)

### Layout
- `max-w-7xl` container
- Desktop: 5-column grid, LEFT content spans 2, RIGHT form spans 3
- Mobile: Stack vertically, content first then form
- White background (`bg-white`)

### LEFT Column: Why Your Support Matters
Animated cards (stagger in from left) with icons:

1. **Fund Voter Education** (megaphone icon)
   - "Help us reach every Kansas City voter with accurate information about what's at stake"

2. **Combat Misinformation** (shield icon)
   - "Counter misleading claims with facts about how the e-tax funds essential services"

3. **Protect KC Services** (building icon)
   - "47% of the city's general fund—police, fire, roads, parks—depends on renewal"

4. **Grassroots Organizing** (users icon)
   - "Support door-to-door canvassing, phone banks, and community events"

### RIGHT Column: Donation Form (iframe)

**Critical: Make iframe invisible as embed**

1. **Hide Numero header** - Increase negative offset from -115 to approximately -180px to hide "Donate to Together KC" and progress bar initially

2. **No container styling** - Remove ALL:
   - Border/border-radius
   - Box shadow
   - Background color differences
   - Decorative glow

3. **Full-bleed appearance** - Form fields appear as native page elements

4. **Height** - 1200px to accommodate full form with validation errors

5. **Responsive width** - Form takes full width of its column

---

## Section 3: Trust Indicators (optional enhancement)

Light gray background section between form and CTA:
- Security badge icons (SSL, secure payment)
- "100% of donations go to voter education"
- Small text: "Together KC is registered with Missouri Ethics Commission"

---

## Section 4: Bottom CTA (Navy)

Match FAQ page style exactly:
- Navy background
- "Other Ways to Help" heading
- "Can't donate right now?" subtitle
- Two buttons: "Add Your Endorsement" (coral) + "Volunteer With Us" (outline white)

---

## Animation Details

### Hero Animations (sequenced)
1. `0.0s` - Background gradient orbs fade in
2. `0.3s` - Checkmark draws in (pathLength animation)
3. `0.5s` - "Support" word blur-in
4. `0.7s` - "Together KC" scale + glow entrance
5. `1.0s` - Underline sweep
6. `1.2s` - Subtitle fade in

### Content Section Animations
- Left column cards: `whileInView` stagger from left, 0.1s delay each
- Right column form: `whileInView` fade + slide from right

### Scroll-triggered
- All sections use `viewport={{ once: true }}` for single trigger
- Smooth motion with `easeOut` curves

---

## Technical Implementation

### File: `app/(main)/donate/page.tsx`

```tsx
// Key changes:
1. Navy gradient hero (not light-gray)
2. Two-column grid layout
3. Iframe offset increased to hide Numero header (~-180px)
4. No styling on iframe container (transparent/borderless)
5. Increased height (1200px)
6. Card components for left side content
7. Consistent animations with rest of site
```

### CSS/Styling Notes
- Use existing Tailwind classes
- Match colors exactly: coral (#E53935), navy, sky, golden
- Use existing `gradient-text` class for coral text
- Button component already exists, reuse it

---

## Iframe Embed Strategy

The Numero form has this structure at top:
```
[Logo] ← hide with negative offset
"Donate to Together KC" ← hide
[Progress bar: Amount > Details > Payment] ← optionally show or hide
[Form content] ← show this
```

**Offset calculation:**
- Current: -115px (hides logo but shows "Donate to Together KC")
- New: -180px to -200px (hides everything above form fields)
- Test exact value to show form starting at "CHOOSE AN AMOUNT" cleanly

**Container styling:**
```tsx
<div className="overflow-hidden"> {/* No other styles! */}
  <iframe
    style={{
      height: '2100px',
      top: -180, // Adjusted to hide Numero header
      border: 'none',
    }}
  />
</div>
```

---

## Mobile Considerations

- Stack layout vertically (content above form)
- Form takes full width
- Reduce hero padding
- Cards stack in single column
- Touch-friendly spacing

---

## Files to Modify

1. `app/(main)/donate/page.tsx` - Complete rewrite

No new components needed - reuse existing Button, motion patterns.

---

## Verification Checklist

After implementation:
- [ ] Navbar links visible on dark hero background
- [ ] No visible "Donate to Together KC" header from Numero
- [ ] No border/shadow around form
- [ ] Form blends seamlessly into page
- [ ] Animations smooth and sequenced
- [ ] Mobile layout works
- [ ] All form steps (Amount, Details, Payment) accessible
- [ ] Bottom CTA matches FAQ page
- [ ] Page doesn't jump/scroll on load
