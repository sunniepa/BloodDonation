import React, { useState } from "react";
import axiosClient from "../../apis/axiosClient";

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/notifications/createNotificationByEmail", {
        full_name: formData.full_name,
        emails: ["nguyenloi25012002@gmail.com"],
        title: formData.subject + " Email người gửi: " + formData.email + " Họ tên: " + formData.full_name,
        content: formData.message
      });
      // Handle success notification
      setFormData({
        full_name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      // Handle error notification
    }
  };

  return (
    <div className="container mx-auto py-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-5">Liên hệ</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Họ tên"
              />
              <input
                className="border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Địa chỉ email"
              />
              <input
                className="border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500 col-span-2"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Chủ đề"
              />
              <textarea
                className="border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500 col-span-2"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Nội dung"
              />
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                type="submit"
              >
                Hoàn thành
              </button>
            </div>
          </form>
        </div>
        <div className="h-full">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4834.248082120662!2d105.76783097503166!3d10.034531590072623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDAyJzA0LjMiTiAxMDXCsDQ2JzEzLjUiRQ!5e1!3m2!1sen!2s!4v1732700851659!5m2!1sen!2s" 
            width="600" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>        
      </div>
      </div>

    </div>
  );
};

export default Contact;
