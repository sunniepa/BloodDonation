import React, { useState, useEffect } from 'react';
import './chatbot.css';
import eventRegistrationApi from '../../service/eventRegistrationApi';
import eventApi from '../../service/eventApi';
import donorProfileService from '../../service/donorProfileApi';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [donorInfo, setDonorInfo] = useState(null);

    useEffect(() => {
        fetchRegistrations();
        fetchAllEvents();
        fetchDonorProfile();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);
            const response = await eventRegistrationApi.getRegistrationsByUserId(user.additionalInfo.user_id);
            setRegistrations(response);
        } catch (error) {
            console.log("Failed to fetch event detail:" + error);
        }
    };

    const fetchAllEvents = async () => {
        try {
            const response = await eventApi.getAllEvents();
            setAllEvents(response.data);
        } catch (error) {
            console.log("Failed to fetch all events:" + error);
        }
    };

    const fetchDonorProfile = async () => {
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);
            const response = await donorProfileService.getDonorProfileByUserId(user);
            setDonorInfo(response);
        } catch (error) {
            console.error('Error fetching donor profile:', error);
        }
    };

    const handleSend = async () => {
        if (!input) return;

        setMessages([...messages, { text: input, sender: 'user' }]);

        const registeredEventDetails = registrations.map(reg => 
            `Title: ${reg.title}, Description: ${reg.description}, Location: ${reg.location}, Start Time: ${new Date(reg.start_time).toLocaleString()}, End Time: ${new Date(reg.end_time).toLocaleString()}, Status: ${reg.status}`
        ).join(' | ');

        const allEventDetails = allEvents.map(event => 
            `Title: ${event.title}, Description: ${event.description}, Location: ${event.location}, Start Time: ${new Date(event.start_time).toLocaleString()}, End Time: ${new Date(event.end_time).toLocaleString()}, Expected Blood Units: ${event.expected_blood_units}, Urgent Blood Type: ${event.urgent_blood_type}, Required Blood Types: ${event.required_blood_types}, Status: ${event.status}`
        ).join(' | ');

        const donorProfileDetails = donorInfo ? 
            `Weight: ${donorInfo.weight}, Height: ${donorInfo.height}, Blood Pressure: ${donorInfo.blood_pressure}, Hemoglobin Level: ${donorInfo.hemoglobin_level}, Medical History: ${donorInfo.medical_history}, Last Donation Date: ${new Date(donorInfo.last_donation_date).toLocaleString()}, Eligibility: ${donorInfo.is_eligible ? 'Eligible' : 'Not Eligible'}`
            : "No donor profile information available.";

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Bạn chỉ được phép trả lời các câu hỏi liên quan đến việc hiến máu. Nếu câu hỏi không liên quan, hãy yêu cầu người dùng hỏi về chủ đề này." },
                    { role: "user", content: input },
                    { role: "system", content: `User has registered for the following events: ${registeredEventDetails}` },
                    { role: "system", content: `Here are all available events in the system: ${allEventDetails}` },
                    { role: "system", content: `Donor profile information: ${donorProfileDetails}` }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();

        const botMessage = data.choices && data.choices.length > 0
            ? data.choices[0].message.content.trim()
            : "Xin lỗi, tôi không nhận được phản hồi.";

        setMessages(prevMessages => [...prevMessages, { text: botMessage, sender: 'bot' }]);
        setInput('');
    };

    return (
        <div className='total'>
            <div className="chatbot-header">
                <h1>Chào mừng đến với Chatbot</h1>
                <p>Hãy hỏi bất kỳ điều gì liên quan đến việc hiến máu!</p>
            </div>

            <div className="chatbot-container">
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Nhập tin nhắn của bạn..."
                    />
                    <button onClick={handleSend}>Gửi</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
