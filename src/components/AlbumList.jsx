import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Alert,
  Button,
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import Album from './Album';
import { Settings } from './shapes';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
  settings: Settings.isRequired,
};

function AlbumList({ search, setCurrentAlbum, settings, page, setPage, currentPage, totalAlbums, pages }) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [alertText, setAlertText] = useState('Loading albums...');
  const isScreenSmall = window.innerWidth < 700;
  const pageSize = page.limit - page.start;
  const [pageDisabled, setPageDisabled] = useState(true);
  let totalPages;

  if (totalAlbums) {
    totalPages = Math.ceil(totalAlbums / pageSize);
  }

  const loadAlbums = (loadPage) => {
    setIsLoading(true);
    setAlbums([]);

    if (search) {
      setAlbums([]);
      setAlertText('Searching...');
      LibrianClient.searchAlbums(search).then((data) => {
        if (!data.length) {
          setAlertText('No results found.');
        } else {
          setAlbums(data);
        }
        window.scrollTo(0, 0);
        setIsLoading(false);
        setIsLoaded(true);
      });
    } else {
      LibrianClient.getAlbums(loadPage ? loadPage.start : page.start, loadPage ? loadPage.limit : page.limit).then((data) => {
        if (page.start === 0) {
          if (!data.length) {
            setAlertText('No albums found. Set up your library in settings.');
            setIsLoaded(true);
          }
          setAlbums(data);
        } else {
          setAlbums(data);
        }

        window.scrollTo(0, 0);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    if (!search) {
      setAlbums([]);
    }

    if (!isLoading) {
      setPage({
        start: 0,
        limit: pageSize
      });

      loadAlbums();
    }
  }, [search]);

  const findPage = () => pages.findIndex(p => p.start === page.start && p.limit === page.limit);
  const loadMore = () => setPage(pages[findPage() + 1]);
  const loadPrevious = () => setPage(pages[findPage() - 1]);

  const getRandomInt = () => {
    const min = Math.ceil(0);
    const max = Math.floor(pages.length);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  const loadRandom = () => {
    setPage(pages[getRandomInt()]);
  }

  useEffect(() => {
    setIsLoading(true);
    loadAlbums();
  }, [page])

  const albumsMargin = () => {
    if (isScreenSmall) {
      return {};
    }

    return { marginLeft: '0px', marginTop: '90px', height: '100%' };
  };

  useEffect(() => {
    if (totalAlbums) {
      setPageDisabled(false);
    }
  }, [totalAlbums])

  const rightControls = () => {
    if (!search) {
      return (
        <React.Fragment>
          <Button style={{ background: settings.styles.buttonBackgroundColor, height: '75px', marginTop: '20px', color: '#FFFFFF' }} disabled={pageDisabled} block variant="outline-light" onClick={loadMore}>Next</Button>;
          <Button style={{ background: settings.styles.buttonBackgroundColor, height: '75px', marginTop: '-10px', }} disabled={pageDisabled} block variant="outline-light" onClick={loadPrevious}>Previous</Button>;
          <Button style={{ background: settings.styles.buttonBackgroundColor, height: '75px', marginTop: '-10px', }} disabled={pageDisabled} block variant="outline-light" onClick={loadRandom}>Random</Button>;
          <div style={{ color: '#FFFFFF' }}>{pages.length ? `${pages.findIndex(p => p.start === page.start && p.limit === page.limit)} of ${pages.length}` : 'Loading...'}</div>
        </React.Fragment>
      )
    }

    return <React.Fragment />;
  }

  if (albums.length) {
    const renderAlbums = [];
    albums.forEach((album) => {
      renderAlbums.push(
        <Album
          album={album}
          setCurrentAlbum={setCurrentAlbum}
          settings={settings}
        />,
      );
    });

    return (
      <Container id="albums" fluid style={albumsMargin()}>
        <Row>
          <Col lg={11} xl={11}>
            <Row>{renderAlbums}</Row>
          </Col>
          <Col lg={1} xl={1}>
            {rightControls()}
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid style={albumsMargin()}>
      <Row>
        <Col lg={12} xl={12}>
          {/* <Alert variant="primary">{alertText}</Alert> */}
        </Col>
      </Row>
    </Container>
  );
}

AlbumList.propTypes = propTypes;

AlbumList.defaultProps = {
  search: '',
};

export default AlbumList;
