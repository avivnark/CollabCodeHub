import React, { useState } from 'react';

function Student({ socket, id }) {
    const [code, setCode] = useState('');

    // Function to handle code changes and emit 'code_change' event to the server
    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);

        // Emit 'code_change' event to the server
        socket.emit('code_change', { code: newCode, id: parseInt(id, 10) });
    };

    return (
        <textarea
            placeholder="Enter code here..."
            value={code}
            onChange={handleCodeChange}
            rows={10}
            cols={50}
        />
    );
}

export default Student;
