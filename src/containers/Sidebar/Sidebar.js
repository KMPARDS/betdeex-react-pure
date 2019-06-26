import React from 'react';
import { Col, Card, Accordion, Button } from 'react-bootstrap';
import { categoryArray,subCategoryArray } from '../../env';

const Sidebar = () => {
  const listOfCategories = [];

  for(const categoryId in categoryArray) {
    const listOfSubCategories = [];

    for(const subCategoryId in subCategoryArray[categoryId]) {
      listOfSubCategories.push(
        <Card.Body>{subCategoryArray[categoryId][subCategoryId]}</Card.Body>
      );
    }

    listOfCategories.push(
      <Card>
        <Accordion.Toggle as={Card.Header} variant="link" eventKey={categoryId}>
          {categoryArray[categoryId]}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={categoryId}>
          <Card>{listOfSubCategories}</Card>
        </Accordion.Collapse>

      </Card>
    );
  }

  return (
    <Accordion>
      {listOfCategories}
    </Accordion>
  );
}

export default Sidebar;
