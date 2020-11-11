/* eslint-disable react/jsx-curly-newline */
import React, { useState, useEffect } from 'react';
import { InputLabel } from '@material-ui/core';
import styled, { css } from 'styled-components';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import TextFieldComponent from '../../../../../components/FormFields/TextField';
import ComponentError from '../../../../../errorBoundaries/ComponentError/component-error';
import mediaBreakpoints from '../../../../../breakpoints';
import ButtonComponent from '../../../../../components/FormFields/ActionButton';
import {
  LabelRequired,
  RequiredCircle,
  RequiredText,
  RequiredWrap,
  SubHeading,
} from '../../../../../styles/GlobalStyles';
import { ColorBackArrow } from '../../../../../assets/SvgIcons';

const SecretWrapper = styled.section`
  padding: 4rem;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.theme.palette.background.paper || '#20232e'};
  ${mediaBreakpoints.small} {
    padding: 2rem;
    height: 100%;
  }
`;

const FormWrapper = styled.form`
  margin-top: 4rem;
`;

const KeyIdInputRequirements = styled.p`
  color: #fff;
  opacity: 0.4;
  font-size: 1.3rem;
  margin-bottom: 2rem;
`;
const CancelSaveWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5rem;
  ${mediaBreakpoints.small} {
    justify-content: space-between;
  }
`;

const CancelButton = styled.div`
  margin-right: 0.8rem;
  ${mediaBreakpoints.small} {
    width: 100%;
  }
`;

const BackButton = styled.span`
  display: none;
  ${mediaBreakpoints.small} {
    display: flex;
    align-items: center;
    margin-right: 1.4rem;
    margin-top: 0.5rem;
  }
`;

const extraCss = css`
  display: flex;
`;

const CreateSecret = (props) => {
  const {
    handleSecretSave,
    handleSecretCancel,
    parentId,
    secretprefilledData,
  } = props;
  const [secret, setSecret] = useState('');
  const [keyId, setKeyId] = useState('');
  const [keyErrorMessage, setKeyErrorMessage] = useState(null);
  const [valueErrorMessage, setValueErrorMessage] = useState(null);

  // screen resolution handler
  const isMobileScreen = useMediaQuery(mediaBreakpoints.small);

  // prefetch input data if any(i.e while editing)
  useEffect(() => {
    setKeyId(Object.keys(secretprefilledData)[0]);
    setSecret(Object.values(secretprefilledData)[0]);
  }, [secretprefilledData]);

  const handleValidation = (value, type) => {
    if (type === 'key') {
      setKeyErrorMessage(value.length < 3 || !value.match(/^[a-zA-Z0-9_]*$/g));
    } else {
      setValueErrorMessage(value.length < 3);
    }
  };

  const handleKeyChange = (key) => {
    setKeyId(key);
    handleValidation(key, 'key');
  };

  const handleValueChange = (value) => {
    setSecret(value);
    handleValidation(value, 'value');
  };

  return (
    <ComponentError>
      <SecretWrapper>
        <SubHeading extraCss={extraCss}>
          {isMobileScreen && (
            <BackButton onClick={() => handleSecretCancel(false)}>
              <ColorBackArrow />
            </BackButton>
          )}
          Add Secrets
        </SubHeading>
        <FormWrapper>
          <LabelRequired>
            <InputLabel>
              Key Id
              <RequiredCircle margin="0.5rem" />
            </InputLabel>
            <RequiredWrap>
              <RequiredCircle />
              <RequiredText>Required</RequiredText>
            </RequiredWrap>
          </LabelRequired>

          <TextFieldComponent
            placeholder="Key Id"
            value={keyId || ''}
            onChange={(e) => handleKeyChange(e.target.value)}
            fullWidth
            error={!!keyErrorMessage}
            helperText={
              keyErrorMessage
                ? 'Please enter a minimum of 3 characters lowercase alphabets, number and underscore only.'
                : ''
            }
          />
          <KeyIdInputRequirements>
            Please enter a minimum of 3 characters lowercase alphabets, number
            and underscores only
          </KeyIdInputRequirements>
          <InputLabel>
            Secret
            <RequiredCircle margin="0.5rem" />
          </InputLabel>
          <TextFieldComponent
            placeholder="Secret"
            value={secret || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            fullWidth
            error={!!valueErrorMessage}
          />
          <CancelSaveWrapper>
            <CancelButton>
              <ButtonComponent
                label="Cancel"
                color="primary"
                onClick={() => handleSecretCancel(false)}
                width={isMobileScreen ? '100%' : ''}
              />
            </CancelButton>
            <ButtonComponent
              label={
                Object.keys(secretprefilledData).length === 0
                  ? 'Create'
                  : 'Edit'
              }
              icon={Object.keys(secretprefilledData).length === 0 ? 'add' : ''}
              color="secondary"
              width={isMobileScreen ? '100%' : ''}
              disabled={
                !secret || !keyId || valueErrorMessage || keyErrorMessage
              }
              onClick={() =>
                handleSecretSave({
                  key: keyId.toLowerCase(),
                  value: secret.toLowerCase(),
                  type: 'secret',
                  parentId,
                })
              }
            />
          </CancelSaveWrapper>
        </FormWrapper>
      </SecretWrapper>
    </ComponentError>
  );
};
CreateSecret.propTypes = {
  handleSecretSave: PropTypes.func,
  handleSecretCancel: PropTypes.func,
  parentId: PropTypes.string,
  secretprefilledData: PropTypes.objectOf(PropTypes.object),
};
CreateSecret.defaultProps = {
  handleSecretSave: () => {},
  handleSecretCancel: () => {},
  parentId: '',
  secretprefilledData: {},
};

export default CreateSecret;
