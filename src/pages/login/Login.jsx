import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import { useState } from "react";
import { auth } from "../../firebase/Firebase.jsx";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { toast } from "react-toastify";
import GoogleLoginBtn from "../../components/googleLoginBtn/GoogleLoginBtn.jsx";
import ForgetPasswordModal from "../../components/forgetPasswordModal/ForgetPasswordModal.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showInputPassowrd, setShowInputPassword] = useState(false);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [isForgetPasswordClicked, setIsForgetPasswordClicked] = useState(false);

  // email login
  async function login(e) {
    e.preventDefault();
    if (isBtnClicked) return;
    setIsBtnClicked(true);
    if (email.trim() && password.trim()) {
      try {
        // login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        // refresh user data
        await userCredential.user.reload();
        // check for email verified or not
        if (!userCredential.user.emailVerified) {
          // user email verification send
          await sendEmailVerification(auth.currentUser);

          // sign out
          await signOut(auth);
          toast.warning(
            "verify your email first, check your inbox or spam for verification link",
          );
          return;
        }

        // removing forgetPassword timer from localstorage
        const loginMail = localStorage.getItem(email.toLowerCase());
        if (loginMail) {
          localStorage.removeItem(email.toLowerCase());
        }

        // login success message
        toast.success("Login successful");

        // redirect to login
        setTimeout(() => {
          setEmail("");
          setPassword("");
          navigate("/dashboard");
        }, 1500);
      } catch (error) {
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
          toast.error("Incorrect username or password");
        } else if (error.message === "Firebase: Error (auth/user-disabled).") {
          toast.error(
            "Your account has been temporarily disabled by the administrator",
          );
        } else if (error.code === "auth/too-many-requests") {
          toast.info("Check your inbox or spam for verification link");
        } else {
          toast.error("Login failed, please try again");
        }
      } finally {
        setIsBtnClicked(false);
      }
    } else {
      setIsBtnClicked(false);
      toast.error("fill all the fields");
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={(e) => login(e)}>
        <div className={styles.container}>
          {/* title */}
          <div className={styles.title}>
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>
          {/* id password */}
          <div className={styles.loginDetails}>
            <Input
              id="Username / Email"
              inputType="email"
              ex="johnsingh@example.com"
              value={email}
              setValue={setEmail}
              autoFocus={true}
            />
            <Input
              id="Password"
              inputType={showInputPassowrd ? "text" : "password"}
              ex="***************"
              value={password}
              setValue={setPassword}
              setShowInputPassword={setShowInputPassword}
              showInputPassowrd={showInputPassowrd}
            />
          </div>
          {/* tools  */}
          <div className={styles.tools}>
            <div className={styles.rememberMe}>
              <input type="checkbox" checked={true} />
              <span>Remember me</span>
            </div>
            <p onClick={() => setIsForgetPasswordClicked(true)}>
              Forget password?
            </p>
          </div>
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
              "Sign in"
            )}
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <hr
              style={{
                color: "white",
                width: "50%",
                height: "1px",
                marginTop: "40px",
                marginBlock: "30px",
                backgroundColor: "rgba(255, 255, 255, 0.17)",
                border: "none",
              }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.34)" }}>or</span>
            <hr
              style={{
                color: "white",
                width: "50%",
                height: "1px",
                marginTop: "40px",
                marginBlock: "30px",
                backgroundColor: "rgba(255, 255, 255, 0.17)",
                border: "none",
              }}
            />
          </div>
          {/* google login  */}
          <GoogleLoginBtn />
          {/* login  */}
          <p className={styles.loginQuote}>
            Don't have an account? <Link to="/register">Create Now</Link>
          </p>
        </div>
      </form>

      {/* forgetPassword modal  */}
      {isForgetPasswordClicked && (
        <ForgetPasswordModal
          setIsForgetPasswordClicked={setIsForgetPasswordClicked}
        />
      )}
    </>
  );
};

export default Login;
