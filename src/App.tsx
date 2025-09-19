import { HelmetProvider } from "react-helmet-async"
import AppNavigation from "./navigation/Navigation"
import { Provider } from 'react-redux'
import store from "./redux/store"
import { AuthProvider } from "./contexts/AuthContext"

function App() {

  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <HelmetProvider>
            <AppNavigation />
          </HelmetProvider>
        </AuthProvider>
      </Provider>
    </>
  )
}

export default App