import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Container, Grid } from '@mui/material'

import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { IGetTaskDetailsBody } from 'src/interfaces/Task/ITask';
import DynamicList from 'src/libraries/Training/DynamicList';
import PageHeader from 'src/libraries/heading/PageHeader';
import { deleteTaskDetails, resetDeleteTaskDetails, getTasksList } from 'src/requests/Task/RequestTask';
import { RootState } from 'src/store';



const TasksList = () => {
    const HeaderList = ['TaskSubject', 'TaskName', 'Day&Time', 'TaskType', 'Edit', 'Delete']
    const IconList = [
        { Id: 1, Icon: <EditIcon />, Action: 'Edit' },
        { Id: 2, Icon: <CloseIcon />, Action: 'Delete' },
    ]
    const dispatch = useDispatch();
    const TaskList = useSelector((state: RootState) => state.Task.TasksList);
    const deleteTaskdetailsMsg = useSelector((state: RootState) => state.Task.deleteTaskdetailsMsg);

    const ClickItem = (value) => {
        if (value.Action === "Delete") {
            if (window.confirm("Are you sure you want to delete this Task? ")) {
                const GetEmployeeDetailsBody: IGetTaskDetailsBody = {
                    ID: value.Id
                }
                dispatch(deleteTaskDetails(GetEmployeeDetailsBody))
            }
            // if (value.Action == "Edit") {
            //     if (value.Action == "Edit") {
            //         // Navigate("../AddEmployee/" + value.Id)
            //     }
            // }
        }
    }

    useEffect(() => {
        if (deleteTaskdetailsMsg !== '') {
            toast.success(deleteTaskdetailsMsg)
            dispatch(resetDeleteTaskDetails())
            dispatch(getTasksList())
        }
    }, [deleteTaskdetailsMsg])

    useEffect(() => {
        dispatch(getTasksList())
    },[])
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <PageHeader heading={'Task List'} subheading={''} />
                </Grid>
                <Grid item xs={12}>
                    <DynamicList HeaderList={HeaderList} ItemList={TaskList}
                        IconList={IconList} ClickItem={ClickItem} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default TasksList





