import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

const Section = ({ header, children }) => {
  return (
    <div className="mb-6">
      <div className="mt-7 mb-4 p-1 bg-blue-800 text-white text-center text-xl tracking-wide font-semibold">
        {header}
      </div>
      <div className="flex flex-col justify-center px-4">{children}</div>
    </div>
  );
};

const LabeledField = ({ label, value }) => {
  return (
    <div className="flex w-full">
      <span className="w-1/6 text-sm font-bold">{label}</span>
      <span className="w-5/6">{value}</span>
    </div>
  );
};

const PatientInfo = (props) => {
  return (
    <Section header="Patient Information">
      <LabeledField label="Name" value={props.name[0].text} />
      <LabeledField label="Gender" value={props.gender} />
      <LabeledField label="DOB" value={props.birthDate} />
    </Section>
  );
};

const MedicationEntry = ({ status, medication, dosage }) => {
  return (
    <tr>
      <td className="py-1 px-2 border-2 border-gray-500">{status}</td>
      <td className="py-1 px-2 border-2 border-gray-500">{medication}</td>
      <td className="py-1 px-2 border-2 border-gray-500">{dosage}</td>
    </tr>
  );
};

const MedicationsList = ({ items }) => {
  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th>Status</th>
          <th>Medication</th>
          <th>Dosage</th>
        </tr>
      </thead>
      <tbody>
        {items.map((entry) => (
          <MedicationEntry
            key={entry.id}
            status={entry.status}
            medication={entry.medicationReference.display}
            dosage={entry.dosageInstruction[0].text}
          />
        ))}
      </tbody>
    </table>
  );
};

const MedicationInfo = ({ items }) => {
  return (
    <Section header="Medications">
      {items.length > 0 ? (
        <MedicationsList items={items} />
      ) : (
        <div className="text-center">No medications found for patient</div>
      )}
    </Section>
  );
};

const ConditionsEntry = ({ status, condition, severity }) => {
  return (
    <div>
      <div>{status}</div>
      <div>{condition}</div>
      <div>{severity}</div>
    </div>
  );
};

const ConditionsList = ({ items }) => {
  return items.map((entry) => (
    <ConditionsEntry
      key={entry.id}
      status={entry.clinicalStatus.text}
      condition={entry.code.text}
      severity={entry.severity?.text}
    />
  ));
};

const ConditionInfo = ({ items }) => {
  return (
    <Section header="Conditions">
      {items.length > 0 ? (
        <ConditionsList items />
      ) : (
        <div className="text-center">No conditions found for patient</div>
      )}
    </Section>
  );
};

const PatientDetails = () => {
  const { search } = useLocation();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});

  useEffect(() => {
    fetch(`/api/v1/patient/details/${search}`, { method: "GET" })
      .then((response) => response.json())
      .then((patient) => {
        setDetails(patient);
        setLoading(false);
      });
  }, [search]);

  if (loading) return <Spinner />;

  return (
    <div className="w-full max-w-6xl">
      <div className="bg-white shadow-md rounded px-8 py-8 mb-4 -mt-6">
        <PatientInfo {...details.patient} />
        <MedicationInfo items={details.medication} />
        <ConditionInfo items={details.condition} />
      </div>
    </div>
  );
};

PatientDetails.protoTypes = {};

export default PatientDetails;
