import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import styles from "./register.module.css";
import { auth, db } from "../../firebase/Firebase.jsx";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import GoogleLoginBtn from "../../components/googleLoginBtn/GoogleLoginBtn.jsx";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasssword] = useState("");
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [showInputPassowrd, setShowInputPassword] = useState(false);
  const [showConfirmInputPassowrd, setShowConfirmInputPassword] =
    useState(false);
  const navigate = useNavigate();
  const date = new Date();

  // creating user account
  async function submit(e) {
    e.preventDefault();
    if (isBtnClicked) return;
    setIsBtnClicked(true);
    if (
      email.trim() &&
      password.trim() &&
      firstName.trim() &&
      lastName.trim() &&
      confirmPassword.trim()
    ) {
      if (password === confirmPassword) {
        try {
          // create account
          await createUserWithEmailAndPassword(auth, email, password);
          // user email verification
          await sendEmailVerification(auth.currentUser);

          // database setup
          try {
            // seting data to database
            if (!auth.currentUser) return;
            await setDoc(
              doc(db, "userData", auth.currentUser.uid),
              {
                email: email,
                name: `${firstName} ${lastName}`,
                message: [],
                lastUpdatedOn: `${date.toLocaleDateString()} (${date.toLocaleTimeString()})`,
              },
              { merge: true },
            );
            // sinout user
            await signOut(auth);
          } catch (error) {
            toast.error("Signup failed, please try again");
            if (auth.currentUser) {
              await deleteUser(auth.currentUser);
            }
            return;
          }

          toast.info("Verification mail sent. Please check your inbox.");
          setTimeout(() => {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setConfirmPasssword("");
            navigate("/login");
          }, 1500);
        } catch (error) {
          if (
            error.message === "Firebase: Error (auth/email-already-in-use)."
          ) {
            toast.warning("Account already exists with this email");
          } else if (
            error.message ===
            "Firebase: Password should be at least 6 characters (auth/weak-password)."
          ) {
            toast.warning(
              "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
            );
          } else if (
            error.code === "auth/password-does-not-meet-requirements"
          ) {
            toast.warning(
              "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
            );
          } else {
            toast.error("Signup failed, please try again");
          }
        } finally {
          setIsBtnClicked(false);
        }
      } else {
        toast.error("Password and confirm password must be same");
        setIsBtnClicked(false);
      }
    } else {
      toast.warning("Fill all the fields");
      setIsBtnClicked(false);
    }
  }

  // jsx
  return (
    <form className={styles.form} onSubmit={(e) => submit(e)}>
      <div className={styles.container}>
        {/* title */}
        <div className={styles.title}>
          <h1>Create Your Account</h1>
          <p>Welcome! Create an account to get started</p>
        </div>
        {/* userName  */}
        <div className={styles.name}>
          <Input
            id="Firstname"
            inputType="text"
            value={firstName}
            setValue={setFirstName}
            ex="John"
            autoFocus={true}
          />
          <Input
            id="Lastname"
            inputType="text"
            ex="Singh"
            value={lastName}
            setValue={setLastName}
          />
        </div>
        {/* id password */}
        <div className={styles.loginDetails}>
          <Input
            id="Username"
            inputType="email"
            ex="johnsingh@example.com"
            value={email}
            setValue={setEmail}
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
          <Input
            id="Confirm Password"
            inputType={showConfirmInputPassowrd ? "text" : "password"}
            ex="***************"
            value={confirmPassword}
            setValue={setConfirmPasssword}
            setShowInputPassword={setShowConfirmInputPassword}
            showInputPassowrd={showConfirmInputPassowrd}
          />
        </div>
        {/* submit button  */}
        <button className={styles.button}>
          {isBtnClicked ? (
            <span className={styles.loading}>
              <span className={styles.dots}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </span>
          ) : (
            "Create Account"
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
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </form>
  );
};

export default Register;
