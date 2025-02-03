import * as React from 'react';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import TypographyComponent from './Typography';
import BoxComponent from './Box';

export default function AdminSelection({ selectedadminType, selectedPermissions, onadminTypeChange, onPermissionsChange }) {
  const permissionOptions = [
    'dashboard',
    'rides',
    'vehicles',
    'locations',
    'drivers',
    'customers',
    'configurations',
    'admins',
  ];

  const handleadminTypeChange = (event) => {
    const adminType = event.target.value;
    onadminTypeChange(adminType); // Pass the adminType to parent

    // If the selected admin type is super-admin, clear the permissions
    if (adminType === 'super-admin') {
      onPermissionsChange(null); // Clear permissions when super-admin is selected
    } else {
      // If it's sub-admin, pass the current permissions to parent (if any)
      onPermissionsChange(selectedPermissions);
    }
  };

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    // Update the permissions for sub-admin
    onPermissionsChange((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const selectedPermissionsList = Object.keys(selectedPermissions || {}).filter((key) => selectedPermissions[key]);

  return (
    <FormControl component="fieldset">
      <RadioGroup value={selectedadminType} onChange={handleadminTypeChange}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: 'var(--light)',
            borderColor: selectedadminType === 'super-admin' ? 'var(--primary)' : 'transparent',
            borderWidth: selectedadminType === 'super-admin' ? 2 : 0,
            borderStyle: 'solid',
          }}
        >
          <FormControlLabel
            value="super-admin"
            control={<Radio sx={{ color: 'var(--primary)', '&.Mui-checked': { color: 'var(--primary)' } }} />}
            label={
              <BoxComponent>
                <TypographyComponent variant="subtitle1" fontWeight="bold">
                  Super Admin
                </TypographyComponent>
                <TypographyComponent variant="body2" color="textSecondary">
                  Super Admin can perform all actions.
                </TypographyComponent>
              </BoxComponent>
            }
          />
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: 'var(--light)',
            borderColor: selectedadminType === 'sub-admin' ? 'var(--primary)' : 'transparent',
            borderWidth: selectedadminType === 'sub-admin' ? 2 : 0,
            borderStyle: 'solid',
          }}
        >
          <FormControlLabel
            value="sub-admin"
            control={<Radio sx={{ color: 'var(--primary)', '&.Mui-checked': { color: 'var(--primary)' } }} />}
            label={
              <BoxComponent>
                <TypographyComponent variant="subtitle1" fontWeight="bold">
                  Sub-Admin
                </TypographyComponent>
                <TypographyComponent variant="body2" color="textSecondary">
                  Sub-Admin can perform specific actions only.
                </TypographyComponent>
              </BoxComponent>
            }
          />
        </Paper>

        {selectedadminType === 'sub-admin' && (
          <Box sx={{ mt: 1, p: 1, backgroundColor: 'var(--light)', width: '80%' }}>
            <TypographyComponent variant="body1" fontWeight="bold" gutterBottom>
              Please select the actions that you want to allow.
            </TypographyComponent>
            <List>
              {permissionOptions.map((option) => (
                <ListItem key={option} disablePadding>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={option}
                        checked={selectedPermissions[option] || false}
                        onChange={handlePermissionChange}
                        sx={{ color: 'var(--primary)', '&.Mui-checked': { color: 'var(--primary)' } }}
                      />
                    }
                    label={<ListItemText primary={option.charAt(0).toUpperCase() + option.slice(1)} />}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {selectedadminType === 'sub-admin' && selectedPermissionsList.length > 0 && (
          <Box sx={{ mt: 0, width: '100%' }}>
            <TypographyComponent variant="subtitle2" fontWeight="bold">
              Selected Permissions:
            </TypographyComponent>
            <Box sx={{ mt: 0, display: 'flex', gap: 1, flexWrap: 'wrap', width: '100%' }}>
              {selectedPermissionsList.map((permission) => (
                <Chip
                  key={permission}
                  label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                  sx={{ backgroundColor: 'var(--primary)', color: 'var(--light)' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </RadioGroup>
    </FormControl>
  );
}
