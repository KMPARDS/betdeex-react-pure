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
      <Card key={categoryArray[categoryId]}>
        <Accordion.Toggle as={Card.Header} variant="link" eventKey={categoryId}>
          {categoryArray[categoryId]}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={categoryId}>
          <Card>{listOfSubCategories}</Card>
        </Accordion.Collapse>

      </Card>
      
      
      // <li>
      //   <a href="main.html"><img src="/img/icon/s1.png" alt="" />{categoryArray[categoryId]}</a>
      // </li>
 
      
    );
  }
  console.log(props);
  if(props.location.pathname === '/') return null;
  
  return (
    <Accordion style={props.style}>
      {listOfCategories}
    </Accordion>
  );
}

export default withRouter(Sidebar);
