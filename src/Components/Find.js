import React from 'react';
import BoxComponent from './Box';
import Searchbox from './Searchbox';
import Dropdown from './Dropdown';

export default function Find(props) {
  return (
    <BoxComponent display="flex" justifyContent="space-between" width="50%" margin="30px 0px">
            <Searchbox placeholder={props.placeholder}/>
            <BoxComponent marginLeft="10px">
              <Dropdown label={props.label} menuItems={props.status} />
            </BoxComponent>
          </BoxComponent>
  );
}
