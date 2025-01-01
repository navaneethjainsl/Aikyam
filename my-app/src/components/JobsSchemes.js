import { React, useState } from 'react';
import axios from 'axios';
import { GraduationCap, Clock, MapPin, Users, Banknote } from 'lucide-react';

export default function JobsAndSchemes() {
  
  const [status, setStatus] = useState(false);
  const [jobs, setJobs] = useState([]); // Store jobs data
  const [schemes, setSchemes] = useState([]); // Store schemes data
  const [loading, setLoading] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  const authToken = getCookie('authToken')

  // Function to fetch jobs from the backend
  const fetchJobs = () => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/user/jobs', {
        headers: {
          'auth-token': authToken, // Replace with the correct token
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Jobs data:', response.data.message); // Log the data
          setJobs(response.data.message); // Update jobs state
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  };

  // Function to fetch schemes from the backend
  const fetchSchemes = () => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/user/schemes', {
        headers: {
          'auth-token': authToken, // Replace with the correct token
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Schemes data:', response.data.message); // Log the data
          setSchemes(response.data.message); // Update schemes state
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching schemes:', error);
        setLoading(false);
      });
  };

  // Handle Apply button click for jobs
  // const handleApply = (jobId) => {
  //   axios
  //     .post('/api/apply-job', { jobId }, {
  //       headers: {
  //         'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc3MjZiN2JhYzVkNTZmZGU4ZmU3NTg0In0sImlhdCI6MTczNTU1MjAyNn0.zFlTytrlDTuy1g5OtGqvKL4p7fZeHriqI5GZQZHQT3Y', // Replace with the correct token
  //       },
  //     })
  //     .then((response) => {
  //       if (response.data.success) {
  //         alert('Successfully applied!');
  //       } else {
  //         alert('Failed to apply.');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error applying:', error);
  //       alert('Error applying for the job');
  //     });
  // };

  const redirectToExternalPage = (link) => {
    window.location.href = link; // Replace with your external URL
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
          onClick={() => { setStatus(false); fetchJobs(); }} // Fetch jobs on click
        >
          Fetch Jobs
        </button>
        <button
          className="flex-1 px-4 py-3 bg-gradient-to-r from-black-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
          onClick={() => { setStatus(false); fetchSchemes(); }} // Fetch schemes on click
        >
          Fetch Schemes
        </button>
      </div>

      {!status ? (
        <div className="space-y-6">
          {/* Jobs Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : jobs.length === 0 ? (
                <p className="text-white">No jobs available right now.</p>
              ) : (
                jobs.map((job, index) => (
                  <div
                    key={index}
                    className="p-6 bg-navy-800 rounded-xl border border-white/10 backdrop-blur-xl flex flex-col"
                  >
                    <div className="flex-1 mb-4 space-y-2">
                      <h4 className="font-semibold text-lg">{job.title}</h4>
                      <p className="text-sm text-gray-300">{job.company}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Banknote className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <p className="text-sm">{job.description}</p>
                    </div>
                    <button
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
                      onClick={() => redirectToExternalPage(job.link)} // Apply functionality
                    >
                      Apply
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Schemes Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Schemes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schemes.length > 0 ? (
                schemes.map((scheme, index) => (
                  <div
                    key={index}
                    className="p-6 bg-navy-800 rounded-xl border border-white/10 backdrop-blur-xl flex flex-col"
                  >
                    <div className="flex-1 mb-4 space-y-2">
                      <h4 className="font-semibold text-lg">{scheme.title}</h4>
                      <p className="text-sm text-gray-300">{scheme.organization}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        Eligibility: {scheme.eligibility}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        Benefits: {scheme.benefits}
                      </div>
                      <p className="text-sm">{scheme.description}</p>
                    </div>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
                      Apply
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-white">No schemes available right now.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-navy-800 rounded-xl border border-white/10 text-center">
          <h4 className="text-lg font-semibold text-white">No Applications Found</h4>
          <p className="text-sm text-gray-400">You have not applied for any jobs or schemes yet.</p>
        </div>
      )}
    </div>
  );
}
