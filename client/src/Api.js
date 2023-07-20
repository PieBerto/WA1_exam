const APIURL = "http://localhost:3001/api";

async function getAll(){
    try{
        const response = await fetch(APIURL+"/all");
        if(response.ok){
            return response.json();
        }
    } catch (err){
        console.log(String(err));
    }
}

async function saveStudyplan(studyplan,carrierOption){
    try{
        const response = await fetch(APIURL+"/studyplan",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
             },
            credentials: 'include',
            body: JSON.stringify({"studyplan":studyplan,"carrierOption":carrierOption})
        })
        if(response.ok)
            return response;
    } catch(err){
        console.log(String(err));
    }
}

async function getStudyplan(){
    try{
        const response = await fetch(APIURL+"/studyplan",{
            headers: {
                'Content-Type': 'application/json',
             },
            credentials: 'include'
        })
        if(response.ok)
            return response.json();
    } catch(err){
        console.log(String(err));
    }
}

async function deleteStudyplan(currentStudyplan){
    try{
        const response = await fetch(APIURL+"/studyplan",{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
             },
            credentials: 'include',
            body: JSON.stringify({currentStudyplan:currentStudyplan})
        })
        if(response.ok)
            return response;
    } catch(err){
        console.log(String(err));
    }
}

//studentsEnrolled

async function newStudentEnrolled(code){
    try{
        const response = await fetch(APIURL+"/studentsEnrolled",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
             },
            credentials: 'include',
            body: JSON.stringify({"code":code})
        })
        if(response.status===400){
            return false;
        }
        if(response.ok)
            return response.json();
    } catch(err){
        console.log(String(err));
    }
}

//USER API

async function login(credentials){
    try{
        const response = await fetch(APIURL + '/sessions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials)
        });
        if(response.ok) {
            const user = await response.json();
            return user;
        } else {
            const errDetails = await response.text();
            throw errDetails;
        }
    }catch(err){
        console.log(String(err));
    }
}
async function getUserInfo(){
    try{
        const response = await fetch(APIURL + '/sessions/current', {
            credentials: 'include'
        });
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            const errDetails = await response.text();
            throw errDetails;
        }
    }catch(err){
        
    }
}

async function logout(){
    try{
        const response = await fetch(APIURL + '/sessions/current', {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok)
            return null;
    }catch(err){
        console.log(String(err));
    }
}


const Api={
    getAll,
    login,
    getUserInfo,
    logout,
    saveStudyplan,
    deleteStudyplan,
    getStudyplan,
    newStudentEnrolled
}

export default Api;