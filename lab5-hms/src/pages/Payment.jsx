import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function Payment() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const res = await API.get("/payments");
    setPayments(res.data.data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payment History</h1>

      {payments.map((p) => (
        <div key={p._id} className="bg-white p-5 rounded shadow">
          <p><b>Amount:</b> ₹{p.amount}</p>
          <p><b>Status:</b> {p.status}</p>
          <p className="text-sm text-gray-500">
            {new Date(p.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Payment;