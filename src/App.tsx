
import './App.css'
import { HomePage } from './pages/HomePage'
import { Login } from './pages/Login/Login'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const token = useAuthStore((state) => state.accessToken);

  return (
    <>
     {token ? <HomePage /> : <Login />}
    </>
  )
}

export default App
