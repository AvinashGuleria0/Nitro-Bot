import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/profilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import axioInstance from "../../utils/axioInstance"; 
import { API_PATHS } from "../../utils/apiPaths";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = ""; 

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axioInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex-col justify-center bg-white sketch-border sketch-shadow-sm mt-8 mx-auto">
      <h3 className="text-2xl font-black text-black inline-block bg-[var(--color-accent-blue)] px-4 py-1 sketch-border shadow-[2px_2px_0px_0px_#000] rotate-2">
        Create Account
      </h3>
      <p className="text-sm text-slate-800 font-bold mt-3 mb-6 border-b-2 border-dashed border-black pb-2">Join us today !!</p>

      <form onSubmit={handleSignUp}>
        <div className="mb-4">
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Avinash Guleria"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="avi@mail.com"
            type="email"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
        </div>
        {error && <p className="text-red-500 font-bold text-xs pb-2.5 bg-[var(--color-accent-pink)] p-2 sketch-border mt-2 mb-2">{error}</p>}

        <button type="submit" className="btn-primary mt-2">
          SIGN UP
        </button>

        <p className="text-[13px] font-bold text-slate-800 mt-4 text-center">
          Already have an account?{" "}
          <button
            type="button"
            className="font-black text-black underline decoration-2 cursor-pointer hover:bg-[var(--color-accent-yellow)] px-1"
            onClick={() => {
              setCurrentPage("login");
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
