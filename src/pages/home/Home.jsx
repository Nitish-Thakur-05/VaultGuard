import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h1 style={{color: "white"}}>home page</h1>
      <button onClick={() => navigate("/register")}>click me</button>
    </section>
  );
};

export default Home;
