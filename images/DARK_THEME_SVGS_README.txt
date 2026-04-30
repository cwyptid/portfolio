DARK THEME SVG PLACEHOLDERS
============================

The following SVG files are currently PLACEHOLDERS and need to be replaced with your dark theme versions:

1. hithere-dark.svg
   - Current: Copy of the light theme version
   - Replace with: Your dark theme "hi there" illustration

2. web-bg-dark.svg
   - Current: Copy of the light theme version
   - Replace with: Your dark theme background decoration

These files are referenced in /styles/styles.css under the [data-theme="dark"] section:
- Line ~53: --svg-hithere: url(../images/hithere-dark.svg);
- Line ~54: --svg-web-bg: url("../images/web-bg-dark.svg");

When you're ready, simply replace these placeholder files with your actual dark theme SVGs.
The theme toggle functionality will automatically use them when dark mode is active.
