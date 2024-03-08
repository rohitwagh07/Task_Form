import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { ClickAwayListener, Typography, styled, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Styles } from 'src/assets/style/student-style';

Icon4.propTypes = {
  Note: PropTypes.string
};

function Icon4({ Note }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  const theme = useTheme();

  const DotLegend = styled('span')(
    ({ theme }) => `
          border-radius: 22px;
          width: ${theme.spacing(1.5)};
          height: ${theme.spacing(1.5)};
          display: inline-block;
          margin-right: ${theme.spacing(1)};
          margin-top: -${theme.spacing(0.1)};
      `
  );

  const classes = Styles();
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, marginTop: '-22px' }}
      >
        <Typography variant="body2" fontSize="15px">
          {/* <DotLegend className={classes.Listfont1}
                            style={{ background: 'darkmagenta', marginLeft: '9px', marginBottom: "-2px" }}
                        /><small><b>Description</b></small> */}
          <br />
        </Typography>{' '}
        <br />
        <ClickAwayListener onClickAway={handleClickAway}>
          <Tooltip
            PopperProps={{
              disablePortal: true
            }}
            onClose={handleClick}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={Note}
            arrow
            placement="left"
            // alignItem="right"

            componentsProps={{
              tooltip: {
                sx: {
                  marginLeft: '70px',
                  transform: 'translate3d(20px, 14.5px, 0px) !important',
                  marginTop: '-10px'
                }
              }
            }}
          >
            <InfoTwoToneIcon
              type="button"
              onClick={handleClick}
              className={classes.iIconTExamSchedule}
            />
          </Tooltip>
        </ClickAwayListener>
      </Box>
    </>
  );
}

export default Icon4;
