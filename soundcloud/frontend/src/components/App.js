import React from "react";
import { render } from "react-dom";
import Home from "./Home";

/**
 * Main component
 *
 * @return {object} JSX
*/
function App() {
    return (
        <Home/>
    );
}

const appDiv = document.getElementById("app");
render(<App/>, appDiv);

export default App;