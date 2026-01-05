import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTheme } from "@/store/slices/uiSlice";

export function useTheme() {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(state => state.ui.theme);

    useEffect(() => {
        if (theme === 'dark'){
            document.documentElement.classList.add('dark');
            console.log('Changed theme to dark');

        } else {
            document.documentElement.classList.remove('dark');
            console.log('changed theme to light')
        }
    }, [theme]);

    const toggleTheme = () => {
        dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
    };
    return {theme, toggleTheme};
}