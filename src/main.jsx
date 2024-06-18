import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ArweaveWalletKit } from "@arweave-wallet-kit/react";
import ArConnectStrategy from "@arweave-wallet-kit/arconnect-strategy";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import View from "./pages/View.jsx";
import ViewPost from "./pages/ViewPost.jsx";
import Following from "./pages/Following.jsx";
import Follower from "./pages/Follower.jsx";
import Discover from "./pages/Discover.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/view",
    element: <View />,
  },
  {
    path: "/view/:postId",
    element: <ViewPost />,
  },
  {
    path: "/create",
    element: <Create />,
  },
  {
    path: "/followers",
    element: <Follower />,
  },
  {
    path: "/following",
    element: <Following />,
  },
  {
    path: "/discover",
    element: <Discover />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "ACCESS_PUBLIC_KEY",
          "SIGN_TRANSACTION",
          "DISPATCH",
        ],
        ensurePermissions: true,
        strategies: [new ArConnectStrategy()],
      }}
    >
      <RouterProvider router={router} />
    </ArweaveWalletKit>
  </React.StrictMode>
);
