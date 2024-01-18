import React, { useEffect, useState, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

function Mentor({ socket, id }) {
  const [codeReceived, setCodeReceived] = useState('Waiting for code');
  const codeRef = useRef();

  useEffect(() => {
    const handleCodeReceived = (data) => {
      const receivedId = parseInt(data.id, 10);
      const expectedId = parseInt(id, 10);

      if (receivedId === expectedId) {
        setCodeReceived(data.code);

        if (codeRef.current) {
          hljs.highlightBlock(codeRef.current);
        } else {
          console.warn('codeRef.current is null or undefined');
        }
      }
    };

    socket.on('receive_code', handleCodeReceived);

    return () => {
      socket.off('receive_code', handleCodeReceived);
    };
  }, [socket, id]);

  return (
    <pre>
      <code ref={codeRef} className="language-javascript">
        {codeReceived}
      </code>
    </pre>
  );
}

export default Mentor;
