// src/app/App.tsx
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { TransactionProvider } from '@/context/TransactionContext'
import { router } from './router'

export function App() {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <RouterProvider router={router} />
      </TransactionProvider>
    </ThemeProvider>
  )
}
