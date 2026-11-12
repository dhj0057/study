import React from "react";
import "./Calculator.css";

// 끓을 때: 냄비 + 불꽃 + 기포 + 김
function BoilingIllustration() {
    return (
        <svg className="verdict-svg" viewBox="0 0 200 180" role="img" aria-label="끓는 물">
            {/* 김 */}
            <path className="steam steam-1" d="M75 50 q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#ffd7c2" strokeWidth="4" strokeLinecap="round" />
            <path className="steam steam-2" d="M100 46 q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#ffe6d9" strokeWidth="4" strokeLinecap="round" />
            <path className="steam steam-3" d="M125 50 q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#ffd7c2" strokeWidth="4" strokeLinecap="round" />

            {/* 냄비 손잡이 */}
            <rect x="28" y="76" width="18" height="9" rx="4.5" fill="#64748b" />
            <rect x="154" y="76" width="18" height="9" rx="4.5" fill="#64748b" />

            {/* 냄비 몸통 */}
            <path d="M44 66 h112 v52 a16 16 0 0 1 -16 16 h-80 a16 16 0 0 1 -16 -16 z" fill="#94a3b8" />
            {/* 물 */}
            <path d="M50 74 h100 v42 a12 12 0 0 1 -12 12 h-76 a12 12 0 0 1 -12 -12 z" fill="#ff8a5c" opacity="0.9" />
            {/* 냄비 테두리 */}
            <rect x="40" y="60" width="120" height="10" rx="5" fill="#cbd5e1" />

            {/* 기포 */}
            <circle className="bubble bubble-1" cx="68" cy="112" r="5" fill="#fff3e6" />
            <circle className="bubble bubble-2" cx="86" cy="116" r="4" fill="#fff3e6" />
            <circle className="bubble bubble-3" cx="102" cy="110" r="6" fill="#fff3e6" />
            <circle className="bubble bubble-4" cx="120" cy="116" r="4" fill="#fff3e6" />
            <circle className="bubble bubble-5" cx="134" cy="112" r="5" fill="#fff3e6" />

            {/* 불꽃 */}
            <g className="flame-group">
                <path d="M100 138 c-10 8 -12 16 -6 22 h12 c6 -6 4 -14 -6 -22 z" fill="#ff4b2b" />
                <path d="M78 142 c-8 6 -9 13 -5 18 h10 c4 -5 3 -12 -5 -18 z" fill="#f59e0b" />
                <path d="M122 142 c-8 6 -9 13 -5 18 h10 c4 -5 3 -12 -5 -18 z" fill="#f59e0b" />
                <path d="M100 148 c-4 4 -5 8 -2 12 h4 c3 -4 2 -8 -2 -12 z" fill="#fde68a" />
            </g>
        </svg>
    );
}

// 끓지 않을 때: 컵 + 얼음 + 물방울 + 반짝임
function CoolIllustration() {
    return (
        <svg className="verdict-svg" viewBox="0 0 200 180" role="img" aria-label="끓지 않는 물">
            {/* 반짝임 */}
            <path className="sparkle-1" d="M46 40 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" fill="#bae6fd" />
            <path className="sparkle-2" d="M156 56 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 z" fill="#e0f2fe" />

            {/* 물방울 */}
            <path className="droplet-float" d="M100 14 c-9 12 -13 18 -13 24 a13 13 0 0 0 26 0 c0 -6 -4 -12 -13 -24 z" fill="#38bdf8" />

            {/* 컵 */}
            <path d="M58 66 h84 l-9 86 a10 10 0 0 1 -10 9 h-46 a10 10 0 0 1 -10 -9 z" fill="rgba(255,255,255,0.14)" stroke="#cbd5e1" strokeWidth="3" strokeLinejoin="round" />
            {/* 물 */}
            <path d="M63 92 h74 l-6.5 58 a8 8 0 0 1 -8 7 h-45 a8 8 0 0 1 -8 -7 z" fill="#0ea5e9" opacity="0.85" />

            {/* 얼음 */}
            <rect className="ice-1" x="76" y="82" width="22" height="22" rx="5" fill="#e0f2fe" opacity="0.92" transform="rotate(-10 87 93)" />
            <rect className="ice-2" x="104" y="86" width="20" height="20" rx="5" fill="#f0f9ff" opacity="0.92" transform="rotate(12 114 96)" />
        </svg>
    );
}

function BoilingVerdict(props) {
    const celsius = parseFloat(props.celsius);
    const isBoiling = !Number.isNaN(celsius) && celsius >= 100;
    const status = isBoiling ? "boiling" : "not-boiling";

    return (
        <div className={`verdict-container ${status}`}>
            <div className="verdict-illustration">
                {isBoiling ? <BoilingIllustration /> : <CoolIllustration />}
            </div>
            <p className={`verdict-text ${status}`}>
                {isBoiling ? "물이 끓습니다." : "물이 끓지 않습니다."}
            </p>
        </div>
    );
}

export default BoilingVerdict;
