import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container, Paper, Box, Typography, Button, TextField, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Chip, Skeleton, Grid,
    Stack, Tooltip, Card, CardContent, Divider, Avatar, InputAdornment,
    Checkbox, FormControlLabel, Switch
} from '@mui/material';

import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import KeyIcon from '@mui/icons-material/KeyOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PaidIcon from '@mui/icons-material/PaidOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import ClassIcon from '@mui/icons-material/ClassOutlined';
import BadgeIcon from '@mui/icons-material/BadgeOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import TuneIcon from '@mui/icons-material/Tune';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const MODULE_LIST = [
    { key: 'academics', label: 'Academics (Classes, Subjects, Session)' },
    { key: 'students', label: 'Students & Categories' },
    { key: 'teachers', label: 'Teachers Management' },
    { key: 'hr', label: 'Human Resources (Staff, Leaves, Payroll)' },
    { key: 'library', label: 'Library Management' },
    { key: 'exams', label: 'Examinations & Marksheets' },
    { key: 'certificates', label: 'ID Cards & Certificates' },
    { key: 'fees', label: 'Fee Management' },
    { key: 'expenses', label: 'Expense Management' },
    { key: 'transport', label: 'Transport System' },
    { key: 'calendar', label: 'Annual Calendar & Holidays' },
    { key: 'timetable', label: 'Timetable Management' },
    { key: 'notices', label: 'Notices & Announcements' },
    { key: 'complains', label: 'Complain Box' },
    { key: 'frontoffice', label: 'Front Office (Enquiry & Visitors)' },
    { key: 'communicate', label: 'Communicate (Messages & Logs)' },
    { key: 'backup', label: 'Database Backup' },
];

const DEFAULT_MODULES = {
    academics: true,
    students: true,
    teachers: true,
    hr: true,
    library: true,
    exams: true,
    certificates: true,
    fees: true,
    expenses: true,
    transport: true,
    calendar: true,
    timetable: true,
    notices: true,
    complains: true,
    frontoffice: true,
    communicate: true,
    backup: true
};

const SuperAdminDashboard = ({ onLogout }) => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state for Registering New Client School
    const [openAddModal, setOpenAddModal] = useState(false);
    const [schoolName, setSchoolName] = useState('');
    const [adminName, setAdminName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [address, setAddress] = useState('');
    const [newSchoolModuleAccess, setNewSchoolModuleAccess] = useState({ ...DEFAULT_MODULES });

    // Modal state for Full School Details & Password
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [selectedSchoolData, setSelectedSchoolData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Modal state for Edit Module Access
    const [openAccessModal, setOpenAccessModal] = useState(false);
    const [selectedSchoolForAccess, setSelectedSchoolForAccess] = useState(null);
    const [editingModuleAccess, setEditingModuleAccess] = useState({ ...DEFAULT_MODULES });
    const [accessSaving, setAccessSaving] = useState(false);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${REACT_APP_BASE_URL}/SuperAdmin/Schools`);
            if (Array.isArray(res.data)) {
                setSchools(res.data);
            } else {
                setSchools([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching client schools", err);
            setLoading(false);
        }
    };

    const handleOpenSchoolDetails = async (schoolId) => {
        try {
            setDetailsLoading(true);
            setShowPassword(false);
            setOpenDetailsModal(true);
            const res = await axios.get(`${REACT_APP_BASE_URL}/SuperAdmin/SchoolDetails/${schoolId}`);
            setSelectedSchoolData(res.data);
            setDetailsLoading(false);
        } catch (err) {
            alert("Error fetching school details: " + err.message);
            setDetailsLoading(false);
            setOpenDetailsModal(false);
        }
    };

    const handleOpenAccessModal = (schoolObj) => {
        setSelectedSchoolForAccess(schoolObj);
        setEditingModuleAccess({
            ...DEFAULT_MODULES,
            ...(schoolObj.moduleAccess || {})
        });
        setOpenAccessModal(true);
    };

    const handleSaveModuleAccess = async () => {
        if (!selectedSchoolForAccess) return;
        try {
            setAccessSaving(true);
            await axios.put(`${REACT_APP_BASE_URL}/Admin/${selectedSchoolForAccess._id}`, {
                moduleAccess: editingModuleAccess
            });
            alert(`Module Access updated successfully for ${selectedSchoolForAccess.schoolName}!`);
            setOpenAccessModal(false);
            setAccessSaving(false);
            fetchSchools();
        } catch (err) {
            alert('Error updating module access: ' + err.message);
            setAccessSaving(false);
        }
    };

    const handleCreateSchool = async (e) => {
        e.preventDefault();
        if (!schoolName || !email || !password || !adminName) return;

        try {
            const res = await axios.post(`${REACT_APP_BASE_URL}/AdminReg`, {
                name: adminName,
                email,
                password,
                schoolName,
                contactPhone,
                address,
                role: 'Admin',
                status: 'Active',
                moduleAccess: newSchoolModuleAccess
            });

            if (res.data.message && typeof res.data.message === 'string' && res.data.message.includes('exists')) {
                alert(res.data.message);
            } else {
                alert('New Client School Registered Successfully!');
                setOpenAddModal(false);
                resetForm();
                fetchSchools();
            }
        } catch (err) {
            alert('Error creating client school: ' + err.message);
        }
    };

    const handleToggleStatus = async (schoolObj) => {
        const newStatus = schoolObj.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await axios.put(`${REACT_APP_BASE_URL}/Admin/${schoolObj._id}`, { status: newStatus });
            fetchSchools();
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const handleDeleteSchool = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete client school "${name}"? This will delete all its data.`)) {
            try {
                await axios.delete(`${REACT_APP_BASE_URL}/Admin/${id}`);
                alert(`Client school "${name}" deleted.`);
                fetchSchools();
            } catch (err) {
                alert('Error deleting school: ' + err.message);
            }
        }
    };

    const resetForm = () => {
        setSchoolName('');
        setAdminName('');
        setEmail('');
        setPassword('');
        setContactPhone('');
        setAddress('');
        setNewSchoolModuleAccess({ ...DEFAULT_MODULES });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Password copied to clipboard!');
    };

    const exportToCsv = () => {
        const headers = ["School Name", "Admin Name", "Email", "Phone", "Status", "Subscription Valid Date"];
        const rows = filteredSchools.map(s => [
            `"${s.schoolName || ''}"`,
            `"${s.name || ''}"`,
            `"${s.email || ''}"`,
            `"${s.contactPhone || 'N/A'}"`,
            `"${s.status || 'Active'}"`,
            `"${s.subscriptionValidUntil ? new Date(s.subscriptionValidUntil).toLocaleDateString() : 'Active'}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "SuperAdmin_Client_Schools_Directory.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredSchools = schools.filter(s =>
        (s.schoolName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.contactPhone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalActive = schools.filter(s => s.status === 'Active' || !s.status).length;
    const totalInactive = schools.length - totalActive;

    const chartData = [
        { month: 'Jan', clients: Math.max(1, Math.floor(schools.length * 0.4)) },
        { month: 'Feb', clients: Math.max(2, Math.floor(schools.length * 0.6)) },
        { month: 'Mar', clients: Math.max(3, Math.floor(schools.length * 0.8)) },
        { month: 'Apr', clients: schools.length },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: '#f8fafc', pb: 6 }}>
            {/* Top Navigation Bar */}
            <Box sx={{ px: { xs: 2, md: 4 }, py: 2, bgcolor: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: '#4f46e5', width: 42, height: 42 }}>
                        <SchoolIcon sx={{ color: '#fbbf24' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={800} letterSpacing="-0.5px" color="white">
                            Apna SaaS • Super Admin Control Center
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">
                            Multi-Tenant Client School Portal Management
                        </Typography>
                    </Box>
                </Stack>

                <Button
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={onLogout}
                    sx={{ borderColor: '#475569', color: '#94a3b8', textTransform: 'none', fontWeight: 700, '&:hover': { borderColor: '#ef4444', color: '#ef4444' } }}
                >
                    Super Admin Logout
                </Button>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {/* Header Banner */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
                        color: 'white',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        boxShadow: '0 10px 25px -5px rgba(49, 46, 129, 0.4)'
                    }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">
                            Client Schools Directory & Password Records
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#c7d2fe', mt: 0.5 }}>
                            Manage onboarding, view client admin credentials, student & teacher counts, and account status.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="outlined"
                            startIcon={<FileDownloadIcon />}
                            onClick={exportToCsv}
                            sx={{
                                borderColor: '#fbbf24',
                                color: '#fbbf24',
                                px: 2.5,
                                py: 1.2,
                                borderRadius: 2.5,
                                fontWeight: 800,
                                textTransform: 'none',
                                '&:hover': { borderColor: '#f59e0b', bgcolor: 'rgba(251, 191, 36, 0.1)' }
                            }}
                        >
                            Export Client CSV
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAddModal(true)}
                            sx={{
                                bgcolor: '#fbbf24',
                                color: '#1e1b4b',
                                px: 3,
                                py: 1.2,
                                borderRadius: 2.5,
                                fontWeight: 800,
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#f59e0b' }
                            }}
                        >
                            Register New Client School
                        </Button>
                    </Stack>
                </Paper>

                {/* Metrics Cards Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="#94a3b8" fontWeight={700}>TOTAL CLIENT SCHOOLS</Typography>
                                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', width: 38, height: 38 }}><SchoolIcon /></Avatar>
                                </Stack>
                                <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>{schools.length}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="#94a3b8" fontWeight={700}>ACTIVE SUBSCRIPTIONS</Typography>
                                    <Avatar sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', width: 38, height: 38 }}><CheckCircleIcon /></Avatar>
                                </Stack>
                                <Typography variant="h3" fontWeight={800} sx={{ mt: 1, color: '#4ade80' }}>{totalActive}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="#94a3b8" fontWeight={700}>INACTIVE / SUSPENDED</Typography>
                                    <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', width: 38, height: 38 }}><BlockIcon /></Avatar>
                                </Stack>
                                <Typography variant="h3" fontWeight={800} sx={{ mt: 1, color: '#f87171' }}>{totalInactive}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="#94a3b8" fontWeight={700}>EST. ANNUAL REVENUE</Typography>
                                    <Avatar sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', width: 38, height: 38 }}><PaidIcon /></Avatar>
                                </Stack>
                                <Typography variant="h3" fontWeight={800} sx={{ mt: 1, color: '#fbbf24' }}>
                                    ₹{(schools.length * 25000).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Chart & Table */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#1e293b', border: '1px solid #334155', color: 'white', height: '100%' }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Client Onboarding Growth</Typography>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                                    <Bar dataKey="clients" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#1e293b', border: '1px solid #334155', color: 'white' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h6" fontWeight={800}>Client School Accounts Directory</Typography>
                                <TextField
                                    size="small"
                                    placeholder="Search school or admin email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                        sx: { color: 'white', bgcolor: '#0f172a', borderRadius: 2 }
                                    }}
                                />
                            </Stack>

                            <TableContainer sx={{ maxHeight: 420 }}>
                                <Table stickyHeader sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow sx={{ '& th': { bgcolor: '#0f172a', color: '#94a3b8', fontWeight: 700 } }}>
                                            <TableCell>School Name</TableCell>
                                            <TableCell>Admin & Email</TableCell>
                                            <TableCell>Contact Phone</TableCell>
                                            <TableCell>Module Access</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            Array.from(new Array(4)).map((_, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell><Skeleton width={150} sx={{ bgcolor: '#334155' }} /></TableCell>
                                                    <TableCell><Skeleton width={180} sx={{ bgcolor: '#334155' }} /></TableCell>
                                                    <TableCell><Skeleton width={110} sx={{ bgcolor: '#334155' }} /></TableCell>
                                                    <TableCell><Skeleton width={110} sx={{ bgcolor: '#334155' }} /></TableCell>
                                                    <TableCell><Skeleton width={80} sx={{ bgcolor: '#334155' }} /></TableCell>
                                                    <TableCell><Skeleton width={90} sx={{ bgcolor: '#334155' }} /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredSchools.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 5, color: '#94a3b8' }}>
                                                    No client schools registered yet. Click "Register New Client School" above!
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredSchools.map((sch) => {
                                                const isActive = sch.status === 'Active' || !sch.status;
                                                const enabledModulesCount = Object.values(sch.moduleAccess || DEFAULT_MODULES).filter(Boolean).length;

                                                return (
                                                    <TableRow key={sch._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell sx={{ fontWeight: 800, color: 'white' }}>{sch.schoolName}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={700} color="#e2e8f0">{sch.name}</Typography>
                                                            <Typography variant="caption" color="#94a3b8">{sch.email}</Typography>
                                                        </TableCell>
                                                        <TableCell sx={{ color: '#cbd5e1' }}>{sch.contactPhone || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                icon={<AppsIcon style={{ color: '#38bdf8', fontSize: 16 }} />}
                                                                label={`${enabledModulesCount}/17 Modules`}
                                                                size="small"
                                                                onClick={() => handleOpenAccessModal(sch)}
                                                                sx={{
                                                                    bgcolor: 'rgba(56, 189, 248, 0.12)',
                                                                    color: '#38bdf8',
                                                                    fontWeight: 800,
                                                                    cursor: 'pointer',
                                                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                                                    '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.25)' }
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {isActive ? (
                                                                <Chip label="Active" size="small" sx={{ bgcolor: '#166534', color: '#4ade80', fontWeight: 800 }} />
                                                            ) : (
                                                                <Chip label="Inactive" size="small" sx={{ bgcolor: '#991b1b', color: '#f87171', fontWeight: 800 }} />
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                                <Tooltip title="Edit Module Access Permissions">
                                                                    <IconButton size="small" onClick={() => handleOpenAccessModal(sch)} sx={{ color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)' }}>
                                                                        <TuneIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="View Full School Details & Password">
                                                                    <IconButton size="small" onClick={() => handleOpenSchoolDetails(sch._id)} sx={{ color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.1)' }}>
                                                                        <VisibilityIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => handleToggleStatus(sch)}
                                                                    sx={{
                                                                        borderColor: isActive ? '#f87171' : '#4ade80',
                                                                        color: isActive ? '#f87171' : '#4ade80',
                                                                        textTransform: 'none',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.75rem'
                                                                    }}
                                                                >
                                                                    {isActive ? 'Deactivate' : 'Activate'}
                                                                </Button>
                                                                <IconButton size="small" onClick={() => handleDeleteSchool(sch._id, sch.schoolName)} sx={{ color: '#ef4444' }}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Register Client School Modal */}
                <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}>
                    <DialogTitle sx={{ fontWeight: 800, bgcolor: '#312e81', color: 'white', py: 2 }}>
                        🏫 Register New Client School Account
                    </DialogTitle>
                    <form onSubmit={handleCreateSchool}>
                        <DialogContent sx={{ pt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth required label="School Name" placeholder="e.g. St. Xavier International Academy" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} InputLabelProps={{ sx: { color: '#94a3b8' } }} InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth required label="Principal / School Admin Name" placeholder="e.g. Dr. Rajesh Sharma" value={adminName} onChange={(e) => setAdminName(e.target.value)} InputLabelProps={{ sx: { color: '#94a3b8' } }} InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth required type="email" label="Admin Login Email" placeholder="admin@stxavier.edu" value={email} onChange={(e) => setEmail(e.target.value)} InputLabelProps={{ sx: { color: '#94a3b8' } }} InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth required type="password" label="Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} InputLabelProps={{ sx: { color: '#94a3b8' } }} InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Contact Phone" placeholder="+91 9876543210" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} InputLabelProps={{ sx: { color: '#94a3b8' } }} InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth multiline rows={2} label="School Address" value={address} onChange={(e) => setAddress(e.target.value)} InputLabelProps={{ sx: { color: '#94a3b8' } }} InputProps={{ sx: { color: 'white', bgcolor: '#0f172a' } }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ borderColor: '#334155', my: 1 }} />
                                    <Typography variant="subtitle2" fontWeight={800} color="#fbbf24" sx={{ mb: 1 }}>
                                        ⚙️ Module Access Permissions (Checked = Enabled)
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#0f172a', border: '1px solid #334155', borderRadius: 2, maxHeight: 180, overflowY: 'auto' }}>
                                        <Grid container spacing={1}>
                                            {MODULE_LIST.map((mod) => (
                                                <Grid item xs={12} sm={6} md={4} key={mod.key}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={!!newSchoolModuleAccess[mod.key]}
                                                                onChange={(e) => setNewSchoolModuleAccess({ ...newSchoolModuleAccess, [mod.key]: e.target.checked })}
                                                                sx={{ color: '#6366f1', '&.Mui-checked': { color: '#38bdf8' } }}
                                                            />
                                                        }
                                                        label={<Typography variant="caption" color="white">{mod.label}</Typography>}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 2.5, bgcolor: '#0f172a' }}>
                            <Button onClick={() => setOpenAddModal(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
                            <Button type="submit" variant="contained" sx={{ bgcolor: '#4f46e5', fontWeight: 800 }}>Create Client Account</Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* FULL SCHOOL DETAILS & PASSWORD MODAL */}
                <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}>
                    <DialogTitle sx={{ fontWeight: 800, bgcolor: '#4338ca', color: 'white', py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <SchoolIcon sx={{ color: '#fbbf24' }} />
                            <Typography variant="h6" fontWeight={800}>Full School Details & Admin Password Record</Typography>
                        </Stack>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        {detailsLoading || !selectedSchoolData ? (
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                                <Skeleton height={40} sx={{ bgcolor: '#334155', mb: 2 }} />
                                <Skeleton height={120} sx={{ bgcolor: '#334155' }} />
                            </Box>
                        ) : (
                            <Stack spacing={3}>
                                {/* School Header Box */}
                                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0f172a', border: '1px solid #334155', borderRadius: 2.5, color: 'white' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={8}>
                                            <Typography variant="h5" fontWeight={800} color="#fbbf24">{selectedSchoolData.school?.schoolName}</Typography>
                                            <Typography variant="body2" color="#cbd5e1" sx={{ mt: 0.5 }}>Address: {selectedSchoolData.school?.address || 'N/A'}</Typography>
                                            <Typography variant="body2" color="#94a3b8">Contact Phone: {selectedSchoolData.school?.contactPhone || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={4} textAlign={{ sm: 'right' }}>
                                            <Chip
                                                label={selectedSchoolData.school?.status || 'Active'}
                                                sx={{
                                                    bgcolor: selectedSchoolData.school?.status === 'Active' ? '#166534' : '#991b1b',
                                                    color: selectedSchoolData.school?.status === 'Active' ? '#4ade80' : '#f87171',
                                                    fontWeight: 800,
                                                    fontSize: '0.9rem',
                                                    px: 1,
                                                    py: 2
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Live Counts Grid */}
                                <Typography variant="subtitle2" fontWeight={800} color="#94a3b8" letterSpacing="0.5px">
                                    LIVE SCHOOL RECORD STATS
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 2.5, textAlign: 'center' }}>
                                            <PersonIcon sx={{ fontSize: 32, color: '#818cf8', mb: 0.5 }} />
                                            <Typography variant="h4" fontWeight={800} color="#818cf8">{selectedSchoolData.studentCount}</Typography>
                                            <Typography variant="caption" fontWeight={700} color="#c7d2fe">Total Students</Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 2.5, textAlign: 'center' }}>
                                            <GroupIcon sx={{ fontSize: 32, color: '#4ade80', mb: 0.5 }} />
                                            <Typography variant="h4" fontWeight={800} color="#4ade80">{selectedSchoolData.teacherCount}</Typography>
                                            <Typography variant="caption" fontWeight={700} color="#bbf7d0">Total Teachers</Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 2.5, textAlign: 'center' }}>
                                            <BadgeIcon sx={{ fontSize: 32, color: '#fbbf24', mb: 0.5 }} />
                                            <Typography variant="h4" fontWeight={800} color="#fbbf24">{selectedSchoolData.staffCount}</Typography>
                                            <Typography variant="caption" fontWeight={700} color="#fef08a">HR & Support Staff</Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 2.5, textAlign: 'center' }}>
                                            <ClassIcon sx={{ fontSize: 32, color: '#c084fc', mb: 0.5 }} />
                                            <Typography variant="h4" fontWeight={800} color="#c084fc">{selectedSchoolData.classCount}</Typography>
                                            <Typography variant="caption" fontWeight={700} color="#e9d5ff">Total Classes</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {/* Admin Credentials Card */}
                                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0f172a', border: '1px solid #312e81', borderRadius: 2.5 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                        <KeyIcon sx={{ color: '#fbbf24' }} />
                                        <Typography variant="subtitle1" fontWeight={800} color="white">
                                            Admin Login Credentials & Secret Password
                                        </Typography>
                                    </Stack>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="#94a3b8" fontWeight={700}>SCHOOL ADMIN NAME</Typography>
                                            <Typography variant="body1" fontWeight={700} color="white">{selectedSchoolData.school?.name}</Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" color="#94a3b8" fontWeight={700}>ADMIN LOGIN EMAIL</Typography>
                                            <Typography variant="body1" fontWeight={700} color="#60a5fa">{selectedSchoolData.school?.email}</Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#1e293b', border: '1px solid #4338ca', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="caption" color="#94a3b8" fontWeight={700} display="block">ADMIN LOGIN PASSWORD</Typography>
                                                    <Typography variant="h6" fontWeight={800} color="#fbbf24" letterSpacing="1px">
                                                        {showPassword ? selectedSchoolData.school?.rawPassword : '••••••••••••'}
                                                    </Typography>
                                                </Box>

                                                <Stack direction="row" spacing={1}>
                                                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ color: '#fbbf24' }}>
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => copyToClipboard(selectedSchoolData.school?.rawPassword)} sx={{ color: '#818cf8' }}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Stack>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, bgcolor: '#0f172a' }}>
                        <Button onClick={() => setOpenDetailsModal(false)} variant="contained" sx={{ bgcolor: '#4338ca', fontWeight: 800 }}>Close Details</Button>
                    </DialogActions>
                </Dialog>

                {/* EDIT MODULE ACCESS PERMISSIONS MODAL */}
                <Dialog open={openAccessModal} onClose={() => setOpenAccessModal(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}>
                    <DialogTitle sx={{ fontWeight: 800, bgcolor: '#0284c7', color: 'white', py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TuneIcon sx={{ color: '#fbbf24' }} />
                            <Typography variant="h6" fontWeight={800}>
                                Edit Module Access • {selectedSchoolForAccess?.schoolName}
                            </Typography>
                        </Stack>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="body2" color="#cbd5e1">
                                Toggle module permissions for this school account. Disabled modules will be hidden from their sidebar.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Button size="small" variant="outlined" onClick={() => {
                                    const allOn = {};
                                    MODULE_LIST.forEach(m => allOn[m.key] = true);
                                    setEditingModuleAccess(allOn);
                                }} sx={{ color: '#4ade80', borderColor: '#4ade80', fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}>
                                    Enable All
                                </Button>
                                <Button size="small" variant="outlined" onClick={() => {
                                    const allOff = {};
                                    MODULE_LIST.forEach(m => allOff[m.key] = false);
                                    setEditingModuleAccess(allOff);
                                }} sx={{ color: '#f87171', borderColor: '#f87171', fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}>
                                    Disable All
                                </Button>
                            </Stack>
                        </Box>

                        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0f172a', border: '1px solid #334155', borderRadius: 2.5 }}>
                            <Grid container spacing={2}>
                                {MODULE_LIST.map((mod) => {
                                    const isChecked = !!editingModuleAccess[mod.key];
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={mod.key}>
                                            <Paper
                                                elevation={0}
                                                onClick={() => setEditingModuleAccess(prev => ({ ...prev, [mod.key]: !prev[mod.key] }))}
                                                sx={{
                                                    p: 1.5,
                                                    bgcolor: isChecked ? 'rgba(14, 165, 233, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                                                    border: isChecked ? '1px solid #0284c7' : '1px solid #334155',
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { bgcolor: isChecked ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.05)' }
                                                }}
                                            >
                                                <Box sx={{ flexGrow: 1, pr: 1 }}>
                                                    <Typography variant="body2" fontWeight={700} color={isChecked ? 'white' : '#64748b'}>
                                                        {mod.label}
                                                    </Typography>
                                                </Box>
                                                <Switch
                                                    size="small"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setEditingModuleAccess(prev => ({ ...prev, [mod.key]: e.target.checked }));
                                                    }}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#38bdf8' },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#0284c7' }
                                                    }}
                                                />
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Paper>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, bgcolor: '#0f172a' }}>
                        <Button onClick={() => setOpenAccessModal(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
                        <Button onClick={handleSaveModuleAccess} disabled={accessSaving} variant="contained" sx={{ bgcolor: '#0284c7', fontWeight: 800 }}>
                            {accessSaving ? 'Saving Permissions...' : 'Save Module Access'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default SuperAdminDashboard;
