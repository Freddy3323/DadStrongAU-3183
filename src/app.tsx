import RequireAuth from "@/components/RequireAuth";
import Home from "@/pages/home";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Welcome from "@/pages/onboarding/welcome";
import Disclaimer from "@/pages/onboarding/disclaimer";
import Profile from "@/pages/onboarding/profile";
import LegalAssistant from "@/pages/legal-assistant";
import Journal from "@/pages/journal";
import AVOToolkit from "@/pages/avo-toolkit";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/onboarding/welcome" element={<Welcome />} />
        <Route path="/onboarding/disclaimer" element={<Disclaimer />} />
        <Route path="/onboarding/profile" element={<Profile />} />

        <Route
          path="/legal-assistant"
          element={
            <RequireAuth>
              <LegalAssistant />
            </RequireAuth>
          }
        />
        <Route
          path="/journal"
          element={
            <RequireAuth>
              <Journal />
            </RequireAuth>
          }
        />
        <Route
          path="/avo-toolkit"
          element={
            <RequireAuth>
              <AVOToolkit />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
