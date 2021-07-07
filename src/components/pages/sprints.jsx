import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { sprintsSelectors, sprintsOperations } from '../../redux/sprints';
import { projectsOperations, projectsSelectors } from '../../redux/projects';
import СreatingSprint from '../СreatingSprint/СreatingSprint.js';
import СreatingPeopleItem from '../AddPeopleItem/CreatingPeopleItem';
import Container from '../Container';
import СreatingProject from '../СreatingProject';
import peopleSelectors from '../../redux/peopleAdd/people-selectors';
import SprintsItem from '../SprintsItem';
import AddPeople from '../Modal/AddPeople';
import PeopleModal from '../Modal/PeopleModal';
import Modal from '../Modal';
import Sidebar from '../Sidebar';
import s from './sprints.module.scss';

const Sprint = () => {
  const dispatch = useDispatch();
  const deleteSprint = id => dispatch(sprintsOperations.deleteSprint(id));

  const history = useHistory();
  const getState = history.location.state;
  const compareWithPathName = history.location.pathname.slice(10);
  const getStorageData = localStorage.getItem('persist:token');
  const token = JSON.parse(getStorageData).token;

  const sprints = useSelector(sprintsSelectors.getSprints);
  const teammate = useSelector(peopleSelectors.getPeople);
  const projects = useSelector(projectsSelectors.getProjects);

  const projectId = history.location.state;
  const addSprints = id => history.push(`/projects/${projectId}/${id}`, id);
  const [showModal, setShowModal] = useState(false);
  const [addPeopleModal, setAddPeopleModal] = useState(false);
  const toggleModal = useCallback(() => {
    setShowModal(prevShowModal => !prevShowModal);
  }, []);

  const togglePeopleModal = useCallback(() => {
    setAddPeopleModal(prevShowModal => !prevShowModal);
  }, []);

  useEffect(() => {
    dispatch(sprintsOperations.getSprints(projectId));
  }, [dispatch, projectId]);
  useEffect(() => {
    dispatch(projectsOperations.getProjects());
  }, [dispatch]);

  useEffect(() => {
    if (compareWithPathName !== getState && !token) {
      history.push('/register');
    }
  }, [compareWithPathName, getState, history, token]);

  const transitiontoProject = id => history.push(`/projects/${id}`, id);

  return (
    <div className={s.project_wrapper}>
      <Sidebar
        projectId={projectId}
        data={projects}
        link={`/projects`}
        transition={transitiontoProject}
        type="project"
        Creating={СreatingProject}
        activeItemId={projectId}
      />
      <div className={s.sprints}>
        <div className={s.sprints_btn}>
          <h2 className={s.project_tittle}>Project 1</h2>
          <button className={s.project_create}></button>

          <label className={s.btnWrapper}>
            <button
              className={s.btn}
              type="button"
              onClick={toggleModal}
            ></button>
            <p className={s.text}>Create a sprint</p>
          </label>

          <label className={s.btnWrapper_add}>
            <button className={s.addpeople}></button>
            <p className={s.text_add}>Add people</p>
          </label>
        </div>

        <SprintsItem sprints={sprints} to={addSprints} del={deleteSprint} />
      </div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <СreatingSprint onSave={toggleModal} prId={projectId} />
        </Modal>
      )}{' '}
      <AddPeople
        teammate={teammate}
        // to={addSprints}
        // del={deleteSprint}
        toggleModal={togglePeopleModal}
      />
      {addPeopleModal && (
        <PeopleModal onClose={togglePeopleModal}>
          <СreatingPeopleItem onSave={toggleModal} prId={projectId} />
        </PeopleModal>
      )}
    </div>
  );
};

export default Sprint;
