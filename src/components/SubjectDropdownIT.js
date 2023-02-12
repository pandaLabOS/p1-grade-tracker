import * as React from 'react';
import $ from "jquery";

import { Row, Col, Button } from 'react-bootstrap';
import { useLocalStorage } from 'react-use'

export default function SubjectDropdown(props) {
    let {subjectList} = props;

    function reset() {
        let target = document.getElementsByName("subjectSelectIT")
        for (let t = 0; t < target.length; t++) {
            target[t].options.length = 0
        }
        let defaultOption = new Option("Subject", "")
        $(defaultOption).appendTo(target)
    }

    function subjectLoad(subjectList) {
        reset()
        let target = document.getElementsByName("subjectSelectIT")
        for (let i = 0; i < subjectList.length; i++) {
            let subject = subjectList[i]
            let groupName = subject.groupName

            let optionText = subject.code.replace(" ", "") + " " + subject.name
            let optionValue = subject.code.replace(" ", "") + "_" + subject.name + "_" + groupName
            // console.log(`optionValue: ${optionValue}`)
            // console.log(`groupName: ${groupName}`)
            let newOption = new Option(optionText, optionValue)
            
            $(newOption).appendTo(target)
        }
        //Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement/Option
    }

    React.useEffect(() => {
        subjectLoad(subjectList)
    }, [subjectList])

    return (
        <div>
            <form name = "subjectDropdown">
                <fieldset>
                    <Row>
                        <Col xs = {8}>
                            <select name = "subjectSelectIT" class="form-select">
                            </select>
                        </Col>
                        <br/>
                        <Col xs = {4}>
                            <select name = "gradeSelect" id="gradeSelect" class="form-select">
                                <option vale = "" disabled defaultValue>Grade</option>
                                <option value = "4.00">A</option>
                                <option value = "3.75">A-</option>
                                <option value = "3.25">B+</option>
                                <option value = "3.00">B</option>
                                <option value = "2.75">B-</option>
                                <option value = "2.25">C+</option>
                                <option value = "2.00">C</option>
                                <option value = "1.75">C-</option>
                                <option value = "1.00">D</option>
                                <option value = "0.00">F</option>
                                <option value = "-1.00">W</option>
                            </select>
                        </Col>
                    </Row>
                </fieldset>
            </form>
        </div>
    )
}