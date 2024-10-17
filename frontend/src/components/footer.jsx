import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import React,{ useRef,useState } from 'react';
import emailjs from '@emailjs/browser';
import {auth} from './../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const templateKey=import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const serviceKey=import.meta.env.VITE_EMAILJS_SERVICE_ID;

export function Footer() {
    const form = useRef();
    const [email, setEmail] = useState('');

    
    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm(serviceKey, templateKey, form.current, publicKey)
            .then((result) => {
            }, (error) => {
            });
        window.alert("Verification Done");
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        try {
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.emailVerified) {
                sendEmail(new Event('submit'));
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, 'defaultPassword123');
                const user = userCredential.user;
                await sendEmailVerification(user);
                window.alert("A verification email has been sent. Please verify your email before subscribing.");

                const checkEmailVerification = setInterval(async () => {
                    await user.reload();
                    if (user.emailVerified) {
                        clearInterval(checkEmailVerification);
                        sendEmail(new Event('submit'));
                    }
                }, 2000);
            }
        } catch (error) {
            console.error("Error subscribing: ", error.message);
            window.alert("Error subscribing. Please try again.");
        }
    };
    return (
        <div className="p-6 bg-[#151e28] text-white">
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
                {/* About Us Section */}
                <div className="col-span-1 lg:col-span-2 p-4 ml-4">
                    <div className="container mx-auto">
                        <h3 className="text-lg font-medium mb-2 tracking-wide">About Us</h3>
                        <p className="text-gray-400 tracking-wide">
                            CompanyName is dedicated to providing the best service possible.
                        </p>
                    </div>
                </div>
                
                {/* Middle Section */}
                <div className="col-span-1 lg:col-span-2 p-4 ml-4">
                    <h3 className="text-lg font-medium mb-2 tracking-wide">Sections</h3>
                    <ul className="text-gray-400 space-y-2 tracking-wide">
                        <li>Contact Us</li>
                        <li>Support</li>
                        <li>FAQ</li>
                    </ul>
                </div>

                {/* Further Information Section */}
                <div className="col-span-1 lg:col-span-2 p-4 ml-4">
                    <h3 className="text-lg font-medium mb-2 tracking-wide">Further Information</h3>
                    <ul className="text-gray-400 space-y-2 tracking-wide">
                        <li>Terms and Conditions</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                {/* Newsletter Section */}
                <div className="col-span-1 lg:col-span-3 p-4 ml-4">
                    <h3 className="text-lg font-medium mb-2 tracking-wide">Newsletter</h3>
                    <p className="text-gray-400 mb-4 tracking-wide">Subscribe for latest updates and offers.</p>
                    <form className="flex mb-4"ref={form} onSubmit={handleSubscribe}>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="p-2 border border-gray-300 rounded-l-md focus:outline-none flex-grow text-gray-800"
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button 
                            type="submit" 
                            className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                        >
                            Subscribe
                        </button>
                    </form>
                    <h3 className="text-md font-medium mb-3 tracking-wide">Follow Us On</h3>
                    <div className="flex space-x-11">
                        <FacebookIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                        <InstagramIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                        <LinkedInIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                        <XIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
