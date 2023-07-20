import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container} from 'react-bootstrap';
import { LoginLayout, NavigationBar, MainLayout, NotFoundLayout } from './components/Layout';
import { useEffect, useState } from 'react';
import Api from './Api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  
  const [user,setUser] = useState(undefined);
  useEffect(()=>{
    const checkAuth = async ()=>{
      try{
        setUser(await Api.getUserInfo())
      } catch(err){
        setUser(undefined);
      }
    };
    checkAuth();
  },[])
  return (<>
    <BrowserRouter>
      <Container fluid className="App">   
        <Routes>  
          <Route path="/" element={<NavigationBar user={user} setUser={(newuser)=>setUser(newuser)}/>} >
            <Route index element={<MainLayout user={user}/>} />
            <Route path='/login' element={<LoginLayout setUser={(newUser)=>setUser(newUser)}/>} />
            { user && <>
              <Route path='/add' element={<MainLayout user={user}/>}/>
              <Route path='/add/:code' element={<MainLayout user={user}/>}/>
              <Route path='/remove/:code' element={<MainLayout user={user}/>}/>
              </>
            }
            <Route path='*' element={<NotFoundLayout/>}/>
          </Route>
        </Routes>   
      </Container>
    </BrowserRouter>
    </>
  );
}

export default App;
