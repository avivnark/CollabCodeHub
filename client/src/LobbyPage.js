// LobbyPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import codeBlocks from './codeBlocksData';

const LobbyPage = () => {
    console.log('LobbyPage component rendered');
    return (
        <div className="lobby-container">
            <h1>Choose code block</h1>
            <ul>
                {codeBlocks.map((block) => (
                    <li key={block.id}>
                        <Link to={`/code/${block.id}`}>
                            <strong>{block.name}</strong>
                            <p>{block.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LobbyPage;
