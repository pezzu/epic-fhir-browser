import { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import PropTypes from "prop-types";

const Spinner = ({ delay = 2000 }) => {
  const [itsTime, setItsTime] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setItsTime(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div className="flex justify-center items-center">
      {itsTime && (
        <Loader
          type="Watch"
          color="#19194d"
          height={100}
          width={100}
          timeout={5000}
        />
      )}
    </div>
  );
};

Spinner.propTypes = {
  delay: PropTypes.number,
};

export default Spinner;
