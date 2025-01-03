import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Clock, MapPin, Users, Banknote } from 'lucide-react';

export default function JobsAndSchemes() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCookie = (name) => {
    const value = `${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const authToken = getCookie('authToken');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    setActiveTab('jobs');
    axios
      .get('http://localhost:5000/api/user/jobs', {
        headers: { 'auth-token': authToken },
      })
      .then((response) => {
        if (response.data.success) {
          setJobs(response.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  };

  const fetchSchemes = () => {
    setLoading(true);
    setActiveTab('schemes');
    axios
      .get('http://localhost:5000/api/user/schemes', {
        headers: { 'auth-token': authToken },
      })
      .then((response) => {
        if (response.data.success) {
          setSchemes(response.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching schemes:', error);
        setLoading(false);
      });
  };

  const redirectToExternalPage = (link) => {
    window.location.href = link;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-6 py-3 rounded-xl transition-colors ${
            activeTab === 'jobs'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={fetchJobs}
        >
          Fetch Jobs
        </button>
        <button
          className={`px-6 py-3 rounded-xl transition-colors ${
            activeTab === 'schemes'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={fetchSchemes}
        >
          Fetch Schemes
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'jobs' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      onClick={() => redirectToExternalPage(job.link)}
                    >
                      Apply
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === 'schemes' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Schemes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : schemes.length === 0 ? (
                <p className="text-white">No schemes available right now.</p>
              ) : (
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
