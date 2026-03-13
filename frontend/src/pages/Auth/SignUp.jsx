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
    <div className="w-[90vw] md:w-[33vw] p-7 flex-col justify-center flex items-center max-w-md mx-auto">
      <h3 className="text-3xl font-black text-black mb-2 text-center">Create Account</h3>
      <p className="text-sm font-bold text-slate-800 mt-[5px] mb-8 text-center bg-[var(--color-accent-blue)] px-3 py-1 sketch-border inline-block">Join us today!</p>

      <form onSubmit={handleSignUp} className="w-full space-y-4">
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

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
        {error && <p className="text-red-500 font-bold text-sm bg-red-100 p-2 sketch-border border-red-500">{error}</p>}

        <button type="submit" className="sketch-button bg-[var(--color-accent-blue)] text-black font-black w-full py-3 mt-4 text-lg">
          SIGN UP
        </button>

        <p className="text-[14px] font-bold text-slate-800 mt-6 text-center">
          Already have an account?{" "}
          <button
            className="font-black text-black bg-[var(--color-accent-pink)] px-2 py-1 sketch-border sketch-shadow-sm ml-1 hover:translate-y-px hover:translate-x-px hover:shadow-none cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
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
