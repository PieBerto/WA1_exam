import { useEffect, useState } from "react";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Api from "../Api";
import { BsArrowDown,BsArrowUp } from "react-icons/bs";

function ExamTable(props){
    return <>
        {props.exams.map((exam)=>
            <ExamRow key={exam.code} exam={exam} studyplan={props.studyplan} carrierOption={props.carrierOption} user={props.user} / >
        )}
    </>
}

function ExamRow(props){
    const [show,setShow] = useState(false);
    const [msg,setMsg] = useState('');
    const [paintItRed,setPaintItRed] = useState(false);
    const [loading,setLoading]=useState(false);

    const navigate = useNavigate();

    const studyplaStarted = Boolean(props.carrierOption.current);
    useEffect(()=>{
        if(studyplaStarted && props.user){
            let toPaintRed=false;
            props.studyplan.current.forEach((exam)=>{
                if(exam.code===props.exam.code){
                    toPaintRed=true;
                }else if(exam.incompatibleWith){
                    exam.incompatibleWith.split(' ').forEach((code)=>{
                        if(code===props.exam.code)
                            toPaintRed=true;
                    })
                }
            })
            if(props.exam.preparatoryCourse){
                let preparatoryAlreadyInserted = props.exam.preparatoryCourse.split(' ').length;
                props.exam.preparatoryCourse.split(' ').forEach((code)=>{
                    props.studyplan.current.forEach((exam)=>{
                        if(exam.code===code)
                            preparatoryAlreadyInserted--;
                    })
                })
                if(preparatoryAlreadyInserted!==0)
                    toPaintRed=true;
            }
            setPaintItRed(toPaintRed);
        } else {
            setPaintItRed(false);
        }
    },[props.exam.code,props.exam.preparatoryCourse,props.studyplan,props.carrierOption,props.studyplan.current.length,studyplaStarted,props.user])

    const reverseShow = (oldShow)=>setShow(!oldShow)

    const addExamToStudyplan = async (exam)=>{
        setLoading(true);
        let alreadyPresent=false;
        props.studyplan.current.forEach((oldExam)=>{
            if(oldExam.code===exam.code)
                alreadyPresent=true
        })
        if(alreadyPresent){
            setMsg("The exam selected is already present.");
        } else {
            let incompatible=true;
            props.studyplan.current.forEach((oldExam)=>{
                if(oldExam.incompatibleWith){
                    oldExam.incompatibleWith.split(' ').forEach((code)=>{
                        if(code===exam.code){
                            setMsg("Can't insert this exam if "+exam.code+" is already present.");
                            incompatible=false;
                        }
                    })
                }
            });
            let preparatory=true;
            if(exam.preparatoryCourse){
                preparatory=false;
                setMsg('To insert this exam you must insert '+ exam.preparatoryCourse + " before.");
                props.studyplan.current.forEach((oldExam)=>{
                    exam.preparatoryCourse.split(' ').forEach((code)=>{
                        if(code===oldExam.code) {
                            preparatory=true;
                            setMsg('')
                        }
                    })
                })
            }
            if(preparatory && incompatible){
                //Max Students check
                try{
                    const studentsEnrolledNumber = (await Api.newStudentEnrolled(exam.code));
                    if(studentsEnrolledNumber === false){
                        throw new TypeError(400);
                    }
                    props.exam.studentsEnrolled = studentsEnrolledNumber;
                    props.studyplan.current = props.studyplan.current.concat(exam);
                    navigate("/add/"+exam.code);
                } catch(err){
                    setMsg("This course can't have other students enrolled.");
                }
            }
        }
        setLoading(false);
    }

    return <>
    { (msg && props.carrierOption && props.user) &&<><tr><td colSpan={6}>
            <Alert variant="danger" onClose={() => setMsg('')} dismissible>
                <Alert.Heading>{msg}<BsArrowDown/></Alert.Heading>
            </Alert></td></tr></>
    }
    <tr>
        <td style={paintItRed ? {color:"red"} : {}}>{props.exam.code}</td>
        <td style={paintItRed ? {color:"red"} : {}}>{props.exam.name}</td>
        <td style={paintItRed ? {color:"red"} : {}}>{props.exam.credits}</td>
        <td style={paintItRed ? {color:"red"} : {}}>{props.exam.studentsEnrolled}</td>
        <td style={paintItRed ? {color:"red"} : {}}>{props.exam.maxStudents}</td>
        <td>
            <Button onClick={()=>reverseShow(show)}>Show {show ? 'less' : 'more'}</Button>
            &nbsp;
            {(props.user && props.carrierOption.current) && <Button disabled={loading} variant="info" onClick={()=>addExamToStudyplan(props.exam)}>+</Button>}
        </td>
        </tr>
        {
            show ?
                <tr>
                    <td><BsArrowUp/></td>
                    <td colSpan={2}> 
                        Incompatible With: <b>{props.exam.incompatibleWith ? props.exam.incompatibleWith : 'None'}</b>
                    </td>  
                    <td colSpan={2}>
                        Preparatory Courses: <b>{props.exam.preparatoryCourse ? props.exam.preparatoryCourse : 'None'}</b>
                    </td>
                    <td><BsArrowUp/></td>
                </tr> 
            : 
                <></>
        }
        </> 
}

function StudyplanTable(props){
    const [msg,setMsg] = useState('');
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const saveStudyplan =async ()=>{
        try{
            setLoading(true);
            const max = props.carrierOption.current==='parttime' ? 40 : 80;
            const min = props.carrierOption.current==='fulltime' ? 60 : 20;
            if(min<=props.studyplan.current.reduce((s,e)=>(s+e.credits),0) && props.studyplan.current.reduce((s,e)=>(s+e.credits),0)<=max){
                await Api.saveStudyplan(props.studyplan.current,props.carrierOption.current);
                navigate("/");
                window.scrollTo(0, 0);
            } else {
                setMsg('The total credits must be included between the maximum and the minimum.');
            }
            setLoading(false);
        }catch(err){
            console.log(String(err));
        }
    }

    const cancel = async ()=>{
        try{
            setLoading(true);
            props.studyplan.current=[];
            props.setExams(await Api.getAll());
            navigate("/");
            window.scrollTo(0, 0);
            setLoading(false);
        }catch(err){
            console.log(String(err));
        }
    }

    const deleteAll = async ()=>{
        try{
            setLoading(true);
            await Api.deleteStudyplan(props.studyplan.current);
            props.carrierOption.current='';
            props.studyplan.current=[];
            props.setExams(await Api.getAll());
            navigate("/");
            window.scrollTo(0, 0);
            setLoading(false);
        }catch(err){
            console.log(String(err));
        }
    }
    return <>
    <div className="container">
        <div className="row justify-content-start">
            <div className="col-1">
            </div>
            <div className="col align-self-center">
                {(props.user && !props.carrierOption.current) && <>
                    <br></br>
                    <Button onClick={()=>{props.carrierOption.current='fulltime';navigate("/add");}}>Full-Time</Button>
                    &nbsp;
                    <Button onClick={()=>{props.carrierOption.current='parttime';navigate("/add");}}>Part-Time</Button>
                </>}
                {(props.user && props.carrierOption.current) && <> 
                    <br></br>
                    <h2><b>Study Plan</b></h2>
                    <Row>
                        <Col>
                        </Col>
                        <Col>
                            <p><b>Minimum credits: {props.carrierOption.current==='parttime' && 20}{props.carrierOption.current==='fulltime' && 60}</b></p>
                        </Col>
                        <Col>
                            <p><b>Maximum credits: {props.carrierOption.current==='parttime' && 40}{props.carrierOption.current==='fulltime' && 80}</b></p>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                    <p><b>Actual credits: {props.studyplan.current.reduce((s,e)=>(s+e.credits),0)}</b></p>
                    
                    { msg &&<>
                        <Alert variant="danger" onClose={() => setMsg('')} dismissible>
                            <Alert.Heading>{msg}</Alert.Heading>
                        </Alert></>
                    }
                    <Table variant="light" bg="light" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Credits</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.studyplan.current.map((exam)=>
                                <StudyplanRow key={exam.code} exam={exam} studyplan={props.studyplan}/>
                            )}
                            <tr>
                                <td colSpan={2}><Button disabled={loading} onClick={()=>saveStudyplan()}>Save</Button></td>
                                <td><Button variant="danger" disabled={loading} onClick={()=>cancel()}>Cancel</Button></td>
                                <td><Button variant="danger" disabled={loading} onClick={()=>deleteAll()}>Delete</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                    </>
                }
            </div>
            <div className="col-1">
            </div>
        </div>
    </div>
    </>
}

function StudyplanRow(props){
    const [msg,setMsg] = useState('');
    const navigate = useNavigate();
    const removeExam = async ()=>{
        let removable = true;
        props.studyplan.current.forEach((exam)=>{
            if(exam.preparatoryCourse)
                exam.preparatoryCourse.split(' ').forEach((code)=>{
                    if(code===props.exam.code)
                        removable=false;
                })
        })
        if(removable){
            try{
                props.studyplan.current=props.studyplan.current.filter((exam)=>exam.code!==props.exam.code);
                navigate("/remove/"+props.exam.code);
            }catch(err){
                console.log(String(err));
            }
        } else {
            setMsg("This exam is preparatory to another inserted in your study plan so can't be removed.");
        }
    }
    return <>
    { msg &&<><tr><td colSpan={6}>
            <Alert variant="danger" onClose={() => setMsg('')} dismissible>
                <Alert.Heading>{msg}<BsArrowDown/></Alert.Heading>
            </Alert></td></tr></>
    }
    <tr>
        <td>{props.exam.code}</td>
        <td>{props.exam.name}</td>
        <td>{props.exam.credits}</td>
        <td><Button variant="danger" onClick={()=>removeExam()}>Remove</Button></td>
    </tr></>
}

export {ExamTable,StudyplanTable};