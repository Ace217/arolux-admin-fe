import React from 'react';
import BoxComponent from './Box';
import TypographyComponent from './Typography';
import DetailComponent from './DetailComponent';

export default function Details(props) {
  return (
    <BoxComponent
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      sx={{
        backgroundImage: `url('Images/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <BoxComponent
        margin="50px"
        padding="30px 15px"
        borderRadius="10px"
        width="40%"
        gap="10px"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        backgroundColor="var(--light)"
      >
        <TypographyComponent
          fontSize="40px"
          color="var(--dull)"
          fontFamily="var(--main)"
          fontWeight="600"
          marginBottom="20px"
        >
          Details
        </TypographyComponent>
        <BoxComponent width="90%">
          <DetailComponent title="Name" details={props.name} />
          <DetailComponent title="CNIC" details={props.CNIC} />
          <DetailComponent title="E-mail" details={props.Email} />
          <DetailComponent title="Contact Number" details={props.Phone} />
          <DetailComponent title="Vehicle Number" details={props.vehicle} />
          <DetailComponent title="City" details={props.city} />
          <BoxComponent
            width="100%"
            height="40vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="20px"
          >
            <img
              src={props.coverImage}
              alt="Cover"
              style={{ width: "150px", height: "100px" }}
            />
          </BoxComponent>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
