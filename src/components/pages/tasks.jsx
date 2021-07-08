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
import Sidebar from '../Sidebar';
import TaskPagination from '../TaskPagination';
import { sprintsOperations } from '../../redux/sprints/';
import СreatingSprint from '../СreatingSprint';
import ChartModal from '../ChartModal';

const Tasks = () => {
  const history = useHistory();
  const sprintId = history.location.state;

  const projectId = history.location.pathname.slice(10, 34);

  const transitiontoProject = id =>
    history.push(`/projects/${projectId}/${id}`, id);
  const dispatch = useDispatch();

  const getTasks = useCallback(
    () => dispatch(tasksOperations.getTasks(sprintId)),
    [dispatch, sprintId],
  );

  const getSprints = useCallback(
    () => dispatch(sprintsOperations.getSprints(projectId)),
    [dispatch, projectId],
  );

  useEffect(() => {
    getSprints();
  }, [getSprints]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const deleteTask = id => dispatch(tasksOperations.deleteTask(id));

  const tasks = useSelector(tasksSelectors.getVisibleTasks);
  const filter = useSelector(tasksSelectors.getFilter);
  const sprints = useSelector(sprintsSelectors.getSprints);
  const onChange = useCallback(
    e => {
      dispatch(tasksActions.changeFilter(e.target.value));
    },
    [dispatch],
  );

  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(() => {
    setShowModal(prevShowModal => !prevShowModal);
  }, []);

  const [pagDate, setPagDate] = useState('');

  const updatePagDate = value => {
    setPagDate(value);
  };

  const [pagDateIndex, setPagDateIndex] = useState(0);

  const currSprint = sprints.find(item => item._id === sprintId);

  const updatePagDateIndex = value => {
    setPagDateIndex(value);
  };

  const [showChartModal, setShowChartModal] = useState(false);

  const toggleChartModal = useCallback(() => {
    setShowChartModal(prevShowModal => !prevShowModal);
  }, []);

  return (
    <Container>
      <div className={s.pageWrapper}>
        <Sidebar
          projectId={projectId}
          data={sprints}
          link={`/projects/${projectId}`}
          transition={transitiontoProject}
          type="sprint"
          Creating={СreatingSprint}
          activeItemId={currSprint._id}
        />

        <div className={s.contentWrapper}>
          <div style={{ position: 'relative' }}>
            {tasks.length > 0 ? (
              <TaskPagination
                sprintId={sprintId}
                pagDate={updatePagDate}
                pagIndex={updatePagDateIndex}
              />
            ) : null}

            <div className={s.wrapper_all}>
              <div className={s.wrapper_wr}>
                <div className={s.wrapper_tasks}>
                  <h1 className={s.sprint_name}>{currSprint?.title}</h1>
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
            {pagDateIndex !== undefined && tasks.length > 0
              ? tasks?.map(task => (
                  <TaskItem
                    // className={s.item}
                    key={task._id}
                    id={task._id}
                    title={task.title}
                    scheduledHours={task.scheduledHours}
                    hoursPerDay={task.hoursPerDay[pagDateIndex].hours}
                    totalHours={task.totalHours}
                    currDate={pagDate}
                    onClick={() => deleteTask(task._id)}
                  />
                ))
              : null}
          </ul>
          <div className={s.buttonContainer}>
            {tasks?.length > 2 ? (
              <button
                className={s.button_analytics}
                onClick={toggleChartModal}
              ></button>
            ) : null}
          </div>
          {showModal && (
            <Modal onClose={toggleModal}>
              <СreatingTask onSave={toggleModal} sprintId={sprintId} />
            </Modal>
          )}
          {showChartModal && (
            <ChartModal
              onClose={toggleChartModal}
              tasks={tasks}
              sprintDuration={currSprint.duration}
              sprintTitle={currSprint.title}
            />
          )}
          {/* <button onClick={toggleModal}>+</button>
        <button></button> */}
        </div>
      </div>
    </Container>
  );
};
export default Tasks;
