import "./App.css";
import { Login } from "./pages/Auth/Login";
import { HomePage } from "./pages/HomePage";
// import { Portfolio } from "./Portfolio";
// import { Button } from "./shared/components/Button";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const token = useAuthStore((s) => s.accessToken);
  return (
    <>
      {/* Temporary bypass for testing UI */}
      {/* <HomePage />
      <Portfolio />
      <Button /> */}

      {token ? <HomePage /> : <Login />}
    </>
  );
}

export default App;
