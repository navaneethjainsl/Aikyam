import {React,useState} from 'react'
import { GraduationCap, Clock, MapPin, Users, Banknote } from 'lucide-react'

const jobs = [
  {
    title: "Web Developer",
    company: "TechCo",
    location: "Remote",
    type: "Full-time",
    salary: "₹50,000 - ₹80,000/month",
    description: "We're seeking a skilled Web Developer to join our team. You'll work on exciting projects using the latest technologies."
  },
  {
    title: "Graphic Designer",
    company: "CreativeStudio",
    location: "Mumbai",
    type: "Part-time",
    salary: "₹30,000 - ₹50,000/month",
    description: "Join our creative team to design stunning visuals for various digital and print media projects."
  },
  {
    title: "Data Analyst",
    company: "DataInsights",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹60,000 - ₹90,000/month",
    description: "Help us turn data into actionable insights. Strong analytical skills and experience with data visualization tools required."
  },
  {
    title: "Customer Support",
    company: "ServiceFirst",
    location: "Delhi",
    type: "Full-time",
    salary: "₹25,000 - ₹40,000/month",
    description: "Provide excellent customer service and support for our products. Good communication skills and patience are essential."
  }
]

const schemes = [
  {
    title: "Skill India",
    organization: "Government of India",
    eligibility: "18-35 years old",
    benefits: "Free training, Certification",
    description: "Enhance your skills with government-sponsored training programs in various sectors to improve employability."
  },
  {
    title: "Startup India",
    organization: "Ministry of Commerce and Industry",
    eligibility: "Innovative business ideas",
    benefits: "Funding, Mentorship, Tax benefits",
    description: "Get support for your startup through this initiative aimed at fostering entrepreneurship and innovation."
  },
  {
    title: "Digital India",
    organization: "Ministry of Electronics & IT",
    eligibility: "All citizens",
    benefits: "Digital literacy, Online services",
    description: "Participate in India's digital transformation. Learn digital skills and access government services online."
  }
];

export default function JobsAndSchemes() {
  const [status, setStatus] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
          onClick={() => setStatus(false)} // Reset status when "New" is clicked
        >
          New
        </button>
        <button
          className="flex-1 px-4 py-3 bg-gradient-to-r from-black-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
          onClick={() => setStatus(true)} // Show status when "Check Status" is clicked
        >
          Check Status
        </button>
      </div>

      {!status ? (
        <div className="space-y-6">
          {/* Jobs Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {jobs.map((job, index) => (
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
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Schemes Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Schemes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schemes.map((scheme, index) => (
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
              ))}
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