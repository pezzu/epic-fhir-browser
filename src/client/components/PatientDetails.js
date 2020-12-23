import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

const PatientDetails = () => {
  const { patient: patientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState({});

  useEffect(() => {
    fetch(`/api/v1/patient/${patientId}`, { method: "GET" })
      .then((response) => response.json())
      .then((patient) => {
        setPatientData(patient);
        setLoading(false);
      });
  }, [patientId]);

  if(loading) return <Spinner/>;

  return <div>Patient details for {patientId}</div>;
};

PatientDetails.protoTypes = {};

export default PatientDetails;
