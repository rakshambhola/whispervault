'use client';

interface LogoProps {
    className?: string;
    size?: number;
    color?: string;
}

export default function Logo({ className = "", size = 24, color = "currentColor" }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Vault body */}
            <rect x="8" y="16" width="48" height="40" rx="8" fill={color} fillOpacity="0.9" />

            {/* Vault door circle */}
            <circle cx="32" cy="36" r="12" fill={color} fillOpacity="0.6" />

            {/* Door handle */}
            <circle cx="32" cy="36" r="3" fill={color} />
            <line x1="32" y1="36" x2="38" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />

            {/* Lock indicator dots */}
            <circle cx="20" cy="28" r="2" fill={color} fillOpacity="0.7" />
            <circle cx="44" y="28" r="2" fill={color} fillOpacity="0.7" />

            {/* Top antenna/handle */}
            <rect x="28" y="8" width="8" height="10" rx="2" fill={color} fillOpacity="0.8" />
            <circle cx="32" cy="8" r="3" fill={color} />

            {/* Side handles */}
            <rect x="4" y="30" width="6" height="12" rx="2" fill={color} fillOpacity="0.7" />
            <rect x="54" y="30" width="6" height="12" rx="2" fill={color} fillOpacity="0.7" />

            {/* Bottom feet */}
            <rect x="14" y="54" width="8" height="6" rx="2" fill={color} fillOpacity="0.8" />
            <rect x="42" y="54" width="8" height="6" rx="2" fill={color} fillOpacity="0.8" />
        </svg>
    );
}
