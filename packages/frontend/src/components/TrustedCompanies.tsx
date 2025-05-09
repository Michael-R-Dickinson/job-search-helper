import React from 'react';

const companies = [
  { name: "Microsoft", logo: "/logosCompanies/microsoft.png" },
  { name: "Nike", logo: "/logosCompanies/nike.png" },
  { name: "Meta", logo: "/logosCompanies/meta.png" },
  { name: "Netflix", logo: "/logosCompanies/netflix.png" },
];

const universities = [
  { name: "ubc", logo: "/logosCompanies/ubc.png" },
  { name: "harvard", logo: "/logosCompanies/harvard.png" },
  { name: "waterloo", logo: "/logosCompanies/waterloo.png" },
  { name: "stanford", logo: "/logosCompanies/stanford.png" },
];

const stats = [
  { value: "500K+", label: "Resumes Created" },
  { value: "75%", label: "Interview Rate" },
  { value: "98%", label: "ATS Pass Rate" },
  { value: "4.9/5", label: "User Rating" },
];
// YASH - COMEBACK TO MAKE ANIMATED 
const TrustedCompanies = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-2">
          Trusted by Professionals from <br />
          <span className="gradient-text">Leading Companies </span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our AI-enabled resume builder empowers professionals to secure positions at leading companies around the globe
        </p>
        <div className="flex justify-center items-center gap-10 mb-10 flex-wrap">
          {companies.map((company) => (
            <img
              key={company.name}
              src={company.logo}
              alt={company.name}
              className={`${company.name === "Microsoft" ? "h-16" : "h-10"} opacity-80`}
            />
          ))}
        </div>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Used by students from 
        </p>
        <div className="flex justify-center items-center gap-10 mb-10 flex-wrap">
          {universities.map((university) => (
            <img
              key={university.name}
              src={university.logo}
              alt={university.name}
              className={`${university.name === "ubc" ? "h-16" : "h-10"} opacity-80`}
            />
          ))}
        </div>

      


        

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;