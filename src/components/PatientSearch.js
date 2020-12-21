import { useState } from "react";

const PatientSearch = () => {
  const [mrn, setMRN] = useState("");

  return (
    <div className="w-full max-w-6xl">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="w-full text-center text-2xl font-bold text-gray-700 mb-6">
          Patient Search
        </div>
        <div>
          <label>MRN</label>
          <input
            id="patient-mrn"
            type="text"
            placeholder="Z12345"
            value={mrn}
            onChange={(e) => setMRN(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default PatientSearch;
