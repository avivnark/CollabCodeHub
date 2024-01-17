import "./App.css";
import React, { useState } from 'react';

function Student({ socket, id }) {
    const [code, setCode] = useState('');

    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        // Automatically send the code when it changes
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

