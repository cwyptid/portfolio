/**
 * Theme Toggle Functionality
 * Switches between light and dark themes
 */

(function() {
    // Get all theme toggle buttons (by ID and class)
    const themeToggleButtons = [
        document.getElementById('theme-toggle'),
        document.getElementById('theme-toggle-mobile'),
        ...document.querySelectorAll('.theme-toggle-btn')
    ].filter(Boolean); // Remove null/undefined entries

    // Get the current theme from localStorage or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply the saved theme on page load
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateButtonText(true);
    }

    /**
     * Toggle the theme between light and dark
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Apply the new theme
        document.documentElement.setAttribute('data-theme', newTheme);

        // Save to localStorage
        localStorage.setItem('theme', newTheme);

        // Update button text
        updateButtonText(newTheme === 'dark');
    }

    /**
     * Update button text based on current theme
     * @param {boolean} isDark - Whether dark mode is active
     */
    function updateButtonText(isDark) {
        const text = isDark ? 'lights on?' : 'lights out?';

        // Update all theme toggle buttons
        themeToggleButtons.forEach(button => {
            if (button) {
                button.textContent = text;
            }
        });
    }

    // Add click event listeners to all theme toggle buttons
    themeToggleButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', toggleTheme);
        }
    });

    // Optional: Listen for system theme preference changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addListener((e) => {
        // Only apply system preference if user hasn't manually set a theme
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateButtonText(e.matches);
        }
    });
})();
