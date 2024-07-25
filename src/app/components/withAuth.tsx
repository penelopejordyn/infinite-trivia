import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

const withAuth = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;

    if (!user) {
      if (typeof window !== "undefined") {
        window.location.href = "/api/auth/login";
      }
      return null;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
