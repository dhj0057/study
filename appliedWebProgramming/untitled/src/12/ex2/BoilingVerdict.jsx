import React from "react";

function BoilingVerdict(props) {
    const isBoiling = props.celsius >= 100;

    if (isBoiling) {
        return (
            <div className="verdict-container boiling">
                <div className="verdict-illustration" aria-hidden="true">
                    <svg
                        className="verdict-svg"
                        viewBox="0 0 200 180"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="hotWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ff758c" />
                                <stop offset="50%" stopColor="#ff4b2b" />
                                <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                            <linearGradient id="flameGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                                <stop offset="0%" stopColor="#fde047" />
                                <stop offset="50%" stopColor="#fb923c" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                            <radialGradient id="hotAura" cx="50%" cy="55%" r="48%">
                                <stop offset="0%" stopColor="rgba(255, 94, 58, 0.45)" />
                                <stop offset="100%" stopColor="rgba(255, 94, 58, 0)" />
                            </radialGradient>
                        </defs>

                        {/* 배경 후광 */}
                        <circle cx="100" cy="95" r="78" fill="url(#hotAura)" className="aura-pulse" />

                        {/* 피어오르는 김 (Steam) */}
                        <path
                            className="steam steam-1"
                            d="M75 42 C68 32, 82 22, 75 12"
                            stroke="#fed7aa"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                        />
                        <path
                            className="steam steam-2"
                            d="M100 38 C93 26, 107 16, 100 6"
                            stroke="#ffffff"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <path
                            className="steam steam-3"
                            d="M125 42 C118 32, 132 22, 125 12"
                            stroke="#fed7aa"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                        />

                        {/* 비커/냄비 본체 뒷배경 */}
                        <rect
                            x="52"
                            y="48"
                            width="96"
                            height="86"
                            rx="18"
                            fill="rgba(255, 255, 255, 0.1)"
                            stroke="rgba(255, 255, 255, 0.65)"
                            strokeWidth="3"
                        />

                        {/* 끓는 물 영역 */}
                        <path
                            className="water-wave-hot"
                            d="M54 74 Q76 66, 100 74 T146 74 L146 116 C146 125, 139 132, 130 132 L70 132 C61 132, 54 125, 54 116 Z"
                            fill="url(#hotWaterGrad)"
                        />

                        {/* 보글보글 기포 (Bubbles) */}
                        <circle className="bubble bubble-1" cx="76" cy="116" r="6" fill="#fffbeb" />
                        <circle className="bubble bubble-2" cx="98" cy="108" r="8" fill="#fef3c7" />
                        <circle className="bubble bubble-3" cx="122" cy="118" r="5.5" fill="#fffbeb" />
                        <circle className="bubble bubble-4" cx="86" cy="92" r="4.5" fill="#ffffff" />
                        <circle className="bubble bubble-5" cx="112" cy="95" r="6.5" fill="#fef3c7" />

                        {/* 비커 눈금 */}
                        <line x1="128" y1="68" x2="138" y2="68" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="124" y1="86" x2="138" y2="86" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="128" y1="104" x2="138" y2="104" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />

                        {/* 하단 불꽃 (Flames) */}
                        <g className="flame-group">
                            <path
                                d="M78 164 C68 152, 76 138, 84 134 C82 144, 90 148, 86 164 Z"
                                fill="url(#flameGrad)"
                            />
                            <path
                                d="M100 168 C86 152, 95 132, 100 124 C105 132, 114 152, 100 168 Z"
                                fill="url(#flameGrad)"
                            />
                            <path
                                d="M122 164 C114 148, 120 144, 116 134 C124 138, 132 152, 122 164 Z"
                                fill="url(#flameGrad)"
                            />
                        </g>
                    </svg>
                </div>
                <p className="verdict-text boiling">물이 끓습니다.</p>
            </div>
        );
    }

    return (
        <div className="verdict-container not-boiling">
            <div className="verdict-illustration" aria-hidden="true">
                <svg
                    className="verdict-svg"
                    viewBox="0 0 200 180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="coolWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#0284c7" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                        <radialGradient id="coolAura" cx="50%" cy="55%" r="48%">
                            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.42)" />
                            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                        </radialGradient>
                    </defs>

                    {/* 배경 쿨 후광 */}
                    <circle cx="100" cy="95" r="78" fill="url(#coolAura)" className="aura-cool" />

                    {/* 반짝이는 냉기/물방울 포인트 */}
                    <circle className="sparkle sparkle-1" cx="68" cy="34" r="3.5" fill="#bae6fd" />
                    <circle className="sparkle sparkle-2" cx="132" cy="30" r="4.5" fill="#7dd3fc" />
                    <path
                        className="droplet-float"
                        d="M100 18 C100 18, 91 30, 91 35 C91 40, 95 44, 100 44 C105 44, 109 40, 109 35 C109 30, 100 18, 100 18 Z"
                        fill="#38bdf8"
                    />

                    {/* 비커 본체 */}
                    <rect
                        x="52"
                        y="48"
                        width="96"
                        height="86"
                        rx="18"
                        fill="rgba(255, 255, 255, 0.08)"
                        stroke="rgba(186, 230, 253, 0.7)"
                        strokeWidth="3"
                    />

                    {/* 잔잔한 물 영역 */}
                    <path
                        className="water-wave-cool"
                        d="M54 84 Q77 80, 100 84 T146 84 L146 116 C146 125, 139 132, 130 132 L70 132 C61 132, 54 125, 54 116 Z"
                        fill="url(#coolWaterGrad)"
                    />

                    {/* 둥둥 떠 있는 얼음 조각 (Ice Cubes) */}
                    <g className="ice-cube ice-1">
                        <rect
                            x="68"
                            y="74"
                            width="22"
                            height="20"
                            rx="5"
                            transform="rotate(-8 68 74)"
                            fill="rgba(224, 242, 254, 0.82)"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                        />
                    </g>
                    <g className="ice-cube ice-2">
                        <rect
                            x="104"
                            y="76"
                            width="20"
                            height="18"
                            rx="5"
                            transform="rotate(10 104 76)"
                            fill="rgba(224, 242, 254, 0.78)"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                        />
                    </g>

                    {/* 비커 눈금 */}
                    <line x1="128" y1="68" x2="138" y2="68" stroke="rgba(186,230,253,0.75)" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="124" y1="86" x2="138" y2="86" stroke="rgba(186,230,253,0.75)" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="128" y1="104" x2="138" y2="104" stroke="rgba(186,230,253,0.75)" strokeWidth="2.5" strokeLinecap="round" />

                    {/* 하단 쿨 받침 라인 */}
                    <rect x="64" y="144" width="72" height="6" rx="3" fill="rgba(56, 189, 248, 0.45)" />
                </svg>
            </div>
            <p className="verdict-text not-boiling">물이 끓지 않습니다.</p>
        </div>
    );
}

export default BoilingVerdict;