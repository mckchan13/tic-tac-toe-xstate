import { PropsWithChildren, ReactNode } from "react";
import useNavigation from "../hooks/useNavigation";

function Route({
  children,
  path,
}: PropsWithChildren<{ path: string }>): ReactNode {
  const { currentPath } = useNavigation();

  if (path === currentPath) return children;

  return null;
}

export default Route;
