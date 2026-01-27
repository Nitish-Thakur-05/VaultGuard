import { Navigate } from "react-router-dom";
import { auth } from "../firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  if (user === undefined) return null; // or loader

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
