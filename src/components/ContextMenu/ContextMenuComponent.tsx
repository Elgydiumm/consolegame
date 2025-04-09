import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import './ContextMenuComponent.css'

interface ContextMenuProps {
  onCreateConsole?: () => void;
}

export default function ContextMenuComponent({ onCreateConsole }: ContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full w-full absolute inset-0" />
      <ContextMenuContent className="bg-black border border-[var(--hacker-dark-green)] text-[var(--hacker-green)]">
        <ContextMenuItem onClick={onCreateConsole} className="hover:bg-[#003300] focus:bg-[#003300] cursor-pointer">
          New Terminal
        </ContextMenuItem>
        <ContextMenuItem className="hover:bg-[#003300] focus:bg-[#003300] cursor-pointer">
          System Status
        </ContextMenuItem>
        <ContextMenuItem className="hover:bg-[#003300] focus:bg-[#003300] cursor-pointer">
          Network Scan
        </ContextMenuItem>
        <ContextMenuItem className="hover:bg-[#003300] focus:bg-[#003300] cursor-pointer">
          Clear Desktop
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}