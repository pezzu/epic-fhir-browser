import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

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

  if(loading) return <Spinner/>;

  return <div>Patient details for {details.patient.id}</div>;
};

PatientDetails.protoTypes = {};

export default PatientDetails;
