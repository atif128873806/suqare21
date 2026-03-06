'use client';

import { useEffect, useState, useRef } from 'react';

interface CounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    className?: string;
}

export default function Counter({ end, duration = 2000, suffix = '', className }: CounterProps) {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Stagger the start of counters to avoid layout thrashing
                    setTimeout(() => {
                        setIsVisible(true);
                    }, Math.random() * 200 + 50);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => {
            if (countRef.current) {
                observer.unobserve(countRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [end, duration, isVisible]);

    return (
        <span ref={countRef} className={className}>
            {count}{suffix}
        </span>
    );
}
