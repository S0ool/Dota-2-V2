import { useEffect, useState } from "react";

export const ScrollAnimation = ({ element }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (!element.current) return;
        const position = element.current.getBoundingClientRect().top;
        setIsVisible(position < window.innerHeight && position > 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [element]);

    return { isVisible };
};
