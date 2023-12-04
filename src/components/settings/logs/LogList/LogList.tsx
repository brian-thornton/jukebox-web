import { useContext, useEffect, useState } from 'react';

import { getLogs } from '../../../../lib/service-clients/log-client';
import { calculatePageSize } from '../../../../lib/helper/styleHelper';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import LogDetail from '../LogDetail/LogDetail';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { ILog, ILogs } from '../../../interface';

const LogList = () => {
  const settings = useContext(SettingsContext);
  const [logs, setLogs] = useState<ILogs | undefined>(undefined);
  const [selectedLog, setSelectedLog] = useState<ILog | undefined>(undefined);
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
      {!selectedLog && logs?.messages?.length && (
        <PaginatedList
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          totalItems={logs?.totalLogs}
          pageSize={itemsPerPage}
          items={logs?.messages?.map(m => ({ onItemClick: (m: ILog) => setSelectedLog(m), text: JSON.stringify(m.message) }))}
          onItemClick={(item: ILog) => setSelectedLog(item)}
          hideButtons={screen?.isMobile}
        />
      )}
      {selectedLog && <LogDetail log={selectedLog} onClose={() => setSelectedLog(undefined)} />}
    </>
  );
};

export default LogList;
