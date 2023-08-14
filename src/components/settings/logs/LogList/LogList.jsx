import React, { useContext, useEffect, useState } from 'react';

import { getLogs } from '../../../../lib/log-client';
import { calculatePageSize } from '../../../../lib/styleHelper';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import LogDetail from '../LogDetail/LogDetail';
import { SettingsContext } from '../../../layout/SettingsProvider';

const LogList = () => {
  const settings = useContext(SettingsContext);
  const [logs, setLogs] = useState();
  const [selectedLog, setSelectedLog] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [level, setLevel] = useState('INFO');
  const itemsPerPage = calculatePageSize('item', 250, 40);
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);
  const { screen } = settings;

  const loadLogs = () => {
    getLogs(start, (start + itemsPerPage), level).then((data) => {
      setLogs(data);
    });
  };

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
          onItemClick={item => setSelectedLog(item)}
          hideButtons={screen.isMobile}
        />
      )}
      {selectedLog && <LogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </>
  );
};

export default LogList;
