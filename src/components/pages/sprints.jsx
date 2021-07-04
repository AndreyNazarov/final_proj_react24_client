import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import sprintsSelectors from '../../redux/sprints/sprints-selectors';
import sprintsOperations from '../../redux/sprints/sprints-operations';
import СreatingSprint from '../СreatingSprint/СreatingSprint.js';
import SprintsItem from '../SprintsItem';
import Modal from '../Modal';

const Sprint = () => {
  const dispatch = useDispatch();
  const deleteSprint = id => dispatch(sprintsOperations.deleteSprint(id));

  const history = useHistory();
  const addSprints = id => history.push(`/projects/${projectId}/${id}`, id);

  const sprints = useSelector(sprintsSelectors.getSprints);

  const projectId = history.location.state;

  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => {
    setShowModal(prevShowModal => !prevShowModal);
  }, []);

  useEffect(() => {
    dispatch(sprintsOperations.getSprints(projectId));
  }, [dispatch, projectId]);

  console.log(projectId, 'Sprints:', sprints);
  return (
    <div>
      <SprintsItem
        sprints={sprints}
        to={addSprints}
        del={deleteSprint}
        toggleModal={toggleModal}
      />
      {showModal && (
        <Modal onClose={toggleModal}>
          <СreatingSprint onSave={toggleModal} prId={projectId} />
        </Modal>
      )}
    </div>
  );
};

export default Sprint;
