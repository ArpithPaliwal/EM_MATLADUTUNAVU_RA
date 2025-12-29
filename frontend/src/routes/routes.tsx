import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import SignupPage from "../pages/LandingPage/SignupPage";
import LoginPage from "../pages/LandingPage/LoginPage";
import VerifyOtp from "../pages/LandingPage/VerifyOtp";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verifyotp" element={<VerifyOtp />} />
    </>
  )
);

export default router;
