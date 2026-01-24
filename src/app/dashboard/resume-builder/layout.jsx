import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <Suspense
        fallback={<Loader2 className="mt-4 animate-spin size-20 mx-auto" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}