// components/dashboard/DashboardLayout.jsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    InputBase,
    Stack,
    Chip,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Collapse,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ShoppingBag as PackagesIcon,
    FlightTakeoff as BookingsIcon,
    Hotel as HotelsIcon,
    AccountCircle as ProfileIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
    ExpandLess,
    ExpandMore,
    Star as StarIcon,
    MonetizationOn as RevenueIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon,
    PersonAdd as PersonAddIcon,
    ConfirmationNumber as TicketIcon,
    SupportAgent as SupportIcon,
    BarChart as ChartIcon,
    Assessment as AssessmentIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    LocalOffer as LocalOfferIcon,
    MeetingRoom as MeetingRoomIcon,
    Chat as ChatIcon,
    Help as HelpIcon,
} from '@mui/icons-material';

// Menu items with nested structure
const menuItems = [
    {
        name: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
    },
    {
        name: 'Bookings',
        icon: <BookingsIcon />,
        path: '/bookings',
        children: [
            { name: 'All Bookings', path: '/bookings/all', icon: <TicketIcon /> },
            { name: 'Pending Bookings', path: '/bookings/pending', icon: <ScheduleIcon /> },
            { name: 'Confirmed Bookings', path: '/bookings/confirmed', icon: <CheckCircleIcon /> },
            { name: 'Cancelled Bookings', path: '/bookings/cancelled', icon: <CancelIcon /> },
        ],
    },
    {
        name: 'Packages',
        icon: <PackagesIcon />,
        path: '/packages',
        children: [
            { name: 'All Packages', path: '/packages/all', icon: <PackagesIcon /> },
            { name: 'Add New Package', path: '/packages/add', icon: <AddIcon /> },
            { name: 'Popular Packages', path: '/packages/popular', icon: <StarIcon /> },
            { name: 'Discount Offers', path: '/packages/offers', icon: <LocalOfferIcon /> },
        ],
    },
    {
        name: 'Hotels',
        icon: <HotelsIcon />,
        path: '/hotels',
        children: [
            { name: 'All Hotels', path: '/hotels/all', icon: <HotelsIcon /> },
            { name: 'Add Hotel', path: '/hotels/add', icon: <AddIcon /> },
            { name: 'Hotel Bookings', path: '/hotels/bookings', icon: <BookingsIcon /> },
            { name: 'Room Types', path: '/hotels/rooms', icon: <MeetingRoomIcon /> },
        ],
    },
    {
        name: 'Customers',
        icon: <PeopleIcon />,
        path: '/customers',
        children: [
            { name: 'All Customers', path: '/customers/all', icon: <PeopleIcon /> },
            { name: 'Add Customer', path: '/customers/add', icon: <PersonAddIcon /> },
            { name: 'Customer Feedback', path: '/customers/feedback', icon: <StarIcon /> },
        ],
    },
    {
        name: 'Reports',
        icon: <AssessmentIcon />,
        path: '/reports',
        children: [
            { name: 'Sales Report', path: '/reports/sales', icon: <ChartIcon /> },
            { name: 'Booking Report', path: '/reports/bookings', icon: <AssessmentIcon /> },
            { name: 'Revenue Report', path: '/reports/revenue', icon: <MoneyIcon /> },
        ],
    },
    {
        name: 'Support',
        icon: <SupportIcon />,
        path: '/support',
        children: [
            { name: 'Tickets', path: '/support/tickets', icon: <TicketIcon /> },
            { name: 'Live Chat', path: '/support/chat', icon: <ChatIcon /> },
            { name: 'FAQs', path: '/support/faq', icon: <HelpIcon /> },
        ],
    },
    {
        name: 'Settings',
        icon: <SettingsIcon />,
        path: '/settings',
    },
];

// Stats Cards Data
const statsData = [
    { title: 'Total Bookings', value: '1,234', change: '+12%', icon: <BookingsIcon />, color: '#ff6d00' },
    { title: 'Revenue', value: '$45,678', change: '+8%', icon: <RevenueIcon />, color: '#4caf50' },
    { title: 'Active Users', value: '5,678', change: '+23%', icon: <PeopleIcon />, color: '#2196f3' },
    { title: 'Packages Sold', value: '892', change: '+15%', icon: <PackagesIcon />, color: '#9c27b0' },
];

// Recent Bookings Data
const recentBookings = [
    { id: 1, customer: 'John Doe', package: 'Shimla Manali Tour', amount: '$983', status: 'Confirmed', date: '2024-01-15' },
    { id: 2, customer: 'Jane Smith', package: 'Kerala Backwaters', amount: '$899', status: 'Pending', date: '2024-01-14' },
    { id: 3, customer: 'Mike Johnson', package: 'Goa Beach Holiday', amount: '$1,200', status: 'Confirmed', date: '2024-01-13' },
    { id: 4, customer: 'Sarah Williams', package: 'Rajasthan Heritage', amount: '$1,450', status: 'Cancelled', date: '2024-01-12' },
];

const DashboardLayout = ({ children }) => {
    const [open, setOpen] = useState(true);
    const [hoverOpen, setHoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [openMenus, setOpenMenus] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 960;
            setIsMobile(mobile);
            if (mobile) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle sidebar toggle
    const handleDrawerToggle = () => {
        setOpen((current) => !current);
        setHoverOpen(false);
    };

    const handleMouseEnter = () => {
        if (!open && !isMobile) {
            setHoverOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!open) {
            setHoverOpen(false);
        }
    };

    const handleMenuToggle = (menuName) => {
        setOpenMenus((prev) => (prev[menuName] ? {} : { [menuName]: true }));
    };

    // Handle user profile menu
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle notifications menu
    const handleNotificationOpen = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    // Determine if sidebar should be visible
    const isSidebarOpen = open || hoverOpen;
    const drawerWidth = isSidebarOpen ? 280 : 80;

    // Render menu items recursively
    const renderMenuItem = (item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openMenus[item.name];

        return (
            <Box key={item.name}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        onClick={() => hasChildren ? handleMenuToggle(item.name) : null}
                        sx={{
                            minHeight: 48,
                            justifyContent: isSidebarOpen ? 'initial' : 'center',
                            px: 2.5,
                            borderRadius: 1,
                            mx: 1,
                            my: 0.5,
                            '&:hover': {
                                bgcolor: 'rgba(255, 109, 0, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isSidebarOpen ? 2 : 'auto',
                                justifyContent: 'center',
                                color: '#fff',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        {isSidebarOpen && (
                            <>
                                <ListItemText
                                    primary={item.name}
                                    sx={{
                                        opacity: 1,
                                        '& .MuiTypography-root': {
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                        }
                                    }}
                                />
                                {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                            </>
                        )}
                    </ListItemButton>
                </ListItem>

                {hasChildren && isSidebarOpen && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map((child) => (
                                <ListItemButton
                                    key={child.name}
                                    sx={{
                                        pl: 5.5,
                                        borderRadius: 1,
                                        mx: 1,
                                        my: 0.5,
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 109, 0, 0.1)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 0, mr: 2, color: '#fff' }}>
                                        <Box
                                            component="span"
                                            sx={{
                                                width: 7,
                                                height: 7,
                                                border: '1.5px solid rgba(255,255,255,0.9)',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={child.name}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontSize: '0.85rem',
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    bgcolor: '#fff',
                    color: '#333',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    ml: { xs: 0, md: `${drawerWidth}px` },
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    transition: (theme) =>
                        theme.transitions.create(['width', 'margin-left'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    borderRadius: 0,
                    boxShadow: '0 2px 8px rgba(16,24,40,0.08)',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 60, md: 68 }, gap: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                        <IconButton onClick={handleDrawerToggle} sx={{ color: '#071952', borderRadius: 1 }}>
                            {open ? <ChevronLeftIcon /> : <MenuIcon />}
                        </IconButton>
                        <Typography sx={{ color: '#071952', fontSize: 22, fontWeight: 600, whiteSpace: 'nowrap' }}>
                            Admin Dashboard
                        </Typography>
                    </Stack>

                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center',
                            width: { sm: 300, md: 380 },
                            bgcolor: '#f5f5f5',
                            borderRadius: 2,
                            boxShadow: 'none',
                        }}
                    >
                        <IconButton sx={{ p: '8px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search..."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Paper>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton onClick={handleNotificationOpen} sx={{ color: '#666' }}>
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: '#ff6d00', width: 40, height: 40, cursor: 'pointer' }}>
                                JD
                            </Avatar>
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={open}
                onClose={handleDrawerToggle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#071952',
                        color: '#fff',
                        borderRight: 'none',
                        top: 0,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: (theme) =>
                            theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        overflowX: 'hidden',
                        overflowY: 'hidden',
                    },
                }}
            >
                <Box sx={{ p: 2, minHeight: 64, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}>
                    {isSidebarOpen ? (
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', textAlign: 'left' }}>
                            TravelHub
                        </Typography>
                    ) : (
                        <Avatar sx={{ bgcolor: '#ff6d00', color: '#fff', width: 40, height: 40, fontWeight: 600 }}>
                            T
                        </Avatar>
                    )}
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', flexShrink: 0 }} />

                <List
                    sx={{
                        mt: 2,
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {menuItems.map((item) => renderMenuItem(item))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: { xs: 9, md: 9.5 },
                    px: { xs: 1.25, md: 2 },
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    transition: (theme) =>
                        theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                }}
            >
                {/* User Profile Dropdown Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            width: 280,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: '#ff6d00', width: 50, height: 50 }}>JD</Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">John Doe</Typography>
                                <Typography variant="body2" color="text.secondary">john.doe@example.com</Typography>
                                <Typography variant="caption" color="text.secondary">Admin</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <MenuItem onClick={handleProfileMenuClose}>
                        <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>My Profile</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleProfileMenuClose}>
                        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Account Settings</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleProfileMenuClose} sx={{ color: '#d32f2f' }}>
                        <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} /></ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Notifications Dropdown */}
                <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleNotificationClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            width: 320,
                            borderRadius: 2,
                        },
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                    </Box>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">New booking received!</Typography>
                            <Typography variant="caption" color="text.secondary">5 minutes ago</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">Payment successful for Booking #1234</Typography>
                            <Typography variant="caption" color="text.secondary">1 hour ago</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">New customer registered</Typography>
                            <Typography variant="caption" color="text.secondary">2 hours ago</Typography>
                        </Box>
                    </MenuItem>
                    <Divider />
                    <MenuItem sx={{ justifyContent: 'center' }}>
                        <Typography variant="body2" color="#ff6d00">View all notifications</Typography>
                    </MenuItem>
                </Menu>

                {/* Dashboard Content */}
                {children ? children : (
                    <Box>
                        {/* Welcome Banner */}
                        <Paper sx={{ p: 2.25, mb: 2, bgcolor: '#1a237e', color: '#fff', borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom>Welcome back, John!</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Here&apos;s what&apos;s happening with your travel business today.
                            </Typography>
                        </Paper>

                        {/* Stats Cards */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, minmax(0, 1fr))',
                                    lg: 'repeat(4, minmax(0, 1fr))',
                                },
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            {statsData.map((stat, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        borderRadius: 2,
                                        minHeight: 150,
                                        border: '1px solid #edf0f4',
                                        boxShadow: '0 10px 26px rgba(31,45,61,0.06)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 16px 34px rgba(31,45,61,0.1)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ height: '100%', p: 2.5 }}>
                                        <Stack spacing={2} sx={{ height: '100%' }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>
                                                    {stat.title}
                                                </Typography>
                                                <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color, width: 44, height: 44 }}>
                                                    {stat.icon}
                                                </Avatar>
                                            </Stack>
                                            <Box>
                                                <Typography sx={{ fontSize: 32, lineHeight: 1.1, fontWeight: 600, color: '#1f2937' }}>
                                                    {stat.value}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                                    <Chip
                                                        label={stat.change}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: stat.change.includes('+') ? '#e8f5e9' : '#ffebee',
                                                            color: stat.change.includes('+') ? '#2e7d32' : '#c62828',
                                                            fontSize: 12,
                                                            height: 22,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary">vs last month</Typography>
                                                </Stack>
                                            </Box>
                                            <Box sx={{ height: 5, borderRadius: 999, bgcolor: '#eef2f7', overflow: 'hidden', mt: 'auto' }}>
                                                <Box sx={{ width: `${72 + index * 6}%`, height: '100%', bgcolor: stat.color, borderRadius: 999 }} />
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                        {/* Recent Bookings & Activity */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Card sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Recent Bookings
                                        </Typography>
                                        <Box sx={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Package</th>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentBookings.map((booking) => (
                                                        <tr key={booking.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                            <td style={{ padding: '12px' }}>{booking.customer}</td>
                                                            <td style={{ padding: '12px' }}>{booking.package}</td>
                                                            <td style={{ padding: '12px' }}>{booking.amount}</td>
                                                            <td style={{ padding: '12px' }}>
                                                                <Chip
                                                                    label={booking.status}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: booking.status === 'Confirmed' ? '#e8f5e9' : booking.status === 'Pending' ? '#fff3e0' : '#ffebee',
                                                                        color: booking.status === 'Confirmed' ? '#2e7d32' : booking.status === 'Pending' ? '#ed6c02' : '#c62828',
                                                                    }}
                                                                />
                                                            </td>
                                                            <td style={{ padding: '12px' }}>{booking.date}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Card sx={{ borderRadius: 2, mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Quick Actions
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Button fullWidth variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff6d00' }}>
                                                Add New Package
                                            </Button>
                                            <Button fullWidth variant="outlined" startIcon={<PeopleIcon />}>
                                                Add Customer
                                            </Button>
                                            <Button fullWidth variant="outlined" startIcon={<BookingsIcon />}>
                                                Create Booking
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                <Card sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Popular Destinations
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationIcon sx={{ color: '#ff6d00' }} />
                                                    <Typography>Goa</Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="bold">245 bookings</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationIcon sx={{ color: '#ff6d00' }} />
                                                    <Typography>Manali</Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="bold">189 bookings</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationIcon sx={{ color: '#ff6d00' }} />
                                                    <Typography>Kerala</Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="bold">167 bookings</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
