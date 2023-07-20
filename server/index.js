'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const daoConstructor = require('./dao.js');

// init express
const app = new express();
const dao = new daoConstructor('courses.db');
const port = 3001;

const timeouts = {};

app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    someSite:'None'
};
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username , password , callback){
    try{
        const user = await dao.getUser(username,password);
        if(!user){
            return callback(null,false,'Incorrect username or password.');
        }
        return callback(null,user);
    }catch(err){
        if(err===false){
            return callback(null,false,'Incorrect username or password.');
        }
        throw err;

    }
}))

passport.serializeUser((user,callback)=>{
    callback(null,user);
})

passport.deserializeUser((user,cb)=>{
    return cb(null,user);
})

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

//USER API

app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

//EXAM

app.get('/api/all',async (req,res)=>{
  try{
    const examsList = await dao.getAll();
    res.status(200).json(examsList);
  } catch(err) {
    console.log(String(err));
    res.status(500).end();
  }
})

//STUDYPLAN

const removeStudentEnrolledOldStudyplan = async (username)=>{
  //Students enrolled in the old studyplan -1
  const codes = await dao.getStudyplan(username);
  const codesList = [];
  codes.forEach(async (code)=>{
    await dao.removeStudentEnrolled(code.examCode)
    codesList.push(code.examCode);
  })
  return codesList;
}

app.get('/api/studyplan',isLoggedIn,async (req,res)=>{
  try{
    const codes = await dao.getStudyplan(req.user.username);
    let list = [];
    for(let i=0;i<codes.length;i++){
      list=list.concat(await dao.getExamByCode(codes[i].examCode));
    }
    const carrierOption = await dao.getCarrierOption(req.user.username);
    res.status(200).json({studyplan:list,carrierOption:carrierOption});
  } catch(err) {
    console.log(String(err));
    res.status(500).end();
  }
})

app.post('/api/studyplan',isLoggedIn,async (req,res)=>{
  try{
    //VALIDARE LA RICHIESTA: doppia inserzione, incompatibili, preparatori.
    let end = false;
    req.body.studyplan.forEach((externalExam)=>{
      let countCode = 0;
      let incompatible = false;
      let preparatory = externalExam.preparatoryCourse ? externalExam.preparatoryCourse.split(' ').length : 0;
      req.body.studyplan.forEach((internalExam)=>{
        if(externalExam.code === internalExam.code){
          countCode++;
        }
        if(preparatory!==0){
          externalExam.preparatoryCourse.split(' ').forEach((code)=>{
            if(code === internalExam.code){
              preparatory--;
            }
          })
        }
        if(externalExam.incompatibleWith){
          externalExam.incompatibleWith.split(' ').forEach((code)=>{
            if(code === internalExam.code){
              incompatible = true;
            }
          })
        }
      })
      if(countCode!==1 || incompatible || preparatory !== 0){
        end = true;
      }
    })
    const max = req.body.carrierOption==='parttime' ? 40 : 80;
    const min = req.body.carrierOption==='fulltime' ? 60 : 20;
    const totCredits = req.body.studyplan.reduce((s,e)=>s=s+e.credits,0);
    if(totCredits>max || totCredits<min){
      end=true;
    }
    if(end){
      res.status(400).end();
    } else {
      removeStudentEnrolledOldStudyplan(req.user.username);
      await dao.clearStudyplan(req.user.username);
      await dao.clearCarrierOption(req.user.username);

      req.body.studyplan.forEach(async (exam)=>{
        //Students enrolled in the new studyplan +1
        const examListError = [];
        if(timeouts!==undefined && timeouts[exam.code]!==undefined && timeouts[exam.code][req.user.username]){
          clearTimeout(timeouts[exam.code][req.user.username]);
          timeouts[exam.code][req.user.username] = undefined;
          examListError.push(exam.code);
        } else {
          try{
            await dao.addStudentEnrolled(exam.code);
            examListError.push(exam.code);
          } catch(err){
            console.log(String(err));
            examListError.forEach(async (code)=>
              await dao.removeStudentEnrolled(code)
            )
            end = true;
            res.status(500).json({"message":err});
          }
        }

        await dao.saveStudyplan(exam.code,req.user.username)
      });
      if(end){
        return false;
      }
      await dao.saveCarrierOption(req.user.username,req.body.carrierOption);
      res.status(201).end();
    }
  } catch(err) {
    console.log(String(err));
    res.status(500).end();
  }
})

app.delete('/api/studyplan',isLoggedIn,async (req,res)=>{
  try{
    const codes = removeStudentEnrolledOldStudyplan(req.user.username);
    req.body.currentStudyplan.forEach(async (exam)=>{
      if(timeouts!==undefined && timeouts[exam.code]!==undefined && timeouts[exam.code][req.user.username]){
        clearTimeout(timeouts[exam.code][req.user.username]);
        timeouts[exam.code][req.user.username] = undefined;
        await dao.removeStudentEnrolled(exam.code);
      } 
    })
    await dao.clearStudyplan(req.user.username);
    await dao.clearCarrierOption(req.user.username);
    res.status(204).end();
  } catch(err) {
    console.log(String(err));
    res.status(500).end();
  }
})

//STUDENTS ENROLLED

app.post('/api/studentsEnrolled',isLoggedIn,async (req,res)=>{
  try{
    let alreadyPresent = false;
    if(timeouts[req.body.code]===undefined)
      timeouts[req.body.code]={};
    const studyplan = await dao.getStudyplan(req.user.username);
    studyplan.forEach((exam)=>{
      if(exam.examCode === req.body.code)
        alreadyPresent=true;
    });
    if(!alreadyPresent && !timeouts[req.body.code][req.user.username]){
      await dao.addStudentEnrolled(req.body.code);
      timeouts[req.body.code][req.user.username]=setTimeout(async ()=>{
        await dao.removeStudentEnrolled(req.body.code);
        timeouts[req.body.code][req.user.username] = undefined;
        },1200000);
    }
    const studentsEnrolled = await dao.getStudentEnrolled(req.body.code);
    res.status(200).json(studentsEnrolled);
  } catch(err) {
    if(String(err)==="Error: SQLITE_CONSTRAINT: CHECK constraint failed: exams"){
      res.status(400).end();
    } else {
      console.log(String(err));
      res.status(500).end();
    }
  }
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
