import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black">
      <div className="text-7xl font-bold text-white">404</div>
      <Link to="/" className="text-white underline text-lg mt-4">Go back to Home</Link>
    </div>
  )
}

export default NotFound