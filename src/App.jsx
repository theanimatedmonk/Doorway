import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import LinkDetails from './pages/LinkDetails'
import VisitorPage from './pages/VisitorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<Dashboard />} />
          <Route path="/links/:id" element={<LinkDetails />} />
          <Route path="/:slug" element={<VisitorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
