import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';


export default function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Check if the user has a preferred theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.add(savedTheme);
        } else {
            // Default to system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                setTheme('dark');
                localStorage.setItem('theme', 'dark');
                document.documentElement.classList.add('dark');
            }
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';

        document.documentElement.classList.remove(theme);
        document.documentElement.classList.add(newTheme);

        // Update local storage
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);

        // Broadcast theme change event
        window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
    };

    return (
        <button
            onClick={toggleTheme}
            className="pt-0 pr-4 rounded-full text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-300"
        >
            <FontAwesomeIcon
                icon={faMoon}
                size="md"
                className={theme === 'light' ? 'text-gray-900' : 'text-gray-300'}
            />
        </button>
    );
}