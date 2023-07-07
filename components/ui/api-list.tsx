"use client";

import { useParams } from "next/navigation";

import { useOrigin } from "@/hooks/use-origin";
import { ApiAlert } from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

const ApiList: React.FC<ApiListProps> = ({ entityIdName, entityName }) => {
  const params = useParams();
  const origin = useOrigin();

  const BASE_URL = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${BASE_URL}/${entityName}`}
      />

      <ApiAlert
        title="GET"
        variant="public"
        description={`${BASE_URL}/${entityName}/{${entityIdName}}`}
      />

      <ApiAlert
        title="POST"
        variant="admin"
        description={`${BASE_URL}/${entityName}`}
      />

      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${BASE_URL}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${BASE_URL}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};

export default ApiList;
