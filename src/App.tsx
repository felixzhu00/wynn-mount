import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { isAppReadyAtom } from './store/mountStore'
import { BentoMountManager } from './components/BentoMountManager'
import { Sidebar } from './components/Sidebar'
import { MaterialMatrix } from './components/MaterialMatrix'
import { ShoppingList } from './components/ShoppingList'
import { BulkImportExportModal } from './components/BulkImportExportModal'

function App() {
  const isAppReady = useAtomValue(isAppReadyAtom)
  const [activeTab, setActiveTab] = useState<'calculator' | 'matrix'>('calculator')

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <BulkImportExportModal />
      
      <div className="flex-1 overflow-y-auto p-8">
        {!isAppReady ? (
          <div className="w-full max-w-4xl mx-auto space-y-8 p-6 border border-neutral-800 rounded-md animate-pulse">
            <div className="h-8 bg-neutral-900 w-1/3 rounded"></div>
            <div className="h-32 bg-neutral-900 w-full rounded"></div>
            <div className="h-64 bg-neutral-900 w-full rounded"></div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <header className="mb-8 border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-bold tracking-tight">Wynn-Mount Optimizer</h1>
              <p className="text-sm text-neutral-400 mt-1">Optimize your materials based on your mount's levels</p>
              
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setActiveTab('calculator')}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                    activeTab === 'calculator' 
                      ? 'border-white text-white' 
                      : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Calculator
                </button>
                <button 
                  onClick={() => setActiveTab('matrix')}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                    activeTab === 'matrix' 
                      ? 'border-white text-white' 
                      : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Material Matrix
                </button>
              </div>
            </header>
            
            <main>
              {activeTab === 'calculator' ? (
                <div className="space-y-8">
                  <BentoMountManager />
                  <ShoppingList />
                </div>
              ) : (
                <MaterialMatrix />
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
