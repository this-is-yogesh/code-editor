import EditorPanel from "./_components/EditorPanel";
import Header from "./_components/Header";
import { OutputPanel } from "./_components/OutputPanel";
import "./rootPage.css";

function App() {
  return (
    <div className="rootparentdiv">
      <div className="firstBox">
        <Header />
        <div className="editoroutputbox">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
