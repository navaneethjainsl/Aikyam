import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Briefcase, Users, MapPin, Clock, Banknote } from 'lucide-react';
import { useToast } from './hooks/use-toast';

const JobsAndSchemes = ({ setSidebar }) => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const { toast } = useToast();

  setSidebar(true);

  // Mock data for jobs
  const mockJobs = [
    {
      id: 1,
      title: "Accessibility Specialist",
      company: "TechInclusive",
      location: "Remote",
      type: "Full-time",
      category: "Technology",
      salary: "₹70,000 - ₹90,000/month",
      description: "As an Accessibility Specialist, you'll help ensure our products meet accessibility standards for all users.",
      link: "#",
      tags: ["Featured", "Full-time", "Technology"],
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "Sign Language Interpreter",
      company: "Community Services",
      location: "Mumbai",
      type: "Part-time",
      category: "Education",
      salary: "₹40,000 - ₹50,000/month",
      description: "We're looking for a skilled sign language interpreter to facilitate communication for our community events.",
      link: "#",
      tags: ["Part-time", "Education"],
      postedDate: "1 week ago"
    },
    {
      id: 3,
      title: "Assistive Technology Specialist",
      company: "AccessTech Solutions",
      location: "Bangalore",
      type: "Full-time",
      category: "Technology",
      salary: "₹60,000 - ₹80,000/month",
      description: "Help develop and implement assistive technology solutions for individuals with disabilities.",
      link: "#",
      tags: ["Full-time", "Technology"],
      postedDate: "3 days ago"
    }
  ];

  // Mock data for schemes
  const mockSchemes = [
    {
      id: 1,
      title: "Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances (ADIP)",
      organization: "Ministry of Social Justice and Empowerment",
      provider: "Ministry of Social Justice and Empowerment",
      category: "Equipment Support",
      eligibility: "Persons with 40% disability and below monthly income of ₹20,000",
      benefits: "Financial assistance for assistive devices",
      description: "Up to 100% cost covered based on income criteria",
      link: "#",
      tags: ["Featured", "Equipment Support"],
      deadline: "Ongoing"
    },
    {
      id: 2,
      title: "Scholarship for Students with Disabilities",
      organization: "Department of Empowerment of Persons with Disabilities",
      provider: "Department of Empowerment of Persons with Disabilities",
      category: "Education",
      eligibility: "Students with disabilities pursuing higher education",
      benefits: "Financial support for education expenses",
      description: "Monthly stipend and annual grants for educational materials",
      link: "#",
      tags: ["Education", "Financial Aid"],
      deadline: "October 31, 2025"
    }
  ];

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  const authToken = getCookie('authToken');

  useEffect(() => {
    // Load initial data when component mounts
    loadData('jobs');
  }, []);

  const loadData = (tab) => {
    setLoading(true);
    setActiveTab(tab);

    // Uncomment below block for mock data
    // setTimeout(() => {
    //   if (tab === 'jobs') {
    //     setJobs(mockJobs);
    //   } else {
    //     setSchemes(mockSchemes);
    //   }
    //   setLoading(false);
    // }, 800);

    axios
      .get(`http://localhost:5000/api/user/${tab}`, {
        headers: {
          'auth-token': authToken,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log(`${tab} data:`, response.data.message);
          if (tab === 'jobs') {
            setJobs(response.data.message);
          } else {
            setSchemes(response.data.message);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Error fetching ${tab}:`, error);
        setLoading(false);
      });
  };

  const handleApply = (item) => {
    console.log(item);
    window.location.href = item.link;
    toast({
      title: "Application Started",
      description: `You're applying for "${item.title}"`,
    });
  };

  const handleSave = (item) => {
    toast({
      title: "Saved Successfully",
      description: `"${item.title}" has been saved to your profile`,
    });
  };

  const handleLearnMore = (item) => {
    toast({
      title: "More Information",
      description: `Viewing details for "${item.title}"`,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    toast({
      description: `Searching for "${searchQuery}"...`,
    });
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedType(null);
    toast({
      description: "All filters have been reset",
    });
    setShowFilters(false);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSelectType = (type) => {
    setSelectedType(type === selectedType ? null : type);
  };

  const filteredJobs = jobs.filter(job => {
    return (
      (searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === null || job.category === selectedCategory) &&
      (selectedType === null || job.type === selectedType)
    );
  });

  const filteredSchemes = schemes.filter(scheme => {
    return (
      (searchQuery === "" ||
        scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.provider.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === null || scheme.category === selectedCategory)
    );
  });

  return (
    <div className="min-h-screen bg-navy-blue text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Jobs & Schemes</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Discover employment opportunities and government schemes designed to support specially abled individuals.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <form className="relative flex-1" onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search jobs, schemes, companies..."
                className="pl-10 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button
              className="flex items-center gap-2 border border-gray-700 px-4 py-2 rounded text-white hover:bg-purple-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="p-4 mb-6 bg-gray-800 border border-gray-700 rounded">
              {/* Category Filter */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {["Technology", "Education", "Healthcare", "Administrative"].map(category => (
                    <span
                      key={category}
                      onClick={() => handleSelectCategory(category)}
                      className={`cursor-pointer px-3 py-1 rounded text-sm border ${
                        selectedCategory === category
                          ? 'bg-purple-600 border-purple-600'
                          : 'bg-gray-700 border-gray-600 hover:bg-purple-600'
                      }`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Job Type</h3>
                <div className="flex flex-wrap gap-2">
                  {["Full-time", "Part-time", "Contract", "Remote"].map(type => (
                    <span
                      key={type}
                      onClick={() => handleSelectType(type)}
                      className={`cursor-pointer px-3 py-1 rounded text-sm border ${
                        selectedType === type
                          ? 'bg-purple-600 border-purple-600'
                          : 'bg-gray-700 border-gray-600 hover:bg-purple-600'
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-transparent border border-gray-500 rounded text-gray-300 hover:text-white"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex">
            <button
              onClick={() => loadData('jobs')}
              className={`flex-1 py-2 border-b-2 ${
                activeTab === 'jobs'
                  ? 'border-purple-600 text-white'
                  : 'border-gray-700 text-gray-400'
              } flex items-center justify-center gap-2`}
            >
              <Briefcase size={18} />
              Jobs
            </button>
            <button
              onClick={() => loadData('schemes')}
              className={`flex-1 py-2 border-b-2 ${
                activeTab === 'schemes'
                  ? 'border-purple-600 text-white'
                  : 'border-gray-700 text-gray-400'
              } flex items-center justify-center gap-2`}
            >
              <Users size={18} />
              Schemes
            </button>
          </div>
        </div>

        {/* Jobs Tab Content */}
        {activeTab === 'jobs' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-300">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-6 bg-gray-800 border border-gray-700 text-center rounded">
                <p className="text-gray-300">No jobs match your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 border-l-4 border-purple-600 bg-gray-800 hover:shadow-lg transition-shadow rounded"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {job.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-purple-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-gray-400">{job.company} • Posted {job.postedDate}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Banknote size={16} />
                          <span>{job.salary}</span>
                        </div>
                      </div>

                      <p>{job.description}</p>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleApply(job)}
                          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
                        >
                          Apply Now
                        </button>
                        {/* <button
                          onClick={() => handleSave(job)}
                          className="border border-purple-600 px-4 py-2 rounded hover:bg-purple-600 hover:text-white"
                        >
                          Save Job
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schemes Tab Content */}
        {activeTab === 'schemes' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-300">Loading schemes...</p>
              </div>
            ) : filteredSchemes.length === 0 ? (
              <div className="p-6 bg-gray-800 border border-gray-700 text-center rounded">
                <p className="text-gray-300">No schemes match your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="p-6 border-l-4 border-purple-600 bg-gray-800 hover:shadow-lg transition-shadow rounded"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {scheme.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-purple-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-semibold">{scheme.title}</h3>
                        <p className="text-gray-400">{scheme.organization} • Deadline: {scheme.deadline}</p>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium">Eligibility:</h4>
                          <p>{scheme.eligibility}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Benefits:</h4>
                          <p>{scheme.benefits}</p>
                        </div>
                        <p>{scheme.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleApply(scheme)}
                          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
                        >
                          Apply Now
                        </button>
                        {/* <button
                          onClick={() => handleLearnMore(scheme)}
                          className="border border-purple-600 px-4 py-2 rounded hover:bg-purple-600 hover:text-white"
                        >
                          Learn More
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsAndSchemes;
