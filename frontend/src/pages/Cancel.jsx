import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="container mx-auto text-center mt-20">
      <h2 className="text-2xl font-bold text-red-600">Payment Cancelled</h2>
      <p className="mt-4">You can try again anytime.</p>
      <Link to="/payment">
        <button className="mt-6 bg-indigo-950 text-white px-6 py-3 rounded hover:bg-indigo-800 transition">
          Back to Payment
        </button>
      </Link>
    </div>
  );
};

export default Cancel;