import * as React from 'react';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Paper from '@mui/material/Paper';
import TypographyComponent from './Typography';
import BoxComponent from './Box';

export default function AdminSelection() {
  const [selectedRole, setSelectedRole] = React.useState('superAdmin');

  const handleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const roles = [
    {
      value: 'superAdmin',
      title: 'Super Admin',
      description:
        'Can add/remove admins, approve/reject campaigns, enable/disable users, view all reports, audit logs, payments etc.',
    },
    {
      value: 'financeAdmin',
      title: 'Finance Admin',
      description:
        'Can view all the payments and transactions, and take actions to make transfers and refunds.',
    },
    {
      value: 'approverAdmin',
      title: 'Approver Admin',
      description: 'Can edit, approve or reject campaigns',
    },
    {
      value: 'reporter',
      title: 'Reporter',
      description:
        'Can view reports only. No write operations can be performed by them.',
    },
  ];

  return (
    <FormControl component="fieldset">
      <RadioGroup value={selectedRole} onChange={handleChange}>
        {roles.map((role) => (
          <Paper
            key={role.value}
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: 'var(--light)', // Background color for all boxes
              borderColor: selectedRole === role.value ? 'var(--primary)' : 'transparent', // Border color for selected role
              borderWidth: selectedRole === role.value ? 2 : 0, // Border width based on selection
              borderStyle: 'solid', // Solid border style
            }}
          >
            <FormControlLabel
              value={role.value}
              control={
                <Radio
                  sx={{
                    color: 'var(--primary)',
                    '&.Mui-checked': {
                      color: 'var(--primary)',
                    },
                  }}
                />
              }
              label={
                <BoxComponent>
                  <TypographyComponent variant="subtitle1" fontWeight="bold">
                    {role.title}
                  </TypographyComponent>
                  <TypographyComponent variant="body2" color="textSecondary">
                    {role.description}
                  </TypographyComponent>
                </BoxComponent>
              }
            />
          </Paper>
        ))}
      </RadioGroup>
    </FormControl>
  );
}
