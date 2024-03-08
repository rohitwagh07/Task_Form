import { useContext, useEffect, useRef, useState } from 'react';

import { App } from '@capacitor/app';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Tooltip,
  Typography,
  alpha,
  lighten,
  styled,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginApi from 'src/api/Authentication/Login';
import { Styles } from 'src/assets/style/student-style';
import { logoURL } from 'src/components/Common/Util';
import { SidebarContext } from 'src/contexts/SidebarContext';
import {
  IAuthenticateUser,
  IAuthenticateUserResult,
  IStaffDetailsForloginBody
} from 'src/interfaces/Authentication/Login';
import { Stafflogin } from 'src/requests/Authentication/StaffKidLogin';
import { RootState } from 'src/store';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
             left: 0px;
            width: auto;
        }
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
    text-align: left;
    padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.sidebar.menuItemColor};
    display: block;
    @media (max-width: 280px) {
      font-size: 11px;
    };
    &.popoverTypo {
      color: ${theme.palette.secondary.main};
    }
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
    color: ${alpha(theme.sidebar.menuItemColor, 0.6)};

    &.popoverTypo {
      color: ${theme.palette.secondary.light};
    };
    @media (max-width: 280px) {
      font-size: 11px;
    };
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const [userprofile, setuserprofile] = useState('');
  // const [img_src, setimg_src] = useState('')
  // const [siblingList, setsiblingList] = useState()
  const theme = useTheme();
  const classes = Styles();
  const dispatch = useDispatch();

  const Name = sessionStorage.getItem('StudentName');
  const DesignationName = sessionStorage.getItem('DesignationName');
  const Class = sessionStorage.getItem('Class');
  const RollNo = sessionStorage.getItem('RollNo');
  const ImgUrl = sessionStorage.getItem('PhotoFilePath');
  const UserLoginDetails1 = localStorage.getItem('UserLoginDetails1');
  let img_src =
    logoURL +
    localStorage.getItem('TermsSchoolName')?.split(' ').join('%20') +
    '_logo.png';
  let siblingList: any = [];
  useEffect(() => {
    localdata();
  }, []);

  function localdata() {
    if (sessionStorage.length > 0) {
      setuserprofile(
        ImgUrl?.length != 0
          ? 'data:image/png;base64,' + ImgUrl
          : '/imges/defualtUser.jpg'
      );
    }

    if (localStorage.length > 0) {
      img_src =
        logoURL +
        localStorage.getItem('TermsSchoolName')?.split(' ').join('%20') +
        '_logo.png';
    }

    if (
      localStorage.getItem('RoleName') === 'Student' &&
      sessionStorage.getItem('StudentSiblingList') !== ''
    ) {
      siblingList = JSON.parse(sessionStorage.getItem('StudentSiblingList'));
    }
  }
  const schoolId = localStorage.getItem('localSchoolId');

  const { t }: { t: any } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  const handleCloseApp = async (): Promise<void> => {
    try {
      handleClose();
      App.exitApp();
    } catch (err) {
      console.error(err);
    }
  };
  const handleLogout = async (): Promise<void> => {
    try {
      handleClose();
      localStorage.removeItem('auth');
      sessionStorage.clear();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const setSession = async (response) => {
    const result: IAuthenticateUserResult = await response.data
      .AuthenticateUserResult;
    const studentDetails: any = await response.data.StudentDetails;
    const teacherDetails: any = await response.data.TeacherDetails;
    const adminDetails: any = await response.data.AdminStaffDetails
      .GetAdminStaffResult;

    if (result.RoleName === 'Student') {
      sessionStorage.setItem('AuthenticateUserResult', JSON.stringify(result));
      sessionStorage.setItem('DivisionId', studentDetails.DivisionId);
      sessionStorage.setItem('Class', studentDetails.Class);
      sessionStorage.setItem('StandardId', studentDetails.StandardId);
      sessionStorage.setItem('RollNo', studentDetails.RollNo);
      sessionStorage.setItem('AcademicYearId', studentDetails.AcademicYearId);
      sessionStorage.setItem('AcademicYear', studentDetails.AcademicYear);
      sessionStorage.setItem('StudentId', studentDetails.StudentId);
      sessionStorage.setItem(
        'StandardDivisionId',
        studentDetails.StandardDivisionId
      );
      sessionStorage.setItem('Address', studentDetails.Address);
      sessionStorage.setItem(
        'ResidencePhoneNumber',
        studentDetails.ResidencePhoneNumber
      );
      sessionStorage.setItem(
        'CasteAndSubCaste',
        studentDetails.CasteAndSubCaste
      );
      sessionStorage.setItem('UDISENumber', studentDetails.UDISENumber);
      sessionStorage.setItem('BirthPlace', studentDetails.BirthPlace);
      sessionStorage.setItem('Nationality', studentDetails.Nationality);
      sessionStorage.setItem('MotherTongue', studentDetails.MotherTongue);
      sessionStorage.setItem('Blood_Group', studentDetails.Blood_Group);
      sessionStorage.setItem('EndDate', studentDetails.EndDate);
      sessionStorage.setItem('StartDate', studentDetails.StartDate);
      sessionStorage.setItem('Language', studentDetails.asLanguage);
      sessionStorage.setItem('ParentStaffID', studentDetails.aiParentStaffId);
      sessionStorage.setItem('StartRowIndex', studentDetails.aiStartRowIndex);
      sessionStorage.setItem(
        'SortRowIndexExpression',
        studentDetails.asSortExpression
      );
      sessionStorage.setItem('BookTittleName', studentDetails.asBookTitle);
      sessionStorage.setItem('UserName', studentDetails.asUserName);
      sessionStorage.setItem('ExamID', studentDetails.asExamId);
      sessionStorage.setItem('DOB', studentDetails.DOB);
      sessionStorage.setItem('MobileNumber', studentDetails.MobileNumber);
      sessionStorage.setItem('MobileNumber2', studentDetails.MobileNumber2);
      sessionStorage.setItem('Religion', studentDetails.Religion);
      sessionStorage.setItem('CategoryName', studentDetails.CategoryName);
      sessionStorage.setItem(
        'FamilyPhotoFilePath',
        studentDetails.FamilyPhotoFilePath
      );
      sessionStorage.setItem(
        'SchoolwiseStudentId',
        studentDetails.SchoolwiseStudentId
      );
      // sessionStorage.setItem("StudentSiblingList", result.StudentSiblingList === undefined ?
      //     "" : JSON.stringify(result.StudentSiblingList));
      sessionStorage.setItem(
        'StudentSiblingList',
        studentDetails.StudentSiblingList === undefined
          ? ''
          : JSON.stringify(studentDetails.StudentSiblingList)
      );
    }

    if (result.RoleName === 'Teacher') {
      sessionStorage.setItem('AuthenticateUserResult', JSON.stringify(result));
      sessionStorage.setItem('TeacherId', teacherDetails.TeacherId);
      sessionStorage.setItem('Address', teacherDetails.Address);
      sessionStorage.setItem('IsClassTeacher', teacherDetails.IsClassTeacher);
      sessionStorage.setItem('DesignationName', teacherDetails.DesignationName);
      sessionStorage.setItem('DivisionId', teacherDetails.DivisionId);
      sessionStorage.setItem('StandardId', teacherDetails.StandardId);
      sessionStorage.setItem(
        'StandardDivisionId',
        teacherDetails.StandardDivisionId
      );
      sessionStorage.setItem('ClassName', teacherDetails.ClassName);
      sessionStorage.setItem('AcademicYearId', teacherDetails.AcademicYearId);
      sessionStorage.setItem('EndDate', teacherDetails.EndDate);
      sessionStorage.setItem('StartDate', teacherDetails.StartDate);
      sessionStorage.setItem('SchoolName', teacherDetails.asSchoolName);
      sessionStorage.setItem('DOB', teacherDetails.DOB);
      sessionStorage.setItem('MobileNumber', teacherDetails.MobileNumber);
    }

    if (result.RoleName === 'Admin Staff') {
      sessionStorage.setItem('AcademicYearId', adminDetails.AcademicYearId);
      sessionStorage.setItem('Address', adminDetails.Address);
      sessionStorage.setItem('DesignationName', adminDetails.DesignationName);
      sessionStorage.setItem('EndDate', adminDetails.EndDate);
      sessionStorage.setItem('StartDate', adminDetails.StartDate);
      sessionStorage.setItem('DOB', adminDetails.DOB);
      sessionStorage.setItem('SchoolName', adminDetails.SchoolName);
      sessionStorage.setItem('asSchoolName', adminDetails.asSchoolName);
      sessionStorage.setItem('MobileNumber', adminDetails.MobileNumber);
    }

    sessionStorage.setItem('Id', result.Id);
    sessionStorage.setItem('RoleId', result.RoleId);
    sessionStorage.setItem('StudentName', result.Name);
    sessionStorage.setItem('PhotoFilePath', result.PhotoFilePath);
    sessionStorage.setItem('Userlogin', result.UserLogin);
    sessionStorage.setItem('TermsAccepted', result.TermsAccepted);
    sessionStorage.setItem(
      'LastPasswordChangeDate',
      result.LastPasswordChangeDate
    );

    localStorage.setItem('UserId', result.Id);
    localStorage.setItem('RoleName', result.RoleName);

    const url = localStorage.getItem('url');

    if (url != null && url !== '/') {
      navigate(url);
    } else if (
      result.RoleName == 'Student' ||
      result.RoleName == 'Teacher' ||
      result.RoleName == 'Admin Staff'
    ) {
      navigate('/extended-sidebar/landing/landing');
    }
  };

  const loginToSibling = async (siblingUserLogin, siblingPassword) => {
    const body: IAuthenticateUser = {
      asUserName: siblingUserLogin,
      asPassword: siblingPassword,
      asSchoolId: schoolId,
      asIsSiblingLogin: true
    };
    getNewLogin(body);
  };
  const getNewLogin = async (body) => {
    const response: any = await LoginApi.AuthenticateUser(body);
    if (response.data != null) {
      localStorage.setItem('auth', JSON.stringify(response));
      setSession(response);
    } else {
      toast.error('Invalid Username or Password');
      navigate('/');
    }
  };

  const Notification = () => {
    navigate('Student/Notification');
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const LoginStaffKid: any = useSelector(
    (state: RootState) => state.StaffKidLogin.Stafflogin
  );
  const SchoolName = localStorage.getItem('SchoolName');
  const StudentId = sessionStorage.getItem('StudentId');
  const RoleId = sessionStorage.getItem('RoleId');
  const SchoolId = localStorage.getItem('localSchoolId');
  const AcademicYearId = sessionStorage.getItem('AcademicYearId');
  const UserId = sessionStorage.getItem('Id');
  const Staffkid: IStaffDetailsForloginBody = {
    aiSchoolId: SchoolId,
    aiAcademicYearId: AcademicYearId,
    aiYearwiseStudentId: RoleId === '3' ? StudentId : '0',
    aiUserId: UserId
  };
  useEffect(() => {
    dispatch(Stafflogin(Staffkid));
  }, []);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     dispatch(getAllActiveNotices(ActiveNoticesBody));
  //   }, 6000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // // }, [])

  // useEffect(() => {
  //   let AllActiveNoticesId = GetAllActiveNotices.map((item) => {
  //     return item.Id
  //   })
  //   console.log(localStorage.getItem("AllActiveNotices")," !== ",AllActiveNoticesId.toString())
  //   if (AllActiveNoticesId.length > 0) {
  //     if ((localStorage.getItem("AllActiveNotices") !== AllActiveNoticesId.toString())) {
  //       localStorage.setItem("AllActiveNotices", AllActiveNoticesId.toString())
  //       navigate('/extended-sidebar/Common/SchoolNotice');
  //     }
  //   }

  // }, [GetAllActiveNotices])

  const Toaster = () => {
    if (!isOnline) {
      toast.error('No internet connection', { toastId: 'success1' });
    }
  };
  const LoginTo = RoleId === '3' ? 'Login To Staff' : 'Login To Child';

  return (
    <>
      <HeaderWrapper
        display="flex"
        alignItems="center"
        sx={{
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 1px 0 ' +
              alpha(lighten(theme.colors.primary.main, 0.7), 0.15) +
              ', 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)'
              : '0px 2px 8px -3px ' +
              alpha(theme.colors.alpha.black[100], 0.2) +
              ', 0px 5px 22px -4px ' +
              alpha(theme.colors.alpha.black[100], 0.1)
        }}
      >
        {Toaster()}
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          alignItems="center"
          spacing={2}
        >
          <img src={img_src} className={classes.smalllogo} />
        </Stack>
        <Stack direction="row" sx={{ pb: 2 }}>
          <h1>{SchoolName}</h1>
        </Stack>
        <Stack
          direction="row"
          display="flex"
          spacing={2}
          alignItems="center"
          sx={{ pb: 2 }}
        >
          <Tooltip title="Account">
            <ListItemButton
              sx={{
                '&:hover': {
                  color: `${theme.colors.alpha.trueWhite[100]}`,
                  background: `${alpha(theme.colors.alpha.trueWhite[100], 0.2)}`
                },
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
              ref={ref}
              onClick={handleOpen}
            >
              <Avatar
                alt="user.name"
                src={userprofile}
                sx={{ backgroundColor: 'gray', height: 40, width: 40 }}
                variant="circular"
                aria-label="add"
              />
              <Box>
                <Typography fontWeight={'bold'}>{Name}</Typography>
                <Typography>{DesignationName}</Typography>
              </Box>
            </ListItemButton>
          </Tooltip>
          <Popover
            disableScrollLock
            anchorEl={ref.current}
            onClose={handleClose}
            open={isOpen}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            <MenuUserBox
              sx={{
                minWidth: 250
              }}
              display="flex"
            >
              <Avatar
                variant="circular"
                alt="user.name"
                src={userprofile}
                sx={{ height: 60, width: 60 }}
              />
              <UserBoxText>
                <UserBoxLabel className="popoverTypo">{Name}</UserBoxLabel>
                <Typography className="popoverTypo">
                  {DesignationName}
                </Typography>
                {RollNo != undefined ? (
                  <>
                    <UserBoxDescription className="popoverTypo">
                      {Class}
                    </UserBoxDescription>{' '}
                  </>
                ) : null}
                <UserBoxDescription className="popoverTypo">
                  {' '}
                  {UserLoginDetails1}{' '}
                </UserBoxDescription>
              </UserBoxText>
            </MenuUserBox>
            <Divider
              sx={{
                mb: 0
              }}
            />
            <List
              sx={{
                p: 0
              }}
              component="nav"
            >
              <ListItem
                onClick={() => {
                  handleClose();
                }}
                to={'/extended-sidebar/Student/Profile'}
                component={NavLink}
                sx={{
                  '&:hover': {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.3)
                  }
                }}
              >
                <AccountBoxIcon
                  sx={{
                    height: 25,
                    width: 25,
                    color: 'black',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                />
                <ListItemText
                  primary={
                    <UserBoxLabel sx={{ fontWeight: 'bold' }}>
                      Profile
                    </UserBoxLabel>
                  }
                />
              </ListItem>
              <ListItem
                onClick={() => {
                  handleClose();
                }}
                to={'/extended-sidebar/common/changePassword'}
                component={NavLink}
                sx={{
                  '&:hover': {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.3)
                  }
                }}
              >
                <LockOpenIcon
                  sx={{
                    height: 25,
                    width: 25,
                    color: 'black',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                />
                <ListItemText
                  primary={
                    <UserBoxLabel sx={{ fontWeight: 'bold' }}>
                      Change Password
                    </UserBoxLabel>
                  }
                />
              </ListItem>
              {siblingList?.length == 0 ? (
                <></>
              ) : siblingList?.length == 1 ? (
                <>
                  <ListItem
                    button
                    to={''}
                    component={NavLink}
                    style={{ background: 'white !important' }}
                  >
                    <GroupIcon />
                    <ListItemText
                      primary={
                        <UserBoxLabel
                          sx={{ fontWeight: 'bold' }}
                          onClick={() => {
                            loginToSibling(
                              siblingList[0].UserName,
                              siblingList[0].Password
                            );
                          }}
                        >
                          Sibling Login
                        </UserBoxLabel>
                      }
                    />
                  </ListItem>
                </>
              ) : (
                <ListItem
                  button
                  to={''}
                  component={NavLink}
                  style={{ background: 'white' }}
                >
                  <GroupIcon sx={{ marginBottom: '42px' }} />
                  <ul
                    style={{ listStyle: 'none', padding: '0px', margin: '0px' }}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Sibling Login{' '}
                    </Typography>
                    {siblingList?.map((sibling: any, i) => {
                      return (
                        <>
                          <li
                            style={{
                              textDecoration: 'underline',
                              paddingLeft: '10px'
                            }}
                            key={i}
                            onClick={() => {
                              loginToSibling(
                                sibling.UserName,
                                sibling.Password
                              );
                            }}
                          >
                            {sibling.FullName}
                          </li>
                        </>
                      );
                    })}
                  </ul>
                </ListItem>
              )}
              {LoginStaffKid.length == 0 ? (
                <></>
              ) : LoginStaffKid.length == 1 ? (
                <>
                  <ListItem
                    button
                    to={''}
                    component={NavLink}
                    style={{ background: 'white !important' }}
                  >
                    <GroupIcon />
                    <ListItemText
                      primary={
                        <UserBoxLabel
                          sx={{ fontWeight: 'bold' }}
                          onClick={() => {
                            loginToSibling(
                              LoginStaffKid[0].UserName,
                              LoginStaffKid[0].Password
                            );
                          }}
                        >
                          {LoginTo}
                        </UserBoxLabel>
                      }
                    />
                  </ListItem>
                </>
              ) : (
                <ListItem
                  button
                  to={''}
                  component={NavLink}
                  style={{ background: 'white' }}
                >
                  <GroupIcon sx={{ marginBottom: '42px' }} />
                  <ul
                    style={{ listStyle: 'none', padding: '0px', margin: '0px' }}
                  >
                    {/* <Typography sx={{ color: "blue", fontWeight: "bold" }}>Sibling Login </Typography> */}
                    {LoginStaffKid?.map((StaffKid: any, i) => {
                      return (
                        <>
                          <li
                            style={{
                              textDecoration: 'underline',
                              color: 'blueviolet',
                              paddingLeft: '10px'
                            }}
                            key={i}
                            onClick={() => {
                              loginToSibling(
                                StaffKid.UserName,
                                StaffKid.Password
                              );
                            }}
                          >
                            {StaffKid.StudentName}
                          </li>
                        </>
                      );
                    })}
                  </ul>
                </ListItem>
              )}
            </List>
            <Divider />
            <Box>
              <List sx={{ p: 0 }}>
                <ListItem
                  onClick={handleLogout}
                  to={'/extended-sidebar/Student/Profile'}
                  component={NavLink}
                  sx={{
                    '&:hover': {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.3)
                    }
                  }}
                >
                  <ExitToAppIcon
                    sx={{
                      height: 25,
                      width: 25,
                      color: 'black',
                      fontWeight: 'bold',
                      mr: 2
                    }}
                  />
                  <ListItemText
                    primary={
                      <UserBoxLabel sx={{ fontWeight: 'bold' }}>
                        Sign out
                      </UserBoxLabel>
                    }
                  />
                </ListItem>
              </List>
            </Box>
            {window.localStorage.getItem('deviceType') === 'android' ||
              localStorage.getItem('deviceType') === 'ios' ? (
              <Box m={1}>
                <Button color="primary" fullWidth onClick={handleCloseApp}>
                  <PowerSettingsNewIcon
                    sx={{
                      mr: 1,
                      fontWeight: 'bold'
                    }}
                  />
                  <UserBoxLabel sx={{ fontWeight: 'bold' }}>Exit</UserBoxLabel>
                </Button>
              </Box>
            ) : (
              <div />
            )}
          </Popover>
          {/* <Avatar sx={{ backgroundColor: "#0564c8", height: 40 }} variant="rounded" aria-label="add">
          <NotificationsIcon fontSize="large" onClick={Notification} sx={{ height: 20 }} />
        </Avatar> */}
          {/* <ThemeSettings /> */}
        </Stack>
      </HeaderWrapper>
    </>
  );
}

export default Header;
