//Libraries
import * as React from "react"
import $ from 'jquery'
import { window, document } from 'browser-monads';

//Custom Components
import SemesterCard from '../../src/components/semesterCard.js'
import SubjectDropdownCS from '../../src/components/SubjectDropdownCS.js'
import SubjectDropdownIT from '../../src/components/SubjectDropdownIT.js'

//React Components
import { useLocalStorage, Modal } from 'react-use'
import { Button, Row, Col } from 'react-bootstrap'

//Data
import csData from '../../src/data/cs2019.json' //import rather than fetch because this is a local file, rather than a file on a server
import itData from '../../src/data/it2019.json'

export default function IndexPage() {

    //Data prep
    let cs_subjects = csData['curriculum']['subjects'] //The list of subjects still in their groups => length = 5
    let it_subjects = itData['curriculum']['subjects'] //Contains the groupName

    let cs_subjectList = [] //Still in groups, but drilled down. Removed the subject groupNames, still separated into groups but subjects are accessible in the form of an array at each index using cs_subjectList[i]['subjects']
    let it_subjectList = []

    let cs_subjectObjects = [] //Use this for the CS checkbox
    let it_subjectObjects = [] //Use this for the IT select box

    let currentSemester = ""
    var iterSubjects = ["0" * 12]
    let nSubjects = 0

    //Store new semester records
    const [mySemesters, setMySemesters] = useLocalStorage('mySemesters', []) //Array of Semester objects
    const [mySubjects, setMySubjects] = useLocalStorage('mySubjects', []) //Array of Subject objects
    const [myGroups, setMyGroups] = useLocalStorage('myGroups', [[],[],[],[],[],[]]) //Array of grouped subjects objects


    let [sumPersist, setSumPersist] = useLocalStorage('sumPersist', 0)
    let [cumulativeGPA, setCumulativeGPA] = useLocalStorage('cumulativeGPA', 0) //Update by writeovers - Cumulative GPA to be calculated after each new semester is added
    const [semPointers, setSemPointers] = useLocalStorage('semPointers', [])

    const [addedSubjects, setAddedSubjects] = useLocalStorage('addedSubjects', [])

    const gradeBoundaries = {
        4: "A",
        3.75: "A-",
        3.25: "B+",
        3: "B",
        2.75: "B-",
        2.25: "C+",
        2: "C",
        1.75: "C-",
        1: "D",
        0: "F"
    }

    //Logic

    const body = {
        width: '90%',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'space-evenly',
        flexDirection: 'column',
        gap: '1rem'
    }

    const h1_black_modal = {
        color: '#000000'
    }

    const card_cGPA = {
        width: '100%',
        height: '10rem',
        background: '#973A3A',
        borderRadius: '16px',
        borderWidth: '1.5px',
        padding: '1rem',
        boxShadow: '0px 4px 42px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'space-between'
    }

    const card_h3 = {
        fontWeight: '400',
        fontSize: '20px',
        color: '#FFFFFF',
        fontFamily: 'Helvetica',
        marginBottom: '0px',
        marginTop: '0px'
    }

    const card_value = {
        fontFamily: 'Helvetica',
        fontSize: '40px', 
        textAlign: 'right',
        color: '#FFFFFF'
    }

    function initializeArr() {
        let inputResult = document.getElementById("nSubjects_input")
        nSubjects = 0

        if (inputResult) {
            nSubjects = inputResult.value
        }
        else {
            console.log("null input")
        }

        for (let i = 0; i <  nSubjects; i ++) {
            iterSubjects[i] = "x"
        }
        console.log(`iterSubjects: ${iterSubjects}`)
        return iterSubjects.length
    }

    function loadCSData() {
        console.log("loading CS data")
        //console.log(`cs_subjects: ${JSON.stringify(cs_subjects[0])}`)
        //console.log(`groupName: ${JSON.stringify(cs_subjects[0]['groupName'])}`)

        for (let i = 0; i < cs_subjects.length; i++) {
            cs_subjectList.push(cs_subjects[i]['subjects'])
        }
    
        for (let s = 0; s < 6; s++) { //Group level 
            for (let t = 0; t < cs_subjectList[s].length; t++) { //Subject Level  
                let code = cs_subjectList[s][t]['code']
                let name = cs_subjectList[s][t]['name']
                let groupName = cs_subjects[s]['groupName']
                let grade = ""
                let semester = ""

                cs_subjectObjects.push({code, name, grade, groupName, semester})
            }
        }
        iterSubjects = [...Array(initializeArr())].map(x => 0); //Reference: https://www.delftstack.com/howto/javascript/javascript-create-array-of-length/
    }

    function loadITData() {

        for (let i = 0; i < it_subjects.length; i++) {
            it_subjectList.push(it_subjects[i]['subjects'])
        }
    
        for (let s = 0; s < 6; s++) { //Group level    
            for (let t = 0; t < it_subjectList[s].length; t++) { //Subject Level
                let code = it_subjectList[s][t]['code']
                let name = it_subjectList[s][t]['name']
                let groupName = it_subjects[s]['groupName']
                let grade = ""
                let semester = ""

                it_subjectObjects.push({code, name, grade, groupName, semester})
            }
        }
        iterSubjects = [...Array(initializeArr())].map(x => 0); //Reference: https://www.delftstack.com/howto/javascript/javascript-create-array-of-length/
    }
    
    function Semester(semesterCode, subjectList, gpa) {
        this.id = semesterCode
        this.subjectList = subjectList
        this.gpa = gpa
    }

    function Subject(coursecode, coursename, grade, groupName, semester) {
        this.coursecode = coursecode
        this.courseName = coursename
        this.grade = grade
        this.groupName = groupName
        this.semesterCompleted = semester
    }
    
    function viewMySemesters() {
        console.log("viewing semesters")
        console.log("mySemesters.length: ", mySemesters.length)
        for (let i = 0; i < mySemesters.length; i++) {
            console.log(`mySemesters[${i}]: `, mySemesters[i])
        }
    }

    function viewMySubjects() {
        console.log("viewing subjects")
        console.log("mySubjects.length: ", mySubjects.length)
        for (let i = 0; i < mySubjects.length; i++) {
            console.log(`mySubjects[${i}]: `, mySubjects[i])
        }
    }

    function viewMyGroups() {
        console.log("viewing groups")
        console.log("myGroups.length: ", myGroups.length)
        let groups = ["Language Courses", "Humanities Courses", "Social Science Courses", "Science and Mathemetics Courses", "General Education Courses"]

        for (let i = 0; i < myGroups.length; i++) {
            console.log(`----- Group: ${groups[i]} -----`)
            for (let j = 0; j < myGroups[i].length; j++) {
                console.log(`Name: ${myGroups[i][j].courseName}`)
                console.log(`Grade: ${myGroups[i][j].grade}`)
            }
        }
    }
    
    function loadSelectedSubjects(major) { //IMPORTANT: This function is called when the user clicks the "Add Subjects" button
        currentSemester = document.getElementById("currentSemester").value
        let selectedSubjects = []
        let subjectFields = []

        if (major === "cs") {
            subjectFields = document.getElementsByName("subjectSelectCS")
        } else {
            subjectFields = document.getElementsByName("subjectSelectIT")
        }
        
        let gradeFields = document.getElementsByName("gradeSelect")

        for (let f = 0; f < subjectFields.length; f++) {
            let subjectField = subjectFields[f]
            let subject = subjectField.value
            let courseCode = subject.split("_")[0]
            let courseName = subject.split("_")[1]
            let groupName = subject.split("_")[2]

            let subjectCheck = addedSubjects.includes(courseCode)

            if (!subjectCheck && courseCode !== "" && Number(gradeFields[f].value) != -1) {
                addedSubjects.push(courseCode)
                setAddedSubjects([...addedSubjects])

                let gradeField = gradeFields[f]
                let grade = gradeField.value

                let newSubject = new Subject(courseCode, courseName, Number(grade), groupName, currentSemester)

                selectedSubjects.push(newSubject)

                mySubjects.push(newSubject)
                setMySubjects([...mySubjects])
            }
            
            else if (subjectCheck === true){

                for (let s = 0; s < mySubjects.length; s++) {
                    if (String(mySubjects.coursecode).valueOf() === String(courseCode).valueOf()) {
                        let existingGrade = mySubjects[s].grade
                        let newGrade = Number(gradeFields[f].value)
                        
                        if (newGrade > existingGrade) {
                            mySubjects[s].grade = newGrade
                            mySubjects[s].semesterCompleted = document.getElementById("currentSemester").value
                            setMySubjects([...mySubjects])
                            alert("Updated grade for " + courseName + " to " + newGrade + "!")
                        }
                    }
                }

                
            }
        }

        if (!semPointers.includes(currentSemester)) {
            let newSemester = new Semester(currentSemester, [], 0)
            mySemesters.push(newSemester)
            setMySemesters([...mySemesters])

            semPointers.push(currentSemester)
            setSemPointers([...semPointers])
        }

        let semesterIndex = semPointers.indexOf(currentSemester)
        populate(semesterIndex, currentSemester)
        calculateSemesterGPA()
        calculateCumulativeGPA()

    }
    
    function resetData() {
        setMySemesters([])
        setMySubjects([])
        setAddedSubjects([])
        setSumPersist(0)
        setCumulativeGPA(0)
        setSemPointers([])
        setMyGroups([[],[],[],[],[],[]])
    }

    function calculateSemesterGPA() {
        for (let s = 0; s < mySemesters.length; s++) {
            let sum = 0
            for (let t = 0; t < mySemesters[s].subjectList.length; t++) {
                sum += mySemesters[s].subjectList[t].grade
            }
            let average = sum / mySemesters[s].subjectList.length
            mySemesters[s].gpa = average.toFixed(2)
            setMySemesters([...mySemesters])
        }
    }

    function calculateCumulativeGPA() {
        sumPersist = 0
        setSumPersist(sumPersist)

        for (let i = 0; i < mySubjects.length; i++) {
            sumPersist += mySubjects[i].grade
            setSumPersist(sumPersist)
        }

        let average = sumPersist / mySubjects.length
        setCumulativeGPA(average.toFixed(2))

        return average
    }

    function populate(index, semesterCode) {
        mySemesters[index].subjectList.length = 0
        mySemesters[index].gpa = 0

        myGroups[0].length = 0
        myGroups[1].length = 0
        myGroups[2].length = 0
        myGroups[3].length = 0
        myGroups[4].length = 0
        myGroups[5] = []


        for (let s = 0; s < mySubjects.length; s++) {
            if (String(mySubjects[s].semesterCompleted).valueOf() === String(semesterCode).valueOf()) {
                mySemesters[index].subjectList.push(mySubjects[s]) //append Subject object
                mySemesters[index].gpa += mySubjects[s].grade //add to grade
            }
            let newSub = new Subject(mySubjects[s].courseCode, mySubjects[s].courseName, mySubjects[s].grade, mySubjects[s].groupName, mySubjects[s].semesterCompleted)

            switch(mySubjects[s].groupName) {

                case 'Language Courses' :
                    myGroups[0].push(newSub)
                    break;

                case 'Humanities Courses' :
                    myGroups[1].push(newSub)
                    break;

                case 'Social Science Courses' :
                    myGroups[2].push(newSub)
                    break;

                case 'Science and Mathemetics Courses' :
                    myGroups[3].push(newSub)
                    break;

                case 'General Education Courses' :
                    myGroups[4].push(newSub)
                    break;

                case 'Specialized Courses' :
                    myGroups[5].push(newSub)
                    break;
                default:
                    console.log('No match')
            }

        }
        mySemesters[index].gpa = Number(mySemesters[index].gpa / mySemesters[index].subjectList.length).toFixed(2)

        mySemesters.sort((a,b) => compareSemestersDescending(a,b))
        setMySemesters([...mySemesters])

        mySubjects.sort((a,b) => compareSubjectsDescending(a,b))
        setMySubjects([...mySubjects])

        setMyGroups(myGroups)
    }

    function compareSubjectsDescending(a,b) { //Sort descending
        let a_sem = a.semesterCompleted[0]
        let b_sem = b.semesterCompleted[0]

        let a_year = a.semesterCompleted.substring(2)
        let b_year = b.semesterCompleted.substring(2)

        let a_name = a.courseName
        let b_name = b.courseName

        if (a_year < b_year) {
            return 1
        }
        if (a_year > b_year) {
            return -1
        }
        if (a_year === b_year) {
            if (a_sem < b_sem) {
                return 1
            }
            if (a_sem > b_sem) {
                return -1
            }
            if (a_sem === b_sem) {
                if (a_name < b_name) {
                    return -1
                } return 1
            }
        }
        
    }

    function quickSortSubjects() {
        mySubjects.sort((a,b) => compareSubjectsDescending(a,b))
        setMySubjects([...mySubjects])
    }

    function compareSemestersDescending(a,b) { //Sort descending
        console.log(`a: ${JSON.stringify(a)}, b: ${JSON.stringify(b)}`)
        let a_sem = a.id[0]
        let b_sem = b.id[0]

        let a_year = a.id.substring(2)
        let b_year = b.id.substring(2)

        if (a_year < b_year) {
            return 1
        }
        if (a_year > b_year) {
            return -1
        }
        if (a_year === b_year) {
            if (a_sem < b_sem) {
                return 1
            }
            if (a_sem > b_sem) {
                return -1
            }
        }
        
    }

    React.useEffect(() => {
        loadCSData()
        loadITData()
    }, [])

    const semCardContainer = {
        display: 'flex', 
        justifyContent: 'flex-start', 
        flexDirection: 'row', 
        flexWrap: 'nowrap', 
        overflowX: 'auto',
        marginRight: '5rem'
    }

    return (
        <>
            <div style = {{backgroundColor: '#973A3A', color: '#FFFFFF', width: '100vw', paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>
                <h1 style = {{paddingLeft: '15px', fontFamily: 'Helvetica', fontWeight: '200', textTransform: 'uppercase'}}>Grade Tracker</h1>
            </div>
            <br/>
            <body style = {body}>
                <Row>
                    <Col sm = {10}>
                        <Row>
                            <div style = {{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%', paddingRight: '2.5rem'}}>
                                <h3>Previous Semesters</h3>
                            </div>
                        </Row>
                        <Row style = {semCardContainer}>
                            {mySemesters.map((semester) => (
                                <SemesterCard
                                    id = {semester.id}
                                    gpa = {semester.gpa}
                                    subjectList = {semester.subjectList}
                                />
                            ))}

                            {/* Reference: https://stackabuse.com/bytes/fix-objects-are-not-valid-as-a-react-child-error-in-react/ */}
                        </Row>

                        <Row class = "table-responsive text-nowrap">
                            <table class = "table table-responsive table-striped text-nowrap" style = {{width: '95%'}}>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th style = {{width: '15%'}} scope="col">Code</th>
                                        <th style = {{width: '50%'}} scope="col">Course Name</th>
                                        <th style = {{width: '10%'}} scope="col">Grade</th>
                                        <th style = {{width: '25%'}} scope="col">Semester</th>
                                    </tr>
                                </thead>
                                <tbody class="table-group-divider">
                                    {mySubjects.map((subject) => (
                                        <tr>
                                            <td class = "text-center">{mySubjects.indexOf(subject) + 1}</td>
                                            <td class = "text-start">{subject.coursecode}</td>
                                            <td class = "text-start">{subject.courseName}</td>
                                            <td class = "text-center">{gradeBoundaries[subject.grade]}</td>
                                            <td class = "text-center">{subject.semesterCompleted}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Row>
                    </Col>
                    <Col sm = {2}>
                        <Row className="justify-content-md-center">
                            <Button variant = "primary" data-bs-target="#addNewSemester_1" data-bs-toggle="modal">Add new semester</Button>
                        </Row>
                        {/* <br/>
                        <Row className="justify-content-md-center">
                            <Button variant = "secondary" onClick = {() => viewMySemesters()}>View Semesters</Button>
                        </Row> */}
                        {/* <br />
                        <Row className="justify-content-md-center">
                            <Button variant = "secondary" onClick = {() => viewMySubjects()}>View Subjects</Button>
                        </Row>
                        <br/>
                        <Row className="justify-content-md-center">
                            <Button variant = "secondary" onClick = {() => quickSortSubjects()}>Sort Subjects</Button>
                        </Row> */}
                        <br/>
                        <Row className="justify-content-md-center">
                            <Button variant = "danger" onClick = {() => resetData()}>Reset Data</Button>
                        </Row>
                        <br/>
                        <Row  className="justify-content-md-center" style = {{backgroundColor: 'rgb(151, 58, 58)', borderRadius: '10px', color: '#FFFFFF', padding: '0.5rem'}}>
                            <Col><h2 style = {{fontSize: '16px'}}>Cumulative GPA:</h2></Col>
                            <Col><h1 style = {{fontSize: '24px'}} class = "text-end">{cumulativeGPA}</h1></Col>
                        </Row>
                    </Col>
                </Row>

                {/* SELECT SEMESTER AND YEAR */}

                <div class="modal" id = "addNewSemester_1" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Semester Details</h5>
                            <Button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></Button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class = "mb-3">
                                    <label for = "currentSemester">Semester</label>
                                    <input type = "text" id = "currentSemester" class="form-control" placeholder = "Semester (e.g. 1/2015)"/>
                                </div>
                                <div class = "mb-3">
                                    <label for = "nSubjects_input">Amount of subjects</label><br />
                                    <input type = "number" id = "nSubjects_input" class="form-control" name="quantity" min="1" max="12"/>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <Button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</Button>
                            <Button class="btn btn-primary" id = "semAndSub_submit" name = "submit" data-bs-dismiss="modal" data-bs-target="#selectMajor_2" data-bs-toggle="modal" onClick = {() => initializeArr()}>Submit</Button>
                        </div>
                        </div>
                    </div>
                </div>

                {/* SELECT MAJOR */}

                <div class="modal fade" id="selectMajor_2" tabindex="-1" aria-labelledby="selectMajor" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header" style = {{backgroundColor: "#E3C091;", color: "#000000"}}>
                                <h5 class="modal-title">Select Major</h5>
                                <Button type="button" class="btn-close" data-bs-dismiss="modal" data-bs-toggle-modal = "modal" aria-label="Close"></Button>
                            </div>

                            <div class="modal-body">
                                <div style = {{display: "flex", flexDirection: "column"}}>
                                    <b style = {{margin: "1rem"}}>Major</b>
                                    <div style = {{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                                        <Button style = {{width: "45%", height: "2.5rem"}} data-bs-target="#selectSubjects_CS_3" data-bs-toggle="modal" onClick = {loadCSData()}>CS</Button>
                                        <Button style = {{width: "45%", height: "2.5rem"}} data-bs-target="#selectSubjects_IT_3" data-bs-toggle="modal" onClick = {loadITData()}>IT</Button>
                                    </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <Button type="button" class="btn btn-secondary" data-bs-target = "#addNewSemester_1" data-bs-toggle="modal">Back</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SELECT CS SUBJECTS */}

                <div class="modal fade" id="selectSubjects_CS_3" tabindex="-1" aria-labelledby="selectSubjects" aria-hidden="true" name = "selectedSubjects">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header" style = {{backgroundColor: "#E3C091;", color: "#000000"}}>
                                <h5 class = "modal-title" id="addNewSemesterLabel">Select subjects (CS)</h5>
                                <Button type="button" class="btn-close" data-bs-dismiss="modal" data-bs-toggle-modal = "modal" aria-label="Close"></Button>
                            </div>

                            <div class="modal-body" id = "cs_subject_dropdowns">
                                {[...Array(initializeArr())].map(x => 0).map(() => (
                                    <>
                                        <SubjectDropdownCS subjectList = {cs_subjectObjects}/>
                                        <br/>
                                    </>
                                ))}
                            </div>

                            <div class="modal-footer">
                                <Button type="button" class="btn btn-secondary" data-bs-target = "#selectMajor_2" data-bs-toggle="modal">Back</Button>
                                <Button type="button" class="btn btn-primary" onClick = {() => loadSelectedSubjects("cs")}>Add subjects</Button>
                                <Button type="button" class= "btn btn-secondary" data-bs-dismiss = "modal">OK</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SELECT IT SUBJECTS */}

                <div class="modal fade" id="selectSubjects_IT_3" tabindex="-1" aria-labelledby="selectSubjects" aria-hidden="true" name = "selectedSubjects">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header" style = {{backgroundColor: "#E3C091;", color: "#000000"}}>
                                <h5 class = "modal-title" id="addNewSemesterLabel">Select subjects (IT)</h5>
                                <Button type="button" class="btn-close" data-bs-dismiss="modal" data-bs-toggle-modal = "modal" aria-label="Close"></Button>
                            </div>

                            <div class="modal-body" id = "it_subject_dropdowns">
                                {[...Array(initializeArr())].map(x => 0).map(() => (
                                    <>
                                        <SubjectDropdownIT subjectList = {it_subjectObjects}/>
                                        <br/>
                                    </>
                                ))}
                            </div>

                            <div class="modal-footer">
                                <Button type="button" class="btn btn-secondary" data-bs-target = "#selectMajor_2" data-bs-toggle="modal">Back</Button>
                                <Button type="button" class="btn btn-primary" data-bs-dismiss = "modal" onClick = {() => loadSelectedSubjects("it")}>Submit</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </>
    )
}