import React, { useEffect } from 'react'
import RadioList from 'src/libraries/Training/RadioList'
import { Checkbox, Container, FormControlLabel, Grid } from '@mui/material'
import PageHeader from 'src/libraries/heading/PageHeader'
import { useState, Dispatch } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddTaskDetails, getTaskSubjectList, getTaskTypeList, resetAddTaskDetails, getTasksList,getTaskDetails } from 'src/requests/Task/RequestTask'
import { RootState } from 'src/store'
import InputField from 'src/libraries/Training/InputField'
import CalendarField from 'src/libraries/Training/CalendarField'
import Dropdown from 'src/libraries/Training/Dropdown'
import Buttons from 'src/libraries/buttons/button'
import { IAddTaskBody, IGetTaskDetailsBody } from 'src/interfaces/Task/ITask'
import ButtonField from 'src/libraries/Training/ButtonField'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import TasksList from './TasksList'
import { getCalendarFormat } from '../Common/Util'



const AddTask = () => {
    const navigate=useNavigate();
    const [Id, setId] = useState('')
    const [TaskSubjectId, setTaskSubjectId] = useState('0')
    const [TaskName, setTaskName] = useState('')
    const [Date, setDate] = useState('')
    const [TaskTypeId, setTaskTypeId] = useState('1')
    const [Reminder, setReminder] = useState(false)



    //Error msg state varible
    const [getTaskSubjectListErrorMessage, setTaskSubjectListErrorMessage] = useState('')
    const [getTaskNameErrorMessage, setTaskNameErrorMessage] = useState('')
    const [getDateErrorMessage, setDateErrorMessage] = useState('')
    const dispatch = useDispatch();
    const TaskSubjectList = useSelector((state: RootState) => state.Task.TaskSubjectList)
    const TaskTypeList = useSelector((state: RootState) => state.Task.TaskTypeList)
    const AddTaskMsg = useSelector((state: RootState) => state.Task.AddTaskMsg);
    const TaskDetails = useSelector((state: RootState) => state.Task.TaskDetails);
    
    // useEffect for subject list

    useEffect(() => {
        dispatch(getTaskSubjectList())

    }, [])
    useEffect(() => {
        dispatch(getTaskTypeList())
    },[]
    )
    // passing Id to Get task Details
    
    useEffect(()=>{
        const IgetTaskDetails : IGetTaskDetailsBody ={
            ID:Number(Id)
        }
        dispatch(getTaskDetails(IgetTaskDetails))
    },[Id])

    //Populating Task data into form 
    useEffect(()=>{
if(TaskDetails!== null){
    setTaskSubjectId(TaskDetails.TaskSubjectId)
    setTaskName(TaskDetails.TaskName)
    setDate(getCalendarFormat(TaskDetails.Tasktime))
    setTaskTypeId(TaskDetails.TaskTypeId)
    setReminder(TaskDetails. IsReminder)
}
    },[TaskDetails])

    useEffect(() => {
            if (AddTaskMsg != "") {
                toast.success(AddTaskMsg)
                dispatch(resetAddTaskDetails())
                // navigate("../../EmployeeList")
                dispatch(getTasksList())
                ClearFormFields();
                // setHearderMsg('Add Task')
            }  

    }, [AddTaskMsg])






    console.log(TaskSubjectList);

    const clickTaskSubject = (value) => {
        setTaskSubjectId(value)
    }
    const clickTaskName = (value) => {
        setTaskName(value)
    }
    const clickDate = (value) => {
        setDate(value)
    }
    const clickTaskType = (value) => {
        setTaskTypeId(value)
    }
    const handleCheckboxChange = (event) => {
        setReminder(event.target.checked);
    };
    const clickCancel = () => {
        navigate("/AddTask/")
        // setHearderMsg('Add Task');
        ClearFormFields();
    }
    const clickTaskId = (value) => {
        setId(value)
    }


    const IsFormValid = () => {
        let returnVal = true
        if (TaskSubjectId === '0') {
            setTaskSubjectListErrorMessage('Field is mandatory')
            let returnVal = false
        } else {
            setTaskSubjectListErrorMessage('')
        }
        if (TaskName === '') {
            setTaskNameErrorMessage('Field is mandatory')
            let returnVal = false
        } else {
            setTaskNameErrorMessage('')
        }
        if (Date === '') {
            setDateErrorMessage('Field is mandatory')
            let returnVal = false
        } else {
            setDateErrorMessage('')
        }
        return returnVal
    }

    //Cancel button logic

    const ClearFormFields = () => {
        setTaskSubjectId('0')
        setTaskName('')
        setDate('')
        setTaskTypeId('1')
        setReminder(false)
    }
    // const clickCancel = () => {
    //     ClearFormFields();
    // }



    const clickSubmit = () => {
        if (IsFormValid()) {
            const AddTaskBody: IAddTaskBody = {
                ID: Id == '' ? 0 : Number(Id),
                TaskName: TaskName,
                Tasktime: Date,
                TaskSubjectId: Number(TaskSubjectId),
                TaskTypeId: Number(TaskTypeId),
                IsReminder: Reminder
            }
            dispatch(AddTaskDetails(AddTaskBody))

            // navigate('/TasksList/')
            

        }
    }
    return (
        <Container>
            <Grid container direction="column" alignItems="center" justifyContent="center">
                <Grid container spacing={2}>

                    {/* <Grid container spacing={2}> */}
                    <Grid item xs={12}>
                        <PageHeader heading={'Add Task'} subheading={''} />
                    </Grid>

                    <Grid item xs={12}>
                        <RadioList ItemList={TaskSubjectList} Label={'TaskSubject'}
                            DefaultValue={TaskSubjectId}
                            ClickItem={clickTaskSubject}
                            ErrorMessage={getTaskSubjectListErrorMessage} />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField Item={TaskName} Label={'TaskName'}
                            ClickItem={clickTaskName}
                            ErrorMessage={getTaskNameErrorMessage} />
                    </Grid>
                    <Grid item xs={12}>
                        <CalendarField Item={Date} Label={'Date and Time'}
                            ClickItem={clickDate}
                            ErrorMessage={getDateErrorMessage} />
                    </Grid>
                    <Grid item xs={12}>
                        <Dropdown ItemList={TaskTypeList} Label={'Task'}
                            DefaultValue={TaskTypeId}
                            ClickItem={clickTaskType} />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox checked={Reminder} onChange={handleCheckboxChange} />}
                            label="Set Reminder"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonField Label={'Submit'} ClickItem={clickSubmit} /> &nbsp;
                        <ButtonField Label={'Cancel'} ClickItem={clickCancel} />
                    </Grid>





                </Grid>
            </Grid> <br /><br /><br />
            <TasksList TaskId={clickTaskId} />
        </Container >

    )
}

export default AddTask





