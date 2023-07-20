'use strict';
const crypto = require("crypto");
class Dao{
    sqlite=require('sqlite3');
    constructor(dbName){
        this.db = new this.sqlite.Database(dbName,async (err)=>{
            if(err){
                throw err;
            } else {
                /*
                this.clear();
                try{
                    const user={username:"testuser@polito.it",carrierOption:null,password:"password"};
                    await this.addUser(user);
                    const user1={username:"s111111@polito.it",carrierOption:null,password:"password"};
                    await this.addUser(user1);
                    const user2={username:"s222222@polito.it",carrierOption:null,password:"password"};
                    await this.addUser(user2);
                    const user3={username:"s333333@polito.it",carrierOption:null,password:"password"};
                    await this.addUser(user3);
                    const user4={username:"s444444@polito.it",carrierOption:null,password:"password"};
                    await this.addUser(user4);
                } catch(err){
                    console.log(String(err));
                }*/
                console.log('Connected to database');             
            }
        })
    }

/*
    clear(){
        return new Promise((resolve,reject)=>{
            const query='CREATE TABLE IF NOT EXISTS exams('+
                'code VARCHAR(7),' +
                'name VARCHAR(128) NOT NULL,' +
                'credits INTEGER NOT NULL,' +
                'maxStudents INTEGER,' +
                'incompatibleWith VARCHAR(7),' +
                'preparatoryCourse VARCHAR(7),' +
                'studentsEnrolled INTEGER DEFAULT 0,' +
                'PRIMARY KEY(code)' +
                'CHECK(LENGTH(code)=7)'+
                ');'
                
            this.db.run(query,[],(err)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else {
                    for(let i=0;i<22;i++){
                        const query1='INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("02GOLOV","Architetture dei sistemi di elaborazione",12,null,"02LSEOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("02LSEOV","Computer architectures",12,null,"02GOLOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01SQJOV","Data Science and Database Technology",8,null,"01SQMOV 01SQLOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01SQMOV","Data Science e Tecnologie per le Basi di Dati",8,null,"01SQJOV 01SQLOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01SQLOV","Database systems",8,null,"01SQJOV 01SQMOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01OTWOV","Computer network technologies and services",6,3,"02KPNOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("02KPNOV","Tecnologie e servizi di rete",6,3,"01OTWOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01TYMOV","Information systems security services",12,null,"01UDUOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01UDUOV","Sicurezza dei sistemi informativi",12,null,"01TYMOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("05BIDOV","Ingegneria del software",6,null,"04GSPOV","02GOLOV");' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("04GSPOV","Software engineering",6,null,"05BIDOV","02LSEOV");' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01UDFOV","Applicazioni Web I",6,null,"01TXYOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01TXYOV","Web Applications I",6,3,"01UDFOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01TXSOV","Web Applications II",6,null,null,"01TXYOV");' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("02GRSOV","Programmazione di sistema",6,null,"01NYHOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01NYHOV","System and device programming",6,3,"02GRSOV",null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01SQOOV","Reti Locali e Data Center",6,null,null,null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01TYDOV","Software networking",7,null,null,null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("03UEWOV","Challenge",5,null,null,null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01URROV","Computational intelligence",6,null,null,null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01OUZPD","Model based software design",4,null,null,null);' +
                                    'INSERT INTO exams(code,name,credits,maxStudents,incompatibleWith,preparatoryCourse)'+
                                    'VALUES ("01URSPD","Internet Video Streaming",6,2,null,null); '
                        const query2=String(query1.split(';')[i]);
                        this.db.run(query2,[],(err)=>{
                            if(err){
                                console.log(String(err));
                                reject(err);
                            } else {
                                resolve(true);
                            }
                        })
                    }
                    resolve(true);
                }
            }) 
        })
    }
*/
    getAll(){
        return new Promise((resolve,reject)=>{
            const query = "SELECT code,name,credits,maxStudents,incompatibleWith,preparatoryCourse,studentsEnrolled FROM exams ORDER BY name"
            this.db.all(query,[],(err,rows)=>{
                if(err){
                    console.log(String(err))
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    getUser(email,password){
        return new Promise((resolve,reject)=>{
            const query = "SELECT * FROM users WHERE email=?";
            this.db.get(query,[email],(err,row)=>{
                if(err){
                    reject(err);
                } else if(row===undefined){
                    resolve(false);
                } else {
                    const user = {username: row.email, name: row.name};
                    crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
                        if (err) reject(err);
                        if(!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                          resolve(false);
                        else
                          resolve(user);
                      });
                }
            });
        })    
    }

    addUser(user){
        return new Promise(async (resolve,reject)=>{
            try{
                const alreadyExist = await this.getUserByUsername(user.username);
                if(alreadyExist!==false){
                    reject("The email: " + user.username + " is already used.")
                } else {
                    const query = "INSERT INTO users (email,carrierOption,hash,salt) VALUES (?,?,?,?);";
                    const salt = crypto.randomBytes(16).toString('hex');
                    crypto.scrypt(user.password,salt,32,(err,hashedPassword)=>{
                        if(err) throw err ;
                        const hash = hashedPassword.toString('hex');
                        this.db.run(query,[user.username,user.carrierOption,hash,salt],(err)=>{
                            if(err){
                                reject(err);
                            } else {
                                resolve(true)
                            }
                        })
                    })
                }
            } catch(err){
                console.log(String(err));
            }
        })
    }
    getUserByUsername(username){
        return new Promise((resolve,reject)=>{
            const query = "SELECT carrierOption FROM users WHERE email=?";
            this.db.get(query,[username],(err,row)=>{
                if(err){
                    reject(err);
                } else if(row===undefined){
                    resolve(false);
                }else{
                    resolve({carrierOption:row.carrierOption,username:username});
                }
            })
        })
    }

    clearStudyplan(username){
        return new Promise(async(resolve,reject)=>{
            try{
                await (async ()=>{
                    const query = "DELETE FROM studyplan WHERE username = ?";
                    this.db.run(query,[username],(err)=>{
                        if(err){
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    })
                })();
            } catch(err){
                console.log(String(err));
            }
        })
    }

    saveStudyplan(code,username){
        return new Promise((resolve,reject)=>{
            const query = "INSERT INTO studyplan(examCode,username) VALUES (?,?)";
            this.db.run(query,[code,username],(err)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }

    getExamByCode(code){
        return new Promise((resolve,reject)=>{
            const query1="SELECT code,name,credits,maxStudents,incompatibleWith,preparatoryCourse,studentsEnrolled FROM exams WHERE code=?";
            this.db.get(query1,[code],(err,row)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else {
                    resolve(row);
                }
            })
        })
    }

    getStudyplan(username){
        return new Promise(async (resolve,reject)=>{
            const query = "SELECT examCode FROM studyplan WHERE username=?";
            this.db.all(query,[username],(err,rows)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else if(rows===undefined){
                    resolve(false);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    getCarrierOption(user){
        return new Promise((resolve,reject)=>{
            const query = "SELECT carrierOption FROM users WHERE email=?"
            this.db.get(query,[user],(err,row)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else if(row===undefined){
                    resolve('')
                } else {
                    resolve(row.carrierOption);
                }
            })
        })
    }

    async clearCarrierOption(user){
        await this.saveCarrierOption(user,null);
    }

    saveCarrierOption(user,carrierOption){
        return new Promise((resolve,reject)=>{
            const query = "UPDATE users SET carrierOption=? WHERE email=?"
            this.db.run(query,[carrierOption,user],(err)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }

    getStudentEnrolled(code){
        return new Promise((resolve,reject)=>{
            const query = "SELECT studentsEnrolled FROM exams WHERE code=?";
            this.db.get(query,[code],(err,row)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else {
                    resolve(row.studentsEnrolled);
                }
            })
        })
    }

    addStudentEnrolled(code){
        return new Promise((resolve,reject)=>{
            const query = "UPDATE exams SET studentsEnrolled=studentsEnrolled+1 WHERE code=?";
            this.db.get(query,[code],(err,row)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        )})
    }

    removeStudentEnrolled(code){
        return new Promise((resolve,reject)=>{
            const query = "UPDATE exams SET studentsEnrolled=studentsEnrolled-1 WHERE code=?";
            this.db.run(query,[code],(err)=>{
                if(err){
                    console.log(String(err));
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        )})
    }
}
module.exports = Dao;