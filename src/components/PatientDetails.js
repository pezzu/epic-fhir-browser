import { useParams } from "react-router-dom";

const PatientDetails = () => {
  const { patient } = useParams();
  return <div>Patient details for {patient}</div>;
};

export default PatientDetails;
