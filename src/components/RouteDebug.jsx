import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const RouteDebug = () => {
  const location = useLocation();
  const params = useParams();
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#ff0000',
      color: '#ffffff',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      fontFamily: 'monospace',
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <div><strong>Route Debug:</strong></div>
      <div>Path: {location.pathname}</div>
      <div>Params: {JSON.stringify(params)}</div>
      <div>Search: {location.search}</div>
    </div>
  );
};

export default RouteDebug;