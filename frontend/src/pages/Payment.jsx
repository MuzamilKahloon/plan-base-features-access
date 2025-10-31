import { useState } from "react";
import axios from "axios";

const plans = [
  { type: "basic", price: 9, name: "Basic Plan" },
  { type: "normal", price: 29, name: "Normal Plan" },
  { type: "pro", price: 99, name: "Pro Plan" },
];

const Payment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (planType) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/payment/create-checkout-session",
        { planType },
        { withCredentials: true }
      );
      window.location.href = res.data.url;
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-12 p-6">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.type}
            className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition"
          >
            <h3 className="text-2xl font-bold text-indigo-950">{plan.name}</h3>
            <p className="text-4xl font-bold mt-4">${plan.price}</p>
            <button
              onClick={() => handlePayment(plan.type)}
              disabled={loading}
              className="mt-6 w-full bg-indigo-950 text-white py-3 rounded hover:bg-indigo-800 disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payment;