import React, { useRef } from "react";
import NavbarApp from "./NavbarApp";
import FooterApp from "./FooterApp";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
  const name = useRef("");
  const email = useRef("");
  const message = useRef("");
  const navigate = useNavigate();

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageData = {
      name: name.current.value,
      email: email.current.value,
      message: message.current.value,
    };
    try {
      await axios.post(`http://localhost:4000/contacts`, messageData);
      Swal.fire({
        title: "Good job!",
        text: "Message sent successfully!",
        icon: "success",
      });
      navigate("/");
      e.target.reset();
    } catch (error) {
      console.log("Error sending message", error);
    }
  };

  return (
    <>
      <NavbarApp />
      <section className="bg-gray-100 py-10 px-3 sm:py-16 sm:px-5">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Section - Contact Info */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 sm:p-10 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Get in Touch</h2>
              <p className="mb-6 sm:mb-8 text-gray-100 text-sm sm:text-base">
                We’d love to hear from you! Fill out the form or reach us via the details below.
              </p>

              <div className="space-y-4 sm:space-y-5 text-sm sm:text-base">
                <div className="flex items-start sm:items-center gap-3">
                  <FaMapMarkerAlt className="text-xl sm:text-2xl mt-1 sm:mt-0" />
                  <p>150 Feet Ring Road, Near McDonald's, Rajkot, Gujarat</p>
                </div>

                <div className="flex items-start sm:items-center gap-3">
                  <FaPhoneAlt className="text-xl sm:text-2xl mt-1 sm:mt-0" />
                  <p>+91 7202994265</p>
                </div>

                <div className="flex items-start sm:items-center gap-3">
                  <FaEnvelope className="text-xl sm:text-2xl mt-1 sm:mt-0" />
                  <p>walmartcontact@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Right Section - Contact Form */}
            <div className="p-6 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
                Send us a Message
              </h2>
              <form className="space-y-4 sm:space-y-5" onSubmit={sendMessage}>
                <div>
                  <label className="block mb-1 sm:mb-2 font-medium text-gray-600 text-sm sm:text-base">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    ref={name}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 sm:mb-2 font-medium text-gray-600 text-sm sm:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    ref={email}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 sm:mb-2 font-medium text-gray-600 text-sm sm:text-base">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Write your message..."
                    ref={message}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm sm:text-base"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-all text-sm sm:text-base"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <FooterApp />
    </>
  );
}
