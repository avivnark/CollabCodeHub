import React, { useEffect, useState, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

function Mentor({ socket, id }) {
  const [codeReceived, setCodeReceived] = useState('Waiting for code');
  const codeRef = useRef();

  useEffect(() => {
    // Function to handle code received and highlight the code
    const handleCodeReceived = (data) => {
      // Parse data.id and id to integers
      const receivedId = parseInt(data.id, 10);
      const expectedId = parseInt(id, 10);

      // Check if the parsed received ID matches the parsed expected ID
      if (receivedId === expectedId) {
        setCodeReceived(data.code);

        // Highlight the code
        if (codeRef.current) {
          hljs.highlightBlock(codeRef.current);
        } else {
          console.warn('codeRef.current is null or undefined');
        }
      }
    };

    // Add an event listener for the 'receive_code' event
    socket.on('receive_code', handleCodeReceived);

    // Clean up event listener when the component unmounts
    return () => {
      socket.off('receive_code', handleCodeReceived);
    };
  }, [socket, id]);

  return (
    <pre>
      <code ref={codeRef} className="language-javascript">
        {codeReceived}
      </code>
    </ pre>

  );
}

export default Mentor;
