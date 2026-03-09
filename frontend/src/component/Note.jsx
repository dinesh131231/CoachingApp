
import React, { useState, useEffect } from 'react';

const Note = (props) => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    if (!props.name) {
      fetch((import.meta.env.BACKEND_PORT_URL || 'http://localhost:5000') + '/notices')
        .then(res => res.json())
        .then(data => {
          if (data.success) setNotices(data.notices);
        });
    }
  }, [props.name]);

  return (
    <div>
      <div className="h-64 w-64 bg-blue-200 rounded-2xl shadow-md p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Notices</h2>
        <div className="text-sm text-gray-700 overflow-auto max-h-48">
          {props.name ? (
            props.name
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {notices.length === 0 ? (
                <li className="text-gray-500">No notices posted yet.</li>
              ) : (
                notices.map((item) => (
                  <li key={item._id}>{item.text}</li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};


        export default Note;

