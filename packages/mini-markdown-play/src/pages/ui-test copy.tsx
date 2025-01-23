// import { Heading } from '@mini-markdown/material/src/components/Heading/index.tsx';
import { Heading } from '@mini-markdown/material';
import { useRef } from 'react';
import ReactDOMServer from 'react-dom/server';

function App() {
  const editRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (document.activeElement != editRef.current) {
      editRef.current!.focus()
    }
    const headingHtml = ReactDOMServer.renderToStaticMarkup(<Heading level={2}>hello</Heading>);
    document.execCommand('insertHTML', false, headingHtml);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    console.log('input event', e);
    // const selection = getSelection();
    // if (selection && selection.rangeCount > 0) 
    //   const range = selection.getRangeAt(0);
    //   console.log('Current cursor position:', range);
    // }
  };

  const getText = () => {
    console.log(editRef.current?.innerText);
    
  }

  return (
    <div>
      <header
        style={{
          width: '50%',
          border: '1px solid red',
          margin: '0 auto',
          padding: '0 10px'
        }}
      >
        <button onClick={handleClick}>h1</button>
        <button onClick={getText}>获取内容</button>
      </header>
      <div
        style={{
          width: '50%',
          height: '50vh',
          border: '1px solid red',
          margin: '0 auto',
          padding: '10px'
        }}
        contentEditable={true}
        onInput={handleInput}
        spellCheck={false}
        suppressContentEditableWarning={true}
        autoFocus={true}
        ref={editRef}
      >
        <Heading level={2}>hello</Heading>
      </div>
    </div>
  );
}

export default App;