// src/components/FooterInstructions.jsx
import React from "react";


const Footer = () => {
  return (
    <div style={{ padding: "16px", fontSize: "20px", backgroundColor: "#f9f9f9", borderTop: "1px solid #ccc" ,width:"190px"}}>
      <a
        href="/Untitledspreadsheet.xlsx"
        download
        style={{
          display: "inline-block",
          padding: "6px 12px",
          backgroundColor: "#007bff",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px"
        }}
      >
        📥Download sample file
      </a>
    </div>
  );
};

export default Footer;
