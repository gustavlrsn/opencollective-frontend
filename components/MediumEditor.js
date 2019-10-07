import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/tim.css';

let MediumEditorLib, MediumEditorAutolist;
if (typeof document !== 'undefined') {
  MediumEditorLib = require('medium-editor');
  MediumEditorAutolist = require('medium-editor-autolist');
}

const StyledEditor = styled.div`
  &:focus {
    outline: 1px dashed #eaeaea;
    outline-offset: 10px;
  }
`;

export default class MediumEditor extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const options = {
      extensions: {
        autolist: MediumEditorAutolist,
      },
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'pre', 'quote', 'link', 'h2', 'h3', 'unorderedlist', 'orderedlist'],
      },
    };

    if (this.props.placeholder) {
      options.placeholder = { text: this.props.placeholder };
    }

    this.medium = new MediumEditorLib(this.ref.current, options);
    this.medium.subscribe('editableInput', () => {
      if (this.props.onChange) {
        this.props.onChange(this.ref.current.innerHTML);
      }
    });
  }

  shouldComponentUpdate(newProps) {
    return newProps.defaultValue !== this.props.defaultValue;
  }

  componentWillUnmount() {
    this.medium.destroy();
  }

  render() {
    return <StyledEditor ref={this.ref} dangerouslySetInnerHTML={{ __html: this.props.defaultValue }} />;
  }
}
