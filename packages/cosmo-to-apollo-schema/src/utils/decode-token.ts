import { jwtDecode } from 'jwt-decode';

type GraphToken = {
  federated_graph_id: string;
  organization_id: string;
};

export const decodeToken = (token: string) => {
  const claims = jwtDecode<GraphToken>(token);

  return {
    federatedGraphId: claims.federated_graph_id,
    organizationId: claims.organization_id,
  };
};
