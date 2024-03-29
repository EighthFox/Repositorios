import { Home, Landing, Form, Detail } from './views';
import { Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';

function App() {
  const location = useLocation();
  return (
    <div className="App">
      {location.pathname !== "/" && <NavBar />}
      <Route exact path="/" component={Landing} />
      <Route path="/home" render={() => <Home />} />
      <Route path="/detail" render={() => <Detail />} />
      {/* <Route path="/create" render={() => <Form />} /> */}
      <Route path="/create" component={Form} />
    </div>
  );
}

export default App;
