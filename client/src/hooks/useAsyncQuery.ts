import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "../components/ui/Toast";

interface UseAsyncQueryOptions {
  /** Show toast on load failure. Defaults to true. */
  toastOnError?: boolean;
  errorMessage?: string;
  /** Run the query on mount. Defaults to true. */
  immediate?: boolean;
}

interface UseAsyncQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<T | null>;
  setData: Dispatch<SetStateAction<T | null>>;
}

export function useAsyncQuery<T>(
  fetcher: () => Promise<T>,
  options: UseAsyncQueryOptions = {},
): UseAsyncQueryResult<T> {
  const {
    toastOnError = true,
    errorMessage = "Failed to load data",
    immediate = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch {
      setError(errorMessage);
      if (toastOnError) toast(errorMessage, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetcher, errorMessage, toastOnError]);

  useEffect(() => {
    if (immediate) {
      void reload();
    }
  }, [immediate, reload]);

  return { data, loading, error, reload, setData };
}
