import { BrowserRouter,Route,Routes,} from "react-router-dom";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import {Landing} from "./pages/landing"
import { Dashboard } from "./pages/dashboard";
import  ComplexNavbar from "./components/header";
import { Account } from "./pages/account";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Notes } from "./pages/notes";
import { Footer } from "./components/footer";
import { News } from "./pages/news";
function App() {
  return (
    <>
       <BrowserRouter>
        <ComplexNavbar />
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={
             <ProtectedRoute> 
               <Dashboard />
            </ProtectedRoute>
            } />
          <Route path="/account" element={
             <ProtectedRoute> 
               <Account />
            </ProtectedRoute>
            } />
            <Route path="/notes/:stockId" element={
             <ProtectedRoute> 
               <Notes />
            </ProtectedRoute>
            } />
                <Route path="/news" element={
             <ProtectedRoute> 
               <News />
            </ProtectedRoute>
            } />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
