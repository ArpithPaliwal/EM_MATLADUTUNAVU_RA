import { createBrowserRouter, createRoutesFromElements ,Route} from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<LandingPage/>}/>
));

export default router;
