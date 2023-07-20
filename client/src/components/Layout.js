import { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Container, Form, Navbar, Row, Table } from "react-bootstrap";
import { Link, Outlet, useLocation, useNavigate  } from "react-router-dom";
import Api from "../Api";
import { ExamTable, StudyplanTable } from "./ExamsLibrary";

function NavigationBar(props){

    return <>
        <Navbar expand="lg" variant="light" bg="light">
            <Container>
                <Navbar.Brand>
                    <Link  to={'/'}>Home</Link>
                </Navbar.Brand>
                <Navbar.Brand>
                    {props.user ? <Link to={'/'} style={{color:"red"}} onClick={async()=>{try{await Api.logout();props.setUser(undefined);}catch(err){console.log(String(err))}}}>Logout</Link> :<Link to={'/login'}>Login</Link>}
                </Navbar.Brand>
            </Container>
        </Navbar>
    <Outlet/>
    </>
}

function MainLayout(props){
    const [exams,setExams] = useState([]);
    const [loading,setLoading] = useState(false);

    const studyplan = useRef([]);
    const carrierOption = useRef('');

    const navigate = useNavigate();
    
    useEffect(()=>{
        setLoading(true);
        try{
            (async ()=>setExams(await Api.getAll()))();
        }catch(err){
            console.log(String(err));
            setExams([]);
        }
        if(props.user){
            try{
                (async ()=>{
                    const response = await Api.getStudyplan();
                    if(response && response.studyplan && response.studyplan.length>0){
                        studyplan.current= response.studyplan;
                        carrierOption.current = response.carrierOption;
                        navigate('add');
                    } else {
                        navigate('/');
                    }
                })();
            } catch(err){
                console.log(String(err));
            }
        }
        setLoading(false);
        //warning: missing depedency 'navigate', but can't add or define the dependencies of a useCallback.
        // eslint-disable-next-line
    },[props.user])

    return <>
        <StudyplanTable studyplan={studyplan} user={props.user} carrierOption={carrierOption} setExams={(newExams)=>setExams(newExams)} />
        {loading ? <Alert>"Loading"</Alert> : <>
        <br></br>
        <h2><b>All the exams</b></h2>
        <br></br>
        { 
            props.user && <p><b>When you select an exam it is booked for 20 minutes</b></p>
        }  
        <Table variant="light" bg="light" striped bordered hover>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Credits</th>
                    <th>Students Enrolled</th>
                    <th>Max Students</th>
                    <th>Actions</th>
                </tr>
            </thead>
                <tbody>
                    <ExamTable exams={exams} user={props.user} studyplan={studyplan} carrierOption={carrierOption}/>
                </tbody>
        </Table>
        </>}
    </>
}

function LoginLayout(props){

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [msg,setMsg]=useState('');

    const navigate = useNavigate()
    const location = useLocation();
    const nextpage = location.state?.nextpage || '/';

    const handleSubmit= async (event)=>{
        event.preventDefault();
        try{
            const user = await Api.login({username:email,password:password})
            if(user!==undefined){
                props.setUser(user);
                navigate('/');
            } else {
                setMsg("Incorrect username or password.");
            }
        } catch(err){
            setMsg(err);
        }
    };

    return (<>
        { msg && <>
            <Alert variant="danger" onClose={() => setMsg('')} dismissible>
                <Alert.Heading>{msg}</Alert.Heading>
            </Alert></>
        }
    <Form className="block-example border border-primary border-3 rounded mb-0 form-padding bg-light" onSubmit={handleSubmit}>
         <Form.Group className="mb-3">
            <br></br>
            <br></br>
            <Row>
                <Col xs={3}>
                    <Form.Label><b>Email: </b></Form.Label>
                </Col>
                <Col xs={5}>
                    <Form.Control type="email" placeholder="name@example.com" required={true} value={email} onChange={event => setEmail(event.target.value)}/>
                </Col>
            </Row>
         </Form.Group>
         <Form.Group className="mb-3">
            <Row>
                <Col xs={3}>
                    <Form.Label><b>Password: </b></Form.Label>
                </Col>
                <Col xs={5}>
                    <Form.Control type="password" placeholder="Password" required={true} value={password} onChange={event => setPassword(event.target.value)}/>
                </Col>
            </Row>
         </Form.Group>
         <Button className="mb-3" variant="primary" type="submit">Submit</Button>
         &nbsp;
         <Link to={nextpage}> 
            <Button className="mb-3" variant="danger" >Cancel</Button>
         </Link>
        </Form>
    </>);
}

function NotFoundLayout() {
    const navigate = useNavigate();
    
    return(
        <>
          <h2>This is not the route you are looking for!</h2>
          <Link to="/">
            <Button variant="primary" onClick={()=>navigate("/")}>Go Home!</Button>
          </Link>
        </>
    );
  }


export {MainLayout,NavigationBar,LoginLayout,NotFoundLayout};