
import './App.scss';
import Header from './component/Header';
import Container from 'react-bootstrap/Container';
import { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@fortawesome/fontawesome-free/css/all.min.css";


import { UserContext } from './component/UserContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { user, loginContext } = useContext(UserContext)
  useEffect(() => {
    if (localStorage.getItem('token')) {
      loginContext(localStorage.getItem("email"),
        localStorage.getItem("token"))
    }
  }, [])
  return (
    <>
      <div className="app-container">
        <Header />
        <Container>
          <AppRoutes />
        </Container>



      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
