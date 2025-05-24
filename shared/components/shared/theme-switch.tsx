'use client'

import {Moon, Sun} from 'lucide-react'
import {useTheme} from "@/shared/hooks";

export const ThemeSwitch = () => {
    const {theme, toggleTheme, mounted} = useTheme()

    if (!mounted) return null

    const isDark = theme === 'dark'

    return (
        <div className="theme-switch__wrapper">
            <label className="theme-switch">
                <input
                    type="checkbox"
                    checked={isDark}
                    onChange={toggleTheme}
                    aria-label="Переключить тему"
                />
                <span className="slider round">
                <Sun className="sun-icon"/>
                <Moon className="moon-icon"/>
            </span>
            </label>
        </div>
    )
}