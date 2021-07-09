import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { sprintsSelectors, sprintsOperations } from '../../redux/sprints';
import { projectsOperations, projectsSelectors } from '../../redux/projects';
import СreatingSprint from '../СreatingSprint/СreatingSprint.js';
import NameInputEdit from '../NameInputEdit/NameInputEdit';
import СreatingPeopleItem from '../AddPeopleItem/CreatingPeopleItem';
import СreatingProject from '../СreatingProject';
import peopleSelectors from '../../redux/peopleAdd/people-selectors';

import SprintsItem from '../SprintsItem';
import AddPeople from '../AddPeopleItem/PeopleItem';
import PeopleModal from '../Modal/PeopleModal';
import Modal from '../Modal';
import Sidebar from '../Sidebar';
import SprintsDelete from '../SprintsDelete';

import s from './sprints.module.scss';

const Sprint = () => {
  const dispatch = useDispatch();
  const deleteSprint = id => dispatch(sprintsOperations.deleteSprint(id));
  const deleteSprints = id => dispatch(sprintsOperations.deleteSprints(id));

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
          <NameInputEdit data={projects} itemId={projectId} />

          <label className={s.btnWrapper}>
            <button
              className={s.btn}
              type="button"
              onClick={toggleModal}
            ></button>
            <p className={s.text}>Create a sprint</p>
          </label>
          <AddPeople
            teammate={teammate}
            // to={addSprints}
            // del={deleteSprint}
            toggleModal={togglePeopleModal}
          />
        </div>

        <SprintsItem sprints={sprints} to={addSprints} del={deleteSprint} />
      </div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <СreatingSprint onSave={toggleModal} prId={projectId} />
        </Modal>
      )}
      {addPeopleModal && (
        <PeopleModal onClose={togglePeopleModal}>
          <СreatingPeopleItem onSave={toggleModal} prId={projectId} />
        </PeopleModal>
      )}
      <SprintsDelete
        sprints={sprints}
        delAll={deleteSprints}
        prId={projectId}
      />
    </div>
  );
};

export default Sprint;
