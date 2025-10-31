// frontend/src/pages/Success.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Success = () => {
  const navigate = useNavigate();
  const { refreshAccessToken, setUser } = useAuth();

  useEffect(() => {
    const verify = async () => {
      const sessionId = new URLSearchParams(window.location.search).get("session_id");
      if (!sessionId) {
        navigate("/dashboard");
        return;
      }

      try {
        // This will auto-refresh token if 401
        const res = await API.get(`/payment/success?session_id=${sessionId}`);
        alert("Payment successful! Plan upgraded.");

        // Refresh user plan
        const planRes = await API.get("/payment/plan");
        setUser(prev => ({ ...prev, ...planRes.data }));
      } catch (err) {
        console.error("Payment verify failed:", err);
        alert("Payment verification failed");
      } finally {
        navigate("/dashboard");
      }
    };
    verify();
  }, [navigate, setUser]);

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold">Processing Payment...</h2>
    </div>
  );
};

export default Success;