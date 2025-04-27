interface AnimatedLinkProps {
    href: string;
    text: string;
    className?: string;
}

const AnimatedLink = ({ href, text, className = '' }: AnimatedLinkProps) => {
    return (
        <a
            href={href}
            className={`inline-flex items-center gap-1 font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
        >
            <span className="animate-text bg-gradient-to-r from-teal-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
                {text}
            </span>
            <span className="inline-block ml-0.5 animate-bounce text-blue-500">
                <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.5 3C5.5 2.44772 5.94772 2 6.5 2H12.5C13.0523 2 13.5 2.44772 13.5 3V9C13.5 9.55228 13.0523 10 12.5 10C11.9477 10 11.5 9.55228 11.5 9V5.41421L4.70711 12.2071C4.31658 12.5976 3.68342 12.5976 3.29289 12.2071C2.90237 11.8166 2.90237 11.1834 3.29289 10.7929L10.0858 4H6.5C5.94772 4 5.5 3.55228 5.5 3Z"
                        fill="currentColor"
                    />
                </svg>
            </span>
        </a>
    );
};

export default AnimatedLink;
