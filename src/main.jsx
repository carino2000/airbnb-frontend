import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import AirbnbHomePage from "./pages/AirbnbHomePage";
import AirbnbRoomsPage from "./pages/AirbnbRoomsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AirbnbHomePage />,
  },
  {
    path: "/room",
    element: <AirbnbRoomsPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
