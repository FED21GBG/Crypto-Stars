import { useNavigate } from "react-router-dom";
import logo from "../logo.svg";
function StartPage() {
  const navigate = useNavigate();
  return (
    <section className="start-section">
      <img
        className="start-logo"
        src={logo}
        alt=""
        onClick={() => navigate("/LoginPage")}
      />
      <h1 className="start-h1">BRÖLLOPSFOTOGRAFEN</h1>
    </section>
  );
}

export default StartPage;
