/* eslint-disable @typescript-eslint/no-explicit-any */
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "../ui/ErrorBoundary";

const SEO = ({ pageTitle }: any) => {
  return (
    <ErrorBoundary>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{pageTitle} Book My Travel Agents</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="description" content="Book My Travel Agents" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Helmet>
    </ErrorBoundary>
  );
};

export default SEO;