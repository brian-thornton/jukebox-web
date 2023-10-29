import { useEffect, useState } from 'react';

export function useLogs(start, itemsPerPage, level) {
  const [logs, setLogs] = useState();

  const loadLogs = () => {
    getLogs(start, (start + itemsPerPage), level).then((data) => {
      setLogs(data);
    });
  };

  useEffect(() => {
    if (itemsPerPage > 0) {
      loadLogs();
    }
  }, [start, itemsPerPage, level]);

  return { logs, loadLogs };
}
