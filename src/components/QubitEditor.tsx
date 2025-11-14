// src/components/QubitEditor.tsx
import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme for editor

import { Lexer } from '../qubit/lexer/lexer';
import { Parser } from '../qubit/parser/parser';
import { Interpreter } from '../qubit/interpreter/interpreter';
import QubitAssistant from './QubitAssistant';

const QubitEditor: React.FC = () => {
  const [code, setCode] = useState(
    'fun sayHi(first, last) {\n' +
    '  print "Hi, " + first + " " + last + "!";\n' +
    '}\n' +
    '\n' +
    'sayHi("Dear", "User");'
  );
  const [output, setOutput] = useState<string[]>([]);
  const [isAssistantVisible, setAssistantVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssistantVisible(true);
    }, 1500); // Pop up after 1.5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const runScript = () => {
    setOutput([]); // Clear previous output
    const lexer = new Lexer(code);
    const tokens = lexer.scanTokens();
    
    const parser = new Parser(tokens);
    const statements = parser.parse();

    if (statements) {
      const interpreter = new Interpreter();
      
      // Mock 'print' function
      const oldLog = console.log;
      console.log = (...args) => {
        setOutput(prev => [...prev, args.map(arg => String(arg)).join(' ')]);
        oldLog(...args);
      };

      interpreter.interpret(statements);

      console.log = oldLog; // Restore original console.log
    } else {
      setOutput(["Parsing failed. Check console for errors."]);
    }
  };

  return (
    <div className="relative p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">Qubit Playground</h1>
      <p className="mb-6 text-gray-400">
        A simple scripting language for the Quantum Charts platform.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Editor</h2>
          <div className="editor-container" style={{ minHeight: '300px' }}>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => highlight(code, languages.javascript, 'javascript')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                backgroundColor: '#2d2d2d',
                borderRadius: '4px',
              }}
            />
          </div>
          <button 
            onClick={runScript}
            className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Run Script
          </button>
        </div>

        {/* Output */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Output</h2>
          <pre className="bg-gray-900 p-4 rounded whitespace-pre-wrap text-sm h-full min-h-[300px]">
            {output.join('\n')}
          </pre>
        </div>
      </div>

      {isAssistantVisible && <QubitAssistant onClose={() => setAssistantVisible(false)} />}
    </div>
  );
};

export default QubitEditor;
