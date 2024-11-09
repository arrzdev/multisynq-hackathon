import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "@/pages/home"
import NotFound from '@/pages/404';
import "@/globals.css"

//define the app routes
export default function App() {
  return (
    <Router>
      <Routes>  
        {/* actual routes */}
        <Route path="/" element={<Home/>}/>

        {/* 404 page */}
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}