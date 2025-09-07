interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
    className?: string;
}

export function ErrorMessage({
    message,
    onDismiss,
    className = ""
}: ErrorMessageProps) {
    return (
        <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md ${className}`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="ml-4 text-red-500 hover:text-red-700"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}
