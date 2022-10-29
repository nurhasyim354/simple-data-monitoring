import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Multisensor from "./pages/multisensor";
import NotFound from "./pages/404";


export default function App() {
  return (

    <>
      <div className="jumbotron d-flex align-items-center min-vh-100">
        <div className="container text-center">

          <div className="row-fluid">
            <BrowserRouter>
              <Routes>
                <Route index element={<Home />} />
                <Route path="/multisensor" element={<Multisensor />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>

        </div>
      </div>
    </>


  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);