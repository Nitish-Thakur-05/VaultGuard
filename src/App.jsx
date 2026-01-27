import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <Outlet />
      <ToastContainer theme="colored" closeOnClick newestOnTop />
    </>
  );
};

export default App;
