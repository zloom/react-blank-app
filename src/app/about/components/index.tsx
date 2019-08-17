import React, { useEffect } from "react";
import { Connector } from "../../../utils/actions";
import { getVersion } from "../actions";

const connector = new Connector(a => a.about, { getVersion: getVersion.request });

type Props = typeof connector.allProps;

const About = (props: Props) => {

  useEffect(() => {
    props.getVersion();
  }, []);

  return (
    <div>
      {props.version && props.version.major || "vers"}
    </div>
  );
};

export default connector.connect()(About);
