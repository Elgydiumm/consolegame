import { useState, useEffect, useRef, MouseEvent } from 'react'
import './Console.css'
import { InputWithButton } from '../ui/InputWithButton'

interface ConsoleComponentProps {
    title: string;
    onCommand: (command: string) => void;
    initialPosition?: { x: number; y: number };
    initialSize?: { width: number; height: number };
    onClose?: () => void;
}

export default function ConsoleComponent({
    title,
    onCommand,
    initialPosition = { x: 100, y: 100 },
    initialSize = { width: 600, height: 400 },
    onClose
}: ConsoleComponentProps) {
    const [history, setHistory] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const consoleRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Dragging state
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Resizing state
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState('');

    // Active state for z-index
    const [isActive, setIsActive] = useState(false);

    const handleClose = (e: MouseEvent) => {
        e.stopPropagation(); // Prevent triggering other click handlers
        if (onClose) {
            onClose();
        }
    };

    const addToHistory = (value: string) => {
        onCommand(value);
        setHistory([...history, value]);
    }

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();

            const handleFocusLoss = () => {
                if (isActive && inputRef.current && document.activeElement !== inputRef.current) {
                    inputRef.current.focus();
                }
            };

            const focusDelay = setInterval(handleFocusLoss, 200);

            return () => {
                clearInterval(focusDelay);
            };
        }
    }, [isActive]);

    const handleHeaderMouseDown = (e: MouseEvent) => {
        if (consoleRef.current) {
            setIsDragging(true);
            setIsActive(true);
            const rect = consoleRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
        e.preventDefault();
    };

    // Handle mousedown on resize handles
    const handleResizeMouseDown = (e: MouseEvent, direction: string) => {
        if (consoleRef.current) {
            setIsResizing(true);
            setIsActive(true);
            setResizeDirection(direction);
        }
        e.stopPropagation();
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                });
            } else if (isResizing) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;

                // Calculate new dimensions and positions based on the resize direction
                switch (resizeDirection) {
                    case 'top-left':
                        // For top-left, both width/height and position need to change
                        const newWidth1 = Math.max(200, position.x + size.width - mouseX);
                        const newHeight1 = Math.max(150, position.y + size.height - mouseY);
                        setSize({ width: newWidth1, height: newHeight1 });
                        setPosition({
                            x: Math.min(position.x + size.width - 200, mouseX),
                            y: Math.min(position.y + size.height - 150, mouseY)
                        });
                        break;

                    case 'top-right':
                        // For top-right, width extends right from current left edge
                        const newWidth2 = Math.max(200, mouseX - position.x);
                        const newHeight2 = Math.max(150, position.y + size.height - mouseY);
                        setSize({ width: newWidth2, height: newHeight2 });
                        setPosition({
                            x: position.x,
                            y: Math.min(position.y + size.height - 150, mouseY)
                        });
                        break;

                    case 'bottom-left':
                        // For bottom-left, width shrinks from right, height extends down
                        const newWidth3 = Math.max(200, position.x + size.width - mouseX);
                        const newHeight3 = Math.max(150, mouseY - position.y);
                        setSize({ width: newWidth3, height: newHeight3 });
                        setPosition({
                            x: Math.min(position.x + size.width - 200, mouseX),
                            y: position.y
                        });
                        break;

                    case 'bottom-right':
                        // For bottom-right, simply set the width and height based on mouse position
                        setSize({
                            width: Math.max(200, mouseX - position.x),
                            height: Math.max(150, mouseY - position.y)
                        });
                        break;

                    // Handle edge resize cases
                    case 'top':
                        // Resize from top edge - height changes and y position changes
                        const newHeight4 = Math.max(150, position.y + size.height - mouseY);
                        setSize({ ...size, height: newHeight4 });
                        setPosition({
                            ...position,
                            y: Math.min(position.y + size.height - 150, mouseY)
                        });
                        break;

                    case 'right':
                        // Resize from right edge - only width changes
                        const newWidth4 = Math.max(200, mouseX - position.x);
                        setSize({ ...size, width: newWidth4 });
                        break;

                    case 'bottom':
                        // Resize from bottom edge - only height changes
                        const newHeight5 = Math.max(150, mouseY - position.y);
                        setSize({ ...size, height: newHeight5 });
                        break;

                    case 'left':
                        // Resize from left edge - width changes and x position changes
                        const newWidth5 = Math.max(200, position.x + size.width - mouseX);
                        setSize({ ...size, width: newWidth5 });
                        setPosition({
                            ...position,
                            x: Math.min(position.x + size.width - 200, mouseX)
                        });
                        break;
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);

            if (isActive && inputRef.current) {
                inputRef.current.focus();
            }
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset, position, size, resizeDirection, isActive]);

    const handleConsoleClick = () => {
        setIsActive(true);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    useEffect(() => {
        const handleDocumentClick = (e: globalThis.MouseEvent) => {
            if (consoleRef.current && !consoleRef.current.contains(e.target as Node)) {
                setIsActive(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);

    return (
        <div
            ref={consoleRef}
            className={`draggable-console ${isActive ? 'active' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`
            }}
            onClick={handleConsoleClick}
        >
            <div className="terminal-container">
                <div className="terminal-window">
                    <div
                        className="resize-handle top-left"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
                    />
                    <div
                        className="resize-handle top-right"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
                    />
                    <div
                        className="resize-handle bottom-left"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
                    />
                    <div
                        className="resize-handle bottom-right"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
                    />
                    <div
                        className="resize-handle top"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
                    />
                    <div
                        className="resize-handle right"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
                    />
                    <div
                        className="resize-handle bottom"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
                    />
                    <div
                        className="resize-handle left"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
                    />

                    <div className="terminal-header" onMouseDown={handleHeaderMouseDown}>
                        <div className="terminal-controls">
                            <button
                                className="terminal-control close"
                                onClick={handleClose}
                                aria-label="Close terminal"
                            >×</button>
                        </div>
                        <div className="terminal-title">{title}</div>
                    </div>

                    {/* Terminal content */}
                    <div className="terminal-content" ref={contentRef}>
                        {history.length === 0 ? (
                            <div className="terminal-placeholder">Type a command and press Enter</div>
                        ) : (
                            <div className="terminal-history">
                                {history.map((item, index) => (
                                    <div key={index} className="terminal-command">
                                        <div className="flex">
                                            <span className="terminal-prompt">h4x0r@m4trix:~$</span>
                                            <span>{item}</span>
                                        </div>
                                        <div className="terminal-response">
                                            Command processed: "{item}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    <div className="terminal-input-area">
                        <span className="terminal-prompt">h4x0r@m4trix:~$</span>
                        <div className="flex-1">
                            <InputWithButton addToHistory={addToHistory} inputRef={inputRef} isEnabled={isActive} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}