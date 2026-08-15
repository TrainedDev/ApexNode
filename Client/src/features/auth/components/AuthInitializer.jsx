import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userAuthStatus } from "../authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userAuthStatus());
  }, [dispatch]);

  return null;
};

export default AuthInitializer;