import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

const SearchField = ({ label }) => {
  return (
    <div className="flex m-1">
      <label className="w-1/6 text-lg font-semibold">{label}</label>
      <input className="w-5/6 border border-gray-300 p-1" name={label} />
    </div>
  );
};

SearchField.propTypes = {
  label: PropTypes.string.isRequired,
};

const PatientSearch = () => {
  const form = useRef(null);
  const history = useHistory();
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setNotFound(false);

    const formData = new FormData(event.target);
    const asString = new URLSearchParams(formData).toString();

    fetch(`/api/v1/patient/?${asString}`, { method: "GET" })
      .then((response) => {
        if (response.ok) {
          response.json().then((results) => {
            if (results.length > 0) {
              const MRN = results[0].identifier.find(
                (i) => i.type?.text === "EXTERNAL"
              ).value;
              const query = new URLSearchParams(`identifier=EXTERNAL|${MRN}`)
              history.push(`patient?${query}`);
            } else {
              setNotFound(true);
            }
          });
        }
      })
      .catch((e) => console.error(e));
  };

  const handleReset = (event) => {
    setNotFound(false);
    form.current.reset();
  };

  return (
    <div className="w-full max-w-6xl">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
        ref={form}
      >
        <div className="w-full text-center text-2xl font-bold text-gray-700 mb-6">
          Patient Search
        </div>
        <div className="text-md leading-snug text-justify">
          {/* <p className="text-red-600 font-semibold mb-2">Description</p> */}
          <p className="mb-2">
            The FHIR Patient resource defines demographics, care providers, and
            other administrative information about a person receiving care at a
            health organization.
          </p>
          <p className="mb-2">
            Starting in the May 2019 version of Epic, Patient.Search requests
            require one of the following minimum data sets by default in order
            to match and return a patient record:
          </p>
          <ul className="ml-12 list-disc">
            <li>FHIR ID</li>
            <li>{"{IDType}|{ID}"}</li>
            <li>SSN identifier</li>
            <li>Given name, family name, and birthdate</li>
            <li>Given name, family name, gender, and phone number/email</li>
          </ul>
        </div>
        <div className="mx-4 mt-8">
          <SearchField label="address" />
          <SearchField label="address-city" />
          <SearchField label="address-postalcode" />
          <SearchField label="address-state" />
          <SearchField label="birthdate" />
          <SearchField label="family" />
          <SearchField label="gender" />
          <SearchField label="given" />
          <SearchField label="identifier" />
          <SearchField label="own-name" />
          <SearchField label="own-prefix" />
          <SearchField label="partner-name" />
          <SearchField label="partner-prefix" />
          <SearchField label="telecom" />
        </div>
        {(notFound && (
          <div className="text-red-500 text-center">Patient not found</div>
        )) || <br />}
        <div className="flex text-lg justify-around mt-8">
          <button
            type="button"
            onClick={handleReset}
            className="bg-white border-blue-500 border-2 text-blue-500 font-semibold py-2 px-6 rounded-xl shadow-lg focus:outline-none focus:shadow-outline"
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-blue-500 border-blue-500 border-2 text-white font-semibold py-2 px-6 rounded-xl shadow-lg focus:outline-none focus:shadow-outline"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

PatientSearch.propTypes = {};

export default PatientSearch;
