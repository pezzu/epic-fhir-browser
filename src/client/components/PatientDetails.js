import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

Section.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

const LabeledField = ({ label, value }) => {
  return (
    <div className="flex w-full">
      <span className="w-1/6 text-sm font-bold">{label}</span>
      <span className="w-5/6">{value}</span>
    </div>
  );
};

LabeledField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const PatientInfo = ({ patient }) => {
  const [year, month, day] = patient.birthDate.split('-');
  const birthDate = (year && month && day)? `${month}/${day}/${year}` : patient.birthDate;
  return (
    <Section header="Patient Information">
      <LabeledField label="Name" value={patient.name[0].text} />
      <LabeledField label="Gender" value={patient.gender} />
      <LabeledField label="DOB" value={birthDate} />
    </Section>
  );
};

PatientInfo.propTypes = {
  patient: PropTypes.object.isRequired,
};

const Table = ({ layout, items }) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          {Object.keys(layout).map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((entry, i) => (
          <tr key={i}>
            {Object.values(layout).map((selector, i) => (
              <td key={i} className="py-1 px-2 border-2 border-gray-500">
                {selector(entry)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  layout: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
};

const MedicationsList = ({ items }) => {
  return (
    <Table
      layout={{
        Status: (entry) => entry.status,
        Medication: (entry) => entry.medicationReference.display,
        Dosage: (entry) => entry.dosageInstruction[0].text,
      }}
      items={items}
    />
  );
};

MedicationsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
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

MedicationInfo.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
};

const ConditionsList = ({ items }) => {
  return (
    <Table
      layout={{
        Status: (entry) => entry.clinicalStatus.text,
        Conditon: (entry) => entry.code.text,
        Severity: (entry) => entry.severity?.text,
      }}
      items={items}
    />
  );
};

ConditionsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
};

const ConditionInfo = ({ items }) => {
  return (
    <Section header="Conditions">
      {items.length > 0 ? (
        <ConditionsList items={items} />
      ) : (
        <div className="text-center">No conditions found for patient</div>
      )}
    </Section>
  );
};

ConditionInfo.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
};

const ClinicalNote = ({ note }) => {
  return (
    <div className="border-2 mb-3">
      <div className="text-center text-xl text-white bg-blue-500 mb-3">
        {note.type.text}
      </div>
      <div className="px-2"
        dangerouslySetInnerHTML={{ __html: note.content[0].attachment }}
      ></div>
    </div>
  );
};

ClinicalNote.propTypes = {
  note: PropTypes.object.isRequired,
}

const ClinicalNotesInfo = ({ items }) => {
  return (
    <Section header="Clinical Notes">
      {items.map((note) => (
        <ClinicalNote key={note.id} note={note} />
      ))}
    </Section>
  );
};

ClinicalNotesInfo.protoTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
}

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

  if (loading) return <Spinner delay={1500} />;

  return (
    <div className="w-full max-w-6xl">
      <div className="bg-white shadow-md rounded px-8 py-8 mb-4 -mt-6">
        <PatientInfo patient={details.patient} />
        <MedicationInfo items={details.medications} />
        <ConditionInfo items={details.conditions} />
        <ClinicalNotesInfo items={details.notes} />
      </div>
    </div>
  );
};

PatientDetails.protoTypes = {};

export default PatientDetails;
