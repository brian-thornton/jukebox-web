import React, { useEffect, useState } from 'react';

import { getLogs } from '../../../lib/log-client';
import { pageSize } from '../../../lib/styleHelper';
import PaginatedList from '../../common/PaginatedList';
import LogDetail from './LogDetail';

const LogList = () => {
  const [logs, setLogs] = useState();
  const [selectedLog, setSelectedLog] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [level, setLevel] = useState('INFO');
  const itemsPerPage = pageSize('item', 250, 40)
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const loadLogs = () => {
    getLogs(start, (start + itemsPerPage), level).then((data) => {
      setLogs(data);
    });
  }

  useEffect(loadLogs, []);
  useEffect(loadLogs, [selectedPage]);

  return (
    <>
      {!selectedLog && logs?.messages?.length > 0 && (
        <PaginatedList
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          totalItems={logs?.totalLogs}
          pageSize={itemsPerPage}
          items={logs?.messages?.map(m => ({ text: JSON.stringify(m.message) }))}
          onItemClick={(item) => setSelectedLog(item)}
        />
      )}
      {selectedLog && <LogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </>
  );
};

export default LogList;
