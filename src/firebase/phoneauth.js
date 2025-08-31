// src/PhoneAuth.js
import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebaseConfig";

const PhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);
  const [message, setMessage] = useState("");

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response) => {
        onSignIn();
      },
    });
  };

  const onSignIn = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmObj(confirmation);
      setMessage("OTP Sent!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmObj.confirm(otp);
      setMessage("Phone number verified!");
    } catch (err) {
      setMessage("Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Phone Authentication</h2>
      <input
        type="text"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={onSignIn}>Send OTP</button>

      <br />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify OTP</button>

      <div id="recaptcha-container"></div>

      <p>{message}</p>
    </div>
  );
};

export default PhoneAuth;
