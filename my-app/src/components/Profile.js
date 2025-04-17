import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Pencil, Save } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ setSidebar }) => {
  const navigate = useNavigate();

  // Utility to read a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Redirect if not authenticated
  useEffect(() => {
    const authToken = getCookie("authToken");
    if (!authToken) {
      navigate("/");
    }
  }, [navigate]);
  
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({});
  setSidebar(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = getCookie('authToken');
        if (!authToken) throw new Error('Auth token is missing');

        const response = await axios.post(
          'http://localhost:5000/api/auth/getuser',
          {},
          {
            headers: {
              'auth-token': authToken,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setProfileData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setEditMode(false);

    try {
      const authToken = getCookie('authToken');
      if (!authToken) throw new Error('Auth token is missing');

      const response = await axios.post(
        'http://localhost:5000/api/auth/updateuser',
        profileData ,
        {
          headers: {
            'auth-token': authToken,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setProfileData(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    } finally {
      // setIsLoading(false);
    }


    alert('Profile Updated: Your profile information has been saved successfully.');
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <button
          onClick={() => {
            if (editMode) handleSave();
            else setEditMode(true);
          }}
          className={`flex items-center px-4 py-2 text-white rounded-md transition ${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-700 hover:bg-purple-800'
            }`}
        >
          {editMode ? <Save className="mr-2 h-4 w-4" /> : <Pencil className="mr-2 h-4 w-4" />}
          {editMode ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-[#1E293B] border border-gray-700 rounded-lg p-6 text-white col-span-1">
          <h2 className="text-xl text-center mb-4">Profile Photo</h2>
          <div className="flex flex-col items-center space-y-4">
            <img
              src="https://static.vecteezy.com/system/resources/previews/051/718/789/large_2x/elegant-businessman-avatar-with-suit-and-tie-free-png.png"
              alt="Profile"
              className="w-32 h-32 rounded-full border-2 border-purple-700"
            />
            {/* {editMode && (
              <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md">
                Change Photo
              </button>
            )} */}
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold">{profileData.name}</h3>
              <p className="text-gray-400">Member since April 2023</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="col-span-1 md:col-span-2 space-y-6 text-white">
          <div className="bg-[#1E293B] border border-gray-700 rounded-lg">
            <div className="border-b border-gray-700 p-6">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <p className="text-gray-400 text-sm">Update your personal details here</p>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Full Name', name: 'name', icon: <User className="h-5 w-5 text-gray-400 mr-2" /> },
                { label: 'Email', name: 'email', icon: <Mail className="h-5 w-5 text-gray-400 mr-2" />, type: 'email' },
                { label: 'Phone', name: 'phone', icon: <Phone className="h-5 w-5 text-gray-400 mr-2" /> },
                { label: 'Address', name: 'address', icon: <MapPin className="h-5 w-5 text-gray-400 mr-2" /> },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label htmlFor={field.name} className="block text-sm font-medium">{field.label}</label>
                  <div className="flex items-center rounded-md border border-gray-700 px-3 py-2 focus-within:ring-1 focus-within:ring-purple-700 min-w-0">
                    {field.icon}
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type || 'text'}
                      value={profileData[field.name] || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder={field.label}className="flex-1 min-w-0 w-full bg-transparent border-0 text-white truncate focus:outline-none"
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Write a short bio about yourself"
                  className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-700"
                  rows={4}
                />
              </div>
            </div>
            {editMode && (
              <div className="flex justify-end p-4 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  className="flex items-center bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Information
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
