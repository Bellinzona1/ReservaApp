import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useBlockNavigation(shouldBlock, onConfirm) {
    const navigator = useContext(NavigationContext).navigator;

    useEffect(() => {
        if (!shouldBlock) return;

        const push = navigator.push;

        navigator.push = (...args) => {
            onConfirm(() => push(...args));
        };

        return () => {
            navigator.push = push;
        };
    }, [navigator, shouldBlock, onConfirm]);
}
