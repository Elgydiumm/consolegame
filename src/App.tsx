import { useState, useEffect, useRef } from 'react'
import './App.css'
import ConsoleComponent from './components/Console/ConsoleComponent'
import { ConsoleInfo } from './components/Console/types'
import ContextMenuComponent from './components/ContextMenu/ContextMenuComponent'
import { createClient } from '@supabase/supabase-js'

function App() {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const supabase = createClient('https://tdnqbinubcyorkhemmvn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbnFiaW51YmN5b3JraGVtbXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODA2MTcsImV4cCI6MjA1OTc1NjYxN30.9DHjJzUtA_38JjcDWZ6XkoLztw2FMJiVZQHuBZChqms');
  const [consoles, setConsoles] = useState<ConsoleInfo[]>([
    {
      id: 'terminal_1',
      title: 'terminal_1',
      position: { x: 50, y: 50 },
      size: { width: 600, height: 400 },
      visible: true,
    },
    {
      id: 'terminal_2',
      title: 'terminal_2',
      position: { x: 650, y: 150 },
      size: { width: 500, height: 350 },
      visible: true,
    }
  ]);

  const handleContextMenu = (event: React.MouseEvent) => {
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  }

  const handleCloseConsole = (consoleId: string) => {
    setConsoles(prevConsoles => 
      prevConsoles.map(console => 
        console.id === consoleId 
          ? { ...console, visible: false } 
          : console
      )
    );
  };

  const handleCreateConsole = () => {
    const newId = `terminal_${consoles.length + 1}`;
    
    const newConsole: ConsoleInfo = {
      id: newId,
      title: `terminal_${newId}`,
      position: {
        x: contextMenuPosition.x,
        y: contextMenuPosition.y
      },
      size: { width: 600, height: 400 },
      visible: true,
    };
    
    setConsoles([...consoles, newConsole]);
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative" onContextMenu={handleContextMenu}>
      <ContextMenuComponent onCreateConsole={handleCreateConsole} />
      {consoles.filter(c => c.visible).map(console => (
        <div key={console.id} onContextMenu={handleContextMenu}>
          <ConsoleComponent 
            key={console.id}
            title={console.title} 
            id={console.id}
            initialPosition={console.position}
            initialSize={console.size}
            supabaseConnection={supabase}
            onClose={() => handleCloseConsole(console.id)}
          />
        </div>
      ))}
    </div>
    
  )
}

export default App
