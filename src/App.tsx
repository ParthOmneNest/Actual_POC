
import './App.css'
import { HomePage } from './pages/HomePage'
import { Login } from './pages/Auth/Login'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const token = useAuthStore((state) => state.accessToken);

  return (
    <>
     {/* Temporary bypass for testing UI */}
     <HomePage />
     {/* {token ? <HomePage /> : <Login />} */}
    </>
  )
}

export default App
