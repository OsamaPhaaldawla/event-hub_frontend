import { createBrowserRouter, RouterProvider } from "react-router";

import HomePage from "./routes/HomePage";
import Events from "./routes/Events";
import Login from "./routes/Login";
import Layout from "./routes/Layout";
import AdminRegister from "./routes/AdminRegister";

import { loader as eventsLoader } from "./components/RecentlyEvents";
import { loader as eventDetailsLoader } from "./routes/EventDetails";
import EventDetails from "./routes/EventDetails";
import Error from "./routes/Error";
import Host, { action as hostAction, editDataLoader } from "./routes/Host";
import { loader as venuesLoader } from "./components/Form/Step2";
import { AuthProvider } from "./context/AuthContext";
import CreateVenue, { action as VenueFormAction } from "./routes/CreateVenue";
import Venues from "./routes/Venues";
import PendingVenues, {
  loader as pendingVenuesLoader,
} from "./routes/PendingVenues";
import VenueDetails, {
  loader as venueDetailsLoader,
} from "./routes/VenueDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./routes/Register";
import MyEvents, { loader as MyEventsLoader } from "./routes/MyEvents";
import MyVenues, { loader as MyVenuesLoader } from "./routes/MyVenues";
import EditSlots from "./routes/EditSlots";
import Payment from "./components/Stripe/Payment";
import PaymentSuccess from "./components/Stripe/PaymentSuccess";
import MyTickets from "./routes/MyTickets";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: eventsLoader,
      },
      {
        path: "/events",
        element: <Events />,
        loader: eventsLoader,
      },
      {
        path: "/events/:eventId",
        element: <EventDetails />,
        loader: eventDetailsLoader,
      },
      {
        path: "/host",
        element: (
          <ProtectedRoute roles={["admin", "hoster"]}>
            <Host key="host-event" />
          </ProtectedRoute>
        ),
        loader: venuesLoader,
        action: hostAction,
      },
      {
        path: "/events/:eventId/edit",
        element: (
          <ProtectedRoute roles={["admin", "hoster"]}>
            <Host edit key="edit-event" />
          </ProtectedRoute>
        ),
        loader: editDataLoader,
        action: hostAction,
      },
      {
        path: "/admin",
        element: <AdminRegister />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/venues",
        element: <Venues />,
        loader: venuesLoader,
      },
      {
        path: "/venues/:venueId",
        element: <VenueDetails />,
        loader: venueDetailsLoader,
      },
      {
        path: "/vendor/edit-venue/:venueId",
        element: (
          <ProtectedRoute roles={["vendor"]}>
            <CreateVenue edit key={"edit-venue"} />
          </ProtectedRoute>
        ),
        loader: venueDetailsLoader,
        action: VenueFormAction,
      },
      {
        path: "/vendor/create-venue",
        element: (
          <ProtectedRoute roles={["vendor"]}>
            <CreateVenue key={"create-venue"} />
          </ProtectedRoute>
        ),
        action: VenueFormAction,
      },
      {
        path: "/hoster/events",
        element: (
          <ProtectedRoute roles={["hoster"]}>
            <MyEvents />
          </ProtectedRoute>
        ),
        loader: MyEventsLoader,
      },
      {
        path: "/vendor/venues",
        element: (
          <ProtectedRoute roles={["vendor"]}>
            <MyVenues />
          </ProtectedRoute>
        ),
        loader: MyVenuesLoader,
      },
      {
        path: "/venues/:venueId/edit-slots",
        element: (
          <ProtectedRoute roles={["vendor"]}>
            <EditSlots />
          </ProtectedRoute>
        ),
        // loader: EditSlotsLoader,
      },
      {
        path: "/admin/pending-venues",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <PendingVenues />
          </ProtectedRoute>
        ),
        loader: pendingVenuesLoader,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/host-payment",
        element: <Payment />,
        action: hostAction,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/my-tickets",
        element: <MyTickets />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
