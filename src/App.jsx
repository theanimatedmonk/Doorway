import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CreateLink from './pages/CreateLink'
import LinkDetails from './pages/LinkDetails'
import VisitorPage from './pages/VisitorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateLink />} />
          <Route path="/links/:id" element={<LinkDetails />} />
          <Route path="/:slug" element={<VisitorPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
