import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { ApplyPage } from './pages/ApplyPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

// L'espace administrateur est chargé à la demande : les visiteurs du site
// public n'en téléchargent pas le code (allègement du bundle d'entrée).
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })),
)
const AdminLoginPage = lazy(() =>
  import('./pages/AdminLoginPage').then((module) => ({
    default: module.AdminLoginPage,
  })),
)

function PageLoader() {
  return (
    <section className="section">
      <div className="container page-loader">
        <span className="spinner" />
        <p>Chargement de l’espace…</p>
      </div>
    </section>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/demande" element={<ApplyPage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminLoginPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App

