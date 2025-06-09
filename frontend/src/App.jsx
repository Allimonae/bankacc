import { Route, Routes } from 'react-router-dom'
import { CreateAccount } from './pages/CreateAccount'
import { HomeScreen } from './pages/HomeScreen'
import { Settings } from './pages/Settings'
import { SignIn } from './pages/SignIn'
import { Welcome } from './pages/Welcome'
import { Transactions } from './pages/Transactions'
import { Runner } from './components/Runner'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useLocation, Navigate } from 'react-router-dom'
import { Actions } from './pages/Actions'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    <div>
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-xl font-mono">Loading...</p>
        </div>
      </div>
    </div>
  }

  if (!user) {
    return <Navigate to="/sign-in" 
    state={{ from: location.pathname, 
    message: "You must be signed in to access settings"
  }} 
  replace 
  />;
  }

  return children;
};


function App() {
  return (
    <div>
      <Runner />
      <main>
        <AuthProvider>
        <Routes> 
          <Route path="/" element={<Welcome />} />
          <Route path="/sign-up" element={<CreateAccount />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            // <ProtectedRoute>
              <Transactions />
            // </ProtectedRoute>
          } />
          <Route path="/actions" element={
            // <ProtectedRoute>
              <Actions />
            // </ProtectedRoute>
          } />

          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
        </AuthProvider>
      </main>
    </div>
  )
}

export default App