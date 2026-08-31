import { useState, useEffect, useCallback } from "react";
export function useDebouncedValue37<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
export function usePagination37(initialPage = 1, initialSize = 25) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const reset = useCallback(() => setPage(1), []);
  return { page, pageSize, setPage, setPageSize, reset };
}
export function useToggle37(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return { on, toggle, setOn };
}
