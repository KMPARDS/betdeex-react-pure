import React from 'react';
import { Table } from 'react-bootstrap';

export default props => (
  <Table>
    <tr>
      <th>Address</th>
      <th>Amount</th>
    </tr>
    {props.children}
  </Table>
);
