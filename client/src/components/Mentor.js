import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';


function Mentor({ socket, id }) {
  const [codeReceived, setCodeReceived] = useState('Waiting...');

  useEffect(() => {
    const handleCodeReceived = (data) => {
      const receivedId = parseInt(data.id, 10);
      const expectedId = parseInt(id, 10);

      if (receivedId === expectedId) {
        setCodeReceived(data.code);
      }
    };

    socket.on('receive_code', handleCodeReceived);

    return () => {
      socket.off('receive_code', handleCodeReceived);
    };
  }, [socket, id]);


  return (
    <SyntaxHighlighter language="javascript" style={atomOneDark}>
      {codeReceived}
    </SyntaxHighlighter>
  );
}

export default Mentor;
