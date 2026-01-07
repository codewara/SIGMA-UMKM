'use client';

export default function BackgroundElements() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Sparkle particles */}
            <div className="absolute top-32 right-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-ping"></div>
            <div className="absolute top-48 right-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-64 right-1/2 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-96 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>

            {/* Gradient mesh */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-pink-400 to-transparent rounded-full blur-2xl"></div>
            </div>
        </div>
    );
}
