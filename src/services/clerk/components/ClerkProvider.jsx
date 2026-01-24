import React, { ReactNode } from "react";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";

const ClerkProvider = ({ children }) => {
  return (
    <OriginalClerkProvider>
      {children}
    </OriginalClerkProvider>
  );
};

export default ClerkProvider;
