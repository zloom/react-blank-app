import React, { ReactNode } from "react";
import { Connector } from "../../../utils/actions";
import { getUser } from "../actions";

const connector = new Connector(a => a.layout, { getUser: getUser.request });

type Props = typeof connector.allProps & { children: ReactNode };

const Layout = (props: Props) => {
  return (
    <div>
      {props.currentUser && props.currentUser.name}
      <button onClick={() => props.getUser()}>TEST</button>
      body:
      {props.children}
    </div>
  );
};

export default connector.connect()(Layout);
