import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  tasksSelectors,
  tasksOperations,
  tasksActions,
} from '../../redux/tasks';
import Modal from '../Modal';
import СreatingTask from '../СreatingTask';
import sprintsSelectors from '../../redux/sprints/sprints-selectors';

import s from './tasks.module.scss';
import { useHistory } from 'react-router';
import Container from '../Container/Container';
import TaskItem from '../TaskItem/TaskItem';
import Sidebar from '../Sidebar/Sidebar';
import sprintsOperations from '../../redux/sprints/sprints-operations';

const Tasks = ({ projectId }) => {
  const history = useHistory();
  const sprintId = history.location.state;

  // console.log( projectId);

  const tasks = useSelector(tasksSelectors.getVisibleTasks);
  const dispatch = useDispatch();
  const deleteTask = id => dispatch(tasksOperations.deleteTask(id));
  const filter = useSelector(tasksSelectors.getFilter);
  const onChange = useCallback(
    e => {
      dispatch(tasksActions.changeFilter(e.target.value));
    },
    [dispatch],
  );
  useEffect(() => {
    dispatch(tasksOperations.getTasks(sprintId));
    dispatch(sprintsOperations.getSprints(projectId));
  }, [dispatch]);

  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(() => {
    setShowModal(prevShowModal => !prevShowModal);
  }, []);

  const sprints = useSelector(sprintsSelectors.getSprints);

  return (
    <Container>
      <div className={s.pageWrapper}>
        <Sidebar
          listItem={s.listItem}
          value={'Show sprints'}
          fakeData={sprints}
          // to={`/projects/${projectId}`}
        />
        <div className={s.contentWrapper}>
          <div style={{ position: 'relative' }}>
            <div className={s.current_date_wrapper}>
              <div className={s.days_wrapper}>
                <button className={s.back_button} type="button"></button>
                <p className={s.сurrent_day}>
                  2<span className={s.slash_days}>/</span>
                  <span className={s.duration_days}>12</span>
                </p>
                <button className={s.forward_button}></button>
              </div>
              <p className={s.date}>01.01.2021</p>
            </div>

            {/* <input
        className={s}
        type="text"
        name="filter"
        placeholder=""
        value={filter}
        onChange={onChange}
      />
      <div>
        <h1 className={s.sprint_name}>Sprint Burndown Chart 1</h1>
        <button className={s.edit_sprint_name_button}></button>
      </div> */}

            <div className={s.wrapper_all}>
              <div className={s.wrapper_wr}>
                <div className={s.wrapper_tasks}>
                  <h1 className={s.sprint_name}>Sprint Burndown Chart 1</h1>
                  <button className={s.edit_sprint_name_button}></button>
                </div>
                <div className={s.wrap_tasks}>
                  <button
                    onClick={toggleModal}
                    className={s.add_task_button}
                  ></button>
                  <p className={s.task_name}>Create a task</p>
                </div>
              </div>
              <div className={s.table_list_wrapper}>
                <ul className={s.table_list}>
                  <li className={s.table_item}>
                    <p className={s.table_title}>Task</p>
                  </li>
                  <li className={s.table_item}>
                    <p className={s.table_title}>Scheduled hours</p>
                  </li>
                  <li className={s.table_item}>
                    <p className={s.table_title}>Spent hour / day</p>
                  </li>
                  <li className={s.table_item}>
                    <p className={s.table_title}>Hours spent</p>
                  </li>
                </ul>
                <form className={s.search_form} onSubmit={1}>
                  <input
                    className={s.search_form_input}
                    type="text"
                    name="filter"
                    placeholder=""
                    value={filter}
                    onChange={onChange}
                    // name="name"
                  />
                  <button
                    type="submit"
                    className={s.search_form_button}
                  ></button>
                </form>
              </div>
            </div>
          </div>

          <ul className={s.card_list}>
            {tasks?.map(task => (
              <TaskItem
                // className={s.item}
                key={task._id}
                title={task.title}
                scheduledHours={task.scheduledHours}
                hoursPerDay={task.hoursPerDay}
                totalHours={task.totalHours}
                onClick={() => deleteTask(task._id)}
              />
            ))}
          </ul>

          {showModal && (
            <Modal onClose={toggleModal}>
              <СreatingTask onSave={toggleModal} sprintId={sprintId} />
            </Modal>
          )}
          {/* <button onClick={toggleModal}>+</button>
        <button></button> */}
        </div>
      </div>
    </Container>
  );
};
export default Tasks;
