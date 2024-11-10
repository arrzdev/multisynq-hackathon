import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "@/pages/home"
import NotFound from '@/pages/404';
import Login from '@pages/login';
import CustomHookUsage from '@/views/CustomHookUsage';
import GeoLocationImposer from '@/views/GeoLocationImposer';
import { useEffect, useState } from 'react';
import { requestGeoLocationPermission } from '@utils/geo';
import SplashScreen from '@/views/SplashScreen';

//define the app routes
export default function App() {
  const [geoLocationAvailable, setGeoLocationAvailable] = useState(true);

  const isAuthenticated = () => {
    const token = localStorage.getItem('auth-token');
    if (token === null) return false;

    //we should actually verify if the token is valid but I am not able to do that
    //here because this way of forcing auth doesn't not support jose async verification

    return true;
  };

  // handle the redirect to the login page if the user is not logged in
  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const auth = isAuthenticated();
    if (!auth) return <Navigate to="/login" replace/>;
    return children;
  };

  // handle the redirect to the home page if the user is already logged in
  const RedirectToHome = () => {
    const auth = isAuthenticated();
    if (auth) return <Navigate to="/" replace/>;
    return <Login/>;
  };

  // request geo location permission in the start
  useEffect(() => {
    requestGeoLocationPermission().catch(err => {
      console.error("Error requesting geolocation permission", err);
      setGeoLocationAvailable(false);
    });
  }, []);

  return (
    <div>
      {!geoLocationAvailable ? (<GeoLocationImposer/>) : (
          <Router>
            <Routes>
            <Route path="/" element={<RequireAuth><Home/></RequireAuth>}/>
            <Route path="/login" element={<RedirectToHome/>}/>
            <Route path="/test" element={<CustomHookUsage/>}/>
  
            {/* 404 page */}
            <Route path="*" element={<NotFound/>}/>
          </Routes>
          </Router>
        )
      }
    </div>
  )
}