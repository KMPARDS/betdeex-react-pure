import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Accordion } from 'react-bootstrap';
import { categoryArray,subCategoryArray } from '../../env';

const Sidebar = props => {
  const listOfCategories = [];

  for(const categoryId in categoryArray) {
    const listOfSubCategories = [];

    for(const subCategoryId in subCategoryArray[categoryId]) {
      const url = `/explore/${categoryArray[categoryId].toLowerCase().split(' ').join('-')}/${subCategoryArray[categoryId][subCategoryId].toLowerCase().split(' ').join('-')}`;

      listOfSubCategories.push(
        <Card.Body key={url} onClick={() => props.history.push(url)}>{subCategoryArray[categoryId][subCategoryId]}</Card.Body>
      );
    }

    listOfCategories.push(
      <>
      {/*<Card key={categoryArray[categoryId]}>
        <Accordion.Toggle as={Card.Header} variant="link" eventKey={categoryId}>
          {categoryArray[categoryId]}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={categoryId}>
          <Card>{listOfSubCategories}</Card>
        </Accordion.Collapse>

      </Card>*/}
      <li>
        <a
          onClick={() => props.history.push(`/explore/${categoryArray[categoryId].toLowerCase().split(' ').join('-')}`)}
          className={props.match.params.category === categoryArray[categoryId].toLowerCase()
            ? 'menu-lef-act' : null}>
          <img src={`/img/icon/${categoryArray[categoryId].toLowerCase().split(' ').join('-')}.png`} alt="" />
          {categoryArray[categoryId]}
        </a>
      </li>

      </>
    );
  }
  console.log('listOfCategories', listOfCategories);
  if(props.location.pathname === '/') return null;

  return (
    <>
    {/*<Accordion style={props.style}>
      {listOfCategories}
    </Accordion>*/}
    <section>
          {/* LEFT SIDE NAVIGATION MENU */}
          <div className="menu">
            <ul>
              {/* MAIN MENU */}
              <li>
                <a
                  onClick={() => props.history.push(`/explore`)}
                  className={props.location.pathname === '/explore' ? 'menu-lef-act' : null}><img src="/img/icon/all.png" alt="" /> All</a>
              </li>
              {listOfCategories}
            </ul>
          </div>
          {/* RIGHT SIDE NAVIGATION MENU */}
          {/* MOBILE MENU(This mobile menu show on 0px to 767px windows only) */}
          <div className="mob-menu">
            <span><i className="fa fa-bars" aria-hidden="true" /></span>
          </div>
          <div className="mob-close">
            <span><i className="fa fa-times" aria-hidden="true" /></span>
          </div>
        </section>
      {/* <Sidebar /> */}
    </>
  );
}

export default withRouter(Sidebar);
