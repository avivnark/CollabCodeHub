import React, { useEffect, useState, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

function Mentor({ socket }) {
  const [codeReceived, setCodeReceived] = useState('');
  const codeRef = useRef();

  useEffect(() => {
    const handleCodeReceived = (data) => {
      setCodeReceived(data.code);

      // Highlight the code
      if (codeRef.current) {
        hljs.highlightBlock(codeRef.current);
      } else {
        console.warn('codeRef.current is null or undefined');
      }
    };

    socket.on('receive_code', handleCodeReceived);

    return () => {
      // Clean up event listener when the component unmounts
      socket.off('receive_code', handleCodeReceived);
    };
  }, [socket]);

  return (
    <code ref={codeRef} className="language-javascript">
      {codeReceived}
    </code>
  );
}

export default Mentor;
