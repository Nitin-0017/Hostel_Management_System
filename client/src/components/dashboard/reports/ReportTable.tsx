import React from "react";
import "./ReportTable.css";

interface ReportTableProps {
  type: "OCCUPANCY" | "COMPLAINT" | "LEAVE";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const ReportTable: React.FC<ReportTableProps> = ({ type, data }) => {
  if (type === "OCCUPANCY") {
    const list = data.details || [];
    return (
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Room No</th>
              <th>Block</th>
              <th>Capacity</th>
              <th>Occupied</th>
              <th>Vacant</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} className="text-center">No detailed data available</td></tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              list.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item.roomNumber}</td>
                  <td>{item.building || "N/A"}</td>
                  <td>{item.capacity}</td>
                  <td>{item.occupied}</td>
                  <td>{item.capacity - item.occupied}</td>
                  <td>
                    <span className={`status-badge ${item.capacity === item.occupied ? 'full' : 'available'}`}>
                      {item.capacity === item.occupied ? 'Full' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "COMPLAINT") {
    const list = data.details || [];
    return (
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Category</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Resolved At</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} className="text-center">No detailed data available</td></tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              list.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item.subject}</td>
                  <td>{item.category}</td>
                  <td>{item.studentId?.substring(0, 8)}...</td>
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{item.resolvedAt ? new Date(item.resolvedAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "LEAVE") {
    const list = data.details || [];
    return (
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Days</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} className="text-center">No detailed data available</td></tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              list.map((item: any, i: number) => {
                const start = new Date(item.fromDate);
                const end = new Date(item.toDate);
                const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
                
                return (
                  <tr key={i}>
                    <td>{item.studentId?.substring(0, 8)}...</td>
                    <td>{start.toLocaleDateString()}</td>
                    <td>{end.toLocaleDateString()}</td>
                    <td>{days > 0 ? days : 1}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="truncate-text" title={item.reason}>{item.reason}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default ReportTable;
