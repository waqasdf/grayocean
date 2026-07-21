import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PageNotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-go-page text-go-text">Page not found</h1>
      <p className="text-go-body-sm text-go-text-muted">
        That route does not exist in Gray Ocean.
      </p>
      <Link
        to={isAuthenticated ? "/" : "/Login"}
        className="text-go-body font-medium text-go-primary hover:text-go-primary-hover"
      >
        {isAuthenticated ? "Back to workspace" : "Sign in"}
      </Link>
    </div>
  );
}
