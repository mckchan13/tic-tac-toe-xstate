import { useState } from "react";

function useLoading(initial?: boolean) {
  const [isLoading, setLoading] = useState<boolean>(initial ?? false);

  return {
    isLoading,
    setLoading,
  };
}

export default useLoading;
