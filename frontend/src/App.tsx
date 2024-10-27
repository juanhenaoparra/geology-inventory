import React from 'react';
import Header from './components/Header';
import ToolRequestForm from './components/ToolsRequesForm';
import ToolList from './components/ToolsList';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <ToolRequestForm />
            <ToolList /> {/* Solo llamamos a ToolList aquí */}
        </div>
    );
};

export default App;
