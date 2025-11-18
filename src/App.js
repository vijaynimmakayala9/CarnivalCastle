// Add these at the top of your file (usually App.js or component file)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Home from "./components/Home";
import Terms from "./components/Terms";
import Faqs from "./components/Faqs";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Enquiry from "./components/Enquiry";
import Reviews from "./components/Reviews";
import Checkout from "./components/Checkout";
import Theaters from "./components/Theaters";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import RefundPolicy from "./components/RefundPolicy";
import PrivacyPolicy from "./components/PrivacyPolicy";
import BookingDetails from "./components/BookingDetails";
import Cakes from "./components/Cakes"
import Basicplan from "./components/Basicplan"
import Occassions from "./components/Occassions"
import CakesComponent from "./components/CakesComponent"
import AddOns from "./components/AddOns"
import BookingSummary from "./components/BookingSummary"
// ComboForm
import ComboForm from "./components/ComboForm"
import ComboPlans from "./components/ComboPlans"
import ComboOccassions from "./components/ComboOccassions"
import ComboBooking from "./components/ComboBooking"
// ThankYou Page
import ThankYou from "./components/ThankYou"
import PaymentFail from "./components/PaymentFail"
import PaymentProcessing from "./components/PaymentProcessing"
import Food from "./components/Food"
import MyProfile from "./Profile/MyProfile";
import LocationSelector from "./components/LocationSelector";
import ScrollToTop from "./components/ScrollToTop";
import Blogs from "./Blogs/Blogs";
import BlogDetail from "./Blogs/BlogDetail";


function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/Reviews" element={<Reviews />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/locations" element={<LocationSelector />} />
        <Route path="/theaters/:slug" element={<Theaters />} />
        <Route path="/booknow" element={<Theaters />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/RefundPolicy" element={<RefundPolicy />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/BookingDetails" element={<BookingDetails />} />
        <Route path="/Faqs" element={<Faqs />} />
        <Route path="/cakes" element={<Cakes />} />
        <Route path="/addons" element={<Cakes />} />
        <Route path="/Basicplan" element={<Basicplan />} />
        <Route path="/Occassions" element={<Occassions />} />
        <Route path="/CakesComponent" element={<CakesComponent />} />
        <Route path="/AddOnscomponent" element={<AddOns />} />
        <Route path="/BookingSummary" element={<BookingSummary />} />
        {/* Combo Plans */}
        <Route path="/ComboForm" element={<ComboForm />} />
        <Route path="/ComboOccassions" element={<ComboOccassions />} />
        <Route path="/ComboPlans" element={<ComboPlans />} />
        <Route path="/ComboBooking" element={<ComboBooking />} />
        <Route path="/Food" element={<Food />} />

        {/* ThankYou Page */}
        {/* <Route path="/ThankYou" element={<ThankYou/>} /> */}
        <Route path="/payment-success" element={<ThankYou />} />

        {/* payment processing */}
        <Route path="/payment-processing" element={<PaymentProcessing />} />

        {/* Payment Fial */}
        <Route path="/payment-fail" element={<PaymentFail />} />

        <Route path="/profile" element={<MyProfile />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

      </Routes>
    </div>
  );
}

export default App;
