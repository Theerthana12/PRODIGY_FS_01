
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/dashboard", { withCredentials: true })
      .then(res => setData(res.data.message))
      .catch(() => navigate("/"));
  }, []);

  const logout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    navigate("/");
  };

  return (
    <div>
      <h2>{data}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
