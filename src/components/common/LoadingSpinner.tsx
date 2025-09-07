interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

export function LoadingSpinner({
    size = "md",
    text = "Loading...",
    className = ""
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-16 w-16"
    };

    return (
        <div className={`flex items-center justify-center py-12 ${className}`}>
            <div className="text-center">
                <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}></div>
                <p className="text-gray-600">{text}</p>
            </div>
        </div>
    );
}
