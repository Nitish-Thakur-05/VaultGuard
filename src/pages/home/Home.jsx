import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";
import ShieldIcon from "@mui/icons-material/Shield";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShieldIcon fontSize="large" />,
      title: "Military-Grade Encryption",
      description:
        "Your passwords are protected with AES-256 encryption, the same standard used by governments.",
    },
    {
      icon: <LockIcon fontSize="large" />,
      title: "Zero-Knowledge Architecture",
      description:
        "We never see your passwords. Only you have the keys to unlock your vault.",
    },
    {
      icon: <KeyIcon fontSize="large" />,
      title: "Password Generator",
      description:
        "Create strong, unique passwords instantly with our built-in generator.",
    },
    {
      icon: <AutoAwesomeIcon fontSize="large" />,
      title: "Smart Autofill",
      description:
        "Seamlessly fill in your credentials across all your favorite sites and apps.",
    },
  ];

  const benefits = [
    "Unlimited password storage",
    "Cross-device sync",
    "Secure password sharing",
    "Dark web monitoring",
    "Two-factor authentication",
    "Priority support",
  ];

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.logoSection}>
          <ShieldIcon fontSize="medium" />
          <span>VaultGuard</span>
        </div>

        <div className={styles.navButtons}>
          <button
            onClick={() => navigate("/login")}
            className={styles.ghostBtn}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className={styles.primaryBtn}
          >
            Create Account
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <h1>
          Your passwords, <span>protected</span>
        </h1>
        <p>
          The most secure way to store, manage, and access your passwords across
          all your devices.
        </p>

        <div className={styles.heroButtons}>
          <button
            onClick={() => navigate("/register")}
            className={styles.primaryBtn}
          >
            Get Started Free <ArrowForwardIcon fontSize="small" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className={styles.outlineBtn}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2>Security you can trust</h2>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.benefits}>
        <h2>Everything you need to stay secure online</h2>

        <ul className={styles.benefitList}>
          {benefits.map((benefit, index) => (
            <li key={index}>
              <CheckCircleIcon fontSize="small" />
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Ready to secure your passwords?</h2>
        <button
          onClick={() => navigate("/register")}
          className={styles.primaryBtn}
        >
          Create Free Account <ArrowForwardIcon fontSize="small" />
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <ShieldIcon fontSize="small" />
        <span>© 2024 VaultGuard</span>
      </footer>
    </div>
  );
};

export default Home;
