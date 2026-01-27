import { useEffect, useState } from "react";
import styles from "./forgetPasswordModal.module.css";
import Input from "../input/Input";
import { auth } from "../../firebase/Firebase.jsx";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ForgetPasswordModal = ({ setIsForgetPasswordClicked }) => {
  const [email, setEmail] = useState("");
  const [animate, setAnimate] = useState(false);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const date = new Date();

  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  // reset function
  async function resetPassword(e) {
    e.preventDefault();
    if (isBtnClicked) return;

    if (!email.trim()) {
      toast.warning("Enter your email first");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    // sending forget link one time in one day
    const savedTime = localStorage.getItem(email.toLowerCase());
    if (savedTime) {
      const lastDate = new Date(savedTime);
      const now = new Date();
      const diffInHr = (now - lastDate) / (1000 * 60 * 60);
      if (diffInHr < 24) {
        const remainingHr = Math.ceil(24 - diffInHr);
        toast.warning(`try reseting your password after ${remainingHr} hr`);
        return;
      }
    }

    setIsBtnClicked(true);

    try {
      await sendPasswordResetEmail(auth, email);
      localStorage.setItem(email.toLowerCase(), date.toString());
      toast.info(
        "If an account exists with this email, a reset link has been sent."
      );
      closeModal();
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Try again later.");
      } else {
        toast.error("Unable to reset password right now");
      }
    } finally {
      setIsBtnClicked(false);
    }
  }

  // close modal
  function closeModal() {
    setAnimate(false);
    setTimeout(() => {
      setIsForgetPasswordClicked(false);
    }, 200);
  }

  return (
    <div
      className={`${animate && styles.showOverlay} ${styles.overlay}`}
      onClick={closeModal}
    >
      <div
        className={`${animate && styles.showModal} ${styles.modalContainer}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Forgot Password</h2>
        <p>Enter your email to reset your password</p>

        <form onSubmit={resetPassword}>
          <Input
            id="Username / Email"
            inputType="email"
            ex="johnsingh@example.com"
            value={email}
            setValue={setEmail}
          />

          {/* submit button  */}
          <button className={styles.button} disabled={isBtnClicked}>
            {isBtnClicked ? (
              <span className={styles.loading}>
                <span className={styles.dots}>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </span>
            ) : (
              "Reset password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordModal;
