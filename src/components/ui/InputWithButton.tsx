import { useState, forwardRef, RefObject } from "react"
import { Input } from "@/components/ui/input"

interface InputWithButtonProps {
  addToHistory: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  isEnabled?: boolean;
}
 
export function InputWithButton({ 
  addToHistory, 
  inputRef,
  isEnabled = true 
}: InputWithButtonProps) {
  const [inputValue, setInputValue] = useState("")
  
  const handleButtonClick = () => {
    if (inputValue.trim() && isEnabled) {
      addToHistory(inputValue)
      setInputValue("")
    }
  }

  return (
    <div className="flex w-full items-center">
      <Input 
        ref={inputRef}
        type="text" 
        placeholder={isEnabled ? "" : "Terminal inactive"} 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter" && isEnabled) {
                handleButtonClick();
            }
        }}
        disabled={!isEnabled}
        className={`border-none bg-transparent focus:ring-0 focus-visible:ring-0 pl-0 ${
          isEnabled 
            ? "text-[#00ff00] placeholder:text-[#008800]" 
            : "text-[#006600] placeholder:text-[#003300] cursor-not-allowed"
        }`}
        style={{ 
          textShadow: isEnabled ? '0 0 5px #0f0' : 'none', 
          fontFamily: 'monospace' 
        }}
      />
    </div>
  )
}