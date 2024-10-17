import React from "react";
import { Avatar } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";

export const Account = () => {
    const [user, setUser] = useRecoilState(userState);

    const name = user ? user.name : "";
    const email = user ? user.username : "";
    const phoneNumber = user ? user.phone : "";
    const aboutYou = user ? user.about : "";

    const [isEditingName, setIsEditingName] = React.useState(false);
    const [isEditingEmail, setIsEditingEmail] = React.useState(false);
    const [isEditingPhoneNumber, setIsEditingPhoneNumber] = React.useState(false);
    const [isEditingAboutYou, setIsEditingAboutYou] = React.useState(false);

    const handleEditProfilePhoto = () => {
        alert("Edit Profile Photo clicked");
    };

    const handleDeleteProfilePhoto = () => {
        alert("Delete Profile Photo clicked");
    };

    const handleNameChange = (e) => {
        setUser((prevUser) => ({ ...prevUser, name: e.target.value }));
    };

    const handleEmailChange = (e) => {
        setUser((prevUser) => ({ ...prevUser, username: e.target.value }));
    };

    const handlePhoneNumberChange = (e) => {
        setUser((prevUser) => ({ ...prevUser, phone: e.target.value }));
    };

    const handleAboutYouChange = (e) => {
        setUser((prevUser) => ({ ...prevUser, about: e.target.value }));
    };

    return (
        <div className="min-h-screen py-10">
            <div className="flex justify-center mb-10">
                <div className="font-serif text-3xl font-semibold text-gray-700">
                    Profile
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-2xl bg-white shadow rounded-lg p-6 m-4">
                    <div className="mb-6 pb-4 border-b border-gray-300 flex flex-col md:flex-row items-center justify-between">
                        <label className="text-lg font-medium text-gray-700">Profile Photo:</label>
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <Avatar
                                variant="circular"
                                size="xl"
                                alt="profile picture"
                                className="border border-gray-900 p-0.5"
                                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                            />
                            <button
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                onClick={handleEditProfilePhoto}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                                onClick={handleDeleteProfilePhoto}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="mb-6 pb-4 border-b border-gray-300">
                        <label className="block text-lg font-medium text-gray-700">Name:</label>
                        <div className="flex items-center mt-2">
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    className="border border-gray-300 p-2 flex-grow rounded-md"
                                />
                            ) : (
                                <span className="flex-grow text-gray-600">{name}</span>
                            )}
                            <button
                                className="ml-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                onClick={() => setIsEditingName(!isEditingName)}
                            >
                                {isEditingName ? "Save" : "Edit"}
                            </button>
                        </div>
                    </div>
                    <div className="mb-6 pb-4 border-b border-gray-300">
                        <label className="block text-lg font-medium text-gray-700">Email:</label>
                        <div className="flex items-center mt-2">
                            {isEditingEmail ? (
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="border border-gray-300 p-2 flex-grow rounded-md"
                                />
                            ) : (
                                <span className="flex-grow text-gray-600">{email}</span>
                            )}
                            <button
                                className="ml-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                onClick={() => setIsEditingEmail(!isEditingEmail)}
                            >
                                {isEditingEmail ? "Save" : "Edit"}
                            </button>
                        </div>
                    </div>
                    <div className="mb-6 pb-4 border-b border-gray-300">
                        <label className="block text-lg font-medium text-gray-700">Phone Number:</label>
                        <div className="flex items-center mt-2">
                            {isEditingPhoneNumber ? (
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    className="border border-gray-300 p-2 flex-grow rounded-md"
                                />
                            ) : (
                                <span className="flex-grow text-gray-600">{phoneNumber}</span>
                            )}
                            <button
                                className="ml-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                onClick={() => setIsEditingPhoneNumber(!isEditingPhoneNumber)}
                            >
                                {isEditingPhoneNumber ? "Save" : "Edit"}
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700">About You:</label>
                        {isEditingAboutYou ? (
                            <textarea
                                value={aboutYou}
                                onChange={handleAboutYouChange}
                                className="border border-gray-300 p-2 w-full rounded-md mt-2"
                            />
                        ) : (
                            <p className="text-gray-600 mt-2">{aboutYou}</p>
                        )}
                        <button
                            className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            onClick={() => setIsEditingAboutYou(!isEditingAboutYou)}
                        >
                            {isEditingAboutYou ? "Save" : "Edit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
