import React from 'react'
import { Routes, Route } from 'react-router-dom';
//import Home from './pages/Home/Home';
import AddCar from './pages/AddCar/AddCar';
import ManageCar from './pages/ManageCar/ManageCar';
import Booking from './pages/Booking/Booking';
import Login from './pages/login/login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Register from './pages/Register/Register';

const App = () => {
  return (
    <>

   
      <Routes>
  <Route path="/login" element={<Login />} />
 <Route path='/register' element={<Register/>}/>
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <AddCar />
      </ProtectedRoute>
    }
  />

  <Route
    path="/manage-cars"
    element={
      <ProtectedRoute>
        <ManageCar />
      </ProtectedRoute>
    }
  />

  <Route
    path="/bookings"
    element={
      <ProtectedRoute>
        <Booking />
      </ProtectedRoute>
    }
  />
</Routes>
    </>
  )
}

export default App
