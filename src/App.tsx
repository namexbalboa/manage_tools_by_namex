import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from './components/layout/Layout'
import { WelcomeModal } from './components/WelcomeModal'
import { Rice } from './pages/Rice'
import { Eisenhower } from './pages/Eisenhower'
import { Gut } from './pages/Gut'
import { ScrumPoker } from './pages/ScrumPoker'

function App() {
  return (
    <Router>
      <WelcomeModal />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/rice" replace />} />
          <Route path="/rice" element={<Rice />} />
          <Route path="/eisenhower" element={<Eisenhower />} />
          <Route path="/gut" element={<Gut />} />
          <Route path="/scrum-poker" element={<ScrumPoker />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" richColors />
    </Router>
  )
}

export default App
