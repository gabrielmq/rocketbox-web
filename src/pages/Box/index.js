import React, { Component } from 'react';

import Dropzone from 'react-dropzone';
import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';

import './styles.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

export default class Box extends Component {
  state = { box: {} };

  // executado automaticamente assim que o
  // component é renderizado em tela
  async componentDidMount() {
    this.subscribeToNewFiles();

    // pega o id da rota
    const boxId = this.props.match.params.id;
    const response = await api.get(`boxes/${boxId}`);
    this.setState({ box: response.data });
  }

  subscribeToNewFiles = () => {
    const boxId = this.props.match.params.id;
    const io = socket('https://omnistack-rocketbox-api.herokuapp.com');

    io.emit('connectRoom', boxId);
    io.on('file', data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      data.append('file', file);

      const boxId = this.props.match.params.id;
      api.post(`boxes/${boxId}/files`, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="RocketBox Logo" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a
                  className="fileInfo"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdInsertDriveFile size={24} color="#a5cfff" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  há{' '}
                  {distanceInWords(file.createdAt, new Date(), { locale: pt })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
