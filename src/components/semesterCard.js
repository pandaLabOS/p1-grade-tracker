import * as React from 'react'
import { Card, Button, Row, Col } from 'react-bootstrap'

export default function SemesterCard(props) {
    const {id, gpa, subjectList} = props;

    return (
        <>
            <div class = "card" style={{width: '10rem', margin: '5px', justifyContent: 'space-between'}}>
                <div class = "card-body" style = {{padding: '8px'}}>
                    <Row>
                        <Col style = {{paddingRight: '0', justifyContent: 'center'}}>
                            <div class = "card-title"><b>{id}</b></div>
                            <div class = "class-text">GPA: {gpa}</div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

